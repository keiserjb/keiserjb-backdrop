<?php

/**
 * Image card class.
 *
 * @Block(
 * id = "image_card",
 * admin_label = @Translation("Large card with image"),
 * )
 */
class ImageCard extends BootstrapBlocks {
  /**
   * {@inheritdoc}
   */
  function __construct() {

    $this->settings += array(
      'image' => '',
      'image_path' => '',
    );
  }

  /**
   * {@inheritdoc}
   */
  public function form(&$form, &$form_state) {

    $config = $this->settings;

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
      '#title' => t('Block padding'),
      '#options' => backdrop_map_assoc(array('0', 1, 2, 3, 4, 5)),
      '#default_value' => isset($config['card_padding'])
        ? $config['card_padding']
        : 3,
    ];

    $form['card_margin'] = [
      '#type' => 'select',
      '#title' => t('Block margin'),
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

    $form['image_position'] = [
      '#type' => 'radios',
      '#title' => t('Image position'),
      '#options' => array(
        'top' => t('Top'),
        'bottom' => t('Bottom'),
        'left' => t('Left'),
        'right' => t('Right'),
      ),
      '#default_value' => isset($config['image_position'])
        ? $config['image_position']
        : 'top',
    ];

    $upload_validators = array(
      'file_validate_extensions' => array('jpg jpeg png gif'),
      'file_validate_image_resolution' => array('3200x1600', '1200x300'),
    );
    $upload_description = theme('file_upload_help', array(
      'upload_validators' => $upload_validators,
    ));

    // Add an image field at the top of the settings form.
    $form['image'] = array(
      '#type' => 'managed_file',
      '#title' => t('Background image'),
      '#description' => $upload_description,
      '#default_value' => $this->settings['image'],
      '#upload_location' => 'public://hero/',
      '#upload_validators' => $upload_validators,
      '#weight' => -10,
    );
    // Store the image path separately.
    $form['image_path'] = array(
      '#type' => 'value',
      '#value' => $this->settings['image_path'],
    );

    // Disable reusable until a later date.
    $form['convert']['#access'] = FALSE;

    $form['card_title'] = [
      '#type' => 'textfield',
      '#title' => t('Card title:'),
      '#default_value' => isset($config['card_title'])
        ? $config['card_title']
        : '',
    ];

    $form['card_title_tag'] = [
      '#type' => 'select',
      '#options' => backdrop_map_assoc(array('h1', 'h2', 'h3', 'h4', 'h5', 'h6')),
      '#title' => t('Card title tag'),
      '#default_value' => isset($config['card_title_tag'])
        ? $config['card_title_tag']
        : 'h5',
    ];

    $form['card_content'] = [
      '#type' => 'textarea',
      '#title' => t('Card text:'),
      '#default_value' => isset($config['card_content'])
        ? $config['card_content']
        : '',
    ];
    $form['card_footer'] = [
      '#type' => 'textarea',
      '#title' => t('Card text:'),
      '#default_value' => isset($config['card_footer'])
        ? $config['card_footer']
        : '',
    ];

  }


  /**
   * Validates the form settings.
   */
  function formValidate($form, &$form_state) {

    // Check that one of title, text, or image, is provided.
    if (empty($form_state['values']['image']) && empty($form_state['values']['title']) && empty($form_state['values']['content']['value'])) {
      form_error($form['image'], t('Background image, a Display title, or Block content must be provided.'));
    }
  }

  /**
   * {@inheritdoc}
   */
  public function formSubmit($form, &$form_state) {


    $config = $this->settings;

    $values = $form_state['values'];

    // Save the things not handled by BlockText.
    if (!empty($form_state['values']['image'])) {
      $file = file_load($form_state['values']['image']);
      if ($form_state['values']['image'] != $form['image']['#default_value']) {
        // Record that the layout module is using this file. Also marks permanent.
        // But only if the value has changed.
        file_usage_add($file, 'layout', 'block', $file->fid);
        if (!empty($form['image']['#default_value'])) {
          // Decrement usage for replaced file.
          $old_file = file_load($form['image']['#default_value']);
          if ($old_file) {
            file_usage_delete($old_file, 'layout', 'block', $old_file->fid);
          }
        }
      }
      // Store the filepath separately for use as inline background image.
      $absolute_path = parse_url($GLOBALS['base_url'], PHP_URL_PATH) . '/';
      $fileurl = file_create_url($file->uri);
      $filepath = str_replace($GLOBALS['base_url'] . '/', $absolute_path, $fileurl);
      $form_state['values']['image_path'] = $filepath;
      $this->settings['image'] = $form_state['values']['image'];
      $this->settings['image_path'] = $form_state['values']['image_path'];
    }
    else {
      // No new file but an old one existed, decrement usage.
      if (!empty($form['image']['#default_value'])) {
        $old_file = file_load($form['image']['#default_value']);
        if ($old_file) {
          file_usage_delete($old_file, 'layout', 'block', $old_file->fid);
        }
      }
      $this->settings['image'] = NULL;
      $this->settings['image_path'] = NULL;
    }

    $this->settings['card_title'] = $values['card_title'];
    $this->settings['card_title_tag'] = $values['card_title_tag'];
    $this->settings['card_content'] = $values['card_content'];
    $this->settings['card_footer'] = $values['card_footer'];
    $this->settings['card_padding'] = $values['card_padding'];
    $this->settings['card_margin'] = $values['card_margin'];
    $this->settings['card_round'] = $values['card_round'];
    $this->settings['text_align'] = $values['text_align'];
    $this->settings['image_position'] = $values['image_position'];
  }

  /**
   * {@inheritdoc}
   */
  public function getContent() {
    if ($this->settings['image_position'] == 'top' || $this->settings['image_position'] == 'bottom') {
      $theme = 'image_card';
    }
    else {
      $theme = 'image_horizontal_card';
    }
    return [
      '#theme' => $theme,
      '#image_path' => $this->settings['image_path'],
      '#card_title' => $this->settings['card_title'],
      '#card_title_tag' => $this->settings['card_title_tag'],
      '#card_content' => $this->settings['card_content'],
      '#card_footer' => $this->settings['card_footer'],
      '#card_padding' => $this->settings['card_padding'],
      '#card_margin' => $this->settings['card_margin'],
      '#card_round' => $this->settings['card_round'],
      '#text_align' => $this->settings['text_align'],
      '#image_position' => $this->settings['image_position'],
    ];
  }
}
