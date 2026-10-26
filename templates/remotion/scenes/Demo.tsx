import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Cursor, type CursorPoint } from "../components/Cursor";
import { PhoneFrame } from "../components/PhoneFrame";

/** Product still + cursor. Caption is an idea, not a page title. */
export const DemoScene: React.FC<{
  shot: string;
  caption: string;
  cursor: readonly CursorPoint[];
  accent: string;
  bg: string;
  fontFamily: string;
}> = ({ shot, caption, cursor, accent, bg, fontFamily }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = interpolate(frame, [0, 0.25 * fps], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phoneW = 740;
  const bezel = 14;
  const screenW = phoneW - bezel * 2;
  const screenH = Math.round(screenW * (844 / 390));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        fontFamily,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 100,
          left: 80,
          right: 80,
          color: "#fff",
          fontSize: 44,
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.25,
          opacity: enter,
        }}
      >
        <span style={{ borderBottom: `4px solid ${accent}`, paddingBottom: 4 }}>
          {caption}
        </span>
      </div>
      <div
        style={{
          marginTop: 48,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 24}px)`,
          position: "relative",
        }}
      >
        <PhoneFrame shot={shot} width={phoneW} />
        <div
          style={{
            position: "absolute",
            left: bezel,
            top: bezel,
            width: screenW,
            height: screenH,
          }}
        >
          <Cursor path={cursor} width={screenW} height={screenH} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
