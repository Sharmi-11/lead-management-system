import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
let leads = [];

app.post("/leads", async (req, res) => {
  const { name, email, phone, company, message, source } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }

  const newLead = {
    id: uuidv4(),
    name,
    email,
    phone: phone || "",
    company: company || "",
    message: message || "",
    source: source || "Website",
    createdAt: new Date().toISOString(),
  };
  leads.push(newLead);
  try {
    await axios.post("https://webhook.site/your-test-id", newLead);
    console.log("Webhook triggered successfully");
  } catch (err) {
    console.error("Webhook error:", err.message);
  }
  res.status(201).json({ message: "Lead saved successfully", lead: newLead });
});

app.get("/leads", (req, res) => {
  res.json(leads);
});

app.get("/leads/:id", (req, res) => {
  const lead = leads.find((l) => l.id === req.params.id);
  if (!lead) return res.status(404).json({ message: "Lead not found" });
  res.json(lead);
});

app.put("/leads/:id", (req, res) => {
  const { id } = req.params;
  const index = leads.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Lead not found" });
  }

  leads[index] = {
    ...leads[index],
    ...req.body,
  };

  res.json({
    message: "Lead updated successfully",
    lead: leads[index],
  });
});

app.delete("/leads/:id", (req, res) => {
  const { id } = req.params;

  const index = leads.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Lead not found" });
  }

  leads.splice(index, 1);

  res.json({ message: "Lead deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
