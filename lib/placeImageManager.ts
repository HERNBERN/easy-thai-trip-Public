// placeImageManager.ts
// จัดการการดึงภาพจาก Google Place Photo API และ mapping ชื่อสถานที่

import AsyncStorage from '@react-native-async-storage/async-storage';

const GOOGLE_API_KEY = 'AIzaSyC3RzxkPBJybASXf2Y-zWLYu5NQ-J-m5_U';
const PLACE_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json';
const PLACE_DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const PLACE_PHOTO_URL = 'https://maps.googleapis.com/maps/api/place/photo';

// Manual mapping สำหรับสถานที่ยอดนิยม
const manualPlaceMapping: Record<string, string> = {
  'วัดพระแก้ว': 'Wat Phra Kaew',
  'วัดอรุณ': 'Wat Arun',
  'ตลาดน้ำดำเนินสะดวก': 'Damnoen Saduak Floating Market',
  // เพิ่มชื่ออื่นๆตามต้องการ
};

// ค้นหา place_id จากชื่อสถานที่
export async function findPlaceId(placeName: string, province?: string): Promise<string | null> {
  try {
    // ใช้ manual mapping ถ้ามี
    const mappedName = manualPlaceMapping[placeName] || placeName;
    const query = province ? `${mappedName} ${province} ประเทศไทย` : `${mappedName} ประเทศไทย`;
    const url = `${PLACE_SEARCH_URL}?input=${encodeURIComponent(query)}&inputtype=textquery&fields=place_id&key=${GOOGLE_API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.candidates && data.candidates.length > 0) {
      return data.candidates[0].place_id;
    }
    return null;
  } catch (err) {
    debugLog('findPlaceId error', err);
    return null;
  }
}

// ดึง url รูปภาพจาก place_id
export async function getPlacePhotoUrl(placeId: string, maxWidth = 400): Promise<string | null> {
  try {
    const detailsUrl = `${PLACE_DETAILS_URL}?place_id=${placeId}&fields=photo&key=${GOOGLE_API_KEY}`;
    const res = await fetch(detailsUrl);
    const data = await res.json();
    if (data.result && data.result.photos && data.result.photos.length > 0) {
      const photoRef = data.result.photos[0].photo_reference;
      return `${PLACE_PHOTO_URL}?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;
    }
    return null;
  } catch (err) {
    debugLog('getPlacePhotoUrl error', err);
    return null;
  }
}

// Cache place_id และ url รูป
export async function cachePlaceImage(placeName: string, province: string, placeId: string, photoUrl: string) {
  const key = `placeimg:${placeName}:${province}`;
  await AsyncStorage.setItem(key, JSON.stringify({ placeId, photoUrl }));
}

export async function getCachedPlaceImage(placeName: string, province: string): Promise<{ placeId: string, photoUrl: string } | null> {
  const key = `placeimg:${placeName}:${province}`;
  const val = await AsyncStorage.getItem(key);
  if (val) return JSON.parse(val);
  return null;
}

// Fallback logic
export function getFallbackImage(image_url?: string): string {
  if (image_url) return image_url;
  // สามารถเพิ่ม icon หรือ default image url
  return 'https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/geocode-71.png';
}

// Debug log/error handler
export function debugLog(...args: any[]) {
  if (__DEV__) {
    console.log('[PlaceImageManager]', ...args);
  }
}
