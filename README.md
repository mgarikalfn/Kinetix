<div align="center">

# ⚡ Kinetix

### High-Velocity Project Management for Modern Engineering Teams

An agile, telemetry-driven project management platform built for speed, density, and keyboard-first workflows. Inspired by the sleek, minimalist aesthetics of Linear and Raycast.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-project--managment--ujod.vercel.app-6366f1?style=for-the-badge&logo=vercel&logoColor=white)](https://project-managment-ujod.vercel.app)

<br/>

[![Next.js](https://img.shields.io/badge/Next.js%2016-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Appwrite](https://img.shields.io/badge/Appwrite-FD366E?style=flat-square&logo=appwrite&logoColor=white)](https://appwrite.io/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel&logoColor=white)](https://project-managment-ujod.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-emerald?style=flat-square)](LICENSE)

<br/>

[**Explore Live App »**](https://project-managment-ujod.vercel.app) • [**Report Bug »**](https://github.com/mgarikalfn/project-managment/issues) • [**Request Feature »**](https://github.com/mgarikalfn/project-managment/issues)

</div>

---

## 🚀 Overview

**Kinetix** delivers an uninterrupted flow state for fast-moving product teams. Designed around an **Obsidian Kinetic** dark aesthetic, it combines dense information displays, fluid micro-interactions, and instant updates across tasks, projects, and workspace members.

- **🌐 Production URL**: [https://project-managment-ujod.vercel.app](https://project-managment-ujod.vercel.app)

---

## ✨ Key Features

### 📋 Multi-Perspective Task Engine
- **Kanban Board**: Drag-and-drop workflow columns (Backlog, Todo, In Progress, In Review, Done) with real-time state sync.
- **Data Table**: High-density spreadsheet view with column sorting, filtering, and inline actions.
- **Calendar View**: Chronological task deadlines and milestone tracking.

### 🏢 Workspaces & Project Hierarchies
- Isolate team contexts with distinct workspaces.
- Nested projects with customizable image avatars, analytics, and member scoping.
- Instant workspace join via cryptographic invite codes.

### 👥 Member Management & Access Control
- Granular permissions with **Admin** and **Member** roles.
- Team directory with real-time search, role management, and seat administration.

### 📊 Real-Time Activity & Audit Logs
- Comprehensive telemetry log tracking creation, updates, status transitions, and deletions.
- User attribution and human-readable diff change tracking.

### 💬 Threaded Discussion & Collaboration
- Contextual task comment streams with author avatars and timestamps.
- Like counters and real-time conversation feedback.

### 🔐 Flexible Authentication
- Google OAuth, GitHub OAuth, and traditional email/password credentials.
- Protected SSR routes and secure HTTP-only session cookies.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Server Components & Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Custom Glassmorphic Obsidian Tokens |
| **Backend & Auth** | [Appwrite Cloud](https://appwrite.io/) (Authentication, Databases, Storage) |
| **State & API** | [TanStack React Query](https://tanstack.com/query) + [Hono](https://hono.dev/) RPC |
| **UI Components** | Radix UI primitives, Lucide React, React Icons |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18.x or later
- An active [Appwrite](https://appwrite.io/) account and project

### 1. Clone & Install

```bash
git clone https://github.com/mgarikalfn/project-managment.git
cd project-managment
npm install
```

### 2. Environment Setup

Copy the sample environment configuration and fill in your Appwrite credentials:

```bash
cp .env.example .env.local
```

### 3. Run Locally

```bash
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) to view the application.

---

## 📦 Production Deployment

The project is pre-configured for seamless one-click deployments on Vercel:

```bash
npm run build
```

Ensure your environment variables are configured in **Vercel Project Settings ➔ Environment Variables**.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with precision for engineering speed. Powered by Next.js & Appwrite.</sub>
</div>
