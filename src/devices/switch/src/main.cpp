#include <Arduino.h>
#include <ArduinoJson.h>
#include <ESP8266WiFi.h>
#include <MyButtonLib.h>  // Import thư viện đã tách
#include <PubSubClient.h>
#include <EEPROM.h>
#include <ESP8266WebServer.h>

String client_id = "KHGQCC";  // Thay khi nạp code cho mỗi thiết bị

#define EEPROM_SIZE 256

// Khởi tạo Web Server trên cổng 80
ESP8266WebServer server(80);
String accessPointPass = "77242268"; // Thay khi nạp code cho mỗi thiết bị
WiFiClient espClient;
PubSubClient mqtt_client(espClient);


// WiFi settings
String ownerId = "";
bool isSaveState = false;
bool isVerifyWhenReset = true;
String ssid = ""; // labech_dnm
String password = ""; // techlab@dnmanh
String mqttAddress = "mqttsmartome.dnmanh.io.vn";
String mqttUsername = "testUser";
String mqttPassword = "123123@Test";
int mqttPort = 1883;
int GMTSeconds = 25200; // 7h

bool isSTAMode = false; // true: device mode, false: access point mode


// MQTT topic
String send_topic = "";
String receive_topic = "";  // Nhận lệnh từ server
 

//----Khai báo nút bấm--------------------
#define BUTTON_PIN D1                  // Định nghĩa chân của nút
UserButtonState usrStatusButton = NO;  // Biến trạng thái nút
unsigned long debounceDelay = 50;      // Độ trễ debounce
unsigned long pressHoldTime = 1000;    // Thời gian giữ nút

//----Khai báo Relay---------------------
#define RELAY_PIN D5
bool relayState = false;
#define LED_PIN D2 

//---------------------------------------
unsigned long currentMillisForMQTT = millis();
unsigned long lastMQTTReconnect = 0;                    // Thời điểm lần thử kết nối cuối cùng
const unsigned long MQTTReconnectInterval = 1000 * 60;  // Milliseconds

unsigned long currentMillisForWiFi = millis();
unsigned long lastWiFiReconnect = 0;                    // Lưu thời điểm lần thử kết nối WiFi cuối cùng
const unsigned long wiFiReconnectInterval = 1000 * 60;  // Milliseconds
short timesWiFiConnect = 0;                             // Số lần thử kết nối WiFi
bool wifiConnected = false;


void handleDisconnectWiFi();

void handleToggleStateElectric(bool state);

bool isEEPROMEmpty();

void loadEEPROM();

String readFromEEPROM(String nameValue);

void saveToEEPROM(String nameValue, String data);

int getMemoriesIndexStart(String nameValue);

void handleControllLed(int numOn, int timeOn, int timeOff);

void handleClearAllUserData();

void controllResetValue();

bool checkStationMode();

void setupMQTT();

void connectToMQTTBroker();

bool checkMQTTConnection();

void startAccessPoint();

void connectToWiFi();

bool checkWiFiConnection();

void mqttCallback(char *topic, byte *payload, unsigned int length);

void publishJson(const char *topic, const char *id, const char *type, bool value);
 

void setup() {
    Serial.begin(9600);
    pinMode(RELAY_PIN, OUTPUT); 
    digitalWrite(RELAY_PIN, LOW);
    pinMode(LED_PIN, OUTPUT);
    EEPROM.begin(EEPROM_SIZE);   

    // Lưu dữ liệu mặc định vào EEPROM
    // saveToEEPROM("isSaveState", "FALSE");
    saveToEEPROM("isVerifyWhenReset", "FALSE"); 
    saveToEEPROM("MQTTAddress", mqttAddress);
    saveToEEPROM("MQTTUsername", mqttUsername);
    saveToEEPROM("MQTTPass", mqttPassword);
    saveToEEPROM("MQTTPort", String(mqttPort));

    // Đọc dữ liệu từ EEPROM
    loadEEPROM(); 


    // Khôi phục trạng thái công tắc từ EEPROM nếu cài đặt lưu trạng thái
    if (isSaveState) {
        relayState = readFromEEPROM("switchState") == "TRUE" ? true : false;
        Serial.println("Restoring switch state from EEPROM");  
        handleToggleStateElectric(relayState);
        publishJson(send_topic.c_str(), "", "NOTI", relayState);
    }


    // Tạo lại chuỗi topic
    send_topic = ownerId + "/" + client_id + "/send";
    receive_topic = ownerId + "/" + client_id + "/receive";  

    connectToWiFi();

    isSTAMode = checkStationMode();

    if (isSTAMode && !checkWiFiConnection()) {
        Serial.println("Setup in AP mode");
        delay(1000); // Đợi 1s trước khi chuyển mode
        startAccessPoint();
    } else {
        Serial.println("Setup in STA mode");
        setupMQTT(); 
        connectToMQTTBroker();
    } 
}


