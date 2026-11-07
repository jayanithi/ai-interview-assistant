from django.db import models

class User(models.Model):

    phone = models.CharField(max_length=15, unique=True)

    otp = models.CharField(max_length=6)

    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.phone