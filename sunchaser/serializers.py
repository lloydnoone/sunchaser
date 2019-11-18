from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Journey, Comment
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username')

class CommentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Comment
        fields = ('id', 'text', 'owner', 'journey')

class PopulatedCommentSerializer(CommentSerializer):

    owner = UserSerializer()

class JourneySerializer(serializers.ModelSerializer):

    class Meta:
        model = Journey
        fields = ('id', 'start', 'end', 'comments', 'users')#'owner',
        extra_kwargs = {'comments': {'required': False}, 'users': {'required': False}}

class PopulatedJourneySerializer(JourneySerializer):

    users = UserSerializer(many=True)
    comments = PopulatedCommentSerializer(many=True)

    # def update(self, journey, data):
    #     users_data = data.pop('users')
    #     comments_data = data.pop('comments')

    #     journey.name = data.get('start')
    #     journey.end = data.get('end')

    #     users = [User.objects.get(**user_data) for user_data in users_data]

    #     journey.save()
    #     journey.users.set(users)
    #     return journey
