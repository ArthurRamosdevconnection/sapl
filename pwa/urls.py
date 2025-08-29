from django.conf.urls import url
from django.views.generic import TemplateView
from django.http import HttpResponse
import os

def service_worker_js(request):
    # Lê o arquivo service-worker.js como texto puro
    sw_path = os.path.join(os.path.dirname(__file__), 'templates', 'service-worker.js')
    try:
        with open(sw_path, 'r') as f:
            content = f.read()
        return HttpResponse(content, content_type='application/javascript')
    except FileNotFoundError:
        return HttpResponse('console.error("Service worker não encontrado");',
                            content_type='application/javascript')

urlpatterns = [
    url(r'^manifest\.json$', TemplateView.as_view(
        template_name='manifest.json',
        content_type='application/json')),
    url(r'^service-worker\.js$', service_worker_js, name='service_worker'),
]