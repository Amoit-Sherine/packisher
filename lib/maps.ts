import { Loader } from "@googlemaps/js-api-loader";

export type LocationValue = {
  address: string;
  lat: number;
  lng: number;
};

let mapsPromise: Promise<void> | null = null;

export function ensureMapsLoaded(): Promise<void> {
  if (!mapsPromise) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });
    mapsPromise = loader.load().then(() => undefined);
  }
  return mapsPromise;
}
