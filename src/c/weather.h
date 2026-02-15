#include <pebble.h>

void weather_init(TextLayer *temp_layer, BitmapLayer *icon_layer);
void weather_deinit(void);
void set_weather_icon(int32_t idx);
void inbox_received_handler(DictionaryIterator *iter, void *context);
