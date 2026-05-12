# AI Form Generator

An AI-powered form generation platform that lets users create dynamic web forms using natural language prompts.

Instead of manually building forms field by field, users can simply describe what they want, and the AI generates structured forms instantly.

---

## Features

- AI-powered form generation using natural language
- Smart chat interface for interacting with the AI
- Dynamic form schema generation
- Form preview rendering
- Conversation history support
- Persistent chat sessions
- Tool-calling based form creation
- Backend API for AI orchestration
- Form snapshot storage
- Authentication support
- Real-time AI streaming responses

---

## Project Structure

```bash
ai-form-generator/
│
├── client/     # Frontend application (Next.js / React)
├── server/     # Backend API (NestJS / Prisma / AI integration)
└── README.md
```

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel AI SDK (`useChat`)
- Axios

### Backend
- NestJS
- Prisma ORM
- PostgreSQL / MySQL
- Vercel AI SDK (`streamText`)
- Groq API
- Zod
- JWT Authentication

### AI
- Tool Calling
- Structured JSON generation
- Prompt engineering
- Streaming responses

---

## How It Works

1. User enters a prompt like:

```text
Create a login form with username and password fields
```

2. Backend sends conversation context to the AI model.

3. AI decides whether:
   - respond normally
   - ask for clarification
   - call the `createForm` tool

4. If tool is triggered:
   - structured form schema is generated
   - form snapshot is saved
   - frontend renders the generated form

---

## Form Schema Example

```json
{
  "message": "A simple login form has been created.",
  "title": "Login Form",
  "form": [
    {
      "name": "username",
      "type": "text",
      "label": "Username",
      "placeholder": "Enter your username",
      "required": true
    },
    {
      "name": "password",
      "type": "password",
      "label": "Password",
      "placeholder": "Enter your password",
      "required": true
    }
  ]
}
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/ayush-may/ai-form-generator.git
cd ai-form-generator
```

---

## Client Setup

```bash
cd client
npm install
```

Run:

```bash
npm run dev
```

---

## Server Setup

```bash
cd server
npm install
```

Create `.env`

```env
GROQ_API_KEY=
DATABASE_URL=
JWT_KEY=
PORT=8000
MAIL_USER=
APP_PASSWORD=
```

Run migrations:

```bash
npx prisma migrate dev
```

Start server:

```bash
npm run start:dev
```

---

## API Overview

### Chat Endpoint

```http
POST /chat
```

Handles:
- conversation context
- AI streaming
- tool execution
- form generation

---

### Conversations

```http
GET /conversations
GET /conversations/:id/messages
```

---

## Development Notes

Current implementation includes:

- AI tool execution tracking
- form snapshot persistence
- chat history caching
- frontend history restoration
- streaming assistant responses

---

## Future Improvements

- Drag & drop form editor
- Form export (JSON / HTML)
- Form submission handling
- Validation builder
- Shareable form links
- Theme customization
- Multi-step forms
- AI form refinement
- Deployment support

---

## Example Prompt Ideas

```text
Create a job application form
```

```text
Generate a customer feedback form
```

```text
Build a hotel booking form
```

```text
Create a registration form with email verification
```

---

## Author

Built by Ayush Sharma
