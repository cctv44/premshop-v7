"use client";

interface ProductLogoProps {
  name: string;
  color: string;
  bgColor: string;
  size?: "sm" | "md" | "lg";
}

// SVG logos for streaming services
const logos: Record<string, (color: string) => string> = {
  netflix: () => `<svg viewBox="0 0 111 190" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h30l30 90L90 0h21v190H90V90L60 180H30L0 90V190H0V0z" fill="#E50914"/></svg>`,
  disney: (color) => `<svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="5" y="40" font-size="36" font-weight="900" fill="${color}" font-family="serif" font-style="italic">D+</text></svg>`,
  spotify: () => `<svg viewBox="0 0 168 168" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="84" cy="84" r="84" fill="#1DB954"/><path d="M120 115c-2 0-3-1-5-2-28-17-64-21-96-12-2 0-5-1-6-4-1-3 1-5 4-6 35-10 74-5 105 13 2 2 3 5 2 7-1 2-3 4-4 4zm10-26c-2 0-4-1-5-2-32-20-80-25-117-14-3 0-5-1-6-4-1-3 1-5 4-6 40-12 91-7 126 16 3 2 4 5 3 8-1 2-3 4-5 2zm11-27c-1 0-3 0-4-1-36-21-95-23-130-13-3 1-6-1-7-4-1-3 1-6 4-7 38-11 100-9 140 15 3 2 4 5 3 8-1 2-3 2-6 2z" fill="white"/></svg>`,
  youtube: () => `<svg viewBox="0 0 228 160" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="228" height="160" rx="36" fill="#FF0000"/><path d="M91 48l74 32-74 32V48z" fill="white"/></svg>`,
  prime: (color) => `<svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="2" y="32" font-size="13" font-weight="700" fill="${color}" font-family="sans-serif">prime</text><text x="2" y="48" font-size="10" font-weight="400" fill="${color}" font-family="sans-serif">video</text></svg>`,
  hbo: (color) => `<svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="2" y="32" font-size="28" font-weight="900" fill="${color}" font-family="sans-serif">HBO</text><text x="76" y="32" font-size="16" font-weight="700" fill="${color}" font-family="sans-serif">Max</text></svg>`,
  viu: (color) => `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="2" y="32" font-size="30" font-weight="900" fill="${color}" font-family="sans-serif">VIU</text></svg>`,
  appletv: (color) => `<svg viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="2" y="32" font-size="15" font-weight="700" fill="${color}" font-family="sans-serif">Apple TV+</text></svg>`,
};

export function ProductLogo({ name, color, bgColor, size = "md" }: ProductLogoProps) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const nameLower = name.toLowerCase();
  let logoKey = "netflix";
  if (nameLower.includes("disney")) logoKey = "disney";
  else if (nameLower.includes("spotify")) logoKey = "spotify";
  else if (nameLower.includes("youtube")) logoKey = "youtube";
  else if (nameLower.includes("prime")) logoKey = "prime";
  else if (nameLower.includes("hbo")) logoKey = "hbo";
  else if (nameLower.includes("viu")) logoKey = "viu";
  else if (nameLower.includes("apple")) logoKey = "appletv";

  const logoFn = logos[logoKey];
  const svg = logoFn ? logoFn(color) : `<svg viewBox="0 0 40 40"><text x="5" y="28" font-size="20" fill="${color}">${name[0]}</text></svg>`;

  return (
    <div
      className={`${sizes[size]} rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0`}
      style={{ background: bgColor }}
    >
      <div
        className="w-3/4 h-3/4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
