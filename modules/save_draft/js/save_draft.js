'use strict';
(function ($) {

/**
 * Show summaries of selected options within tabs.
 */
  Backdrop.behaviors.saveDraftFieldsetSummaries = {
    attach: function (context) {
      // Remove publication status from the "Content promotion options" vertical
      // tab.
      $('fieldset.node-promotion-options', context).backdropSetSummary(function (context) {
        var vals = [];
  
        $('input:checked', context).parent().each(function () {
          vals.push(Backdrop.checkPlain($.trim($(this).text())));
        });
        if (vals.length) {
          return vals.join(', ');
        }
        else {
          return Backdrop.t('Not promoted');
        }
      });
  
      // Display save draft settings summary on the node options fieldet.
      $('fieldset#edit-save-draft', context).backdropSetSummary(function (context) {
        var vals = [];
  
        // Add summary text for each checked option.
        $('input:checked', context).next('label').each(function() {
          vals.push(Backdrop.checkPlain($(this).text()));
        });
  
        // For the case of the "Enabled" checkbox also handle the disabled state.
        if (!$('#edit-save-draft-enabled', context).is(':checked')) {
          vals.unshift(Backdrop.t('Disabled'));
        }
        return vals.join(', ');
      });
    }
  };

  $(document).ready(function() {
    $('#edit-schedule').removeClass('button-secondary');
  });

})(jQuery);
