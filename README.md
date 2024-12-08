# Shambu: AI-Powered People Intelligence Platform

Shambu is a modern platform for visualizing and analyzing professional networks, powered by AI and built with cutting-edge technologies.

## Features

- 🌐 Interactive network visualization
- 👥 Comprehensive profile management
- 🔄 Real-time updates and notifications
- 🤖 AI-powered insights and recommendations
- 🔍 Advanced search capabilities
- 📱 Cross-platform support (Web, Mobile, Desktop)

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, D3.js
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Mobile**: React Native
- **Desktop**: Tauri
- **API**: REST + GraphQL
- **AI**: OpenAI API, Vector embeddings

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account
- PostgreSQL 15+

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/shambu.git
   cd shambu
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Supabase credentials and other configurations.

4. Set up the database:
   ```bash
   pnpm db:setup
   pnpm db:seed # Optional: Add sample data
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

## Project Structure

```
shambu/
├── apps/
│   ├── web/                 # Next.js web app
│   ├── mobile/             # React Native app
│   ├── desktop/            # Tauri app
│   ├── cli/               # Command-line interface
│   └── extension/         # Chrome extension
├── packages/
│   ├── shared/            # Shared types and utilities
│   └── ui/                # Shared UI components
├── database/
│   ├── schema.sql        # Database schema
│   ├── functions/        # PostgreSQL functions
│   └── seed.sql         # Sample data
└── docs/                 # Documentation
```

## Development

### Web App

```bash
cd apps/web
pnpm dev
```

### Mobile App

```bash
cd apps/mobile
pnpm start
```

### Desktop App

```bash
cd apps/desktop
pnpm tauri dev
```

## Documentation

- [Database Schema](docs/database/schema.md)
- [API Documentation](docs/api/README.md)
- [UI Components](docs/ui/README.md)
- [Deployment Guide](docs/deployment/README.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@shambu.ai or join our [Discord community](https://discord.gg/shambu).

## Credits
By Anshad Ameeenza, for Inaya Foundation