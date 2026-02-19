# ⚔️ Generative Adventure

[![SvelteKit](https://img.shields.io/badge/SvelteKit-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)](https://kit.svelte.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Ollama](https://img.shields.io/badge/Ollama-black?style=for-the-badge&logo=ollama&logoColor=white)](https://ollama.com/)

**Experience your unique AI-driven adventures as you want, wherever you want.**

Generative Adventure is a modern, AI-powered storytelling platform that brings your imagination to life. Using the power of LLMs (Llama 3.2), it generates immersive and dynamic narratives tailored to your choices.

---

## ✨ Features

-   **🤖 AI Storytelling**: Dynamic and immersive adventures powered by **Ollama** and **Llama 3.2**.
-   **🔐 Secure Authentication**: Integrated with **Auth.js** and **Google OAuth** for a seamless sign-in experience.
-   **💾 Persistent Progress**: Your adventures and choices are saved securely in **MongoDB**.
-   **🎨 Retro Aesthetics**: A sleek, responsive user interface with a retro feel, built with **SvelteKit**, **Tailwind CSS**, **DaisyUI**, and a custom **Pixel Operator** font.
-   **🐳 Dockerized**: Fully containerized environment for easy development and deployment.
-   **🌊 Streaming Responses**: Real-time AI chat responses for a fluid storytelling experience.

---

## 🛠️ Tech Stack

-   **Framework**: [SvelteKit](https://kit.svelte.dev/)
-   **AI Engine**: [Ollama](https://ollama.com/) (Llama 3.2)
-   **Database**: [MongoDB](https://www.mongodb.com/)
-   **Authentication**: [Auth.js](https://authjs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)
-   **Forms**: [SvelteKit Superforms](https://superforms.rocks/) & [Zod](https://zod.dev/)

---

## 📸 Screenshots

*(Add your screenshots here to make it even more eye-catching!)*

| Welcome Page | Adventure Console |
| :--- | :--- |
| ![Welcome Dashboard](https://via.placeholder.com/400x250?text=Welcome+Page) | ![Adventure Console](https://via.placeholder.com/400x250?text=Adventure+Console) |

---

## 🚀 Getting Started

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18+)
-   [pnpm](https://pnpm.io/) (recommended)
-   [Ollama](https://ollama.com/) (running locally or accessible via network)
-   [MongoDB](https://www.mongodb.com/) (running or via Docker)

### Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Auth.js
AUTH_SECRET="your-auth-secret" # Generate one: openssl rand -base64 32
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# MongoDB
MONGODB_URI="mongodb://localhost:27017"
MONGODB_NAME="generative-adventure"

# App
PUBLIC_BASE_URL="http://localhost:5173"
```

### Installation

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/generative-adventure.git
    cd generative-adventure
    ```

2.  **Install dependencies**:

    ```bash
    pnpm install
    ```

3.  **Run Ollama and pull the model**:

    ```bash
    # Ensure Ollama is running first
    ollama run llama3.2
    ```

4.  **Start the development server**:

    ```bash
    pnpm dev
    ```

---

## 🐳 Docker Deployment

To run the entire stack (App + MongoDB) using Docker:

1.  **Build and run**:

    ```bash
    docker compose up --build -d
    ```

2.  Access the application at `http://localhost:3000`.

*Note: If Ollama is running outside the Docker network, ensure its API is reachable (e.g., set `OLLAMA_HOST` properly in the app container).*

---

## 📁 Project Structure

```text
src/
├── lib/               # Shared logic, components, and DB client
│   ├── db/            # MongoDB connection
│   └── index.js       # Ollama client initialization
├── routes/
│   ├── api/           # Backend API endpoints (Chat, Init, Stats)
│   ├── app/           # Dynamic adventure routes
│   └── +layout.svelte # Main application layout
├── auth.js            # Auth.js configuration
└── app.css            # Global styles, fonts and Tailwind imports
```

---

## 🛠️ Scripts

-   `pnpm dev`: Starts the development server.
-   `pnpm build`: Builds the application for production.
-   `pnpm preview`: Previews the production build.
-   `pnpm lint`: Runs ESLint and Prettier check.
-   `pnpm format`: Runs Prettier to format the codebase.

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
