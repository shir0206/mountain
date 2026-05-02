import { ErrorBoundary } from "./shared/components/ErrorBoundary/ErrorBoundary";
import { DeviceProvider } from "./context/device/DeviceProvider";
import { SceneProvider } from "./context/scene/SceneProvider";
import { PortfolioProvider } from "./context/portfolio/PortfolioProvider";
import Scene from "./presentation/Scene/Scene";
import Browser from "./presentation/Browser/Browser";

function App() {
  return (
    <ErrorBoundary componentName="App">
      <DeviceProvider>
        <SceneProvider>
          <PortfolioProvider>
            {/* Scene is pure 3D. Browser lives at DOM root so its
                react-dom portal (#browser-root) works — r3f's reconciler
                cannot host DOM portals returned from inside <Canvas>. */}
            <Scene />
            <Browser />
          </PortfolioProvider>
        </SceneProvider>
      </DeviceProvider>
    </ErrorBoundary>
  );
}

export default App;
