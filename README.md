README.md — Easy Thai Trip
Easy Thai Trip 🇹🇭✈️

Easy Thai Trip เป็นแอปพลิเคชันสำหรับช่วยวางแผนการท่องเที่ยวในประเทศไทย โดยผู้ใช้สามารถเลือกจังหวัด สถานที่ท่องเที่ยว และจัดแผนการเดินทางได้อย่างง่ายดายผ่านอินเทอร์เฟซที่ใช้งานสะดวก

ระบบถูกพัฒนาเพื่อช่วยให้การวางแผนทริปเป็นเรื่องง่ายขึ้น ลดเวลาในการค้นหาข้อมูลจากหลายแหล่ง และช่วยให้ผู้ใช้สามารถจัดการแผนการเดินทางได้ในที่เดียว

✨ Features
🗺️ ค้นหาสถานที่ท่องเที่ยว

ผู้ใช้สามารถค้นหาสถานที่ท่องเที่ยวจากจังหวัดต่าง ๆ ของประเทศไทย

📍 เลือกสถานที่ตามหมวดหมู่

ระบบแบ่งหมวดหมู่สถานที่ เช่น

ธรรมชาติ

วัด

จุดชมวิว

ทะเล

คาเฟ่

สถานที่ยอดนิยม

🎡 วงล้อสุ่มจังหวัด

ฟีเจอร์สุ่มจังหวัดเพื่อช่วยผู้ใช้ที่ยังไม่รู้ว่าจะไปเที่ยวที่ไหนดี

📅 สร้างแผนการเดินทาง (Trip Planner)

ผู้ใช้สามารถ

เพิ่มสถานที่ลงในแผน

จัดลำดับสถานที่

แบ่งแผนตามวัน

🔎 ระบบค้นหาสถานที่

สามารถค้นหาสถานที่จากชื่อจังหวัดหรือชื่อสถานที่ได้

🖥️ Technology Stack
Frontend

React Native

Expo

TypeScript

UI / Design

React Native Components

Ionicons

Custom Styles

Data

JSON Dataset (สถานที่ท่องเที่ยวและจังหวัด)

Tools

GitHub (Version Control)

Visual Studio Code

🏗️ System Architecture

โครงสร้างระบบแบ่งออกเป็น 3 ส่วนหลัก

1️⃣ User Interface (Frontend)

ส่วนติดต่อผู้ใช้สำหรับ

ค้นหาสถานที่

เลือกจังหวัด

วางแผนทริป

พัฒนาด้วย React Native + Expo

2️⃣ Data Layer

เก็บข้อมูลสถานที่ท่องเที่ยวในรูปแบบ JSON

ตัวอย่างข้อมูล

จังหวัด

ชื่อสถานที่

หมวดหมู่

รายละเอียด

3️⃣ Trip Planning Logic

ระบบจัดการ

การเพิ่มสถานที่ในทริป

การจัดลำดับสถานที่

การแสดงแผนตามวัน

📂 Project Structure
easy-thai-trip
│
├── app
│   ├── home.tsx
│   ├── trip
│   │   └── [id].tsx
│   └── create-trip.tsx
│
├── components
│   ├── ProvinceWheel.tsx
│   ├── PlaceCard.tsx
│
├── data
│   ├── places.ts
│   └── provinces.ts
│
├── assets
│
└── README.md
🚀 Installation
1️⃣ Clone repository
git clone https://github.com/HERNBERN/easy-thai-trip-Public.git
2️⃣ Install dependencies
npm install
3️⃣ Run project
npx expo start
🎯 Objectives

เพื่อพัฒนาแอปพลิเคชันสำหรับช่วยวางแผนการท่องเที่ยวในประเทศไทย

เพื่อให้ผู้ใช้สามารถค้นหาสถานที่ท่องเที่ยวได้ง่ายและรวดเร็ว

เพื่อช่วยให้ผู้ใช้สามารถสร้างแผนการเดินทางได้ในแอปเดียว

เพื่อฝึกทักษะการพัฒนาแอปด้วย React Native และ TypeScript
