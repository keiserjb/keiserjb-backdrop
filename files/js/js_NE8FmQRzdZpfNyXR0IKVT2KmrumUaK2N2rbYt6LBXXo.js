(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Backdrop.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    var insideDialog = Boolean($fieldset.parents('.ui-dialog-content').length);
    $fieldset
      .removeClass('collapsed')
      .find('> legend span.fieldset-legend-prefix').html(Backdrop.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        $fieldset.trigger({ type: 'collapsed', value: false });
        $(window).triggerHandler('resize');
        Backdrop.optimizedResize.trigger();
        if (insideDialog === false) {
          Backdrop.collapseScrollIntoView(fieldset);
        }
        fieldset.animating = false;
      }
    });
  }
  else {
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Backdrop.t('Show'));
      $fieldset.trigger({ type: 'collapsed', value: true });
      $(window).triggerHandler('resize');
      Backdrop.optimizedResize.trigger();
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Backdrop.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  if (posY + node.offsetHeight > h + offset) {
    if (node.offsetHeight > h) {
      node.scrollIntoView({behavior: "smooth"});
    }
    else {
      node.scrollIntoView({behavior: "smooth", block: "end"});
    }
  }
};

Backdrop.behaviors.collapse = {
  attach: function (context, settings) {
    var hasHash = location.hash && location.hash != '#' && $(window).find(location.hash).length;
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = hasHash ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        on('summaryUpdated', function () {
          var text = $fieldset.backdropGetSummary();
          summary.html(text ? text : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Backdrop.t('Show') : Backdrop.t('Hide'))
        .prependTo($legend)
        .after(document.createTextNode(' '));

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .on('click', function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Backdrop.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
(function ($) {

"use strict";

/**
 * Attaches sticky table headers.
 */
Backdrop.behaviors.tableHeader = {
  attach: function (context) {
    if (!$.support.positionFixed) {
      return;
    }
    var $tables = $(context).find('table.sticky-enabled:not(.sticky-processed)').addClass('sticky-processed');
    for (var i = 0, il = $tables.length; i < il; i++) {
      TableHeader.tables.push(new TableHeader($tables[i]));
    }
  }
};

function scrollValue(position) {
  return document.documentElement[position] || document.body[position];
}

// Helper method to loop through tables and execute a method.
function forTables(method, arg) {
  var tables = TableHeader.tables;
  for (var i = 0, il = tables.length; i < il; i++) {
    tables[i][method](arg);
  }
}

function tableHeaderResizeHandler() {
  forTables('recalculateSticky');
}

var scrollTimer;
function tableHeaderOnScrollHandler() {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(function() {
    forTables('onScroll');
  }, 50);
}

function tableHeaderOffsetChangeHandler() {
  // Compute the new offset value.
  TableHeader.computeOffsetTop();
  forTables('stickyPosition', TableHeader.offsetTop);
}

// Bind event that need to change all tables.
$(window).on({
  /**
   * Bind only one event to take care of calling all scroll callbacks.
   */
  'scroll.TableHeader': tableHeaderOnScrollHandler
});

/**
 * When resizing table width and offset top can change, recalculate everything.
 */
Backdrop.optimizedResize.add(tableHeaderResizeHandler);

// Bind to custom Backdrop events.
$(document).on({
  /**
   * Recalculate columns width when window is resized and when show/hide
   * weight is triggered.
   */
  'columnschange.TableHeader': tableHeaderResizeHandler,

  /**
   * Offset value vas changed by a third party script.
   */
  'offsettopchange.TableHeader': tableHeaderOffsetChangeHandler
});

/**
 * Constructor for the tableHeader object. Provides sticky table headers.
 * TableHeader will make the current table header stick to the top of the page
 * if the table is very long.
 *
 * Fire a custom "offsettopchange" event to make TableHeader compute the
 * new offset value from the "data-offset-top" attributes of relevant elements.
 *
 * @param table
 *   DOM object for the table to add a sticky header to.*
 * @constructor
 */
function TableHeader(table) {
  var $table = $(table);
  this.$originalTable = $table;
  this.$originalHeader = $table.children('thead');
  this.$originalHeaderCells = this.$originalHeader.find('> tr > th');
  this.displayWeight = null;

  this.$originalTable.addClass('sticky-table');
  this.tableHeight = $table[0].clientHeight;
  this.tableOffset = this.$originalTable.offset();

  // React to columns change to avoid making checks in the scroll callback.
  this.$originalTable.on('columnschange', {tableHeader: this}, function (e, display) {
    var tableHeader = e.data.tableHeader;
    if (tableHeader.displayWeight === null || tableHeader.displayWeight !== display) {
      tableHeader.recalculateSticky();
    }
    tableHeader.displayWeight = display;
  });

  // Create and display sticky header.
  this.createSticky();
}

/**
 * Store the state of TableHeader.
 */
$.extend(TableHeader, {
   /**
    * This will store the state of all processed tables.
    *
    * @type {Array}
    */
   tables: [],

   /**
    * Cache of computed offset value.
    *
    * @type {Number}
    */
   offsetTop: 0,

  /**
   * Sum all [data-offset-top] values and cache it.
   */
  computeOffsetTop: function () {
    var $offsets = $('[data-offset-top]').not('.sticky-header');
    var value, sum = 0;
    for (var i = 0, il = $offsets.length; i < il; i++) {
      value = parseInt($offsets[i].getAttribute('data-offset-top'), 10);
      sum += !isNaN(value) ? value : 0;
    }
    this.offsetTop = sum;
    return sum;
  }
});

/**
 * Extend TableHeader prototype.
 */
$.extend(TableHeader.prototype, {
  /**
   * Minimum height in pixels for the table to have a sticky header.
   */
  minHeight: 100,

  /**
   * Absolute position of the table on the page.
   */
  tableOffset: null,

  /**
   * Absolute position of the table on the page.
   */
  tableHeight: null,

  /**
   * Boolean storing the sticky header visibility state.
   */
  stickyVisible: false,

  /**
   * Create the duplicate header.
   */
  createSticky: function () {
    // Clone the table header so it inherits original jQuery properties.
    var $stickyHeader = this.$originalHeader.clone(true);
    // Hide the table to avoid a flash of the header clone upon page load.
    this.$stickyTable = $('<table class="sticky-header"/>')
      .css({
        visibility: 'hidden',
        position: 'fixed',
        top: '0px'
      })
      .append($stickyHeader)
      .insertBefore(this.$originalTable);

    this.$stickyHeaderCells = $stickyHeader.find('> tr > th');

    // Initialize all computations.
    this.recalculateSticky();
  },

  /**
   * Set absolute position of sticky.
   *
   * @param offsetTop
   * @param offsetLeft
   */
  stickyPosition: function (offsetTop, offsetLeft) {
    var css = {};
    if (!isNaN(offsetTop) && offsetTop !== null) {
      css.top = offsetTop + 'px';
    }
    if (!isNaN(offsetLeft) && offsetTop !== null) {
      css.left = offsetLeft + 'px';
    }
    return this.$stickyTable.css(css);
  },

  /**
   * Returns true if sticky is currently visible.
   */
  checkStickyVisible: function () {
    var scrollTop = scrollValue('scrollTop');
    var tableTop = this.tableOffset.top - TableHeader.offsetTop;
    var tableBottom = tableTop + this.tableHeight;
    var visible = false;

    if (tableTop < scrollTop && scrollTop < (tableBottom - this.minHeight)) {
      visible = true;
    }

    this.stickyVisible = visible;
    return visible;
  },

  /**
   * Check if sticky header should be displayed.
   *
   * This function is throttled to once every 250ms to avoid unnecessary calls.
   */
  onScroll: function () {
    // Track horizontal positioning relative to the viewport.
    this.stickyPosition(null, scrollValue('scrollLeft'));
    this.$stickyTable.css('visibility', this.checkStickyVisible() ? 'visible' : 'hidden');
  },

  /**
   * Event handler: recalculates position of the sticky table header.
   */
  recalculateSticky: function () {
    // Update table size.
    this.tableHeight = this.$originalTable[0].clientHeight;

    // Update offset.
    TableHeader.computeOffsetTop();
    this.tableOffset = this.$originalTable.offset();
    var leftOffset = parseInt(this.$originalTable.offset().left);
    this.stickyPosition(TableHeader.offsetTop, leftOffset);

    // Update columns width.
    var $that = null;
    var $stickyCell = null;
    var display = null;
    // Resize header and its cell widths.
    // Only apply width to visible table cells. This prevents the header from
    // displaying incorrectly when the sticky header is no longer visible.
    for (var i = 0, il = this.$originalHeaderCells.length; i < il; i++) {
      $that = $(this.$originalHeaderCells[i]);
      $stickyCell = this.$stickyHeaderCells.eq($that.index());
      display = $that.css('display');
      if (display !== 'none') {
        $stickyCell.css({'width': $that.width(), 'display': display});
      }
      else {
        $stickyCell.css('display', 'none');
      }
    }
    this.$stickyTable.css('width', this.$originalTable.width());
  }
});

// Calculate the table header positions on page load.
window.setTimeout(function() {
  $(window).triggerHandler('scroll.TableHeader');
}, 100);

// Expose constructor in the public space.
Backdrop.TableHeader = TableHeader;

}(jQuery));
;