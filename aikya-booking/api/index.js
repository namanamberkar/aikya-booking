import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import bodyParser from "body-parser";

// Replace with your deployed Apps Script Web App URL
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbwsYfP66EhTQPTUtbyh2hfGcXHJc_yoQk02h0iA8puMoKLnPOEvhQ2WOMYzGkekhU7M/exec";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// GET /api → Forward to Apps Script
app.get("/api", async (req, res) => {
  try {
    const url = `${APPS_SCRIPT_URL}?${new URLSearchParams(req.query).toString()}`;
    const response = await fetch(url);
    const text = await response.text();

    try {
      res.json(JSON.parse(text));
    } catch {
      res.status(500).json({ success: false, error: "Invalid JSON from Apps Script", rawResponse: text });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch from Apps Script" });
  }
});

// POST /api → Forward bookings/cancellations
app.post("/api", async (req, res) => {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();
    try {
      res.json(JSON.parse(text));
    } catch {
      res.status(500).json({ success: false, error: "Invalid JSON from Apps Script", rawResponse: text });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to connect to Apps Script." });
  }
});

// Vercel requires export
export default app;
