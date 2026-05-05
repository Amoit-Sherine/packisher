"use client";

import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export type LocationValue = {
  address: string;
  lat: number;
  lng: number;
};

interface MapPinDropProps {
  defaultCenter: { lat: number; lng: number };
  defaultZoom?: number;
  value: LocationValue | null;
  onChange: (v: LocationValue | null) => void;
  bounds?: {
    sw: { lat: number; lng: number };
    ne: { lat: number; lng: number };
  };
  outOfBoundsMessage?: string;
  height?: string;
}

// Restrict this key to packisher.com/* in Google Cloud Console → Credentials
// Also add localhost:3000/* to allowed referrers for local dev
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// Singleton promise — all MapPinDrop instances share one SDK load
let sdkPromise: Promise<void> | null = null;
function ensureMapsLoaded(): Promise<void> {
  if (!sdkPromise) {
    sdkPromise = (async () => {
      setOptions({ key: API_KEY, v: "weekly" });
      await importLibrary("maps");
      await importLibrary("geocoding");
    })();
  }
  return sdkPromise;
}

export default function MapPinDrop({
  defaultCenter,
  defaultZoom = 13,
  value,
  onChange,
  bounds,
  outOfBoundsMessage = "Location is outside the service area.",
  height = "280px",
}: MapPinDropProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [outOfBounds, setOutOfBounds] = useState(false);
  const [triggered, setTriggered] = useState(false);

  // Lazy: only start loading when the component enters the viewport
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setTriggered(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); }
      },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Load the Maps SDK once triggered
  useEffect(() => {
    if (!triggered) return;
    if (!API_KEY) { setLoadError("Google Maps is not configured. Contact support."); return; }
    ensureMapsLoaded()
      .then(() => setSdkLoaded(true))
      .catch(() => setLoadError("Map could not load. Check your connection and refresh."));
  }, [triggered]);

  // Initialise the map once the SDK is ready
  useEffect(() => {
    if (!sdkLoaded || !mapDivRef.current || mapRef.current) return;

    const center = value ? { lat: value.lat, lng: value.lng } : defaultCenter;

    const map = new google.maps.Map(mapDivRef.current, {
      center,
      zoom: defaultZoom,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
      ...(bounds && {
        restriction: {
          latLngBounds: {
            south: bounds.sw.lat,
            west: bounds.sw.lng,
            north: bounds.ne.lat,
            east: bounds.ne.lng,
          },
          strictBounds: false,
        },
      }),
    });
    mapRef.current = map;

    const marker = new google.maps.Marker({
      position: center,
      map,
      draggable: true,
      animation: google.maps.Animation.DROP,
    });
    markerRef.current = marker;

    // Auto-geocode the initial pin position
    scheduleGeocode(center.lat, center.lng);

    const handlePosition = (pos: google.maps.LatLng) => {
      const lat = pos.lat();
      const lng = pos.lng();
      if (bounds) {
        const inside =
          lat >= bounds.sw.lat && lat <= bounds.ne.lat &&
          lng >= bounds.sw.lng && lng <= bounds.ne.lng;
        if (!inside) {
          setOutOfBounds(true);
          onChangeRef.current(null);
          return;
        }
      }
      setOutOfBounds(false);
      scheduleGeocode(lat, lng);
    };

    marker.addListener("dragend", () => {
      const pos = marker.getPosition();
      if (pos) handlePosition(pos);
    });

    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      marker.setPosition(e.latLng);
      handlePosition(e.latLng);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkLoaded]);

  // Debounced reverse geocode — fires 500ms after the user stops dragging
  const scheduleGeocode = (lat: number, lng: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setResolving(true);
    timerRef.current = setTimeout(() => void doGeocode(lat, lng), 500);
  };

  const doGeocode = async (lat: number, lng: number) => {
    try {
      const geocoder = new google.maps.Geocoder();
      const res = await geocoder.geocode({ location: { lat, lng } });
      const address = res.results[0]?.formatted_address ?? "";
      onChangeRef.current({ lat, lng, address });
    } catch {
      onChangeRef.current({ lat, lng, address: "" });
    } finally {
      setResolving(false);
    }
  };

  const addressText = resolving
    ? "Resolving address…"
    : value?.address || "Drag the pin or tap the map to set location";

  return (
    <div ref={wrapRef}>
      {/* Map container with loading/error overlay */}
      <div style={{ position: "relative" }}>
        <div
          ref={mapDivRef}
          style={{
            width: "100%",
            height,
            borderRadius: "12px",
            border: "1px solid var(--glass-border)",
            overflow: "hidden",
          }}
        />
        {!sdkLoaded && !loadError && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(245,242,236,0.82)",
            borderRadius: "12px",
          }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "var(--text-muted)" }}>
              Loading map…
            </span>
          </div>
        )}
        {loadError && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(245,242,236,0.82)",
            borderRadius: "12px",
          }}>
            <span style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "#c0392b", padding: "0 20px", textAlign: "center" }}>
              {loadError}
            </span>
          </div>
        )}
      </div>

      {outOfBounds && (
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "var(--text-muted)", marginTop: "8px" }}>
          {outOfBoundsMessage}
        </p>
      )}

      {/* Address pill — shows human-readable address only, never raw coordinates */}
      <div style={{
        marginTop: "10px",
        padding: "10px 14px",
        background: "rgba(122,92,56,0.06)",
        border: "1px solid rgba(122,92,56,0.15)",
        borderRadius: "999px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        minHeight: "40px",
      }}>
        <span aria-hidden style={{ flexShrink: 0 }}>📍</span>
        <span style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "13px",
          color: (resolving || !value?.address) ? "var(--text-muted)" : "var(--text-primary)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          flex: 1,
        }}>
          {addressText}
        </span>
      </div>
    </div>
  );
}
