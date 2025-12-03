# Linode Manager

A web application for managing Linode instances locally. Built with Nuxt 4, Nuxt UI 4, Vue 3, TypeScript, ESLint, and Prettier.

## Features

- 📋 **List Linodes** - View all your Linode instances with status, specs, and controls
- ➕ **Create Linodes** - Deploy new instances with custom configurations
- 🔄 **Manage Instances** - Boot, shutdown, reboot, and delete Linodes
- 🚀 **Supabase Preset** - One-click deployment of self-hosted Supabase for development
- 📄 **Environment Files** - Generate .env files for connecting to your Linodes

## Prerequisites

- Node.js 20+
- npm 10+
- Linode API Token ([Get one here](https://cloud.linode.com/profile/tokens))

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Setup Script

This interactive script will guide you through configuring your Linode API token:

```bash
npm run setup
```

The setup script will:
- Prompt for your Linode API token
- Validate the token against the Linode API
- Create a `.env` file with your configuration

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Manual Configuration

If you prefer to configure manually, create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your Linode API token:

```env
LINODE_API_TOKEN=your_linode_api_token_here
```

## Supabase Development Instance

The app includes a pre-configured setup for deploying self-hosted Supabase instances:

1. Navigate to the **Supabase** tab
2. Configure your instance (label, region, type)
3. Click **Deploy Supabase Instance**
4. Download the generated `.env` file for your application

The deployment includes:
- Ubuntu 22.04 LTS with Docker
- Full Supabase stack (PostgreSQL, Auth, Storage, Realtime)
- Pre-generated secure keys and passwords
- Ready-to-use environment configuration

**Note:** Supabase takes approximately 5-10 minutes to fully initialize after the Linode is running.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run setup` | Run initial configuration wizard |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |

## Tech Stack

- **Framework:** [Nuxt 4](https://nuxt.com/)
- **UI Library:** [Nuxt UI 4](https://ui.nuxt.com/)
- **Frontend:** [Vue 3](https://vuejs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Linting:** [ESLint](https://eslint.org/)
- **Formatting:** [Prettier](https://prettier.io/)

## API Endpoints

The server provides the following API endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/linodes` | List all Linodes |
| POST | `/api/linodes` | Create a new Linode |
| GET | `/api/linodes/:id` | Get Linode details |
| DELETE | `/api/linodes/:id` | Delete a Linode |
| POST | `/api/linodes/:id/boot` | Boot a Linode |
| POST | `/api/linodes/:id/shutdown` | Shutdown a Linode |
| POST | `/api/linodes/:id/reboot` | Reboot a Linode |
| GET | `/api/linode-types` | List available types |
| GET | `/api/regions` | List available regions |
| GET | `/api/images` | List available images |
| GET | `/api/config/status` | Check configuration status |
| POST | `/api/supabase/create` | Create Supabase instance |

## Security

- Your Linode API token is stored locally in `.env` and never transmitted to third parties
- The `.env` file is excluded from git via `.gitignore`
- All API requests are made server-side through Nuxt's server routes

## License

MIT
