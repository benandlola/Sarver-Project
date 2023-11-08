from rest_framework import serializers
from .models import *
from users.serializers import *

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    created_at = serializers.SerializerMethodField()

    def get_created_at(self, obj):
        return obj.created_at.strftime("%B %d, %Y, %I:%M %p")

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'created_at', 'author']
        read_only_fields = ['author'] 