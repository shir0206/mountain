import { useEffect, useRef } from "react";
import { useProgress } from "@react-three/drei";
import { useSceneContext } from "../../context/scene/useSceneContext";
import "./Loader.css";

function Bar({ cls }: { cls: string }) {
  return (
    <div className={`loader-bar ${cls}`}>
      <div className="loader-face loader-face-front" />
      <div className="loader-face loader-face-left" />
    </div>
  );
}

interface LoaderProps {
  onLoaded: () => void;
}

export function Loader({ onLoaded }: LoaderProps) {
  const { progress } = useProgress();
  const { sceneReady } = useSceneContext();
  const calledRef = useRef(false);

  useEffect(() => {
    if (sceneReady && !calledRef.current) {
      calledRef.current = true;
      onLoaded();
    }
  }, [sceneReady, onLoaded]);

  return (
    <div className="loader-screen">
      <div className="loader-mountain">
        <div className="loader-bars">
          {/* Sec ring — 23 bars, r=36px [terrain 1: snowy ridge + river] */}
          <Bar cls="loader-bar-sec lbs1" />
          <Bar cls="loader-bar-sec lbs2" />
          <Bar cls="loader-bar-sec lbs3" />
          <Bar cls="loader-bar-sec lbs4" />
          <Bar cls="loader-bar-sec lbs5" />
          <Bar cls="loader-bar-sec lbs6" />
          <Bar cls="loader-bar-sec lbs7" />
          <Bar cls="loader-bar-sec lbs8" />
          <Bar cls="loader-bar-sec lbs9" />
          <Bar cls="loader-bar-sec lbs10" />
          <Bar cls="loader-bar-sec lbs11" />
          <Bar cls="loader-bar-sec lbs12" />
          <Bar cls="loader-bar-sec lbs13" />
          <Bar cls="loader-bar-sec lbs14" />
          <Bar cls="loader-bar-sec lbs15" />
          <Bar cls="loader-bar-sec lbs16" />
          <Bar cls="loader-bar-sec lbs26" />
          <Bar cls="loader-bar-sec lbs27" />
          <Bar cls="loader-bar-sec lbs28" />
          <Bar cls="loader-bar-sec lbs29" />
          <Bar cls="loader-bar-sec lbs30" />
          <Bar cls="loader-bar-sec lbs31" />
          <Bar cls="loader-bar-sec lbs32" />
          {/* Outer ring — 16 bars, r=24px [terrain 2: high snowy mountain + lake] */}
          <Bar cls="loader-bar-outer lbo1" />
          <Bar cls="loader-bar-outer lbo2" />
          <Bar cls="loader-bar-outer lbo3" />
          <Bar cls="loader-bar-outer lbo4" />
          <Bar cls="loader-bar-outer lbo5" />
          <Bar cls="loader-bar-outer lbo6" />
          <Bar cls="loader-bar-outer lbo7" />
          <Bar cls="loader-bar-outer lbo8" />
          <Bar cls="loader-bar-outer lbo9" />
          <Bar cls="loader-bar-outer lbo10" />
          <Bar cls="loader-bar-outer lbo11" />
          <Bar cls="loader-bar-outer lbo12" />
          <Bar cls="loader-bar-outer lbo13" />
          <Bar cls="loader-bar-outer lbo14" />
          <Bar cls="loader-bar-outer lbo15" />
          <Bar cls="loader-bar-outer lbo16" />
          {/* Inner ring — 8 bars, r=12px [terrain 3: hills + river] */}
          <Bar cls="loader-bar-inner lbi1" />
          <Bar cls="loader-bar-inner lbi2" />
          <Bar cls="loader-bar-inner lbi3" />
          <Bar cls="loader-bar-inner lbi4" />
          <Bar cls="loader-bar-inner lbi5" />
          <Bar cls="loader-bar-inner lbi6" />
          <Bar cls="loader-bar-inner lbi7" />
          <Bar cls="loader-bar-inner lbi8" />
          {/* Core — r=0px */}
          <Bar cls="loader-bar-core lbc1" />
        </div>
      </div>

      <div className="loader-progress">
        <div className="loader-progress__track">
          <div
            className="loader-progress__fill"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <span className="loader-progress__text">{Math.round(progress)}%</span>
      </div>
    </div>
  );
}
