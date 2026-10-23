
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: "110mb" }));

// Demo data is temporary and resets whenever the server restarts.
const initialData = {
  residents: [
    { id: "R001", name: "Maria Santos", age: 42, sex: "Female", zone: "Zone 1", family: "Santos Family", members: 4, contact: "09171234567", address: "Purok 1, San Francisco", program: "4Ps", createdAt: "2026-10-01" },
    { id: "R002", name: "Juan Dela Cruz", age: 51, sex: "Male", zone: "Zone 1", family: "Dela Cruz Family", members: 5, contact: "09181234567", address: "Purok 2, San Francisco", program: "None", createdAt: "2026-10-02" },
    { id: "R003", name: "Ana Reyes", age: 28, sex: "Female", zone: "Zone 2", family: "Reyes Family", members: 3, contact: "09191234567", address: "Purok 3, San Francisco", program: "Youth Scholarship", createdAt: "2026-10-04" },
    { id: "R004", name: "Pedro Garcia", age: 67, sex: "Male", zone: "Zone 2", family: "Garcia Family", members: 2, contact: "09201234567", address: "Purok 4, San Francisco", program: "Senior Citizen Program", createdAt: "2026-10-05" },
    { id: "R005", name: "Liza Mendoza", age: 36, sex: "Female", zone: "Zone 3", family: "Mendoza Family", members: 6, contact: "09211234567", address: "Purok 5, San Francisco", program: "TUPAD", createdAt: "2026-10-08" },
    { id: "R006", name: "Roberto Flores", age: 45, sex: "Male", zone: "Zone 3", family: "Flores Family", members: 4, contact: "09221234567", address: "Purok 6, San Francisco", program: "None", createdAt: "2026-10-10" }
  ],
  reports: [
    { id: "REP001", title: "Road Improvement – Purok 2", type: "Barangay Project", description: "Monitoring the improvement of the road in Purok 2.", zone: "Zone 2", status: "Ongoing", date: "2026-10-18", visibility: "Public" },
    { id: "REP002", title: "Streetlight Maintenance", type: "Maintenance", description: "Inspection and repair of streetlights near the barangay hall.", zone: "All Zones", status: "Started", date: "2026-10-19", visibility: "Public" },
    { id: "REP003", title: "Certificate Processing Summary", type: "Document Processing", description: "Weekly review of pending barangay certificate applications.", zone: "All Zones", status: "Delayed", date: "2026-10-20", visibility: "Private" },
    { id: "REP004", title: "Community Clean-up Drive", type: "Community Activity", description: "The scheduled community clean-up was completed successfully.", zone: "Zone 1", status: "Success", date: "2026-10-12", visibility: "Public" }
  ],
  requests: [
    { id: "REQ001", title: "Barangay Clearance", type: "Certificate", requester: "Maria Santos", zone: "Zone 1", description: "Request for a barangay clearance for employment.", status: "Unread", date: "2026-10-22", viewed: false },
    { id: "REQ002", title: "Road Repair Proposal", type: "Project Request", requester: "Juan Dela Cruz", zone: "Zone 1", description: "Request to repair a damaged section of the road.", status: "Proposal", date: "2026-10-20", viewed: false },
    { id: "REQ003", title: "Senior Citizen Assistance", type: "Financial Assistance", requester: "Pedro Garcia", zone: "Zone 2", description: "Request for assistance for a registered senior citizen.", status: "Ongoing", date: "2026-10-16", viewed: true },
    { id: "REQ004", title: "Borrowing of Folding Chairs", type: "Borrow Barangay Items", requester: "Ana Reyes", zone: "Zone 2", description: "Request to borrow chairs for a community meeting.", status: "Accepted", date: "2026-10-21", viewed: true }
  ],
  posts: [
    { id: "POST001", title: "Barangay Clean-up Drive", caption: "Residents are encouraged to participate in our community clean-up drive this Saturday. Please coordinate with your zone leaders.", author: "Barangay Captain", date: "2026-10-22T08:00:00", image: "", pinned: true, visibility: "Public" },
    { id: "POST002", title: "Barangay Hall Office Hours", caption: "Please be guided by the regular office hours when processing documents and other barangay transactions.", author: "Barangay Captain", date: "2026-10-20T09:00:00", image: "", pinned: false, visibility: "Public" }
  ],
  programs: [
    { id: "PROG001", name: "TUPAD", description: "Temporary employment assistance for qualified residents.", beneficiaries: 1, status: "Active" },
    { id: "PROG002", name: "4Ps", description: "Support and assistance for qualified families.", beneficiaries: 1, status: "Active" },
    { id: "PROG003", name: "Senior Citizen Program", description: "Community support and services for senior citizens.", beneficiaries: 1, status: "Active" },
    { id: "PROG004", name: "Youth Scholarship", description: "Educational assistance for qualified students.", beneficiaries: 1, status: "Active" }
  ],
  events: [
    { id: "EVT001", title: "Barangay Clean-up Drive", date: "2026-10-24", time: "7:00 AM", location: "Barangay Hall", description: "Community clean-up and waste collection." },
    { id: "EVT002", title: "Barangay Council Meeting", date: "2026-10-26", time: "2:00 PM", location: "Barangay Session Hall", description: "Monthly meeting to discuss barangay projects and concerns." },
    { id: "EVT003", title: "Community Health Information Session", date: "2026-10-29", time: "9:00 AM", location: "Barangay Hall", description: "Community health information and resident announcements." },
    { id: "EVT004", title: "Youth and Scholarship Orientation", date: "2026-11-05", time: "1:00 PM", location: "Barangay Session Hall", description: "Orientation for youth scholarship applicants." }
  ],
  archives: [],
  account: {
    fullName: "Barangay Captain",
    email: "captain@gmail.com",
    position: "Barangay Captain",
    birthdate: "",
    barangay: "Barangay San Francisco, Baggao, Cagayan",
    becameCaptainSince: "",
    photo: ""
  },
  settings: { delayDays: 8 }
};

