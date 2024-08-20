from django.db import models
from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)


# Create your models here.
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None):
        if not email:
            raise ValueError("Email address is required.")

        if not username:
            raise ValueError("Username is required.")
        user = self.model(email=self.normalize_email(email), username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password=password)
        user.is_admin = True
        user.is_superuser = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(primary_key=True)
    username = models.CharField(max_length=200,unique=True)
    date = models.DateField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    objects = UserManager()

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_admin

class CollegePortal(models.Model):
    host = models.ForeignKey(User,on_delete=models.CASCADE)
    students = models.JSONField(default=list)
    email_students = models.JSONField(default=list)
    
    