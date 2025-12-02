(function (w, e, b, f, u, s) {
    w[f] = w[f] || {
        initSpace: function () {
            return new Promise(resolve => {
                w[f].q = arguments;
                w[f].resolve = resolve;
            });
        },
    };
    u = e.createElement(b);
    s = e.getElementsByTagName(b)[0];
    u.async = 1;
    u.src = 'https://{severname or use webfu.se}/surfly.js';
    s.parentNode.insertBefore(u, s);
})(window, document, 'script', 'webfuse');

webfuse.initSpace(
    '{{widget_code}}',
    '{{space_id}}',
    {},
).then(space => {
    webfuse.on('session_created', function (session, event) {
    console.log("content script test");
    webfuse.currentSession.sendMessage({ message: 'SURFLY IFRAME LOADED' });
});
})
.catch(error => {
    console.error('Failed:', error);
});

