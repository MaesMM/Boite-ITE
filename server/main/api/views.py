from msilib.schema import ServiceInstall
from django.shortcuts import render
from rest_framework import viewsets

from .serializers import *
from .models import *

# Create your views here.
class BuildingViewSet(viewsets.ModelViewSet):
    queryset = Building.objects.all().order_by('name')
    serializer_class = BuildingSerializer

class RoomsViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all().order_by('building')
    serializer_class = RoomSerializer
