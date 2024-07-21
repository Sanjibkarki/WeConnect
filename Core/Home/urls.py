from django.urls import path
from .views import Index,MyTokenObtainPairView,GetAuthUserView


urlpatterns = [
    path('',Index.as_view(),name="index"),
    path('token', GetAuthUserView.as_view(), name='token_obtain_pair'),
    # path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]