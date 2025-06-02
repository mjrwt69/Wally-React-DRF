from django.contrib import admin
from .models import Post, Like  # Import your models

# Optional: Customize how posts appear in the admin
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'created_at', 'like_count_display')
    search_fields = ('title', 'author__username')
    list_filter = ('created_at',)

    def like_count_display(self, obj):
        return obj.likes.count()
    like_count_display.short_description = 'Likes'

# Register models with admin site
admin.site.register(Post, PostAdmin)
admin.site.register(Like)
