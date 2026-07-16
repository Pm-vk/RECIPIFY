# RECIPIFY 🍳

**RECIPIFY** is a modern, full-stack application built to discover, manage, and generate recipes effortlessly using the power of AI.

## 🚀 Tech Stack

### Frontend
- **Framework:** [Next.js 16](https://nextjs.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **AI Integration:** [Google Generative AI](https://ai.google.dev/) (Gemini)
- **UI Components:** [Radix UI](https://www.radix-ui.com/), Lucide React
- **Security & Bot Protection:** [Arcjet](https://arcjet.com/)
- **PDF Export:** [React-PDF](https://react-pdf.org/)

### Backend
- **Framework:** [Strapi v5](https://strapi.io/) (Headless CMS)
- **Database:** PostgreSQL
- **Plugins:** Strapi Users & Permissions, Strapi Cloud

## 📂 Project Structure

- `/frontend` - The Next.js application containing the user interface, authentication, and AI-powered recipe generation logic.
- `/backend` - The Strapi application providing robust content management, database schema, and API endpoints.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- npm or yarn
- PostgreSQL (for the Strapi backend)

### Setup the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file based on `.env.example`. Make sure your PostgreSQL database is running and credentials match.
4. Run the development server:
   ```bash
   npm run develop
   ```

### Setup the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` or `.env` file with your required environment variables (Clerk keys, Google Generative AI API key, Strapi URL, Arcjet key).
4. Run the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📄 License
This project is open-source.
