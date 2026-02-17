#pragma once
#include <pebble.h>

// Open AppMessage and register an internal inbox handler.
void messaging_open(void);

// Request a weather refresh via AppMessage
void messaging_request_weather_refresh(void);
