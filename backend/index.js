const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// ====== CONFIG ======
const PORT = 5000;
const GEMINI_API_KEY = "AIzaSyAaXkssI4PyfiFJ70sYC6l7g2TGmPoabUo";

// ====== GEMINI AI SETUP ======
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required and must be a string." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      return res.status(500).json({ error: "No response from Gemini API." });
    }

    res.json({ reply: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: error.message || "Failed to fetch response from Gemini API.",
    });
  }
});

// ====== EMAIL SETUP ======
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mharshi2806@gmail.com",
    pass: "sosx naxb teox wcol", // Gmail App Password
  },
});

app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: "mharshi2806@gmail.com",
      subject: `New contact form submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
