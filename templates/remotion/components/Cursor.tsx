import { Easing, interpolate, useCurrentFrame } from "remotion";

export type CursorPoint = {
  /** Frame within the scene */
  at: number;
  /** 0–1 of the layer width/height; tip of the pointer */
  x: number;
  y: number;
  click?: boolean;
};

/**
 * Animated pointer. Put above the UI. Waypoints are fractions of the parent box.
 */
export const Cursor: React.FC<{
  path: readonly CursorPoint[];
  width: number;
  height: number;
  color?: string;
}> = ({ path, width, height, color = "#111827" }) => {
  const frame = useCurrentFrame();
  if (path.length === 0) return null;

  let x = path[0].x;
  let y = path[0].y;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (frame >= a.at && frame <= b.at) {
      const t = interpolate(frame, [a.at, b.at], [0, 1], {
        easing: Easing.inOut(Easing.cubic),
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      x = a.x + (b.x - a.x) * t;
      y = a.y + (b.y - a.y) * t;
      break;
    }
    if (frame > b.at) {
      x = b.x;
      y = b.y;
    }
  }

  const clicks = path.filter((p) => p.click).map((p) => p.at);
  let ring = 0;
  for (const c of clicks) {
    if (frame >= c && frame <= c + 14) {
      ring = interpolate(frame, [c, c + 14], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      break;
    }
  }

  const left = x * width;
  const top = y * height;

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {ring > 0 ? (
        <div
          style={{
            position: "absolute",
            left,
            top,
            width: 48,
            height: 48,
            marginLeft: -24,
            marginTop: -24,
            borderRadius: 99,
            border: `3px solid ${color}`,
            opacity: ring,
            transform: `scale(${0.45 + (1 - ring) * 1.2})`,
          }}
        />
      ) : null}
      <svg
        width={36}
        height={36}
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          left,
          top,
          // Tip sits on (x,y)
          transform: "translate(-2px, -2px)",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.35))",
        }}
      >
        <path
          fill={color}
          stroke="#fff"
          strokeWidth={1.2}
          d="M4 3l1.2 16.5 4.3-4.2 3.6 7.2 2.2-1.1-3.7-7.1L19 11.2 4 3z"
        />
      </svg>
    </div>
  );
};
