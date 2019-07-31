// =============================================================================
//
//  SKELETOR
//
// =============================================================================

// -----------------------------------------------------------------------------
//  SET MIN HEIGHT OF THE PIT
// -----------------------------------------------------------------------------

function setHeight() {

  footerHeight = $('.footer').outerHeight();
  windowHeight = $(window).outerHeight();
  offsetShrink = 250; // height value that stops script on mobile

  if (windowHeight > offsetShrink) {
    $('.the-pit').css('min-height', (windowHeight - footerHeight)).delay(800);
  }

};

// ---------------------------------------------------------------------------
//  PAUSED YOUTUBE VIDEO
// ---------------------------------------------------------------------------

/*
 * @author       Rob W (http://stackoverflow.com/a/7513356/938089
 * @description  Executes function on a framed YouTube video (see previous link)
 *               For a full list of possible functions, see:
 *               http://code.google.com/apis/youtube/js_api_reference.html
 * @param String frame_id The id of (the div containing) the frame
 * @param String func     Desired function to call, eg. "playVideo"
 * @param Array  args     (optional) List of arguments to pass to function func*/

function callPlayer(frame_id, func, args) {
  if (window.jQuery && frame_id instanceof jQuery) frame_id = frame_id.get(0).id;
  var iframe = document.getElementById(frame_id);
  if (iframe && iframe.tagName.toUpperCase() != 'IFRAME') {
      iframe = iframe.getElementsByTagName('iframe')[0];
  }
  if (iframe) {
      // Frame exists,
      iframe.contentWindow.postMessage(JSON.stringify({
          "event": "command",
          "func": func,
          "args": args || [],
          "id": frame_id
      }), "*");
  }
}

// ---------------------------------------------------------------------------
//  SHRINK TOPBAR
// ---------------------------------------------------------------------------

$(window).scroll(function () {
  // 90 is the height of the full topbar
  if ($(window).scrollTop() > 90) {
    $('.topbar').addClass('shrink');
  }
  else{
    $('.topbar').removeClass('shrink');
  }
});

// ---------------------------------------------------------------------------
//  CLOSE LIGHTBOX
// ---------------------------------------------------------------------------

$(document).keydown(function(e) {
  if (e.keyCode == 27) {
    $('body').removeClass('lightbox--active');
    callPlayer('theplayer', 'pauseVideo');
  }
});

// =============================================================================
//
//  DOCUMENT READY
//
// =============================================================================

