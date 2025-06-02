from rest_framework import generics, permissions
from .models import Post
from rest_framework import viewsets, filters
from .serializers import PostSerializer
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Post, Like
from rest_framework import status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.decorators import action
from django.db.models import Q

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        elif self.action == 'like':
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]  # or default: IsAuthenticatedOrReadOnly

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        user = request.user if request.user.is_authenticated else None
        ip = request.META.get('REMOTE_ADDR')

        like = Like.objects.filter(
            Q(user=user) if user else Q(ip_address=ip),
            post=post
        ).first()

        if like:
            like.delete()
            liked = False
        else:
            Like.objects.create(post=post, user=user, ip_address=None if user else ip)
            liked = True

        return Response({
            'liked': liked,
            'like_count': post.likes.count()
        })
    
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        password2 = request.data.get('password2')

        if not username or not password or not password2:
            return Response({'error': 'Please fill all fields'}, status=status.HTTP_400_BAD_REQUEST)
        if password != password2:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)


class ToggleLikeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)

        like, created = Like.objects.get_or_create(user=request.user, post=post)

        if not created:
            like.delete()
            liked = False
        else:
            liked = True

        like_count = post.likes.count()  # Adjust related name if needed

        return Response({
            'liked': liked,
            'like_count': like_count
        }, status=status.HTTP_200_OK)

class MyPostsAPIView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(author=self.request.user).order_by('-created_at')