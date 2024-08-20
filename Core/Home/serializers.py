from rest_framework import serializers
from .models import (
    User,CollegePortal
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import datetime
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','date','password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CollegePortal
        fields = ['host','students','email_students']
        
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.email
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        data['name'] = self.user.email
        refresh_token_lifetime = settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']
        current_time = datetime.utcnow()  
        future_time = current_time + refresh_token_lifetime
        data['token_expiry'] = future_time.isoformat()
        return data