from django.shortcuts import render

def markets(request):
    return render(request, 'trading/markets.html', {'title':'Markets'})