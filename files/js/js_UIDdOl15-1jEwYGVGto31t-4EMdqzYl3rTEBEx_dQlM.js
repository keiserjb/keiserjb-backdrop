/*! @drupal/once - v1.0.1 - 2021-06-12 */
var once=function(){"use strict";var n=/[\11\12\14\15\40]+/,e="data-once",t=document;function r(n,t,r){return n[t+"Attribute"](e,r)}function o(e){if("string"!=typeof e)throw new TypeError("once ID must be a string");if(""===e||n.test(e))throw new RangeError("once ID must not be empty or contain spaces");return'[data-once~="'+e+'"]'}function u(n){if(!(n instanceof Element))throw new TypeError("The element must be an instance of Element");return!0}function i(n,e){void 0===e&&(e=t);var r=n;if(null===n)r=[];else{if(!n)throw new TypeError("Selector must not be empty");"string"!=typeof n||e!==t&&!u(e)?n instanceof Element&&(r=[n]):r=e.querySelectorAll(n)}return Array.prototype.slice.call(r)}function c(n,e,t){return e.filter((function(e){var r=u(e)&&e.matches(n);return r&&t&&t(e),r}))}function f(e,t){var o=t.add,u=t.remove,i=[];r(e,"has")&&r(e,"get").trim().split(n).forEach((function(n){i.indexOf(n)<0&&n!==u&&i.push(n)})),o&&i.push(o);var c=i.join(" ");r(e,""===c?"remove":"set",c)}function a(n,e,t){return c(":not("+o(n)+")",i(e,t),(function(e){return f(e,{add:n})}))}return a.remove=function(n,e,t){return c(o(n),i(e,t),(function(e){return f(e,{remove:n})}))},a.filter=function(n,e,t){return c(o(n),i(e,t))},a.find=function(n,e){return i(n?o(n):"[data-once]",e)},a}();
;

/**
 * Cookie plugin 1.0
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie=function(b,j,m){if(typeof j!="undefined"){m=m||{};if(j===null){j="";m.expires=-1}var e="";if(m.expires&&(typeof m.expires=="number"||m.expires.toUTCString)){var f;if(typeof m.expires=="number"){f=new Date();f.setTime(f.getTime()+(m.expires*24*60*60*1000))}else{f=m.expires}e="; expires="+f.toUTCString()}var l=m.path?"; path="+(m.path):"";var g=m.domain?"; domain="+(m.domain):"";var a=m.secure?"; secure":"";document.cookie=[b,"=",encodeURIComponent(j),e,l,g,a].join("")}else{var d=null;if(document.cookie&&document.cookie!=""){var k=document.cookie.split(";");for(var h=0;h<k.length;h++){var c=jQuery.trim(k[h]);if(c.substring(0,b.length+1)==(b+"=")){d=decodeURIComponent(c.substring(b.length+1));break}}}return d}};
;
/**
 * @file layout.admin.js
 *
 * Behaviors for editing a layout.
 */

