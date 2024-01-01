<?php

/**
 * Tabs vertical class.
 *
 * @Block(
 * id = "tabs_vertical",
 * admin_label = @Translation("Vertical Tabs"),
 * )
 */
class CardGrid extends BootstrapBlocks {
  /**
   * {@inheritdoc}
   */
  public function form(&$form, &$form_state) {

    $config = $this->settings;


    $config = $this->settings;

    $form['card_columns'] = [
      '#type' => 'select',
      '#title' => t('Number of columns'),
      '#options' => backdrop_map_assoc(array('auto', 1, 2, 3, 4, 5, 6)),
      '#default_value' => isset($config['card_columns'])
        ? $config['card_columns']
        : 'auto',
    ];

    $form['card_round'] = [
      '#type' => 'select',
      '#title' => t('Card border rounding:'),
      '#options' => array(0, 1, 2, 3),
      '#default_value' => isset($config['card_round'])
        ? $config['card_round']
        : 0,
    ];

    $form['card_padding'] = [
      '#type' => 'select',
      '#title' => t('Card paddings'),
      '#options' => backdrop_map_assoc(array('0', 1, 2, 3, 4, 5)),
      '#default_value' => isset($config['card_padding'])
        ? $config['card_padding']
        : 3,
    ];

    $form['card_gutter'] = [
      '#type' => 'select',
      '#title' => t('Card gutter width'),
      '#options' => backdrop_map_assoc(array('0', 1, 2, 3, 4, 5)),
      '#default_value' => isset($config['card_gutter'])
        ? $config['card_gutter']
        : 4,
    ];

    $form['card_margin'] = [
      '#type' => 'select',
      '#title' => t('Card group margin'),
      '#options' => backdrop_map_assoc(array('0', 1, 2, 3, 4, 5)),
      '#default_value' => isset($config['card_margin'])
        ? $config['card_margin']
        : 3,
    ];

    $form['text_align'] = [
      '#type' => 'select',
      '#title' => t('Card text alignment'),
      '#options' => array(
        'left' => t('Left'),
        'right' => t('Right'),
        'center' => t('Center'),
      ),
      '#default_value' => isset($config['text_align'])
        ? $config['text_align']
        : 'left',
    ];
    $form['card_title_tag'] = [
      '#type' => 'select',
      '#options' => backdrop_map_assoc(array('h1', 'h2', 'h3', 'h4', 'h5', 'h6')),
      '#title' => t('Card title tag'),
      '#default_value' => isset($config['card_title_tag'])
        ? $config['card_title_tag']
        : 'h5',
    ];

    if (!isset($form_state['cards']) && empty($config['cards'])) {
      $cards = $form_state['cards'] = [['card_title' => '', 'card_content' => '', 'card_header' => '', 'card_footer' => '']];
    }
    elseif (isset($form_state['cards'])) {
      $cards = $form_state['cards'];
    }
    elseif (isset($config['cards'])) {
      $cards = $form_state['cards'] = $config['cards'];
    }

    $form['cards'] = [
      '#type' => 'container',
      '#title' => t('Tabs'),
      '#id' => 'bootstrap_blocks_tabs_wrapper',
    ];
    foreach ($cards as $index => $card) {
      $index++;
      $form['cards']['card' . $index] = [
        '#type' => 'fieldset',
        '#title' => t('Card ' . $index),
      ];
      $form['cards']['card' . $index]['card_header'] = [
        '#type' => 'textfield',
        '#title' => t('Card header:'),
        '#default_value' => isset($card['card_header'])
          ? $card['card_header']
          : '',
      ];

      $form['cards']['card' . $index]['card_title'] = [
        '#type' => 'textfield',
        '#title' => t('Card title:'),
        '#default_value' => isset($card['card_title'])
          ? $card['card_title']
          : '',
      ];
      $form['cards']['card' . $index]['card_content'] = [
        '#type' => 'textarea',
        '#rows' => 3,
        '#title' => t('Card text:'),
        '#default_value' => isset($card['card_content'])
          ? $card['card_content']
          : '',
      ];
      $form['cards']['card' . $index]['card_footer'] = [
        '#type' => 'textarea',
        '#rows' => 3,
        '#title' => t('Card footer'),
        '#default_value' => isset($card['card_footer'])
          ? $card['card_footer']
          : '',
      ];

    }
    $form['add_tab'] = [
      '#type' => 'submit',
      '#submit' => array('bootstrap_blocks_add_card_submit'),
      '#value' => 'Add card',
      '#ajax' => array(
        'wrapper' => 'bootstrap_blocks_tabs_wrapper',
        'callback' => 'bootstrap_blocks_add_card_ajax',
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

    $this->settings['card_padding'] = $values['card_padding'];
    $this->settings['card_gutter'] = $values['card_gutter'];
    $this->settings['card_columns'] = $values['card_columns'];
    $this->settings['card_margin'] = $values['card_margin'];
    $this->settings['card_round'] = $values['card_round'];
    $this->settings['text_align'] = $values['text_align'];
    $this->settings['card_title_tag'] = $values['card_title_tag'];
    $this->settings['bblock_id'] = $values['bblock_id_wrapper']['bblock_id'];
    foreach ($values['cards'] as $index => $card) {
      if (empty($card['card_content']) && empty($card['card_header']) && empty($card['card_footer']) && empty($card['card_title'])) {
        unset($values['cards'][$index]);
      }
    }
    $this->settings['cards'] = array_values($values['cards']);
  }

  /**
   * {@inheritdoc}
   */
  public function getContent() {
    return [
      '#theme' => 'card_grid',
      '#card_columns' => $this->settings['card_columns'],
      '#card_gutter' => $this->settings['card_gutter'],
      '#card_padding' => $this->settings['card_padding'],
      '#card_margin' => $this->settings['card_margin'],
      '#card_round' => $this->settings['card_round'],
      '#card_title_tag' => $this->settings['card_title_tag'],
      '#text_align' => $this->settings['text_align'],
      '#bblock_id' => $this->settings['bblock_id'],
      '#cards' => $this->settings['cards'],
    ];
  }
}
