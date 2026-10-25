import { Palette as MPalette, PaletteOptions as MPaletteOptions } from '@suid/material';

type P = MPalette['primary'];
type PO = MPaletteOptions['primary'];

declare module "@suid/material/styles" {
  interface Palette {
    stage1: P;
    stage2: P;
    knockout: P;
    mixed: P;
    ladies: P;
    board: P;
    tertiary: P;
  }
  interface PaletteOptions {
    stage1?: PO;
    stage2?: PO;
    knockout?: PO;
    mixed?: PO;
    ladies?: PO;
    board?: PO;
    tertiary?: PO;
  }
}

declare module '@suid/material/Chip' {
  interface ChipPropsColorOverrides {
    stage1: true;
    stage2: true;
    knockout: true;
    mixed: true;
    ladies: true;
    board: true;
    tertiary: true;
  }
}

declare module '@suid/material/Button' {
  interface ButtonPropsColorOverrides {
    stage1: true;
    stage2: true;
    knockout: true;
    mixed: true;
    ladies: true;
    board: true;
    tertiary: true;
  }
}
