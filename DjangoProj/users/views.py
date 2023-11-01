from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from django.contrib import auth
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
import json

@method_decorator(csrf_protect, name='dispatch')
class Register(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = json.loads(request.body.decode('utf-8'))
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
                        User.objects.create_user(username=username, email=email, password=password1)
                        return Response({ 'success': 'User created successfully' })
            else:
                return Response({ 'error': 'Passwords do not match' })
        except:
                return Response({ 'error': 'Something went wrong when registering account' })

@method_decorator(csrf_protect, name='dispatch')
class Login(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = json.loads(request.body.decode('utf-8'))
        username = data['username']
        password = data['password']

        try:
            user = auth.authenticate(username=username, password=password)

            if user is not None:
                auth.login(request, user)
                return Response({ 'success': 'User authenticated' })
            else:
                return Response({ 'error': 'Error Authenticating' })
        except:
            return Response({ 'error': 'Something went wrong when logging in' })

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    pass
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response(status=status.HTTP_200_OK)
    
def profile(request):
    pass
'''

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import *

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Your account has been created {username}!')
            return redirect('login')
    else:  
        form = UserRegisterForm()
    return render(request, 'users/register.html', {'form': form})

@login_required
def profile(request):
    if request.method == 'POST':
        user_form = UserUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            username = user_form.cleaned_data.get('username')
            messages.success(request, f'Your account has been updated {username}!')
            return redirect('profile')
    else:  
        user_form = UserUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=request.user.profile)
    
    context = {
        'user_form' : user_form,
        'profile_form' : profile_form
    }

    return render(request, 'users/profile.html', context)
'''