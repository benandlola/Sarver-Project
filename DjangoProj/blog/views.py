from django.shortcuts import render

posts = [
    {
        'author': 'Benny',
        'title': 'Blog Post 1',
        'content': 'First post content',
        'date_posted': 'October 19, 2023'
    },
    {
        'author': 'Jane Doe',
        'title': 'Blog Post 2',
        'content': 'Second post content',
        'date_posted': 'October 20, 2023'
    }
]

def home(request):
    context = {
        'posts' : posts
    }
    return render(request, 'blog/home.html', context)

def about(request):
    return render(request, 'blog/about.html', {'title':'About'})