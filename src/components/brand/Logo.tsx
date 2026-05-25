import { motion } from "framer-motion";

export function Logo({ size = 28, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <motion.div
        initial={{ rotate: -8, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="relative grid place-items-center rounded-xl"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute inset-0 rounded-xl"
          style={{ background: "linear-gradient(135deg, oklch(0.68 0.20 250), oklch(0.42 0.18 262))" }}
        />
        <div className="absolute inset-0 rounded-xl opacity-60 blur-md"
          style={{ background: "linear-gradient(135deg, oklch(0.68 0.20 250 / .8), transparent)" }} />
        <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} className="relative text-white">
          <path fill="currentColor" d="M4 5a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-4l-5 4v-4H7a3 3 0 0 1-3-3V5Z" />
        </svg>
      </motion.div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Concierge</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Auto Suite</span>
        </div>
      )}
    </div>
  );
}
