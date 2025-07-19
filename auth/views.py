from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token # Import the Token model
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, LoginSerializer

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration.
    Allows creation of new user accounts and issues an authentication token.
    """
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate or retrieve a token for the newly registered user
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            },
            "token": token.key, # Return the token key
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    """
    API endpoint for user login.
    Authenticates user and returns an authentication token.
    """
    permission_classes = (AllowAny,) # Allow unauthenticated users to log in

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.user # Get the authenticated user from the serializer

        # Get or create a token for the authenticated user
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username,
            },
            "token": token.key, # Return the token key
        }, status=status.HTTP_200_OK)
