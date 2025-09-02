from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.cache import never_cache
import os

@never_cache
def service_worker(request):
    sw_path = os.path.join(os.path.dirname(__file__), 'static', 'pwa', 'sw.js')
    with open(sw_path, 'r') as f:
        sw_content = f.read()
    return HttpResponse(sw_content, content_type='application/javascript')