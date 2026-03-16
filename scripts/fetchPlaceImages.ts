import fs from "fs";
import fetch from "node-fetch";

const API_KEY = "AIzaSyC3RzxkPBJybASXf2Y-zWLYu5NQ-J-m5_U";

async function getImage(placeName: string, province: string) {
  const searchUrl =
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json` +
    `?input=${encodeURIComponent(placeName + " " + province + " Thailand")}` +
    `&inputtype=textquery` +
    `&fields=place_id` +
    `&key=${API_KEY}`;

  const searchRes = await fetch(searchUrl);
  const searchData: any = await searchRes.json();

  const placeId = searchData.candidates?.[0]?.place_id;
  if (!placeId) return null;

  const detailsUrl =
    `https://maps.googleapis.com/maps/api/place/details/json` +
    `?place_id=${placeId}` +
    `&fields=photos` +
    `&key=${API_KEY}`;

  const detailRes = await fetch(detailsUrl);
  const detailData: any = await detailRes.json();

  const photoRef = detailData.result?.photos?.[0]?.photo_reference;
  if (!photoRef) return null;

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${API_KEY}`;
}

async function run() {
  const places = JSON.parse(fs.readFileSync("./places.json", "utf8"));

  for (const place of places) {
    console.log("Fetching:", place.name);

    const image = await getImage(place.name, place.province);
    place.image_url = image;

    await new Promise((r) => setTimeout(r, 200)); // กัน rate limit
  }

  fs.writeFileSync(
    "./places_with_images.json",
    JSON.stringify(places, null, 2)
  );

  console.log("Done!");
}

run();