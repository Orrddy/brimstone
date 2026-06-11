/**
 * BrimStone Brokerage — Dropdown Menu Fix
 * ----------------------------------------
 * The Elementor Pro nav-menu webpack chunk (334 / nav-menu.bundle.min.js)
 * was not captured by HTTrack. This script replaces it by:
 *   1. Patching __webpack_require__.f so chunk 334 silently resolves.
 *   2. Initialising jQuery SmartMenus directly on every .elementor-nav-menu.
 *   3. Wiring up the mobile hamburger toggle.
 *   4. Keeping the sticky-header desktop layout intact.
 */
(function ($) {
  'use strict';

  /* ── 1. Silence the missing webpack chunk ─────────────────────────────── */
  function patchWebpack() {
    try {
      // elementor-pro's runtime stores chunk loaders in __webpack_require__.f
      // We inject a no-op that resolves chunk 334 (nav-menu) immediately.
      var tryPatch = function () {
        if (
          typeof __webpack_require__ !== 'undefined' &&
          __webpack_require__.f
        ) {
          var origJ = __webpack_require__.f.j;
          __webpack_require__.f.j = function (chunkId, promises) {
            if (chunkId === 334) {
              // Resolve silently — our own SmartMenus init handles this.
              return;
            }
            if (origJ) origJ(chunkId, promises);
          };
        }
      };
      tryPatch();
      // Also try after scripts have executed
      $(window).on('load', tryPatch);
    } catch (e) { /* silent */ }
  }

  /* ── 2. SmartMenus initialisation ─────────────────────────────────────── */
  function initSmartMenus() {
    if (!$.fn.smartmenus) {
      // SmartMenus not loaded yet — retry shortly
      setTimeout(initSmartMenus, 150);
      return;
    }

    // Patch SmartMenus to treat Elementor's CSS-controlled dropdowns as "CSS on"
    $.SmartMenus.prototype.isCSSOn = function () { return true; };

    // Target only the horizontal desktop nav (not the mobile clone)
    $('.elementor-nav-menu--layout-horizontal .elementor-nav-menu').each(function () {
      if ($(this).data('smartmenus')) return; // already initialised
      $(this).smartmenus({
        subMenusSubOffsetX : 1,
        subMenusSubOffsetY : -8,
        subIndicators      : false,
        collapsibleBehavior: 'accordion',
        keepInViewport     : false
      });
    });
  }

  /* ── 3. Mobile hamburger toggle ───────────────────────────────────────── */
  function initMobileToggle() {
    $(document).on('click', '.elementor-menu-toggle', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $toggle  = $(this);
      var $widget  = $toggle.closest('.elementor-widget-nav-menu');
      var $dropdown = $widget.find('.elementor-nav-menu--dropdown.elementor-nav-menu__container').first();
      var isOpen   = $toggle.hasClass('elementor-active');

      if (isOpen) {
        $toggle.attr('aria-expanded', 'false').removeClass('elementor-active');
        $dropdown.attr('aria-hidden', 'true').slideUp(250);
        $widget.removeClass('elementor-nav-menu--opened');
      } else {
        $toggle.attr('aria-expanded', 'true').addClass('elementor-active');
        $dropdown.attr('aria-hidden', 'false').slideDown(250);
        $widget.addClass('elementor-nav-menu--opened');
      }
    });

    // Close on outside click
    $(document).on('click', function (e) {
      if (!$(e.target).closest('.elementor-widget-nav-menu').length) {
        $('.elementor-menu-toggle.elementor-active').each(function () {
          var $widget   = $(this).closest('.elementor-widget-nav-menu');
          var $dropdown = $widget.find('.elementor-nav-menu--dropdown.elementor-nav-menu__container').first();
          $(this).attr('aria-expanded', 'false').removeClass('elementor-active');
          $dropdown.attr('aria-hidden', 'true').slideUp(200);
          $widget.removeClass('elementor-nav-menu--opened');
        });
      }
    });

    // Mobile sub-menu accordion (click on parent <a>)
    $(document).on('click', '.elementor-nav-menu--dropdown .menu-item-has-children > a', function (e) {
      var $sub = $(this).siblings('.sub-menu, .elementor-nav-menu--dropdown');
      if ($sub.length) {
        e.preventDefault();
        $sub.slideToggle(200);
        $(this).parent().toggleClass('sm-open');
      }
    });
  }

  /* ── 4. Desktop: ensure sub-menus are positioned correctly ───────────── */
  function fixDropdownCSS() {
    // Force sub-menus to appear (SmartMenus handles display via JS classes,
    // but we add a CSS safety net for pure-CSS fallback).
    var style = document.createElement('style');
    style.id  = 'brimstone-dropdown-fix';
    style.textContent = [
      /* Desktop hover reveal via SmartMenus adds .sm-nowrap; we also add CSS hover as fallback */
      '.elementor-nav-menu--main .menu-item-has-children:hover > .elementor-nav-menu--dropdown {',
      '  display: block !important;',
      '  visibility: visible !important;',
      '  opacity: 1 !important;',
      '  transform: none !important;',
      '  position: absolute !important;',
      '}',
      /* Sub-menu base reset — hidden by default */
      '.elementor-nav-menu--main .elementor-nav-menu--dropdown {',
      '  display: none;',
      '  position: absolute !important;',
      '  top: 100%;',
      '  left: 0;',
      '  z-index: 9999;',
      '  min-width: 200px;',
      '  background: #fff;',
      '  box-shadow: 0 8px 24px rgba(0,0,0,.12);',
      '  border-top: 2px solid #2d4a35;',
      '}',
      /* Items inside desktop dropdown */
      '.elementor-nav-menu--main .elementor-nav-menu--dropdown .elementor-sub-item {',
      '  display: block;',
      '  padding: 10px 20px;',
      '  color: #2d4a35;',
      '  white-space: nowrap;',
      '  transition: background .15s, padding-left .15s;',
      '}',
      '.elementor-nav-menu--main .elementor-nav-menu--dropdown .elementor-sub-item:hover {',
      '  background: #f7f3ee;',
      '  padding-left: 26px;',
      '}',
      /* Ensure parent li is position:relative for sub-menu absolute positioning */
      '.elementor-nav-menu--main > li.menu-item-has-children {',
      '  position: relative;',
      '}',
      /* Mobile sub-menu (inside the vertical mobile nav) */
      '.elementor-nav-menu--dropdown.elementor-nav-menu__container .menu-item-has-children > .sub-menu {',
      '  display: none !important;',
      '}',
      '.elementor-nav-menu--dropdown.elementor-nav-menu__container .menu-item-has-children.sm-open > .sub-menu {',
      '  display: block !important;',
      '}',
      /* Active mobile dropdown container override */
      '.elementor-menu-toggle.elementor-active + .elementor-nav-menu__container {',
      '  display: block !important;',
      '  max-height: none !important;',
      '  transform: scaleY(1) !important;',
      '  opacity: 1 !important;',
      '  visibility: visible !important;',
      '}',
      /* Responsive positioning and premium styling for mobile/tablet */
      '@media (max-width: 1024px) {',
      '  .elementor-widget-nav-menu {',
      '    position: relative !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container {',
      '    position: absolute !important;',
      '    top: 100% !important;',
      '    right: 0 !important;',
      '    left: auto !important;',
      '    width: 320px !important;',
      '    max-width: 92vw !important;',
      '    background-color: #fff !important;',
      '    border: 1px solid #e2dbce !important;',
      '    border-top: 4px solid #2d4a35 !important;',
      '    box-shadow: 0 12px 36px rgba(0,0,0,0.16) !important;',
      '    border-radius: 6px !important;',
      '    padding: 8px 0 !important;',
      '    z-index: 999999 !important;',
      '    box-sizing: border-box !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container ul {',
      '    display: block !important;',
      '    list-style: none !important;',
      '    margin: 0 !important;',
      '    padding: 0 !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container li {',
      '    position: relative !important;',
      '    display: block !important;',
      '    border: none !important;',
      '    margin: 0 !important;',
      '    padding: 0 !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container a.elementor-item,',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container a.elementor-sub-item {',
      '    display: flex !important;',
      '    align-items: center !important;',
      '    justify-content: space-between !important;',
      '    padding: 12px 20px !important;',
      '    color: #2d4a35 !important;',
      '    font-size: 15px !important;',
      '    font-weight: 500 !important;',
      '    text-decoration: none !important;',
      '    text-shadow: none !important;',
      '    box-shadow: none !important;',
      '    border-bottom: 1px solid #f6f1e8 !important;',
      '    border-left: 4px solid transparent !important;',
      '    transition: all 0.2s ease !important;',
      '    box-sizing: border-box !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container li:last-child > a {',
      '    border-bottom: none !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container a:hover,',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container a.elementor-item-active {',
      '    background-color: #fcfaf7 !important;',
      '    color: #1b3021 !important;',
      '    padding-left: 24px !important;',
      '    border-left-color: #2d4a35 !important;',
      '  }',
      '  /* Sub-menu (accordion drawer) */',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container .sub-menu {',
      '    display: none !important;',
      '    background-color: #fcfbf9 !important;',
      '    border-left: 4px solid #e2dbce !important;',
      '    margin: 0 !important;',
      '    padding: 0 !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container a.elementor-sub-item {',
      '    font-size: 14px !important;',
      '    font-weight: 400 !important;',
      '    padding: 10px 20px 10px 24px !important;',
      '    color: #556c5c !important;',
      '    border-bottom: 1px solid #f3eedf !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container a.elementor-sub-item:hover {',
      '    color: #2d4a35 !important;',
      '    background-color: #f7f3ee !important;',
      '  }',
      '  /* Dropdown indicator icons */',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container .menu-item-has-children > a::after {',
      '    content: "\\25BE" !important; /* unicode small down triangle */',
      '    font-size: 12px !important;',
      '    color: #8c9e91 !important;',
      '    transition: transform 0.2s ease !important;',
      '    margin-left: 8px !important;',
      '  }',
      '  .elementor-nav-menu--dropdown.elementor-nav-menu__container .menu-item-has-children.sm-open > a::after {',
      '    transform: rotate(180deg) !important;',
      '  }',
      '}',
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── Boot ─────────────────────────────────────────────────────────────── */
  patchWebpack();
  fixDropdownCSS();

  $(document).ready(function () {
    initSmartMenus();
    initMobileToggle();
  });

  // Also re-init after Elementor frontend fires (sometimes needed)
  $(window).on('elementor/frontend/init', function () {
    setTimeout(initSmartMenus, 300);
  });

})(jQuery);