void loop() { 
    controllResetValue();

    if (ssid == "") {  
        server.handleClient(); // Lắng nghe yêu cầu HTTP
    } else {
        if (checkWiFiConnection()) {
            if (checkMQTTConnection()) {
                mqtt_client.loop();
            } else {
                connectToMQTTBroker();
            }
        } else {
            connectToWiFi();
        }
    }

    usrStatusButton = listenButton(BUTTON_PIN, debounceDelay, pressHoldTime); // NO, PRESS, HOLD
    if (usrStatusButton == HOLD) { 
        Serial.println("Reset all data");
        handleClearAllUserData(); 
        handleControllLed(5, 100, 100);
        handleToggleStateElectric(relayState);
        loadEEPROM();
        handleDisconnectWiFi();
        delay(1000);
        startAccessPoint();
        // ESP.restart();
    }

    if (usrStatusButton == PRESS) {
        Serial.println("Button pressed");
        relayState = !relayState;

        // Nếu cài đặt lưu trạng thái thì lưu trạng thái công tắc mỗi khi có thay đổi vào EEPROM
        if (isSaveState) {
            saveToEEPROM("switchState", relayState ? "TRUE" : "FALSE");
        }

        handleToggleStateElectric(relayState);
        publishJson(send_topic.c_str(), "", "NOTI", relayState);
    }
}

void handleDisconnectWiFi() {
    WiFi.disconnect();
    delay(100);
    WiFi.mode(WIFI_OFF);
    delay(100);
}

void handleToggleStateElectric(bool state) {
    digitalWrite(LED_PIN, state ? HIGH : LOW);
    digitalWrite(RELAY_PIN, state ? HIGH : LOW);
}

void controllResetValue() {
    if (timesWiFiConnect >= 7) {
        timesWiFiConnect = 0;
    }
}

bool checkStationMode() {
    WiFiMode_t currentMode = WiFi.getMode();
    if (currentMode == WIFI_STA) {
        return true;
    }
    return false;
}


void connectToWiFi() {
    currentMillisForWiFi = millis();

    if (WiFi.status() == WL_CONNECTED) return;

    WiFi.mode(WIFI_STA);


    if (currentMillisForWiFi - lastWiFiReconnect >= wiFiReconnectInterval * timesWiFiConnect || lastWiFiReconnect == 0) {
        timesWiFiConnect++;
        lastWiFiReconnect = currentMillisForWiFi;
        Serial.println("Attempting to connect to WiFi...");

        ssid = readFromEEPROM("SSID");

        if (ssid == "") { 
            return;
        } 
        password = readFromEEPROM("SSIDPass"); 

        Serial.printf("SSID: %s\n", ssid.c_str());
        Serial.printf("Password: %s\n", password.c_str());

        WiFi.begin(ssid, password);

        unsigned long startAttemptTime = millis();
        while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 10000) {  // Thử trong 10 giây
            delay(500);
            Serial.print(".");
        }

        if (WiFi.status() == WL_CONNECTED) { 
            Serial.println("\nConnected to the WiFi network");
            Serial.print("IP address: ");
            Serial.println(WiFi.localIP());
        } else { 
            Serial.println("\nFailed to connect to WiFi. Will retry in 5 minutes.");
        }
    } 
}

bool checkWiFiConnection() { 

    // Check if the device is in Station mode
    if (WiFi.getMode() == WIFI_STA) { 

        // Check if the device is connected to the WiFi network
        if (WiFi.status() == WL_CONNECTED) {  
            return true;
        }
        return false;
    } 

    return false;
}


void setupMQTT() {
    mqtt_client.setServer(mqttAddress.c_str(), mqttPort);
    mqtt_client.setCallback(mqttCallback);
}


