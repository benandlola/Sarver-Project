from django.urls import path
from .views import *

urlpatterns = [
    path('', PostListView.as_view(), name='blog'),
    path('like/', Like.as_view(), name='like'),
    path('bookmark/', Bookmark.as_view(), name='bookmark'),
    path('<str:username>/', UserPostListView.as_view(), name='user-posts'),
    path('post/<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('post/create/', PostCreateView.as_view(), name='post-create'),
    path('post/<int:pk>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('post/<int:pk>/edit/', PostEditView.as_view(), name='post-edit'),
    path('post/<int:pk>/comment/', CommentCreateView.as_view(), name='comment-create'),
    path('post/<int:pk>/comment/<int:ck>/delete/', CommentDeleteView.as_view(), name='comment-delete'),
    path('post/<int:pk>/comment/<int:ck>/edit/', CommentEditView.as_view(), name='comment-edit'),
    path('post/<int:pk>/comment/<int:ck>/', CommentDetailView.as_view(), name='comment-detail'),
]