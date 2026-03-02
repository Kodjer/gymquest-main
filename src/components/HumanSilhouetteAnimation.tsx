// src/components/HumanSilhouetteAnimation.tsx
// Анатомически точный div-скелет с CSS keyframes для каждого сустава

import { useId, CSSProperties } from "react";

export type SilhouetteExercise =
  | "run"
  | "walk"
  | "squat"
  | "pushup"
  | "jumping-jack"
  | "plank"
  | "lunge"
  | "dumbbell-curl"
  | "dumbbell-shoulder"
  | "deadlift"
  | "pull-up"
  | "crunch"
  | "mountain-climber"
  | "default";

interface Props {
  exerciseType?: SilhouetteExercise;
  title?: string;
  size?: "sm" | "md" | "lg";
}

/* ─────────────────────────────────────────────
   Shared body-segment styles
───────────────────────────────────────────── */
const seg = (
  w: number,
  h: number,
  radius = Math.min(w, h) / 2,
  extra?: CSSProperties
): CSSProperties => ({
  position: "absolute",
  width: w,
  height: h,
  background: "#f1f5f9",
  borderRadius: radius,
  top: 0,
  left: -w / 2,
  ...extra,
});

/** Joint wrapper — zero-size, is the pivot point */
const joint = (top: number, left: number, extra?: CSSProperties): CSSProperties => ({
  position: "absolute",
  top,
  left,
  width: 0,
  height: 0,
  transformOrigin: "0 0",
  ...extra,
});

