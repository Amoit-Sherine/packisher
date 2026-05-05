import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export type LocationValue = {
  address: string;
  lat: number;
  lng: number;
};

// Singleton — loads maps + geocoding + places once for the whole session
let mapsPromise: Promise<void> | null = null;

export function ensureMapsLoaded(): Promise<void> {
  if (!mapsPromise) {
    // Read inside the function so it resolves in the client bundle context
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
    mapsPromise = (async () => {
      setOptions({ key: apiKey, v: "weekly" });
      await importLibrary("maps");
      await importLibrary("geocoding");
      await importLibrary("places");
    })();
  }
  return mapsPromise;
}
