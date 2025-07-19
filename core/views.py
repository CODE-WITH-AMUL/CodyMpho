from django.http import HttpResponse
from django.shortcuts import render
from django.views.generic import View
from .models import *



class indexview(View):
    def get(self , request):
        return render(request , 'index.html')