(function ($) {

"use strict";

/**
 * Behavior for showing a list of layouts.
 *
 * Detect flexbox support for displaying our list of layouts with vertical
 * height matching for each row of layout template icons.
 */
Backdrop.behaviors.gridFloatFallback = {
  attach: function() {
    var $body = $('body');
    if (!$body.hasClass('grid-float-fallback-processed') && !Backdrop.featureDetect.flexbox()) {
      $('head').append('<link rel="stylesheet" type="text/css" href="/core/modules/layout/css/grid-float.css">');
      $body.addClass('grid-float-fallback-processed');
    }
  }
};

})(jQuery);
;
(function ($) {

"use strict";

/**
 * Process elements with the .dropbutton class on page load.
 */
Backdrop.behaviors.dropButton = {
  attach: function (context, settings) {
    var $dropbuttons = $(context).find('.dropbutton-wrapper').once('dropbutton');
    if ($dropbuttons.length) {
      // Adds the delegated handler that will toggle dropdowns on click.
      var $body = $('body').once('dropbutton-click');
      if ($body.length) {
        $body.on('click', '.dropbutton-toggle', dropbuttonClickHandler);
      }
      // Initialize all buttons.
      for (var i = 0, il = $dropbuttons.length; i < il; i++) {
        DropButton.dropbuttons.push(new DropButton($dropbuttons[i], settings.dropbutton));
      }
    }
  }
};

/**
 * Set the min-width of dropbuttons (and their parent) to handle all of the
 * link widths.
 */
Backdrop.behaviors.dropButtonWidths = {
  attach: function(context, settings) {
    function adjustDropButtonWidths() {
      var $dropbutton = $(this);

      // Get widest item width.
      var widestItem = 0, $item;
      $dropbutton.find('li:hidden').each(function() {
        // Use a clone element to avoid altering element CSS properties.
        $item = $(this).clone().insertAfter($(this)).show().css('visibility', 'hidden');
        widestItem = Math.max($item.outerWidth(), widestItem);
        $item.remove();
      });

      // Set dropbutton list (<ul>) as wide as its widest child.
      $dropbutton.find('.dropbutton').css('min-width', widestItem + 'px');

      // Set parent element min-width, like <td class="operations"> to prevent
      // overflow issue (See #2806).
      $dropbutton.parent().css('min-width', $dropbutton.find('.dropbutton-widget').outerWidth() + 'px');
    }

    // Get the font size and family for an element in a dropbutton if one
    // exists. If none exist, then we don't need to do any processing.
    var $link = $('.dropbutton li a').first();
    if ($link.length == 0) {
      return;
    }
    var fontSize = $link.css('font-size');
    var fontList = $link.css('font-family').split(', ');
    var actualFont = fontList.find(font => document.fonts.check(fontSize + ` ${font}`));

    // Calculate dropbutton elements width once the font is loaded.
    Backdrop.isFontLoaded(actualFont, function() {
      $(context).find('.dropbutton-wrapper').once('dropbutton-width', adjustDropButtonWidths);
    });

  }
};

/**
 * Delegated callback for opening and closing dropbutton secondary actions.
 */
function dropbuttonClickHandler (e) {
  e.preventDefault();
  $(e.target).closest('.dropbutton-wrapper').toggleClass('open');
}

/**
 * A DropButton presents an HTML list as a button with a primary action.
 *
 * All secondary actions beyond the first in the list are presented in a
 * dropdown list accessible through a toggle arrow associated with the button.
 *
 * @param DOMElement dropbutton
 *   A DOM element.
 *
 * @param {Object} settings
 *   A list of options including:
 *    - {String} title: The text inside the toggle link element. This text is
 *      hidden from visual UAs.
 */
function DropButton (dropbutton, settings) {
  // Merge defaults with settings.
  var options = $.extend({'title': Backdrop.t('List additional actions')}, settings);
  var $dropbutton = $(dropbutton);
  this.$dropbutton = $dropbutton;
  this.$list = $dropbutton.find('.dropbutton');
  // Find actions and mark them.
  this.$actions = this.$list.find('li').addClass('dropbutton-action');

  // Add the special dropdown only if there are hidden actions.
  if (this.$actions.length > 1) {
    // Identify the first element of the collection.
    var $primary = this.$actions.slice(0,1);
    // Identify the secondary actions.
    var $secondary = this.$actions.slice(1);
    $secondary.addClass('secondary-action');
    // Add toggle link.
    $primary.after(Backdrop.theme('dropbuttonToggle', options));
    // Bind mouse events.
    this.$dropbutton
      .addClass('dropbutton-multiple')
      .on({
        /**
         * Adds a timeout to close the dropdown on mouseleave.
         */
        'mouseleave.dropbutton': $.proxy(this.hoverOut, this),
        /**
         * Clears timeout when mouseout of the dropdown.
         */
        'mouseenter.dropbutton': $.proxy(this.hoverIn, this),
        /**
         * Similar to mouseleave/mouseenter, but for keyboard navigation.
         */
        'focusout.dropbutton': $.proxy(this.focusOut, this),
        'focusin.dropbutton': $.proxy(this.focusIn, this)
      });
  }
  else {
    this.$dropbutton.addClass('dropbutton-single');
  }
}

/**
 * Extend the DropButton constructor.
 */
$.extend(DropButton, {
  /**
   * Store all processed DropButtons.
   *
   * @type {Array}
   */
  dropbuttons: []
});

/**
 * Extend the DropButton prototype.
 */
$.extend(DropButton.prototype, {
  /**
   * Toggle the dropbutton open and closed.
   *
   * @param {Boolean} show
   *   (optional) Force the dropbutton to open by passing true or to close by
   *   passing false.
   */
  toggle: function (show) {
    var isBool = typeof show === 'boolean';
    show = isBool ? show : !this.$dropbutton.hasClass('open');
    this.$dropbutton.toggleClass('open', show);
  },

  hoverIn: function () {
    // Clear any previous timer we were using.
    if (this.timerID) {
      window.clearTimeout(this.timerID);
    }
  },

  hoverOut: function () {
    // Wait half a second before closing.
    this.timerID = window.setTimeout($.proxy(this, 'close'), 500);
  },

  open: function () {
    this.toggle(true);
  },

  close: function () {
    this.toggle(false);
  },

  focusOut: function(e) {
    this.hoverOut.call(this, e);
  },

  focusIn: function(e) {
    this.hoverIn.call(this, e);
  }
});

/**
 * A toggle is an interactive element often bound to a click handler.
 *
 * @param {Object} options
 *   - {String} title: (optional) The HTML anchor title attribute and
 *     text for the inner span element.
 *
 * @return {String}
 *   A string representing a DOM fragment.
 */
Backdrop.theme.prototype.dropbuttonToggle = function (options) {
  return '<li class="dropbutton-toggle"><button type="button" role="button"><span class="dropbutton-arrow"><span class="visually-hidden">' + options.title + '</span></span></button></li>';
};

// Expose constructor in the public space.
Backdrop.DropButton = DropButton;

})(jQuery);
;
(function ($) {

"use strict";

/**
 * Attach the tableResponsive function to Backdrop.behaviors.
 */
Backdrop.behaviors.tableResponsive = {
  attach: function (context, settings) {
    var $tables = $(context).find('table.responsive-enabled').once('tableresponsive');
    if ($tables.length) {
      for (var i = 0, il = $tables.length; i < il; i++) {
        TableResponsive.tables.push(new TableResponsive($tables[i]));
      }
    }
  }
};

/**
 * The TableResponsive object optimizes table presentation for all screen sizes.
 *
 * A responsive table hides columns at small screen sizes, leaving the most
 * important columns visible to the end user. Users should not be prevented from
 * accessing all columns, however. This class adds a toggle to a table with
 * hidden columns that exposes the columns. Exposing the columns will likely
 * break layouts, but it provides the user with a means to access data, which
 * is a guiding principle of responsive design.
 */
function TableResponsive (table) {
  this.table = table;
  this.$table = $(table);
  this.showText = Backdrop.t('Show all columns');
  this.hideText = Backdrop.t('Hide less important columns');
  // Store a reference to the header elements of the table so that the DOM is
  // traversed only once to find them.
  this.$headers = this.$table.find('th');
  // Add a link before the table for users to show or hide weight columns.
  this.$link = $('<a href="#" class="tableresponsive-toggle">' + this.showText + '</a>')
    .attr({
      'title': Backdrop.t('Toggle visibility of table cells, that were hidden to make the table fit within a small screen.')
    })
    .on('click', $.proxy(this, 'eventhandlerToggleColumns'));

  this.$table.before($('<div class="tableresponsive-toggle-columns"></div>').append(this.$link));

  var _this = this;
  Backdrop.optimizedResize.add(function() {
    $.proxy(_this, 'eventhandlerEvaluateColumnVisibility');
    $(window).trigger('resize.tableresponsive');
  });
}

/**
 * Extend the TableResponsive function with a list of managed tables.
 */
$.extend(TableResponsive, {
  tables: []
});

/**
 * Associates an action link with the table that will show hidden columns.
 *
 * Columns are assumed to be hidden if their header has the class priority-low
 * or priority-medium.
 */
$.extend(TableResponsive.prototype, {
  eventhandlerEvaluateColumnVisibility: function (e) {
    var pegged = parseInt(this.$link.data('pegged'), 10);
    var hiddenLength = this.$headers.filter('.priority-medium:hidden, .priority-low:hidden').length;

    // If the table is not at all visible, do not manipulate the link.
    var tableVisible = this.$table.is(':visible');
    if (!tableVisible) {
      return;
    }

    // If the table has hidden columns, associate an action link with the table
    // to show the columns.
    if (hiddenLength > 0) {
      this.$link.show().text(this.showText);
    }
    // When the toggle is pegged, its presence is maintained because the user
    // has interacted with it. This is necessary to keep the link visible if the
    // user adjusts screen size and changes the visibility of columns.
    if (!pegged && hiddenLength === 0) {
      this.$link.hide().text(this.hideText);
    }
  },
  // Toggle the visibility of columns classed with either 'priority-low' or
  // 'priority-medium'.
  eventhandlerToggleColumns: function (e) {
    e.preventDefault();
    var self = this;
    var $hiddenHeaders = this.$headers.filter('.priority-medium:hidden, .priority-low:hidden');
    this.$revealedCells = this.$revealedCells || $();
    // Reveal hidden columns.
    if ($hiddenHeaders.length > 0) {
      $hiddenHeaders.each(function (index, element) {
        var $header = $(this);
        var position = $header.prevAll('th').length;
        self.$table.find('tbody tr').each(function () {
          var $cells = $(this).find('td:eq(' + position + ')');
          $cells.show();
          // Keep track of the revealed cells, so they can be hidden later.
          self.$revealedCells = $().add(self.$revealedCells).add($cells);
        });
        $header.show();
        // Keep track of the revealed headers, so they can be hidden later.
        self.$revealedCells = $().add(self.$revealedCells).add($header);
      });
      this.$link.text(this.hideText).data('pegged', 1);
    }
    // Hide revealed columns.
    else {
      this.$revealedCells.hide();
      // Strip the 'display:none' declaration from the style attributes of
      // the table cells that .hide() added.
      this.$revealedCells.css('display', '');
      this.$link.text(this.showText).data('pegged', 0);
      // Refresh the toggle link.
      $(window).trigger('resize.tableresponsive');
    }
  }
});
// Make the TableResponsive object available in the Backdrop namespace.
Backdrop.TableResponsive = TableResponsive;

})(jQuery);
;
/**
 * @file
 * Attaches behaviors for the Contextual module.
 */

