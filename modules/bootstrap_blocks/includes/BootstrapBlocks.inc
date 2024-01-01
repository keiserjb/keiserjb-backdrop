
<?php

/**
 * PageComponents extends Block
 *
 * This class allows us to display the page title, local task tabs, 
 * local actions links, and messages in a block.
 */
class BootstrapBlocks {
  public $settings = array();


  /**
   * {@inheritdoc}
   */
  function getContent() {}

  /**
   * {@inheritdoc}
   */
  function form(&$form, &$form_state) {}

  /**
   * {@inheritdoc}
   */
  function formSubmit($form, &$form_state) {}

  /**
   * {@inheritdoc}
   */
  function getChildren() {}
}
