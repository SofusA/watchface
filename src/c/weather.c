#include <pebble.h>
#include <ctype.h>

static Window *s_window;
static TextLayer *time_layer, *date_layer, *temp_layer;
static Layer *line_layer, *battery_layer;

static char time_buffer[6];
static char date_buffer[8];
static char temp_buffer[8];

enum {
  KEY_TEMP = 0
};

/* ---------- Drawing ---------- */

static void line_update_proc(Layer *layer, GContext *ctx) {
  graphics_context_set_stroke_color(ctx, GColorWhite);
  graphics_draw_line(ctx, GPoint(16, 100), GPoint(128, 100));
}

static void battery_update_proc(Layer *layer, GContext *ctx) {
  BatteryChargeState state = battery_state_service_peek();
  if (state.charge_percent >= 25) return;

  graphics_context_set_stroke_color(ctx, GColorWhite);
  graphics_draw_rect(ctx, GRect(0, 0, 14, 8));
  graphics_draw_rect(ctx, GRect(14, 2, 2, 4));

  // (Optional) add a small diagonal or fill to indicate "low"
  // Example: draw a small diagonal line inside to catch attention
  // graphics_draw_line(ctx, GPoint(2,6), GPoint(12,2));
}

/* ---------- Time & Date ---------- */


static void update_time(void) {
  time_t now = time(NULL);
  struct tm *t = localtime(&now);

  // 24h time centered
  strftime(time_buffer, sizeof(time_buffer), "%H:%M", t);
  text_layer_set_text(time_layer, time_buffer);

  // Date "sat 14" -> lowercase abbreviated weekday + day (space padded day)
  // %a = "Sat", %e = " 1" .. "31" (note leading space for 1..9)
  strftime(date_buffer, sizeof(date_buffer), "%a %e", t);

  // Lowercase safely: cast to unsigned char for tolower()
  for (size_t i = 0; date_buffer[i] != '\0'; ++i) {
    date_buffer[i] = (char)tolower((unsigned char)date_buffer[i]);
  }

  text_layer_set_text(date_layer, date_buffer);
}


static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
  update_time();
}

/* ---------- Weather ---------- */

static void inbox_received_handler(DictionaryIterator *iter, void *context) {
  Tuple *t = dict_find(iter, MESSAGE_KEY_WEATHER_TEMPERATURE);
  if (t) {
    snprintf(temp_buffer, sizeof(temp_buffer), "%d°", (int)t->value->int32);
    text_layer_set_text(temp_layer, temp_buffer);
  }
}

/* ---------- Window ---------- */

static void window_load(Window *window) {
  Layer *root = window_get_root_layer(window);
  GRect bounds = layer_get_bounds(root);

  // Dark theme background
  window_set_background_color(window, GColorBlack);

  // --- TIME (big, centered) ---
  // y=32 looks nice with 42pt time on diorite
  time_layer = text_layer_create(GRect(0, 32, bounds.size.w, 46));
  text_layer_set_background_color(time_layer, GColorClear);
  text_layer_set_text_color(time_layer, GColorWhite);
  text_layer_set_font(time_layer, fonts_get_system_font(FONT_KEY_BITHAM_42_BOLD));
  text_layer_set_text_alignment(time_layer, GTextAlignmentCenter);

  // --- DATE (below time) ---
  date_layer = text_layer_create(GRect(0, 70, bounds.size.w, 28));
  text_layer_set_background_color(date_layer, GColorClear);
  text_layer_set_text_color(date_layer, GColorWhite);
  text_layer_set_font(date_layer, fonts_get_system_font(FONT_KEY_GOTHIC_24_BOLD));
  text_layer_set_text_alignment(date_layer, GTextAlignmentCenter);

  // --- SEPARATOR LINE ---
  line_layer = layer_create(bounds);
  layer_set_update_proc(line_layer, line_update_proc);

  // --- TEMPERATURE (larger) ---
  temp_layer = text_layer_create(GRect(0, 104, bounds.size.w, 32));
  text_layer_set_background_color(temp_layer, GColorClear);
  text_layer_set_text_color(temp_layer, GColorWhite);
  text_layer_set_font(temp_layer, fonts_get_system_font(FONT_KEY_GOTHIC_28_BOLD));
  text_layer_set_text_alignment(temp_layer, GTextAlignmentCenter);
  text_layer_set_text(temp_layer, "---"); // default before first update

  // --- BATTERY ICON (top-right), only drawn if <25% in update_proc ---
  battery_layer = layer_create(GRect(bounds.size.w - 20, 6, 18, 10));
  layer_set_update_proc(battery_layer, battery_update_proc);

  // Add in z-order
  layer_add_child(root, text_layer_get_layer(time_layer));
  layer_add_child(root, text_layer_get_layer(date_layer));
  layer_add_child(root, line_layer);
  layer_add_child(root, text_layer_get_layer(temp_layer));
  layer_add_child(root, battery_layer);

  update_time();
}

static void window_unload(Window *window) {
  text_layer_destroy(time_layer);
  text_layer_destroy(date_layer);
  text_layer_destroy(temp_layer);
  layer_destroy(line_layer);
  layer_destroy(battery_layer);
}

/* ---------- Init ---------- */

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
