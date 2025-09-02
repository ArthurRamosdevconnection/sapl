from django.apps import AppConfig
import os

class PwaConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "pwa"
    path = os.path.dirname(__file__)  # força o Django a usar este diretório