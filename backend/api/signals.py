import os
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Post

@receiver(post_delete, sender=Post)
def delete_post_image(sender, instance, **kwargs):
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)
