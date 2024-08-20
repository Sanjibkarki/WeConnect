from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import Index,MyTokenObtainPairView,GetAuthUserView


urlpatterns = [
    path('',Index.as_view(),name="index"),
    path('user', GetAuthUserView.as_view()), 
    path('token', MyTokenObtainPairView.as_view()),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    # path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]