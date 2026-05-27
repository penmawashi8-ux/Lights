"use client";

interface Props {
  size?: number;
  className?: string;
}

// ── Cell icons ────────────────────────────────────────────────

export function StarIcon({ size = 28, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon
        points="14,2 17.5,10 26,11 20,17 22,26 14,21.5 6,26 8,17 2,11 10.5,10"
        fill="white"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <polygon
        points="14,5.5 16.8,11.5 23,12.3 18.5,16.7 19.8,23 14,19.8 8.2,23 9.5,16.7 5,12.3 11.2,11.5"
        fill="#fef9c3"
        opacity="0.5"
      />
    </svg>
  );
}

export function LeafIcon({ size = 28, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Leaf body */}
      <path d="M14 4 C8 7 6 13 7 19 C8.5 24 13 24 15 21 C18 17 20 10 14 4Z" fill="#4ade80"/>
      {/* Highlight */}
      <path d="M13 6 C9 9 8 15 9 19" stroke="#86efac" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
      {/* Vein */}
      <path d="M13 6 L11 20" stroke="#16a34a" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M11 12 L8 15" stroke="#16a34a" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5"/>
      <path d="M11 16 L8 18" stroke="#16a34a" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.5"/>
      {/* Stem */}
      <path d="M11 21 Q10 24 11 26" stroke="#16a34a" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── Button icons (head/face, fits in 48px circle) ─────────────

export function OwlIcon({ size = 48, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ear tufts */}
      <polygon points="26,12 31,27 19,27" fill="#92400e"/>
      <polygon points="54,12 61,27 47,27" fill="#92400e"/>
      {/* Head */}
      <circle cx="40" cy="38" r="26" fill="#b45309"/>
      {/* Face disc */}
      <ellipse cx="40" cy="39" rx="22" ry="20" fill="#d97706"/>
      {/* Eye whites */}
      <circle cx="29" cy="35" r="11" fill="white"/>
      <circle cx="51" cy="35" r="11" fill="white"/>
      {/* Eye iris */}
      <circle cx="29" cy="35" r="7" fill="#fbbf24"/>
      <circle cx="51" cy="35" r="7" fill="#fbbf24"/>
      {/* Pupil */}
      <circle cx="30" cy="35" r="4.2" fill="#111827"/>
      <circle cx="52" cy="35" r="4.2" fill="#111827"/>
      {/* Shine */}
      <circle cx="31.8" cy="32.5" r="2" fill="white"/>
      <circle cx="53.8" cy="32.5" r="2" fill="white"/>
      {/* Small shine dot */}
      <circle cx="30.5" cy="37" r="1" fill="rgba(255,255,255,0.4)"/>
      <circle cx="52.5" cy="37" r="1" fill="rgba(255,255,255,0.4)"/>
      {/* Beak */}
      <path d="M40 41 L35 50 L45 50 Z" fill="#f59e0b"/>
      <path d="M35 50 Q40 53 45 50" stroke="#d97706" strokeWidth="1" fill="none"/>
      {/* Body / wings hint */}
      <path d="M16 60 C10 70 14 80 20 80 L60 80 C66 80 70 70 64 60 Q52 72 40 72 Q28 72 16 60Z" fill="#92400e"/>
      {/* Belly */}
      <ellipse cx="40" cy="72" rx="16" ry="10" fill="#d97706"/>
      {/* Belly stripes */}
      <path d="M32 68 Q40 66 48 68" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M31 73 Q40 71 49 73" stroke="#b45309" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

export function FoxIcon({ size = 48, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left ear outer */}
      <polygon points="20,28 12,4 36,18" fill="#ea580c"/>
      {/* Left ear inner */}
      <polygon points="21,26 16,8 33,18" fill="#fca5a5"/>
      {/* Right ear outer */}
      <polygon points="60,28 68,4 44,18" fill="#ea580c"/>
      {/* Right ear inner */}
      <polygon points="59,26 64,8 47,18" fill="#fca5a5"/>
      {/* Head */}
      <circle cx="40" cy="44" r="28" fill="#f97316"/>
      {/* White muzzle */}
      <ellipse cx="40" cy="52" rx="16" ry="14" fill="#fef3c7"/>
      {/* Cheek highlights */}
      <circle cx="24" cy="48" r="7" fill="#fb923c" opacity="0.5"/>
      <circle cx="56" cy="48" r="7" fill="#fb923c" opacity="0.5"/>
      {/* Eyes */}
      <ellipse cx="31" cy="40" rx="6" ry="7" fill="#111827"/>
      <ellipse cx="49" cy="40" rx="6" ry="7" fill="#111827"/>
      {/* Eye shine */}
      <circle cx="33" cy="37.5" r="2.8" fill="white"/>
      <circle cx="51" cy="37.5" r="2.8" fill="white"/>
      <circle cx="32" cy="37.5" r="1.2" fill="white" opacity="0.5"/>
      <circle cx="50" cy="37.5" r="1.2" fill="white" opacity="0.5"/>
      {/* Nose */}
      <ellipse cx="40" cy="50" rx="4.5" ry="3.5" fill="#111827"/>
      <circle cx="38.8" cy="48.8" r="1.5" fill="#4b5563"/>
      {/* Mouth */}
      <path d="M36 53 Q40 58 44 53" stroke="#c2410c" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      {/* Whisker lines */}
      <line x1="18" y1="51" x2="30" y2="52" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
      <line x1="18" y1="55" x2="30" y2="55" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
      <line x1="50" y1="52" x2="62" y2="51" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
      <line x1="50" y1="55" x2="62" y2="55" stroke="#fed7aa" strokeWidth="1.2" strokeLinecap="round" opacity="0.8"/>
    </svg>
  );
}

// ── Info bar bear (small face) ────────────────────────────────

export function BearIcon({ size = 36, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ears */}
      <circle cx="13" cy="13" r="11" fill="#92400e"/>
      <circle cx="47" cy="13" r="11" fill="#92400e"/>
      <circle cx="13" cy="13" r="7" fill="#b45309"/>
      <circle cx="47" cy="13" r="7" fill="#b45309"/>
      {/* Head */}
      <circle cx="30" cy="33" r="24" fill="#a16207"/>
      {/* Muzzle */}
      <ellipse cx="30" cy="40" rx="13" ry="11" fill="#d97706"/>
      {/* Eyes */}
      <circle cx="21" cy="29" r="5.5" fill="#111827"/>
      <circle cx="39" cy="29" r="5.5" fill="#111827"/>
      <circle cx="22.8" cy="27.2" r="2.2" fill="white"/>
      <circle cx="40.8" cy="27.2" r="2.2" fill="white"/>
      {/* Nose */}
      <ellipse cx="30" cy="38" rx="4.5" ry="3.5" fill="#111827"/>
      <circle cx="28.8" cy="37" r="1.5" fill="#4b5563"/>
      {/* Mouth */}
      <path d="M25 42 Q30 46 35 42" stroke="#92400e" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

// ── Standing characters (board side decorations) ──────────────

export function RabbitCharacter({ size = 88, className = "" }: Props) {
  return (
    <svg width={size * 0.72} height={size} viewBox="0 0 65 90" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left ear */}
      <ellipse cx="24" cy="14" rx="7.5" ry="18" fill="#e2e8f0" transform="rotate(-8,24,14)"/>
      <ellipse cx="24" cy="14" rx="4" ry="13" fill="#fda4af" transform="rotate(-8,24,14)"/>
      {/* Right ear */}
      <ellipse cx="42" cy="13" rx="7.5" ry="18" fill="#e2e8f0" transform="rotate(8,42,13)"/>
      <ellipse cx="42" cy="13" rx="4" ry="13" fill="#fda4af" transform="rotate(8,42,13)"/>
      {/* Head */}
      <circle cx="33" cy="36" r="20" fill="#f1f5f9"/>
      {/* Cheeks */}
      <circle cx="19" cy="38" r="7" fill="#fda4af" opacity="0.35"/>
      <circle cx="47" cy="38" r="7" fill="#fda4af" opacity="0.35"/>
      {/* Eyes */}
      <circle cx="26" cy="33" r="5.5" fill="#111827"/>
      <circle cx="40" cy="33" r="5.5" fill="#111827"/>
      <circle cx="27.8" cy="31.2" r="2.2" fill="white"/>
      <circle cx="41.8" cy="31.2" r="2.2" fill="white"/>
      {/* Nose */}
      <ellipse cx="33" cy="40" rx="3" ry="2.5" fill="#fda4af"/>
      {/* Mouth */}
      <path d="M29 43 Q33 47 37 43" stroke="#cbd5e1" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Whiskers */}
      <line x1="13" y1="40" x2="26" y2="41" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="13" y1="43" x2="26" y2="43" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="40" y1="41" x2="53" y2="40" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      <line x1="40" y1="43" x2="53" y2="43" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.7"/>
      {/* Body */}
      <ellipse cx="33" cy="70" rx="20" ry="22" fill="#e2e8f0"/>
      {/* Belly */}
      <ellipse cx="33" cy="70" rx="12" ry="16" fill="#f8fafc"/>
      {/* Left arm holding star */}
      <path d="M13 60 Q6 70 10 78" stroke="#e2e8f0" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {/* Star */}
      <polygon
        points="7,84 9.5,77 7,84 0,80 6,75 4,68 10,73 16,68 14,75 20,80 13,84 11,91"
        fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" strokeLinejoin="round"
      />
      {/* Right arm */}
      <path d="M53 60 Q60 70 56 78" stroke="#e2e8f0" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {/* Tail */}
      <circle cx="54" cy="76" r="8" fill="white"/>
      {/* Legs */}
      <ellipse cx="24" cy="89" rx="10" ry="6" fill="#e2e8f0" transform="rotate(-12,24,89)"/>
      <ellipse cx="42" cy="89" rx="10" ry="6" fill="#e2e8f0" transform="rotate(12,42,89)"/>
    </svg>
  );
}

