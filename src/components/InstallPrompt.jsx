import { useState, useEffect } from "react";

function isIOS() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(isStandalone());

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => setInstalled(true);
    window.addEventListener("appinstalled", installedHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
    };
  }, []);

  if (installed || dismissed) return null;
  if (!deferredPrompt && !isIOS()) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else if (isIOS()) {
      setShowIOSHint(true);
    }
  };

  return (
    <div className="install-banner">
      <div className="install-banner-text">
        <strong>Add Ricksha Wala to your home screen</strong>
        <span>Opens like an app — full screen, its own icon, quick launch.</span>
      </div>
      <div className="install-banner-actions">
        <button className="install-btn" onClick={handleInstallClick}>
          Install
        </button>
        <button className="install-dismiss" onClick={() => setDismissed(true)} aria-label="Dismiss">
          ✕
        </button>
      </div>

      {showIOSHint && (
        <div className="install-ios-hint">
          On iPhone: tap the <strong>Share</strong> icon in Safari's toolbar, then
          <strong> "Add to Home Screen."</strong>
          <button className="install-ios-hint-close" onClick={() => setShowIOSHint(false)}>
            Got it
          </button>
        </div>
      )}
    </div>
  );
}
