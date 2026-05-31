import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini SDK
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("Gemini SDK successfully initialized.");
    } else {
      console.warn("GEMINI_API_KEY is not defined. Falling back to template mode.");
    }
  }
  return aiClient;
}

// ----------------------------------------------------
// API routes
// ----------------------------------------------------

// 1. suggest custom greeting messages
app.post("/api/gemini/suggest-message", async (req, res) => {
  const { occasion, tone, recipient, customVibe } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Elegant system fallbacks if key is not configured yet
    const fallbacks: Record<string, string[]> = {
      Birthday: [
        `Wishing the absolute happiest of birthdays to the wonderful ${recipient || "friend"}! May your year ahead be packed with endless smiles, unboxing adventures, and cozy moments. 🎉`,
        `Happiest Birthday, ${recipient || "there"}! Here's a little box filled with big love and cozy vibes just for you. Open up the happiness! 🎂`,
      ],
      Gratitude: [
        `Dear ${recipient || "there"}, a million thank-yous would never be enough for everything you do! This ZenkyBox is a humble token of my deepest gratitude. 🙏`,
        `To the most supportive ${recipient || "person"}—thank you for always having my back. Enjoy these little moments of peace in this box! ✨`,
      ],
      "New Beginnings": [
        `Cheers to your shiny new chapter, ${recipient || "champion"}! May your new path be overflowing with warmth, wonder, and endless celebration. 🚀`,
        `Dear ${recipient || "friend"}, go forth and conquer! This ZenkyBox holds the perfect cozy treats for your incredible new journey. Yellow skies ahead! 🌟`,
      ],
    };

    const categoryDocs = fallbacks[occasion] || [
      `Sending you joyful smiles, warm thoughts, and cozy moments, dear ${recipient || "friend"}! Enjoy this custom surprise. ❤️`,
    ];
    const item = categoryDocs[Math.floor(Math.random() * categoryDocs.length)];

    return res.json({
      success: true,
      text: item,
      isDemo: true,
    });
  }

  try {
    const prompt = `Write a clean, beautiful, emotional card message for a personalized gift box.
Recipient: ${recipient || "Friend"}
Occasion: ${occasion || "Special Celebration"}
Tone style: ${tone || "warm and heartfelt"}
Extra vibe information: ${customVibe || "cozy, premium, joyful"}

Keep it under 3-4 sentences. Do NOT include placeholder fields like [Your Name]. Sign off humbly as "With Love," or "Sincerely,"`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are the head creative copywriter for ZenkyBox, a whimsical but premium custom gift service. Your greeting cards are thoughtful, beautiful, and visually concise.",
      },
    });

    res.json({
      success: true,
      text: response.text?.trim() || "Enjoy this surprise customized just for you!",
    });
  } catch (error: any) {
    console.error("Gemini context error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Chat with Zenky Mascot Companion
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Dynamic mascot response simulator
    const msgLower = (message || "").toLowerCase();
    let response = "Barks of joy! I'm Zenky, your orange fox helper! 🦊 I'm ready to help you craft perfect hampers or browse catalogs!";
    if (msgLower.includes("hello") || msgLower.includes("hi")) {
      response = "Hey there, partner! Welcome to ZenkyBox! 🎁 I am helping you write messages, add dynamic goodies, or explore our corporate gifting list!";
    } else if (msgLower.includes("suggest") || msgLower.includes("gift") || msgLower.includes("product")) {
      response = "I highly recommend our best-selling 'Executive Bliss Box' (₹8,900) for premium colleagues, or the 'Zen Serenity Box' (₹6,250) for a relaxing lavender soy wax spa look! 🕯️ Both can be fully customized in our Lab!";
    } else if (msgLower.includes("bulk") || msgLower.includes("school") || msgLower.includes("corporate")) {
      response = "For large-scale events, schools, and weddings, tap over to our 'Bulk' tab to request a personalized quote! We offer custom logo laser engraving and customized tags starting at 20 units. 📦";
    }
    return res.json({
      success: true,
      text: response,
      isDemo: true,
    });
  }

  try {
    // Format chat history
    const geminiHistory = (history || []).map((h: any) => ({
      role: h.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: h.text }],
    }));

    const chat = client.chats.create({
      model: "gemini-3.5-flash",
      config: {
        systemInstruction: `You are Zenky, the helpful, high-energy orange fox mascot of ZenkyBox Gifting.
Your personality is enthusiastic, whimsical, yet reliable and polite.
Speak with soft expressions like "A box of joy!", "Unbox the happiness!", or cozy emojis (🦊, 🎁, 🕯️, 🍰).
Keep responses brief (max 2-3 paragraphs) and highly relevant to designing custom hampers, selecting gift boxes, or preparing bulk corporate/school gifts.`,
      },
      history: geminiHistory,
    });

    const response = await chat.sendMessage({ message });
    res.json({
      success: true,
      text: response.text?.trim() || "Unbox the fun!",
    });
  } catch (error: any) {
    console.error("Mascot conversation error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 3. AI Custom Box Curator and product recommender
app.post("/api/gemini/curate-box", async (req, res) => {
  const { age, interests, budget, occasion } = req.body;
  const client = getGeminiClient();

  if (!client) {
    // Fallback static recommendations
    return res.json({
      success: true,
      items: [
        "Premium Handmade Soy Candle (Scented)",
        "Organic Floral Chamomile Loose Tea Leaves",
        "Handcrafted Butter Chocolate Truffles",
        "Engraved Bamboo Keepsake Box",
      ],
      explanation: "A snug, sensory-heavy relaxation combination ideal for your budget and occasion!",
      isDemo: true,
    });
  }

  try {
    const prompt = `Recommend exactly 4 curated gift items that fit the following custom profile to place inside a ZenkyBox:
- Recipient age category: ${age || "Adult"}
- Key interests or vibes: ${interests || "General Luxury, relaxing"}
- Approximate single box budget target: ${budget || "moderate"}
- Occasion: ${occasion || "Just Because"}

Explain why these items form a highly cohesive "Magic Reveal" experience together in 2 sentences. Your response MUST be in clean valid JSON formats.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT" as any,
          properties: {
            items: {
              type: "ARRAY" as any,
              items: { type: "STRING" as any },
              description: "List of exactly 4 item names",
            },
            explanation: {
              type: "STRING" as any,
              description: "A summary explaining the aesthetic cohesion",
            },
          },
          required: ["items", "explanation"],
        },
      },
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("AI Curator error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ----------------------------------------------------
// Front-end Server (Vite Integration & Production)
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite as Middleware for optimal Hot Module Replacement during development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production builds out of dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ZenkyBox Server] Running live at: http://0.0.0.0:${PORT}`);
  });
}

startServer();
