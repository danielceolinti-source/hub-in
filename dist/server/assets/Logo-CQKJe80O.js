import { L as jsxRuntimeExports } from "./server-DJBFbZXq.js";
import { m as motion } from "./proxy-B4abZrjL.js";
function Logo({ size = 28, withText = true }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { rotate: -8, scale: 0.9 },
        animate: { rotate: 0, scale: 1 },
        transition: { type: "spring", stiffness: 220, damping: 18 },
        className: "relative grid place-items-center rounded-xl",
        style: { width: size, height: size },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 rounded-xl",
              style: { background: "linear-gradient(135deg, oklch(0.68 0.20 250), oklch(0.42 0.18 262))" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 rounded-xl opacity-60 blur-md",
              style: { background: "linear-gradient(135deg, oklch(0.68 0.20 250 / .8), transparent)" }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", width: size * 0.55, height: size * 0.55, className: "relative text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "currentColor", d: "M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-4l-5 4v-4H7a3 3 0 0 1-3-3V5Z" }) })
        ]
      }
    ),
    withText && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col leading-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[15px] font-semibold tracking-tight text-foreground", children: "Concierge" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-[0.18em] text-muted-foreground", children: "Auto Suite" })
    ] })
  ] });
}
export {
  Logo as L
};
