#ifndef MyBUTTONLIB_H
#define MYBUTTONLIB_H

#include <Arduino.h>

enum UserButtonState { NO, PRESS, HOLD };

UserButtonState listenButton(byte BUTTON_PIN, unsigned long timeDebounce, unsigned long timePressHold);

#endif