export function HumanSilhouetteAnimation({
  exerciseType = "default",
  title,
  size = "md",
}: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "_");

  /* scale factor */
  const scale = size === "sm" ? 0.75 : size === "lg" ? 1.3 : 1;
  const W = Math.round(180 * scale);
  const H = Math.round(240 * scale);

  /* ── generate all @keyframes for this uid ── */
  const buildCSS = () => {
    const dur: Record<string, string> = {};
    const keys: Record<string, string> = {};

    // helpers
    const kf = (name: string, body: string) => {
      keys[name] = `@keyframes ${name}_${uid} { ${body} }`;
    };
    const anim = (name: string, d: string, timing = "linear", delay = "0s") => {
      dur[name] = `${name}_${uid} ${d} ${timing} ${delay} infinite`;
    };

    /* ═══ RUN / WALK ═══ */
    const isWalk = exerciseType === "walk";
    const runDur = isWalk ? "1s" : "0.62s";

    kf("body_bob", `
      0%,100% { transform: translateY(0); }
      50%      { transform: translateY(${isWalk ? -2 : -5}px); }
    `);
    kf("torso_lean", `0%,100%{transform:rotate(${isWalk ? -3 : -9}deg);}50%{transform:rotate(${isWalk ? -1 : -7}deg);}`);
    kf("head_nod", `0%,100%{transform:rotate(-3deg);}50%{transform:rotate(3deg);}`);

    // Legs
    kf("l_thigh", `0%{transform:rotate(${isWalk ? -20 : -38}deg);}50%{transform:rotate(${isWalk ? 20 : 44}deg);}100%{transform:rotate(${isWalk ? -20 : -38}deg);}`);
    kf("r_thigh", `0%{transform:rotate(${isWalk ? 20 : 44}deg);}50%{transform:rotate(${isWalk ? -20 : -38}deg);}100%{transform:rotate(${isWalk ? 20 : 44}deg);}`);

    kf("l_shin", `
      0%   { transform:rotate(${isWalk ? 5 : 10}deg); }
      25%  { transform:rotate(${isWalk ? 20 : 58}deg); }
      50%  { transform:rotate(${isWalk ? 5 : 10}deg); }
      100% { transform:rotate(${isWalk ? 5 : 10}deg); }
    `);
    kf("r_shin", `
      0%   { transform:rotate(${isWalk ? 20 : 58}deg); }
      50%  { transform:rotate(${isWalk ? 5 : 10}deg); }
      75%  { transform:rotate(${isWalk ? 20 : 58}deg); }
      100% { transform:rotate(${isWalk ? 20 : 58}deg); }
    `);
    kf("l_foot_run", `0%{transform:rotate(15deg);}50%{transform:rotate(-18deg);}100%{transform:rotate(15deg);}`);
    kf("r_foot_run", `0%{transform:rotate(-18deg);}50%{transform:rotate(15deg);}100%{transform:rotate(-18deg);}`);

    // Arms (opposite phase to same-side leg)
    kf("l_uarm", `0%{transform:rotate(${isWalk ? 22 : 42}deg);}50%{transform:rotate(${isWalk ? -22 : -32}deg);}100%{transform:rotate(${isWalk ? 22 : 42}deg);}`);
    kf("r_uarm", `0%{transform:rotate(${isWalk ? -22 : -32}deg);}50%{transform:rotate(${isWalk ? 22 : 42}deg);}100%{transform:rotate(${isWalk ? -22 : -32}deg);}`);
    kf("l_farm", `0%{transform:rotate(-35deg);}50%{transform:rotate(-55deg);}100%{transform:rotate(-35deg);}`);
    kf("r_farm", `0%{transform:rotate(-55deg);}50%{transform:rotate(-35deg);}100%{transform:rotate(-55deg);}`);

    anim("body_bob", runDur);
    anim("torso_lean", runDur);
    anim("head_nod", runDur);
    anim("l_thigh", runDur);
    anim("r_thigh", runDur);
    anim("l_shin", runDur);
    anim("r_shin", runDur);
    anim("l_foot_run", runDur);
    anim("r_foot_run", runDur);
    anim("l_uarm", runDur);
    anim("r_uarm", runDur);
    anim("l_farm", runDur);
    anim("r_farm", runDur);

    /* ═══ SQUAT ═══ */
    kf("squat_body", `0%,100%{transform:translateY(0);}40%,60%{transform:translateY(28px);}`);
    kf("squat_torso", `0%,100%{transform:rotate(0deg);}40%,60%{transform:rotate(18deg);}`);
    kf("squat_l_thigh", `0%,100%{transform:rotate(-6deg);}40%,60%{transform:rotate(52deg);}`);
    kf("squat_r_thigh", `0%,100%{transform:rotate(6deg);}40%,60%{transform:rotate(-52deg);}`);
    kf("squat_l_shin", `0%,100%{transform:rotate(4deg);}40%,60%{transform:rotate(-65deg);}`);
    kf("squat_r_shin", `0%,100%{transform:rotate(-4deg);}40%,60%{transform:rotate(65deg);}`);
    kf("squat_l_arm", `0%,100%{transform:rotate(12deg);}40%,60%{transform:rotate(-65deg);}`);
    kf("squat_r_arm", `0%,100%{transform:rotate(-12deg);}40%,60%{transform:rotate(65deg);}`);
    kf("squat_farm", `0%,100%{transform:rotate(0deg);}40%,60%{transform:rotate(-15deg);}`);

    anim("squat_body", "1.8s", "ease-in-out");
    anim("squat_torso", "1.8s", "ease-in-out");
    anim("squat_l_thigh", "1.8s", "ease-in-out");
    anim("squat_r_thigh", "1.8s", "ease-in-out");
    anim("squat_l_shin", "1.8s", "ease-in-out");
    anim("squat_r_shin", "1.8s", "ease-in-out");
    anim("squat_l_arm", "1.8s", "ease-in-out");
    anim("squat_r_arm", "1.8s", "ease-in-out");
    anim("squat_farm", "1.8s", "ease-in-out");

    /* ═══ PUSHUP (горизонтально) ═══ */
    kf("pu_body", `0%,100%{transform:translateY(0);}45%,55%{transform:translateY(14px);}`);
    kf("pu_l_arm", `0%,100%{transform:rotate(-52deg);}45%,55%{transform:rotate(-28deg);}`);
    kf("pu_r_arm", `0%,100%{transform:rotate(52deg);}45%,55%{transform:rotate(28deg);}`);
    kf("pu_l_farm", `0%,100%{transform:rotate(-80deg);}45%,55%{transform:rotate(-35deg);}`);
    kf("pu_r_farm", `0%,100%{transform:rotate(80deg);}45%,55%{transform:rotate(35deg);}`);

    anim("pu_body", "1.2s", "ease-in-out");
    anim("pu_l_arm", "1.2s", "ease-in-out");
    anim("pu_r_arm", "1.2s", "ease-in-out");
    anim("pu_l_farm", "1.2s", "ease-in-out");
    anim("pu_r_farm", "1.2s", "ease-in-out");

    /* ═══ JUMPING JACK ═══ */
    kf("jj_body", `0%,100%{transform:translateY(0);}40%,60%{transform:translateY(-8px);}`);
    kf("jj_l_arm", `0%,100%{transform:rotate(10deg);}40%,60%{transform:rotate(-95deg);}`);
    kf("jj_r_arm", `0%,100%{transform:rotate(-10deg);}40%,60%{transform:rotate(95deg);}`);
    kf("jj_farm_open", `0%,100%{transform:rotate(0deg);}40%,60%{transform:rotate(-10deg);}`);
    kf("jj_l_thigh", `0%,100%{transform:rotate(-5deg);}40%,60%{transform:rotate(-30deg);}`);
    kf("jj_r_thigh", `0%,100%{transform:rotate(5deg);}40%,60%{transform:rotate(30deg);}`);
    kf("jj_shin", `0%,100%{transform:rotate(5deg);}40%,60%{transform:rotate(5deg);}`);

    anim("jj_body", "0.55s", "ease-in-out");
    anim("jj_l_arm", "0.55s", "ease-in-out");
    anim("jj_r_arm", "0.55s", "ease-in-out");
    anim("jj_farm_open", "0.55s", "ease-in-out");
    anim("jj_l_thigh", "0.55s", "ease-in-out");
    anim("jj_r_thigh", "0.55s", "ease-in-out");
    anim("jj_shin", "0.55s", "ease-in-out");

    /* ═══ PLANK ═══ */
    kf("plank_breathe", `0%,100%{transform:scaleX(1) scaleY(1);}50%{transform:scaleX(1.04) scaleY(1.03);}`);
    kf("plank_arm", `0%,100%{transform:rotate(-50deg);}50%{transform:rotate(-48deg);}`);
    kf("plank_glow", `0%,100%{opacity:0.08;}50%{opacity:0.22;}`);
    anim("plank_breathe", "2.2s", "ease-in-out");
    anim("plank_arm", "2.2s", "ease-in-out");
    anim("plank_glow", "2.2s", "ease-in-out");

    /* ═══ LUNGE ═══ */
    kf("lunge_body", `0%,100%{transform:translateY(0);}45%,55%{transform:translateY(20px);}`);
    kf("lunge_l_thigh", `0%,100%{transform:rotate(-5deg);}45%,55%{transform:rotate(-42deg);}`);
    kf("lunge_r_thigh", `0%,100%{transform:rotate(10deg);}45%,55%{transform:rotate(52deg);}`);
    kf("lunge_l_shin", `0%,100%{transform:rotate(5deg);}45%,55%{transform:rotate(55deg);}`);
    kf("lunge_r_shin", `0%,100%{transform:rotate(-3deg);}45%,55%{transform:rotate(-55deg);}`);
    kf("lunge_arm", `0%,100%{transform:rotate(12deg);}45%,55%{transform:rotate(12deg);}`);
    anim("lunge_body", "1.8s", "ease-in-out");
    anim("lunge_l_thigh", "1.8s", "ease-in-out");
    anim("lunge_r_thigh", "1.8s", "ease-in-out");
    anim("lunge_l_shin", "1.8s", "ease-in-out");
    anim("lunge_r_shin", "1.8s", "ease-in-out");
    anim("lunge_arm", "1.8s", "ease-in-out");

    /* ═══ CURL ═══ */
    kf("curl_l_arm", `0%,100%{transform:rotate(15deg);}45%,55%{transform:rotate(-100deg);}`);
    kf("curl_r_arm", `0%,100%{transform:rotate(-15deg);}45%,55%{transform:rotate(100deg);}`);
    kf("curl_l_farm", `0%,100%{transform:rotate(0deg);}45%,55%{transform:rotate(-30deg);}`);
    kf("curl_r_farm", `0%,100%{transform:rotate(0deg);}45%,55%{transform:rotate(30deg);}`);
    anim("curl_l_arm", "1.0s", "ease-in-out");
    anim("curl_r_arm", "1.0s", "ease-in-out", "0.15s");
    anim("curl_l_farm", "1.0s", "ease-in-out");
    anim("curl_r_farm", "1.0s", "ease-in-out", "0.15s");

    /* ═══ SHOULDER PRESS ═══ */
    kf("sp_l_arm", `0%,100%{transform:rotate(-18deg);}45%,55%{transform:rotate(-118deg);}`);
    kf("sp_r_arm", `0%,100%{transform:rotate(18deg);}45%,55%{transform:rotate(118deg);}`);
    kf("sp_farm", `0%,100%{transform:rotate(0deg);}45%,55%{transform:rotate(15deg);}`);
    anim("sp_l_arm", "1.2s", "ease-in-out");
    anim("sp_r_arm", "1.2s", "ease-in-out");
    anim("sp_farm", "1.2s", "ease-in-out");

    /* ═══ DEADLIFT ═══ */
    kf("dl_body", `0%,100%{transform:translateY(0);}45%,55%{transform:translateY(22px);}`);
    kf("dl_torso", `0%,100%{transform:rotate(0deg);}45%,55%{transform:rotate(50deg);}`);
    kf("dl_l_thigh", `0%,100%{transform:rotate(-5deg);}45%,55%{transform:rotate(18deg);}`);
    kf("dl_r_thigh", `0%,100%{transform:rotate(5deg);}45%,55%{transform:rotate(-18deg);}`);
    kf("dl_l_shin", `0%,100%{transform:rotate(3deg);}45%,55%{transform:rotate(-22deg);}`);
    kf("dl_r_shin", `0%,100%{transform:rotate(-3deg);}45%,55%{transform:rotate(22deg);}`);
    kf("dl_arm", `0%,100%{transform:rotate(20deg);}45%,55%{transform:rotate(55deg);}`);
    anim("dl_body", "1.8s", "ease-in-out");
    anim("dl_torso", "1.8s", "ease-in-out");
    anim("dl_l_thigh", "1.8s", "ease-in-out");
    anim("dl_r_thigh", "1.8s", "ease-in-out");
    anim("dl_l_shin", "1.8s", "ease-in-out");
    anim("dl_r_shin", "1.8s", "ease-in-out");
    anim("dl_arm", "1.8s", "ease-in-out");

    /* ═══ PULL-UP ═══ */
    kf("pu2_body", `0%,100%{transform:translateY(0);}45%,55%{transform:translateY(-22px);}`);
    kf("pu2_l_arm", `0%,100%{transform:rotate(-10deg);}45%,55%{transform:rotate(-80deg);}`);
    kf("pu2_r_arm", `0%,100%{transform:rotate(10deg);}45%,55%{transform:rotate(80deg);}`);
    kf("pu2_farm", `0%,100%{transform:rotate(-10deg);}45%,55%{transform:rotate(-45deg);}`);
    anim("pu2_body", "1.4s", "ease-in-out");
    anim("pu2_l_arm", "1.4s", "ease-in-out");
    anim("pu2_r_arm", "1.4s", "ease-in-out");
    anim("pu2_farm", "1.4s", "ease-in-out");

    /* ═══ CRUNCH ═══ */
    kf("cr_torso", `0%,100%{transform:rotate(0deg);}40%,60%{transform:rotate(-52deg);}`);
    kf("cr_l_thigh", `0%,100%{transform:rotate(0deg);}40%,60%{transform:rotate(-18deg);}`);
    kf("cr_r_thigh", `0%,100%{transform:rotate(0deg);}40%,60%{transform:rotate(18deg);}`);
    kf("cr_arm", `0%,100%{transform:rotate(20deg);}40%,60%{transform:rotate(-10deg);}`);
    anim("cr_torso", "1.5s", "ease-in-out");
    anim("cr_l_thigh", "1.5s", "ease-in-out");
    anim("cr_r_thigh", "1.5s", "ease-in-out");
    anim("cr_arm", "1.5s", "ease-in-out");

    /* ═══ MOUNTAIN CLIMBER ═══ */
    kf("mc_l_thigh", `0%{transform:rotate(-55deg);}50%{transform:rotate(-5deg);}100%{transform:rotate(-55deg);}`);
    kf("mc_r_thigh", `0%{transform:rotate(-5deg);}50%{transform:rotate(-55deg);}100%{transform:rotate(-5deg);}`);
    kf("mc_l_shin", `0%{transform:rotate(55deg);}50%{transform:rotate(5deg);}100%{transform:rotate(55deg);}`);
    kf("mc_r_shin", `0%{transform:rotate(5deg);}50%{transform:rotate(55deg);}100%{transform:rotate(5deg);}`);
    anim("mc_l_thigh", "0.55s", "linear");
    anim("mc_r_thigh", "0.55s", "linear");
    anim("mc_l_shin", "0.55s", "linear");
    anim("mc_r_shin", "0.55s", "linear");

    /* ═══ DEFAULT idle ═══ */
    kf("idle_sway", `0%,100%{transform:rotate(-2deg);}50%{transform:rotate(2deg);}`);
    kf("idle_arm_l", `0%,100%{transform:rotate(8deg);}50%{transform:rotate(-8deg);}`);
    kf("idle_arm_r", `0%,100%{transform:rotate(-8deg);}50%{transform:rotate(8deg);}`);
    kf("idle_farm", `0%,100%{transform:rotate(-12deg);}50%{transform:rotate(12deg);}`);
    anim("idle_sway", "2.4s", "ease-in-out");
    anim("idle_arm_l", "2.4s", "ease-in-out");
    anim("idle_arm_r", "2.4s", "ease-in-out");
    anim("idle_farm", "2.4s", "ease-in-out");

    return (
      Object.values(keys).join("\n") +
      "\n" +
      Object.entries(dur)
        .map(([name, val]) => `.${name}_${uid} { animation: ${val}; }`)
        .join("\n")
    );
  };

  const css = buildCSS();

  /* ── animation class picker based on exercise ── */
  const a = (name: string) => `${name}_${uid}`;

  const getAnims = () => {
    switch (exerciseType) {
      case "run":
      case "walk":
        return {
          root:      a("body_bob"),
          torso:     a("torso_lean"),
          head:      a("head_nod"),
          lThigh:    a("l_thigh"),
          rThigh:    a("r_thigh"),
          lShin:     a("l_shin"),
          rShin:     a("r_shin"),
          lFoot:     a("l_foot_run"),
          rFoot:     a("r_foot_run"),
          lUArm:     a("l_uarm"),
          rUArm:     a("r_uarm"),
          lFArm:     a("l_farm"),
          rFArm:     a("r_farm"),
        };
      case "squat":
        return {
          root:   a("squat_body"),
          torso:  a("squat_torso"),
          lThigh: a("squat_l_thigh"),
          rThigh: a("squat_r_thigh"),
          lShin:  a("squat_l_shin"),
          rShin:  a("squat_r_shin"),
          lUArm:  a("squat_l_arm"),
          rUArm:  a("squat_r_arm"),
          lFArm:  a("squat_farm"),
          rFArm:  a("squat_farm"),
        };
      case "pushup":
        return {
          root:  a("pu_body"),
          lUArm: a("pu_l_arm"),
          rUArm: a("pu_r_arm"),
          lFArm: a("pu_l_farm"),
          rFArm: a("pu_r_farm"),
        };
      case "jumping-jack":
        return {
          root:   a("jj_body"),
          lUArm:  a("jj_l_arm"),
          rUArm:  a("jj_r_arm"),
          lFArm:  a("jj_farm_open"),
          rFArm:  a("jj_farm_open"),
          lThigh: a("jj_l_thigh"),
          rThigh: a("jj_r_thigh"),
          lShin:  a("jj_shin"),
          rShin:  a("jj_shin"),
        };
      case "plank":
        return {
          torso: a("plank_breathe"),
          lUArm: a("plank_arm"),
          rUArm: a("plank_arm"),
        };
      case "lunge":
        return {
          root:   a("lunge_body"),
          lThigh: a("lunge_l_thigh"),
          rThigh: a("lunge_r_thigh"),
          lShin:  a("lunge_l_shin"),
          rShin:  a("lunge_r_shin"),
          lUArm:  a("lunge_arm"),
          rUArm:  a("lunge_arm"),
        };
      case "dumbbell-curl":
        return {
          lUArm: a("curl_l_arm"),
          rUArm: a("curl_r_arm"),
          lFArm: a("curl_l_farm"),
          rFArm: a("curl_r_farm"),
        };
      case "dumbbell-shoulder":
        return {
          lUArm: a("sp_l_arm"),
          rUArm: a("sp_r_arm"),
          lFArm: a("sp_farm"),
          rFArm: a("sp_farm"),
        };
      case "deadlift":
        return {
          root:   a("dl_body"),
          torso:  a("dl_torso"),
          lThigh: a("dl_l_thigh"),
          rThigh: a("dl_r_thigh"),
          lShin:  a("dl_l_shin"),
          rShin:  a("dl_r_shin"),
          lUArm:  a("dl_arm"),
          rUArm:  a("dl_arm"),
        };
      case "pull-up":
        return {
          root:  a("pu2_body"),
          lUArm: a("pu2_l_arm"),
          rUArm: a("pu2_r_arm"),
          lFArm: a("pu2_farm"),
          rFArm: a("pu2_farm"),
        };
      case "crunch":
        return {
          torso:  a("cr_torso"),
          lThigh: a("cr_l_thigh"),
          rThigh: a("cr_r_thigh"),
          lUArm:  a("cr_arm"),
          rUArm:  a("cr_arm"),
        };
      case "mountain-climber":
        return {
          lThigh: a("mc_l_thigh"),
          rThigh: a("mc_r_thigh"),
          lShin:  a("mc_l_shin"),
          rShin:  a("mc_r_shin"),
        };
      default:
        return {
          torso: a("idle_sway"),
          lUArm: a("idle_arm_l"),
          rUArm: a("idle_arm_r"),
          lFArm: a("idle_farm"),
          rFArm: a("idle_farm"),
        };
    }
  };

  const anims = getAnims() as Record<string, string | undefined>;

  /* ── Layout constants ── */
  // Everything is oriented in a 180×230 container, figure anchored bottom-center
  const cx = 90;   // center X
  const headY = 10, headR = 14;               // head top-Y and radius
  const neckTop = headY + headR * 2;          // 38
  const neckH = 12;
  const torsoTop = neckTop + neckH;           // 50
  const torsoH = 52;
  const hipY = torsoTop + torsoH;             // 102  (hip joint Y)
  const shoulderY = torsoTop + 6;             // 56   (shoulder joint Y)
  const thighH = 38, shinH = 34, footW = 20, footH = 8;
  const uArmH = 30, fArmH = 26;

  // For pushup / plank the figure is rotated, handled with container transform
  const isHorizontal = exerciseType === "pushup" || exerciseType === "plank" || exerciseType === "mountain-climber";
  const isPullUp = exerciseType === "pull-up";
  const isCrunch = exerciseType === "crunch";

  const containerStyle: CSSProperties = {
    position: "relative",
    width: W,
    height: H,
    margin: "0 auto",
  };

  // Figure root includes the body bob animation
  const figureRootStyle: CSSProperties = {
    position: "absolute",
    bottom: isCrunch ? 30 : 20,
    left: cx - 50,
    width: 100,
    height: 180,
    animation: anims.root,
  };

  /* Pull-up: figure starts higher (hanging from bar) */
  if (isPullUp) {
    (figureRootStyle as any).bottom = undefined;
    (figureRootStyle as any).top = 30;
  }

  /* Horizontal exercises: tilt whole figure 90° */
  const figureAngle = isHorizontal ? -5 : 0;

  // ── Segment colors ──
  const C = "#f1f5f9";  // main body color (off-white)
  const CA = "#c4b5fd"; // accent (forearms/feet — subtle purple)

  // Skincare on limb segments
  const torsoW = 17, uArmW = 10, fArmW = 8, thighW = 12, shinW = 10;

  /* ─────────────────────────
     HORIZONTAL figure (pushup/plank/mountain climber)
  ───────────────────────── */
  if (isHorizontal) {
    // Lay figure on its side: rotate entire thing
    const bodyW = 100;
    return (
      <div style={{ background: "#0a0a14", borderRadius: 16, padding: 16, userSelect: "none" }}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div style={{ ...containerStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Glow pulse for plank */}
          {exerciseType === "plank" && (
            <div className={anims.torso} style={{
              position: "absolute",
              width: 160, height: 40,
              background: "radial-gradient(ellipse, rgba(139,92,246,0.18) 0%, transparent 70%)",
              borderRadius: 20,
              top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            }} />
          )}
          {/* Horizontal figure */}
          <div style={{ position: "relative", width: 170, height: 60, animation: anims.root }}>
            {/* HEAD (left side) */}
            <div style={{ position: "absolute", left: 2, top: 12, width: headR*2, height: headR*2, borderRadius: "50%", background: C, animation: anims.head }} />
            {/* NECK */}
            <div style={{ position: "absolute", left: 30, top: 18, width: 14, height: 7, borderRadius: 3, background: C }} />
            {/* TORSO */}
            <div style={{ position: "absolute", left: 44, top: 19, width: 65, height: torsoW, borderRadius: 7, background: C, animation: anims.torso }} />

            {/* ARMS (props as support — for pushup: arms bent-extend downward from torso top) */}
            {/* L arm (near head side) */}
            <div style={joint(22, 56, { animation: anims.lUArm })}>
              <div style={seg(uArmW, uArmH, 5)} />
              <div style={joint(uArmH - 2, 0, { animation: anims.lFArm })}>
                <div style={seg(fArmW, fArmH, 4)} />
              </div>
            </div>
            {/* R arm (far side) */}
            <div style={joint(22, 108, { animation: anims.rUArm })}>
              <div style={seg(uArmW, uArmH, 5)} />
              <div style={joint(uArmH - 2, 0, { animation: anims.rFArm })}>
                <div style={seg(fArmW, fArmH, 4)} />
              </div>
            </div>

            {/* LEGS (near right, pointing right in horizontal mode) */}
            {/* L leg */}
            <div style={joint(22, 130, { animation: anims.lThigh })}>
              <div style={{ ...seg(thighW, thighH, 6), transform: "rotate(90deg)", transformOrigin: "top left" }} />
              <div style={joint(0, thighH + 2, { animation: anims.lShin })}>
                <div style={{ ...seg(shinW, shinH, 5), transform: "rotate(90deg)", transformOrigin: "top left" }} />
              </div>
            </div>
            {/* R leg */}
            <div style={joint(34, 130, { animation: anims.rThigh })}>
              <div style={{ ...seg(thighW, thighH, 6), transform: "rotate(90deg)", transformOrigin: "top left" }} />
              <div style={joint(0, thighH + 2, { animation: anims.rShin })}>
                <div style={{ ...seg(shinW, shinH, 5), transform: "rotate(90deg)", transformOrigin: "top left" }} />
              </div>
            </div>
          </div>
        </div>
        {title && <div style={{ textAlign: "center", marginTop: 4, fontSize: 11, color: "#64748b" }}>{title}</div>}
      </div>
    );
  }

  /* ─────────────────────────
     CRUNCH (person lying down, torso curls up)
  ───────────────────────── */
  if (isCrunch) {
    return (
      <div style={{ background: "#0a0a14", borderRadius: 16, padding: 16, userSelect: "none" }}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div style={containerStyle}>
          {/* Mat */}
          <div style={{ position: "absolute", bottom: 28, left: 16, width: W - 32, height: 6, background: "#1e1b4b", borderRadius: 3 }} />

          <div style={{ position: "absolute", bottom: 34, left: 20, width: 155, height: 50 }}>
            {/* LEGS (horizontal — thighs flat, shins bent up) */}
            <div style={joint(20, 120, { transform: "rotate(0deg)", animation: anims.lThigh })}>
              <div style={{ ...seg(thighW, thighH, 6), transform: "rotate(90deg)", transformOrigin: "top left" }} />
              <div style={joint(6, thighH - 2, { animation: anims.lShin })}>
                <div style={{ ...seg(shinW, shinH, 5) }} />
              </div>
            </div>
            <div style={joint(30, 120, { animation: anims.rThigh })}>
              <div style={{ ...seg(thighW, thighH, 6), transform: "rotate(90deg)", transformOrigin: "top left" }} />
              <div style={joint(6, thighH - 2, { animation: anims.rShin })}>
                <div style={{ ...seg(shinW, shinH, 5) }} />
              </div>
            </div>

            {/* TORSO (curls upward from hips) */}
            <div style={joint(16, 80, { animation: anims.torso, transformOrigin: "0 0" })}>
              <div style={{ ...seg(torsoW, torsoH, 8), transform: "rotate(-90deg)", transformOrigin: "top left" }} />
              {/* HEAD at end of torso */}
              <div style={{ position: "absolute", top: -torsoH - headR*2 - 4, left: -headR, width: headR*2, height: headR*2, borderRadius: "50%", background: C }} />
              {/* ARMS */}
              <div style={joint(-torsoH + 6, 0, { animation: anims.lUArm })}>
                <div style={seg(uArmW, uArmH, 5)} />
                <div style={joint(uArmH - 2, 0, { animation: anims.lFArm })}>
                  <div style={seg(fArmW, fArmH, 4)} />
                </div>
              </div>
              <div style={joint(-torsoH + 6, 0, { animation: anims.rUArm })}>
                <div style={seg(uArmW, uArmH, 5)} />
                <div style={joint(uArmH - 2, 0, { animation: anims.rFArm })}>
                  <div style={seg(fArmW, fArmH, 4)} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {title && <div style={{ textAlign: "center", marginTop: 4, fontSize: 11, color: "#64748b" }}>{title}</div>}
      </div>
    );
  }

  /* ─────────────────────────
     VERTICAL figure (default layout)
  ───────────────────────── */
  return (
    <div style={{ background: "#0a0a14", borderRadius: 16, padding: 16, userSelect: "none" }}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div style={{ textAlign: "center", marginBottom: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7c3aed" }}>
        Техника
      </div>
      <div style={containerStyle}>

        {/* PULL-UP: Турник */}
        {isPullUp && (
          <>
            <div style={{ position: "absolute", top: 12, left: 10, width: W - 20, height: 6, background: "#475569", borderRadius: 3 }} />
            <div style={{ position: "absolute", top: 12, left: 18, width: 4, height: 16, background: "#334155" }} />
            <div style={{ position: "absolute", top: 12, right: 18, width: 4, height: 16, background: "#334155" }} />
          </>
        )}

        {/* FIGURE ROOT — bob/translate animation */}
        <div style={{ ...figureRootStyle, transform: figureAngle ? `rotate(${figureAngle}deg)` : undefined }}>

          {/* ── HEAD ── */}
          <div style={{
            position: "absolute",
            left: cx - 50 - (cx - 50) + cx - headR,  // = headR from left edge of figureRoot (which is 50px wide)
            // Actually figureRoot left = cx-50 = 40, so within figureRoot, head left = cx - (cx-50) - headR = 50-headR = 36
            // Let me simplify: figureRoot is 100px wide, center is at 50
          }}>
          </div>
          {/* HEAD — centered at x=50 within 100px root */}
          <div style={{
            position: "absolute",
            left: 50 - headR,
            top: headY,
            width: headR * 2,
            height: headR * 2,
            borderRadius: "50%",
            background: C,
            animation: anims.head,
            transformOrigin: "50% 50%",
          }} />

          {/* NECK */}
          <div style={{ position: "absolute", left: 47, top: neckTop, width: 6, height: neckH, borderRadius: 3, background: C }} />

          {/* TORSO — center at x=50 */}
          <div style={{
            position: "absolute",
            left: 50 - torsoW / 2,
            top: torsoTop,
            width: torsoW,
            height: torsoH,
            borderRadius: 8,
            background: C,
            animation: anims.torso,
            transformOrigin: "50% 0%",
          }} />

          {/* ── L SHOULDER JOINT → upper arm ── */}
          {/* Shoulder at: x = 50 - torsoW/2 - 2 = 50-10.5 ≈ 39, y = shoulderY */}
          <div style={joint(shoulderY, 38, { animation: anims.lUArm })}>
            <div style={seg(uArmW, uArmH, 5)} />
            {/* L ELBOW JOINT → forearm */}
            <div style={joint(uArmH - 2, 0, { animation: anims.lFArm })}>
              <div style={seg(fArmW, fArmH, 4, { background: CA })} />
            </div>
          </div>

          {/* ── R SHOULDER JOINT → upper arm ── */}
          <div style={joint(shoulderY, 62, { animation: anims.rUArm })}>
            <div style={seg(uArmW, uArmH, 5)} />
            {/* R ELBOW JOINT → forearm */}
            <div style={joint(uArmH - 2, 0, { animation: anims.rFArm })}>
              <div style={seg(fArmW, fArmH, 4, { background: CA })} />
            </div>
          </div>

          {/* ── L HIP JOINT → thigh → shin → foot ── */}
          <div style={joint(hipY, 43, { animation: anims.lThigh })}>
            <div style={seg(thighW, thighH, 6)} />
            {/* L KNEE JOINT */}
            <div style={joint(thighH - 2, 0, { animation: anims.lShin })}>
              <div style={seg(shinW, shinH, 5)} />
              {/* L ANKLE JOINT */}
              <div style={joint(shinH - 2, 0, { animation: anims.lFoot })}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: -4,
                  width: footW,
                  height: footH,
                  borderRadius: 4,
                  background: CA,
                }} />
              </div>
            </div>
          </div>

          {/* ── R HIP JOINT → thigh → shin → foot ── */}
          <div style={joint(hipY, 57, { animation: anims.rThigh })}>
            <div style={seg(thighW, thighH, 6)} />
            {/* R KNEE JOINT */}
            <div style={joint(thighH - 2, 0, { animation: anims.rShin })}>
              <div style={seg(shinW, shinH, 5)} />
              {/* R ANKLE JOINT */}
              <div style={joint(shinH - 2, 0, { animation: anims.rFoot })}>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: -4,
                  width: footW,
                  height: footH,
                  borderRadius: 4,
                  background: CA,
                }} />
              </div>
            </div>
          </div>

          {/* Dumbbell for curls / shoulder press */}
          {(exerciseType === "dumbbell-curl" || exerciseType === "dumbbell-shoulder") && (
            <>
              {/* L dumbbell — attached to left forearm area */}
              <div style={{ position: "absolute", left: 8, top: shoulderY + uArmH + 10, width: 22, height: 6, background: "#94a3b8", borderRadius: 3 }} />
              {/* R dumbbell */}
              <div style={{ position: "absolute", left: 70, top: shoulderY + uArmH + 10, width: 22, height: 6, background: "#94a3b8", borderRadius: 3 }} />
            </>
          )}

          {/* Barbell for deadlift */}
          {exerciseType === "deadlift" && (
            <div style={{ position: "absolute", left: -18, top: hipY + thighH + shinH - 8, width: 136, height: 5, background: "#94a3b8", borderRadius: 3 }}>
              <div style={{ position: "absolute", left: -8, top: -6, width: 8, height: 18, background: "#64748b", borderRadius: 2 }} />
              <div style={{ position: "absolute", right: -8, top: -6, width: 8, height: 18, background: "#64748b", borderRadius: 2 }} />
            </div>
          )}

          {/* Pull-up bar grip lines */}
          {isPullUp && (
            <>
              <div style={{ position: "absolute", left: 30, top: headY - 18, width: 6, height: 18, background: "#94a3b8", borderRadius: 3 }} />
              <div style={{ position: "absolute", left: 64, top: headY - 18, width: 6, height: 18, background: "#94a3b8", borderRadius: 3 }} />
            </>
          )}

        </div>

        {/* Floor line */}
        <div style={{ position: "absolute", bottom: 14, left: 12, width: W - 24, height: 2, background: "#1e293b", borderRadius: 1 }} />
      </div>

      {title && <div style={{ textAlign: "center", marginTop: 2, fontSize: 11, color: "#475569" }}>{title}</div>}
    </div>
  );
}

