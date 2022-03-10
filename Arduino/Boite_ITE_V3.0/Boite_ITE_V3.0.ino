// Libraries
#include <DNSServer.h>
#include <WiFi.h>
#include <AsyncTCP.h>
#include "ESPAsyncWebServer.h"

#include <PubSubClient.h>
#include <ArduinoJson.h>

#include <Preferences.h>
Preferences preferences;
// Values stored and accessible in preferences
// server_name, server_pass, rpi_name, rpi_pass, rpi_ip, rpi_port
// sample_frequency

#include "start.h"
#include "form.h"
#include "loading.h"
#include "rpiserver.h"

// Web server config
DNSServer dnsServer;
AsyncWebServer server(80);



// ESP32 eep sleep config
#define uS_TO_S_FACTOR 1000000 * 1000  /* Conversion factor for micro seconds to seconds */
#define TIME_TO_SLEEP  5        /* Time ESP32 will go to sleep (in seconds) */
bool canSleep = false;

/*
  Method to print the reason by which ESP32
  has been awaken from sleep
*/
void print_wakeup_reason() {
  esp_sleep_wakeup_cause_t wakeup_reason;

  wakeup_reason = esp_sleep_get_wakeup_cause();

  switch (wakeup_reason)
  {
    case ESP_SLEEP_WAKEUP_EXT0 : Serial.println("Wakeup caused by external signal using RTC_IO"); break;
    case ESP_SLEEP_WAKEUP_EXT1 : Serial.println("Wakeup caused by external signal using RTC_CNTL"); break;
    case ESP_SLEEP_WAKEUP_TIMER : Serial.println("Wakeup caused by timer"); break;
    case ESP_SLEEP_WAKEUP_TOUCHPAD : Serial.println("Wakeup caused by touchpad"); break;
    case ESP_SLEEP_WAKEUP_ULP : Serial.println("Wakeup caused by ULP program"); break;
    default : Serial.printf("Wakeup was not caused by deep sleep: %d\n", wakeup_reason); break;
  }
}



// Variables
int n;
unsigned long last_reco_try = millis();
bool removeDups = true;
bool sortRSSI = true;
bool isConnected = false;
bool isRaspberry = false;

unsigned long last_sampling = millis();
int frequency = 1234;
int ledPin = 23;
bool pinStatus = false;



// Captive Portal Handler
class CaptiveRequestHandler : public AsyncWebHandler {
  public:
    CaptiveRequestHandler() {}
    virtual ~CaptiveRequestHandler() {}

    bool canHandle(AsyncWebServerRequest *request) {
      //request->addInterestingHeader("ANY");
      return true;
    }

    void handleRequest(AsyncWebServerRequest *request) {
      request->send_P(200, "text/html", startPage);
    }
};


// Populates the networks list and remove duplicated SSIDs
String wifiLister() {
  String page = formPage;

  if (n == 0) {
    Serial.println("no networks found");
  } else {
    Serial.print(n);
    Serial.println(" networks found");

    // filter networks
    // sort by RSSI
    int o = n;
    int loops = 0;

    String ssid;

    int indices[n];
    int skip[n];

    for (int i = 0; i < n; i++) {
      indices[i] = i;
    }

    if (removeDups || sortRSSI) {
      for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
          if (WiFi.RSSI(indices[j]) > WiFi.RSSI(indices[i])) {
            loops++;
            std::swap(indices[i], indices[j]);
            std::swap(skip[i], skip[j]);
          }
        }
      }
    }

    if (removeDups) {
      for (int i = 0; i < n; i++) {
        if (indices[i] == -1) {
          --o;
          continue;
        }
        ssid = WiFi.SSID(indices[i]);
        for (int j = i + 1; j < n; j++) {
          loops++;
          if (ssid == WiFi.SSID(indices[j])) {
            indices[j] = -1;
          }
        }
      }
    }


    // Display newtorks on the page
    for (int i = 0; i < n; i++) {
      if (indices[i] == -1) {
        continue;
      }

      page += R"=====(
      <div class="network-container">
                <input
                  class="network-input"
                  type="radio"
                  id=")=====";
      page += indices[i];
      page += R"=====("
                  name="ssid"
                  value=")=====";
      page += WiFi.SSID(indices[i]);
      page += R"=====("/>
                <label class="network" for=")=====";
      page += indices[i];
      page += R"=====(">
                  <span class="network-name">)=====";
      page += WiFi.SSID(indices[i]);
      page += R"=====(</span>
                  <div class="network-power">
                    <div class="firstBar on"></div>
                    <div class="secondBar on"></div>
                    <div class="thirdBar"></div>
                  </div>
                </label>
              </div>
          )=====";

      delay(10);
    }

    page += formPage2;
    return page; // Return the web page to be displayed
  }
}



