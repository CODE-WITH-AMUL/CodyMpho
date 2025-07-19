# mimolearn-backend/auth/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate # For login validation

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Handles creation of new users with email/username, password, and confirm_password.
    """
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]
    )
    password2 = serializers.CharField(write_only=True, required=True) # For password confirmation

    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2')
        extra_kwargs = {
            'username': {'required': False} # Make username optional if email is primary
        }

    def validate(self, attrs):
        """
        Custom validation to check if passwords match.
        """
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        """
        Create and return a new `User` instance, given the validated data.
        """
        # Use email as username if username is not provided, or if your User model
        # uses email as the unique identifier. Adjust based on your User model.
        username = validated_data.get('username')
        if not username:
            username = validated_data['email'] # Fallback to email if username is empty

        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login.
    Takes email/username and password, authenticates, and returns user data.
    """
    email = serializers.CharField(required=False) # Allow login by email or username
    username = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        username = attrs.get('username')
        password = attrs.get('password')

        if not (email or username):
            raise serializers.ValidationError("Must provide either email or username.")

        user = None
        if email:
            try:
                # Assuming email is unique or you want to find by email
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                pass # User not found by email, try username if provided

        if not user and username:
            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                pass # User not found by username

        if user and user.check_password(password):
            self.user = user # Store user for later access in view
        else:
            raise serializers.ValidationError("Invalid credentials.")

        return attrs