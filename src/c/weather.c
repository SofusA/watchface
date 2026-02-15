#include <pebble.h>
#include "weather.h"

// ---- Private module state ----
static TextLayer   *s_temp_layer   = NULL;
static BitmapLayer *s_icon_layer   = NULL;
static GBitmap     *s_icon_bitmap  = NULL;

// NOTE: Index 0 is the "unknown/?" fallback.
static const uint32_t WEATHER_RES_IDS[] = {
  RESOURCE_ID_IMAGE_QUESTION_DARK,          // 0
  RESOURCE_ID_IMAGE_SUNNY_DARK,             // 1
  RESOURCE_ID_IMAGE_CLEAR_NIGHT_DARK,       // 2
  RESOURCE_ID_IMAGE_PARTLY_CLOUDY_DARK,     // 3
  RESOURCE_ID_IMAGE_PARTLY_CLOUDY_NIGHT_DARK,// 4
  RESOURCE_ID_IMAGE_CLOUDY_DARK,            // 5
  RESOURCE_ID_IMAGE_HEAVY_RAIN_DARK,        // 6
  RESOURCE_ID_IMAGE_HEAVY_SNOW_DARK,        // 7
  RESOURCE_ID_IMAGE_RAIN_SNOW_DARK,         // 8
  RESOURCE_ID_IMAGE_THUNDERSTORM_DARK       // 9
};

static inline int32_t prv_countof_res(void) {
  return (int32_t)(sizeof(WEATHER_RES_IDS) / sizeof(WEATHER_RES_IDS[0]));
}

void set_weather_icon(int32_t idx) {
  if (!s_icon_layer) {
    return;
  }

  if (idx < 0 || idx >= prv_countof_res()) {
    idx = 0; 
  }

  if (s_icon_bitmap) {
    gbitmap_destroy(s_icon_bitmap);
    s_icon_bitmap = NULL;
  }

  s_icon_bitmap = gbitmap_create_with_resource(WEATHER_RES_IDS[idx]);
  if (!s_icon_bitmap) {
    // Extra safety: try the "?" icon
    s_icon_bitmap = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_QUESTION_DARK);
  }
  bitmap_layer_set_bitmap(s_icon_layer, s_icon_bitmap);
}

void inbox_received_handler(DictionaryIterator *iter, void *context) {
  Tuple *t = dict_find(iter, MESSAGE_KEY_WEATHER_TEMPERATURE);
  if (t && s_temp_layer) {
    static char s_temp_buffer[8];
    snprintf(s_temp_buffer, sizeof(s_temp_buffer), "%d°", (int)t->value->int32);
    text_layer_set_text(s_temp_layer, s_temp_buffer);
  }

  Tuple *icon_t = dict_find(iter, MESSAGE_KEY_WEATHER_ICON);
  if (icon_t) {
    set_weather_icon(icon_t->value->int32);
  }
}

void weather_init(TextLayer *temp_layer, BitmapLayer *icon_layer) {
  s_temp_layer = temp_layer;
  s_icon_layer = icon_layer;

  set_weather_icon(0);
}

void weather_deinit(void) {
  if (s_icon_bitmap) {
    gbitmap_destroy(s_icon_bitmap);
    s_icon_bitmap = NULL;
  }
  s_temp_layer = NULL;
  s_icon_layer = NULL;
}
