/**
 * @file
 * Activate Paroller on selected elements.
 */
 
(function($) {
  Backdrop.behaviors.paroller = {
    attach: function(context, settings) {

      var triggers = Backdrop.settings.jarallax;

      $.each(triggers, function(key, trigger) {
        var config = {};

        if (trigger.speed) {
          config.speed = parseFloat(trigger.speed);
        }
        if (trigger.type) {
          config.type = trigger.type;
        }
        $(trigger.element).jarallax(
          config
        );
      });

    }
  };
}(jQuery));

