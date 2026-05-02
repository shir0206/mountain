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
            {/* App composes Scene + Browser so neither feature imports the
                other. Scene renders the portfolio via render-prop. */}
            <Scene renderPortfolio={(position) => <Browser position={position} />} />
          </PortfolioProvider>
        </SceneProvider>
      </DeviceProvider>
    </ErrorBoundary>
  );
}

export default App;
