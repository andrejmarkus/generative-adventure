# ⚔️ Generative Adventure

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-blue?style=for-the-badge&logoColor=white)](https://openrouter.ai/)

**Experience your unique AI-driven adventures as you want, wherever you want.**

Generative Adventure is a modern, AI-powered storytelling platform that brings your imagination to life. Using the power of LLMs (via OpenRouter), it generates immersive and dynamic narratives tailored to your choices.

---

## ✨ Features

- **🤖 AI Storytelling**: Dynamic and immersive adventures powered by **OpenRouter** (Llama 3.1 8B Free).
- **⚔️ Advanced Combat System**: A structured D20-based fight system with dynamic outcomes, vivid descriptions, and visceral feedback (screen shake).
- **🔐 Secure Authentication**: Integrated with **Auth.js** and **Google OAuth** for a seamless sign-in experience.
- **💾 Persistent Progress**: Your adventures, choices, and character stats are saved securely in **MongoDB**.
- **🎨 Retro Aesthetics**: A sleek, responsive user interface with a retro feel, built with **SvelteKit**, **Tailwind CSS**, **DaisyUI**, and a custom **Pixel Operator** font.
- **🌊 Streaming Responses**: Real-time AI chat responses for a fluid storytelling experience.

---

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **AI Engine**: [OpenRouter](https://openrouter.ai/)
- **Database**: [MongoDB](https://www.mongodb.com/)
- **Authentication**: [Auth.js](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
- **Forms**: [SvelteKit Superforms](https://superforms.rocks/) & [Zod](https://zod.dev/)

---

## 📸 Screenshots

_(Add your screenshots here to make it even more eye-catching!)_

| Welcome Page                                                                | Adventure Console                                                                |
| :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| ![Welcome Dashboard](https://via.placeholder.com/400x250?text=Welcome+Page) | ![Adventure Console](https://via.placeholder.com/400x250?text=Adventure+Console) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (recommended)
- [OpenRouter API Key](https://openrouter.ai/keys)
- [MongoDB](https://www.mongodb.com/)

### Environment Variables

Copy the example environment file and fill in your details:

```bash
cp .env.example .env
```

The following variables are required:

- `AUTH_SECRET`: Secret for session encryption.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: OAuth credentials from Google Cloud Console.
- `MONGODB_URI`: Connection string for your MongoDB database.
- `OPENROUTER_API_KEY`: API key for model inference.

---

## 🐳 Docker Deployment

You can run the entire stack (App + MongoDB) using Docker:

```bash
docker-compose up -d
```

The app will be available at `http://localhost:3000`.

---

## 📁 Project Structure

```text
src/
├── lib/               # Shared logic, components, and DB client
│   ├── db/            # MongoDB connection
│   └── index.js       # AI client initialization
├── routes/
│   ├── api/           # Backend API endpoints (Chat, Init, Stats)
│   ├── app/           # Dynamic adventure routes
│   └── +layout.svelte # Main application layout
├── auth.js            # Auth.js configuration
└── app.css            # Global styles, fonts and Tailwind imports
```

---

## 🛠️ Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Builds the application for production.
- `pnpm preview`: Previews the production build.
- `pnpm lint`: Runs ESLint and Prettier check.
- `pnpm format`: Runs Prettier to format the codebase.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<p align="center">Made with ❤️ for adventurers everywhere by Andrej Markuš.</p>
