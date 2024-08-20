from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MyTokenObtainPairSerializer,CollegeSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import authenticate,login
from .models import User,CollegePortal
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from datetime import datetime
from django.conf import settings
import json


class Index(APIView):
    
    def get(self, request):
        pass    
   
class GetAuthUserView(APIView):
    authentication_classes = [JWTAuthentication]
    
    def get(self, request):
        user = request.user
        token_expiry_str = request.session.get('token-expiry')
        
        if token_expiry_str:
            token_expiry = datetime.fromisoformat(token_expiry_str)
            
            remaining_time = token_expiry - datetime.now()
            
            user_data = {
                'email': user.email,
                'token-time': remaining_time
            }
        else:
            user_data = {
                'email': user.email,
            }
        
        return Response({'user': user_data})

    def post(self, request):
        data = json.loads(request.body)
        names = data['students']
        domain = "@gmail.com"
        existing_usernames = []

        for username in names:
            new_username = f"{username}{domain}"
            if new_username not in existing_usernames:
                existing_usernames.append(new_username)
            else:
                counter = 1
                while True:
                    new_username = f"{username}{counter}{domain}"
                    if new_username not in existing_usernames:
                        existing_usernames.append(new_username)
                        break
                    counter += 1

        data['email_students'] = existing_usernames
        serializer = CollegeSerializer(data=data)
        try:
            serializer.is_valid(raise_exception=True)
            serializer.save()
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'data': 'successfully uploaded'})
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if email == "" or password == "":
            return Response({'error': 'Please provide both email and password'},status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request,email=email, password=password)
        refresh_token_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        
        current_time = datetime.utcnow() 
        future_time = current_time + refresh_token_lifetime
        
        request.session['token_expiry'] = future_time.isoformat()
        if not user:
            return Response({'error': 'Invalid Credentials'},status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data   
        print(data)
        request.session['refresh'] = data['refresh']
        return Response(data)

class studentsportal(APIView):
    def post(self,request):
        print(request.body)
        return Response({'happen':"do this"})