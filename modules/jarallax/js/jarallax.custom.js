/**
 * @file
 * Activate Jarallax on selected elements.
 */

(function ($) {
  Backdrop.behaviors.jarallax = {
    attach: function (context, settings) {

      var triggers = Backdrop.settings.jarallax;

      $.each(triggers, function (key, trigger) {
        $(trigger.element).addClass('jarallax-element');
        $(trigger.element + ' ' + trigger.img_element).addClass('jarallax-image');
        var config = {};

        if (trigger.speed) {
          config.speed = parseFloat(trigger.speed);
        }
        if (trigger.img_element) {
          config.imgElement = String(trigger.img_element);
        }
        if (trigger.type) {
          config.type = String(trigger.type);
        }
        $(trigger.element).jarallax(
          config
        );
      });

    }
  };
}(jQuery));

