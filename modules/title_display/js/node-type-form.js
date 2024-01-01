/**
 * @file
 * Set summary for the Title Display settings on node type forms.
 */
(function ($) {
  "use strict";

  Backdrop.behaviors.titleDisplaySummary = {
    attach: function (context) {
      // Provide the vertical tab summaries.
      $('fieldset#edit-title-display', context).backdropSetSummary(function (context) {
        var vals = [];
        $('input[name^="title_display[enabled_view_modes]"]', context).each(function () {
          if (this.checked) {
            vals.push($(this).siblings('label').text().trim());
          }
        });
        if (vals.length) {
          return Backdrop.t('Enabled on: @modes', { '@modes': vals.join(', ') });
        }
        else {
          return Backdrop.t('Disabled');
        }
      });
    }
  };

})(jQuery);