// Webserver endpoint setup
void setupServer() {
  server.on("/", HTTP_GET, [](AsyncWebServerRequest * request) {
    Serial.println("Accessing the index page...");
    request->send_P(200, "text/html", startPage);
  });

  server.on("/form", HTTP_GET, [](AsyncWebServerRequest * request) {
    Serial.println("Accessing the form ...");
    if (!isConnected) { // If the ESP wasn't able to connect to WiFI
      Serial.println("Not connected to a server !");
      String page = wifiLister();
      request->send_P(200, "text/html", page.c_str());
    } else if (!isRaspberry) { // If the ESP wasn't able to connect to MQTT
      Serial.println("Already connected to server");
      request->redirect("/rasp");
    } else { // Setup is complete
      Serial.println("Already connected to server and raspberry !");
      request->send_P(200, "text/html", "Setup complete !");
    }
  });

  server.on("/rasp", HTTP_GET, [](AsyncWebServerRequest * request) {
    Serial.println("Accessing the rpi page...");
    request->send_P(200, "text/html", rpiPage);
  });

  server.on("/get", HTTP_GET, [](AsyncWebServerRequest * request) {
    Serial.println("Handling data :");
    request->send_P(200, "text/html", loadingPage);

    preferences.begin("my-app", false);

    if (request->hasParam("ssid")) {
      String value = request->getParam("ssid")->value();
      preferences.putString("server_name", value);
    } else {
      Serial.println("ssid not specified or not found");
    }

    if (request->hasParam("password")) {
      String value = request->getParam("password")->value();
      preferences.putString("server_pass", value);
    } else {
      Serial.println("password not specified or not found");
    }

    if (request->hasParam("ip")) {
      String value = request->getParam("ip")->value();
      preferences.putString("rpi_ip", value);
    } else {
      Serial.println("ip not specified or not found");
    }

    if (request->hasParam("port")) {
      String value = request->getParam("port")->value();
      preferences.putString("rpi_port", value);
    } else {
      Serial.println("port not specified or not found");
    }

    Serial.println("Current config : ");
    Serial.println(preferences.getString("server_name", "name1"));
    Serial.println(preferences.getString("server_pass", "pass1"));
    Serial.println(preferences.getString("rpi_ip", "ip1"));
    Serial.println(preferences.getString("rpi_port", "port1"));

    preferences.end();
    ESP.restart();
  });
}



//MQTT client setup
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    //Serial.print((char)payload[i]);
    message += (char)payload[i];
  }
  Serial.println(message);
  Serial.println(topic);

  StaticJsonDocument<256> pJson; //Memory pool
  deserializeJson(pJson, message);

  // Get the box config from the server
  if (String(topic) == "/config") {
    Serial.println("Message Received !");
    bool isDestination = false;
    int msgSize = pJson.size();

    if (msgSize <= 0) {
      Serial.println("No destination specified");
      return;
    }

    int selected;
    for (int i = 0; i < msgSize; i++) {
      String newMac = pJson[i]["mac"].as<String>();
      if (newMac == WiFi.macAddress()) {
        selected = i;
        isDestination = true;
      }
    }

    Serial.println("Is destination : " + isDestination);

    if (isDestination) { // If the box's MAC equals the one in the message
      preferences.begin("my-app", false);

      String sample_freq = pJson[selected]["interval"];

      if (sample_freq) {
        Serial.println("Sample freq : " + sample_freq);
        preferences.putString("sample_frequency", sample_freq);
        frequency = sample_freq.toInt();
      }

      preferences.end();
    }
  }

  // Test function to force the box to enter deepsleep
  if (String(topic) == "/sleep") {
    Serial.println("Sleep order");
    String mac = pJson["mac"].as<String>();
    Serial.println(pJson["mac"].as<String>());
    Serial.println(WiFi.macAddress());
    bool isDestination = mac == WiFi.macAddress();
    Serial.println(isDestination);

    if (isDestination) {
      Serial.println("Sleeping");
      canSleep = true;
    }
  }
}




