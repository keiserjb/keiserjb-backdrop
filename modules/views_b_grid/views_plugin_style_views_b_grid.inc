<?php

/**
 * @file
 * Contains the views_b_grid style plugin.
 */

class views_plugin_style_views_b_grid extends views_plugin_style {

  /**
   * Set default options
   */
  // function options(&$options) {
    // parent::options($options);


function option_definition() {
    $options = parent::option_definition();
    $options['layout_type'] = array('default' => 'fixed_container');
    return $options;
  }

  /**
   * Render the given style.
   */
  function options_form(&$form, &$form_state) {
    parent::options_form($form, $form_state);
    $form['layout_info'] = array(
      '#markup' => '<h4>' . t('Layout tips') . '</h4><p>' . t('Using this format will print out this View in a markup format just like the core Backdrop 1.4+ layouts which rely on Bootstrap 4 flexbox-based grid system. Read more about the <a href="https://v4-alpha.getbootstrap.com/layout/grid">grid options</a>. You will need to experiment with the grid choices. Not all are going to work well since you can only apply the same classes to all of the Views rows. You are encouraged to add multiple classes so the columns work the way you want them to for each breakpoint. For example, you can try complex column arrangements like "col-xs-12 col-sm-6 col-md-3 col-lg-4 col-xl-2", which will create columns ranging from 1 on the smallest device to 6 on the largest for the same content.') . '</p>',
    );
    $form['layout_type'] = array(
      '#type' => 'radios',
      '#title' => t('Layout Type'),
      '#options' => array('full_width_container' => t('Full width container'), 'fixed_container' => t('Fixed width container')),
      '#default_value' => $this->options['layout_type'],
      '#description' => t('Choose the type of container to use that wraps around this views grid. You can enter the Bootstrap grid classes in the Row Class field above to create grids for your view.'),
    );
  }

}
