from gc import collect
from types import BuiltinFunctionType
from uuid import uuid4
from django.db import models

# Create your models here.
class Building(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    #user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    name = models.CharField(max_length=32)

    def __str__(self):
        return self.name

class Room(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    building = models.ForeignKey(Building, on_delete=models.CASCADE)
    name = models.CharField(max_length=32)

    color = models.CharField(max_length=16)
    collect_frequency = models.IntegerField(default=300)