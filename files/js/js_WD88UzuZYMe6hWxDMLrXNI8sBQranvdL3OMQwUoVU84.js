
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
