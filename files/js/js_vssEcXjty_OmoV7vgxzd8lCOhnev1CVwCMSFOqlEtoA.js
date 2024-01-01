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
