import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";

export type HeroMotionPolicy = {
  ready: boolean;
  reducedMotion: boolean;
  narrowScreen: boolean;
  highContrast: boolean;
  forcedColors: boolean;
  documentVisible: boolean;
  inView: boolean;
  userPaused: boolean;
};

export function shouldAnimateHero(policy: HeroMotionPolicy): boolean {
  return (
    policy.ready &&
    !policy.reducedMotion &&
    !policy.narrowScreen &&
    !policy.highContrast &&
    !policy.forcedColors &&
    policy.documentVisible &&
    policy.inView &&
    !policy.userPaused
  );
}

// Fixed geometry: no random particles, pointer tracking or per-frame React work.
const nodes = [
  [24, 104],
  [148, 56],
  [84, 236],
  [204, 180],
  [20, 460],
  [156, 536],
  [280, 488],
  [368, 612],
  [484, 556],
  [744, 64],
  [868, 144],
  [1004, 52],
  [1140, 120],
  [1296, 48],
  [1404, 208],
  [1280, 292],
  [1132, 252],
  [1008, 348],
  [1412, 484],
  [1288, 572],
  [1148, 500],
  [1012, 612],
  [864, 548],
  [736, 620],
];
const edges = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 3],
  [4, 5],
  [4, 6],
  [5, 6],
  [5, 7],
  [6, 8],
  [7, 8],
  [9, 10],
  [9, 11],
  [10, 11],
  [10, 16],
  [11, 12],
  [12, 13],
  [12, 16],
  [13, 14],
  [14, 15],
  [15, 16],
  [15, 17],
  [16, 17],
  [14, 18],
  [15, 18],
  [18, 19],
  [18, 20],
  [19, 20],
  [19, 21],
  [20, 21],
  [20, 22],
  [21, 22],
  [21, 23],
  [22, 23],
];

export default function HeroNetwork({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLDivElement>(null);
  const networkId = useId();
  const { settings } = useAccessibility();
  const [userPaused, setUserPaused] = useState(false);
  const [environment, setEnvironment] = useState({
    ready: false,
    reducedMotion: true,
    narrowScreen: true,
    forcedColors: false,
    documentVisible: false,
    inView: false,
  });

  useEffect(() => {
    // Unsupported environments keep the static illustration and all page content.
    if (!window.matchMedia || !window.IntersectionObserver) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrowScreen = window.matchMedia("(max-width: 900px)");
    const forcedColors = window.matchMedia("(forced-colors: active)");
    const contrastPreference = window.matchMedia("(prefers-contrast: more)");
    const updateEnvironment = () => {
      setEnvironment(previous => ({
        ...previous,
        ready: true,
        reducedMotion: reducedMotion.matches,
        narrowScreen: narrowScreen.matches,
        forcedColors: forcedColors.matches || contrastPreference.matches,
        documentVisible: document.visibilityState === "visible",
      }));
    };
    const mediaQueries = [
      reducedMotion,
      narrowScreen,
      forcedColors,
      contrastPreference,
    ];
    // If change events are unavailable, do not start a loop that cannot honor changes.
    if (
      mediaQueries.some(query => typeof query.addEventListener !== "function")
    )
      return;
    mediaQueries.forEach(query =>
      query.addEventListener("change", updateEnvironment)
    );
    document.addEventListener("visibilitychange", updateEnvironment);
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setEnvironment(previous => ({
          ...previous,
          inView: Boolean(entry?.isIntersecting),
        }));
      },
      { threshold: 0 }
    );
    if (frame.current) observer.observe(frame.current);
    updateEnvironment();
    return () => {
      observer.disconnect();
      mediaQueries.forEach(query =>
        query.removeEventListener("change", updateEnvironment)
      );
      document.removeEventListener("visibilitychange", updateEnvironment);
    };
  }, []);

  const highContrast = settings.contrastMode === "high-contrast";
  const controlsAvailable =
    environment.ready &&
    !environment.reducedMotion &&
    !environment.narrowScreen &&
    !environment.forcedColors &&
    !highContrast;
  const running = shouldAnimateHero({
    ...environment,
    highContrast,
    userPaused,
  });

  return (
    <div ref={frame} className="hero-network-frame" data-running={running}>
      <div className="hero-network-art" aria-hidden="true">
        <svg
          id={networkId}
          className="hero-network-svg"
          viewBox="0 0 1440 680"
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
          aria-hidden="true"
        >
          <g className="hero-network-edges">
            {edges.map(([start, end]) => (
              <line
                key={`${start}-${end}`}
                x1={nodes[start][0]}
                y1={nodes[start][1]}
                x2={nodes[end][0]}
                y2={nodes[end][1]}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          <g className="hero-network-nodes">
            {nodes.map(([cx, cy], index) => (
              <circle key={index} cx={cx} cy={cy} r="3" />
            ))}
          </g>
          <g className="hero-network-traces">
            <circle className="hero-network-trace trace-one" r="3.5" />
            <circle className="hero-network-trace trace-two" r="3.5" />
            <circle className="hero-network-trace trace-three" r="3.5" />
          </g>
        </svg>
      </div>
      <div className="hero-network-content">{children}</div>
      {controlsAvailable && (
        <div className="hero-motion-control">
          <button
            type="button"
            aria-controls={networkId}
            aria-label={
              userPaused
                ? "Resume background animation"
                : "Pause background animation"
            }
            onClick={() => setUserPaused(previous => !previous)}
          >
            {userPaused ? (
              <Play size={16} aria-hidden="true" />
            ) : (
              <Pause size={16} aria-hidden="true" />
            )}
            {userPaused ? "Resume background" : "Pause background"}
          </button>
        </div>
      )}
    </div>
  );
}
