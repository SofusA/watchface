#include <pebble.h>
#include <ctype.h>
#include "weather.h"

static Window *s_window;

static TextLayer *time_layer;
static TextLayer *date_temp_layer;
static Layer     *battery_layer;
static BitmapLayer *icon_layer;

// Buffers
static char time_buffer[6];         
static char date_temp_buffer[24];   
static char latest_temp[8] = "---"; 

// ---------- Battery ----------

static void battery_update_proc(Layer *layer, GContext *ctx) {
  BatteryChargeState state = battery_state_service_peek();
  if (state.charge_percent >= 25) return;
  graphics_context_set_stroke_color(ctx, GColorWhite);
  graphics_draw_rect(ctx, GRect(0, 0, 14, 8));
  graphics_draw_rect(ctx, GRect(14, 2, 2, 4));
}

// ---------- Time & Combined Date/Temp ----------

static void update_display(void) {
  time_t now = time(NULL);
  struct tm *t = localtime(&now);

  strftime(time_buffer, sizeof(time_buffer), "%H:%M", t);
  text_layer_set_text(time_layer, time_buffer);

  // Build lowercase day-of-week ("sat") safely
  char dow[4] = "";
  strftime(dow, sizeof(dow), "%a", t);
  for (size_t i = 0; dow[i] != '\0'; ++i) {
    dow[i] = (char)tolower((unsigned char)dow[i]);
  }

  char date_part[12];
  snprintf(date_part, sizeof(date_part), "%s %d", dow, t->tm_mday);

  snprintf(date_temp_buffer, sizeof(date_temp_buffer), "%s | %s", date_part, latest_temp);
  text_layer_set_text(date_temp_layer, date_temp_buffer);
}

static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
  update_display();
}

static void weather_on_temp(const char *temp_text) {
  snprintf(latest_temp, sizeof(latest_temp), "%s", temp_text ? temp_text : "---");
  update_display();
}

// ---------- Window ----------

static void window_load(Window *window) {
  Layer *root = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(root);

  window_set_background_color(window, GColorBlack);

  const int ICON_W = 32, ICON_H = 32;
  const int MARGIN_TOP = 6;

  const int icon_x = (bounds.size.w - ICON_W) / 2;
  const int icon_y = MARGIN_TOP;
  icon_layer = bitmap_layer_create(GRect(icon_x, icon_y, ICON_W, ICON_H));
  bitmap_layer_set_background_color(icon_layer, GColorClear);
  bitmap_layer_set_compositing_mode(icon_layer, GCompOpSet);

  const int time_y = icon_y + ICON_H;
  time_layer = text_layer_create(GRect(0, time_y, bounds.size.w, 46));
  text_layer_set_background_color(time_layer, GColorClear);
  text_layer_set_text_color(time_layer, GColorWhite);
  text_layer_set_font(time_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
  text_layer_set_text_alignment(time_layer, GTextAlignmentCenter);

  const int row3_y = time_y + 40;
  date_temp_layer = text_layer_create(GRect(0, row3_y, bounds.size.w, 28));
  text_layer_set_background_color(date_temp_layer, GColorClear);
  text_layer_set_text_color(date_temp_layer, GColorWhite);
  text_layer_set_font(date_temp_layer, fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD));
  text_layer_set_text_alignment(date_temp_layer, GTextAlignmentCenter);
  text_layer_set_text(date_temp_layer, ""); // set in update_display()

  battery_layer = layer_create(GRect(bounds.size.w - 20, 6, 18, 10));
  layer_set_update_proc(battery_layer, battery_update_proc);

  layer_add_child(root, bitmap_layer_get_layer(icon_layer));
  layer_add_child(root, text_layer_get_layer(time_layer));
  layer_add_child(root, text_layer_get_layer(date_temp_layer));
  layer_add_child(root, battery_layer);

  weather_init(icon_layer, weather_on_temp);

  update_display();
}

static void window_unload(Window *window) {
  text_layer_destroy(time_layer);
  text_layer_destroy(date_temp_layer);
  layer_destroy(battery_layer);

  weather_deinit();
  bitmap_layer_destroy(icon_layer);
}

// ---------- Init ----------

static void init(void) {
  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers){
    .load = window_load,
    .unload = window_unload
  });
  window_stack_push(s_window, true);

  tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);

  app_message_register_inbox_received(inbox_received_handler);
  app_message_open(64, 64);
}

static void deinit(void) {
  window_destroy(s_window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
