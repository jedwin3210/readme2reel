import { Img, staticFile } from "remotion";

/** Full-bleed phone for 1080×1920. Never use object-fit: cover. */
export const PhoneFrame: React.FC<{
  shot: string;
  /** Outer device width; use 920–980 inside a 1080 frame */
  width?: number;
}> = ({ shot, width = 740 }) => {
  const bezel = 14;
  const radius = 52;
  const screenW = width - bezel * 2;
  const screenH = Math.round(screenW * (844 / 390));

  return (
    <div
      style={{
        width,
        borderRadius: radius,
        padding: bezel,
        backgroundColor: "#0a0a0a",
        boxShadow: "0 28px 64px rgba(0,0,0,0.5)",
        border: "1px solid #1f2937",
      }}
    >
      <div
        style={{
          width: screenW,
          height: screenH,
          borderRadius: radius - 10,
          overflow: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <Img
          src={staticFile(shot)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "top center",
            display: "block",
          }}
        />
      </div>
    </div>
  );
};