$(function() { // wait for document ready

  // ---------------------------------------------------------------------------
  //  VENDOR
  // ---------------------------------------------------------------------------

  // allows copy to user's clipboard
  var myClipboard = require('./clipboard');

  // jquery easing plugins for more easing options
  var myEasing = require('./easing');

  // ---------------------------------------------------------------------------
  //  CLIPBOARD
  // ---------------------------------------------------------------------------
  //  https://clipboardjs.com/
  // ---------------------------------------------------------------------------

  var clipboard = new Clipboard('.clipboard');

  clipboard.on('success', function(e) {

    // console.info('Action:', e.action);
    // console.info('Text:', e.text);
    // console.info('Trigger:', e.trigger);
    $('.info-bar').fadeIn().delay(1000).fadeOut();

    e.clearSelection();

  });

  // ---------------------------------------------------------------------------
  //  SMOOTH CRIMINAL
  // ---------------------------------------------------------------------------

  $('.smooth-criminal').on('click touchstart', function(e) {
    e.preventDefault();
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if ((target.length) && ($('body').hasClass('were-different'))) {
        var panelIndicatorHeight = $('#panel-indicator').height();
        var topbarHeight = $('.topbar').height();
        var metabarHeight = $('.metabar').height();
        $('html,body').animate({
          scrollTop: target.offset().top - topbarHeight - panelIndicatorHeight - metabarHeight
        });
        return false;
      } else {
        $('html,body').animate({
          scrollTop: target.offset().top
        });
        return false;
      }
    }
  });

  // ---------------------------------------------------------------------------
  //  RESPONSIVE VIDEO
  // ---------------------------------------------------------------------------

  // find all videos
  var $allVideos = $("iframe[src*='//player.twitch.tv'], iframe[src*='//player.vimeo.com'], iframe[src*='//www.youtube.com'],iframe[src*='//www.facebook.com'], object, embed");

  // set fluid element (for fluid video content)
  // *** DEPRECIATE .lightbox--video in favor of .lightbox--iframe ***
  var $fluidEl = $(".lightbox--video, .lightbox--iframe .lightbox__content");

  $allVideos.each(function() {
    $(this)
      // *jQuery .data does not work on object/embed elements
      .attr('data-aspectRatio', this.height / this.width)
      .removeAttr('height')
      .removeAttr('width');
  });

  // RESIZE
  $(window).resize(function() {

    $allVideos.each(function() {
    var newWidth = $fluidEl.width();
      var $el = $(this);
      $el
        .width(newWidth)
        .height(newWidth * $el.attr('data-aspectRatio'));
    });

  }).resize();

  // ---------------------------------------------------------------------------
  //  YOUTUBE DATA INJECT LIGHTBOX
  // ---------------------------------------------------------------------------

  // v2
  // version 2 features 2 data attributes that you set on the button that you
  // want to open the light box. #1 is data-target and will almost always be
  // .lightbox. #2 put in the share url from youtube with data-video

  $(".js-lightbox").click(function () {
    var theLightbox = $(this).data("target"),
    videoSRC = $(this).data("video"),
    videoSRCauto = videoSRC + "?enablejsapi=1;rel=0";
    $(theLightbox + ' iframe').attr('src', videoSRCauto);
  });

  // ---------------------------------------------------------------------------
  //  LIGHTBOX
  // ---------------------------------------------------------------------------

  // Toggles the Lightbox on and off
  $('.js-lightbox').on('click touchend', function(e) {
    e.preventDefault();
     $('body').toggleClass('lightbox--active');
  });

  // Hides the Lightbox if you click outside of Lightbox content
  $('.lightbox__close-surface, .lightbox__controls').on('click touchend', function(e){
    e.preventDefault();
    $('body').removeClass('lightbox--active');
    callPlayer('theplayer', 'pauseVideo');
  });

  // ---------------------------------------------------------------------------
  //  DROPDOWNS
  // ---------------------------------------------------------------------------

  $('.primary-nav__block').find('.primary-nav__button').on('click touchstop', function(e) {

    var dropdownMenu = $(this).next();

    // Prevent default behavior. Speeds up clicking on mobile
    e.preventDefault();

    // Remove all the active classes
    $('.primary-nav__button').removeClass('active');
    $(this).addClass('active');

    // -- MOBILE

    if ($('body').hasClass('nav--is-on')) {
      //Expand or collapse this panel
      dropdownMenu.slideToggle('fast', 'swing');
      // The Close Surface needs this class to properly hide when clicked
      $('body').addClass('dropdown--is-on');
      //Hide the other panels
      $('.primary-nav__dropdown').not(dropdownMenu).slideUp('fast', 'swing');

    // -- DESKTOP

    } else {
      if (dropdownMenu.is(':visible')){
        // When clicking on a menu that is already open this closes it
        dropdownMenu.slideUp('fast', 'swing');
        $('body').removeClass('dropdown--is-on');
        $(this).removeClass('active');
      } else {
        // Fade the panels in instead of slide
        dropdownMenu.fadeIn();
        $('body').addClass('dropdown--is-on');
        // Hide the other dropdowns
        $('.primary-nav__dropdown').not(dropdownMenu).fadeOut('fast', 'swing');
      }
    }

  });

  // ---------------------------------------------------------------------------
  //  WHOPPER
  // ---------------------------------------------------------------------------

  $('.js-toggle-mobile-menu, .whopper').on('click touchstart', function(e) {
    e.preventDefault();
    // Change the button icon
    if ($('.whopper i').hasClass('fs-bars')){
      $('.whopper i').removeClass('fs-bars');
      $('.whopper i').addClass('fs-close');
    } else {
      $('.whopper i').removeClass('fs-close');
      $('.whopper i').addClass('fs-bars');
    }
    // Control the open and close of the nav panel
    if ($('body').hasClass('nav--is-on')){
      // Close the nav and dropdown
      $('body').removeClass('nav--is-on');
      $('body').removeClass('dropdown--is-on');
      $('.primary-nav__dropdown').slideUp('fast', 'swing');
      $('.primary-nav__button').removeClass('active');
    } else {
      // Open the nav. This also activated overflow hidden to stop page from
      // scrolling when nav is open
      $('body').addClass('nav--is-on');
    }
    // Turn off the off-canvas panel when navigation opens
    $('body').removeClass('off-canvas--is-on');
  });

  // ---------------------------------------------------------------------------
  //  CLOSE SURFACE
  // ---------------------------------------------------------------------------

  // This surface will close the primary nav when in off-canvas mode
  $('.close-surface').on('click touchstart', function(e) {
    e.preventDefault();
    // Close Nav
    $('body').removeClass('nav--is-on');
    // Close Filter
    $('body').removeClass('off-canvas--is-on');
    // Close Dropdown
    if ($('body').hasClass('dropdown--is-on')){
      $('body').removeClass('dropdown--is-on');
      $('.primary-nav__dropdown').slideUp('fast', 'swing');
    }
    $('.primary-nav__button').removeClass('active');
    // Change the button icon
    $('.js-toggle-mobile-menu, .whopper').children().removeClass('fs-close');
    $('.js-toggle-mobile-menu, .whopper').children().addClass('fs-bars');
    // Remove active state from dropdown buttons
    $('.primary-nav__block').removeClass('active');
    // Close the search
    $('body').removeClass('search--is-on');
  });

  // ---------------------------------------------------------------------------
  //  OFF CANVAS TOGGLE
  // ---------------------------------------------------------------------------

  $('.js-toggle-off-canvas').on('click touchstart', function(e) {
    e.preventDefault();
    $('body').toggleClass('off-canvas--is-on');
  });

  // ---------------------------------------------------------------------------
  //  SEARCH TOGGLE
  // ---------------------------------------------------------------------------

  $('.js-toggle-search').on('click touchstart', function(e) {
    e.preventDefault();
    $('body').toggleClass('search--is-on');
    $('.site-search__field').focus();
  });

  // ---------------------------------------------------------------------------
  //  ACCORDION
  // ---------------------------------------------------------------------------
  //  http://www.jacklmoore.com/notes/jquery-accordion-tutorial/
  // ---------------------------------------------------------------------------

  // .each() is used to create a closure to store a cache of the query.
  $('.accordion-card').each(function(){
    var $dropdownButton = $(this).find('.accordion-card__button');
    var $dropdown = $(this).find('.accordion-card__dropdown');
    $dropdownButton.on('click touchstart', function(e){
      e.preventDefault();
      $dropdown.parent().toggleClass('accordion-card--active');
      $dropdown.not(':animated').slideToggle(400, 'easeInOutQuad');
    });
  });

  // ---------------------------------------------------------------------------
  //  DROPDOWN MENUS (basic)
  // ---------------------------------------------------------------------------

  $('.dropdown__toggle').on('click touchstart', function(e) {
    e.preventDefault();
    $(this).parent('.dropdown').toggleClass('show');
  });

  // ---------------------------------------------------------------------------
  // CLOSE WINDOW
  // ---------------------------------------------------------------------------

  var buttonCloseWindow = $('.js-close-window');
  buttonCloseWindow.click(function(){
    window.close();
  });

  // ---------------------------------------------------------------------------
  // INIT SET HEIGHT
  // ---------------------------------------------------------------------------

  setHeight();

}); // END document ready

