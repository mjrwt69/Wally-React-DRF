from django.apps import AppConfig

class ApiConfig(AppConfig):  # Use your app's actual class name here
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        import api.signals # Import your signals module here
