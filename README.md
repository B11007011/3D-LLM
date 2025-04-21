# 3D-LLM: AI-Powered 3D Project Assistant

3D-LLM is an intelligent platform that combines 3D project management with AI capabilities to assist in creating, managing, and collaborating on 3D assets and projects.

## Features

- **Project Management**: Create and manage 3D projects with timelines, milestones, and tasks
- **Team Collaboration**: Invite team members, assign roles, and track contributions
- **File Management**: Organize, version, and track changes to 3D models and assets
- **AI Assistant**: Intelligent chat interface to guide you through project setup and tasks
- **Tool Integration**: Compare and choose the right tools for your 3D workflows
- **Analytics**: Track project progress, resource utilization, and team performance
- **3D Viewport**: Preview and interact with 3D assets (coming soon)

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI components
- **Backend**: Express.js, Node.js
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: Drizzle ORM
- **State Management**: React Query

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or pnpm

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/3D-LLM.git
   cd 3D-LLM
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Initialize the development database
   ```bash
   npm run init:db
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to http://localhost:3000

## Development

- **Client code**: Located in the `client/` directory
- **Server code**: Located in the `server/` directory
- **Shared code**: Located in the `shared/` directory

## Database Management

- SQLite is used for development and stored in the `data/` directory
- PostgreSQL is used for production
- Database schema is defined in `shared/schema.ts`
- Database migrations can be generated with `npm run db:push`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE) 