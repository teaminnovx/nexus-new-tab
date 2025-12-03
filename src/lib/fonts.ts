// Font loading utility for Google Fonts

export const fontOptions = {
  sans: [
    { name: 'Inter', value: 'Inter' },
    { name: 'Poppins', value: 'Poppins' },
    { name: 'Manrope', value: 'Manrope' },
    { name: 'Space Grotesk', value: 'Space Grotesk' },
    { name: 'DM Sans', value: 'DM Sans' },
    { name: 'JetBrains Mono', value: 'JetBrains Mono' },
  ],
  serif: [
    { name: 'Playfair Display', value: 'Playfair Display' },
    { name: 'Merriweather', value: 'Merriweather' },
    { name: 'Lora', value: 'Lora' },
  ],
  mono: [
    { name: 'JetBrains Mono', value: 'JetBrains Mono' },
    { name: 'Fira Code', value: 'Fira Code' },
    { name: 'IBM Plex Mono', value: 'IBM Plex Mono' },
  ],
};

export const allFonts = [...fontOptions.sans, ...fontOptions.serif, ...fontOptions.mono];

const loadedFonts = new Set<string>();

export function loadGoogleFont(fontName: string): Promise<void> {
  if (loadedFonts.has(fontName)) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const formattedName = fontName.replace(/ /g, '+');
    const weights = '300;400;500;600;700';
    const url = `https://fonts.googleapis.com/css2?family=${formattedName}:wght@${weights}&display=swap`;

    // Check if already loaded
    const existingLink = document.querySelector(`link[href*="${formattedName}"]`);
    if (existingLink) {
      loadedFonts.add(fontName);
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    
    link.onload = () => {
      loadedFonts.add(fontName);
      resolve();
    };
    
    link.onerror = () => {
      reject(new Error(`Failed to load font: ${fontName}`));
    };

    document.head.appendChild(link);
  });
}

export async function loadFonts(fonts: string[]): Promise<void> {
  const promises = fonts.map((font) => loadGoogleFont(font).catch(console.error));
  await Promise.all(promises);
}

export function applyFontSettings(settings: {
  headingFont: string;
  bodyFont: string;
  monoFont: string;
  scale: 'small' | 'medium' | 'large';
  weight: 'light' | 'regular' | 'medium' | 'bold';
}): void {
  const root = document.documentElement;
  
  // Apply fonts
  root.style.setProperty('--font-heading', `'${settings.headingFont}', sans-serif`);
  root.style.setProperty('--font-body', `'${settings.bodyFont}', sans-serif`);
  root.style.setProperty('--font-mono', `'${settings.monoFont}', monospace`);
  
  // Apply scale
  const scales = { small: 0.875, medium: 1, large: 1.125 };
  root.style.setProperty('--font-scale', scales[settings.scale].toString());
  
  // Apply weight to body
  const weights = { light: '300', regular: '400', medium: '500', bold: '600' };
  root.style.setProperty('font-weight', weights[settings.weight]);
}

// Load default fonts on init
export async function initFonts(): Promise<void> {
  await loadFonts(['Inter', 'Space Grotesk', 'JetBrains Mono']);
}
