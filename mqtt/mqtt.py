"""
Test code
"""

import json
import paho.mqtt.client as mqtt
import time
import numpy


import requests

# The callback for when the client receives a CONNACK response from the server.


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    # client.subscribe("$SYS/#")

# The callback for when a PUBLISH message is received from the server.


def on_message(client, userdata, msg):

    if (msg.topic == "/notamment"):
        formated = json.loads(msg.payload)
        # print('formated data : ', formated)

    if (msg.topic == "/data"):

        url = 'http://127.0.0.1:8000/data/create/'
        data = msg.payload

        dataJSON = json.loads(data)

        try:
            x = requests.post(url, data={"data": data})
        except:
            pass

        client.publish(
            topic="/sleep", payload="{'mac':" + str(dataJSON['mac']) + "}")

    if (msg.topic == "/update"):

        url = 'http://localhost:8000/boxes/intervals/'
        data = msg.payload

        try:

            res = requests.get(url)
            client.publish(topic="/config", payload=res.text)

        except:
            pass

    if (msg.topic == "/register"):

        url = 'http://localhost:8000/box/create/'
        data = msg.payload
        try:
            x = requests.post(url, data={"data": data})
        except:
            pass


client = mqtt.Client("tomate")
client.on_connect = on_connect
client.on_message = on_message

client.username_pw_set("adiboite", password="boiteITE")
# client.connect("10.224.3.230", 1883, 60)
client.connect("10.224.3.230", 1883)
client.subscribe("/bonjour", 0)
client.subscribe("/data", 0)
client.subscribe("/update", 0)
client.subscribe("/register", 0)
client.loop_start()


# client.publish(topic="/notamment", payload="""{
# "mac":"69:69:69",
# "battery":12,
# "sampling": true,

# "errors":{
#   "volume":"Sensor not found",
# 	"gas": "Sensor not found"
# },

# "sensors_data":{
#   "temperature":22,
#   "humidity":45,
# 	"luminosity": 16
#   }
# }""")


# Blocking call that processes network traffic, dispatches callbacks and
# handles reconnecting.
# Other loop*() functions are available that give a threaded interface and a
# manual interface.
# while client.loop() == 0:
#     pass

while True:

    time.sleep(5)
