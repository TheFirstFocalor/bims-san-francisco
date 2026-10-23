
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";

const API = "https://bims-san-francisco-backend.vercel.app";

// ===== EDIT BARANGAY ACRONYM HERE =====
const BARANGAY_ACRONYM = "SF";

// ===== LOGO SETTINGS =====
// Put your image at frontend/public/logo.png.
// The same logo is used on the login screen and sidebar.
const LOGO_PATH = "/logo.png";

const SEED_DATA = {
  residents: [
    { id: "R001", name: "Maria Santos", age: 42, sex: "Female", zone: "Zone 1", family: "Santos Family", members: 4, contact: "09171234567", address: "Purok 1, San Francisco", program: "4Ps", createdAt: "2026-10-01" },
    { id: "R002", name: "Juan Dela Cruz", age: 51, sex: "Male", zone: "Zone 1", family: "Dela Cruz Family", members: 5, contact: "09181234567", address: "Purok 2, San Francisco", program: "None", createdAt: "2026-10-02" },
    { id: "R003", name: "Ana Reyes", age: 28, sex: "Female", zone: "Zone 2", family: "Reyes Family", members: 3, contact: "09191234567", address: "Purok 3, San Francisco", program: "Youth Scholarship", createdAt: "2026-10-04" },
    { id: "R004", name: "Pedro Garcia", age: 67, sex: "Male", zone: "Zone 2", family: "Garcia Family", members: 2, contact: "09201234567", address: "Purok 4, San Francisco", program: "Senior Citizen", createdAt: "2026-10-05" },
    { id: "R005", name: "Liza Mendoza", age: 36, sex: "Female", zone: "Zone 3", family: "Mendoza Family", members: 6, contact: "09211234567", address: "Purok 5, San Francisco", program: "TUPAD", createdAt: "2026-10-08" },
    { id: "R006", name: "Roberto Flores", age: 45, sex: "Male", zone: "Zone 3", family: "Flores Family", members: 4, contact: "09221234567", address: "Purok 6, San Francisco", program: "None", createdAt: "2026-10-10" },
  ],
  reports: [
    { id: "REP001", title: "Road Improvement – Purok 2", type: "Barangay Project", description: "Monitoring the improvement of the road in Purok 2.", zone: "Zone 2", status: "Ongoing", date: "2026-10-18", visibility: "Public" },
    { id: "REP002", title: "Streetlight Maintenance", type: "Maintenance", description: "Inspection and repair of streetlights near the barangay hall.", zone: "All Zones", status: "Started", date: "2026-10-19", visibility: "Public" },
    { id: "REP003", title: "Certificate Processing Summary", type: "Document Processing", description: "Weekly review of pending barangay certificate applications.", zone: "All Zones", status: "Delayed", date: "2026-10-20", visibility: "Private" },
    { id: "REP004", title: "Community Clean-up Drive", type: "Community Activity", description: "The scheduled community clean-up was completed successfully.", zone: "Zone 1", status: "Success", date: "2026-10-12", visibility: "Public" },
  ],
  requests: [
    { id: "REQ001", title: "Barangay Clearance", type: "Certificate", requester: "Maria Santos", zone: "Zone 1", description: "Request for a barangay clearance for employment.", status: "Unread", date: "2026-10-22", viewed: false },
    { id: "REQ002", title: "Road Repair Proposal", type: "Project Request", requester: "Juan Dela Cruz", zone: "Zone 1", description: "Request to repair a damaged section of the road.", status: "Proposal", date: "2026-10-20", viewed: false },
    { id: "REQ003", title: "Senior Citizen Assistance", type: "Financial Assistance", requester: "Pedro Garcia", zone: "Zone 2", description: "Request for assistance for a registered senior citizen.", status: "Ongoing", date: "2026-10-16", viewed: true },
    { id: "REQ004", title: "Borrowing of Folding Chairs", type: "Borrow Barangay Items", requester: "Ana Reyes", zone: "Zone 2", description: "Request to borrow chairs for a community meeting.", status: "Accepted", date: "2026-10-21", viewed: true },
  ],
  posts: [
    { id: "POST001", title: "Barangay Clean-up Drive", caption: "Residents are encouraged to participate in our community clean-up drive this Saturday. Please coordinate with your zone leaders.", author: "Barangay Captain", date: "2026-10-22T08:00:00", image: "", pinned: true, visibility: "Public" },
    { id: "POST002", title: "Barangay Hall Office Hours", caption: "Please be guided by the regular office hours when processing documents and other barangay transactions.", author: "Barangay Captain", date: "2026-10-20T09:00:00", image: "", pinned: false, visibility: "Public" },
  ],
  programs: [
    { id: "PROG001", name: "TUPAD", description: "Temporary employment assistance for qualified residents.", beneficiaries: 1, status: "Active" },
    { id: "PROG002", name: "4Ps", description: "Support and assistance for qualified families.", beneficiaries: 1, status: "Active" },
    { id: "PROG003", name: "Senior Citizen Program", description: "Community support and services for senior citizens.", beneficiaries: 1, status: "Active" },
    { id: "PROG004", name: "Youth Scholarship", description: "Educational assistance for qualified students.", beneficiaries: 1, status: "Active" },
  ],
  events: [
    { id: "EVT001", title: "Barangay Clean-up Drive", date: "2026-10-24", time: "7:00 AM", location: "Barangay Hall", description: "Community clean-up and waste collection." },
    { id: "EVT002", title: "Barangay Council Meeting", date: "2026-10-26", time: "2:00 PM", location: "Barangay Session Hall", description: "Monthly meeting to discuss barangay projects and concerns." },
    { id: "EVT003", title: "Community Health Information Session", date: "2026-10-29", time: "9:00 AM", location: "Barangay Hall", description: "Community health information and resident announcements." },
    { id: "EVT004", title: "Youth and Scholarship Orientation", date: "2026-11-05", time: "1:00 PM", location: "Barangay Session Hall", description: "Orientation for youth scholarship applicants." },
  ],
  archives: [],
  account: {
    fullName: "Barangay Captain",
    email: "captain@gmail.com",
    position: "Barangay Captain",
    birthdate: "",
    barangay: "Barangay San Francisco, Baggao, Cagayan",
    becameCaptainSince: "",
    photo: "",
  },
  settings: { delayDays: 8 },
};

