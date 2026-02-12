import { useEffect } from "react";
import { Vibrant } from "node-vibrant/browser";

export function usePalette(
  imagePath: string = "/legacy-images/icono%20da%20API.png",
): void {
  useEffect(() => {
    const url: string = imagePath;
    Vibrant.from(url)
      .getPalette()
      .then((palette) => {
        const vibr: string = palette.Vibrant?.hex || "#2563eb";
        const muted: string = palette.Muted?.hex || "#6b7280";
        const dark: string = palette.DarkMuted?.hex || "#111827";
        const light: string = palette.LightMuted?.hex || "#ffffff";

        const root: CSSStyleDeclaration = document.documentElement.style;
        root.setProperty("--color-primary", vibr);
        root.setProperty("--color-muted", muted);
        root.setProperty("--color-text", dark);
        root.setProperty("--color-bg", light);
        // borda: mistura leve entre texto e bg
        root.setProperty("--color-border", "#e5e7eb");
      })
      .catch(() => {
        // Fallbacks já estão em theme.css
      });
  }, [imagePath]);
}
