# API State Explorer - Single-Screen React & Tailwind App

A modern, responsive, single-screen React application built to demonstrate robust API lifecycle handling:
- **Loading State:** Skeleton cards and live loading indicators.
- **Error State:** Diagnostic failure card with HTTP error details, timestamp, and one-click retry / fallback.
- **Success State:** Interactive user directory grid with real-time client-side search, modal details, and network latency monitoring.
- **Light Theme Only:** Styled exclusively with a clean, high-contrast light mode palette using Tailwind CSS.

---

## ✨ Features

- **Dynamic State Scenarios:**
  - 🟢 **Healthy Endpoint:** Fetches live user data from `jsonplaceholder.typicode.com/users` (HTTP 200).
  - 🔴 **Simulated 404 Not Found:** Demonstrates graceful handling of missing endpoints with retry action.
  - 🟠 **Simulated Network Failure:** Handles DNS or offline unreachable network errors.
- **Skeleton Shimmer Loading:** Visual placeholder cards indicate ongoing API requests without layout shift.
- **Latency & Diagnostics:** Tracks request duration in milliseconds and shows exact request URLs.
- **Interactive Search & Filter:** Instant client-side search filtering across user names, handles, companies, and cities.
- **Modal Drilldown:** Inspect deeper details for any record without navigating away from the single screen.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite 6**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (Icons)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📦 Pushing to GitHub

To push this repository to GitHub:

```bash
# Initialize git (if not already initialized)
git init

# Add all files and make the initial commit
git add .
git commit -m "feat: complete single-screen API state explorer with loading and error states"

# Create a repository on GitHub (via web or CLI), then link and push:
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git branch -M main
git push -u origin main
```
