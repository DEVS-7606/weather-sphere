declare module "react-globe.gl" {
  import type { Component, RefObject } from "react";

  interface GlobeProps {
    globeImageUrl?: string;
    bumpImageUrl?: string;
    backgroundImageUrl?: string;
    backgroundColor?: string;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    width?: number;
    height?: number;
    animateIn?: boolean;
    onGlobeClick?: (
      coords: { lat: number; lng: number },
      event: MouseEvent,
    ) => void;
    pointsData?: object[];
    pointLat?: string | ((d: any) => number);
    pointLng?: string | ((d: any) => number);
    pointColor?: string | ((d: any) => string);
    pointRadius?: number | ((d: any) => number);
    pointAltitude?: number | ((d: any) => number);
    pointsMerge?: boolean;
    [key: string]: any;
  }

  interface GlobeMethods {
    pointOfView: (
      pov: { lat?: number; lng?: number; altitude?: number },
      transitionMs?: number,
    ) => void;
    controls: () => any;
    scene: () => any;
    camera: () => any;
    renderer: () => any;
  }

  class GlobeGL extends Component<GlobeProps> {
    pointOfView: GlobeMethods["pointOfView"];
    controls: GlobeMethods["controls"];
    scene: GlobeMethods["scene"];
    camera: GlobeMethods["camera"];
    renderer: GlobeMethods["renderer"];
  }

  export default GlobeGL;
}
