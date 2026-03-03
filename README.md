🎯 Overview
Quantum_Bots is a high-security file-sharing platform built for the AMDA Slingshot challenge. It prioritizes user privacy through a "Fail-Closed" architecture, ensuring every file is scanned by AI before entering the vault. No login required, no tracking, and complete anonymity for users who need to share files securely.

LIVE SERVER: https://dropp.onrender.com

Why Quantum_Bots?
🔒 True Privacy - No user accounts, no tracking, no data retention

🤖 AI-First Security - Every file is moderated before upload

⏰ Self-Destructing - Files automatically vanish after their time

☁️ Cloud-Native - Built for scalability on AMD-powered infrastructure

✨ Key Features
🛡️ AI-Safety Gate
Integrated with OpenAI Moderation API to scan and block harmful content at the source. Files are analyzed before any storage occurs, ensuring zero tolerance for policy violations.

⏰ The Death Clock
Automated file destruction using MongoDB TTL indexes. Every file has an expiration time—once it passes, the metadata is permanently deleted. No digital footprint left behind.

☁️ Cloud-Native Storage
Secure asset management via Cloudinary CDN with automatic optimization, transformation, and global delivery.

🔒 Privacy First Architecture
No login required
No user tracking or analytics
100% encrypted transit (HTTPS)
Zero-knowledge philosophy

📊 Real-time Status
Live health checks and system monitoring for 100% uptime assurance.
Backend: FastAPI, OpenAI SDK, Cloudinary, Motor (MongoDB Driver).

System Flow:
User → Frontend → Backend API → AI Moderation → Cloudinary Storage → MongoDB Record
        ↑              ↑              ↑                  ↑                  ↑
      React          FastAPI       OpenAI              CDN              TTL Index

🛠️ Tech Stack
Backend:
FastAPI - High-performance Python web framework
OpenAI SDK - Content moderation API
Cloudinary - Media storage and optimization
Motor - Async MongoDB driver
Pydantic - Data validation

Frontend:
React - UI library
Vite - Build tool and dev server
Tailwind CSS - Utility-first styling
Lucide Icons - Beautiful icons
Axios - API client

Infrastructure:
Render - Hosting and CI/CD
MongoDB Atlas - Database
Cloudinary - CDN and media management
GitHub Actions - CI/CD pipeline
