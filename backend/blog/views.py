from rest_framework.views import APIView
from .models import Post
from .serializers import PostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response

class PostListView(APIView):
    def get(self, request, format=None):
        queryset = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(queryset, many=True)

        return Response(serializer.data)

class UserPostListView(APIView):
    def get(self, request, username, format=None):
        username = self.kwargs.get('username')
        queryset = Post.objects.filter(author__username=username).order_by('-created_at')
        serializer = PostSerializer(queryset, many=True)

        return Response(serializer.data)

class PostDetailView(APIView):
    def get(self, request, pk, format=None):
        post = Post.objects.get(pk=pk)
        serializer = PostSerializer(post)

        return Response(serializer.data)

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