from rest_framework import serializers
from .models import *
from users.models import *
from django.contrib.auth.models import User

class UserWithoutProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserWithoutProfileSerializer()
    following = serializers.SerializerMethodField()
    followers = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['user', 'image', 'following', 'followers']

    def get_following(self, obj):
        following = obj.following.all()
        return UserWithoutProfileSerializer(following, many=True).data
    
    def get_followers(self, obj):
        followers = obj.user.followers.all()
        return ProfileSerializer(followers, many=True).data


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']