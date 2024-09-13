# # myapp/middleware.py
# import datetime
# import pytz
# from django.conf import settings
# from django.contrib.auth import logout
# from rest_framework_simplejwt.tokens import RefreshToken

# class TokenExpiryMiddleware:
#     def __init__(self, get_response):
#         self.get_response = get_response

#     def __call__(self, request):
#         if request.path in ['/api/token/', '/api/token/refresh/']:
#             return self.get_response(request)
        
#         user = request.user
#         refresh_token_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
#         current_time = datetime.now()
#         future_time = current_time + refresh_token_lifetime
        
#         if user.is_authenticated:    
#             if future_time < request.session['refresh-time']:
#                 logout(request)
#                 request.session.flush()
                
#         response = self.get_response(request)
#         return response
#         response = JsonResponse({'detail': 'Token has expired'}, status=401)
#                     return response
