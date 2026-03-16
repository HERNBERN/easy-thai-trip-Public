ติดตั้งไลบรารี date picker ก่อนใช้งาน:
- แนะนำ: @react-native-community/datetimepicker (expo รองรับ)
- ติดตั้ง: npm install @react-native-community/datetimepicker

จากนั้นนำเข้าและใช้ <DateTimePicker /> ในฟอร์มเลือกวันไป-กลับ

ตัวอย่างการใช้งานใน React Native:
import DateTimePicker from '@react-native-community/datetimepicker';

<DateTimePicker
  value={new Date()}
  mode="date"
  display="default"
  onChange={(event, date) => { /* setState(date) */ }}
/>

ในไฟล์ create-trip.tsx ให้แทนที่ <TextInput> ของวันเริ่มต้น/สิ้นสุด ด้วยปุ่มที่เปิด DateTimePicker popup แล้ว setStartDate/setEndDate ตามวันที่เลือก

ถ้าต้องการให้ช่วยแก้ไขโค้ดและติดตั้งไลบรารี แจ้งได้เลย!