void setup() {
  Serial.begin(115200);
  Serial.println();

  // Pull the preferences variables
  preferences.begin("my-app", true);
  String server_name = preferences.getString("server_name", "name1");
  String server_pass = preferences.getString("server_pass", "pass1");
  String rpi_ip = preferences.getString("rpi_ip", "ip1");
  String rpi_port = preferences.getString("rpi_port", "port1");
  int frequency = preferences.getString("sample_frequency", "60").toInt();

  Serial.println("Current config : ");
  Serial.println(preferences.getString("server_name", "name1"));
  Serial.println(preferences.getString("server_pass", "pass1"));
  Serial.println(preferences.getString("rpi_ip", "ip1"));
  Serial.println(preferences.getString("rpi_port", "port1"));

  n = WiFi.scanNetworks();

  print_wakeup_reason();
  canSleep = false;

  /*
    Configure the wake up source
    Set the ESP32 to wake up every 5 seconds
  */
  esp_sleep_enable_timer_wakeup(frequency * uS_TO_S_FACTOR);
  Serial.println("Setup ESP32 to sleep for every " + String(frequency) + " Seconds");

  pinMode(ledPin, OUTPUT);
  digitalWrite(ledPin, LOW);

  //If there is an existing config, try to connect to the Wifi server
  Serial.println("Attempting wifi connexion with saved data :");
  WiFi.begin(server_name.c_str(), server_pass.c_str());

  int i = 1;
  while (!isConnected and i < 10) {
    isConnected = WiFi.status() == WL_CONNECTED;
    i += 1;
    Serial.println("Connecting to wifi: " + String(isConnected));
    delay(1000);
  }

  if (isConnected) {
    Serial.println("Connecting to MQTT Broker...");
    String clientId = WiFi.macAddress();

    // Try to connect to RPI
    mqttClient.setServer(rpi_ip.c_str(), rpi_port.toInt());
    // set the callback function
    mqttClient.setCallback(callback);

    int i = 1;
    while (!isRaspberry and i < 10) {

      isRaspberry = mqttClient.connect(clientId.c_str(), "adiboite", "boiteITE");
      Serial.println("Setting up RPI server: " + String(isRaspberry));
      i += 1;
      delay(1000);
    }

    Serial.println("Setting up RPI server: " + String(isRaspberry));
  }

  // register to server or launch the captive portal to request missing params
  if (isConnected and isRaspberry) {
    Serial.println("registering to RPI");
    reconnect();

    StaticJsonDocument<256> payl; //Memory pool
    String message;
    payl["mac"] = WiFi.macAddress();
    serializeJson(payl, message);

    mqttClient.publish("/register", message.c_str());
  } else {
    // Captive portal only if the connexion was unsuccessful
    Serial.println("Launching captive portal !");
    WiFi.disconnect();   //added to start with the wifi off, avoid crashing
    WiFi.mode(WIFI_OFF); //added to start with the wifi off, avoid crashing
    WiFi.mode(WIFI_AP);
    WiFi.softAP("Boite ITE");

    // Setting up the web server's endpoints
    setupServer();
    dnsServer.start(53, "*", WiFi.softAPIP());

    server.addHandler(new CaptiveRequestHandler()).setFilter(ON_AP_FILTER); //only when requested from AP
    server.begin();
  }

  preferences.end();
  Serial.println("Setup complete !");
}


