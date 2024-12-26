#include "MyButtonLib.h"

static byte lastStateButton = LOW;          // Trạng thái cuối
static byte currentStateButton = LOW;       // Trạng thái hiện tại
static unsigned long currentTimeButton = 0; // Thời gian hiện tại
static unsigned long lastTimeButton = 0;    // Thời gian lần nhấn cuối
static bool recordedPressHold = false;      // Kiểm tra đã nhấn giữ
UserButtonState valueReturn = NO;           // Giá trị trả về

UserButtonState listenButton(byte BUTTON_PIN, unsigned long timeDebounce = 50, unsigned long timePressHold = 1000) {
    valueReturn = NO;

    currentStateButton = digitalRead(BUTTON_PIN);

    // Kiểm tra trạng thái nút
    if ((lastStateButton == LOW && currentStateButton == HIGH) || (lastStateButton == HIGH && currentStateButton == HIGH)) {
        currentTimeButton = millis();
    }

    if (lastStateButton == HIGH && currentStateButton == LOW) {
        currentTimeButton = millis();

        if ((currentTimeButton - lastTimeButton) > timeDebounce && (currentTimeButton - lastTimeButton) < timePressHold) { 
            valueReturn = PRESS;
        }

        recordedPressHold = false;
        currentTimeButton = millis();
        lastTimeButton = millis();
    }

    if (lastStateButton == LOW && currentStateButton == LOW) {
        currentTimeButton = millis();
        lastTimeButton = millis();
    }

    if (abs(int(currentTimeButton - lastTimeButton)) > timePressHold && !recordedPressHold) {
        recordedPressHold = true;
        valueReturn = HOLD;
    }

    lastStateButton = currentStateButton;

    return valueReturn;
}