// ===========================================================================
//
//  RESIZE
//
// ===========================================================================

// fire resize events for height of the-pit
window.addEventListener('resize', function() {
  setHeight();
}, false);

// ===========================================================================
//
//  VANILLA JS
//
// ===========================================================================

// ---------------------------------------------------------------------------
//  ON DEMAND YOUTUBE EMBED
// ---------------------------------------------------------------------------
//  Light YouTube Embeds by @labnol
//  Web: http://www.labnol.org/internet/light-youtube-embeds/27941/
//  Notes: this has to sit outside the document ready
// ---------------------------------------------------------------------------

/* Light YouTube Embeds by @labnol */
/* Web: http://labnol.org/?p=27941 */

document.addEventListener("DOMContentLoaded",

  function() {
    var div, n,
        v = document.getElementsByClassName("youtube-player");
    for (n = 0; n < v.length; n++) {
        div = document.createElement("div");
        div.setAttribute("data-id", v[n].dataset.id);
        div.innerHTML = labnolThumb(v[n].dataset.id);
        div.onclick = labnolIframe;
        v[n].appendChild(div);
    }
  });

function labnolThumb(id) {
  var thumb = '<img src="https://i.ytimg.com/vi/ID/hqdefault.jpg">',
      play = '<div class="play"></div>';
  return thumb.replace("ID", id) + play;
}

function labnolIframe() {
  var iframe = document.createElement("iframe");
  var embed = "https://www.youtube.com/embed/ID?autoplay=1";
  iframe.setAttribute("src", embed.replace("ID", this.dataset.id));
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("allowfullscreen", "1");
  this.parentNode.replaceChild(iframe, this);
}