// Reconnect to mqtt function
bool reconnect() {
  Serial.println("Connecting to MQTT Broker...");

  preferences.begin("my-app", true);
  String server_name = preferences.getString("server_name", "name1");
  String server_pass = preferences.getString("server_pass", "pass1");
  String rpi_ip = preferences.getString("rpi_ip", "ip1");
  String rpi_port = preferences.getString("rpi_port", "port1");
  preferences.end();

  Serial.print("Wifi status : ");
  Serial.println(WiFi.status() == WL_CONNECTED);
  if (!(WiFi.status() == WL_CONNECTED)) {
    Serial.println("Attempting wifi connexion with saved data :");

    WiFi.begin(server_name.c_str(), server_pass.c_str());

    isConnected = false;
    int i = 1;
    while (!isConnected and i < 10) {
      isConnected = WiFi.status() == WL_CONNECTED;
      i += 1;
      Serial.println("Connecting to wifi: " + String(isConnected));
      delay(1000); /* Utilisation de delay car pas de conséquences sur
      le déroulé du programme (while loop) */
    }

    if (!isConnected) {
      Serial.println("Couldn't connect to server");
      return false;
    }
  }

  String clientId = WiFi.macAddress();

  // Try to connect to RPI
  mqttClient.setServer(rpi_ip.c_str(), rpi_port.toInt());
  // set the callback function
  mqttClient.setCallback(callback);

  // Hardcoded preferences for the client connection
  bool success = mqttClient.connect(clientId.c_str(), "adiboite", "boiteITE");
  if (success) {
    Serial.println("RPI Connected !");
    
    // subscribe to topics
    mqttClient.subscribe("/config");
    mqttClient.subscribe("/sleep");

    mqttClient.loop();
    success = true;
  }

  return success;
}

void loop() {
  dnsServer.processNextRequest();

  // Ensure the mqtt server is operationnal
  if (isRaspberry and !mqttClient.connected() and millis() - last_reco_try > 1000) {
    Serial.println("Connexion Lost Loop");
    last_reco_try = millis();
    reconnect();
  }

  // Development test commands
  if (Serial.available() > 0) {
    // read the incoming byte:
    String inc_message = Serial.readString();
    inc_message.trim();

    Serial.print("I received: ");
    Serial.println(inc_message);

    if (inc_message.equals("cls")) { // Clear the preferences
      Serial.println("Clear Preferences");
      preferences.begin("my-app", false);
      preferences.clear();
      preferences.end();

    } else if (inc_message.equals("reboot")) { // Reboot the ESP32
      Serial.println("Rebooting");
      ESP.restart();
      
    } else { // Send the message if not recognized
      StaticJsonDocument<256> payl; //Memory pool
      String message;
      payl["mac"] = WiFi.macAddress();
      payl["message"] = inc_message;
      serializeJson(payl, message);

      mqttClient.publish("/message", message.c_str());
    }
  }

  // Sampling loop
  if (millis() - last_sampling > frequency) {
    Serial.println("Sampling in process :");
    last_sampling = millis();
    
    digitalWrite(ledPin, HIGH);

    StaticJsonDocument<512> payl;

    // Sample functions here

    String message;
    payl["mac"] = WiFi.macAddress();
    payl["battery"] = 90;
    payl["sensors_data"]["temperature"] = random(10, 30);
    payl["sensors_data"]["humidity"] = random(50, 75);
    payl["sensors_data"]["pressure"] = random(10, 30);
    payl["sensors_data"]["gas"] = random(25, 125);
    payl["sensors_data"]["luminosity"] = random(100, 3000);
    payl["sensors_data"]["volume"] = random(10, 90);

    serializeJson(payl, message);

    if (mqttClient.publish("/data", message.c_str())) {
      Serial.println("Sampling over and sent !");
      canSleep = true;
    }
    
    digitalWrite(ledPin, LOW);
  }
  mqttClient.loop();

  /*
   * When the esp is done sending its data, callback from the server to
   * validate the sleep ability
  */
  if (canSleep) {
    Serial.println("Going to sleep now");
    delay(1000);
    Serial.flush();
    esp_deep_sleep_start();
    Serial.println("This will never be printed");
  }
}
