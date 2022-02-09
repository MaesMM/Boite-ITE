from dataclasses import field
from rest_framework import serializers
from .models import *

class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Building
        fields = ['uuid', 'name']

class RoomSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Room
        fields = ['uuid', 'building', 'name', 'color', 'collect_frequency']