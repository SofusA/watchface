#pragma once
#include <pebble.h>

// Opaque struct holding layers, bitmaps, buffers, etc.
typedef struct Ui Ui;

// Create/destroy the UI attached to a Window
Ui* ui_create(Window *window);
void ui_destroy(Ui *ui);

// Update content
void ui_set_time(Ui *ui, const char *hhmm);                 // "HH:MM"
void ui_set_date(Ui *ui, const char *date_text);             // "sun 15 feb"
void ui_set_weather_row(Ui *ui, const char *temp, const char *sun_text);  // "12° | 07:58"
void ui_set_precip(Ui *ui, int32_t mm);                      // shows "<mm>\nmm" column

// Show/hide status icons
void ui_show_bt_icon(Ui *ui, bool show);
void ui_show_batt_low_icon(Ui *ui, bool show);

// Re-layout everything (handles obstructed area & top row logic)
// last_uv, last_precip are used to decide if UV and precip are shown
void ui_relayout(Ui *ui, bool is_obstructed, int32_t last_uv, int32_t last_precip);

// Expose the main weather icon BitmapLayer to the weather module
BitmapLayer* ui_get_main_icon_layer(Ui *ui);