export function RaccoonCharacter({ size = 88, className = "" }: Props) {
  return (
    <svg width={size * 0.76} height={size} viewBox="0 0 67 88" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ears */}
      <ellipse cx="22" cy="12" rx="9" ry="12" fill="#6b7280" transform="rotate(-12,22,12)"/>
      <ellipse cx="22" cy="12" rx="5" ry="7" fill="#9ca3af" transform="rotate(-12,22,12)"/>
      <ellipse cx="46" cy="12" rx="9" ry="12" fill="#6b7280" transform="rotate(12,46,12)"/>
      <ellipse cx="46" cy="12" rx="5" ry="7" fill="#9ca3af" transform="rotate(12,46,12)"/>
      {/* Head */}
      <circle cx="34" cy="34" r="23" fill="#9ca3af"/>
      {/* Eye mask patches */}
      <ellipse cx="23" cy="31" rx="10" ry="8" fill="#1f2937"/>
      <ellipse cx="45" cy="31" rx="10" ry="8" fill="#1f2937"/>
      {/* White stripe between eyes */}
      <path d="M29 25 Q34 23 39 25" stroke="#f3f4f6" strokeWidth="4" fill="none" strokeLinecap="round"/>
      {/* Eye iris (amber) */}
      <circle cx="23" cy="31" r="5" fill="#fbbf24"/>
      <circle cx="45" cy="31" r="5" fill="#fbbf24"/>
      {/* Pupils */}
      <circle cx="23" cy="31" r="3" fill="#111827"/>
      <circle cx="45" cy="31" r="3" fill="#111827"/>
      {/* Eye shine */}
      <circle cx="24.2" cy="29.5" r="1.5" fill="white"/>
      <circle cx="46.2" cy="29.5" r="1.5" fill="white"/>
      {/* Muzzle */}
      <ellipse cx="34" cy="40" rx="12" ry="9" fill="#d1d5db"/>
      {/* Nose */}
      <ellipse cx="34" cy="38" rx="4" ry="3" fill="#374151"/>
      <circle cx="32.8" cy="37" r="1.3" fill="#6b7280"/>
      {/* Mouth */}
      <path d="M30 42 Q34 46 38 42" stroke="#9ca3af" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Whiskers */}
      <line x1="14" y1="40" x2="26" y2="41" stroke="#e5e7eb" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
      <line x1="14" y1="43" x2="26" y2="44" stroke="#e5e7eb" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
      <line x1="42" y1="41" x2="54" y2="40" stroke="#e5e7eb" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
      <line x1="42" y1="44" x2="54" y2="43" stroke="#e5e7eb" strokeWidth="1" strokeLinecap="round" opacity="0.8"/>
      {/* Body */}
      <ellipse cx="34" cy="68" rx="21" ry="23" fill="#9ca3af"/>
      {/* Belly */}
      <ellipse cx="34" cy="70" rx="13" ry="17" fill="#d1d5db"/>
      {/* Left arm */}
      <path d="M13 58 Q5 68 10 78" stroke="#9ca3af" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {/* Right arm with marshmallow */}
      <path d="M55 58 Q63 68 60 78" stroke="#9ca3af" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {/* Stick */}
      <line x1="63" y1="76" x2="72" y2="58" stroke="#92400e" strokeWidth="3" strokeLinecap="round"/>
      {/* Marshmallow */}
      <rect x="67" y="50" width="12" height="11" rx="4" fill="#fef3c7" stroke="#fde68a" strokeWidth="1.2"/>
      <rect x="68" y="51" width="10" height="9" rx="3" fill="white" opacity="0.6"/>
      {/* Striped tail */}
      <path d="M55 70 Q70 62 68 50 Q66 40 60 44 Q64 53 60 60 Q54 67 55 70Z" fill="#9ca3af"/>
      <path d="M57 66 Q69 59 67 48" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M57 60 Q67 54 66 44" stroke="#374151" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M58 54 Q65 50 64 41" stroke="#374151" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* Legs */}
      <ellipse cx="24" cy="88" rx="11" ry="6" fill="#9ca3af" transform="rotate(-10,24,88)"/>
      <ellipse cx="44" cy="88" rx="11" ry="6" fill="#9ca3af" transform="rotate(10,44,88)"/>
    </svg>
  );
}

