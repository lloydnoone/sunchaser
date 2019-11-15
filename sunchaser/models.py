from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.

class Journey(models.Model):
    start = models.CharField(max_length=100)
    end = models.CharField(max_length=100)
    owner = models.ForeignKey(
        User,
        related_name='journeys',
        default='owner account deleted. ',
        on_delete=models.DO_NOTHING
    )

    def __str__(self):
        return f'Post {self.id} - {self.owner}'

class Comment(models.Model):
    text = models.CharField(max_length=300)
    owner = models.ForeignKey(
        User,
        related_name='comments',
        on_delete=models.CASCADE,
    )
    journey = models.ForeignKey(
        Journey,
        related_name='comments',
        on_delete=models.CASCADE,
        blank=True,
        null=True
    )

    def __str__(self):
        return f'{self.text} - {self.owner}'
