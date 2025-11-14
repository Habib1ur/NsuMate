// Fallback JSX typing so TypeScript recognizes JSX tags
// even if React ambient types are not picked up correctly
// by the editor or build tooling.

declare namespace JSX {
  // Allow any intrinsic element (div, span, etc.)
  // without TypeScript errors about missing JSX.IntrinsicElements.
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

