(function ($) {

  Backdrop.Collapsiblock = Backdrop.Collapsiblock || {};

  Backdrop.behaviors.collapsiblock = {

    attach: function (context, settings) {
      var cookieData = Backdrop.Collapsiblock.getCookieData();
      var slidetype = settings.collapsiblock.slide_type;
      var activePages = settings.collapsiblock.active_pages;
      var slidespeed = parseInt(settings.collapsiblock.slide_speed, 10);
      $('.collapsiblock').once('collapsiblock', function () {
        var id = this.id.split("-").pop();
        var titleElt = $(this)[0];
        if (titleElt.children.length > 0) {
          // Status values: 1 = not collapsible, 2 = collapsible and expanded,
          // 3 = collapsible and collapsed, 4 = always collapsed,
          // 5 = always expanded
          var stat = $(this).data('collapsiblock-action');
          if (stat == 1) {
            return;
          }

          titleElt.target = $(this).siblings().not($('.contextual-links-wrapper'));
          $(titleElt)
            .wrapInner('<a href="#collapse-' + id + '" role="link" aria-controls="collapse-content-' + id + '" aria-expanded="false"/>')
            .click(function (e) {
              if ($(this).is('.collapsiblockCollapsed')) {
                $(this).removeClass('collapsiblockCollapsed');
                $(this).find("a").attr('aria-expanded', true);
                if (slidetype == 1) {
                  $(this.target).slideDown(slidespeed).attr('aria-hidden', false);
                }
                else {
                  $(this.target).animate({
                    height: 'show',
                    opacity: 'show'
                  }, slidespeed);
                }
                // Set Focus on expanded content
                document.getElementById("collapse-content-" + id).focus();

                // Don't save cookie data if the block is always collapsed.
                if (stat != 4 && stat != 5) {
                  cookieData[id] = 1;
                }
              }
              else {
                $(this).addClass('collapsiblockCollapsed');
                $(this).find("a").attr('aria-expanded', false);
                if (slidetype == 1) {
                  $(this.target).slideUp(slidespeed).attr('aria-hidden', true);
                }
                else {
                  $(this.target).animate({
                    height: 'hide',
                    opacity: 'hide'
                  }, slidespeed);
                }

                // Don't save cookie data if the block is always collapsed.
                if (stat != 4 && stat != 5) {
                  cookieData[id] = 0;
                }
              }
              // Stringify the object in JSON format for saving in the cookie.
              cookieString = JSON.stringify(cookieData);
              $.cookie('collapsiblock', cookieString, {
                path: settings.basePath
              });
            });

          // Leave active blocks if Remember collapsed on active pages is false.
          // If the block is expanded, do nothing.
          if (stat == 4 || (cookieData[id] == 0 || (stat == 3 && cookieData[id] == undefined))) {
            if (!$(this).find('a.active').size() || activePages === 1) {
              // Allow block content to assign class 'collapsiblock-force-open'
              // to it's content to force itself to stay open. E.g. useful if
              // block contains a form that was just ajaxly updated and should
              // be visible
              if (titleElt.target.hasClass('collapsiblock-force-open') || titleElt.target.find('.collapsiblock-force-open').size() > 0) {
                return;
              }
              $(titleElt).addClass('collapsiblockCollapsed');
              $(titleElt.target).hide();
            }
          }
          //Set id for Aria-controls
          this.target[0]['id'] = 'collapse-content-' + id;

          //Set tabindex so element is focusable
          $(this.target).attr('tabindex', '-1');

          // Set Aria-expanded for expanded defaults and following cookies processing
          if (stat == 5 || stat == 2) {
            if ( stat == 2 && $(this).is(".collapsiblockCollapsed")) {
              return; //Collapsed
            } else {
              $(this).find("a").attr('aria-expanded', true); //Expanded
            }
          }
        }
      });
    }

};

Backdrop.Collapsiblock.getCookieData = function () {
  if ($.cookie) {
    var cookieString = $.cookie('collapsiblock');
    return cookieString ? $.parseJSON(cookieString) : {};
  }
  else {
    return '';
  }
};


})(jQuery);
;
(function ($) {

Backdrop.extlink = Backdrop.extlink || {};

Backdrop.extlink.attach = function (context, settings) {
  if (!settings.hasOwnProperty('extlink')) {
    return;
  }

  // Strip the host name down, removing ports, subdomains, or www.
  var pattern = /^(([^\/:]+?\.)*)([^\.:]{4,})((\.[a-z]{1,4})*)(:[0-9]{1,5})?$/;
  var host = window.location.host.replace(pattern, '$3$4');
  var subdomain = window.location.host.replace(pattern, '$1');

  // Determine what subdomains are considered internal.
  var subdomains;
  if (settings.extlink.extSubdomains) {
    subdomains = "([^/]*\\.)?";
  }
  else if (subdomain == 'www.' || subdomain == '') {
    subdomains = "(www\\.)?";
  }
  else {
    subdomains = subdomain.replace(".", "\\.");
  }

  // Build regular expressions that define an internal link.
  var internal_link = new RegExp("^https?://([^@]*@)?" + subdomains + host, "i");

  // Extra internal link matching.
  var extInclude = false;
  if (settings.extlink.extInclude) {
    extInclude = new RegExp(settings.extlink.extInclude.replace(/\\/, '\\'), "i");
  }

  // Extra external link matching.
  var extExclude = false;
  if (settings.extlink.extExclude) {
    extExclude = new RegExp(settings.extlink.extExclude.replace(/\\/, '\\'), "i");
  }

  // Extra external link CSS selector exclusion.
  var extCssExclude = false;
  if (settings.extlink.extCssExclude) {
    extCssExclude = settings.extlink.extCssExclude;
  }

  // Extra external link CSS selector explicit.
  var extCssExplicit = false;
  if (settings.extlink.extCssExplicit) {
    extCssExplicit = settings.extlink.extCssExplicit;
  }

  // Define the jQuery method (either 'append' or 'prepend') of placing the icon, defaults to 'append'
  var extIconPlacement = settings.extlink.extIconPlacement || 'append';

  // Find all links which are NOT internal and begin with http as opposed
  // to ftp://, javascript:, etc. other kinds of links.
  // When operating on the 'this' variable, the host has been appended to
  // all links by the browser, even local ones.
  // In jQuery 1.1 and higher, we'd use a filter method here, but it is not
  // available in jQuery 1.0 (Backdrop 5 default).
  var external_links = new Array();
  var mailto_links = new Array();
  $("a:not(." + settings.extlink.extClass + ", ." + settings.extlink.mailtoClass + "), area:not(." + settings.extlink.extClass + ", ." + settings.extlink.mailtoClass + ")", context).each(function(el) {
    try {
      var url = this.href.toLowerCase();
      if (url.indexOf('http') == 0
        && ((!url.match(internal_link) && !(extExclude && url.match(extExclude))) || (extInclude && url.match(extInclude)))
        && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
        && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
        external_links.push(this);
      }
      // Do not include area tags with begin with mailto: (this prohibits
      // icons from being added to image-maps).
      else if (this.tagName != 'AREA' 
        && url.indexOf('mailto:') == 0 
        && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
        && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
        mailto_links.push(this);
      }
    }
    // IE7 throws errors often when dealing with irregular links, such as:
    // <a href="node/10"></a> Empty tags.
    // <a href="http://user:pass@example.com">example</a> User:pass syntax.
    catch (error) {
      return false;
    }
  });

  if (settings.extlink.extClass) {
    Backdrop.extlink.applyClassAndSpan(external_links, settings.extlink.extClass, extIconPlacement);
  }

  if (settings.extlink.mailtoClass) {
    Backdrop.extlink.applyClassAndSpan(mailto_links, settings.extlink.mailtoClass, extIconPlacement);
  }

  if (settings.extlink.extTarget) {
    // Apply the target attribute to all links.
    $(external_links).attr('target', settings.extlink.extTarget);
  }

  Backdrop.extlink = Backdrop.extlink || {};

  // Set up default click function for the external links popup. This should be
  // overridden by modules wanting to alter the popup.
  Backdrop.extlink.popupClickHandler = Backdrop.extlink.popupClickHandler || function() {
    if (settings.extlink.extAlert) {
      return confirm(settings.extlink.extAlertText);
    }
   }

  $(external_links).click(function(e) {
    return Backdrop.extlink.popupClickHandler(e);
  });
};

/**
 * Apply a class and a trailing <span> to all links not containing images.
 *
 * @param links
 *   An array of DOM elements representing the links.
 * @param class_name
 *   The class to apply to the links.
 * @param icon_placement
 *   'append' or 'prepend' the icon to the link.
 */
Backdrop.extlink.applyClassAndSpan = function (links, class_name, icon_placement) {
  var $links_to_process;
  if (Backdrop.settings.extlink.extImgClass){
    $links_to_process = $(links);
  }
  else {
    var links_with_images = $(links).find('img').parents('a');
    $links_to_process = $(links).not(links_with_images);
  }
  $links_to_process.addClass(class_name);
  var i;
  var length = $links_to_process.length;
  for (i = 0; i < length; i++) {
    var $link = $($links_to_process[i]);
    if ($link.css('display') == 'inline' || $link.css('display') == 'inline-block') {
      if (class_name == Backdrop.settings.extlink.mailtoClass) {
        $link[icon_placement]('<span class="' + class_name + '"><span class="element-invisible"> ' + Backdrop.settings.extlink.mailtoLabel + '</span></span>');
      }
      else {
        $link[icon_placement]('<span class="' + class_name + '"><span class="element-invisible"> ' + Backdrop.settings.extlink.extLabel + '</span></span>');
      }
    }
  }
};

Backdrop.behaviors.extlink = Backdrop.behaviors.extlink || {};
Backdrop.behaviors.extlink.attach = function (context, settings) {
  // Backwards compatibility, for the benefit of modules overriding extlink
  // functionality by defining an "extlinkAttach" global function.
  if (typeof extlinkAttach === 'function') {
    extlinkAttach(context);
  }
  else {
    Backdrop.extlink.attach(context, settings);
  }
};

})(jQuery);
;
(function($) {

Backdrop.adminBar = Backdrop.adminBar || {};
Backdrop.adminBar.behaviors = Backdrop.adminBar.behaviors || {};
Backdrop.adminBar.cache = Backdrop.adminBar.cache || {};

/**
 * Core behavior for Administration bar.
 *
 * Test whether there is an administration bar is in the output and execute all
 * registered behaviors.
 */
Backdrop.behaviors.adminBar = {
  attach: function (context, settings) {
    // Initialize settings.
    settings.admin_bar = $.extend({
      suppress: false,
      margin_top: false,
      position_fixed: false,
      destination: '',
      basePath: settings.basePath,
      hash: 0,
      replacements: {}
    }, settings.admin_bar || {});
    // Check whether administration bar should be suppressed.
    if (settings.admin_bar.suppress) {
      return;
    }
    var $adminBar = $('#admin-bar');
    // Client-side caching; if administration bar is not in the output, it is
    // fetched from the server and cached in the browser.
    if (!$adminBar.length && settings.admin_bar.hash) {
      Backdrop.adminBar.getCache(settings.admin_bar.hash, function (response) {
        if (typeof response == 'string' && response.length > 0) {
          $adminBar = $(response);
          // Temporarily hide the admin bar while adjustments are made.
          $adminBar.css({visibility: 'hidden'}).appendTo('body', context);
          // Apply our behaviors.
          Backdrop.adminBar.attachBehaviors(context, settings, $adminBar);
          // Display the admin bar as soon as everything is done.
          setTimeout(function () {
            $adminBar.css({visibility: ''});
          }, 0);
        }
      });
    }
    // If the menu is in the output already, this means there is a new version.
    else if (!$adminBar.hasClass('admin-bar-processed')) {
      // Apply our behaviors.
      Backdrop.adminBar.attachBehaviors(context, settings, $adminBar);
    }
  }
};

/**
 * Retrieve content from client-side cache.
 *
 * @param hash
 *   The md5 hash of the content to retrieve.
 * @param onSuccess
 *   A callback function invoked when the cache request was successful.
 */
Backdrop.adminBar.getCache = function (hash, onSuccess) {
  // Check for locally cached content.
  if (Backdrop.adminBar.cache.hash) {
    if (typeof onSuccess === 'function') {
      onSuccess(Backdrop.adminBar.cache.hash);
    }
    return;
  }
  // Send an AJAX request for the admin bar content, only if we’re not already
  // waiting on a response from a previous request.
  if (!Backdrop.adminBar.ajaxRequest) {
    Backdrop.adminBar.ajaxRequest = $.ajax({
      cache: true,
      type: 'GET',
      dataType: 'text', // Prevent auto-evaluation of response.
      global: false, // Do not trigger global AJAX events.
      url: Backdrop.settings.admin_bar.basePath.replace(/admin_bar/, 'js/admin_bar/cache/' + hash),
      success: [function (response) {
        // Cache the response data in a variable.
        Backdrop.adminBar.cache.hash = response;
      }, onSuccess],
      complete: function () {
        Backdrop.adminBar.ajaxRequest = false;
      }
    });
  }
  else {
    // Invoke our callback when the AJAX request is complete.
    Backdrop.adminBar.ajaxRequest.done(onSuccess);
  }
};

/**
 * If we have a hash, send the AJAX request right away, in an effort to have it
 * complete as early as possible.
 */
if (Backdrop.settings.admin_bar.hash && Backdrop.settings.admin_bar.basePath) {
  Backdrop.adminBar.getCache(Backdrop.settings.admin_bar.hash);
}

/**
 * @defgroup admin_behaviors Administration behaviors.
 * @{
 */

/**
 * Attach administrative behaviors.
 */
Backdrop.adminBar.attachBehaviors = function (context, settings, $adminBar) {
  if ($adminBar.length) {
    $adminBar.addClass('admin-bar-processed');
    $.each(Backdrop.adminBar.behaviors, function() {
      this(context, settings, $adminBar);
    });
  }
};

/**
 * Apply active trail highlighting based on current path.
 */
Backdrop.adminBar.behaviors.adminBarActiveTrail = function (context, settings, $adminBar) {
  if (settings.admin_bar.activeTrail) {
    $adminBar.find('#admin-bar-menu > li > ul > li > a[href="' + settings.admin_bar.activeTrail + '"]').addClass('active-trail');
  }
};

/**
 * Apply margin to page.
 *
 * We apply the class to the HTML element, since it’s the only element that’s
 * guaranteed to exist at execution time.
 */
Backdrop.adminBar.behaviors.adminBarMarginTop = function (context, settings) {
  if (!settings.admin_bar.suppress && settings.admin_bar.margin_top) {
    $('html:not(.admin-bar)', context).addClass('admin-bar');
  }
};
// Don’t wait until the DOM is ready, run this immediately to prevent flickering
// or jumping page content.
Backdrop.adminBar.behaviors.adminBarMarginTop(document, Backdrop.settings);

/**
 * Apply 'position: fixed'.
 */
Backdrop.adminBar.behaviors.positionFixed = function (context, settings, $adminBar) {
  if (settings.admin_bar.position_fixed) {
    $adminBar.addClass('admin-bar-position-fixed');
    $adminBar.css('position', 'fixed');

    // Set a data attribute to inform other parts of the page that we're
    // offsetting the top margin, then trigger an offset change. See
    // tableheader.js for an example of how this is utilized.
    var height = $adminBar.height();
    $adminBar.attr('data-offset-top', height);
    $(document).triggerHandler('offsettopchange');
  }
};

/**
 * Perform dynamic replacements in cached menu.
 */
Backdrop.adminBar.behaviors.replacements = function (context, settings, $adminBar) {
  for (var item in settings.admin_bar.replacements) {
    if (settings.admin_bar.replacements.hasOwnProperty(item)) {
      $(item, $adminBar).html(settings.admin_bar.replacements[item]);
    }
  }
};

/**
 * Inject destination query strings for current page.
 */
Backdrop.adminBar.behaviors.destination = function (context, settings, $adminBar) {
  if (settings.admin_bar.destination) {
    $('a.admin-bar-destination', $adminBar).each(function() {
      this.search += (!this.search.length ? '?' : '&') + Backdrop.settings.admin_bar.destination;
    });
  }
};

/**
 * Adjust the top level items based on the available viewport width.
 */
Backdrop.adminBar.behaviors.collapseWidth = function (context, settings, $adminBar) {
  var $menu = $adminBar.find('#admin-bar-menu');
  var $extra = $adminBar.find('#admin-bar-extra');
  var menuWidth;
  var extraWidth;
  var availableWidth;

  var adjustItems = function () {
    // Expand the menu items to their full width to check their size.
    $menu.removeClass('dropdown').addClass('top-level');
    $extra.removeClass('dropdown').addClass('top-level');

    $adminBar.trigger('beforeResize');

    menuWidth = $menu.width();
    extraWidth = $extra.width();

    // Available width is anything except the menus that may be collapsed.
    availableWidth = $adminBar.width();
    $adminBar.children().children().not($menu).not($extra).each(function() {
      availableWidth -= $(this).width();
    });

    // Collapse the extra items first if needed.
    if (availableWidth - menuWidth - extraWidth < 20) {
      $extra.addClass('dropdown').removeClass('top-level');
      extraWidth = $extra.width();
    }
    // See if the menu also needs to be collapsed.
    if (availableWidth - menuWidth - extraWidth < 20) {
      $menu.addClass('dropdown').removeClass('top-level');
    }
    $adminBar.trigger('afterResize');
  };


  adjustItems();
  // Adjust items when window is resized.
  Backdrop.optimizedResize.add(adjustItems);

};

/**
 * Apply JavaScript-based hovering behaviors.
 *
 * @todo This has to run last.  If another script registers additional behaviors
 *   it will not run last.
 */
Backdrop.adminBar.behaviors.hover = function (context, settings, $adminBar) {
  // Bind events for opening and closing menus on hover/click/touch.
  $adminBar.on('mouseenter', 'li.expandable', expandChild);
  $adminBar.on('mouseleave', 'li.expandable', closeChild);

  // On touch devices, the first click on an expandable link should not go to
  // that page, but a second click will. Use touch start/end events to target
  // these devices.
  var touchElement;
  var needsExpanding;
  $adminBar.on('touchstart touchend click', 'li.expandable > a, li.expandable > span', function(e) {
    // The touchstart event fires before all other events, including mouseenter,
    // allowing us to check the expanded state consistently across devices.
    if (e.type === 'touchstart') {
      touchElement = e.target;
      needsExpanding = $(this).siblings('ul').length > 0 && !$(this).siblings('ul').hasClass('expanded');
    }
    // If clicking on a not-yet-expanded item, expand it and suppress the click.
    if ((e.type === 'click' || e.type === 'touchend') && touchElement) {
      if (touchElement === e.target) {
        if (needsExpanding) {
          expandChild.apply($(this).parent()[0], [e]);
          e.preventDefault();
        }
        else if ($(this).is('span')) {
          closeChild.apply($(this).parent()[0], [e]);
        }
      }
      // If the touch ended on a different element than it started, suppress it.
      else if (touchElement !== e.target) {
        e.preventDefault();
      }
    }
  });

  // Close all menus if clicking outside the menu.
  $(document).on('click', function (e) {
    if ($(e.target).closest($adminBar).length === 0) {
      $adminBar.find('ul').removeClass('expanded');
    }
  });

  function expandChild(e) {
    // Stop the timer.
    clearTimeout(this.sfTimer);

    // Display child lists.
    var $childList = $(this).children('ul');

    // Add classes for the expanded trail of links.
    $childList
      .parents('ul').addBack().addClass('expanded')
      .siblings('a, span').addClass('expanded-trail');
    // Immediately hide nephew lists.
    $childList.parent().siblings('li')
      .find('ul.expanded').removeClass('expanded').end()
      .find('.expanded-trail').removeClass('expanded-trail');

    // Check if child is outside viewport.
    var $outside = outsideViewport($childList[0]);
    if ($outside.right) {
      $(this).addClass('outside-right');
    }
    if ($outside.left) {
      $(this).addClass('outside-left');
    }
  }
  function closeChild(e) {
    // Start the timer.
    var $uls = $(this).find('> ul');
    var $link = $(this).find('> a, > span');
    var $li = $(this);
    this.sfTimer = setTimeout(function () {
      $uls.removeClass('expanded');
      $link.removeClass('expanded-trail');
      $li.removeClass('outside-right');
      $li.removeClass('outside-left');
    }, 400);
  }
  function outsideViewport(e) {
    var $rect = e.getBoundingClientRect();

    var $out = {};
    $out.left = $rect.left < 0;
    $out.right = $rect.right > (window.innerWidth || document.documentElement.clientWidth);

    return $out;
  }
};

/**
 * Apply the search bar functionality.
 */
Backdrop.adminBar.behaviors.search = function (context, settings, $adminBar) {
  var $input = $adminBar.find('.admin-bar-search input');
  // Initialize the current search needle.
  var needle = $input.val();
  // Cache of all links that can be matched in the menu.
  var links;
  // Minimum search needle length.
  var needleMinLength = 2;
  // Append the results container.
  var $results = $('<div class="admin-bar-search-results" />').insertAfter($input.parent());

  /**
   * Executes the search upon user input.
   */
  function keyupHandler(e) {
    var matches, $html, value = $(this).val();

    // Only proceed if the search needle has changed.
    if (value !== needle || e.type === 'focus') {
      needle = value;
      // Initialize the cache of menu links upon first search.
      if (!links && needle.length >= needleMinLength) {
        links = buildSearchIndex($adminBar.find('#admin-bar-menu .dropdown li:not(.admin-bar-action, .admin-bar-action li) > a'));
      }

      // Close any open items.
      $adminBar.find('li.highlight').trigger('mouseleave').removeClass('highlight');

      // Empty results container when deleting search text.
      if (needle.length < needleMinLength) {
        $results.empty();
      }
      // Only search if the needle is long enough.
      if (needle.length >= needleMinLength && links) {
        matches = findMatches(needle, links);
        // Build the list in a detached DOM node.
        $html = buildResultsList(matches);
        // Display results.
        $results.empty().append($html);
      }
      $adminBar.trigger('searchChanged');
    }
  }

  /**
   * Builds the search index.
   */
  function buildSearchIndex($links) {
    return $links
      .map(function () {
        var text = (this.textContent || this.innerText);
        // Skip menu entries that do not contain any text (e.g., the icon).
        if (typeof text === 'undefined') {
          return;
        }
        return {
          text: text,
          textMatch: text.toLowerCase(),
          element: this
        };
      });
  }

  /**
   * Searches the index for a given needle and returns matching entries.
   */
  function findMatches(needle, links) {
    var needleMatch = needle.toLowerCase();
    // Select matching links from the cache.
    return $.grep(links, function (link) {
      return link.textMatch.indexOf(needleMatch) !== -1;
    });
  }

  /**
   * Builds the search result list in a detached DOM node.
   */
  function buildResultsList(matches) {
    var $html = $('<ul class="dropdown" />');
    $.each(matches, function () {
      var result = this.text;
      var $element = $(this.element);

      // Check whether there is a parent category that can be prepended.
      var $category = $element.parent().parent().parent();
      var categoryText = $category.find('> a').text();
      if ($category.length && categoryText) {
        result = categoryText + ': ' + result;
      }

      var $result = $('<li><a href="' + $element.attr('href') + '"> </a></li>');
      $result.children().text(result);
      $result.data('original-link', $(this.element).parent());
      $html.append($result);
    });
    return $html;
  }

  /**
   * Highlights selected result.
   */
  function resultsHandler(e) {
    var $this = $(this);
    var show = e.type === 'mouseenter' || e.type === 'focusin' || e.type === 'touchstart';
    // Suppress the normal click handling on first touch, only highlighting.
    if (e.type === 'touchstart' && !$(this).hasClass('active-search-item')) {
      e.preventDefault();
    }
    $adminBar.find('.active-search-item').each(function () {
      $(this).removeClass('active-search-item');
      if ($(this).is('[class=""]')) {
        $(this).removeAttr('class');
      }
    });
    if (show) {
      $this.addClass('active-search-item');
    }
    $this.trigger(show ? 'showPath' : 'hidePath', [this]);
  }

  /**
   * Closes the search results and clears the search input.
   */
  function resultsClickHandler(e, link) {
    var $original = $(this).data('original-link');
    $original.trigger('mouseleave');
    $input.val('').trigger('keyup');
  }

  /**
   * Shows the link in the menu that corresponds to a search result.
   */
  function highlightPathHandler(e, link) {
    if (link) {
      $adminBar.find('li.highlight').removeClass('highlight');
      var $original = $(link).data('original-link');
      var show = e.type === 'showPath';
      // Toggle an additional CSS class to visually highlight the matching link.
      $original.toggleClass('highlight', show);
      $original.trigger(show ? 'mouseenter' : 'mouseleave');
    }
  }

  function resetSearchDisplay(e) {
    $adminBar.find('#admin-bar-extra > li > ul > li:not(li.admin-bar-search)').css('display', '');
  }
  function updateSearchDisplay(e) {
    // Build the list of extra items to be hidden if in small window mode.
    var $hideItems = $adminBar.find('#admin-bar-extra > li > ul > li:not(li.admin-bar-search)').css('display', '');
    if ($results.children().length) {
      if ($adminBar.find('#admin-bar-extra').hasClass('dropdown')) {
        $hideItems.css('display', 'none');
      }
    }
  }

  // Attach showPath/hidePath handler to search result entries.
  $results.on('touchstart mouseenter focus blur', 'li', resultsHandler);
  // Hide the result list after a link has been clicked.
  $results.on('click', 'li', resultsClickHandler);
  // Attach hover/active highlight behavior to search result entries.
  $adminBar.on('showPath hidePath', '.admin-bar-search-results li', highlightPathHandler);
  // Show/hide the extra parts of the menu on resize.
  $adminBar.on('beforeResize', resetSearchDisplay);
  $adminBar.on('afterResize searchChanged', updateSearchDisplay);
  // Attach the search input event handler.
  $input.on('focus keyup search', keyupHandler);

  // Close search if clicking outside the menu.
  $(document).on('click', function (e) {
    if ($(e.target).closest($adminBar).length === 0) {
      $results.empty();
    }
  });
};

/**
 * Replaces the "Home" link with "Back to site" link.
 *
 * Back to site link points to the last non-administrative page the user visited
 * within the same browser tab.
 */
Backdrop.adminBar.behaviors.escapeAdmin = function (context, settings) {
  if (!settings.admin_bar.back_to_site_link) {
    return;
  }

  // Grab the stored path of the last non-admin page.
  var escapeAdminPath = sessionStorage.getItem("escapeAdminPath");

  // Saves the last non-administrative page in the browser to be able to link back
  // to it when browsing administrative pages. If there is a destination parameter
  // there is not need to save the current path because the page is loaded within
  // an existing "workflow".
  if (
    !settings.admin_bar.current_path_is_admin &&
    !/destination=/.test(window.location.search)
  ) {
    sessionStorage.setItem(
      "escapeAdminPath",
      window.location
    );
  }

  // We only want to change the first anchor tag in the admin bar icon sub-menu.
  var $toolbarEscape = $(".admin-bar-icon a").first();

  // If the current page is admin, then switch the path.
  if (
    $toolbarEscape.length &&
    settings.admin_bar.current_path_is_admin &&
    escapeAdminPath !== null
  ) {
    $toolbarEscape.addClass("escape");
    $toolbarEscape.attr("href", escapeAdminPath);
    $toolbarEscape.text(Backdrop.t("Back to site"));
  }
};
/**
 * @} End of "defgroup admin_behaviors".
 */

})(jQuery);
;
