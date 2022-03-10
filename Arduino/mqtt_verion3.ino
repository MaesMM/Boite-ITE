#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h> //version6
#include <Adafruit_BMP085.h>
#include "MQ135.h"
#include "DHT.h"
#include <Adafruit_TSL2561_U.h>


const int Led = 15;
const char *SSID = "YNCREA_LAB";
const char *PWD = "813nV3nue@";
unsigned long last_time = 0;
long randNumber;
//sensors
#define DHTPIN 14
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
#define MaxPin 19

const int BATTERYPIN = 34; //pin de la batterie

const float TensionMin = 2.1; //tension min
const float TensionMax = 2.8; //tension max

Adafruit_BMP085 bmp;
const int mq135Pin = 12;
MQ135 gasSensor = MQ135(mq135Pin);
Adafruit_TSL2561_Unified tsl = Adafruit_TSL2561_Unified(TSL2561_ADDR_FLOAT, 12345);



float ledtime = millis();
void connectToWiFi() {
  Serial.print("Connectiog to ");
  WiFi.begin(SSID, PWD);
  Serial.println(SSID);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }


  digitalWrite(Led, HIGH);

  Serial.print("Connected.");
}



WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
char *mqttServer = "10.224.3.230";
int mqttPort = 1883;
char *topic = "/bonjour";

void setupMQTT() {
  mqttClient.setServer(mqttServer, mqttPort);
  mqttClient.setCallback(callback);
}




void setup() {
  Serial.begin(9600);
  dht.begin();
  tsl.enableAutoRange(true);
  tsl.setIntegrationTime(TSL2561_INTEGRATIONTIME_13MS);
  float rzero = gasSensor.getRZero();
  connectToWiFi();
  setupMQTT();
}




void reconnect() {
  Serial.println("Connecting to MQTT Broker...");
  while (!mqttClient.connected()) {
    Serial.println("Reconnectiog to MQTT Broker..");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    if (mqttClient.connect(clientId.c_str(), "adiboite", "boiteITE")) {
      Serial.println("Connected to mqtt.");
      mqttClient.subscribe("/bonjour");
    }
  }
}



int getBattery () {
  float b = analogRead(BATTERYPIN);
  int minValue = (4096 * TensionMin) / 3.3;
  int maxValue = (4096 * TensionMax) / 3.3;
  b = ((b - minValue) / (maxValue - minValue)) * 100;
  if (b > 100)
    b = 100;
  else if (b < 0)
    b = 0;
  int valeur = b;
  return b;
}




float pression() {
  if (!bmp.begin()) {
    float temp = 0;
    int qfe = 0;
    Serial.print(temp); Serial.println("  °C ");
    Serial.print(qfe); Serial.println("  hPa ");
    return qfe;
  } else {
    float temp = bmp.readTemperature();
    int qfe = bmp.readPressure() / 100;
    Serial.print(temp); Serial.println("  °C ");
    Serial.print(qfe); Serial.println("  hPa ");
    return qfe;
  }

}




float max_read_noise()
{
  unsigned long t0 = millis();
  unsigned long dt = 500; // ms
  int max = 0;
  int min = 1023;
  int val;
  while (millis() - t0 < dt)
  {
    val = analogRead(MaxPin);
    if (val < 1025)
    {
      if (val > max)
      {
        max = val;
      }
      else if (val < min)
      {
        min = val;
      }
    }
  }
  int peakToPeak = max - min;
  float v = peakToPeak / (float)pow(2, 10) * 3.3;
  int db = map(1000 * v, 2200, 2510, 65, 95);
  Serial.println("dB = " + String(db) + "dB");
  return db;
}




float co2() {
  long now = millis();
  float ppm = 1.0;
  if (now <= 10000) {
    ppm = gasSensor.getRZero();
    return ppm;
  }
  else {
    ppm = gasSensor.getPPM();
    return ppm;
  }

}





void loop() {
  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();
  if (millis() - last_time > 6000) {
    last_time = millis();

    StaticJsonDocument<512> payl;

    //_____________________sensors______________________________________
    float temp2 = dht.readTemperature();
    float qfe = pression();   
    float micro =  max_read_noise() ;
    float ppm = co2();
    float hum = dht.readHumidity();
    sensors_event_t event;
    tsl.getEvent(&event);
    int lux = event.light;
    float battery = getBattery();


    // __________________error handling ______________
    bool error;

    if (String(temp2) == "nan") {
      payl["errors"]["temperature"] = "sensor disfunction";
      error = true;
      String temp2 = "nan";
    }
    if (String(hum) == "nan") {
      payl["errors"]["humidity"] = "sensor disfunction";
      error = true;
      String hum = "nan";
    }
    if (!event.light  || event.light == 65536 ) {
      payl["errors"]["light"] = "sensor disfunction";
      String lux = "nan";
      error = true;
    }
    if (ppm == 0) {
      payl["errors"]["CO2"] = "sensor disfunction";
      error = true;
      String ppm = "nan";
    }
    if (micro < 0) {
      payl["errors"]["audio"] = "sensor disfunction";
      String micro = "nan";
    }

    if (battery < 1) {
      payl["errors"]["battery"] = "can't get battery %";
    }


    //String json = "{\"mac\":\"" + WiFi.macAddress() + "\",.\"battery\":0.0,\"errors\":\"" + error + "\", \"sensors\":{ \"temperature\":" + String(temp2) + ",\"humidité\":" + String(hum) + ",\"pression\":" + String((int)qfe) + ",\"luminosite\":" + String(lux) + " \"CO2\":" + String(ppm) + ",}""}";

    String message;
    payl["mac"] = WiFi.macAddress();
    payl["battery"] = 51;
    payl["sampling"] = error;
    payl["sensor"]["temperature"] = temp2;
    payl["sensor"]["humidité"] = String(hum);
    payl["sensor"]["pression"] = String((int)qfe);
    payl["sensor"]["CO2"] = String(ppm);
    payl["sensor"]["luminosité"] = String(lux);
    payl["sensor"]["sonore"] = String(son);


    serializeJson(payl, message);
    if (mqttClient.publish(topic, message.c_str())) {
      Serial.println("camarche");
    }

  }
}




void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Callback - ");
  Serial.print("mqtt Message:");

  for (int i = 0; i < length; i++) {
    char   payloadjson = (char)payload[i];
    Serial.print(payloadjson);
  }
}
