import { useState, useCallback, useRef, useEffect } from "react";
import GlobeGL from "react-globe.gl";

interface GlobeViewProps {
  active: boolean;
  selectedLatitude: number | null;
  selectedLongitude: number | null;
  onLocationSelect: (latitude: number, longitude: number) => void;
}

interface PointData {
  lat: number;
  lng: number;
}

export default function GlobeView({
  active,
  selectedLatitude,
  selectedLongitude,
  onLocationSelect,
}: GlobeViewProps) {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [ready, setReady] = useState(false);

  // Measure container size — poll briefly since the CSS transition
  // animates width from 0 when globe becomes active
  useEffect(() => {
    let raf: number;
    let attempts = 0;

    const measure = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 100 && clientHeight > 100) {
          setDimensions({ width: clientWidth, height: clientHeight });
          setReady(true);
          return;
        }
      }
      attempts++;
      if (attempts < 60) {
        raf = requestAnimationFrame(measure);
      }
    };

    // Start measuring after a short delay to let CSS transition begin
    const timeout = setTimeout(() => {
      measure();
    }, 100);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Also listen for resize
  useEffect(() => {
    if (!ready) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 100 && height > 100) {
          setDimensions({
            width: Math.floor(width),
            height: Math.floor(height),
          });
        }
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [ready]);

  // Configure controls once globe is ready
  useEffect(() => {
    if (!ready || !globeRef.current) return;

    // Small delay to ensure the globe's internal Three.js scene is initialized
    const timeout = setTimeout(() => {
      const globe = globeRef.current;
      if (!globe) return;

      const controls = globe.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.4;
      }
      globe.pointOfView({ altitude: active ? 1.4 : 2.5 }, 800);
    }, 200);

    return () => clearTimeout(timeout);
  }, [ready, active]);

  // Fly to selected location
  useEffect(() => {
    if (
      selectedLatitude !== null &&
      selectedLongitude !== null &&
      globeRef.current &&
      ready
    ) {
      globeRef.current.pointOfView(
        { lat: selectedLatitude, lng: selectedLongitude, altitude: 1.8 },
        800,
      );
    }
  }, [selectedLatitude, selectedLongitude, ready]);

  const handleGlobeClick = useCallback(
    ({ lat, lng }: { lat: number; lng: number }) => {
      const controls = globeRef.current?.controls();
      if (controls) controls.autoRotate = false;
      onLocationSelect(lat, lng);
    },
    [onLocationSelect],
  );

  const pointsData: PointData[] =
    selectedLatitude !== null && selectedLongitude !== null
      ? [{ lat: selectedLatitude, lng: selectedLongitude }]
      : [];

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"} ${active ? "pointer-events-auto" : "pointer-events-none"}`}
      style={{ cursor: active ? "grab" : "default" }}
    >
      {ready && dimensions.width > 0 && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, #37c8ef08 0%, transparent 60%)",
            }}
          />
          <GlobeGL
            ref={globeRef}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
            backgroundImageUrl=""
            backgroundColor="rgba(0,0,0,0)"
            onGlobeClick={handleGlobeClick}
            pointsData={pointsData}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => "#4cd6fe"}
            pointRadius={0.5}
            pointAltitude={0.01}
            pointsMerge={false}
            atmosphereColor="#4cd6fe"
            atmosphereAltitude={0.18}
            width={dimensions.width}
            height={dimensions.height}
            animateIn={true}
          />
        </>
      )}
    </div>
  );
}
