<?php

/**
 * @file
 * Admin page callbacks for the Read More Extra Field module.
 */

/**
 * Admin form.
 *
 * @see readmore_extrafield_admin_form_submit()
 * @see system_settings_form()
 */
function readmore_extrafield_admin_form($form, &$form_state) {
  $settings = config_get('readmore_extrafield.settings', 'readmore_extrafield_variables');

  $entities = array();
  foreach (entity_get_info() as $type => $info) {
    $full_info = entity_get_info($type);
    if (isset($full_info['fieldable'], $full_info['bundles']) && $full_info['fieldable']) {
      $entities[$type] = array_keys($full_info['bundles']);
    }
  }

  $form['#config'] = 'readmore_extrafield.settings';
  $form['readmore_extrafield_variables'] = array(
    '#type' => 'vertical_tabs',
    '#tree' => TRUE,
  );

  foreach ($entities as $type => $bundles) {

    foreach ($bundles as $bundle) {

      $key = $type . '--' . $bundle;
      $form['readmore_extrafield_variables'][$key] = array(
        '#type' => 'fieldset',
        '#title' => $type . '--' . $bundle,
      );

      $form['readmore_extrafield_variables'][$key][] = array(
        '#markup' => '<h3>' . t('Entity : @type--@bundle', array('@type' => $type, '@bundle' => $bundle)) . '</h3>',
      );

      $bundle_form = readmore_extrafield_admin_bundle_settings_form($type, $bundle);
      $form['readmore_extrafield_variables'][$key] += $bundle_form;
    }
  }

  $form['#submit'][] = 'readmore_extrafield_admin_form_submit';

  return system_settings_form($form);
}

/**
 * Form submission handler.
 *
 * @see readmore_extrafield_admin_form()
 */
function readmore_extrafield_admin_form_submit($form, &$form_state) {
  // Flush the field module cache.
  $cache_tables = module_invoke('field', 'flush_caches');
  foreach ($cache_tables as $table) {
    cache_clear_all('*', $table, TRUE);
  }
  backdrop_set_message(t('Fields cache flushed'), 'status', FALSE);

  // Set default display settings for enabled bundles
  foreach ($form_state['values']['readmore_extrafield_variables'] as $key => $settings) {
    if (strpos($key, '--') && is_array($settings) && !empty($settings['rmef_enable'])) {

      list($entity_type, $bundle) = explode('--', $key);

      // Find all enabled view modes with the bundle
      $view_modes = array('default');
      foreach (field_view_mode_settings($entity_type, $bundle) as $view_mode => $view_mode_settings) {
        if ($view_mode_settings['custom_settings']) {
          $view_modes[] = $view_mode;
        }
      }

      $bundle_settings = field_bundle_settings($entity_type, $bundle);
      foreach ($view_modes as $view_mode) {
        // Don't overwrite already existing display settings
        if (!isset($bundle_settings['extra_fields']['display']['readmore_extrafield'][$view_mode])) {
          $bundle_settings['extra_fields']['display']['readmore_extrafield'][$view_mode] = array(
            // By default, the extra field will be set as the last field
            'weight' => 1 + (int) field_info_max_weight($entity_type, $bundle, $view_mode),
            // By default, the extra field will be only visible in Teaser view mode
            'visible' => ($view_mode == 'teaser'),
          );
        }
      }
      field_bundle_settings($entity_type, $bundle, $bundle_settings);
    }
  }
}
