export interface Place {
  name: string;
  province: string;
  description: string;
  rating: number;
  image_url?: string;
  subcategory?: string;
}

export interface PlaceCategory {
  id: string;
  label: string;
  emoji: string;
  places: Place[];
}

// --- Curated ---
// ============================================================
// PlaceTemplate ตัวอย่างสำหรับแต่ละหมวดหมู่
// ============================================================

export const NATURE_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'ภูเขา',
    nameTemplates: ['ภูเขา', 'ดอย', 'เขา'],
    descTemplates: ['จุดชมวิวธรรมชาติในจังหวัด{province}', 'ภูเขาสูงวิวสวยใน {province}']
  },
  {
    subcategory: 'น้ำตก',
    nameTemplates: ['น้ำตก'],
    descTemplates: ['น้ำตกยอดนิยมใน {province}', 'ธรรมชาติอุดมสมบูรณ์ที่ {province}']
  }
];

export const CULTURE_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'วัด',
    nameTemplates: ['วัด', 'พระธาตุ'],
    descTemplates: ['วัดสำคัญใน {province}', 'สถานที่ศักดิ์สิทธิ์ใน {province}']
  },
  {
    subcategory: 'พิพิธภัณฑ์',
    nameTemplates: ['พิพิธภัณฑ์'],
    descTemplates: ['แหล่งเรียนรู้ประวัติศาสตร์ใน {province}']
  }
];

export const CAFE_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'คาเฟ่',
    nameTemplates: ['คาเฟ่', 'ร้านกาแฟ'],
    descTemplates: ['คาเฟ่บรรยากาศดีใน {province}', 'ร้านกาแฟวิวสวยใน {province}']
  },
  {
    subcategory: 'ร้านอาหาร',
    nameTemplates: ['ร้านอาหาร', 'ร้านขนม'],
    descTemplates: ['ร้านอาหารแนะนำใน {province}', 'ร้านขนมยอดนิยมใน {province}']
  }
];

export const ADVENTURE_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'กิจกรรมกลางแจ้ง',
    nameTemplates: ['ปีนเขา', 'ล่องแก่ง', 'ดำน้ำ'],
    descTemplates: ['กิจกรรม Adventure ใน {province}', 'สถานที่ผจญภัยยอดนิยมใน {province}']
  }
];

export const LANDMARK_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'แลนด์มาร์ค',
    nameTemplates: ['แลนด์มาร์ค', 'จุดถ่ายรูป'],
    descTemplates: ['จุดถ่ายรูปยอดนิยมใน {province}', 'แลนด์มาร์คสำคัญของ {province}']
  }
];

export const SHOPPING_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'ตลาด',
    nameTemplates: ['ตลาด', 'ห้างสรรพสินค้า'],
    descTemplates: ['ตลาดดังใน {province}', 'แหล่งช้อปปิ้งใน {province}']
  }
];

export const WELLNESS_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'สปา',
    nameTemplates: ['สปา', 'รีสอร์ท'],
    descTemplates: ['สถานที่ผ่อนคลายใน {province}', 'สปายอดนิยมใน {province}']
  }
];

export const FAMILY_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'ครอบครัว',
    nameTemplates: ['สวนสนุก', 'พิพิธภัณฑ์เด็ก'],
    descTemplates: ['สถานที่เที่ยวสำหรับครอบครัวใน {province}', 'กิจกรรมสำหรับเด็กใน {province}']
  }
];

