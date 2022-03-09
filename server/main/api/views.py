
from rest_framework import status
from rest_framework.decorators import api_view

from rest_framework.response import Response

# from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin
from .serializers import *
from .models import *


import socket
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
def boxAssignedList(request):
    boxes = Box.objects.filter(name__isnull=False, room__isnull=False)
    serializer = BoxSerializer(boxes, many=True)

    return Response(serializer.data)


@api_view(["GET"])
def notAssignedBoxList(request):
    boxes = Box.objects.filter(name__isnull=False, room_id__isnull=True)
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


@api_view(["POST"])
def boxAssign(request, uuid):

    data = request.data

    box = Box.objects.get(uuid=uuid)

    if (data["room"]):
        room = Room.objects.get(uuid=data["room"])
        box.room_id = room.uuid

    serializer = BoxSerializer(instance=box, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)


@api_view(["GET"])
def boxUnpair(request, uuid):

    try:
        box = Box.objects.get(uuid=uuid)

        dataToPass = {"room": None, "name": None}
        serializer = BoxSerializer(
            instance=box, data=dataToPass, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)

    except:
        return Response("No box")


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


@api_view(["DELETE"])
def buildingDelete(request, uuid):

    try:
        building = Building.objects.get(uuid=uuid)
        rooms = Room.objects.filter(building=uuid)
    except:
        return Response("Une erreur est survenue", status=status.HTTP_400_BAD_REQUEST)

    try:
        for room in rooms:
            boxes = Box.objects.filter(room=room)
            for box in boxes:
                dataToPass = {"room": None, "name": None}
                serializer = BoxSerializer(
                    instance=box, data=dataToPass, partial=True)

                if serializer.is_valid():
                    serializer.save()

        building.delete()
        return Response("Batiment supprimé avec succès")

    except:
        return Response("Une erreur est survenue", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#! --- ROOMS ---

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

    roomData = request.data.copy()

    if "boxes" in roomData:
        del roomData["boxes"]

    serializer = RoomSerializer(
        data=roomData)

    if serializer.is_valid():
        serializer.save()

        try:
            data = request.data

            if data["boxes"]:
                for box_uuid in data["boxes"]:
                    box = Box.objects.get(uuid=box_uuid)

                    box.room_id = serializer.data["uuid"]
                    box.save()
        except:
            pass

    return Response(serializer.data)


@api_view(["PATCH"])
def roomUpdate(request, uuid):

    room = Room.objects.get(uuid=uuid)

    serializer = RoomSerializer(
        instance=room, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)


@api_view(["DELETE"])
def roomDelete(request, uuid):

    try:
        room = Room.objects.get(uuid=uuid)
    except:
        return Response("Une erreur est survenue", status=status.HTTP_400_BAD_REQUEST)

    try:

        boxes = Box.objects.filter(room=room)
        for box in boxes:
            dataToPass = {"room": None, "name": None}
            serializer = BoxSerializer(
                instance=box, data=dataToPass, partial=True)

            if serializer.is_valid():
                serializer.save()

        room.delete()
        return Response("Pièce supprimée avec succès")

    except:
        return Response("Une erreur est survenue", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#! -- DATA TYPES --


@ api_view(["POST"])
def dataTypeCreate(request):

    serializer = DataTypeSerializer(
        data=request.data)

    if serializer.is_valid():
        serializer.save()

    return Response(serializer.data)


@ api_view(["GET"])
def dataTypeAll(request):

    dataTypes = DataType.objects.all()

    serializer = DataTypeSerializer(
        dataTypes, many=True)
    return Response(serializer.data)


@ api_view(["GET"])
def dataTypeDetails(request, name):

    dataType = DataType.objects.get(name=name)

    serializer = DataTypeSerializer(
        dataType, many=False)
    return Response(serializer.data)


@ api_view(["PATCH"])
def dataTypeUpdate(request, name):
    dataType = DataType.objects.get(name=name)

    serializer = DataTypeSerializer(
        instance=dataType, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)


@ api_view(["DELETE"])
def dataTypeDelete(request, name):
    dataType = DataType.objects.get(name=name)
    dataType.delete()
    return Response(request.data)


#! -- DATA --


@ api_view(["POST"])
def dataCreate(request):

    data = request.data

    box = Box.objects.get(mac=data["mac"])

    if "battery" in data:

        try:
            dataType = DataType.objects.get(name="battery")

            dataToPass = {"box": box.uuid, "data_type": dataType.id,
                          "value": data["battery"], "isError": False}
            serializer = DataSerializer(
                data=dataToPass)

            if serializer.is_valid():
                serializer.save()

            dataToPass = {"battery": data["battery"]}
            serializer = BoxSerializer(
                instance=box, data=dataToPass, partial=True)

            if serializer.is_valid():
                serializer.save()
        except:
            pass

    for sample in data["sensors_data"].items():
        sampleType = sample[0]
        sampleValue = sample[1]

        try:

            dataType = DataType.objects.get(name=sampleType)

            dataToPass = {"box": box.uuid, "data_type": dataType.id,
                          "value": sampleValue, "isError": False}

            serializer = DataSerializer(
                data=dataToPass)

            if serializer.is_valid():
                serializer.save()

        except:
            pass

    for error in data["errors"].items():
        erroType = error[0]
        errorValue = error[1]

        try:
            dataType = DataType.objects.get(name=erroType)

            dataToPass = {"box": box.uuid, "data_type": dataType.id,
                          "value": errorValue, "isError": True}

            serializer = DataSerializer(
                data=dataToPass)

            if serializer.is_valid():
                serializer.save()
        except:
            pass

    return Response(data)


@ api_view(["GET"])
def dataGetToday(request, box_uuid):

    today = datetime.today().date()

    data = Data.objects.filter(
        box=box_uuid, isError=False, created_at__contains=today)
    serializer = DataSerializer(
        data, many=True)
    return Response(serializer.data)


@ api_view(["GET"])
def dataGetLatest(request, box_uuid):

    today = datetime.today().date()

    dataTypes = DataType.objects.all()

    dataToPass = []

    for dataType in dataTypes:
        if Data.objects.filter(
                box=box_uuid, isError=False, created_at__contains=today, data_type=dataType.id).exists():
            data = Data.objects.filter(
                box=box_uuid, isError=False, created_at__contains=today, data_type=dataType.id).latest('created_at')
            dataToPass.append(data)

    serializer = DataSerializer(
        dataToPass, many=True)
    return Response(serializer.data)


@api_view(["GET"])
def dataTotalToday(request):

    today = datetime.today().date()

    dataTypes = DataType.objects.all()

    dataTypesSerialized = DataTypeSerializer(
        dataTypes, many=True)

    data = Data.objects.filter(
        created_at__contains=today)

    dataSerialized = DataSerializer(
        data, many=True)

    count = len(dataSerialized.data)

    return Response(count)


@api_view(["GET"])
def getIpAddress(request):
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    return Response(ip_address)
