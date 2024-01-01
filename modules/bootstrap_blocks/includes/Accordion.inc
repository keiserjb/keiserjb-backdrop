<?php

/**
 * Tabs vertical class.
 *
 * @Block(
 * id = "tabs_vertical",
 * admin_label = @Translation("Vertical Tabs"),
 * )
 */
class Accordion extends BootstrapBlocks {
  /**
   * {@inheritdoc}
   */
  public function form(&$form, &$form_state) {

    $config = $this->settings;

    $form['tabs_padding'] = [
      '#type' => 'select',
      '#title' => t('Block padding'),
      '#options' => backdrop_map_assoc(array('0', 1, 2, 3, 4, 5)),
      '#default_value' => isset($config['tabs_padding'])
        ? $config['tabs_padding']
        : 3,
    ];

    $form['tabs_margin'] = [
      '#type' => 'select',
      '#title' => t('Block margin'),
      '#options' => backdrop_map_assoc(array('0', 1, 2, 3, 4, 5)),
      '#default_value' => isset($config['tabs_margin'])
        ? $config['tabs_margin']
        : 3,
    ];

    $form['always_open'] = [
      '#type' => 'checkbox',
      '#title' => t('Tabs stay open when another tab is clicked.'),
      '#default_value' => isset($config['always_open'])
        ? $config['always_open']
        : 0,
    ];

    if (!isset($form_state['tabs']) && empty($config['tabs'])) {
      $tabs = $form_state['tabs'] = [['title' => '', 'content' => '']];
    }
    elseif (isset($form_state['tabs'])) {
      $tabs = $form_state['tabs'];
    }
    elseif (isset($config['tabs'])) {
      $tabs = $form_state['tabs'] = $config['tabs'];
    }

    $form['tabs'] = [
      '#type' => 'container',
      '#title' => t('Tabs'),
       '#id' => 'bootstrap_blocks_tabs_wrapper',
    ];
    foreach ($tabs as $index => $tab) {
      $index++;
      $form['tabs']['tabs' . $index] = [
        '#type' => 'fieldset',
        '#title' => t('Tab ' . $index),
      ];
      $form['tabs']['tabs' . $index]['title'] = [
        '#type' => 'textfield',
        '#title' => t('Title of tab ' . $index),
        '#default_value' => $tab['title'],
      ];

      $form['tabs']['tabs' . $index]['content'] = [
        '#type' => 'textarea',
        '#rows' => 3,
        '#title' => t('Content of tab ' . $index),
        '#default_value' => $tab['content'],
      ];
    }
    $form['add_tab'] = [
      '#type' => 'submit',
      '#submit' => array('bootstrap_blocks_add_tab_submit'),
      '#value' => 'Add tab',
      '#ajax' => array(
        'wrapper' => 'bootstrap_blocks_tabs_wrapper',
        'callback' => 'bootstrap_blocks_add_tab_ajax',
        'effect' => 'slide',
      ),
    ];


  }

  /**
   * {@inheritdoc}
   */
  public function formSubmit($form, &$form_state) {
    $config = $this->settings;

    $values = $form_state['values'];

    $this->settings['tabs_padding'] = $values['tabs_padding'];
    $this->settings['tabs_margin'] = $values['tabs_margin'];
    $this->settings['always_open'] = $values['always_open'];
    $this->settings['bblock_id'] = $values['bblock_id_wrapper']['bblock_id'];
    foreach ($values['tabs'] as $index => $tab) {
      if (empty($tab['title']) && empty($tab['content'])) {
        unset($values['tabs'][$index]);
      }
    }
    $this->settings['tabs'] = array_values($values['tabs']);
  }

  /**
   * {@inheritdoc}
   */
  public function getContent() {
    return [
      '#theme' => 'accordion',
      '#tabs_padding' => $this->settings['tabs_padding'],
      '#tabs_margin' => $this->settings['tabs_margin'],
      '#always_open' => $this->settings['always_open'],
      '#bblock_id' => $this->settings['bblock_id'],
      '#tabs' => $this->settings['tabs'],
    ];
  }
}