/** Определяет тип силуэт-анимации по названию упражнения */
export function getSilhouetteType(title: string): SilhouetteExercise {
  const t = title.toLowerCase();

  if (t.includes("бег") || t.includes("спринт") || t.includes("run")) return "run";
  if (t.includes("ходьба") || t.includes("прогулка") || t.includes("walk")) return "walk";
  if (t.includes("присед")) return "squat";
  if (t.includes("отжимани") && !t.includes("брус")) return "pushup";
  if (t.includes("прыжк") || t.includes("jumping")) return "jumping-jack";
  if (t.includes("планк")) return "plank";
  if (t.includes("выпад")) return "lunge";
  if (t.includes("берпи") || t.includes("burpee")) return "jumping-jack";
  if (t.includes("альпинист") || t.includes("скалолаз") || t.includes("mountain")) return "mountain-climber";
  if (t.includes("скручивани") || t.includes("пресс") || t.includes("crunch")) return "crunch";
  if (t.includes("велосипед") && !t.includes("тренажер")) return "crunch";
  if (t.includes("подъем") && t.includes("ног")) return "crunch";
  if (t.includes("подтягивани") || t.includes("pull")) return "pull-up";
  if (t.includes("брусья") || t.includes("брусь") || t.includes("dip")) return "default";
  if (
    (t.includes("сгибани") || t.includes("молотков") || t.includes("бицепс")) &&
    (t.includes("рук") || t.includes("гантел"))
  ) return "dumbbell-curl";
  if (
    t.includes("жим") &&
    (t.includes("стоя") || t.includes("плеч") || t.includes("над головой") || t.includes("армейский"))
  ) return "dumbbell-shoulder";
  if (t.includes("жим") && (t.includes("гантел") || t.includes("лёжа") || t.includes("лежа"))) return "pushup";
  if (t.includes("станов") || t.includes("deadlift") || t.includes("румынская")) return "deadlift";
  if (t.includes("тяга") && (t.includes("верхн") || t.includes("блок"))) return "pull-up";
  if (t.includes("растяжк") || t.includes("stretch") || t.includes("наклон")) return "default";
  if (t.includes("йога") || t.includes("медитац") || t.includes("дыхан")) return "default";

  return "default";
}

export default HumanSilhouetteAnimation;
