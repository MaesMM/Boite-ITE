from datetime import datetime
from uuid import uuid4
from django.db import models

# Create your models here.
# class UserProfile(models.Model):
#     uuid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

#     firstName = models.CharField(max_length=32)
#     lastName = models.CharField(max_length=32)
#     email = models.CharField(max_length=254)
#     password = models.TextField()

#     refresh_token = models.TextField(null=True)

#     def __str__(self):
#          return "%s %s" % (self.firstName, self.lastName)


class Building(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    #user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    name = models.CharField(max_length=32, unique=True, error_messages={
                            'unique': 'this field already exists'})

    def __str__(self):
        return self.name


class Room(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    building = models.ForeignKey(
        Building, related_name='rooms', on_delete=models.CASCADE)
    name = models.CharField(max_length=32, unique=True)

    color = models.CharField(max_length=16)
    collect_frequency = models.IntegerField(default=300)

    def __str__(self):
        return self.name


class Box(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)
    room = models.ForeignKey(Room, related_name='boxes',
                             null=True, on_delete=models.CASCADE)

    name = models.CharField(max_length=32, null=True)
    battery = models.IntegerField(default=0)
    sampling = models.BooleanField(default=True)
    last_ping = models.DateTimeField(default=datetime.now, null=True)
    next_ping = models.DateTimeField(default=datetime.now, null=True)
    mac = models.CharField(max_length=32)

    def __str__(self):
        return "%s - %s" % (self.room.name, self.mac)


class DataType(models.Model):
    name = models.CharField(max_length=32)
    display_name = models.CharField(max_length=32)
    unit = models.CharField(max_length=16)

    def __str__(self):
        return self.name


class Data(models.Model):
    data_type = models.ForeignKey(DataType, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    value = models.CharField(max_length=32)
    isError = models.BooleanField(default=False)
    timeStamp = models.DateField(default=datetime.now)

    def __str__(self):
        return "%s - %s %s" % (self.data_type.display_name, self.value, self.data_type.unit)
