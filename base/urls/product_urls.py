from django.urls import path
from base.views import product_views as views


urlpatterns = [
    # Get all products
    path('', views.get_products, name='products'),

    # Admin Create product
    path('create/', views.create_product, name='create-product'),

    # Admin upload image
    path('upload/', views.upload_image, name='upload-image'),

    # Create review
    path('<str:pk>/reviews/', views.create_product_review, name='create-review'),

    # Get top products
    path('top/', views.get_top_products, name='top-products'),

    # Get single product
    path('<str:pk>/', views.get_product, name='product'),

    # Admin delete product
    path('delete/<str:pk>/', views.delete_product, name='delete-product'),

    # Admin update product
    path('update/<str:pk>/', views.update_product, name='update-product'),
]
