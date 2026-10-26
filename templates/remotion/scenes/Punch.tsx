import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/** One hard claim. Fast in, hold, hard cut out (Series handles the cut). */
export const PunchScene: React.FC<{
  text: string;
  accent: string;
  bg: string;
  fontFamily: string;
}> = ({ text, accent, bg, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, 0.22 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scale = interpolate(frame, [0, 0.22 * fps], [0.86, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        padding: "100px 80px",
        fontFamily,
      }}
    >
      <div
        style={{
          width: 72,
          height: 10,
          backgroundColor: accent,
          borderRadius: 4,
          marginBottom: 40,
          opacity: enter,
        }}
      />
      <div
        style={{
          color: "#ffffff",
          fontSize: 72,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: 920,
          opacity: enter,
          transform: `scale(${scale})`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