let data = JSON.parse(JSON.stringify(initialData));

const CAPTAIN_EMAIL = "captain@gmail.com";
const CAPTAIN_PASSWORD = "1234567890";

app.get("/", (_req, res) => {
  res.json({
    name: "Barangay Information Management System",
    barangay: "Barangay San Francisco, Baggao, Cagayan",
    status: "running",
    port: PORT
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, status: "online", port: PORT });
});

app.get("/api/data", (_req, res) => {
  res.json(data);
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};

  if (email === CAPTAIN_EMAIL && password === CAPTAIN_PASSWORD) {
    return res.json({
      success: true,
      user: {
        email: CAPTAIN_EMAIL,
        position: "Barangay Captain"
      }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid email or password."
  });
});

app.post("/api/data", (req, res) => {
  const incoming = req.body;

  if (!incoming || typeof incoming !== "object" || Array.isArray(incoming)) {
    return res.status(400).json({
      success: false,
      message: "A valid data object is required."
    });
  }

  const collections = [
    "residents",
    "reports",
    "requests",
    "posts",
    "programs",
    "events",
    "archives"
  ];

  for (const key of collections) {
    if (incoming[key] !== undefined && !Array.isArray(incoming[key])) {
      return res.status(400).json({
        success: false,
        message: `${key} must be an array.`
      });
    }
  }

  data = {
    ...data,
    ...incoming,
    account: { ...data.account, ...(incoming.account || {}) },
    settings: { ...data.settings, ...(incoming.settings || {}) }
  };

  return res.json({
    success: true,
    message: "Barangay records saved.",
    data
  });
});

if (require.main === module) {
  app.listen(process.env.PORT || PORT, () => {
    console.log("==============================================");
    console.log(" Barangay Information Management System");
    console.log(" Barangay San Francisco, Baggao, Cagayan");
    console.log(` Backend running at http://localhost:${process.env.PORT || PORT}`);
    console.log(" Captain login: captain@gmail.com");
    console.log(" Sample records loaded");
    console.log("==============================================");
  });
}

module.exports = app;
