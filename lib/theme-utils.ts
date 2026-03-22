// lib/theme-utils.ts
export function validateHexColor(color: string): string | null {
  const hexRegex = /^#[0-9A-Fa-f]{6}$/;
  return hexRegex.test(color) ? color : null;
}

// Convert hex to HSL, then format for CSS
export function processColorForCSS(hex: string): string {
  if (!validateHexColor(hex)) {
    return "hsl(220 90% 56%)"; // fallback blue
  }

  const hsl = hexToHSL(hex);
  return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`;
}

export function generateColorVariations(hex: string) {
  if (!validateHexColor(hex)) {
    return {
      light: "hsl(220 10% 95%)", // Very subtle light gray
      dark: "hsl(220 10% 10%)", // Subtle dark gray
    };
  }

  const hsl = hexToHSL(hex);

  return {
    light: `hsl(${hsl.h} 10% 95%)`, // Keep hue, desaturate, very light
    dark: `hsl(${hsl.h} 10% 10%)`, // Keep hue, desaturate, dark
  };
}

// Helper: Hex to HSL conversion
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (delta !== 0) {
    // Calculate saturation
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    // Calculate hue
    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / delta + 2) / 6;
        break;
      case b:
        h = ((r - g) / delta + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
