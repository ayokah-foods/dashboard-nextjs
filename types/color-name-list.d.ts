declare module 'color-name-list' {
  export interface ColorEntry {
    name: string;
    hex: string;
  }

  export const colornames: ColorEntry[];
}