export function HedgehogCharacter({ size = 68, className = "" }: Props) {
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 90 68" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Spines */}
      <polygon points="32,42 24,16 40,36" fill="#92400e"/>
      <polygon points="44,38 38,10 55,32" fill="#7c2d12"/>
      <polygon points="56,40 52,14 67,34" fill="#92400e"/>
      <polygon points="67,46 65,20 77,40" fill="#7c2d12"/>
      <polygon points="74,54 76,28 84,48" fill="#92400e"/>
      {/* Body */}
      <ellipse cx="48" cy="50" rx="34" ry="22" fill="#a16207"/>
      {/* Belly */}
      <ellipse cx="46" cy="54" rx="24" ry="15" fill="#d97706"/>
      {/* Head */}
      <circle cx="17" cy="46" r="20" fill="#a16207"/>
      {/* Ear */}
      <ellipse cx="9" cy="30" rx="7" ry="9.5" fill="#b45309"/>
      <ellipse cx="9" cy="30" rx="4" ry="6" fill="#fca5a5"/>
      {/* Eye */}
      <circle cx="10" cy="42" r="5.5" fill="#111827"/>
      <circle cx="11.8" cy="40.2" r="2.2" fill="white"/>
      <circle cx="11" cy="43.5" r="1" fill="white" opacity="0.4"/>
      {/* Cheek */}
      <circle cx="8" cy="47" r="5" fill="#fda4af" opacity="0.35"/>
      {/* Nose */}
      <ellipse cx="3" cy="49" rx="4.5" ry="3.5" fill="#7c2d12"/>
      <circle cx="1.8" cy="48" r="1.5" fill="#4b5563"/>
      {/* Mouth */}
      <path d="M0 52 Q3 55 7 52" stroke="#92400e" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Lantern body */}
      <rect x="2" y="54" width="16" height="20" rx="5" fill="#fbbf24"/>
      <rect x="3" y="55" width="14" height="18" rx="4" fill="#fef9c3" opacity="0.85"/>
      {/* Lantern top handle */}
      <path d="M10 50 L10 54" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M6 54 Q10 51 14 54" stroke="#d97706" strokeWidth="2" fill="none"/>
      {/* Flame inside lantern */}
      <path d="M10 60 C8 55 7 52 10 50 C13 52 12 55 10 60Z" fill="#f97316" opacity="0.8"/>
      <path d="M10 59 C9 56 9 54 10 52 C11 54 11 56 10 59Z" fill="#fbbf24" opacity="0.9"/>
      {/* Lantern dividers */}
      <line x1="2" y1="64" x2="18" y2="64" stroke="#d97706" strokeWidth="1" opacity="0.5"/>
      {/* Feet */}
      <ellipse cx="32" cy="67" rx="9" ry="5" fill="#92400e"/>
      <ellipse cx="58" cy="67" rx="9" ry="5" fill="#92400e"/>
    </svg>
  );
}

