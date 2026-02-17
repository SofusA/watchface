#include <pebble.h>
#include <ctype.h>

#include "ui.h"
#include "messaging.h"
#include "weather.h"

static Window *s_window;
static Ui     *s_ui;

// State from services/data
static bool    s_is_obstructed = false;
static int32_t s_last_uv       = -1;
static int32_t s_last_precip   = -1;
static bool    s_bt_connected  = true;
static int     s_batt_percent  = 100;

// Scratch buffers we own
static char s_time_buf[6];
static char s_date_buf[20];
static char s_latest_temp[8] = "---";
static char s_sun_next[8]    = "--:--";

// ---------- Helpers ----------
static void prv_update_time_date(void) {
  time_t now = time(NULL);
  struct tm *t = localtime(&now);

  // Time
  strftime(s_time_buf, sizeof(s_time_buf), "%H:%M", t);
  ui_set_time(s_ui, s_time_buf);

  // Date: lowercase "sun 15 feb"
  char wday[4] = "";
  char mon[4]  = "";
  strftime(wday, sizeof(wday), "%a", t);
  strftime(mon,  sizeof(mon),  "%b", t);
  for (size_t i = 0; wday[i] != '\0'; ++i) {
    wday[i] = (char)tolower((unsigned char)wday[i]);
  }
  for (size_t i = 0; mon[i] != '\0'; ++i) {
    mon[i] = (char)tolower((unsigned char)mon[i]);
  }
  snprintf(s_date_buf, sizeof(s_date_buf), "%s %d %s", wday, t->tm_mday, mon);
  ui_set_date(s_ui, s_date_buf);
}

static void prv_update_weather_row(void) {
  ui_set_weather_row(s_ui, s_latest_temp, s_sun_next);
}

static void prv_relayout(void) {
  if (!s_window || !s_ui) return;

  Layer *root = window_get_root_layer(s_window);
  GRect full  = layer_get_bounds(root);
  GRect unob  = layer_get_unobstructed_bounds(root);
  s_is_obstructed = (unob.size.h < full.size.h);

  ui_relayout(s_ui, s_is_obstructed, s_last_uv, s_last_precip);
}

// ---------- Weather callbacks ----------
static void on_weather_temp(const char *temp_text) {
  snprintf(s_latest_temp, sizeof(s_latest_temp), "%s", temp_text ? temp_text : "---");
  prv_update_weather_row();
}
static void on_weather_uv(int32_t uv) {
  s_last_uv = uv;
  prv_relayout();
}
static void on_weather_precip(int32_t mm) {
  s_last_precip = mm;
  ui_set_precip(s_ui, mm);
  prv_relayout();
}
static void on_weather_sun(const char *t) {
  snprintf(s_sun_next, sizeof(s_sun_next), "%s", t ? t : "--:--");
  prv_update_weather_row();
}

// ---------- Services ----------
static void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
  prv_update_time_date();
  if (tick_time->tm_min % 15 == 0) {
    messaging_request_weather_refresh();
  }
}

static void bt_handler(bool connected) {
  s_bt_connected = connected;
  ui_show_bt_icon(s_ui, !connected);
  if (connected) {
    messaging_request_weather_refresh();
  }
}

static void battery_handler(BatteryChargeState state) {
  s_batt_percent = state.charge_percent;
  bool low = (state.charge_percent <= 25) && !state.is_charging;
  ui_show_batt_low_icon(s_ui, low);
}

// Unobstructed area
static void on_unobstructed_will_change(GRect final_unobstructed_screen_area, void *ctx) { (void)final_unobstructed_screen_area; (void)ctx; }
static void on_unobstructed_change(AnimationProgress progress, void *ctx) { (void)progress; (void)ctx; prv_relayout(); }
static void on_unobstructed_did_change(void *ctx) { (void)ctx; prv_relayout(); }

// ---------- Window ----------
static void window_load(Window *window) {
  // Build UI
  s_ui = ui_create(window);

  // Weather module gets the main icon layer to own its bitmap
  weather_init(
    ui_get_main_icon_layer(s_ui),
    on_weather_temp,
    on_weather_uv,
    on_weather_precip,
    on_weather_sun
  );

  // Initial content
  prv_update_time_date();
  prv_update_weather_row();
  prv_relayout();
}

static void window_unload(Window *window) {
  weather_deinit();
  ui_destroy(s_ui);
  s_ui = NULL;
}

// ---------- Init / Deinit ----------
static void init(void) {
  s_window = window_create();
  window_set_window_handlers(s_window, (WindowHandlers){
    .load = window_load,
    .unload = window_unload
  });
  window_stack_push(s_window, true);

  // Unobstructed area
  UnobstructedAreaHandlers ua = {
    .will_change = on_unobstructed_will_change,
    .change      = on_unobstructed_change,
    .did_change  = on_unobstructed_did_change
  };
  unobstructed_area_service_subscribe(ua, NULL);

  // Services
  tick_timer_service_subscribe(MINUTE_UNIT, tick_handler);
  connection_service_subscribe((ConnectionHandlers){ .pebble_app_connection_handler = bt_handler });
  battery_state_service_subscribe(battery_handler);
  battery_handler(battery_state_service_peek());

  messaging_open();
  messaging_request_weather_refresh();
}

static void deinit(void) {
  unobstructed_area_service_unsubscribe();
  battery_state_service_unsubscribe();
  window_destroy(s_window);
}

int main(void) {
  init();
  app_event_loop();
  deinit();
}
