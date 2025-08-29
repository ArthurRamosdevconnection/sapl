# -*- coding: utf-8 -*-
"""sapl URL Configuration"""

from django.conf import settings
from django.conf.urls import include, url
from django.conf.urls.static import static
from django.contrib import admin
from django.views.generic import RedirectView, TemplateView
from django.views.static import serve as view_static_server

import sapl.api.urls
import sapl.audiencia.urls
import sapl.base.urls
import sapl.comissoes.urls
import sapl.compilacao.urls
import sapl.lexml.urls
import sapl.materia.urls
import sapl.norma.urls
import sapl.painel.urls
import sapl.parlamentares.urls
import sapl.protocoloadm.urls
import sapl.redireciona_urls.urls
import sapl.relatorios.urls
import sapl.sessao.urls

urlpatterns = [
    # 1) PWA NA RAIZ, ANTES DE TUDO
    url(r'^', include('pwa.urls')),

    # 2) Home e admin
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='sapl_index'),
    url(r'^message$', TemplateView.as_view(template_name='base.html')),
    # Se seu Django for 1.9+ use admin.site.urls; em 1.8 também funciona.
    url(r'^admin/', admin.site.urls),

    # 3) Demais apps do SAPL
    url(r'', include(sapl.comissoes.urls)),
    url(r'', include(sapl.sessao.urls)),
    url(r'', include(sapl.parlamentares.urls)),
    url(r'', include(sapl.materia.urls)),
    url(r'', include(sapl.norma.urls)),
    url(r'', include(sapl.lexml.urls)),
    url(r'', include(sapl.painel.urls)),
    url(r'', include(sapl.protocoloadm.urls)),
    url(r'', include(sapl.compilacao.urls)),
    url(r'', include(sapl.relatorios.urls)),
    url(r'', include(sapl.audiencia.urls)),

    # must come at the end
    #   so that base /sistema/ url doesn't capture its children
    url(r'', include(sapl.base.urls)),

    url(r'', include(sapl.api.urls)),

    url(r'^favicon\.ico$', RedirectView.as_view(
        url='/static/sapl/img/favicon.ico', permanent=True)),

    url(r'', include(sapl.redireciona_urls.urls)),
]

# DEBUG-only helpers
if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [url(r'^__debug__/', include(debug_toolbar.urls))]
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += [
        url(r'^media/(?P<path>.*)$', view_static_server, {
            'document_root': settings.MEDIA_ROOT,
        }),
    ]
