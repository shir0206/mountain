import { useProgress } from "@react-three/drei";
import "./Loader.css";

const SPARKLE_COUNT = 10;

interface LoaderProps {
  /** Duration in seconds of one full cube motion cycle (pulse → shake horizontally → shake vertically). Default 4. */
  cubeDurationSeconds?: number;
  /** Duration in seconds of the progress-bar shimmer sweep. Default 3. */
  shimmerDurationSeconds?: number;
}

export function Loader({
  cubeDurationSeconds = 3,
  shimmerDurationSeconds = 2,
}: LoaderProps = {}) {
  const { progress } = useProgress();
  const pct = Math.round(progress);

  return (
    <div
      className="loader-screen"
      style={
        {
          "--cube-duration": `${cubeDurationSeconds}s`,
          "--shimmer-duration": `${shimmerDurationSeconds}s`,
        } as React.CSSProperties
      }
    >
      <div className="card">
        <div className="cube-scene">
          <div className="cube-area">
            {Array.from({ length: SPARKLE_COUNT }).map((_, i) => (
              <span key={i} className="sparkle" />
            ))}

            {/* Main cube with edge glow */}
            <div className="loader-wrapper">
              <div className="loader-pulse" />
              <div className="loader-shake-horizontal" />
              <div className="loader-shake-vertical" />
            </div>

            {/* Contact-point floor glow */}
            <div className="floor-glow" />
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-percent">{pct}%</div>
        </div>
      </div>
    </div>
  );
}
