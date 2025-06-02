from django.urls import path, include
# from .views import PostListCreateView
from rest_framework.routers import DefaultRouter
from .views import RegisterView , PostViewSet
from .views import ToggleLikeAPIView
from .views import MyPostsAPIView


router = DefaultRouter()
router.register('posts', PostViewSet)

urlpatterns = [
    # path('posts/', PostListCreateView.as_view(), name='post-list-create'),
    path('posts/mine/', MyPostsAPIView.as_view(), name='my-posts'),
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
    path('posts/<int:pk>/like/', ToggleLikeAPIView.as_view(), name='post-like'),
    
]
