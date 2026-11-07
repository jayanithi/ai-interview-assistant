from django.db import models
from django.contrib.auth.models import User


class Resume(models.Model):
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class InterviewResult(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    score = models.IntegerField(default=0)

    technical_score = models.IntegerField(default=0)

    communication_score = models.IntegerField(default=0)

    confidence_score = models.IntegerField(default=0)

    feedback = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.score}"