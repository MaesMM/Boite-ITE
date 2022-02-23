
from rest_framework import serializers
from .models import *


class BoxSerializer(serializers.ModelSerializer):

    class Meta:
        model = Box
        fields = "__all__"


class RoomSerializer(serializers.ModelSerializer):
    boxes = BoxSerializer(many=True, required=False)

    building = serializers.PrimaryKeyRelatedField(
        queryset=Building.objects.all(), source='building.uuid')

    class Meta:
        model = Room
        fields = ['uuid', 'building',
                  'name', 'color', "boxes", 'collect_frequency']
        # depth = 1

    def create(self, validated_data):
        subject = Room.objects.create(
            building=validated_data['building']['uuid'], name=validated_data['name'], color=validated_data['color'])

        return subject


class BuildingSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, required=False)

    class Meta:
        model = Building
        fields = ['uuid', 'name', 'rooms']