(function ($) {

Backdrop.contextualLinks = Backdrop.contextualLinks || {};

/**
 * Attaches outline behavior for regions associated with contextual links.
 */
Backdrop.behaviors.contextualLinks = {
  attach: function (context) {
    $('.contextual-links-wrapper', context).once('contextual-links', function () {
      var $wrapper = $(this);
      var $region = $wrapper.closest('.contextual-links-region');
      var $links = $wrapper.find('ul.contextual-links');
      var $trigger = $('<a class="contextual-links-trigger" href="#" />').text(Backdrop.t('Configure')).on('click',
        function () {
          $links.stop(true, true).slideToggle(100);
          $wrapper.toggleClass('contextual-links-active');
          return false;
        }
      );

      // Attach hover behavior to trigger and ul.contextual-links.
      $trigger.add($links).on('mouseenter', function () {
        $region.addClass('contextual-links-region-active');
      });
      $trigger.add($links).on('mouseleave', function () {
        $region.removeClass('contextual-links-region-active');
      });

      // Hide the contextual links when user clicks a link or rolls out of the
      // .contextual-links-region.
      $region.on('mouseleave click', Backdrop.contextualLinks.mouseleave);
      $region.on('mouseenter', function() {
        $trigger.addClass('contextual-links-trigger-active');
      });
      $region.on('mouseleave', function() {
        $trigger.removeClass('contextual-links-trigger-active');
      });

      // Prepend the trigger.
      $wrapper.prepend($trigger);
    });

    /**
     * Adjusts trigger positions in contextual links to avoid overlaps.
     */
    function adjustContextualLinks() {
      // Get all wrappers anywhere on the page and some info about each.
      var allWrappers = [];
      $('.contextual-links-wrapper', context).each(function() {
        allWrappers.push({
          '$wrapper': $(this),
          'regionOffsetBottom': $(this).parent().offset().top + $(this).parent().height(),
          'hShift': 0,
          'vShift': 0
        });
      });

      // Reset margins on all wrappers.
      allWrappers.forEach(function(info) {
        info.$wrapper.css('margin', '0');
      });

      // Recalculate margins to avoid collisions.
      var dir = $('html').attr('dir');
      const hSize = 28; // width of trigger wrapper
      const vSize = 19; // height of trigger wrapper
      var n = allWrappers.length;
      for (let i = 0; i < n; i++) {
        var follower = allWrappers[i];
        // Compare follower against all of its predecessors in the list (any of
        // which may have already been adjusted).
        for (let j = 0; j < i; j++) {
          var leader = allWrappers[j];
          // Adjust the position of follower if necessary to avoid collision
          // with leader.
          var leaderOffset = leader.$wrapper.offset();
          var followerOffset = follower.$wrapper.offset();
          // Check vertical overlap.
          if (!(followerOffset.top >= leaderOffset.top && followerOffset.top < leaderOffset.top + vSize)) {
            continue;
          }
          if (dir == 'ltr') {
            // Check horizontal overlap.
            if (followerOffset.left >= leaderOffset.left - hSize && followerOffset.left < leaderOffset.left + hSize) {
              // We have a collision; shift the follower down if there's room,
              // otherwise left.
              if (followerOffset.top + 2 * vSize <= follower.regionOffsetBottom) {
                // Shift down
                follower.vShift += vSize;
                follower.$wrapper.css('margin-top', follower.vShift);
              }
              else {
                // Shift left and start a new column.
                follower.vShift = 0;
                follower.hShift += hSize;
                follower.$wrapper.css('margin-top', follower.vShift);
                follower.$wrapper.css('margin-right', follower.hShift);
              }
            }
          }
          else { // rtl
            // Check horizontal overlap.
            if (followerOffset.left > leaderOffset.left - hSize && followerOffset.left <= leaderOffset.left + hSize) {
              // We have a collision; shift the follower down if there's room,
              // otherwise right.
              if (followerOffset.top + 2 * vSize <= follower.regionOffsetBottom) {
                // Shift down
                follower.vShift += vSize;
                follower.$wrapper.css('margin-top', follower.vShift);
              }
              else {
                // Shift right and start a new column.
                follower.vShift = 0;
                follower.hShift += hSize;
                follower.$wrapper.css('margin-top', follower.vShift);
                follower.$wrapper.css('margin-left', follower.hShift);
              }
            }
          }
        }
      }
    }
    $(document).ready(adjustContextualLinks);

    // Usually Backdrop.optimizedResize() would be used for a window resize
    // event, but this potentially expensive operation should be limited to
    // firing infrequently, so Backdrop.debounce() is used here instead.
    $(window).on('resize', Backdrop.debounce(adjustContextualLinks, 500));
  }
};

/**
 * Disables outline for the region contextual links are associated with.
 */
Backdrop.contextualLinks.mouseleave = function () {
  $(this)
    .find('.contextual-links-active').removeClass('contextual-links-active')
    .find('ul.contextual-links').hide();
};

})(jQuery);
;
(() => {
  function ginInitDarkmode() {
    1 == localStorage.getItem("Backdrop.gin.darkmode") || "auto" === localStorage.getItem("Backdrop.gin.darkmode") && window.matchMedia("(prefers-color-scheme: dark)").matches ? document.documentElement.classList.add("gin--dark-mode") : !0 === document.documentElement.classList.contains("gin--dark-mode") && document.documentElement.classList.remove("gin--dark-mode");
  }
  ginInitDarkmode(), window.addEventListener("DOMContentLoaded", (() => {
    localStorage.getItem("Backdrop.gin.darkmode") || (localStorage.setItem("Backdrop.gin.darkmode", Backdrop.settings.gin.darkmode), 
    ginInitDarkmode());
  }));
})();;
((Backdrop, once) => {
  Backdrop.behaviors.ginAccent = {
    attach: function() {
      once("ginAccent", "body").forEach((() => {
        Backdrop.ginAccent.checkDarkmode(), Backdrop.ginAccent.setAccentColor(), Backdrop.ginAccent.setFocusColor();
      }));
    }
  }, Backdrop.ginAccent = {
    setAccentColor: function() {
      let preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      const accentColorPreset = null != preset ? preset : Backdrop.settings.gin.preset_accent_color;
      document.body.setAttribute("data-gin-accent", accentColorPreset), "custom" === accentColorPreset && this.setCustomAccentColor(color);
    },
    setCustomAccentColor: function() {
      let color = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, element = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.body;
      const accentColor = null != color ? color : Backdrop.settings.gin.accent_color;
      if (accentColor) {
        this.clearAccentColor(element);
        const strippedAccentColor = accentColor.replace("#", ""), darkAccentColor = this.mixColor("ffffff", strippedAccentColor, 65).replace("#", ""), style = document.createElement("style");
        style.className = "gin-custom-colors", style.innerHTML = `\n          [data-gin-accent="custom"] {\n            --gin-color-primary-rgb: ${this.hexToRgb(accentColor)};\n            --gin-color-primary-hover: ${this.shadeColor(accentColor, -10)};\n            --gin-color-primary-active: ${this.shadeColor(accentColor, -15)};\n            --gin-bg-app-rgb: ${this.hexToRgb(this.mixColor("ffffff", strippedAccentColor, 97))};\n            --gin-bg-header: ${this.mixColor("ffffff", strippedAccentColor, 85)};\n            --gin-color-sticky-rgb: ${this.hexToRgb(this.mixColor("ffffff", strippedAccentColor, 92))};\n          }\n          .gin--dark-mode[data-gin-accent="custom"],\n          .gin--dark-mode [data-gin-accent="custom"] {\n            --gin-color-primary-rgb: ${this.hexToRgb(darkAccentColor)};\n            --gin-color-primary-hover: ${this.mixColor("ffffff", strippedAccentColor, 55)};\n            --gin-color-primary-active: ${this.mixColor("ffffff", strippedAccentColor, 50)};\n            --gin-bg-header: ${this.mixColor("2A2A2D", darkAccentColor, 88)};\n          }\n        `, 
        element.append(style);
      }
    },
    clearAccentColor: function() {
      let element = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document.body;
      if (element.querySelectorAll(".gin-custom-colors").length > 0) {
        const removeElement = element.querySelector(".gin-custom-colors");
        removeElement.parentNode.removeChild(removeElement);
      }
    },
    setFocusColor: function() {
      let preset = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, color = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null;
      const focusColorPreset = null != preset ? preset : Backdrop.settings.gin.preset_focus_color;
      document.body.setAttribute("data-gin-focus", focusColorPreset), "custom" === focusColorPreset && this.setCustomFocusColor(color);
    },
    setCustomFocusColor: function() {
      let color = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null, element = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.body;
      const accentColor = null != color ? color : Backdrop.settings.gin.focus_color;
      if (accentColor) {
        this.clearFocusColor(element);
        const strippedAccentColor = accentColor.replace("#", ""), darkAccentColor = this.mixColor("ffffff", strippedAccentColor, 65), style = document.createElement("style");
        style.className = "gin-custom-focus", style.innerHTML = `\n          [data-gin-focus="custom"] {\n            --gin-color-focus: ${accentColor};\n          }\n          .gin--dark-mode[data-gin-focus="custom"],\n          .gin--dark-mode [data-gin-focus="custom"] {\n            --gin-color-focus: ${darkAccentColor};\n          }`, 
        element.append(style);
      }
    },
    clearFocusColor: function() {
      let element = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : document.body;
      if (element.querySelectorAll(".gin-custom-focus").length > 0) {
        const removeElement = element.querySelector(".gin-custom-focus");
        removeElement.parentNode.removeChild(removeElement);
      }
    },
    checkDarkmode: () => {
      const darkmodeClass = Backdrop.settings.gin.darkmode_class;
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e => {
        e.matches && "auto" === localStorage.getItem("Backdrop.gin.darkmode") && document.querySelector("html").classList.add(darkmodeClass);
      })), window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e => {
        e.matches && "auto" === localStorage.getItem("Backdrop.gin.darkmode") && document.querySelector("html").classList.remove(darkmodeClass);
      }));
    },
    hexToRgb: hex => {
      hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (function(m, r, g, b) {
        return r + r + g + g + b + b;
      }));
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    },
    mixColor: (color_1, color_2, weight) => {
      function h2d(h) {
        return parseInt(h, 16);
      }
      weight = void 0 !== weight ? weight : 50;
      for (var color = "#", i = 0; i <= 5; i += 2) {
        for (var v1 = h2d(color_1.substr(i, 2)), v2 = h2d(color_2.substr(i, 2)), val = Math.floor(v2 + weight / 100 * (v1 - v2)).toString(16); val.length < 2; ) val = "0" + val;
        color += val;
      }
      return color;
    },
    shadeColor: (color, percent) => {
      const num = parseInt(color.replace("#", ""), 16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 255) + amt, G = (255 & num) + amt;
      return `#${(16777216 + 65536 * (R < 255 ? R < 1 ? 0 : R : 255) + 256 * (B < 255 ? B < 1 ? 0 : B : 255) + (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1)}`;
    }
  };
})(Backdrop, once);;
((Backdrop, once) => {
  Backdrop.behaviors.ginSticky = {
    attach: () => {
      once("ginSticky", ".region-sticky-watcher").forEach((() => {
        const observer = new IntersectionObserver((_ref => {
          let [e] = _ref;
          document.querySelector(".region-sticky").classList.toggle("region-sticky--is-sticky", e.intersectionRatio < 1);
        }), {
          threshold: [ 1 ]
        }), element = document.querySelector(".region-sticky-watcher");
        element && observer.observe(element);
      }));
    }
  };
})(Backdrop, once);;
((Backdrop, once) => {
  Backdrop.behaviors.ginTableSelect = {
    attach: () => {
      once('tableSelect', 'th.select-all').forEach((el) => {
        if (el.closest('table')) {
          Backdrop.ginTableSelect(el);
        }
      });
    },
  };

  Backdrop.ginTableSelect = (el) => {
    const table = el.closest('table');

    if (table.querySelector('td input[type="checkbox"]') === null) {
      return;
    }

    const setClass = 'is-sticky';
    const stickyHeader = table
      .closest('form')
      .querySelector('.views-bulk-form');

    const updateSticky = (state) => {
      if (stickyHeader) {
        if (state === true) {
          stickyHeader.classList.add(setClass);
        }
        else {
          stickyHeader.classList.remove(setClass);
        }
      }
    };

    // Watch select-all
    el.addEventListener('change', () => {
      const selectedItems = Boolean(table.querySelectorAll('td input[type="checkbox"]:checked').length);
      updateSticky(selectedItems);
    });

    // Watch items
    table.querySelectorAll('td input[type="checkbox"]').forEach(item => {
      item.addEventListener('change', () => {
        const selectedItems = Boolean(table.querySelectorAll('td input[type="checkbox"]:checked').length);
        updateSticky(selectedItems);
        item.closest('tr').classList.toggle('selected');
      });
    });
  };

})(Backdrop, once);
;
((Backdrop, once) => {
  Backdrop.behaviors.ginCKEditor = {
    attach: () => {
      Backdrop.ginCKEditor.init();
    }
  }, Backdrop.ginCKEditor = {
    init: () => {
      once("ginCKEditors", "body").forEach((() => {
        if (window.CKEDITOR && void 0 !== CKEDITOR) {
          if (Backdrop.settings.gin.current_path.indexOf("/admin/config/content/formats") > -1) return;
          const variablesCss = Backdrop.settings.gin.variables_css_path, accentCss = Backdrop.settings.gin.accent_css_path, contentsCss = Backdrop.settings.gin.ckeditor_css_path, accentColorPreset = Backdrop.settings.gin.preset_accent_color, accentColor = Backdrop.settings.gin.accent_color, darkmodeClass = Backdrop.settings.gin.darkmode_class;
          (1 == localStorage.getItem("Backdrop.gin.darkmode") || "auto" === localStorage.getItem("Backdrop.gin.darkmode") && window.matchMedia("(prefers-color-scheme: dark)").matches) && (CKEDITOR.config.bodyClass = darkmodeClass), 
          void 0 === CKEDITOR.config.contextmenu_contentsCss && (CKEDITOR.config.contextmenu_contentsCss = new Array, 
          void 0 === CKEDITOR.skinName && (CKEDITOR.skinName = CKEDITOR.skin.name), CKEDITOR.config.contextmenu_contentsCss.push(CKEDITOR.skin.getPath("editor"), variablesCss, accentCss, contentsCss)), 
          CKEDITOR.on("instanceReady", (element => {
            const editor = element.editor;
            editor.document.$.head.innerHTML += '<link rel="stylesheet" href=/' + variablesCss + ' type="text/css"/>', 
            editor.document.$.head.innerHTML += '<link rel="stylesheet" href=/' + accentCss + ' type="text/css"/>', 
            editor.document.$.head.innerHTML += '<link rel="stylesheet" href=/' + contentsCss + ' type="text/css"/>', 
            editor.document.$.body.setAttribute("data-gin-accent", accentColorPreset), "custom" === accentColorPreset && accentColor && Backdrop.ginAccent.setCustomAccentColor(accentColor, editor.document.$.head), 
            editor.on("mode", (function() {
              "wysiwyg" == this.mode && (editor.document.$.body.setAttribute("data-gin-accent", accentColorPreset), 
              "custom" === accentColorPreset && accentColor && Backdrop.ginAccent.setCustomAccentColor(accentColor, editor.document.$.head), 
              "auto" === localStorage.getItem("Backdrop.gin.darkmode") && (window.matchMedia("(prefers-color-scheme: dark)").matches ? editor.document.$.body.classList.add(darkmodeClass) : editor.document.$.body.classList.remove(darkmodeClass)), 
              editor.document.$.head.innerHTML += '<link rel="stylesheet" href=/' + variablesCss + ' type="text/css"/>', 
              editor.document.$.head.innerHTML += '<link rel="stylesheet" href=/' + accentCss + ' type="text/css"/>', 
              editor.document.$.head.innerHTML += '<link rel="stylesheet" href=/' + contentsCss + ' type="text/css"/>');
            })), editor.on("menuShow", (function(element) {
              const darkModeClass = 1 == localStorage.getItem("Backdrop.gin.darkmode") || "auto" === localStorage.getItem("Backdrop.gin.darkmode") && window.matchMedia("(prefers-color-scheme: dark)").matches ? darkmodeClass : "", iframeElement = element.data[0].element.$.childNodes[0].contentWindow.document;
              darkModeClass && iframeElement.body.classList.add(darkModeClass), iframeElement.body.setAttribute("data-gin-accent", accentColorPreset), 
              "custom" === accentColorPreset && accentColor && Backdrop.ginAccent.setCustomAccentColor(accentColor, iframeElement.head);
            })), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e => {
              e.matches && "auto" === localStorage.getItem("Backdrop.gin.darkmode") && (editor.document.$.body.classList.add(darkmodeClass), 
              document.querySelectorAll(`.${editor.id}.cke_panel`).length > 0) && document.querySelector(`.${editor.id}.cke_panel`).childNodes[0].contentWindow.document.body.classList.add(darkmodeClass);
            })), window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", (e => {
              e.matches && "auto" === localStorage.getItem("Backdrop.gin.darkmode") && (editor.document.$.body.classList.remove(darkmodeClass), 
              document.querySelectorAll(`.${editor.id}.cke_panel`).length > 0) && document.querySelector(`.${editor.id}.cke_panel`).childNodes[0].contentWindow.document.body.classList.remove(darkmodeClass);
            }));
          }));
        }
      }));
    }
  };
})(Backdrop, once);;
(function ($) {

/**
 * Retrieves the summary for the first element.
 */
$.fn.backdropGetSummary = function () {
  var callback = this.data('summaryCallback');
  var returnValue = (this[0] && callback) ? callback(this[0]) : '';
  return typeof returnValue === 'string' ? returnValue.trim() : '';
};

/**
 * Sets the summary for all matched elements.
 *
 * @param callback
 *   Either a function that will be called each time the summary is
 *   retrieved or a string (which is returned each time).
 */
$.fn.backdropSetSummary = function (callback) {
  var self = this;

  // To facilitate things, the callback should always be a function. If it's
  // not, we wrap it into an anonymous function which just returns the value.
  if (typeof callback != 'function') {
    var val = callback;
    callback = function () { return val; };
  }

  return this
    .data('summaryCallback', callback)
    // To prevent duplicate events, the handlers are first removed and then
    // (re-)added.
    .off('formUpdated.summary')
    .on('formUpdated.summary', function () {
      self.trigger('summaryUpdated');
    })
    // The actual summaryUpdated handler doesn't fire when the callback is
    // changed, so we have to do this manually.
    .trigger('summaryUpdated');
};

/**
 * Sends a 'formUpdated' event each time a form element is modified.
 */
Backdrop.behaviors.formUpdated = {
  attach: function (context) {
    // These events are namespaced so that we can remove them later.
    var events = 'change.formUpdated click.formUpdated blur.formUpdated keyup.formUpdated';
    $(context)
      // Since context could be an input element itself, it's added back to
      // the jQuery object and filtered again.
      .find(':input').addBack().filter(':input')
      // To prevent duplicate events, the handlers are first removed and then
      // (re-)added.
      .off(events).on(events, function () {
        $(this).trigger('formUpdated');
      });
  }
};

/**
 * Prevents consecutive form submissions of identical form values.
 *
 * Repetitive form submissions that would submit the identical form values are
 * prevented, unless the form values are different from the previously
 * submitted values.
 *
 * This is a simplified re-implementation of a user-agent behavior that should
 * be natively supported by major web browsers, but at this time, only Firefox
 * has a built-in protection.
 *
 * A form value-based approach ensures that the constraint is triggered for
 * consecutive, identical form submissions only. Compared to that, a form
 * button-based approach would (1) rely on [visible] buttons to exist where
 * technically not required and (2) require more complex state management if
 * there are multiple buttons in a form.
 *
 * This implementation is based on form-level submit events only, and relies on
 * jQuery's serialize() method to determine submitted form values. As such, the
 * following limitations exist:
 *
 * - Event handlers on form buttons that preventDefault() do not receive a
 *   double-submit protection. That is deemed to be fine, since such button
 *   events typically trigger reversible client-side or server-side operations
 *   that are local to the context of a form only.
 * - Changed values in advanced form controls, such as file inputs, are not part
 *   of the form values being compared between consecutive form submits (due to
 *   limitations of jQuery.serialize()). That is deemed to be acceptable,
 *   because if the user forgot to attach a file, then the size of HTTP payload
 *   will most likely be small enough to be fully passed to the server endpoint
 *   within (milli)seconds. If a user mistakenly attached a wrong file and is
 *   technically versed enough to cancel the form submission (and HTTP payload)
 *   in order to attach a different file, then that edge-case is not supported
 *   here.
 *
 * Lastly, all forms submitted via HTTP GET are idempotent by definition of HTTP
 * standards, so excluded in this implementation.
 */
Backdrop.behaviors.formSingleSubmit = {
  attach: function () {
    function onFormSubmit (e) {
      // Prevent this from firing multiple times per request.
      e.stopImmediatePropagation();
      if (e.isDefaultPrevented()) {
        // Don't act on form submissions that have been prevented by other JS.
        return;
      }
      var $form = $(e.currentTarget);
      var formValues = $form.serialize();
      var previousValues = $form.attr('data-backdrop-form-submit-last');
      if (previousValues === formValues) {
        e.preventDefault();
      }
      else {
        $form.attr('data-backdrop-form-submit-last', formValues);
      }
    }

    $('body').once('form-single-submit')
      .on('submit.singleSubmit', 'form:not([method~="GET"])', onFormSubmit);

  }
};

/**
 * Prepopulate form fields with information from the visitor cookie.
 */
Backdrop.behaviors.fillUserInfoFromCookie = {
  attach: function (context, settings) {
    $('form.user-info-from-cookie').once('user-info-from-cookie', function () {
      var formContext = this;
      $.each(['name', 'mail', 'homepage'], function () {
        var $element = $('[name=' + this + ']', formContext);
        var cookie = $.cookie('Backdrop.visitor.' + this);
        if ($element.length && cookie) {
          $element.val(cookie);
        }
      });
    });
  }
};

})(jQuery);
;
