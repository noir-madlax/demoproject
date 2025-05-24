# Next.js Supabase App

A modern full-stack web application built with Next.js 14, Supabase, and OpenRouter integration.

## Features

- ⚡ **Next.js 14** with App Router and Server Components
- 🗄️ **Supabase** for database and authentication
- 🤖 **OpenRouter** for AI/LLM integration
- 🎨 **Tailwind CSS** for styling
- 🔒 **Authentication** with Supabase Auth
- 💬 **AI Chat** functionality
- 🚀 **Vercel** ready for deployment

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: OpenRouter API
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenRouter account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nextjs-supabase-app
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

You need to set up the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |
| `OPENROUTER_API_KEY` | Your OpenRouter API key | Yes |
| `NEXT_PUBLIC_SITE_URL` | Your site URL (for OpenRouter referrer) | No |

## Project Structure

```
src/
├── app/
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Dashboard with AI chat
│   ├── api/
│   │   └── chat/          # AI chat API endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   └── openrouter.ts      # OpenRouter API configuration
└── components/            # Reusable components (add your own)
```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

In your Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_SITE_URL` (set to your production URL)

## Features Overview

### Authentication
- User registration and login
- Supabase Auth integration
- Protected routes

### AI Chat
- OpenRouter integration
- Multiple AI models support
- Real-time chat interface

### Database
- Supabase PostgreSQL
- Real-time subscriptions ready
- Type-safe database queries

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you have any questions or need help, please open an issue on GitHub. 