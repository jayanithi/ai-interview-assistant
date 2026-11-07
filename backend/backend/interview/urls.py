from django.urls import path
from .views import *
from django.urls import path
from .views import OllamaGenerateView
urlpatterns = [
    path("start/", StartInterviewView.as_view()),
    path("questions/", InterviewQuestionsView.as_view()),
    path("submit-answer/", SubmitAnswerView.as_view()),
    path("dashboard/", DashboardView.as_view()),
    path("ollama-generate/", OllamaGenerateView.as_view()),
    path("dashboard/", DashboardView.as_view())   # Duplicate
]