void connectToMQTTBroker() {
    currentMillisForMQTT = millis();
    if (mqtt_client.connected()) return;


    if (currentMillisForMQTT - lastMQTTReconnect >= MQTTReconnectInterval || lastMQTTReconnect == 0) {
        lastMQTTReconnect = currentMillisForMQTT;
        // Serial.printf("Attempting to connect to MQTT Broker as %s...\n", client_id.c_str());
        // Serial.println("topic send: " + String(send_topic));

        // Serial.printf("MQTT Address: %s\n", mqttAddress.c_str());
        // Serial.printf("MQTT Username: %s\n", mqttUsername.c_str());
        // Serial.printf("MQTT Password: %s\n", mqttPassword.c_str());
        // Serial.printf("MQTT Port: %d\n", mqttPort);

        if (mqtt_client.connect(client_id.c_str(), mqttUsername.c_str(), mqttPassword.c_str())) {
            Serial.println("Connected to MQTT broker");
            mqtt_client.subscribe(receive_topic.c_str());
            publishJson(send_topic.c_str(), "", "NOTI", relayState);
        } else {
            Serial.print("Failed to connect to MQTT broker, rc=");
            Serial.print(mqtt_client.state());
            Serial.println(" Will retry in 5 minutes.");
        }
    }
}

