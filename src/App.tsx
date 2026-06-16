import { useCallback, useRef, useState } from "react";
import { ErrorBoundary } from "./shared/components/ErrorBoundary/ErrorBoundary";
import { DeviceProvider } from "./context/device/DeviceProvider";
import { SceneProvider } from "./context/scene/SceneProvider";
import { PortfolioProvider } from "./context/portfolio/PortfolioProvider";
import { useSceneContext } from "./context/scene/useSceneContext";
import { usePortfolioContext } from "./context/portfolio/usePortfolioContext";
import { useDeviceContext } from "./context/device/useDeviceContext";
import { useTranslation } from "./context/portfolio/useTranslation";
import { BROWSER_MODE } from "./context/portfolio/types";
import { DEVICE } from "./shared/device/types";
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
  const { device } = useDeviceContext();
  const { language } = useTranslation();
  const isMobile = device === DEVICE.MOBILE;
  const isBrowserOpen = browserMode !== BROWSER_MODE.CLOSED;

  const [welcomeVisible, setWelcomeVisible] = useState(isMobile);
  const [welcomeHiding, setWelcomeHiding] = useState(false);
  const [dragHintVisible, setDragHintVisible] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  const triggerHideWelcome = useCallback(() => {
    setWelcomeHiding((prev) => {
      if (prev) return prev;
      return true;
    });
  }, []);

  const handleIntroComplete = useCallback(() => {
    cancelRef.current = runOverlaySequence({
      showWelcome: () => setWelcomeVisible(true),
      showDragHint: () => setDragHintVisible(true),
      hideDragHint: () => setDragHintVisible(false),
      hideWelcome: triggerHideWelcome,
    });
  }, [triggerHideWelcome]);

  const handleDismissWelcome = useCallback(() => {
    setWelcomeVisible(false);
    setWelcomeHiding(false);
  }, []);

  const handleDismissDragHint = useCallback(() => {
    setDragHintVisible(false);
  }, []);

  const handlePointerDown = useCallback(() => {
    if (welcomeVisible && !welcomeHiding) {
      triggerHideWelcome();
    }
  }, [welcomeVisible, welcomeHiding, triggerHideWelcome]);

  return (
    <div className="app-root" dir={isRTL(language) ? 'rtl' : 'ltr'} onPointerDown={handlePointerDown}>
      {!sceneReady && <Loader />}
      <Scene onIntroComplete={handleIntroComplete} />

      {/* Overlay UI — renders above 3D canvas, below browser */}
      {sceneReady && !isBrowserOpen && (
        <>
          <IdentityHeader />
          <WelcomeOverlay
            visible={welcomeVisible}
            hiding={welcomeHiding}
            isMobile={isMobile}
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