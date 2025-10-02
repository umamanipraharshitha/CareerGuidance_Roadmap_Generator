require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://csp-2025-44e86.firebaseio.com",
});
const db = admin.firestore();

const app = express();
app.use(cors());
app.use(express.json());
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // For development only
  },
});

// ====== CONFIG ======
const PORT = process.env.PORT || 5000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// ====== GEMINI AI SETUP ======
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function callGeminiModel(message, modelName = "gemini-2.5-flash") {
  const model = genAI.getGenerativeModel({ model: modelName });

  let retries = 3;
  while (retries > 0) {
    try {
      const result = await model.generateContent(message);
      return result;
    } catch (error) {
      if (error.status === 503 && retries > 1) {
        console.warn(`⚠️ ${modelName} overloaded. Retrying in 2s...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        retries--;
      } else {
        throw error;
      }
    }
  }
}

// ====== CHAT ENDPOINT ======
app.post("/api/chat", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    // Gemini prompt
    const prompt = `
You are a career guidance assistant. 
The student is currently in 10th class and wants a full career roadmap.

1. ALWAYS produce JSON with:
{
  "reply": "<friendly explanation>",
  "roadmapUpdates": [
    {"step": "<short step title>", "description": "<details about this step>"}
  ]
}

2. The roadmap must **follow this order**:
- 10th Class
- Choose Stream in Intermediate (Science / Commerce / Arts)
- Subjects to focus on in that stream
- Entrance / Competitive Exams for graduation or professional courses
- Graduation / Professional Degree
- Post-Graduation / Career / Jobs

3. Adapt each step to the student's interest (e.g., medicine, engineering, law, arts).

4. JSON ONLY, no extra text outside the JSON.

5. Keep "step" concise (5–6 words max), "description" 15–30 words.

User question: "${message}"
`;

    let result;
    try {
      result = await callGeminiModel(prompt, "gemini-2.5-flash");
    } catch (e) {
      console.error("Gemini API error:", e);
      return res.status(503).json({ error: "Gemini servers busy. Please try again shortly." });
    }

    const rawText = result?.response?.text?.();
    if (!rawText) return res.status(502).json({ error: "AI returned empty response." });

    let parsed;
    try {
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      parsed = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
    } catch (jsonError) {
      console.error("Failed to parse Gemini JSON:", jsonError);
      return res.json({ reply: rawText, roadmapUpdates: [] });
    }

    const newSteps = Array.isArray(parsed.roadmapUpdates) ? parsed.roadmapUpdates : [];

    if (userId) {
      const userDocRef = db.collection("users").doc(userId);
      const userDoc = await userDocRef.get();

      let existingRoadmap = [];
      if (userDoc.exists) {
        existingRoadmap = userDoc.data().roadmap || [];
      }

      const updatedRoadmap = [...new Set([...existingRoadmap, ...newSteps])];

      await userDocRef.set(
        { roadmap: updatedRoadmap, lastUpdated: new Date() },
        { merge: true }
      );

      res.json({
        reply: parsed.reply || rawText,
        roadmapUpdates: updatedRoadmap,
      });
    } else {
      res.json({
        reply: parsed.reply || rawText,
        roadmapUpdates: newSteps,
      });
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(error.status || 500).json({
      error:
        error.status === 503
          ? "Gemini servers busy. Please try again shortly."
          : error.message || "Failed fetching from Gemini API.",
    });
  }
});

app.post("/api/chat1", async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    // Gemini prompt
    const prompt = `
You are a career guidance assistant. 
The student is currently in highschool and wants a full career roadmap.
User question: "${message}"
`;

    let result;
    try {
      result = await callGeminiModel(prompt, "gemini-2.5-flash");
    } catch (e) {
      console.error("Gemini API error:", e);
      return res.status(503).json({ error: "Gemini servers busy. Please try again shortly." });
    }

    const rawText = result?.response?.text?.();
    if (!rawText) return res.status(502).json({ error: "AI returned empty response." });

    let parsed;
    try {
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      parsed = JSON.parse(rawText.substring(jsonStart, jsonEnd + 1));
    } catch (jsonError) {
      console.error("Failed to parse Gemini JSON:", jsonError);
      return res.json({ reply: rawText, roadmapUpdates: [] });
    }

    const newSteps = Array.isArray(parsed.roadmapUpdates) ? parsed.roadmapUpdates : [];

    if (userId) {
      const userDocRef = db.collection("users").doc(userId);
      const userDoc = await userDocRef.get();

      let existingRoadmap = [];
      if (userDoc.exists) {
        existingRoadmap = userDoc.data().roadmap || [];
      }

      const updatedRoadmap = [...new Set([...existingRoadmap, ...newSteps])];

      await userDocRef.set(
        { roadmap: updatedRoadmap, lastUpdated: new Date() },
        { merge: true }
      );

      res.json({
        reply: parsed.reply || rawText,
        roadmapUpdates: updatedRoadmap,
      });
    } else {
      res.json({
        reply: parsed.reply || rawText,
        roadmapUpdates: newSteps,
      });
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(error.status || 500).json({
      error:
        error.status === 503
          ? "Gemini servers busy. Please try again shortly."
          : error.message || "Failed fetching from Gemini API.",
    });
  }
});

// ====== EMAIL SETUP ======

// ====== SEND EMAIL ENDPOINT (for chat exports and contact forms) ======
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${EMAIL_USER}>`,
      to: email,
      subject: `Your Career Chat Transcript`,
      text: message,
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// ====== TOKEN VERIFICATION ======
app.post("/verify-token", async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userRecord = await admin.auth().getUser(uid);

    const userDocRef = db.collection("users").doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      await userDocRef.set(
        {
          email: userRecord.email,
          displayName: userRecord.displayName || "",
          joinedDate: userRecord.metadata.creationTime,
          lastLogin: new Date().toISOString(),
        },
        { merge: true }
      );
    } else {
      await userDocRef.set(
        { lastLogin: new Date().toISOString() },
        { merge: true }
      );
    }

    res.status(200).json({
      uid,
      email: userRecord.email,
      joinedDate: userRecord.metadata.creationTime,
      message: "Token verified and user stored/updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Invalid token" });
  }
});

// ====== CREATE USER (Admin, etc.) ======
app.post("/create-user", async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
    });
    res.status(201).json({ uid: userRecord.uid });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// ====== SEND REPORT (chat + roadmap export) ======
app.post("/api/send-report", async (req, res) => {
  const { email, chatHistory, roadmap } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const chatContent = (chatHistory || [])
      .map((msg) => `${msg.from === "user" ? "You" : "Bot"}: ${msg.text}`)
      .join("\n");

    const roadmapContent = (roadmap || [])
      .map((step, idx) => `${idx + 1}. ${step.step} - ${step.description || ""}`)
      .join("\n");

    const emailBody = `Here is your CareerPath chat & roadmap:\n\n` +
      `🗨️ Chat:\n${chatContent}\n\n` +
      `🛣️ Roadmap:\n${roadmapContent}\n\n` +
      `✨ Keep working towards your goals!`;

    await transporter.sendMail({
      from: `"CareerPath AI" <${EMAIL_USER}>`,
      to: email,
      subject: "Your CareerPath Report",
      text: emailBody,
    });

    res.json({ success: true, message: "Report sent successfully!" });
  } catch (error) {
    console.error("Error sending report:", error);
    res.status(500).json({ success: false, message: "Failed to send report" });
  }
});

