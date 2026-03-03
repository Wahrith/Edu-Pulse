# EduPulse — AI-Powered Study Helper

EduPulse is a web application that turns your raw study material into structured guides, practice quizzes, personalised exam roadmaps, and on-demand AI tutoring — all in one place.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Firebase Setup](#firebase-setup)
  - [Groq API Setup](#groq-api-setup)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Pages & Functionality](#pages--functionality)
  - [Authentication](#authentication)
  - [Dashboard](#dashboard)
  - [AI Smart Summarizer](#ai-smart-summarizer)
  - [Practice Quiz Generator](#practice-quiz-generator)
  - [Exam Roadmap](#exam-roadmap)
  - [AI Interactive Tutor](#ai-interactive-tutor)
  - [Account Settings](#account-settings)
- [Theming & Dark Mode](#theming--dark-mode)
- [Scripts](#scripts)
- [Contributing](#contributing)

---

## Features

| Feature | Description |
|---|---|
| **AI Summarizer** | Paste any study material and receive a clean, markdown-formatted study guide with key concepts, bullet summaries, and a quick recap. |
| **Practice Quiz** | Auto-generates 5 multiple-choice questions from your content, scores your answers, and explains every correct answer. |
| **Exam Roadmap** | Input your exam name, subject, and date; the AI builds a progressive day-by-day study plan capped at 15 milestones with a final mock-exam revision day. |
| **AI Tutor** | A floating chat assistant (bottom-right of every page) powered by Groq that maintains full conversation history and answers academic questions in markdown. |
| **Account Settings** | Update display name, change password (with current-password re-authentication), and permanently delete your account with confirmation. |
| **Dark Mode** | Full dark/light theme toggle persisted in `localStorage`, applied via Tailwind's `class` strategy. |
| **Authentication** | Email/password sign-up & sign-in, Google OAuth (redirect flow), password reset via email, and friendly inline error messages. |

---

## Tech Stack

### Frontend

| Library | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | ~5.9 | Static typing |
| Vite | 7 | Dev server & build tool |
| React Router DOM | 7 | Client-side routing |
| Framer Motion | 12 | Page transition animations |
| Tailwind CSS | 3 | Utility-first styling |
| Lucide React | 0.575 | Icon set |
| React Markdown + remark-gfm | 10 / 4 | Render AI markdown output |
| TanStack React Query | 5 | Server state management (available for future use) |
| Zustand | 5 | Client state management (available for future use) |
| clsx + tailwind-merge | — | Conditional className utilities |

### Backend / Services

| Service | Purpose |
|---|---|
| Firebase Auth | User authentication (email/password + Google OAuth) |
| Firebase Firestore | Database (initialised and exported, ready for future features) |
| Firebase Storage | File storage (initialised and exported, ready for future features) |
| Groq AI (`llama-3.3-70b-versatile`) | All AI features — summarisation, quiz generation, roadmap planning, tutoring |

---

## Project Structure

```
STUDY HELPER/
├── public/
├── src/
│   ├── api/
│   │   ├── ai/
│   │   │   └── groq.ts            # All Groq AI calls (summarize, quiz, roadmap, chat)
│   │   └── firebase/
│   │       └── config.ts          # Firebase app init — exports auth, db, storage
│   ├── components/
│   │   ├── dashboard/
│   │   │   └── InteractiveTutor.tsx  # Floating AI chat widget (global)
│   │   └── layout/
│   │       └── ProtectedRoute.tsx    # Auth guard for all protected pages
│   ├── contexts/
│   │   ├── AuthContext.ts         # React context type definition
│   │   └── AuthProvider.tsx       # Auth state provider (wraps onAuthStateChanged)
│   ├── hooks/
│   │   └── useAuth.ts             # useAuth() convenience hook
│   ├── layouts/
│   │   └── AppLayout.tsx          # Sidebar, top header, dark mode toggle, page outlet
│   ├── pages/
│   │   ├── Login.tsx              # Sign in / sign up / forgot password
│   │   ├── Dashboard.tsx          # Home overview with stats and feature cards
│   │   ├── Summarizer.tsx         # AI note summariser
│   │   ├── QuizGenerator.tsx      # MCQ quiz generator + scored results review
│   │   ├── ExamRoadmap.tsx        # AI-generated personalised exam study planner
│   │   └── Settings.tsx           # Account settings — profile, password, danger zone
│   ├── App.tsx                    # Router setup with all routes
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global base styles and Tailwind component layer
├── tailwind.config.js             # Custom design tokens, dark mode config
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18 or later (check with `node -v`)
- **npm** (bundled with Node) — or yarn / pnpm if you prefer
- A **Firebase project** (free Spark plan is sufficient)
- A **Groq API key** (free tier available at [console.groq.com](https://console.groq.com))

---

### Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com) and create a new project.
2. In **Project Settings → General**, scroll to "Your apps" and add a **Web app**. Copy the config object — you will need these values for the `.env` file.
3. Enable **Authentication**:
   - Navigate to **Build → Authentication → Sign-in method**.
   - Enable **Email/Password**.
   - Enable **Google** and set your project's support email.
4. Enable **Firestore Database**: choose **Start in test mode** for local development.
5. Enable **Storage** (optional — the config exports it but the UI does not yet use it).

---

### Groq API Setup

1. Visit [console.groq.com](https://console.groq.com) and sign up for a free account.
2. Navigate to **API Keys** and click **Create API key**. Copy it.
3. The app uses the `llama-3.3-70b-versatile` model for all AI features (summarisation, quiz, roadmap, and chat). The free tier allows 14,400 requests/day.

---

### Environment Variables

Create a `.env` file in the project root. This file is already listed in `.gitignore` and will never be committed.

```env
# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Groq
VITE_GROQ_API_KEY=your_groq_api_key
```

All variables must be prefixed with `VITE_` so that Vite exposes them to the browser bundle.

---

### Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` with Hot Module Replacement enabled.

---

## Pages & Functionality

### Authentication

**Route:** `/login`

The login page handles four flows in a single view, toggled by the mode state:

- **Sign In** — authenticates with email and password via Firebase, then redirects to the dashboard after a short success animation.
- **Sign Up** — creates a new Firebase account with email and password.
- **Google OAuth** — uses `signInWithRedirect` (same-tab redirect) to avoid browser cross-origin popup restrictions. The result is consumed with `getRedirectResult` on the next page load.
- **Forgot Password** — the user enters their email and clicks *Forgot password*; a reset link is sent via `sendPasswordResetEmail`.

All Firebase error codes (e.g. `auth/email-already-in-use`, `auth/wrong-password`) are mapped to readable plain-English messages displayed inline above the form.

---

### Dashboard

**Route:** `/`

The landing page after a successful login. It displays:

- A **personalised greeting** using the user's first name (from display name or email prefix).
- Three **stat cards** — Daily Tokens used, Study Streak, and Topics Mastered. These are currently static and ready to be wired to Firestore for persistence.
- Four **feature cards** with direct links to each study tool.

---

### AI Smart Summarizer

**Route:** `/notes`

1. Paste any study notes, textbook excerpts, or article content into the left text area.
2. Click **Generate AI Summary**.
3. Groq processes the input and returns a structured markdown study guide containing:
   - A high-level overview
   - Key concepts and definitions
   - A bulleted summary of important points
   - A *Quick Recap* section
4. The result is rendered as formatted markdown in the right panel.
5. A **Copy** button copies the raw markdown text to the clipboard and shows a brief checkmark confirmation.

---

### Practice Quiz Generator

**Route:** `/quiz`

A three-step sequential flow:

| Step | Screen | Description |
|---|---|---|
| 1 | **Input** | Paste study material and click *Generate 5 MCQs*. |
| 2 | **Quiz** | Five questions are shown with four options each. A progress indicator at the top tracks how many questions have been answered. The selected option is highlighted in brand purple. |
| 3 | **Results** | Your score is displayed prominently. Every question is reviewed with the correct answer highlighted in green, your answer (if wrong) in red, and an expandable *Explain Why* toggle that reveals Groq's explanation for that question. |

The quiz can be fully reset at any point via the *Start New Quiz* button.

---

### Exam Roadmap

**Route:** `/roadmap`

1. Fill in three fields: **Exam Name** (free text, e.g. "WAEC Chemistry"), **Exam Date** (date picker), and **Focus Subject** (searchable dropdown with 13 presets plus free-text custom entry).
2. Click **Generate Study Plan**.
3. The app calculates days remaining until the exam (clamped between 3 and 30), sends this to Groq, and receives up to 15 progressive daily milestones. The final milestone is always a *"Final Review & Mock Exam"* day.
4. Each milestone card displays:
   - A numbered circle button (click to **mark complete / incomplete** — updates locally with a green checkmark and strikethrough).
   - The **topic title** and **specific focus activities** for that day.
   - A *Start Studying* shortcut link (for future routing to the relevant tool).
5. An **Overall Completion** progress bar on the left panel tracks how many milestones you've checked off as a percentage.
6. Click **Reset and Create New Roadmap** to clear everything and start fresh.

---

### AI Interactive Tutor

Available on **every page** as a floating button in the bottom-right corner.

- Click the bouncing chat bubble (with a green "online" indicator) to open a 400 × 600 px chat panel.
- Type any academic question and press **Enter** or the send arrow.
- The tutor sends the full **conversation history** as a messages array to Groq's chat completions API on each request, so it remembers earlier context within the session.
- All responses are rendered as markdown (supports tables, code blocks, bold, lists via remark-gfm).
- Close with the **×** button; the conversation persists in local state until the page refreshes.
- A typing indicator (spinning loader) is shown while the response is being generated.

---

### Account Settings

**Route:** `/settings`

The settings page has four sections. The password and danger-zone sections are only shown to users who signed up with **email/password** (Google-only accounts skip these, as Firebase handles credential management externally).

#### Profile
- Edit your **display name** — saved directly to Firebase via `updateProfile`. The avatar initials update live in the preview as you type.
- **Email address** is shown read-only (email change requires additional Firebase flows and is not currently supported in the UI).
- The *Save Changes* button is disabled until the value actually differs from the current display name.

#### Change Password
- Requires entering your **current password** — this is used to call `reauthenticateWithCredential` before `updatePassword`, which Firebase mandates for sensitive credential changes.
- Validates that the two new-password fields match and that the new password is at least 6 characters.
- All three fields have independent **show/hide** toggles.
- On success a brief *"Password Updated!"* confirmation is shown for 3 seconds.

#### Appearance
- Explains that the **dark / light mode toggle** is the sun/moon button in the top-right corner of the header bar. The preference is saved to `localStorage` and restored on every page load.

#### Danger Zone
- A two-step confirmation is required to prevent accidents:
  1. Click **Delete Account** — the form expands.
  2. Enter your password and click **Confirm Delete**.
- On confirmation, `reauthenticateWithCredential` is called first, then `deleteUser`. The user is then redirected to `/login`.

---

## Theming & Dark Mode

Tailwind is configured with `darkMode: 'class'`. `AppLayout` manages the theme:

```ts
// Read saved preference from localStorage on first render
const [dark, setDark] = useState(() =>
  localStorage.getItem("edupulse-theme") === "dark"
);

// Apply/remove the 'dark' class on <html> and persist the choice
useEffect(() => {
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("edupulse-theme", dark ? "dark" : "light");
}, [dark]);
```

### Custom Design Tokens (`tailwind.config.js`)

| Token | Value | Usage |
|---|---|---|
| `brand-primary` | `#6366F1` (indigo) | Buttons, active nav items, focus rings, accents |
| `brand-dark` | `#4338CA` | Hover state for primary actions |
| `brand-light` | `#F5F3FF` | Subtle backgrounds, selected option highlight |
| `brand-accent` | `#F59E0B` | Warning / highlight colour |
| `deep-space` | `#0B0F1A` | Dark mode page background |
| `sage-green` | `#10B981` | Success states, completed milestones |
| `muted-slate` | `#64748B` | Secondary / placeholder text |
| `surface-50/100/200/900` | Gray scale | Light mode surfaces and borders |

### Global Component Classes (`index.css`)

| Class | Applies |
|---|---|
| `.glass-card` | Frosted-glass card — `bg-white/80 backdrop-blur border` in light mode, `bg-white/5 border-white/10` in dark mode |
| `.btn-primary` | Brand-coloured button with scale hover and active effect |
| `.input-field` | Text input with rounded corners, focus ring, and dark-mode background switch |

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR at `localhost:5173` |
| `npm run build` | Type-check with `tsc`, then bundle with Vite into `dist/` |
| `npm run preview` | Serve the production build locally for final verification |
| `npm run lint` | Run ESLint across the entire `src/` directory |

---

## Contributing

1. Fork the repository and clone your fork locally.
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and ensure `npm run lint` and `npm run build` both pass.
4. Commit: `git commit -m "feat: describe your change"`
5. Push: `git push origin feature/my-feature`
6. Open a pull request against the `main` branch.
