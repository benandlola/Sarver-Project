from rest_framework.views import APIView
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

class PostListView(APIView):
    def get(self, request, format=None):
        posts = Post.objects.all().order_by('-created_at')
        serialized_data = []
        for post in posts:
            post_serializer = PostSerializer(post)
            comments = Comment.objects.filter(post=post)
            comments_serializer = CommentSerializer(comments, many=True)
            post_data = post_serializer.data
            post_data['comments'] = comments_serializer.data
            serialized_data.append(post_data)
        return Response(serialized_data)

class UserPostListView(APIView):
    def get(self, request, username, format=None):
        username = self.kwargs.get('username')
        posts = Post.objects.filter(author__username=username).order_by('-created_at')
        serialized_data = []
        for post in posts:
            post_serializer = PostSerializer(post)
            comments = Comment.objects.filter(post=post)
            comments_serializer = CommentSerializer(comments, many=True)
            post_data = post_serializer.data
            post_data['comments'] = comments_serializer.data
            serialized_data.append(post_data)

        return Response(serialized_data)

class PostDetailView(APIView):
    def get(self, request, pk, format=None):
        post = Post.objects.get(pk=pk)
        post_serializer = PostSerializer(post)
        comments = Comment.objects.filter(post=post).order_by('-created_at')
        comments_serializer = CommentSerializer(comments, many=True)
        post_data = post_serializer.data
        post_data['comments'] = comments_serializer.data
        return Response(post_data)

class PostCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, format=None):         
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        
        return Response(serializer.data)

class PostDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, format=None):
        post = Post.objects.get(pk=pk)
        post.delete()

        return Response(status=204)

class PostEditView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]

    def post(self, request, pk, format=None):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(instance=post,data=request.data)
        if serializer.is_valid():
            serializer.save(author=self.request.user, edited=True)
        
        return Response(serializer.data)
    
class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk, format=None):         
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=self.request.user)

        return Response(serializer.data)
    
class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk, ck, format=None):
        comment = Comment.objects.get(pk=ck)
        comment.delete()

        return Response(status=204)

class CommentEditView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk, ck, format=None):
        comment = Comment.objects.get(pk=ck)
        serializer = CommentSerializer(instance=comment,data=request.data)

        if serializer.is_valid():
            serializer.save(author=self.request.user, edited=True)
        return Response(serializer.data)