from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status

from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer
from datetime import datetime


# Add the order to database
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order_items(request):

    # Get user data and items data from the post request
    user = request.user
    data = request.data
    orderItems = data['orderItems']

    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)

    else:
        # Create order
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
        )

        # Create shipping address
        shipping = ShippingAddress.objects.create(
            order=order,
            address=data['shippingAddress']['address'],
            city=data['shippingAddress']['city'],
            postalCode=data['shippingAddress']['postalCode'],
            country=data['shippingAddress']['country'],
        )

        # Create order items and set order to product relationship
        for i in orderItems:
            product = Product.objects.get(_id=i['product'])

            item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=i['qty'],
                price=i['price'],
                image=product.image.url,
            )

            # Update stock
            product.countInStock -= item.qty

    serializer = OrderSerializer(order, many=False)

    return Response(serializer.data)


# Get user orders
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_my_orders(request):

    user = request.user

    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)


# Get the specific requested order
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order_by_id(request, pk):

    user = request.user

    order = Order.objects.get(_id=pk)

    try:
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)

            return Response(serializer.data)

        else:
            return Response({'detail': 'Not authorized to view this order'},
                            status=status.HTTP_400_BAD_REQUEST)

    except:
        return Response({'detail': 'Order does not exist'},
                        status=status.HTTP_400_BAD_REQUEST)


# Update order to paid
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_order_to_paid(request, pk):

    order = Order.objects.get(_id=pk)

    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response('Order was paid')


# Admin - get all orders
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders(request):

    orders = Order.objects.all()

    serializer = OrderSerializer(orders, many=True)

    return Response(serializer.data)


# Admin - update order to delivered
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_order_to_delivered(request, pk):

    order = Order.objects.get(_id=pk)

    order.isDelivered = True
    order.deliveredAt = datetime.now()
    order.save()

    return Response('Order was delivered')
