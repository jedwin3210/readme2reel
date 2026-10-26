import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PhoneFrame } from "../components/PhoneFrame";

/** Claim over product UI — never a logo-only card. */
export const HookScene: React.FC<{
  text: string;
  shot: string;
  accent: string;
  bg: string;
  fontFamily: string;
}> = ({ text, shot, accent, bg, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, 0.25 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: bg, fontFamily }}>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.35 + enter * 0.65,
          transform: `scale(${0.96 + enter * 0.04})`,
        }}
      >
        <PhoneFrame shot={shot} width={740} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.75) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 160,
          color: "#fff",
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.15,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 28}px)`,
          textShadow: "0 8px 28px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 8,
            backgroundColor: accent,
            borderRadius: 4,
            marginBottom: 28,
          }}
        />
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Tiny corner mark — optional, never the whole first scene. */
export const CornerMark: React.FC<{ src: string }> = ({ src }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      top: 100,
      left: 80,
      width: 160,
      opacity: 0.9,
    }}
  />
);
