import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const CtaScene: React.FC<{
  text: string;
  sub?: string;
  accent: string;
  bg: string;
  fontFamily: string;
}> = ({ text, sub, accent, bg, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, 0.28 * fps], [0, 1], {
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
        textAlign: "center",
        fontFamily,
        opacity: enter,
      }}
    >
      <div
        style={{
          width: 80,
          height: 8,
          backgroundColor: accent,
          borderRadius: 4,
          marginBottom: 40,
        }}
      />
      <div style={{ color: "#fff", fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>
        {text}
      </div>
      {sub ? (
        <div style={{ color: "#9ca3af", fontSize: 36, fontWeight: 600, marginTop: 28 }}>
          {sub}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
