// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = claimsData.claims.sub;

    const { province, startDate, endDate, travelStyle, budget, specialRequest } = await req.json();

    // Calculate days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const numDays = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const styleMap: Record<string, string> = {
      nature: "ธรรมชาติ ภูเขา น้ำตก ทะเล",
      culture: "วัฒนธรรม วัด พิพิธภัณฑ์ ประวัติศาสตร์",
      adventure: "ผจญภัย เดินป่า ดำน้ำ ปีนเขา",
      relaxation: "พักผ่อน สปา รีสอร์ท",
      food: "อาหาร ตลาด ร้านอาหาร คาเฟ่",
      shopping: "ช้อปปิ้ง ตลาดนัด ห้าง ของฝาก",
    };

    const budgetMap: Record<string, string> = {
      budget: "ประหยัด (< 1,000 บาท/วัน)",
      moderate: "ปานกลาง (1,000-3,000 บาท/วัน)",
      premium: "พรีเมียม (3,000-5,000 บาท/วัน)",
      luxury: "หรูหรา (> 5,000 บาท/วัน)",
    };

    const prompt = `คุณเป็น AI วางแผนท่องเที่ยวในประเทศไทย\n\nสร้างแผนการเดินทางสำหรับ:\n- จังหวัด: ${province}\n- จำนวนวัน: ${numDays} วัน (${startDate} ถึง ${endDate})\n- สไตล์: ${styleMap[travelStyle] || travelStyle}\n- งบประมาณ: ${budgetMap[budget] || budget}\n${specialRequest ? `- คำขอพิเศษ: ${specialRequest}` : ""}\n\nกฎ:\n- สูงสุด 4 กิจกรรม/วัน\n- เช้า: กิจกรรมกลางแจ้ง/ธรรมชาติ\n- กลางวัน: ร้านอาหาร\n- บ่าย: คาเฟ่/กิจกรรม\n- เย็น: ชมวิว/ตลาด\n- หลีกเลี่ยงการเดินทางไป-กลับไกล\n- ใช้สถานที่จริงที่มีอยู่ในจังหวัดนั้น\n\nตอบเป็น JSON เท่านั้น ในรูปแบบ:\n{\n  \"summary\": \"สรุปทริปสั้นๆ\",\n  \"days\": [\n    {\n      \"day_number\": 1,\n      \"activities\": [\n        {\n          \"place_name\": \"ชื่อสถานที่จริง\",\n          \"start_time\": \"09:00\",\n          \"end_time\": \"11:00\",\n          \"category\": \"tourist_attraction|cafe|restaurant|nature|shopping\",\n          \"travel_time_minutes\": 15\n        }\n      ]\n    }\n  ]\n}`;

    // Call AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a Thailand travel planning AI. Always respond with valid JSON only. No markdown, no code fences." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "AI rate limit exceeded, please try again later" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI request failed");
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const itinerary = JSON.parse(content);

    // Save trip
    const { data: tripData, error: tripError } = await supabase
      .from("trips")
      .insert({
        user_id: userId,
        province,
        start_date: startDate,
        end_date: endDate,
        travel_style: travelStyle,
        budget,
        special_request: specialRequest || null,
        ai_summary: itinerary.summary || null,
      })
      .select()
      .single();

    if (tripError) throw tripError;

    // Save days and activities
    for (const day of itinerary.days) {
      const dayDate = new Date(start);
      dayDate.setDate(dayDate.getDate() + day.day_number - 1);

      const { data: dayData, error: dayError } = await supabase
        .from("trip_days")
        .insert({
          trip_id: tripData.id,
          day_number: day.day_number,
          date: dayDate.toISOString().split("T")[0],
        })
        .select()
        .single();

      if (dayError) throw dayError;

      for (let i = 0; i < day.activities.length; i++) {
        const act = day.activities[i];
        await supabase.from("trip_activities").insert({
          trip_day_id: dayData.id,
          place_name: act.place_name,
          start_time: act.start_time ? `${act.start_time}:00` : null,
          end_time: act.end_time ? `${act.end_time}:00` : null,
          category: act.category || null,
          order_index: i,
          travel_time_minutes: act.travel_time_minutes || null,
        });
      }
    }

    return new Response(
      JSON.stringify({
        tripId: tripData.id,
        summary: itinerary.summary,
        days: itinerary.days
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (e) {
    console.error("generate-trip error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
