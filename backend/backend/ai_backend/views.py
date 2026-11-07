from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "message": "AI Interview Backend Running Successfully"
    })