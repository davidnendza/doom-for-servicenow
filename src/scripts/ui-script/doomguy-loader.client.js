// Global UI Script: runs in every classic UI frame. Its only job is to make sure the Doomguy
// controller is loaded once into the TOP window (which survives content-frame navigation) and
// to introduce this frame to it. All the real code lives in the x_doom/doomguy asset.
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
    script.src = '/uxasset/externals/x_doom/doomguy.jsdbx';
    (host.document.head || host.document.documentElement).appendChild(script);
})();
