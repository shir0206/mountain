import { ErrorBoundary } from "./shared/components/ErrorBoundary/ErrorBoundary";
import { DeviceProvider } from "./context/device/DeviceProvider";
import { SceneProvider } from "./context/scene/SceneProvider";
import { PortfolioProvider } from "./context/portfolio/PortfolioProvider";
import { useSceneContext } from "./context/scene/useSceneContext";
import { Loader } from "./presentation/Loader/Loader";
import Scene from "./presentation/Scene/Scene";
import Browser from "./presentation/Browser/Browser";

function AppContent() {
	const { sceneReady } = useSceneContext();

	return (
		<>
			{!sceneReady && <Loader />}
			<Scene />
			<Browser />
		</>
	);
}

function App() {
	return (
		<ErrorBoundary componentName='App'>
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
