import { useCallback, useEffect, useRef, useState } from "react";
import { ErrorBoundary } from "./shared/components/ErrorBoundary/ErrorBoundary";
import { DeviceProvider } from "./context/device/DeviceProvider";
import { SceneProvider } from "./context/scene/SceneProvider";
import { PortfolioProvider } from "./context/portfolio/PortfolioProvider";
import { useSceneContext } from "./context/scene/useSceneContext";
import { usePortfolioContext } from "./context/portfolio/usePortfolioContext";
import { useTranslation } from "./context/portfolio/useTranslation";
import { BROWSER_MODE } from "./context/portfolio/types";
import { isRTL } from "./shared/i18n/language";
import { Loader } from "./presentation/Loader/Loader";
import Scene from "./presentation/Scene/Scene";
import Browser from "./presentation/Browser/Browser";
import { IdentityHeader } from "./presentation/Overlay/IdentityHeader/IdentityHeader";
import { WelcomeOverlay } from "./presentation/Overlay/WelcomeOverlay/WelcomeOverlay";
import { DragHint } from "./presentation/Overlay/DragHint/DragHint";
import { ExploreBar } from "./presentation/Overlay/ExploreBar/ExploreBar";
import { runOverlaySequence } from "./presentation/Overlay/overlaySequence";

function AppContent() {
  const { sceneReady, cameraPreset, transitionToPreset } = useSceneContext();
  const { browserMode } = usePortfolioContext();
  const { language } = useTranslation();
  const isBrowserOpen = browserMode !== BROWSER_MODE.CLOSED;

  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeHiding, setWelcomeHiding] = useState(false);
  const [portalVisible, setPortalVisible] = useState(false);
  const [dragHintVisible, setDragHintVisible] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const triggerHideWelcome = useCallback(() => {
    setWelcomeHiding((prev) => {
      if (prev) return prev; // already hiding
      return true;
    });
  }, []);

  const handleIntroComplete = useCallback(() => {
    cancelRef.current = runOverlaySequence({
      showWelcome: () => setWelcomeVisible(true),
      showPortal: () => setPortalVisible(true),
      showDragHint: () => setDragHintVisible(true),
      hideDragHint: () => setDragHintVisible(false),
      hideWelcome: triggerHideWelcome,
    });
  }, [triggerHideWelcome]);

  // Dismiss welcome on any screen interaction
  useEffect(() => {
    if (!welcomeVisible || welcomeHiding) return;
    window.addEventListener("pointerdown", triggerHideWelcome, { once: true });
    return () => window.removeEventListener("pointerdown", triggerHideWelcome);
  }, [welcomeVisible, welcomeHiding, triggerHideWelcome]);

  const handleDismissWelcome = useCallback(() => {
    setWelcomeVisible(false);
    setWelcomeHiding(false);
  }, []);

  const handleDismissDragHint = useCallback(() => {
    setDragHintVisible(false);
  }, []);

  return (
    <div className="app-root" dir={isRTL(language) ? 'rtl' : 'ltr'}>
      {!sceneReady && <Loader />}
      <Scene portalVisible={portalVisible} onIntroComplete={handleIntroComplete} />

      {/* Overlay UI — renders above 3D canvas, below browser */}
      {sceneReady && !isBrowserOpen && (
        <>
          <IdentityHeader />
          <WelcomeOverlay
            visible={welcomeVisible}
            hiding={welcomeHiding}
            onDismiss={handleDismissWelcome}
          />
          {dragHintVisible && (
            <DragHint onDismiss={handleDismissDragHint} />
          )}
          <ExploreBar
            activePreset={cameraPreset}
            onNavigate={transitionToPreset}
          />
        </>
      )}

      <Browser />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary componentName="App">
      <DeviceProvider>
        <SceneProvider>
          <PortfolioProvider>
            <AppContent />
          </PortfolioProvider>
        </SceneProvider>
      </DeviceProvider>
    </ErrorBoundary>
  );
}

export default App;