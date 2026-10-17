// Global UI Script: runs in every classic UI frame. Its only job is to make sure the Doomguy
// controller is loaded once into the TOP window (which survives content-frame navigation) and
// to introduce this frame to it. All the real code lives in the x_417611_doom/doomguy asset.
(function () {
    var host;
    try {
        host = window.top;
        void host.document; // throws if the top window is cross-origin
    } catch (e) {
        return;
    }

    var frames = (host.__xDoomFrames = host.__xDoomFrames || []);
    if (frames.indexOf(window) === -1) frames.push(window);
    if (frames.length > 25) frames.shift();

    if (host.__xDoomGuy) {
        host.__xDoomGuy.attachFrame(window);
        return;
    }
    if (host.__xDoomLoading) return;
    host.__xDoomLoading = true;

    var script = host.document.createElement('script');
    script.type = 'module';
    // The asset is served with cache-control: public and no validator, so browsers keep an old copy after a
    // deploy. A ten-minute bucket in the query string bounds how stale it can get without refetching constantly.
    script.src = '/uxasset/externals/x_417611_doom/doomguy.jsdbx?t=' + Math.floor(Date.now() / 600000);
    (host.document.head || host.document.documentElement).appendChild(script);
})();
