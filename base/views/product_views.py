from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Product, Review
from base.serializers import ProductSerializer


# Get all products
@api_view(['GET'])
def get_products(request):

    # Get the query params for search
    query = request.query_params.get('keyword')

    # If there is no query set it to empty string
    if query == None:
        query = ''

    # Get all products that have the query value in their name
    products = Product.objects.filter(name__icontains=query)

    # Get the page Number from url
    page = request.query_params.get('page')

    # Create paginator
    paginator = Paginator(products, 4)

    # Get the products from the curent page number, except errors
    try:
        products = paginator.page(page)

    except PageNotAnInteger:
        products = paginator.page(1)

    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    if page == None:
        page = 1

    # Make sure page is an integer
    page = int(page)

    # Serialize products data
    serializer = ProductSerializer(products, many=True)

    return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})


# Get top products
@api_view(['GET'])
def get_top_products(request):

    # Get 0 to 5 products that have rating greater or equal to 4, in descending order
    products = Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]

    # Serialize products data
    serializer = ProductSerializer(products, many=True)

    return Response(serializer.data)


# Get single product
@api_view(['GET'])
def get_product(request, pk):

    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)


# Admin - delete product
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, pk):

    productDelete = Product.objects.get(_id=pk)
    productDelete.delete()

    return Response('Product successfully deleted')


# Admin - create product
@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):

    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Name',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )

    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)


# Admin - update product
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_product(request, pk):

    data = request.data
    product = Product.objects.get(_id=pk)

    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']

    product.save()

    serializer = ProductSerializer(product, many=False)

    return Response(serializer.data)


# Upload product image
@api_view(['POST'])
def upload_image(request):

    data = request.data

    product_id = data['product_id']
    product = Product.objects.get(_id=product_id)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image uploaded successfully')


# Create review for the specific product
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_product_review(request, pk):

    # Get user, product and data
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # Check if user already sent a review and choosed a rating
    alreadyExists = product.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail': 'Product already reviewd'}

        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}

        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    else:
        # Create review and update the product rating
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        product.rating = total / len(reviews)
        product.save()

        return Response('Review added')