const NAV_ITEMS = [
  ["Home", "⌂"],
  ["Residents", "♙"],
  ["Reports", "▤"],
  ["Requests", "⇄"],
  ["Programs", "✳"],
  ["Calendar", "▦"],
  ["Archive", "▣"],
  ["Account", "⚙"],
];

const makeId = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const today = () => new Date().toISOString().slice(0, 10);

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function dateLabel(value) {
  if (!value) return "—";
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function dateTimeLabel(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

function initials(name = "Captain") {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function Logo({ large = false }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`logo-ring ${large ? "logo-large" : ""} ${failed ? "logo-fallback" : ""}`}>
      {!failed && (
        <img
          src={LOGO_PATH}
          alt="Barangay San Francisco logo"
          onError={() => setFailed(true)}
        />
      )}
      <span className="logo-fallback-text">{BARANGAY_ACRONYM}</span>
    </div>
  );
}

function Status({ value }) {
  const status = String(value || "Unknown");
  const className = status.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "");
  return <span className={`status-badge status-${className}`}>{status}</span>;
}

function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <span className="empty-icon">⌕</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Field({ label, children, full = false }) {
  return (
    <label className={`form-field ${full ? "field-full" : ""}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Modal({ title, subtitle, onClose, children, onSubmit, submitLabel = "Save Record" }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-label={title}>
        <header className="modal-header">
          <div>
            <span className="eyebrow">BARANGAY SAN FRANCISCO · {BARANGAY_ACRONYM}</span>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close modal">×</button>
        </header>
        <form onSubmit={onSubmit}>
          <div className="modal-body">{children}</div>
          <footer className="modal-footer">
            <button className="button button-ghost" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit">{submitLabel}</button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default function App() {
  const [data, setData] = useState(SEED_DATA);
  const [page, setPage] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("captain@gmail.com");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [serverOnline, setServerOnline] = useState(false);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState(today());
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [toast, setToast] = useState("");

  // Load persisted server data. If the API is unavailable, the seeded demo still works locally.
  useEffect(() => {
    let alive = true;
    fetch(`${API}/data`)
      .then((response) => {
        if (!response.ok) throw new Error("Backend unavailable");
        return response.json();
      })
      .then((remote) => {
        if (!alive) return;
        setServerOnline(true);
        setData((current) => ({
          ...current,
          ...remote,
          residents: remote.residents?.length ? remote.residents : current.residents,
          reports: remote.reports?.length ? remote.reports : current.reports,
          requests: remote.requests?.length ? remote.requests : current.requests,
          posts: remote.posts?.length ? remote.posts : current.posts,
          programs: remote.programs?.length ? remote.programs : current.programs,
          events: remote.events?.length ? remote.events : current.events,
          archives: remote.archives || current.archives,
          account: { ...current.account, ...(remote.account || {}) },
          settings: { ...current.settings, ...(remote.settings || {}) },
        }));
      })
      .catch(() => {
        if (alive) setServerOnline(false);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, []);

  const notify = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  }, []);

  const saveData = useCallback(async (nextData) => {
    setData(nextData);
    try {
      const response = await fetch(`${API}/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextData),
      });
      if (!response.ok) throw new Error("Could not save to server");
      setServerOnline(true);
    } catch {
      setServerOnline(false);
      // Keep changes in the running browser session if the server is unavailable.
    }
  }, []);

  const updateCollection = useCallback((collection, updater) => {
    setData((current) => {
      const currentItems = current[collection] || [];
      const nextItems = typeof updater === "function" ? updater(currentItems) : updater;
      const next = { ...current, [collection]: nextItems };
      fetch(`${API}/data`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next),
      }).then((response) => setServerOnline(response.ok)).catch(() => setServerOnline(false));
      return next;
    });
  }, []);

  const updateAccount = (patch) => {
    saveData({ ...data, account: { ...data.account, ...patch } });
  };

  const logout = () => {
    setLoggedIn(false);
    setPassword("");
    setLoginError("");
    setPage("Home");
    setSidebarOpen(false);
    setModal(null);
    setSearch("");
    setFilter("All");
    notify("You have been logged out.");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginError("");
    try {
      const response = await fetch(`${API}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error("Invalid email or password.");
      setServerOnline(true);
    } catch (error) {
      if (error.message === "Invalid email or password.") {
        setLoginError(error.message);
        return;
      }
      // Local demo fallback when the backend is not running.
      if (email !== "captain@gmail.com" || password !== "1234567890") {
        setLoginError("Invalid email or password.");
        return;
      }
    }

    if (email !== "captain@gmail.com" || password !== "1234567890") {
      setLoginError("Invalid email or password.");
      return;
    }

    setLoggedIn(true);
    setPage("Home");
    setPassword("");
    notify(`Welcome, ${data.account.fullName || "Captain"}!`);
  };

  const openPage = (name) => {
    setPage(name);
    setSearch("");
    setFilter("All");
    setSidebarOpen(false);
  };

  const counts = useMemo(() => ({
    residents: data.residents.length,
    reports: data.reports.length,
    requests: data.requests.length,
    posts: data.posts.length,
    unread: data.requests.filter((item) => !item.viewed || item.status === "Unread").length,
  }), [data]);

  const filtered = (items, fields = []) => items.filter((item) => {
    const query = search.toLowerCase().trim();
    const matchesSearch = !query || fields.some((key) => String(item[key] ?? "").toLowerCase().includes(query));
    const matchesFilter = filter === "All" || fields.some((key) => String(item[key] ?? "") === filter);
    return matchesSearch && matchesFilter;
  });

  const addModal = (type, item = null) => {
    setModal({ type, item });
  };

  const readImage = (file, callback) => {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      notify("Please choose a PNG or JPG/JPEG image.");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      notify("The image must be 100 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => callback(String(reader.result || ""));
    reader.onerror = () => notify("Unable to read that image.");
    reader.readAsDataURL(file);
  };

  const archiveRecord = (type, record) => {
    const archiveItem = {
      id: makeId("ARC"),
      originalId: record.id,
      type,
      title: record.title || record.name || record.fullName || "Archived record",
      description: record.description || record.caption || "",
      archivedAt: new Date().toISOString(),
      record,
    };
    const collection = type === "Report" ? "reports"
      : type === "Request" ? "requests"
      : type === "Post" ? "posts"
      : type === "Resident" ? "residents"
      : type === "Program" ? "programs" : "events";

    // Reports are archived instead of deleted; no report-delete control is provided.
    saveData({
      ...data,
      [collection]: data[collection].filter((item) => item.id !== record.id),
      archives: [archiveItem, ...data.archives],
    });
    notify(`${type} moved to Archive.`);
  };

  const restoreArchive = (archive) => {
    const collection = archive.type === "Report" ? "reports"
      : archive.type === "Request" ? "requests"
      : archive.type === "Post" ? "posts"
      : archive.type === "Resident" ? "residents"
      : archive.type === "Program" ? "programs" : "events";

    saveData({
      ...data,
      [collection]: [archive.record, ...data[collection]],
      archives: data.archives.filter((item) => item.id !== archive.id),
    });
    notify("Record restored.");
  };

  const submitRecord = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = Object.fromEntries(form.entries());
    const { type, item } = modal || {};
    if (!type) return;

    if (type === "resident") {
      const record = {
        id: item?.id || makeId("RES"),
        name: values.name.trim(),
        age: Number(values.age) || 0,
        sex: values.sex,
        zone: values.zone,
        family: values.family.trim(),
        members: Number(values.members) || 1,
        contact: values.contact.trim(),
        address: values.address.trim(),
        program: values.program || "None",
        createdAt: item?.createdAt || today(),
      };
      updateCollection("residents", (items) => item
        ? items.map((entry) => entry.id === item.id ? record : entry)
        : [record, ...items]);
    } else if (type === "report") {
      const record = {
        id: item?.id || makeId("REP"),
        title: values.title.trim(),
        type: values.type,
        description: values.description.trim(),
        zone: values.zone,
        status: values.status,
        date: values.date || today(),
        visibility: values.visibility,
      };
      updateCollection("reports", (items) => item
        ? items.map((entry) => entry.id === item.id ? record : entry)
        : [record, ...items]);
    } else if (type === "request") {
      const record = {
        id: item?.id || makeId("REQ"),
        title: values.title.trim(),
        type: values.type,
        requester: values.requester.trim(),
        zone: values.zone,
        description: values.description.trim(),
        status: item?.status || "Unread",
        date: values.date || today(),
        viewed: item?.viewed || false,
      };
      updateCollection("requests", (items) => item
        ? items.map((entry) => entry.id === item.id ? record : entry)
        : [record, ...items]);
    } else if (type === "post") {
      const record = {
        id: item?.id || makeId("POST"),
        title: values.title.trim(),
        caption: values.caption.trim(),
        author: data.account.fullName,
        date: item?.date || new Date().toISOString(),
        image: item?.image || "",
        pinned: item?.pinned || false,
        visibility: values.visibility || "Public",
      };
      updateCollection("posts", (items) => item
        ? items.map((entry) => entry.id === item.id ? record : entry)
        : [record, ...items]);
    } else if (type === "program") {
      const record = {
        id: item?.id || makeId("PROG"),
        name: values.name.trim(),
        description: values.description.trim(),
        beneficiaries: Number(values.beneficiaries) || 0,
        status: values.status,
      };
      updateCollection("programs", (items) => item
        ? items.map((entry) => entry.id === item.id ? record : entry)
        : [record, ...items]);
    } else if (type === "event") {
      const record = {
        id: item?.id || makeId("EVT"),
        title: values.title.trim(),
        date: values.date,
        time: values.time,
        location: values.location.trim(),
        description: values.description.trim(),
      };
      updateCollection("events", (items) => item
        ? items.map((entry) => entry.id === item.id ? record : entry)
        : [record, ...items]);
      setSelectedDate(record.date);
    } else if (type === "account") {
      updateAccount({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        position: values.position.trim(),
        birthdate: values.birthdate,
        barangay: values.barangay.trim(),
        becameCaptainSince: values.becameCaptainSince,
      });
    }

    setModal(null);
    notify(item ? "Changes saved successfully." : "New record added successfully.");
  };

  const pageTitle = page === "Archive" ? "Archive" : page;

  if (loading) {
    return <div className="loading-screen"><Logo large /><span>Loading Barangay Information Management System…</span></div>;
  }

  if (!loggedIn) {
    return (
      <div className="login-screen">
        <div className="login-decoration decoration-one" />
        <div className="login-decoration decoration-two" />
        <div className="login-layout">
          <section className="login-brand-panel">
            <div className="brand-lockup">
              <Logo large />
              <div>
                <span className="eyebrow">BARANGAY INFORMATION SYSTEM</span>
                <h1>Barangay San Francisco</h1>
                <p>Baggao, Cagayan</p>
              </div>
            </div>
            <div className="login-message">
              <span className="eyebrow">ORGANIZED · CONNECTED · INFORMED</span>
              <h2>Better service starts with better management.</h2>
              <p>Manage resident records, community reports, service requests, programs, and barangay activities in one place.</p>
            </div>
            <div className="login-brand-footer">{BARANGAY_ACRONYM} · BARANGAY MANAGEMENT PORTAL</div>
          </section>

          <section className="login-form-panel">
            <div className="login-mobile-brand">
              <Logo large />
            </div>
            <span className="eyebrow">CAPTAIN ACCESS</span>
            <h2>Welcome back.</h2>
            <p className="muted-text">Sign in to manage your barangay dashboard.</p>
            <form className="login-form" onSubmit={handleLogin}>
              <Field label="EMAIL ADDRESS">
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" autoComplete="username" required />
              </Field>
              <Field label="PASSWORD">
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required />
              </Field>
              {loginError && <p className="form-error" role="alert">{loginError}</p>}
              <button className="button button-primary login-submit" type="submit">Sign In <span>→</span></button>
            </form>
            <div className="login-security"><span>●</span> Authorized barangay personnel only</div>
            <div className="login-public-note">
              <strong>Barangay San Francisco</strong>
              <span>Baggao, Cagayan · Community information and services</span>
            </div>
          </section>
        </div>
        <div className="login-footer">© {new Date().getFullYear()} Barangay San Francisco · Information Management System</div>
      </div>
    );
  }

  const addButton = (type, label = "Add Record") => (
    <button className="button button-primary" onClick={() => addModal(type)}>＋ {label}</button>
  );

  const renderHome = () => (
    <>
      <section className="welcome-banner">
        <div>
          <span className="eyebrow">BARANGAY SAN FRANCISCO · CAPTAIN'S DASHBOARD</span>
          <h1>{greeting()}, Captain {data.account.fullName.split(" ").slice(-1)[0]}!</h1>
          <p>Here's what's happening in your barangay today.</p>
          <div className="welcome-date">{new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
        </div>
        <div className="welcome-mark"><Logo large /></div>
      </section>

      <div className="section-heading">
        <div><span className="eyebrow">AT A GLANCE</span><h2>Barangay overview</h2></div>
        <span className="muted-text">Updated during this session</span>
      </div>

      <div className="stats-grid">
        {[
          ["Residents", counts.residents, "Registered resident records", "♙", "Residents"],
          ["Reports", counts.reports, "Barangay reports and projects", "▤", "Reports"],
          ["Requests", counts.requests, `${counts.unread} unread or unviewed`, "⇄", "Requests"],
          ["Announcements", counts.posts, "Community posts", "◉", "Home"],
        ].map(([label, value, detail, icon, target]) => (
          <button className="stat-card" key={label} onClick={() => openPage(target)}>
            <span className="stat-icon">{icon}</span>
            <span className="stat-label">{label}</span>
            <strong className="stat-value">{value}</strong>
            <span className="stat-detail">{detail}</span>
          </button>
        ))}
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div><span className="eyebrow">COMMUNITY UPDATES</span><h2>Announcements and posts</h2><p className="muted-text">Updates for residents of Barangay San Francisco.</p></div>
            {addButton("post", "New Post")}
          </div>
          <div className="post-list">
            {data.posts.length ? data.posts.map((post) => (
              <article className="post-card" key={post.id}>
                {post.image && <img className="post-image" src={post.image} alt="" />}
                <div className="post-body">
                  <div className="post-meta">
                    {post.pinned && <span className="pinned-label">★ PINNED</span>}
                    <span>{post.author}</span><span>·</span><span>{dateTimeLabel(post.date)}</span>
                    <Status value={post.visibility || "Public"} />
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.caption}</p>
                  <div className="post-actions">
                    <button className="text-button" onClick={() => updateCollection("posts", (items) => items.map((item) => item.id === post.id ? { ...item, pinned: !item.pinned } : item))}>{post.pinned ? "Unpin post" : "Pin post"}</button>
                    <button className="text-button" onClick={() => addModal("post", post)}>Edit post</button>
                    <button className="text-button" onClick={() => archiveRecord("Post", post)}>Archive post</button>
                  </div>
                </div>
              </article>
            )) : <EmptyState title="No announcements yet" description="Create a post to share important barangay updates." />}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Barangay activity</h2></div></div>
          <div className="activity-list">
            {[
              ...data.requests.slice(0, 3).map((item) => ({ title: `Request: ${item.title}`, detail: `${item.requester} · ${item.status}`, date: item.date })),
              ...data.reports.slice(0, 3).map((item) => ({ title: `Report: ${item.title}`, detail: `${item.type} · ${item.status}`, date: item.date })),
              ...data.events.slice(0, 2).map((item) => ({ title: `Event: ${item.title}`, detail: `${item.time} · ${item.location}`, date: item.date })),
            ].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 7).map((item, index) => (
              <div className="activity-item" key={`${item.title}-${index}`}>
                <span className="activity-dot" />
                <div><strong>{item.title}</strong><p>{item.detail}</p><span>{dateLabel(item.date)}</span></div>
              </div>
            ))}
          </div>
          <div className="settings-inline">
            <div><h3>Upcoming events</h3><p className="muted-text">{data.events.filter((event) => event.date >= today()).length} scheduled event(s)</p></div>
            <button className="button button-secondary button-small" onClick={() => openPage("Calendar")}>View calendar →</button>
          </div>
        </section>
      </div>
    </>
  );

  const renderResidents = () => {
    const residents = filtered(data.residents, ["name", "id", "zone", "family", "contact", "address", "program"]);
    const zones = [...new Set(data.residents.map((resident) => resident.zone))];
    const families = new Set(data.residents.map((resident) => resident.family).filter(Boolean)).size;
    return <>
      <div className="page-intro"><div><span className="eyebrow">COMMUNITY DIRECTORY</span><h1>Residents</h1><p>Manage registered residents, households, zones, and program assignments.</p></div>{addButton("resident", "Add Resident")}</div>
      <div className="stats-grid compact-stats">
        {[["Residents", data.residents.length, "Registered records"], ["Families", families, "Unique households"], ["Zones", zones.length, "Zones represented"]].map(([label, value, detail]) => <div className="stat-card" key={label}><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-detail">{detail}</span></div>)}
      </div>
      <section className="panel table-panel">
        <div className="table-toolbar"><div><h2>Resident directory</h2><span className="muted-text">{residents.length} record(s) shown</span></div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search residents, zone, family…" /></div>
        {residents.length ? <div className="table-scroll"><table><thead><tr><th>Resident</th><th>Zone / Family</th><th>Age / Sex</th><th>Contact</th><th>Program</th><th>Actions</th></tr></thead><tbody>
          {residents.map((resident) => <tr key={resident.id}><td><strong>{resident.name}</strong><span className="cell-subtitle">{resident.id} · {resident.address}</span></td><td><strong>{resident.zone}</strong><span className="cell-subtitle">{resident.family || "No family listed"} · {resident.members || 1} household member(s)</span></td><td>{resident.age} / {resident.sex}</td><td>{resident.contact || "—"}</td><td>{resident.program || "None"}</td><td><div className="table-actions"><button className="text-button" onClick={() => addModal("resident", resident)}>Edit</button><button className="text-button" onClick={() => archiveRecord("Resident", resident)}>Archive</button></div></td></tr>)}
        </tbody></table></div> : <EmptyState title="No residents found" description="Try a different search or add a resident record." />}
      </section>
    </>;
  };

  const renderReports = () => {
    const reports = filtered(data.reports, ["title", "type", "description", "zone", "status", "visibility"]);
    return <>
      <div className="page-intro"><div><span className="eyebrow">PROJECTS AND DOCUMENTATION</span><h1>Reports</h1><p>Track barangay projects, document processes, and community activities.</p></div>{addButton("report", "Add Report")}</div>
      <div className="stats-grid compact-stats">
        {[["Total reports", data.reports.length], ["Ongoing", data.reports.filter((item) => item.status === "Ongoing").length], ["Delayed", data.reports.filter((item) => item.status === "Delayed").length]].map(([label, value]) => <div className="stat-card" key={label}><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-detail">Current records</span></div>)}
      </div>
      <section className="panel table-panel">
        <div className="table-toolbar"><div><h2>Report register</h2><span className="muted-text">{reports.length} record(s) shown</span></div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reports…" /></div>
        {reports.length ? <div className="table-scroll"><table><thead><tr><th>Report</th><th>Type / Zone</th><th>Date</th><th>Visibility</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {reports.map((report) => <tr key={report.id}><td><strong>{report.title}</strong><span className="cell-subtitle">{report.description}</span></td><td><strong>{report.type}</strong><span className="cell-subtitle">{report.zone}</span></td><td>{dateLabel(report.date)}</td><td><Status value={report.visibility} /></td><td><select aria-label={`Status for ${report.title}`} value={report.status} onChange={(event) => updateCollection("reports", (items) => items.map((item) => item.id === report.id ? { ...item, status: event.target.value } : item))}>{["Started", "Ongoing", "Delayed", "Success", "Failed", "Cancelled"].map((status) => <option key={status}>{status}</option>)}</select></td><td><div className="table-actions"><button className="text-button" onClick={() => addModal("report", report)}>Edit</button><button className="text-button" onClick={() => archiveRecord("Report", report)}>Archive</button></div></td></tr>)}
        </tbody></table></div> : <EmptyState title="No reports found" description="Add a report to track a barangay project or activity." />}
      </section>
      <p className="form-hint">Reports are archived rather than deleted, so records remain recoverable.</p>
    </>;
  };

  const renderRequests = () => {
    const requests = filtered(data.requests, ["title", "type", "requester", "zone", "description", "status"]);
    const changeRequest = (request, status) => updateCollection("requests", (items) => items.map((item) => item.id === request.id ? { ...item, status, viewed: true } : item));
    const markViewed = (request) => updateCollection("requests", (items) => items.map((item) => item.id === request.id ? { ...item, viewed: true, status: item.status === "Unread" ? "Proposal" : item.status } : item));
    return <>
      <div className="page-intro"><div><span className="eyebrow">RESIDENT SERVICES</span><h1>Requests</h1><p>Review resident requests for documents, projects, assistance, and barangay equipment.</p></div>{addButton("request", "Add Request")}</div>
      <div className="stats-grid compact-stats">
        {[["All requests", data.requests.length], ["Unread", data.requests.filter((item) => !item.viewed || item.status === "Unread").length], ["Ongoing", data.requests.filter((item) => item.status === "Ongoing").length]].map(([label, value]) => <div className="stat-card" key={label}><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-detail">Current requests</span></div>)}
      </div>
      <section className="panel table-panel">
        <div className="table-toolbar"><div><h2>Request inbox</h2><span className="muted-text">{requests.length} record(s) shown</span></div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search requests…" /></div>
        {requests.length ? <div className="table-scroll"><table><thead><tr><th>Request / Resident</th><th>Type / Zone</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {requests.map((request) => <tr key={request.id} className={!request.viewed || request.status === "Unread" ? "unread-row" : ""}><td><strong>{request.title}</strong><span className="cell-subtitle">{request.requester} · {request.description}</span></td><td><strong>{request.type}</strong><span className="cell-subtitle">{request.zone}</span></td><td>{dateLabel(request.date)}</td><td><Status value={request.status} /></td><td><div className="table-actions">
            {(!request.viewed || request.status === "Unread") && <button className="text-button" onClick={() => markViewed(request)}>Mark read</button>}
            <button className="text-button" onClick={() => addModal("request", request)}>Edit</button>
            <button className="text-button" onClick={() => changeRequest(request, "Accepted")}>Accept</button>
            <button className="text-button" onClick={() => changeRequest(request, "Rejected")}>Reject</button>
            <button className="text-button" onClick={() => changeRequest(request, "Ongoing")}>Ongoing</button>
            <button className="text-button" onClick={() => changeRequest(request, "Finished")}>Finish ✓</button>
            <button className="text-button" onClick={() => archiveRecord("Request", request)}>Archive</button>
          </div></td></tr>)}
        </tbody></table></div> : <EmptyState title="No requests found" description="New resident requests will appear here." />}
      </section>
    </>;
  };

  const renderPrograms = () => <>
    <div className="page-intro"><div><span className="eyebrow">COMMUNITY SUPPORT</span><h1>Barangay Programs</h1><p>Manage assistance programs and the residents assigned to each program.</p></div>{addButton("program", "Add Program")}</div>
    <div className="program-grid">
      {data.programs.map((program) => <article className="program-card" key={program.id}>
        <span className="program-card-icon">✳</span><Status value={program.status} /><h2>{program.name}</h2><p>{program.description}</p>
        <div className="program-meta"><span>Assigned residents</span><strong>{data.residents.filter((resident) => resident.program === program.name).length}</strong></div>
        <div className="card-actions"><button className="text-button" onClick={() => addModal("program", program)}>Edit</button><button className="text-button" onClick={() => archiveRecord("Program", program)}>Archive</button></div>
      </article>)}
      {!data.programs.length && <EmptyState title="No programs yet" description="Add a program to begin managing community assistance." />}
    </div>
  </>;

  const renderCalendar = () => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const calendarCells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
    const eventsToday = data.events.filter((event) => event.date === selectedDate).sort((a, b) => a.time.localeCompare(b.time));
    const monthLabel = month.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
    const shiftMonth = (offset) => setMonth(new Date(year, monthIndex + offset, 1));
    return <>
      <div className="page-intro"><div><span className="eyebrow">SCHEDULE AND ACTIVITIES</span><h1>Calendar</h1><p>Plan barangay meetings, community activities, and upcoming events.</p></div>{addButton("event", "Add Event")}</div>
      <div className="calendar-layout">
        <section className="panel">
          <div className="calendar-heading"><button className="icon-button" onClick={() => shiftMonth(-1)} aria-label="Previous month">‹</button><h2>{monthLabel}</h2><button className="icon-button" onClick={() => shiftMonth(1)} aria-label="Next month">›</button></div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}
            {calendarCells.map((day, index) => {
              if (!day) return <div key={`blank-${index}`} />;
              const date = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const hasEvent = data.events.some((event) => event.date === date);
              return <button key={date} className={`calendar-day ${selectedDate === date ? "calendar-selected" : ""} ${date === today() ? "calendar-today" : ""}`} onClick={() => setSelectedDate(date)}>{day}{hasEvent && <i />}</button>;
            })}
          </div>
          <div className="settings-inline"><p className="muted-text">Dots mark days with scheduled events.</p><button className="button button-secondary button-small" onClick={() => { setMonth(new Date()); setSelectedDate(today()); }}>Today</button></div>
        </section>
        <section className="panel agenda-panel">
          <span className="eyebrow">DAILY AGENDA</span><h2>{dateLabel(selectedDate)}</h2>
          {eventsToday.length ? eventsToday.map((event) => <article className="agenda-event" key={event.id}>
            <span className="agenda-event-dot" /><div><h3>{event.title}</h3><p>{event.description}</p><span>◷ {event.time || "Time not set"}</span><br /><span>⌖ {event.location || "Location not set"}</span>
              <div className="card-actions"><button className="text-button" onClick={() => addModal("event", event)}>Edit</button><button className="text-button" onClick={() => archiveRecord("Event", event)}>Archive</button></div>
            </div>
          </article>) : <EmptyState title="Nothing scheduled" description="There are no events on this date. Add an event to keep the barangay organized." />}
          <div className="settings-inline"><div><h3>All upcoming events</h3><p className="muted-text">{data.events.filter((event) => event.date >= today()).length} event(s) remaining</p></div></div>
          {data.events.filter((event) => event.date >= today()).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5).map((event) => <button key={event.id} className="text-button" style={{ display: "block", marginTop: 12, textAlign: "left" }} onClick={() => { setSelectedDate(event.date); setMonth(new Date(`${event.date}T12:00:00`)); }}>▦ {dateLabel(event.date)} — {event.title}</button>)}
        </section>
      </div>
    </>;
  };

  const renderArchive = () => <>
    <div className="page-intro"><div><span className="eyebrow">RECORD HISTORY</span><h1>Archive</h1><p>Review archived records and restore them when needed.</p></div><span className="archive-total">{data.archives.length} archived record(s)</span></div>
    <section className="panel table-panel archive-records">
      <div className="table-toolbar"><div><h2>Archived records</h2><span className="muted-text">Records are retained here until restored.</span></div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search archive…" /></div>
      {(() => {
        const archives = data.archives.filter((record) => `${record.title} ${record.type} ${record.description}`.toLowerCase().includes(search.toLowerCase()));
        return archives.length ? <div className="table-scroll"><table><thead><tr><th>Record</th><th>Type</th><th>Archived date</th><th>Original ID</th><th>Actions</th></tr></thead><tbody>
          {archives.map((record) => <tr key={record.id}><td><strong>{record.title}</strong><span className="cell-subtitle">{record.description}</span></td><td><span className={`archive-label archive-type-${record.type.toLowerCase()}`}>{record.type}</span></td><td>{dateTimeLabel(record.archivedAt)}</td><td>{record.originalId || "—"}</td><td><div className="table-actions"><button className="text-button" onClick={() => restoreArchive(record)}>Restore</button></div></td></tr>)}
        </tbody></table></div> : <EmptyState title="No archived records" description="When you archive a report, request, resident, post, program, or event, it will appear here." />;
      })()}
    </section>
  </>;

  const renderAccount = () => <>
    <div className="page-intro"><div><span className="eyebrow">PROFILE AND PREFERENCES</span><h1>Account</h1><p>Review your captain profile and system preferences.</p></div><button className="button button-primary" onClick={() => addModal("account", data.account)}>Edit Account</button></div>
    <section className="panel profile-hero">
      <div className="profile-avatar">{data.account.photo ? <img src={data.account.photo} alt="Captain profile" /> : initials(data.account.fullName)}</div>
      <div><span className="eyebrow">SIGNED-IN ACCOUNT</span><h2>{data.account.fullName}</h2><p>{data.account.position} · {data.account.email}</p><label className="button button-secondary button-small">Upload profile photo<input type="file" accept="image/png,image/jpeg" hidden onChange={(event) => readImage(event.target.files?.[0], (photo) => { updateAccount({ photo }); notify("Profile photo updated."); })} /></label></div>
    </section>
    <div className="account-grid">
      {[["Full Name", data.account.fullName], ["Email", data.account.email], ["Position", data.account.position], ["Birthdate", data.account.birthdate ? dateLabel(data.account.birthdate) : "Not set"], ["Barangay", data.account.barangay], ["Became Captain Since", data.account.becameCaptainSince ? dateLabel(data.account.becameCaptainSince) : "Not set"]].map(([label, value]) => <article className="account-info-card" key={label}><span>{label}</span><strong>{value || "Not set"}</strong></article>)}
    </div>
    <section className="panel" style={{ marginTop: 18 }}>
      <div className="settings-inline"><div><h2>Request delay threshold</h2><p className="muted-text">Number of business days before an accepted request is flagged for review. Weekends are excluded.</p></div><Field label="BUSINESS DAYS"><select value={data.settings.delayDays} onChange={(event) => saveData({ ...data, settings: { ...data.settings, delayDays: Number(event.target.value) } })}>{[4, 5, 6, 7, 8, 9, 10, 11, 12].map((days) => <option value={days} key={days}>{days} days</option>)}</select></Field></div>
    </section>
    <section className="panel" style={{ marginTop: 18 }}>
      <div className="settings-inline"><div><h2>Session</h2><p className="muted-text">Log out of the captain dashboard on this device.</p></div><button className="button button-ghost" onClick={logout}>↪ Log Out</button></div>
    </section>
  </>;

  const modalConfig = {
    resident: { title: modal?.item ? "Edit Resident" : "Add Resident", subtitle: "Enter the resident and household details.", submit: "Save Resident" },
    report: { title: modal?.item ? "Edit Report" : "Add Report", subtitle: "Record a barangay project, document process, or activity.", submit: "Save Report" },
    request: { title: modal?.item ? "Edit Request" : "Add Request", subtitle: "Enter the resident request details.", submit: "Save Request" },
    post: { title: modal?.item ? "Edit Post" : "Create Announcement", subtitle: "Share an update with barangay residents.", submit: "Publish Post" },
    program: { title: modal?.item ? "Edit Program" : "Add Program", subtitle: "Manage a barangay assistance program.", submit: "Save Program" },
    event: { title: modal?.item ? "Edit Event" : "Add Calendar Event", subtitle: "Schedule a meeting, activity, or community event.", submit: "Save Event" },
    account: { title: "Edit Account", subtitle: "Update the captain's profile information.", submit: "Save Account" },
  };

  const renderModalFields = () => {
    const item = modal?.item || {};
    switch (modal?.type) {
      case "resident":
        return <div className="form-grid">
          <Field label="FULL NAME"><input name="name" defaultValue={item.name || ""} required /></Field>
          <Field label="AGE"><input name="age" type="number" min="0" max="120" defaultValue={item.age ?? ""} required /></Field>
          <Field label="SEX"><select name="sex" defaultValue={item.sex || "Female"}><option>Female</option><option>Male</option><option>Prefer not to say</option></select></Field>
          <Field label="ZONE"><select name="zone" defaultValue={item.zone || "Zone 1"}>{["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "All Zones"].map((zone) => <option key={zone}>{zone}</option>)}</select></Field>
          <Field label="FAMILY / HOUSEHOLD"><input name="family" defaultValue={item.family || ""} required /></Field>
          <Field label="HOUSEHOLD MEMBERS"><input name="members" type="number" min="1" defaultValue={item.members || 1} /></Field>
          <Field label="CONTACT NUMBER"><input name="contact" defaultValue={item.contact || ""} /></Field>
          <Field label="PROGRAM ASSIGNMENT"><select name="program" defaultValue={item.program || "None"}><option>None</option>{data.programs.map((program) => <option key={program.id}>{program.name}</option>)}</select></Field>
          <Field label="ADDRESS" full><input name="address" defaultValue={item.address || ""} required /></Field>
        </div>;
      case "report":
        return <div className="form-grid">
          <Field label="REPORT TITLE" full><input name="title" defaultValue={item.title || ""} required /></Field>
          <Field label="REPORT TYPE"><select name="type" defaultValue={item.type || "Barangay Project"}>{["Barangay Project", "Document Processing", "Maintenance", "Community Activity", "Incident Report", "Other"].map((type) => <option key={type}>{type}</option>)}</select></Field>
          <Field label="ZONE"><select name="zone" defaultValue={item.zone || "All Zones"}>{["All Zones", "Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"].map((zone) => <option key={zone}>{zone}</option>)}</select></Field>
          <Field label="DATE"><input name="date" type="date" defaultValue={item.date || today()} required /></Field>
          <Field label="STATUS"><select name="status" defaultValue={item.status || "Started"}>{["Started", "Ongoing", "Delayed", "Success", "Failed", "Cancelled"].map((status) => <option key={status}>{status}</option>)}</select></Field>
          <Field label="VISIBILITY"><select name="visibility" defaultValue={item.visibility || "Public"}><option>Public</option><option>Private</option></select></Field>
          <Field label="DESCRIPTION" full><textarea name="description" defaultValue={item.description || ""} placeholder="Describe the project, progress, or report…" /></Field>
        </div>;
      case "request":
        return <div className="form-grid">
          <Field label="REQUEST TITLE" full><input name="title" defaultValue={item.title || ""} required /></Field>
          <Field label="REQUEST TYPE"><select name="type" defaultValue={item.type || "Certificate"}>{["Certificate", "Document", "Project Request", "Items", "Financial Assistance", "Borrow Barangay Items", "Other"].map((type) => <option key={type}>{type}</option>)}</select></Field>
          <Field label="REQUESTER NAME"><input name="requester" defaultValue={item.requester || ""} required /></Field>
          <Field label="ZONE"><select name="zone" defaultValue={item.zone || "Zone 1"}>{["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5", "All Zones"].map((zone) => <option key={zone}>{zone}</option>)}</select></Field>
          <Field label="DATE RECEIVED"><input name="date" type="date" defaultValue={item.date || today()} required /></Field>
          <Field label="DESCRIPTION" full><textarea name="description" defaultValue={item.description || ""} placeholder="Describe the request…" /></Field>
          {item.id && <p className="form-hint field-full">Use the request table's action buttons to accept, reject, mark as ongoing, or finish this request.</p>}
        </div>;
      case "post":
        return <div className="form-grid">
          <Field label="POST TITLE" full><input name="title" defaultValue={item.title || ""} required /></Field>
          <Field label="CAPTION / MESSAGE" full><textarea name="caption" rows="5" defaultValue={item.caption || ""} required placeholder="Write the announcement for residents…" /></Field>
          <Field label="VISIBILITY"><select name="visibility" defaultValue={item.visibility || "Public"}><option>Public</option><option>Private</option></select></Field>
          <Field label="IMAGE (PNG, JPG, JPEG)" full><input type="file" accept="image/png,image/jpeg" onChange={(event) => readImage(event.target.files?.[0], (image) => setModal((current) => ({ ...current, item: { ...(current.item || {}), image } })))} /><span className="muted-text">Optional image, maximum 100 MB. Uploading a new image replaces the existing one.</span></Field>
          {item.image && <div className="field-full"><img src={item.image} alt="Post preview" style={{ maxHeight: 180, borderRadius: 8, objectFit: "contain" }} /></div>}
        </div>;
      case "program":
        return <div className="form-grid">
          <Field label="PROGRAM NAME" full><input name="name" defaultValue={item.name || ""} required /></Field>
          <Field label="STATUS"><select name="status" defaultValue={item.status || "Active"}><option>Active</option><option>Inactive</option><option>Completed</option></select></Field>
          <Field label="BENEFICIARIES"><input name="beneficiaries" type="number" min="0" defaultValue={item.beneficiaries || 0} /></Field>
          <Field label="DESCRIPTION" full><textarea name="description" defaultValue={item.description || ""} /></Field>
        </div>;
      case "event":
        return <div className="form-grid">
          <Field label="EVENT TITLE" full><input name="title" defaultValue={item.title || ""} required /></Field>
          <Field label="DATE"><input name="date" type="date" defaultValue={item.date || selectedDate || today()} required /></Field>
          <Field label="TIME"><input name="time" type="text" defaultValue={item.time || ""} placeholder="e.g. 8:00 AM" required /></Field>
          <Field label="LOCATION" full><input name="location" defaultValue={item.location || ""} /></Field>
          <Field label="DESCRIPTION" full><textarea name="description" defaultValue={item.description || ""} /></Field>
        </div>;
      case "account":
        return <div className="form-grid">
          <Field label="FULL NAME"><input name="fullName" defaultValue={item.fullName || ""} required /></Field>
          <Field label="EMAIL ADDRESS"><input name="email" type="email" defaultValue={item.email || ""} required /></Field>
          <Field label="POSITION"><input name="position" defaultValue={item.position || ""} required /></Field>
          <Field label="BIRTHDATE"><input name="birthdate" type="date" defaultValue={item.birthdate || ""} /></Field>
          <Field label="BARANGAY" full><input name="barangay" defaultValue={item.barangay || ""} required /></Field>
          <Field label="BECAME CAPTAIN SINCE"><input name="becameCaptainSince" type="date" defaultValue={item.becameCaptainSince || ""} /></Field>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <Logo />
          <div className="sidebar-brand-copy"><strong>BARANGAY {BARANGAY_ACRONYM}</strong><span>San Francisco · Baggao</span></div>
          <button className="icon-button sidebar-close" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <div className="sidebar-section-label">MANAGEMENT</div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(([name, icon]) => <button key={name} className={`nav-item ${page === name ? "nav-active" : ""}`} onClick={() => openPage(name)}>
            <span className="nav-icon">{icon}</span><span>{name}</span>
            {name === "Requests" && counts.unread > 0 && <span className="nav-count">{counts.unread}</span>}
          </button>)}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-captain"><div className="avatar-small">{data.account.photo ? <img src={data.account.photo} alt="" /> : initials(data.account.fullName)}</div><div className="captain-copy"><strong>{data.account.fullName}</strong><span>{data.account.position}</span></div></div>
          <button className="logout-button" onClick={logout}><span>↪</span> Log Out</button>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button hamburger" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}><span /><span /><span /></button>
            <div className="breadcrumb"><span>Barangay {BARANGAY_ACRONYM}</span><span className="crumb-divider">/</span><strong>{pageTitle}</strong></div>
          </div>
          <div className="topbar-right">
            <span className="live-indicator"><i />{serverOnline ? "SYSTEM ONLINE" : "LOCAL DEMO"}</span>
            <button className="topbar-profile" onClick={() => openPage("Account")}><span className="avatar-small">{data.account.photo ? <img src={data.account.photo} alt="" /> : initials(data.account.fullName)}</span><span>{data.account.fullName}</span><span className="profile-chevron">⌄</span></button>
          </div>
        </header>

        {!serverOnline && <div className="server-warning">Demo mode: the backend is not connected. Start `node server.js` on port 5000 to save changes to the running server.</div>}

        <main className="page-content">
          {page === "Home" && renderHome()}
          {page === "Residents" && renderResidents()}
          {page === "Reports" && renderReports()}
          {page === "Requests" && renderRequests()}
          {page === "Programs" && renderPrograms()}
          {page === "Calendar" && renderCalendar()}
          {page === "Archive" && renderArchive()}
          {page === "Account" && renderAccount()}
        </main>
        <footer className="app-footer"><span>© {new Date().getFullYear()} Barangay San Francisco, Baggao, Cagayan</span><span>Barangay Information Management System · {BARANGAY_ACRONYM}</span></footer>
      </div>

      {modal && <Modal title={modalConfig[modal.type]?.title || "Edit Record"} subtitle={modalConfig[modal.type]?.subtitle || ""} onClose={() => setModal(null)} onSubmit={submitRecord} submitLabel={modalConfig[modal.type]?.submit || "Save"}>
        {renderModalFields()}
      </Modal>}
      {toast && <div className="toast-message" role="status">{toast}</div>}
    </div>
  );
}