bool checkMQTTConnection() {
    if (mqtt_client.connected()) {
        return true;
    }
    return false;
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
    if (strcmp(topic, receive_topic.c_str()) == 0) {
        JsonDocument doc;  // Khai báo JsonDocument
        DeserializationError error = deserializeJson(doc, incomingMessage);
        
        if (error) {
            Serial.println("Failed to parse JSON");
            return;
        }

        const char *id = doc["id"];
        const char *type = doc["type"];
        bool value = doc["value"];
        bool saveState = doc["save_state"];

        Serial.println("Id: " + String(id));
        Serial.println("Type: " + String(type));
        Serial.println("Value: " + String(value));
        Serial.println("saveState: " + String(saveState));

        // Nhận lệnh điều khiển
        if (strcmp(type, "CONTROLL") == 0) {
            if (value == 1) {
                Serial.println("Turning ON");
                relayState = true;
            } else {
                Serial.println("Turning OFF");
                relayState = false;
            }


            // Nếu cài đặt lưu trạng thái thì lưu trạng thái công tắc mỗi khi có thay đổi vào EEPROM
            if (isSaveState) {
                saveToEEPROM("switchState", relayState ? "TRUE" : "FALSE");
            }

            // digitalWrite(LED_PIN, relayState ? HIGH : LOW);
            handleToggleStateElectric(relayState);
            publishJson(send_topic.c_str(), id, "CONTROLL_RES", relayState);
        }

        // Nhận lệnh cài đặt thiết bị
        if (strcmp(type, "SETTING") == 0) {
            if (saveState == 1) {
                Serial.println("Require device save state: TRUE");
                isSaveState = true;
                saveToEEPROM("isSaveState", "TRUE"); 
            } else {
                Serial.println("Require device save state: FALSE");
                isSaveState = false;
                saveToEEPROM("isSaveState", "FALSE"); 
            }
        }

        // Nhận lệnh truy vấn trạng thái
        if (strcmp(type, "STATUS") == 0) {
            publishJson(send_topic.c_str(), id, "STATUS_RES", relayState);
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


// Hàm khởi động WiFi ở chế độ Access Point
void startAccessPoint() {

    WiFi.disconnect(); // Ngắt kết nối WiFi hiện tại
    delay(100);

    WiFi.mode(WIFI_AP);
    delay(100);

    WiFi.softAPConfig(IPAddress(192, 168, 4, 1), IPAddress(192, 168, 4, 1), IPAddress(255, 255, 255, 0));
    WiFi.softAP(client_id+"_WIFI", accessPointPass);

    Serial.println("ESP is in AP mode. Connect to SSID 'ESP-AP-Setup' and send POST requests.");
    Serial.printf("AP Status: %d\n", WiFi.status());
    Serial.printf("AP IP: %s\n", WiFi.softAPIP().toString().c_str());

    // listen on http://192.168.4.1/setWiFi
    server.on("/setWiFi", HTTP_GET, []() {
        if (server.hasArg("ownerId") && server.hasArg("gmt") && server.hasArg("ssid") && server.hasArg("password")) {

            ownerId = server.arg("ownerId");
            GMTSeconds = server.arg("gmt").toInt() * 60 * 60;
            ssid = server.arg("ssid");
            password = server.arg("password");

            // Tạo lại chuỗi topic
            send_topic = ownerId + "/" + client_id + "/send";
            receive_topic = ownerId + "/" + client_id + "/receive"; 
            // -------------

            saveToEEPROM("ownerId", ownerId);
            saveToEEPROM("GMTSeconds", String(GMTSeconds));
            saveToEEPROM("SSID", ssid);
            saveToEEPROM("SSIDPass", password);

            server.send(200, "application/json", "{\"status\":\"success\", \"message\":\"WiFi credentials saved. Restart ESP.\"}");
            delay(3000);
            ESP.restart();
        } else {
            server.send(400, "application/json", "{\"status\":\"error\", \"message\":\"Missing 'ownerId' or 'ssid' or 'password'\"}");
        }
    });

    server.begin();
}
 
// Đọc dữ liệu từ EEPROM
void loadEEPROM() {  
    ownerId = readFromEEPROM("ownerId");
    relayState = readFromEEPROM("switchState") == "TRUE" ? true : false;
    isSaveState = readFromEEPROM("isSaveState") == "TRUE" ? true : false;
    isVerifyWhenReset = readFromEEPROM("isVerifyWhenReset") == "TRUE" ? true : false;
    GMTSeconds = readFromEEPROM("GMTSeconds").toInt();
    ssid = readFromEEPROM("SSID");
    password = readFromEEPROM("SSIDPass");
    mqttAddress = readFromEEPROM("MQTTAddress");
    mqttUsername = readFromEEPROM("MQTTUsername");
    mqttPassword = readFromEEPROM("MQTTPass");
    mqttPort = readFromEEPROM("MQTTPort").toInt(); 
}

// Hàm kiểm tra xem EEPROM có trống không
bool isEEPROMEmpty() {
    for (int i = 0; i < EEPROM_SIZE; i++) {
        if (EEPROM.read(i) != 0xFF) {
            return false;
        }
    }
    return true;
}

// Hàm lưu chuỗi vào EEPROM
void saveToEEPROM(String nameValue, String data) { 
    int memoriesIndexStart = getMemoriesIndexStart(nameValue); 

    if (memoriesIndexStart == -1) { 
        return;
    }

    byte data_length = data.length(); 
    EEPROM.write(memoriesIndexStart, data_length); 

    memoriesIndexStart += 1;
    for (int i = memoriesIndexStart; i < (memoriesIndexStart + data_length); i++) {
        EEPROM.write(i, data[i - memoriesIndexStart]);
    } 
    EEPROM.commit(); 
}

// Hàm đọc chuỗi từ EEPROM
String readFromEEPROM(String nameValue) {

    int memoriesIndexStart = getMemoriesIndexStart(nameValue); 

    if (memoriesIndexStart == -1) { 
        return "";
    }

    byte length = EEPROM.read(memoriesIndexStart);
 
    if (length == 255) return ""; 

    memoriesIndexStart += 1;

    String value = "";
    for (int i = memoriesIndexStart; i < (memoriesIndexStart + length); i++) {
        value += char(EEPROM.read(i));
    } 
 
    return value;
}


void clearEEPROM(String nameValue) {  
    int memoriesIndexStart = getMemoriesIndexStart(nameValue);
    if (memoriesIndexStart == -1) { 
        return;
    }

    byte length = EEPROM.read(memoriesIndexStart);
    if (length == 255) return; 

    for (int i = memoriesIndexStart; i < (memoriesIndexStart + length); i++) {
        EEPROM.write(i, 0xFF);
    }
    EEPROM.commit(); 
}

int getMemoriesIndexStart(String nameValue) { 
    if (nameValue == "ownerId") {
        return 1; // 0 - 7
    } else if (nameValue == "switchState") {
        return 9; // 9 - 14
    } else if (nameValue == "isSaveState") {
        return 16; // 16 - 20
    } else if (nameValue == "isVerifyWhenReset") {
        return 22; // 22 - 28
    } else if (nameValue == "GMTSeconds") {
        return 30; // 30 - 34
    } else if (nameValue == "SSID") {
        return 37; // 37 - 68
    } else if (nameValue == "SSIDPass") {
        return 70; // 70 - 101
    } else if (nameValue == "MQTTAddress") {
        return 103; // 103 - 127  
    } else if (nameValue == "MQTTUsername") {
        return 129; // 129 - 144
    } else if (nameValue == "MQTTPass") {
        return 146; // 146 - 177
    } else if (nameValue == "MQTTPort") {
        return 179; // 179 - 183
    } 
    return -1;
}

void handleClearAllUserData() {  
    clearEEPROM("ownerId");
    saveToEEPROM("switchState", "FALSE");
    saveToEEPROM("isSaveState", "FALSE");
    saveToEEPROM("isVerifyWhenReset", "FALSE");
    saveToEEPROM("GMTSeconds", "0");
    clearEEPROM("SSID");
    clearEEPROM("SSIDPass"); 
} 

void handleControllLed(int numOn, int timeOn, int timeOff) {
    if (numOn > 0) {
        for (int i = 0; i < numOn; i++) {
            digitalWrite(LED_PIN, HIGH);
            delay(timeOn);
            digitalWrite(LED_PIN, LOW);
            delay(timeOff);
        }
    }
}