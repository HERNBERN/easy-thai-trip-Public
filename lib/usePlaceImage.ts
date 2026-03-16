import { useEffect, useState } from "react";

interface PlaceParams {
  name: string;
  province?: string;
}

interface ImageResult {
  uri: string | null;
  loading: boolean;
  error: boolean;
}

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY || "AIzaSyC3RzxkPBJybASXf2Y-zWLYu5NQ-J-m5_U";

// memory cache
const imageCache: Record<string, string> = {};

// dataset cache
let dataset: Record<string, string> | null = null;

async function loadDataset() {
  if (dataset) return dataset;

  try {
    const res = await fetch(
      "https://your-cdn.com/places_dataset_images.json"
    );
    dataset = await res.json();
  } catch {
    dataset = {};
  }

  return dataset;
}

async function fetchGoogleImage(name: string, province?: string) {

  const query = encodeURIComponent(`${name} ${province || ""} Thailand`);

  const searchUrl =
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
    `?input=${query}` +
    `&inputtype=textquery` +
    `&fields=place_id` +
    `&key=${GOOGLE_API_KEY}`;

  const searchRes = await fetch(searchUrl);
  const searchData: any = await searchRes.json();

  const placeId = searchData?.candidates?.[0]?.place_id;

  if (!placeId) return null;

  const detailsUrl =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}` +
    `&fields=photos` +
    `&key=${GOOGLE_API_KEY}`;

  const detailRes = await fetch(detailsUrl);
  const detailData: any = await detailRes.json();

  const photoRef = detailData?.result?.photos?.[0]?.photo_reference;

  if (!photoRef) return null;

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;
}

export default function usePlaceImage({
  name,
  province,
}: PlaceParams): ImageResult {

  const [uri, setUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {

    let active = true;

    async function load() {

      const key = `${name}_${province || ""}`.toLowerCase();

      try {

        // cache
        if (imageCache[key]) {
          if (active) {
            setUri(imageCache[key]);
            setLoading(false);
          }
          return;
        }

        // dataset
        const data = await loadDataset();

        if (data && data[key]) {

          imageCache[key] = data[key];

          if (active) {
            setUri(data[key]);
            setLoading(false);
          }

          return;
        }

        // Google API
        const image = await fetchGoogleImage(name, province);

        if (image) {

          imageCache[key] = image;

          if (active) {
            setUri(image);
          }

        } else {
          setError(true);
        }

      } catch {

        setError(true);

      } finally {

        if (active) {
          setLoading(false);
        }

      }

    }

    load();

    return () => {
      active = false;
    };

  }, [name, province]);

  return { uri, loading, error };

}