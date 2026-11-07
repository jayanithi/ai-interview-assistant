from django.db import models   

class AnswerAnalytics(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    score = models.IntegerField()
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.question