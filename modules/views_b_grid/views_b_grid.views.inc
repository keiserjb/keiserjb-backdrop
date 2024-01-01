<?php
/**
 * @file
 * Provide views data and handlers for views_b_grid module.
 */

/**
 * Implements hook_views_plugins().
 */
function views_b_grid_views_plugins() {
  return array(
    'style' => array(
      'flexviews' => array(
        'title' => t('Bootstrap 4 grid'),
        'handler' => 'views_plugin_style_views_b_grid',
        'help' => t("Display content in Views B Grid"),
        'theme' => 'views_view_views_b_grid',
        'type' => 'normal',
        'path' => backdrop_get_path('module', 'views_b_grid'),
        'theme path' => backdrop_get_path('module', 'views_b_grid'),
        'uses row plugin' => TRUE,
        'uses row class' => TRUE,
        'uses grouping' => FALSE,
        'uses options' => TRUE,
      ),
    ),
  );
}

