from rest_framework import serializers
from .models import *
from users.serializers import *

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    created_at = serializers.SerializerMethodField()

    def get_created_at(self, obj):
        if obj.edited == True:
            return obj.created_at.strftime("%B %d, %Y, %I:%M %p") + ' (edited)'
        return obj.created_at.strftime("%B %d, %Y, %I:%M %p")

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ['author'] 


class CommentSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    created_at = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()


    def get_created_at(self, obj):
        if obj.edited == True:
            return obj.created_at.strftime("%B %d, %Y, %I:%M %p") + ' (edited)'
        return obj.created_at.strftime("%B %d, %Y, %I:%M %p")

    def get_replies(self, comment):
        replies = Comment.objects.filter(parent=comment).order_by('-created_at')
        return CommentSerializer(replies, many=True).data
    
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ['author'] 