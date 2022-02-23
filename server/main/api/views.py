
from rest_framework import viewsets
from rest_framework.decorators import api_view

from rest_framework.response import Response

# from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin
from .serializers import *
from .models import *

# Create your views here.


#! --- BOXES ---

@api_view(["GET"])
def boxList(request):
    boxes = Box.objects.all()
    serializer = BoxSerializer(boxes, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def newBoxList(request):
    boxes = Box.objects.filter(name__isnull=True, room__isnull=True)
    serializer = BoxSerializer(boxes, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def boxDetail(request, uuid):
    boxes = Box.objects.get(uuid=uuid)
    serializer = BoxSerializer(boxes, many=False)

    return Response(serializer.data)


@api_view(["POST"])
def boxCreate(request):
    serializer = BoxSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PATCH"])
def boxUpdate(request, uuid):

    box = Box.objects.get(uuid=uuid)

    serializer = BoxSerializer(instance=box, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)


#! --- BUILDINGS ---

@api_view(["GET"])
def buildingList(request):
    buildings = Building.objects.all()

    serializer = BuildingSerializer(
        buildings, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def buildingDetail(request, uuid):
    buildings = Building.objects.get(uuid=uuid)

    serializer = BuildingSerializer(
        buildings, many=False)

    return Response(serializer.data)


@api_view(["POST"])
def buildingCreate(request):

    serializer = BuildingSerializer(
        data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PATCH"])
def buildingUpdate(request, uuid):

    building = building.objects.get(uuid=uuid)

    serializer = BuildingSerializer(
        instance=building, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)


#! --- BUILDINGS ---

@api_view(["GET"])
def roomList(request):
    rooms = Room.objects.all()
    serializer = RoomSerializer(
        rooms, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def roomDetail(request, uuid):
    rooms = Room.objects.get(uuid=uuid)

    serializer = RoomSerializer(
        rooms, many=False)

    return Response(serializer.data)


@api_view(["POST"])
def roomCreate(request):

    serializer = RoomSerializer(
        data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@api_view(["PATCH"])
def roomUpdate(request, uuid):

    room = room.objects.get(uuid=uuid)

    serializer = RoomSerializer(
        instance=room, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)


# class ConfigureBoxView(GenericAPIView, UpdateModelMixin):
#     '''
#     Book update API, need to submit both `name` and `author_name` fields
#     At the same time, or django will prevent to do update for field missing
#     '''
#     queryset = Box.objects.all()
#     serializer_class = BoxSerializer

#     def put(self, request, *args, **kwargs):

#         data = request.data
#         box = self.get_queryset().filter(uuid=data["uuid"])
#         return box.partial_update(data)


# class BuildingViewSet(viewsets.ModelViewSet):
#     queryset = Building.objects.all().order_by('name')
#     serializer_class = BuildingSerializer


# class RoomsViewSet(viewsets.ModelViewSet):
#     queryset = Room.objects.all().order_by('building')
#     serializer_class = RoomSerializer


# class BoxViewSet(viewsets.ModelViewSet):
#     serializer_class = BoxSerializer
#     queryset = Box.objects.all().order_by("name")

#     @action(
#         methods=["get"],
#         detail=False,
#         url_path="new",
#         url_name="new"
#     )
#     def get_new_boxes(self, request, *args, **kwargs):
#         queryset = self.get_queryset().filter(name__isnull=True, room__isnull=True)
#         queryset = self.filter_queryset(queryset)
#         serializer = BoxSerializer(
#             queryset, many=True, context=self.get_serializer_context())
#         return Response(serializer.data)

#     @action(
#         methods=["get"],
#         detail=False,
#         url_path="not-assigned",
#         url_name="not-assigned",

#     )
#     def get_not_assigned_boxes(self, request, *args, **kwargs):
#         queryset = self.get_queryset().filter(
#             room__isnull=True, name__isnull=False)
#         queryset = self.filter_queryset(queryset)
#         serializer = BoxSerializer(
#             queryset, many=True, context=self.get_serializer_context())
#         return Response(serializer.data)

#     @action(
#         methods=["put"],
#         detail=False,
#         url_path="configure",
#         url_name="configure",

#     )
#     def configure_box(self, request, *args, **kwargs):
#         data = request.data
#         box = self.get_queryset().filter(uuid=data["uuid"])
#         print(box)
#         # box.mac = data["name"]
#         # box.save()
