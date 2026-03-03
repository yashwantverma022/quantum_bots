🛡️ Quantum_Bots: NoLogin.in
Secure, AI-Moderated, Zero-Footprint File Sharing

Quantum_Bots is a high-security file-sharing platform built for the AMDA Slingshot. It prioritizes user privacy through a "Fail-Closed" architecture, ensuring every file is scanned by AI before entering the vault.

🚀 Live Links
Frontend: https://dropp.onrender.com

Backend API: https://quantum-bots-backend.onrender.com

✨ Key Features
AI-Safety Gate: Integrated with OpenAI Moderation to block harmful content at the source.

The Death Clock: Automated file destruction using MongoDB TTL indexes—no digital footprint left behind.

Cloud-Native Storage: Secure asset management via Cloudinary CDN.

Privacy First: No login required, no tracking, and 100% encrypted transit.

🏗️ Technical Architecture
The project uses a Monorepo structure, deployed as two separate services on Render:

Plaintext
.
├── backend/                # FastAPI (Python) - Hosted as a Web Service
│   ├── myapi.py            # Main API gateway & AI Logic
│   └── requirements.txt    # Backend dependencies
├── quick-start-landing/    # React (Vite) - Hosted as a Static Site
│   ├── src/                # Frontend source code
│   └── package.json        # Frontend dependencies
└── README.md               # You are here!
🛠️ Tech Stack
Backend: FastAPI, OpenAI SDK, Cloudinary, Motor (MongoDB Driver).

Frontend: React, Tailwind CSS, Lucide Icons.

Infrastructure: Render (CI/CD via GitHub), MongoDB Atlas, Cloudinary.
