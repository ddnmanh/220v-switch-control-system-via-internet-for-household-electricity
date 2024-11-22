#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <MyButtonLib.h>  // Import thư viện đã tách
#include <PubSubClient.h>

// WiFi settings
const char *ssid = "labech_dnm";
const char *password = "techlab@dnmanh";
const char *mqtt_broker = "192.168.1.4";
const char *mqtt_username = "switch";
const char *mqtt_password = "123";
const int mqtt_port = 1883;
String client_id = "switch-001";

// MQTT topic
const char *send_topic = "sw1/send";        // Gửi trạng thái nút
const char *receive_topic = "sw1/receive";  // Nhận lệnh từ server

WiFiClient espClient;
PubSubClient mqtt_client(espClient);

//----Khai báo nút bấm--------------------
#define BUTTON_PIN D1                  // Định nghĩa chân của nút
UserButtonState usrStatusButton = NO;  // Biến trạng thái nút
unsigned long debounceDelay = 50;      // Độ trễ debounce
unsigned long pressHoldTime = 1000;    // Thời gian giữ nút

//----Khai báo Relay---------------------
#define RELAY_PIN D4
bool relayState = false;
#define LED_PIN D2

//---------------------------------------
unsigned long currentMillisForMQTT = millis();
unsigned long lastMQTTReconnect = 0;                    // Thời điểm lần thử kết nối cuối cùng
const unsigned long MQTTReconnectInterval = 1000 * 10;  // Milliseconds

unsigned long currentMillisForWiFi = millis();
unsigned long lastWiFiReconnect = 0;                    // Lưu thời điểm lần thử kết nối WiFi cuối cùng
const unsigned long wiFiReconnectInterval = 1000 * 10;  // Milliseconds
short timesWiFiConnect = 0;                             // Số lần thử kết nối WiFi
bool wifiConnected = false;

void connectToWiFi();

void connectToMQTTBroker();

void mqttCallback(char *topic, byte *payload, unsigned int length);

void publishJson(const char *topic, const char *id, const char *type, bool value);

void controllResetValue() {
    if (timesWiFiConnect >= 7) {
        timesWiFiConnect = 0;
    }
}

void setup() {
    Serial.begin(9600);

    pinMode(LED_PIN, OUTPUT);

    connectToWiFi();
    mqtt_client.setServer(mqtt_broker, mqtt_port);
    mqtt_client.setCallback(mqttCallback);
    connectToMQTTBroker();
}

void connectToWiFi() {
    if (WiFi.status() == WL_CONNECTED) return;

    if (currentMillisForWiFi - lastWiFiReconnect >= wiFiReconnectInterval * timesWiFiConnect || lastWiFiReconnect == 0) {
        timesWiFiConnect++;
        lastWiFiReconnect = currentMillisForWiFi;
        Serial.println("Attempting to connect to WiFi...");
        WiFi.begin(ssid, password);

        unsigned long startAttemptTime = millis();
        while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {  // Thử trong 10 giây
            delay(500);
            Serial.print(".");
        }

        if (WiFi.status() == WL_CONNECTED) {
            wifiConnected = true;
            Serial.println("\nConnected to the WiFi network");
            Serial.print("IP address: ");
            Serial.println(WiFi.localIP());
        } else {
            wifiConnected = false;
            Serial.println("\nFailed to connect to WiFi. Will retry in 5 minutes.");
        }
    }
}

void connectToMQTTBroker() {
    if (mqtt_client.connected()) return;

    currentMillisForMQTT = millis();

    if (currentMillisForMQTT - lastMQTTReconnect >= MQTTReconnectInterval || lastMQTTReconnect == 0) {
        lastMQTTReconnect = currentMillisForMQTT;
        Serial.printf("Attempting to connect to MQTT Broker as %s...\n", client_id.c_str());
        if (mqtt_client.connect(client_id.c_str(), mqtt_username, mqtt_password)) {
            Serial.println("Connected to MQTT broker");
            mqtt_client.subscribe(receive_topic);
            publishJson(send_topic, "", "NOTI", relayState);
        } else {
            Serial.print("Failed to connect to MQTT broker, rc=");
            Serial.print(mqtt_client.state());
            Serial.println(" Will retry in 5 minutes.");
        }
    }
}

void mqttCallback(char *topic, byte *payload, unsigned int length) {
    char incomingMessage[200];             // Kích thước mảng phù hợp với dữ liệu nhận
    if (length < sizeof(incomingMessage))  // Ép kiểu an toàn
    {
        for (unsigned int i = 0; i < length; i++) {
            incomingMessage[i] = (char)payload[i];
        }
        incomingMessage[length] = '\0';  // Đảm bảo kết thúc chuỗi
    } else {
        Serial.println("Message too long");
        return;
    }

    Serial.println("Message arrived [" + String(topic) + "] " + String(incomingMessage));

    // Xử lý lệnh nhận từ MQTT (JSON)
    if (strcmp(topic, receive_topic) == 0) {
        JsonDocument doc;  // Khai báo JsonDocument
        DeserializationError error = deserializeJson(doc, incomingMessage);
        if (error) {
            Serial.println("Failed to parse JSON");
            return;
        }

        const char *id = doc["id"];
        const char *type = doc["type"];
        bool value = doc["value"];

        Serial.println("Id: " + String(id));
        Serial.println("Type: " + String(type));
        Serial.println("Value: " + String(value));

        // Nhận lệnh điều khiển
        if (strcmp(type, "CONTROLL") == 0) {
            if (value == 1) {
                Serial.println("Turning ON");
                relayState = true;
            } else {
                Serial.println("Turning OFF");
                relayState = false;
            }

            digitalWrite(LED_PIN, relayState ? HIGH : LOW);
            publishJson(send_topic, id, "CONTROLL_RES", relayState);
        }

        // Nhận lệnh truy vấn trạng thái
        if (strcmp(type, "STATUS") == 0) {
            publishJson(send_topic, id, "STATUS_RES", relayState);
        }
    }
}

//-----Hàm gửi JSON qua MQTT---------
void publishJson(const char *topic, const char *id, const char *type, bool value) {
    JsonDocument doc;  // Khai báo JsonDocument
    doc["id"] = id;
    doc["type"] = type;
    doc["value"] = value;

    char jsonBuffer[200];
    serializeJson(doc, jsonBuffer);  // Chuyển thành chuỗi JSON

    if (mqtt_client.publish(topic, jsonBuffer, false)) {
        Serial.println("JSON Message published: " + String(jsonBuffer));
    } else {
        Serial.println("Message publishing failed");
    }
}

void loop() {
    controllResetValue();

    connectToWiFi();
    if (wifiConnected) {
        connectToMQTTBroker();
        mqtt_client.loop();
    }

    usrStatusButton = listenButton(BUTTON_PIN, debounceDelay, pressHoldTime);
    if (usrStatusButton != NO) {
        relayState = !relayState;
        digitalWrite(LED_PIN, relayState ? HIGH : LOW);
        publishJson(send_topic, "", "NOTI", relayState);
    }
}
