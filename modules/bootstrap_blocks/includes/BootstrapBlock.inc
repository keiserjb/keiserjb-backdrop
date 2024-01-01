
<?php

/**
 * PageComponents extends Block
 *
 * This class allows us to display the page title, local task tabs, 
 * local actions links, and messages in a block.
 */
class BootstrapBlock extends Block {
  public $child_class;

  function __construct($plugin_name, array $data) {
    parent::__construct($plugin_name, $data);

    if (isset($this->childDelta)) {
      $this->setSettings();
    }
  }


  /**
   * {@inheritdoc}
   */
  function setSettings() {
    $children = $this->getChildren();
    $child = $children[$this->childDelta]['class'];

    $this->child_class = new $child();
    $this->child_class->settings = array_merge($this->child_class->settings, $this->settings);
  }

  /**
   * {@inheritdoc}
   */
  function getAdminTitle() {
    if (!empty($this->settings['admin_label'])) {
      return check_plain($this->settings['admin_label']);
    }

    $children = $this->getChildren();
    $title = $children[$this->childDelta]['info'];
    return strlen($this->settings['title']) ? check_plain($this->settings['title']) : $title;
  }

  /**
   * {@inheritdoc}
   */
  function getContent() {

    return $this->child_class->getContent();
  }

  /**
   * {@inheritdoc}
   */
  function form(&$form, &$form_state) {
    parent::form($form, $form_state);

    if (empty($this->child_class)) {
      $this->setSettings();
    }
    $this->child_class->form($form, $form_state);

    $form['bblock_id_wrapper'] = [
      '#type' => 'fieldset',
      '#title' => t('Bootstrap block ID'),
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
    ];
    $form['bblock_id_wrapper']['bblock_id'] = [
      '#type' => 'textfield',
      '#title' => t('Block ID'),
      '#description' => t('Optional ID. Should be unique.'),
      '#default_value' => isset($this->settings['bblock_id']) ? $this->settings['bblock_id'] : '',
    ];

  }

  /**
   * {@inheritdoc}
   */
  function formSubmit($form, &$form_state) {
    parent::formSubmit($form, $form_state);

    $this->child_class->formSubmit($form, $form_state);
    $this->settings = array_merge($this->settings, $this->child_class->settings);
    $this->settings['bblock_id'] = $form_state['values']['bblock_id_wrapper']['bblock_id'];
  }

  /**
   * {@inheritdoc}
   */
  function getChildren() {
    return bootstrap_blocks_get_children();
  }
}
