#pragma once
#include <pebble.h>

void weather_init(BitmapLayer *icon_layer, void (*on_temp_cb)(const char *temp_text));
void weather_deinit(void);
void inbox_received_handler(DictionaryIterator *iter, void *context);
void set_weather_icon(int32_t idx);
