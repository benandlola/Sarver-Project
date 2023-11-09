from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.response import Response
from django.contrib import auth
from .serializers import *
from django.contrib.auth import logout
from .models import *
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import os

class Register(APIView):
    def post(self, request, format=None):
        data = request.data
        username = data['username']
        email = data['email']
        password1 = data['password1']
        password2 = data['password2']

        try:
            if password1 == password2:
                if User.objects.filter(username=username).exists():
                    return Response({ 'error': 'Username already exists' })
                else:
                    if len(password1) < 8:
                        return Response({ 'error': 'Password must be at least 8 characters' })
                    else:
                        new_user = User.objects.create_user(username=username, email=email, password=password1)
                        Profile.objects.create(user=new_user)
                        return Response({ 'success': 'User created successfully' })
            else:
                return Response({ 'error': 'Passwords do not match' })
        except:
                return Response({ 'error': 'Something went wrong when registering account' })

#TODO add better ressponses 
class Login(APIView):
    def post(self, request, format=None):
        data = request.data
        username = data['username']
        password = data['password']

        try:
            user = auth.authenticate(username=username, password=password)
            if user:
                auth.login(request, user)
                return Response({ 'success': 'User authenticated' })
            else:
                return Response({ 'error': 'Error Authenticating' })
        except:
            return Response({ 'error': 'Something went wrong when logging in' })
        
class Logout(APIView):
    def post(self, request, format=None):
        try: 
            logout(request)
            return Response({ 'success': 'User logged out' })
        except:
            return Response({ 'error': 'Something went wrong when logging out' })
        
class isAuthenticated(APIView):

    def get(self, request, format=None):
        if request.user.is_authenticated:
            return Response({'authenticated': True})
        else:
            return Response({'authenticated': False})
        
class getUser(APIView):
    
    def get(self, request, format=None):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data})
    
class profileUpdate(APIView):
    
    def post(self, request, format=None):
        user = request.user
        profile = Profile.objects.get(user=user)
        user_instance = User.objects.get(pk=user.id)

        data = request.data
        image = data.get('image', profile.image)
        username = data.get('username', user.username)
        email = data.get('email', user.email)

        # Update user data
        user_instance.username = username
        user_instance.email = email
        user_instance.save()

        # Update profile data
        image_path = os.path.join(settings.MEDIA_ROOT, 'profile_pics')

        if 'image' in request.FILES:
            uploaded_file = request.FILES['image']
            file_path = os.path.join(image_path, uploaded_file.name)
            try:
                file_path = default_storage.save(file_path + uploaded_file.name, ContentFile(uploaded_file.read()))
                image = file_path
            except: 
                return Response({'error': 'Something went wrong when uploading image'})
        else:
            return Response({'success': True})

        profile.image = image
        profile.save()
        return Response({'success': True})
