import { useState } from "react";
import { ErrorBoundary } from "./shared/components/ErrorBoundary/ErrorBoundary";
import { DeviceProvider } from "./context/device/DeviceProvider";
import { SceneProvider } from "./context/scene/SceneProvider";
import { PortfolioProvider } from "./context/portfolio/PortfolioProvider";
import { Loader } from "./presentation/Loader/Loader";
import Scene from "./presentation/Scene/Scene";
import Browser from "./presentation/Browser/Browser";

function App() {
	const [isLoading, setIsLoading] = useState(true);

	return (
		<ErrorBoundary componentName='App'>
			<DeviceProvider>
				<SceneProvider>
					<PortfolioProvider>
						{isLoading && <Loader onLoaded={() => setIsLoading(false)} />}
						<Scene />
						<Browser />
					</PortfolioProvider>
				</SceneProvider>
			</DeviceProvider>
		</ErrorBoundary>
	);
}

export default App;
