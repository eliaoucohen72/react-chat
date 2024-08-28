import {CSSProperties} from "react";

export const getColorFromUsername = (username: string) => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 80%)`; // Une teinte en HSL
  return color;
};

export const css = (style: unknown) => style as CSSProperties