export const EVENT_TEMPLATES: PlaceTemplate[] = [
  {
    subcategory: 'เทศกาล',
    nameTemplates: ['เทศกาล', 'งานประเพณี'],
    descTemplates: ['เทศกาลสำคัญใน {province}', 'งานประเพณีใน {province}']
  }
];
const CURATED_NATURE: Place[] = [
  { name: "ดอยอินทนนท์", province: "เชียงใหม่", description: "ยอดเขาสูงสุดของไทย 2,565 เมตร มีพระมหาธาตุนภเมทนีดล", rating: 4.9, image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { name: "ภูชี้ฟ้า", province: "เชียงราย", description: "จุดชมวิวทะเลหมอกที่สวยที่สุดแห่งหนึ่ง", rating: 4.8, image_url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" },
  { name: "ภูกระดึง", province: "เลย", description: "ภูเขาหินทรายยอดตัด มีทุ่งหญ้าและน้ำตกสวย", rating: 4.8, image_url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" },
  { name: "อุทยานแห่งชาติเขาใหญ่", province: "นครราชสีมา", description: "มรดกโลก ป่าดิบหลากหลาย น้ำตกเหวนรก", rating: 4.9, image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" },
  { name: "เขาสก", province: "สุราษฎร์ธานี", description: "ป่าดิบชื้นเก่าแก่ที่สุดในโลก เขื่อนเชี่ยวหลาน", rating: 4.8, image_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80" },
  { name: "เกาะสิมิลัน", province: "พังงา", description: "หมู่เกาะสวรรค์ จุดดำน้ำที่ดีที่สุดในโลก", rating: 4.9, image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { name: "หาดไร่เลย์", province: "กระบี่", description: "หาดทรายขาวล้อมรอบด้วยหน้าผาหินปูน", rating: 4.9, image_url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80" },
  { name: "เกาะหลีเป๊ะ", province: "สตูล", description: "มัลดีฟส์เมืองไทย น้ำทะเลใสแจ๋ว", rating: 4.8, image_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80" },
  { name: "ภูทับเบิก", province: "เพชรบูรณ์", description: "ทุ่งกะหล่ำปลีบนยอดเขาสูง ทะเลหมอกสวย", rating: 4.7, image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" },
  { name: "ดอยแม่สลอง", province: "เชียงราย", description: "ดอยแห่งชาและซากุระ บรรยากาศหมู่บ้านจีนยูนนาน", rating: 4.7, image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { name: "ภูลมโล", province: "เลย", description: "ดอกนางพญาเสือโคร่งบาน ม.ค.-ก.พ. ซากุระเมืองไทย", rating: 4.7, image_url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" },
  { name: "เกาะพีพี", province: "กระบี่", description: "น้ำทะเลสีเทอร์ควอยซ์ มีอ่าวมาหยาชื่อดัง", rating: 4.8, image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { name: "เกาะเต่า", province: "สุราษฎร์ธานี", description: "สวรรค์ของนักดำน้ำ ปะการังสมบูรณ์", rating: 4.7, image_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80" },
  { name: "เกาะช้าง", province: "ตราด", description: "เกาะใหญ่อันดับ 2 ป่าเขาสลับหาดทราย", rating: 4.7, image_url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" },
  { name: "เขาค้อ", province: "เพชรบูรณ์", description: "สวิตเซอร์แลนด์เมืองไทย ทะเลหมอก ไร่สตรอว์เบอร์รี", rating: 4.7, image_url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80" },
  { name: "ภูหินร่องกล้า", province: "พิษณุโลก", description: "ลานหินปุ่ม ลานหินแตก ทุ่งดอกไม้บนยอดเขา", rating: 4.7, image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" },
  { name: "อ่าวพังงา", province: "พังงา", description: "อ่าวมหัศจรรย์ เขาหินปูนโผล่จากทะเล เกาะเจมส์บอนด์", rating: 4.8, image_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80" },
  { name: "เกาะสมุย", province: "สุราษฎร์ธานี", description: "เกาะหรู รีสอร์ทระดับโลก หาดละไม หาดเฉวง", rating: 4.7, image_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80" },
  { name: "หาดป่าตอง", province: "ภูเก็ต", description: "หาดชื่อดังระดับโลก ร้านค้าและไนท์ไลฟ์", rating: 4.6, image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { name: "เกาะกูด", province: "ตราด", description: "น้ำทะเลใสมาก หาดเงียบสงบ ธรรมชาติสมบูรณ์", rating: 4.7, image_url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" },
];

const CURATED_CULTURE: Place[] = [
  { name: "วัดพระแก้ว", province: "กรุงเทพมหานคร", description: "วัดที่สำคัญที่สุดในประเทศไทย พระพุทธมหามณีรัตนปฏิมากร", rating: 4.9, image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { name: "วัดอรุณราชวราราม", province: "กรุงเทพมหานคร", description: "พระปรางค์งดงามริมแม่น้ำเจ้าพระยา", rating: 4.8, image_url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" },
  { name: "วัดพระธาตุดอยสุเทพ", province: "เชียงใหม่", description: "วัดคู่เมืองเชียงใหม่ บนยอดดอยสุเทพ วิวเมืองสวยงาม", rating: 4.8, image_url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" },
  { name: "อุทยานประวัติศาสตร์สุโขทัย", province: "สุโขทัย", description: "มรดกโลก อดีตราชธานีแห่งแรกของไทย", rating: 4.8, image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" },
  { name: "อุทยานประวัติศาสตร์อยุธยา", province: "พระนครศรีอยุธยา", description: "มรดกโลก ซากวัดและวังโบราณอันงดงาม", rating: 4.8, image_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80" },
  { name: "ปราสาทหินพิมาย", province: "นครราชสีมา", description: "ปราสาทขอมที่ใหญ่ที่สุดในไทย สถาปัตยกรรมอันงดงาม", rating: 4.7, image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80" },
  { name: "ปราสาทเขาพนมรุ้ง", province: "บุรีรัมย์", description: "ปราสาทหินบนยอดภูเขาไฟ ประตูแสงอาทิตย์ตรงช่อง", rating: 4.8, image_url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80" },
  { name: "วัดร่องขุ่น", province: "เชียงราย", description: "วัดสีขาวสถาปัตยกรรมร่วมสมัย โดยอ.เฉลิมชัย", rating: 4.8, image_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80" },
  { name: "พระบรมมหาราชวัง", province: "กรุงเทพมหานคร", description: "พระราชวังอันโอ่อ่า ศิลปะสถาปัตยกรรมชั้นสูง", rating: 4.9, image_url: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80" },
  { name: "วัดพระธาตุพนม", province: "นครพนม", description: "พระธาตุศักดิ์สิทธิ์ประจำวันเกิดวันอาทิตย์", rating: 4.7, image_url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" },
];

const CURATED_CAFE: Place[] = [
  { name: "ไร่ชาฉุยฟง", province: "เชียงราย", description: "ไร่ชาวิวสวย คาเฟ่บนเขา ชาสดจากไร่", rating: 4.7, image_url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80" },
  { name: "บ้านข้างวัด", province: "เชียงใหม่", description: "คาเฟ่สไตล์ล้านนา กาแฟดริปจากดอย", rating: 4.6, image_url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { name: "The Brix", province: "เชียงใหม่", description: "คาเฟ่อินดัสเทรียล ริมแม่น้ำปิง", rating: 4.5, image_url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80" },
  { name: "ตลาดน้ำอัมพวา", province: "สมุทรสงคราม", description: "ตลาดน้ำยามเย็น อาหารทะเลสดจากเรือ", rating: 4.7, image_url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=600&q=80" },
  { name: "ครัวหลวงปู่มั่น", province: "สกลนคร", description: "ร้านอาหารอีสานแท้ บรรยากาศธรรมชาติ", rating: 4.5, image_url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" },
];


// --- Province List ---
export const PROVINCES = [
  'กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร','ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท','ชัยภูมิ','ชุมพร','เชียงราย','เชียงใหม่','ตรัง','ตราด','ตาก','นครนายก','นครปฐม','นครพนม','นครราชสีมา','นครศรีธรรมราช','นครสวรรค์','นนทบุรี','นราธิวาส','น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี','ประจวบคีรีขันธ์','ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา','พังงา','พัทลุง','พิจิตร','พิษณุโลก','เพชรบุรี','เพชรบูรณ์','แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน','ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง','ราชบุรี','ลพบุรี','ลำปาง','ลำพูน','เลย','ศรีสะเกษ','สกลนคร','สงขลา','สตูล','สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี','สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์','หนองคาย','หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี','อุตรดิตถ์','อุทัยธานี','อุบลราชธานี'
];

// --- Generator ---
function generatePlacesForCategory(
  base: Place[],
  category: string,
  templates: string[],
  descTemplates: string[],
  count: number
): Place[] {
  const places: Place[] = [...base];
  let i = 0;
  while (places.length < count) {
    const province = PROVINCES[i % PROVINCES.length];
    const name = templates[i % templates.length] + ' ' + province;
    const description = descTemplates[i % descTemplates.length].replace('{province}', province);
    const rating = Math.round((3.8 + Math.random() * 1.1) * 10) / 10;
    // หลีกเลี่ยงชื่อซ้ำกับ curated
    if (!places.some(p => p.name === name && p.province === province)) {
      places.push({ name, province, description, rating });
    }
    i++;
    if (i > count * 3) break; // safety
  }
  return places;
}

// เพิ่มสถานที่จาก PlaceTemplate ให้ครบทุกจังหวัด (ไม่ซ้ำกับที่มีอยู่แล้ว)
function addTemplatePlacesToCategory(categoryArr: Place[], templates: PlaceTemplate[], provinces: string[]) {
  const existingKeys = new Set(categoryArr.map(p => `${p.name}|${p.province}`));
  for (const t of templates) {
    for (const name of t.nameTemplates) {
      for (const desc of t.descTemplates) {
        for (const province of provinces) {
          const key = `${name}|${province}`;
          if (!existingKeys.has(key)) {
            categoryArr.push({
              name,
              province,
              description: desc,
              rating: Math.round((4 + Math.random() * 0.9) * 10) / 10,
              subcategory: t.subcategory,
            });
            existingKeys.add(key);
          }
        }
      }
    }
  }
}

export const categories: PlaceCategory[] = [
  {
    id: 'nature',
    label: 'ธรรมชาติ',
    emoji: '🌿',
    places: generatePlacesForCategory(
      CURATED_NATURE,
      'ธรรมชาติ',
      ['ภูเขา', 'น้ำตก', 'อุทยาน', 'หาด', 'ถ้ำ', 'ป่า', 'ทะเล', 'เกาะ', 'สวน', 'ลำธาร', 'บึง', 'อ่าว', 'ดอย', 'เขา', 'ทุ่ง', 'แหลม'],
      [
        'สถานที่ท่องเที่ยวธรรมชาติยอดนิยมในจังหวัด{province}',
        'จุดชมวิวธรรมชาติที่สวยงามใน {province}',
        'ธรรมชาติอุดมสมบูรณ์ เหมาะกับการพักผ่อนที่ {province}',
        'แหล่งท่องเที่ยวธรรมชาติที่ต้องไปเยือนใน {province}'
      ],
      1000
    )
  },
  {
    id: 'culture',
    label: 'วัฒนธรรม',
    emoji: '🏛️',
    places: generatePlacesForCategory(
      CURATED_CULTURE,
      'วัฒนธรรม',
      ['วัด', 'พระธาตุ', 'ศาลเจ้า', 'พิพิธภัณฑ์', 'โบราณสถาน', 'อุทยานประวัติศาสตร์', 'หอศิลป์', 'วัง', 'ปราสาท', 'หอสมุด'],
      [
        'สถานที่ท่องเที่ยววัฒนธรรมในจังหวัด{province}',
        'แหล่งเรียนรู้ประวัติศาสตร์และวัฒนธรรม {province}',
        'วัดและโบราณสถานสำคัญใน {province}',
        'ศิลปะและวัฒนธรรมท้องถิ่นของ {province}'
      ],
      1000
    )
  },
  {
    id: 'cafe',
    label: 'คาเฟ่ & ร้านอาหาร',
    emoji: '☕',
    places: generatePlacesForCategory(
      CURATED_CAFE,
      'คาเฟ่',
      ['คาเฟ่', 'ร้านกาแฟ', 'ร้านอาหาร', 'ร้านขนม', 'ร้านชา', 'ร้านเบเกอรี่', 'คาเฟ่วิวสวย', 'คาเฟ่ริมแม่น้ำ', 'คาเฟ่กลางสวน', 'คาเฟ่ในเมือง'],
      [
        'คาเฟ่และร้านอาหารแนะนำใน {province}',
        'ร้านกาแฟบรรยากาศดีใน {province}',
        'ร้านขนมและเบเกอรี่ยอดนิยมใน {province}',
        'คาเฟ่สวยน่านั่งใน {province}'
      ],
      1000
    )
  },
  { id: 'adventure', label: 'กิจกรรม & Adventure', emoji: '🧗', places: [] },
  { id: 'landmark', label: 'สายถ่ายรูป', emoji: '📸', places: [] },
  { id: 'shopping', label: 'ตลาด & ช้อปปิ้ง', emoji: '🛍️', places: [] },
  { id: 'wellness', label: 'ผ่อนคลาย', emoji: '🧘', places: [] },
  { id: 'family', label: 'ครอบครัว', emoji: '👨‍👩‍👧‍👦', places: [] },
  { id: 'event', label: 'อีเวนต์ & เทศกาล', emoji: '🎉', places: [] },
];

addTemplatePlacesToCategory(categories.find(c => c.id === 'nature')!.places, NATURE_TEMPLATES, PROVINCES);
addTemplatePlacesToCategory(categories.find(c => c.id === 'culture')!.places, CULTURE_TEMPLATES, PROVINCES);
addTemplatePlacesToCategory(categories.find(c => c.id === 'cafe')!.places, CAFE_TEMPLATES, PROVINCES);
addTemplatePlacesToCategory(categories.find(c => c.id === 'adventure')!.places, ADVENTURE_TEMPLATES, PROVINCES);
addTemplatePlacesToCategory(categories.find(c => c.id === 'landmark')!.places, LANDMARK_TEMPLATES, PROVINCES);
addTemplatePlacesToCategory(categories.find(c => c.id === 'shopping')!.places, SHOPPING_TEMPLATES, PROVINCES);
addTemplatePlacesToCategory(categories.find(c => c.id === 'wellness')!.places, WELLNESS_TEMPLATES, PROVINCES);
addTemplatePlacesToCategory(categories.find(c => c.id === 'family')!.places, FAMILY_TEMPLATES, PROVINCES);
addTemplatePlacesToCategory(categories.find(c => c.id === 'event')!.places, EVENT_TEMPLATES, PROVINCES);

// ============================================================
// Place name templates per category
// ============================================================
export interface PlaceTemplate {
  subcategory: string;
  nameTemplates: string[];
  descTemplates: string[];
}
