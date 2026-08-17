# 🤖 Shikshyalaya College AI Chatbot
> 💬 *Your Smart Assistant for Shikshyalaya College — Powered by Groq AI*

![GitHub repo size](https://img.shields.io/github/repo-size/swikar-napit/Chat-bot)
![GitHub stars](https://img.shields.io/github/stars/swikar-napit/Chat-bot?style=social)
![GitHub forks](https://img.shields.io/github/forks/swikar-napit/Chat-bot?style=social)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Made with Love](https://img.shields.io/badge/Made%20with-%E2%9D%A4-red)
![Nepal](https://img.shields.io/badge/Made%20in-Nepal%20🇳🇵-blue)

---

## 🌐 Live Demo
👉 [Click here to try the chatbot](https://shikshyalayaai.vercel.app)

---

## 📌 Table of Contents
- [Introduction](#-introduction)
- [Features](#-features)
- [Why This Chatbot?](#-why-this-chatbot)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Roadmap](#-roadmap)
- [License](#-license)
- [Author](#-author)

---

## 📖 Introduction

**Shikshyalaya College AI Chatbot** is an intelligent, friendly assistant built specifically for **Shikshyalaya College, Lokanthali, Bhaktapur**.

Students can instantly ask about **programs, admissions, clubs, contacts, and campus life** — and get accurate answers in real time, without waiting for a human response.

> Affiliated with **Far Western University (FWU)** | Established **2024**

---

## ✨ Features

- 🎓 Answers questions about CSIT, BBA, and MBA programs
- 🤖 AI-powered responses using the Groq API
- 💬 Real-time chat with a typing indicator
- 📱 Fully responsive — works on mobile & desktop
- ⚡ Fast, no-login, no-install required
- 🔒 API key hidden securely on the backend (Vercel serverless function)
- 🛡️ Server-side system prompt — cannot be overridden or stripped from the client
- 🚦 Per-IP rate limiting to prevent abuse
- 🌐 Hosted live on Vercel
- 🙏 Nepali-friendly greeting (Namaste!)
- 🔒 College-specific knowledge only — no off-topic answers

---

## 🌟 Why This Chatbot?

Students often struggle to find quick answers about:
- Which program suits them?
- How to contact the college?
- What clubs or activities are available?

This chatbot solves that instantly:
- Faster than browsing the website ⚡
- Available 24/7 🕐
- Simple and easy to use 🧠
- No human staff needed for basic queries 💬

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling & Responsive Design |
| JavaScript (ES6+) | Chat logic (frontend) |
| Node.js (Vercel Serverless Function) | Secure backend API route |
| Groq API (`openai/gpt-oss-120b`) | AI responses |
| Google Fonts (Poppins) | Typography |
| Material Design Iconic Font | UI icons |

---

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/swikar-napit/Chat-bot.git
   cd Chat-bot
   ```

2. **Install the Vercel CLI** (for local serverless function support)
   ```bash
   npm install -g vercel
   ```

3. **Add your environment variable** — see [Environment Variables](#-environment-variables) below.

4. **Run locally**
   ```bash
   vercel dev
   ```
   This serves `index.html` and proxies requests to `api/chat.js` locally, exactly as it runs in production.

> Note: Opening `index.html` directly in a browser (without `vercel dev` or a deployed backend) will not work, since the frontend depends on the `/api/chat` serverless endpoint.

---

## 🔑 Environment Variables

Create a `.env` file locally (already excluded via `.gitignore`) or set this in your Vercel project settings:

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your API key from [console.groq.com](https://console.groq.com), used server-side only in `api/chat.js`. Never exposed to the browser. |

---

## 🚀 Usage

1. Open the live chatbot link (or your local `vercel dev` URL)
2. Type your question in the input box, or tap a quick-reply chip
3. Press **Enter** or click the **Send** button
4. Get an instant AI-powered answer!

**Example questions you can ask:**
- *"What programs does Shikshyalaya College offer?"*
- *"Tell me about the CSIT program"*
- *"How do I contact the college?"*
- *"What clubs are available?"*
- *"Who is the principal?"*

---

## 📁 Project Structure

```text
Chat-bot/
│
├── api/
│   └── chat.js          # Serverless backend: owns the system prompt, rate limiting,
│                         #   input sanitization, and the Groq API call
│
├── index.html            # Main chatbot markup
├── style.css              # Styling and responsive design
├── script.js               # Frontend chat logic (sending messages, rendering replies)
├── .gitignore                # Excludes .env and other local-only files from Git
└── README.md
```

---

## 🛡 Security

- The system prompt lives **only** in `api/chat.js` (server-side). It's never sent to or readable from the browser, so it can't be stripped or overridden by inspecting frontend code.
- The backend discards any `system`-role messages sent by the client — only `user`/`assistant` turns are forwarded, and only the latest user message is used (no conversation history is stored or replayed).
- Messages are capped at 800 characters server-side (600 client-side) to limit payload size and cost.
- A simple in-memory, per-IP rate limiter (12 requests/minute) throttles abusive traffic.
- The `GROQ_API_KEY` is read from an environment variable and never shipped to the client.

---

## 🗺 Roadmap

- [x] Basic chat interface
- [x] AI integration (Groq API)
- [x] College knowledge base
- [x] Mobile responsive design
- [x] Secure backend API key handling
- [x] Rate limiting
- [x] Live deployment on Vercel
- [ ] Persistent conversation memory (optional, opt-in)
- [ ] Analytics on common student questions

---

## 📄 License

Released under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Swikar Napit**
- GitHub: [@swikar-napit](https://github.com/swikar-napit)