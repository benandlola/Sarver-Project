from django.urls import path
from .views import *

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),
    path('is_authenticated/', isAuthenticated.as_view(), name='is_authenticated'),
    path('get_user/', getUser.as_view(), name='get_user'),
    path('profile/update/', profileUpdate.as_view(), name='profile_update'),
]
