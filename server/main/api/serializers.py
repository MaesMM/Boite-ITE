from dataclasses import field
from rest_framework import serializers
from .models import *

class RoomSerializer(serializers.HyperlinkedModelSerializer):

    building = serializers.PrimaryKeyRelatedField(queryset=Building.objects.all(), source='building.uuid')

    class Meta:
        model = Room
        fields = ['uuid', 'url', 'building', 'name', 'color', 'collect_frequency']
        # depth = 1

    def create(self, validated_data):
        subject = Room.objects.create(building=validated_data['building']['uuid'], name=validated_data['name'], color=validated_data['color'], collect_frequency=validated_data['collect_frequency'])
        return subject

class BuildingSerializer(serializers.HyperlinkedModelSerializer):
    rooms = RoomSerializer(many=True, required=False)
    
    class Meta:
        model = Building
        fields = ['uuid', 'url', 'name', 'rooms']