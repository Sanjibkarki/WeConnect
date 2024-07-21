from rest_framework import serializers
from .models import (
    User  
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','date','password']
        extra_kwargs = {'password': {'write_only': True, 'required': True}}

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.email
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)
        return data