// ====== ADMIN ENDPOINTS ======

// 1️⃣ Fetch All Users (for Admin Dashboard)
app.get("/api/admin/users", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || "No Name",
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
    }));

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 2️⃣ Get User Stats (Registrations Over Time)
app.get("/api/admin/stats", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const users = listUsersResult.users;

    const stats = {};
    users.forEach((user) => {
      const date = new Date(user.metadata.creationTime).toISOString().split("T")[0];
      stats[date] = (stats[date] || 0) + 1;
    });

    const registrations = Object.keys(stats)
      .sort()
      .map((date) => ({ date, count: stats[date] }));

    res.json({ totalUsers: users.length, registrations });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

// 3️⃣ Send Notification to All Users
app.post("/api/admin/send-notification", async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ error: "Subject and message are required" });
  }

  try {
    const listUsersResult = await admin.auth().listUsers();
    const emails = listUsersResult.users.map((u) => u.email).filter(Boolean);

    await Promise.all(
      emails.map((email) =>
        transporter.sendMail({
          from: `"CareerPath Admin" <${EMAIL_USER}>`,
          to: email,
          subject,
          text: message,
        })
      )
    );

    res.json({ success: true, sentCount: emails.length });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Failed to send notifications" });
  }
});

// 4️⃣ Reset Database (Delete ALL Users + Firestore Data)
app.delete("/api/admin/reset-database", async (req, res) => {
  try {
    const listUsersResult = await admin.auth().listUsers();
    const deletePromises = listUsersResult.users.map((user) =>
      admin.auth().deleteUser(user.uid)
    );
    await Promise.all(deletePromises);

    const collections = await db.listCollections();
    for (const collection of collections) {
      const snapshot = await collection.get();
      const batch = db.batch();
      snapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
    }

    res.json({ success: true, message: "🔥 Database and users deleted successfully!" });
  } catch (error) {
    console.error("Error resetting database:", error);
    res.status(500).json({ error: "Failed to reset database" });
  }
});
