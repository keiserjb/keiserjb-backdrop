<?php
/**
 * @file
 * Administration page callbacks for the Jarallax module.
 */

/**
 * Callback function for admin settings form.
 */
function jarallax_admin($form, &$form_state) {
  $settings = config_get('jarallax.settings');
  $i = 1;

  // Get active themes.
  $active_themes = array();
  foreach (list_themes() as $theme) {
    if ($theme->status) {
      $active_themes[$theme->name] = $theme->info['name'];
    }
  }

  // Add default value fields.
  $form['config'] = array(
    '#type' => 'fieldset',
    '#title' => t('Default settings'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  jarallax_add_form_elements($form['config'], $settings['config']);

  $form['triggers_fieldset'] = array(
    '#type' => 'vertical_tabs',
  );

  // Add element value fields.
  if (!empty($settings['triggers_fieldset'])) {
    foreach ($settings['triggers_fieldset'] as $trigger) {
      $form["trigger$i"] = array(
        '#type' => 'fieldset',
        '#title' => $trigger['element'],
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#group' => 'triggers_fieldset',
      );
      $form["trigger$i"]['element'] = array(
        '#type' => 'textfield',
        '#title' => t('jQuery selector'),
        '#description' => t("A jQuery selector to identify the element(s) to apply Jarallax to. For example, for a hero block you could use '.block-hero'."),
        '#default_value' => isset($trigger['element']) ? $trigger['element'] : '',
        '#required' => TRUE,
      );
      jarallax_add_form_elements($form["trigger$i"], $trigger, TRUE, t('- Default -'));
      $form["trigger$i"]['delete'] = array(
        '#type' => 'submit',
        '#value' => t('Delete element'),
        '#submit' => array('jarallax_admin_delete_submit'),
        '#limit_validation_errors' => array(),
        '#attributes' => array('class' => array('button-danger')),
      );
      $i++;
    }
  }

  // Add new value fields.
  $form["trigger$i"] = array(
    '#type' => 'fieldset',
    '#title' => t('New element'),
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#group' => 'triggers_fieldset'
  );
  $form["trigger$i"]['element'] = array(
    '#type' => 'textfield',
    '#title' => t('jQuery selector'),
    '#description' => t("A jQuery selector to identify the element(s) to apply Jarallax to. For example, for a hero block you could use '.block-hero'."),
    '#default_value' => '',
  );
  jarallax_add_form_elements($form["trigger$i"], '', FALSE, t('- Default -'));

  // Add page fields.
  $form['pages'] = array(
    '#type' => 'fieldset',
    '#title' => t('Pages visibility'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['pages']['visibility'] = array(
    '#type' => 'radios',
    '#title' => t('Activate on specific pages'),
    '#options' => array(
      0 => t('All pages except those listed'),
      1 => t('Only the listed pages'),
    ),
    '#default_value' => $settings['pages']['visibility'],
  );
  $form['pages']['pages'] = array(
    '#type' => 'textarea',
    '#title' => t('List of pages to activate'),
    '#description' => t("Specify pages by using their paths. Enter one path per line. The '*' character is a wildcard. Example paths are %blog for the blog page and %blog-wildcard for every personal blog. %front is the front page.", array('%blog' => 'blog', '%blog-wildcard' => 'blog/*', '%front' => '<front>')),
    '#default_value' => $settings['pages']['pages'],
  );

  // Add theme fields.
  $form['theme'] = array(
    '#type' => 'fieldset',
    '#title' => t('Themes visibility'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );
  $form['theme']['visibility'] = array(
    '#type' => 'radios',
    '#title' => t('Activate on specific themes'),
    '#options' => array(
      0 => t('All themes except those listed'),
      1 => t('Only the listed themes'),
    ),
    '#default_value' => $settings['theme']['visibility'],
  );
  $form['theme']['themes'] = array(
    '#type' => 'select',
    '#title' => t('List of themes to activate'),
    '#description' => t("Specify in which themes you wish the library to load."),
    '#options' => $active_themes,
    '#default_value' => $settings['theme']['themes'],
    '#multiple' => TRUE,
  );

  $form['#tree'] = TRUE;
  $form['actions'] = array(
    '#type' => 'actions',
    'submit' => array(
      '#type' => 'submit',
      '#value' => t('Save configuration'),
    ),
  );
  $form['#submit'][] = 'jarallax_admin_form_submit';

  return $form;
}

/**
 * Delete an element.
 */
function jarallax_admin_delete_submit($form, &$form_state) {
  $element = $form_state['clicked_button']['#parents'][0];
  config_clear('jarallax.settings', "triggers_fieldset.$element");
  backdrop_set_message(t('The element has been deleted.'));
}

/**
 * Form submission handler.
 */
function jarallax_admin_form_submit($form, &$form_state) {
  $values = &$form_state['values'];
  $config = config('jarallax.settings');

  // Exclude unnecessary elements.
  form_state_values_clean($form_state);
  unset($values['triggers_fieldset']);
  unset($values['actions']);

  // Save to config.
  foreach ($values as $key => $value) {
    if (substr($key, 0, 7) == 'trigger') {
      // Skip empty elements.
      if (empty($value['element'])) {
        continue;
      }

      $config->set("triggers_fieldset.$key", $value);
    }
    else {
      $config->set($key, $value);
    }
  }
  $config->save();

  backdrop_set_message(t('The configuration options have been saved.'));
}

/**
 * Add elements to a form.
 *
 * Defining the fields once here helps reduce duplication.
 */
function jarallax_add_form_elements(&$form, $defaults = '', $isset = FALSE, $empty_option = FALSE) {
  $options['img_element'] = array(
    '#type' => 'textfield',
    '#title' => t('imgElement jQuery selector'),
    '#description' => t("A jQuery selector to identify the image tag that will be used as a background, within the main selector. For example 'img' or '.bgimg'."),
    '#default_value' => '',
    '#required' => TRUE,
  );
  $options['type'] = array(
    '#type' => 'select',
    '#title' => t('Type'),
    '#options' => array(
      'scroll' => t('Scroll'),
      'scale' => t('Scale'),
      'opacity' => t('Opacity'),
      'scroll-opacity' => t('Scroll-Opacity'),
      'scale-opacity' => t('Scale-Opacity'),
    ),
  );
  $options['speed'] = array(
    '#type' => 'textfield',
    '#title' => t('Speed'),
    '#description' => t("Parallax effect speed. Provide numbers from -1.0 to 2.0."),
    '#default_value' => '0.5',
  );
  if (empty($defaults)) {
    $defaults = array(
      'type' => 'scroll',
      'speed' => '0.5',
      'img_element' => 'img',
    );
  }
  foreach ($options as $key => $value) {
    // Set default values.
    if (empty($defaults)) {
      $options[$key]['#default_value'] = '';
    }
    else {
      if (!$isset) {
        $options[$key]['#default_value'] = $defaults[$key];
      }
      else {
        $options[$key]['#default_value'] = isset($defaults[$key]) ? $defaults[$key] : '';
      }
    }

    // Set empty options.
    if (!empty($empty_option) && $value['#type'] == 'select') {
      $options[$key]['#empty_option'] = $empty_option;
    }

    // Set textfield size.
    if ($value['#type'] == 'textfield') {
      $options[$key]['#size'] = 6;
    }
  }

  $form = array_merge($form, $options);
}

