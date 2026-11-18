/**
 * Swipe the sidebar, mobile viewports only.
 *
 * The panel lives on the right edge, parked off-screen by `transform:
 * translateX(100%)` and docked at `translateX(0)` when open. `offset` is how
 * far it sits right of that docked position, and it follows the finger exactly:
 *
 *   closed, offset starts at one panel-width   -> a leftward swipe brings it in
 *   open,   offset starts at zero              -> a rightward swipe carries it out
 *
 * so "swipe right to left" progresses both gestures, and a rightward swipe is
 * simply the same tracking in reverse.
 *
 * The CSS transition is suppressed while the axis is locked, otherwise the
 * panel trails the finger by a transition-length, and restored before the
 * final position lands so the release animates from the finger's position
 * instead of jumping there.
 *
 * The toggle sits outside the panel in the template. A fixed element inside a
 * transformed ancestor is positioned and moved relative to that ancestor, so
 * keeping it inside made the button ride the panel during a drag and jump when
 * the panel settled. Outside, it is a stable viewport control and drag handle.
 *
 * State is written to all three elements the way ui.js writes it, so the toggle
 * and the panel cannot disagree.
 */
(function () {
  'use strict';

  var MOBILE = '(max-width: 47.999em)';
  var EDGE = 64; // px of screen edge that can start a swipe while closed
  var SLOP = 8; // px of movement before the axis is decided
  var AXIS_RATIO = 1.2; // how far horizontal must beat vertical to count
  var COMMIT = 0.3; // fraction of the panel width that counts as far enough
  var MIN_TRAVEL = 24; // px below which even a flick does not count
  var FLICK = 0.6; // px/ms that settles it regardless of distance
  var IDLE = 100; // ms without movement before a flick stops counting

  function init() {
    var menu = document.getElementById('menu');
    var link = document.getElementById('menuLink');
    var layout = document.getElementById('layout');
    if (!menu || !link || !layout) return;

    var media = window.matchMedia(MOBILE);
    var width = 0;
    var origin = 0; // offset when the gesture began
    var offset = 0; // offset now
    var lastOffset = 0;
    var startX = 0;
    var startY = 0;
    var lastTime = 0;
    var velocity = 0; // px/ms of offset; negative means the panel is coming in
    var gesture = null; // 'open' | 'close' | null
    var locked = false; // axis decided
    var pointerId = null;
    var dragged = false;

    function isOpen() {
      return menu.getAttribute('data-active') === 'true';
    }

    /**
     * Where the panel is on screen right now, transition included. Reading
     * this when the axis locks lets a gesture grab a panel that is still
     * settling instead of snapping back to the state boundary it started at.
     */
    function liveOffset() {
      var right = menu.getBoundingClientRect().right;
      var value = right - window.innerWidth;
      if (value < 0) value = 0;
      if (value > width) value = width;
      return value;
    }

    function paint() {
      menu.style.transform = 'translateX(' + offset + 'px)';
      // Drive the scrim from the panel's openness so it fades with the drag
      // instead of snapping to full strength as soon as the axis locks.
      var progress = 1 - offset / width;
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;
      layout.style.setProperty('--swipe-progress', String(progress));
    }

    function settle(open) {
      menu.setAttribute('data-active', String(open));
      link.setAttribute('data-active', String(open));
      layout.setAttribute('data-active', String(open));
    }

    function reset() {
      gesture = null;
      locked = false;
      pointerId = null;
      velocity = 0;
      layout.removeAttribute('data-dragging');
      layout.style.removeProperty('--swipe-progress');
    }

    /**
     * Hand the transform back to CSS without forcing a reflow at the final
     * offset. A flush here would make that frame the last style the browser
     * saw, so clearing the inline transform would leave nothing to animate and
     * the panel would teleport on release. Keeping the last painted offset as
     * the before-change style gives the transition a start position.
     */
    function release(open) {
      menu.style.transition = '';
      menu.style.transform = '';
      settle(open);
    }

    function down(e) {
      if (!media.matches) return;
      if (!e.isPrimary) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      dragged = false;

      width = menu.offsetWidth;
      if (!width) return;

      var onLink = link.contains(e.target);
      var inPanel = menu.contains(e.target);

      if (isOpen()) {
        // The scrim makes the page inert, so a close swipe may start anywhere:
        // the panel, the toggle, or the dimmed content.
        gesture = 'close';
      } else {
        // Closed, the panel is off-screen, so the swipe has to start on the
        // toggle or within the strip the panel will slide in from. Leave
        // horizontally scrollable code to its own gesture.
        if (!onLink && !inPanel) {
          if (e.clientX < window.innerWidth - EDGE) return;
          if (e.target.closest && e.target.closest('pre')) return;
        }
        gesture = 'open';
      }

      pointerId = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      lastTime = e.timeStamp;
      velocity = 0;
      locked = false;
    }

    function move(e) {
      if (!gesture || e.pointerId !== pointerId) return;

      var dx = e.clientX - startX;
      var dy = e.clientY - startY;

      if (!locked) {
        if (Math.abs(dx) < SLOP && Math.abs(dy) < SLOP) return;
        // Has to be clearly horizontal. Nav scrolling is mostly diagonal, and a
        // 1:1 test let those hijack the drawer, so scrolling the list dismissed
        // it instead of moving the list. Ambiguous movement stays pending: a
        // real finger often starts a few degrees off, and aborting on that
        // first sample made the close gesture feel like it had not taken. If
        // the browser starts scrolling it sends pointercancel, and `up()` drops
        // an unlocked gesture, so waiting here costs nothing.
        if (Math.abs(dx) < Math.abs(dy) * AXIS_RATIO) return;
        locked = true;
        origin = liveOffset();
        offset = origin + dx;
        lastOffset = origin;
        lastTime = e.timeStamp;
        velocity = 0;
        menu.style.transition = 'none';
        layout.setAttribute('data-dragging', 'true');
      } else {
        offset = origin + dx;
      }

      dragged = true;

      // Each gesture owns one direction only. A docked panel has nothing to its
      // left to reveal, so a leftward drag clamps at zero and cannot open or
      // close anything; a parked panel has nothing to its right, so a rightward
      // drag clamps at one panel-width. Without this the panel would follow the
      // finger past its own edge, and `Math.abs(offset)` then counted that
      // impossible distance toward dismissing it.
      if (offset < 0) offset = 0;
      if (offset > width) offset = width;

      var now = e.timeStamp;
      var dt = now - lastTime;
      if (dt > 0) velocity = dt > IDLE ? 0 : (offset - lastOffset) / dt;
      lastTime = now;
      lastOffset = offset;

      paint();
    }

    function end(forceOpen) {
      if (!gesture) return;
      var kind = gesture;

      var done;
      if (forceOpen !== undefined) {
        done = forceOpen;
      } else if (kind === 'open') {
        // only leftward motion brings it in, and only past the thresholds
        var inward = width - offset;
        var flickedIn = velocity <= -FLICK && inward > MIN_TRAVEL;
        done = flickedIn || inward > width * COMMIT;
      } else {
        // Only rightward motion dismisses. The clamp already holds the panel at
        // zero, so `offset` is the rightward distance on its own; velocity has
        // to agree in sign, otherwise a leftward flick that was clamped to
        // nothing would still read as a dismissal.
        var flickOut = velocity >= FLICK && offset > MIN_TRAVEL;
        done = flickOut || offset > width * COMMIT;
      }

      var open = kind === 'open' ? done : !done;

      reset();
      release(open);
    }

    function up(e) {
      if (!gesture || e.pointerId !== pointerId) return;
      if (!locked) {
        // a tap rather than a swipe: leave it to the click handlers
        reset();
        return;
      }
      // A finger that stopped before lifting is not a flick, even if its last
      // movement was fast.
      if (e.timeStamp - lastTime > IDLE) velocity = 0;
      end();
    }

    function cancel(e) {
      if (!gesture || e.pointerId !== pointerId) return;
      if (!locked) {
        reset();
        return;
      }
      // pointercancel means the browser reclaimed the gesture. Go back to the
      // state the gesture started from rather than committing it.
      end(false);
    }

    document.addEventListener('pointerdown', down, { passive: true });
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerup', up, { passive: true });
    document.addEventListener('pointercancel', cancel, { passive: true });

    // Swallow the click that follows a swipe, so lifting off a nav link does
    // not both dismiss the panel and follow the link, and a drag from the
    // toggle does not toggle the menu a second time.
    document.addEventListener(
      'click',
      function (e) {
        if (!dragged) return;
        dragged = false;
        e.preventDefault();
        e.stopPropagation();
      },
      true
    );

    // A link is natively draggable, and on some browsers a horizontal drag
    // that starts on one becomes an HTML5 drag and cancels the pointer
    // stream. The panel is the thing being dragged here, not the link.
    menu.addEventListener('dragstart', function (e) {
      e.preventDefault();
    });

    function forgetGesture() {
      reset();
      menu.style.transition = '';
      menu.style.transform = '';
    }

    // The panel is desktop-docked above the breakpoint. If the viewport
    // crosses back after a gesture, drop the inline drag state so the media
    // query regains control.
    if (media.addEventListener) {
      media.addEventListener('change', function (e) {
        if (!e.matches) forgetGesture();
      });
    } else if (media.addListener) {
      media.addListener(function (e) {
        if (!e.matches) forgetGesture();
      });
    }
  }

  // instant-docs injects frontend plugins into <head>, so #menu does not exist
  // yet when this file is parsed.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
