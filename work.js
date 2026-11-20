/* Selected work: category tabs, "show all" toggle and poster lightbox. No dependencies. */
(function () {
    'use strict';

    var section = document.getElementById('work');
    if (!section) return;

    /* ---------- Tabs ---------- */
    var tabs = Array.prototype.slice.call(section.querySelectorAll('.work-tab'));
    var panels = Array.prototype.slice.call(section.querySelectorAll('.work-panel'));

    function selectTab(tab, focus) {
        tabs.forEach(function (t) {
            var on = t === tab;
            t.setAttribute('aria-selected', on ? 'true' : 'false');
            t.tabIndex = on ? 0 : -1;
        });
        panels.forEach(function (p) {
            p.hidden = p.id !== tab.getAttribute('aria-controls');
        });
        if (focus) tab.focus();
    }

    tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { selectTab(tab, false); });
        tab.addEventListener('keydown', function (e) {
            var next = null;
            if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
            else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
            else if (e.key === 'Home') next = tabs[0];
            else if (e.key === 'End') next = tabs[tabs.length - 1];
            if (next) { e.preventDefault(); selectTab(next, true); }
        });
    });

    /* ---------- Show all / show fewer ---------- */
    var toggle = section.querySelector('.gal-toggle');
    var extras = Array.prototype.slice.call(section.querySelectorAll('.gal-item[data-extra]'));

    if (toggle) {
        toggle.addEventListener('click', function () {
            var expand = toggle.getAttribute('aria-expanded') !== 'true';
            extras.forEach(function (el) { el.hidden = !expand; });
            toggle.setAttribute('aria-expanded', expand ? 'true' : 'false');
            toggle.textContent = expand ? toggle.getAttribute('data-less') : toggle.getAttribute('data-more');
            if (!expand) {
                var title = section.querySelector('#panel-print .panel-title');
                if (title) title.scrollIntoView({ block: 'start', behavior: 'smooth' });
            }
        });
    }

    /* ---------- Lightbox ---------- */
    var box = document.getElementById('lightbox');
    if (!box) return;

    var img = box.querySelector('.lb-img');
    var titleEl = box.querySelector('.lb-title');
    var descEl = box.querySelector('.lb-desc');
    var current = 0;
    var list = [];
    var opener = null;

    function visibleItems() {
        return Array.prototype.slice.call(section.querySelectorAll('.gal-open')).filter(function (b) {
            var fig = b.closest('.gal-item');
            return fig && !fig.hidden;
        });
    }

    function preload(btn) {
        if (!btn) return;
        var im = new Image();
        im.src = btn.getAttribute('data-full');
    }

    function show(i) {
        current = (i + list.length) % list.length;
        var b = list[current];
        img.removeAttribute('width');
        img.removeAttribute('height');
        img.src = b.getAttribute('data-full');
        img.width = parseInt(b.getAttribute('data-w'), 10) || 0;
        img.height = parseInt(b.getAttribute('data-h'), 10) || 0;
        img.alt = b.getAttribute('data-title') + ' poster';
        titleEl.textContent = b.getAttribute('data-title');
        descEl.textContent = b.getAttribute('data-desc');
        preload(list[(current + 1) % list.length]);
        preload(list[(current - 1 + list.length) % list.length]);
    }

    function openBox(btn) {
        list = visibleItems();
        opener = btn;
        show(list.indexOf(btn));
        if (typeof box.showModal === 'function') box.showModal();
        else box.setAttribute('open', '');
        document.body.classList.add('lb-open');
    }

    function closeBox() {
        if (typeof box.close === 'function') box.close();
        else box.removeAttribute('open');
    }

    box.addEventListener('close', function () {
        document.body.classList.remove('lb-open');
        img.removeAttribute('src');
        if (opener) opener.focus();
    });

    section.addEventListener('click', function (e) {
        var btn = e.target.closest('.gal-open');
        if (btn) openBox(btn);
    });

    box.querySelector('.lb-close').addEventListener('click', closeBox);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });

    box.addEventListener('click', function (e) {
        if (!e.target.closest('.lb-img, .lb-nav, .lb-close, figcaption')) closeBox();
    });

    box.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
    });

    var startX = null;
    box.addEventListener('touchstart', function (e) {
        startX = e.changedTouches[0].clientX;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        startX = null;
        if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
})();
