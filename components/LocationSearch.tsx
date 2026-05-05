"use client";

import { useEffect, useRef, useState } from "react";
import { ensureMapsLoaded } from "@/lib/maps";
import type { LocationValue } from "@/lib/maps";

export type { LocationValue } from "@/lib/maps";

// Read directly in this "use client" file — same pattern as MapPinDrop.tsx
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

interface LocationSearchProps {
  value: LocationValue | null;
  onChange: (v: LocationValue | null) => void;
  placeholder?: string;
  notesValue: string;
  onNotesChange: (v: string) => void;
  notesPlaceholder?: string;
  mapHeight?: string;
}

const fieldStyle: React.CSSProperties = {
  background: "rgba(255,255,255,0.6)",
  border: "1px solid var(--glass-border)",
  borderRadius: "var(--radius-sm)",
  color: "var(--text-primary)",
  padding: "12px 16px",
  width: "100%",
  outline: "none",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "16px",
  minHeight: "48px",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  color: "var(--text-muted)",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "12px",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "8px",
};

export default function LocationSearch({
  value,
  onChange,
  placeholder = "Search for an address…",
  notesValue,
  onNotesChange,
  notesPlaceholder = "Floor, gate, landmark…",
  mapHeight = "260px",
}: LocationSearchProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapDivRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; });

  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [triggered, setTriggered] = useState(false);
  const [resolving, setResolving] = useState(false);

  // Lazy: trigger SDK load when the component enters the viewport
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setTriggered(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!triggered) return;
    if (!API_KEY) { setLoadError("Google Maps is not configured. Contact support."); return; }
    ensureMapsLoaded()
      .then(() => setSdkLoaded(true))
      .catch(() => setLoadError("Could not load maps. Check your connection and refresh."));
  }, [triggered]);

  // Attach Places Autocomplete once the SDK is ready
  useEffect(() => {
    if (!sdkLoaded || !inputRef.current) return;
    const ac = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ["geometry", "formatted_address"],
      componentRestrictions: { country: "ke" },
    });
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (!place.geometry?.location) return;
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const address = place.formatted_address ?? inputRef.current?.value ?? "";
      onChangeRef.current({ lat, lng, address });
    });
  }, [sdkLoaded]);

  // Initialise or update the map whenever a location is selected
  useEffect(() => {
    if (!sdkLoaded || !value || !mapDivRef.current) return;
    const pos = { lat: value.lat, lng: value.lng };

    if (!mapRef.current) {
      const map = new google.maps.Map(mapDivRef.current, {
        center: pos,
        zoom: 15,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });
      mapRef.current = map;

      const marker = new google.maps.Marker({
        position: pos,
        map,
        draggable: true,
        animation: google.maps.Animation.DROP,
      });
      markerRef.current = marker;

      marker.addListener("dragend", () => {
        const p = marker.getPosition();
        if (p) scheduleGeocode(p.lat(), p.lng());
      });

      map.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        marker.setPosition(e.latLng);
        scheduleGeocode(e.latLng.lat(), e.latLng.lng());
      });
    } else {
      // Map already exists — re-center for a new autocomplete selection
      markerRef.current?.setPosition(pos);
      mapRef.current.panTo(pos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkLoaded, !!value, value?.lat, value?.lng]);

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
      if (inputRef.current) inputRef.current.value = address;
      onChangeRef.current({ lat, lng, address });
    } catch {
      onChangeRef.current({ lat, lng, address: "" });
    } finally {
      setResolving(false);
    }
  };

  const handleClear = () => {
    if (inputRef.current) inputRef.current.value = "";
    mapRef.current = null;
    markerRef.current = null;
    onChangeRef.current(null);
  };

  const addressText = resolving ? "Resolving address…" : (value?.address ?? "");
  const showMap = !!value;

  return (
    <div ref={wrapRef}>
      {/* Search input */}
      <div style={{ position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          defaultValue={value?.address ?? ""}
          placeholder={!sdkLoaded && !loadError ? "Loading…" : placeholder}
          disabled={!!loadError}
          style={{
            ...fieldStyle,
            paddingRight: value ? "88px" : "16px",
          }}
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(122,92,56,0.08)",
              border: "1px solid rgba(122,92,56,0.2)",
              borderRadius: "999px",
              padding: "4px 12px",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "12px",
              fontWeight: 600,
              color: "var(--accent)",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Change
          </button>
        )}
      </div>

      {loadError && (
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "13px", color: "#c0392b", marginTop: "6px" }}>
          {loadError}
        </p>
      )}

      {/* Address pill + map — only shown after a location is selected */}
      {showMap && (
        <>
          {/* Address pill above map */}
          <div style={{
            marginTop: "10px",
            padding: "8px 14px",
            background: "rgba(122,92,56,0.06)",
            border: "1px solid rgba(122,92,56,0.15)",
            borderRadius: "999px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}>
            <span aria-hidden style={{ flexShrink: 0 }}>📍</span>
            <span style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "13px",
              color: resolving ? "var(--text-muted)" : "var(--text-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}>
              {addressText}
            </span>
          </div>

          {/* Compact map */}
          <div style={{ marginTop: "10px" }}>
            <div
              ref={mapDivRef}
              style={{
                width: "100%",
                height: mapHeight,
                maxHeight: "300px",
                borderRadius: "12px",
                border: "1px solid var(--glass-border)",
                overflow: "hidden",
              }}
            />
          </div>
        </>
      )}

      {/* Location notes — always visible, below map or below input */}
      <div style={{ marginTop: "12px" }}>
        <label style={labelStyle}>
          Location Notes{" "}
          <span style={{ opacity: 0.5, fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span>
        </label>
        <input
          value={notesValue}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder={notesPlaceholder}
          style={fieldStyle}
        />
      </div>
    </div>
  );
}
