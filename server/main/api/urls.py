from django.urls import include, path
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
# router.register(r'buildings', views.BuildingViewSet)
# router.register(r'rooms', views.RoomsViewSet)
# router.register(r'boxes', views.BoxViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    #! -- BOXES ---

    path("boxes/", views.boxList, name='box_list'),
    path("boxes/new/", views.newBoxList, name='new_box_list'),
    path("boxes/assigned/", views.boxAssignedList, name='box_assigned_list'),
    path("boxes/not-assigned/", views.notAssignedBoxList,
         name='not_assigned_box_list'),
    path("box/create/", views.boxCreate, name='box_create'),
    path("box/<str:uuid>/", views.boxDetail, name='box_detail'),
    path("box/update/<str:uuid>/", views.boxUpdate, name='box_update'),
    path("box/assign/<str:uuid>/", views.boxAssign, name='box_assign'),

    #! -- BUILDINGS ---

    path("buildings/", views.buildingList, name='building_list'),
    path("building/create/", views.buildingCreate, name='building_create'),
    path("building/<str:uuid>/", views.buildingDetail, name='building_detail'),
    path("building/update/<str:uuid>/",
         views.buildingUpdate, name='building_update'),

    #! -- ROOMS ---

    path("rooms/", views.roomList, name='room_list'),
    path("room/create/", views.roomCreate, name='room_create'),
    path("room/<str:uuid>/", views.roomDetail, name='room_detail'),
    path("room/update/<str:uuid>/",
         views.roomUpdate, name='room_update'),

    #! -- DATA TYPES --

    path("data-type/create/", views.dataTypeCreate, name="data_type_create"),
    path("data-type/all/", views.dataTypeAll, name="data_type_all"),
    path("data-type/<str:name>/", views.dataTypeDetails, name="data_type_get"),
    path("data-type/update/<str:name>/",
         views.dataTypeUpdate, name="data_type_update"),
    path("data-type/delete/<str:name>/",
         views.dataTypeDelete, name="data_type_delete"),

    #! -- DATA --

    path("data/create/", views.dataCreate, name="data_create"),
    path("data/get/<str:box_uuid>/latest/",
         views.dataGetLatest, name="data_get_latest"),
    path("data/get/<str:box_uuid>/today/",
         views.dataGetToday, name="data_get_today")
]
