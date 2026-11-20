/* Contact form: opens WhatsApp with the visitor's message (works on GitHub Pages, no server needed). */
(function () {
    'use strict';
    var f = document.getElementById('f'); if (!f) return;
    var st = document.getElementById('st');
    f.addEventListener('submit', function (e) {
        e.preventDefault();
        var d = new FormData(f);
        var t = 'Hello Pridance, I am ' + d.get('name') + ' (' + d.get('email') + ').\n[' + d.get('kind') + '] ' + d.get('message');
        window.open('https://wa.me/256761013170?text=' + encodeURIComponent(t), '_blank', 'noopener');
        if (st) st.textContent = 'Opening WhatsApp with your message\u2026';
        f.reset();
    });
})();
