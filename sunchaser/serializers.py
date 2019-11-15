from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Journey, Comment
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'profile_image')

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'text', 'owner', 'journey')

class PopulatedCommentSerializer(CommentSerializer):

    owner = UserSerializer()

class JourneySerializer(serializers.ModelSerializer):

    class Meta:
        model = Journey
        fields = ('id', 'start', 'end', 'owner', 'comments')
        extra_kwargs = {'comments': {'required': False}}

class PopulatedJourneySerializer(JourneySerializer):

    owner = UserSerializer()
    comments = PopulatedCommentSerializer(many=True)
