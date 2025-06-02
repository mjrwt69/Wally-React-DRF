from .models import Post, Like
from rest_framework import serializers

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'image', 'created_at', 'like_count', 'is_liked']

    def get_like_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get('request')
        user = request.user if request else None

        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()

        # Check for anonymous like via IP address
        ip = request.META.get('REMOTE_ADDR') if request else None
        if ip:
            return obj.likes.filter(ip_address=ip).exists()

        return False



