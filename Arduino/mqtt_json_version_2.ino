#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h> //version5
#include <Adafruit_BMP085.h>
#include "MQ135.h"
#include "DHT.h"


const char *SSID = "devolo-085";
const char *PWD = "XKGLYWERTGQWNUDI";
long last_time = 0;

//sensors
#define DHTPIN 14    
#define DHTTYPE DHT11 
DHT dht(DHTPIN, DHTTYPE);

int temp = 0;
int qfe = 0;
Adafruit_BMP085 bmp;
const int mq135Pin = 12;
MQ135 gasSensor = MQ135(mq135Pin);



void connectToWiFi() {
  Serial.print("Connectiog to ");

  WiFi.begin(SSID, PWD);
  Serial.println(SSID);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.print("Connected.");
}

// MQTT client
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient); 
char *mqttServer = "192.168.57.28";
int mqttPort = 1883;
char *topic="/bonjour";
void setupMQTT() {
  mqttClient.setServer(mqttServer, mqttPort);
  // set the callback function
  mqttClient.setCallback(callback);
}

void setup() {
  Serial.begin(9600);
  connectToWiFi();
  setupMQTT();
}

void reconnect() {
  Serial.println("Connecting to MQTT Broker...");
  while (!mqttClient.connected()) {
      Serial.println("Reconnecting to MQTT Broker..");
      String clientId = "ESP32Client-";
      clientId += String(random(0xffff), HEX);
      
      if (mqttClient.connect(clientId.c_str(),"adiboite", "boiteITE")) {
        Serial.println("Connected.");
        // subscribe to topic
        mqttClient.subscribe("/bonjour");
        
        
      } 
  }
}

void loop() {
      //_____________________sensors______________________________________
    //float temp1 = bmp.readTemperature();
    //float temp2 = dht.readTemperature();
    //float temp = (temp1+temp2)/2;
    //qfe = bmp.readPressure() / 100;
    //float ppm = gasSensor.getPPM();
    //float hum = dht.readHumidity();
    
    //Serial.print(temp); Serial.println("  °C ");
    //Serial.print(qfe); Serial.println("  hPa ");
    //Serial.println(ppm);Serial.print(" ppm");

    StaticJsonBuffer<300> JSONbuffer;
    JsonObject& JSONencoder = JSONbuffer.createObject();
    //construction des entrées du parcer JSON
    JSONencoder["device"] = "BoiteITE";
    JSONencoder["Temperature"] = "temp";
    JSONencoder["Pression"] = "qfe";
    JSONencoder["Quantité de CO2"] = "ppm";
    JSONencoder["Humidité"] ="hum";
    char JSONmessageBuffer[100];
    JSONencoder.printTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    
  if (!mqttClient.connected())
    reconnect();
  mqttClient.loop();
  long now = millis();
  if (now - last_time > 6000) {

    
    
    mqttClient.publish(topic, JSONmessageBuffer);
    last_time = now;
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Callback - ");
  Serial.print("Message:");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
}