export function CampfireIcon({ size = 62, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Ground shadow */}
      <ellipse cx="40" cy="72" rx="26" ry="6" fill="#052e16" opacity="0.4"/>
      {/* Log left */}
      <rect x="8" y="54" width="38" height="14" rx="7" fill="#7c2d12" transform="rotate(-22,27,61)"/>
      <ellipse cx="11" cy="57" rx="7" ry="5" fill="#6b2101"/>
      {/* Log right */}
      <rect x="34" y="54" width="38" height="14" rx="7" fill="#92400e" transform="rotate(22,53,61)"/>
      <ellipse cx="69" cy="57" rx="7" ry="5" fill="#6b2101"/>
      {/* Embers base */}
      <ellipse cx="40" cy="64" rx="18" ry="8" fill="#dc2626" opacity="0.7"/>
      <ellipse cx="40" cy="64" rx="12" ry="5" fill="#f97316" opacity="0.6"/>
      {/* Outer flame */}
      <path d="M40 60 C26 44 22 27 30 16 C34 28 37 34 40 26 C43 34 46 28 50 16 C58 27 54 44 40 60Z" fill="#f97316"/>
      {/* Mid flame */}
      <path d="M40 58 C30 44 28 32 34 22 C37 32 38.5 37 40 30 C41.5 37 43 32 46 22 C52 32 50 44 40 58Z" fill="#fbbf24"/>
      {/* Inner flame */}
      <path d="M40 56 C33 46 33 36 37 28 C38.5 36 39.5 40 40 35 C40.5 40 41.5 36 43 28 C47 36 47 46 40 56Z" fill="#fef08a"/>
      {/* Tip glow */}
      <ellipse cx="40" cy="26" rx="4" ry="6" fill="white" opacity="0.25"/>
      {/* Sparks */}
      <circle cx="26" cy="30" r="2.2" fill="#fbbf24" opacity="0.85"/>
      <circle cx="54" cy="24" r="1.8" fill="#f97316" opacity="0.75"/>
      <circle cx="32" cy="18" r="2.2" fill="#fef08a" opacity="0.7"/>
      <circle cx="48" cy="20" r="1.5" fill="#fbbf24" opacity="0.9"/>
      <circle cx="22" cy="40" r="1.5" fill="#f97316" opacity="0.6"/>
      <circle cx="58" cy="35" r="1.2" fill="#fbbf24" opacity="0.65"/>
    </svg>
  );
}
