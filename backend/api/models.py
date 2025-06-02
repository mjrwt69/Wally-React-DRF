from django.db import models
from django.contrib.auth.models import User
from django.db.models import Q

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    def like_count(self):
        return self.likes.count()


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'post'],
                name='unique_user_like',
                condition=Q(user__isnull=False)
            ),
            models.UniqueConstraint(
                fields=['ip_address', 'post'],
                name='unique_ip_like',
                condition=Q(ip_address__isnull=False)
            )
        ]
