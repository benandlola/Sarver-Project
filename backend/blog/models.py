from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from PIL import Image

class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    edited = models.BooleanField(default=False)
    image = models.ImageField(null=True, upload_to='blog_pics', blank=True)

    def __str__(self):
        return self.title
    
class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    author = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    edited = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.author.username} - {self.post.title}'