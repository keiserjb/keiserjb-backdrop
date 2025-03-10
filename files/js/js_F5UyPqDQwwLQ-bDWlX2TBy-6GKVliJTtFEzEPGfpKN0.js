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
+function(i,t,e){"use strict";var s={size:{min:.1,max:10,default:1},shrink:{min:.2,max:1,default:.8},regrow:{min:.2,max:1,default:.8},minRows:{min:1,max:99,default:1},maxRows:{min:1,max:99,default:2},prefixReserve:{min:0,max:.8,default:.3},prefixHide:{min:.1,max:10,default:2},alignRight:{type:"boolean",default:!1}},n=function(){var i=t.fn.jquery.split(".");return 1==i[0]&&i[1]<8}();i.rrssbConfigAll=function(i){t(".rrssb").each(function(){t(this).rrssbConfig(i)})},t.fn.rrssbConfig=function(i){if(!t(this).data("settings")||i){var e={};for(var n in s)e[n]=s[n].default,i&&("boolean"==s[n].type?e[n]=Boolean(i[n]):isNaN(parseFloat(i[n]))||(e[n]=Math.min(s[n].max,Math.max(s[n].min,i[n]))));t(this).data("settings",e),h.call(this)}};var r,a=function(){t(".rrssb").each(h)},h=function(){var i=t(this).data("orig");i||(i=function(){var i=t(".rrssb-prefix",this),e=i.length?i.clone().css({visibility:"hidden","white-space":"nowrap",display:"inline"}).appendTo(this):null;t("ul").contents().filter(function(){return this.nodeType===Node.TEXT_NODE}).remove();var s={width:0,buttons:0,height:t("li",this).innerHeight(),fontSize:parseFloat(t(this).css("font-size")),prefixWidth:e?e.innerWidth():0};return t("li",this).each(function(){s.width=Math.max(s.width,t(this).innerWidth()),s.buttons++}),t(this).data("orig",s),e&&e.remove(),s}.call(this));var e=t(this).data("settings"),s=i.width*e.size,r=i.buttons,a=t(this).innerWidth()-1,h=a<s*e.shrink?"":s;n?t("li",this).width(h):t("li",this).innerWidth(h);var o=a/e.shrink,l=i.prefixWidth*e.size;l>o*e.prefixHide?(l=0,t(".rrssb-prefix",this).css("display","none")):t(".rrssb-prefix",this).css("display","");var c=l<=a*e.prefixReserve?o-l:o,f=Math.floor(c/s);f*e.maxRows<r?(t(this).addClass("no-label"),s=i.height*e.size,f=Math.max(1,Math.floor(c/s))):t(this).removeClass("no-label");var d=e.minRows>1?Math.max(1,Math.ceil(r/(e.minRows-1))-1):r;f=Math.min(f,d),f=Math.ceil(r/Math.ceil(r/f)),d=Math.ceil(r/Math.ceil(r/d));var u=Math.floor(1e4/f)/100;t("li",this).css("max-width",u+"%");var m=s*f+l;m>o&&(m-=l,l=0);var p=f<d?e.regrow:1,g=Math.min(p,a/m),b=i.fontSize*e.size*g*.98;if(t(this).css("font-size",b+"px"),l){var x=Math.floor(1e4*l/m)/100;t(".rrssb-buttons",this).css("padding-left",x+"%"),t(".rrssb-prefix",this).css("position","absolute");var v=Math.ceil(r/f)*i.height/i.fontSize;t(".rrssb-prefix",this).css("line-height",v+"em")}else t(".rrssb-buttons",this).css("padding-left",""),t(".rrssb-prefix",this).css("position",""),t(".rrssb-prefix",this).css("line-height","");var w=e.alignRight?"padding-left":"padding-right";if(g>=.999*p){var M=Math.floor(1e4*(a-m*g*1.02)/a)/100;t(this).css(w,M+"%")}else t(this).css(w,"")},o=function(i){r&&clearTimeout(r),r=setTimeout(a,i||200)};t(document).ready(function(){t(".rrssb-buttons a.popup").click(function(e){!function(t,e,s,n){var r=void 0!==i.screenLeft?i.screenLeft:screen.left,a=void 0!==i.screenTop?i.screenTop:screen.top,h=(i.innerWidth?i.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width)/2-s/2+r,o=(i.innerHeight?i.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height)/3-n/3+a,l=i.open(t,e,"scrollbars=yes, width="+s+", height="+n+", top="+o+", left="+h);l&&l.focus&&l.focus()}(t(this).attr("href"),t(this).find(".rrssb-text").html(),580,470),e.preventDefault()}),t(i).resize(o),t(document).ready(function(){rrssbConfigAll()})})}(window,jQuery);;
