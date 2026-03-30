# Digital Guardians — Safe and Savvy Seniors

A modern, AI-powered web application designed to help seniors stay safe online. Digital Guardians provides scam detection, cybersecurity education, and interactive learning resources to build digital confidence.

**Live Site:** https://philipmag.github.io  
**Repository:** https://github.com/Philipmag/philipmag.github.io

---

## 🎯 Project Overview

Digital Guardians is a full-stack web application built with modern technologies to educate and protect seniors from online scams and cyber threats. The platform features:

- **AI-Powered Scam Analyzer** — Analyze suspicious messages and emails in real-time
- **Interactive Learning Center** — Guided articles on email basics, passwords, scam spotting, and safe browsing
- **Quiz System with Scoring** — Test knowledge and track progress with interactive quizzes
- **Tech Help Assistant** — Get step-by-step guidance for common technical issues
- **Contact Form** — Submit questions or report issues directly to the team
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile devices

---

## 🛠️ Technology Stack

### Frontend
- **React 19** — Modern UI library with hooks and concurrent features
- **Vite 7** — Lightning-fast build tool and dev server
- **TypeScript** — Type-safe JavaScript development
- **Tailwind CSS 4** — Utility-first CSS framework
- **Framer Motion** — Smooth animations and transitions
- **shadcn/ui** — High-quality React components
- **Wouter** — Lightweight client-side router

### Backend
- **Express 4** — Lightweight Node.js web framework
- **tRPC 11** — End-to-end typesafe APIs
- **Drizzle ORM** — Type-safe database queries
- **MySQL/TiDB** — Relational database

### Development & Testing
- **Vitest** — Fast unit testing framework
- **TypeScript** — Static type checking
- **Prettier** — Code formatting
- **ESLint** — Code quality

---

## 📁 Project Structure

```
digital-guardians-redesign/
├── src/                          # Frontend source code
│   ├── pages/                    # Page components (Home, Learn, Resources, etc.)
│   ├── components/               # Reusable UI components
│   ├── contexts/                 # React contexts (Quiz, Theme, etc.)
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions and tRPC client
│   ├── App.tsx                   # Main app component with routing
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles and Tailwind config
├── server/                       # Backend source code
│   ├── routers.ts                # tRPC procedure definitions
│   ├── db.ts                     # Database query helpers
│   ├── storage.ts                # S3 file storage helpers
│   ├── scamAnalyzer.ts           # AI scam analysis logic
│   ├── contact.ts                # Contact form handler
│   ├── _core/                    # Core server infrastructure
│   │   ├── index.ts              # Express app setup
│   │   ├── context.ts            # tRPC context with auth
│   │   ├── oauth.ts              # OAuth authentication
│   │   ├── llm.ts                # LLM integration
│   │   ├── vite.ts               # Vite dev server integration
│   │   └── ...
│   └── *.test.ts                 # Vitest test files
├── shared/                       # Shared types and constants
│   ├── types.ts                  # TypeScript types
│   └── const.ts                  # Constants
├── drizzle/                      # Database schema and migrations
│   ├── schema.ts                 # Table definitions
│   └── migrations/               # SQL migration files
├── public/                       # Static assets (favicon, robots.txt, etc.)
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration
├── vitest.config.ts              # Vitest configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (with npm or pnpm)
- **Git** for version control
- **GitHub account** (for deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Philipmag/philipmag.github.io.git
   cd philipmag.github.io
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file with required variables (provided by Manus):
   ```bash
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   VITE_APP_ID=your_oauth_app_id
   OAUTH_SERVER_URL=your_oauth_server
   # ... other env vars
   ```

4. **Start the development server:**
   ```bash
   pnpm dev
   ```

   The app will be available at `http://localhost:3000`

---

## 📝 Available Scripts

### Development
```bash
pnpm dev              # Start dev server with hot reload
pnpm dev:gh-pages    # Start dev server with GitHub Pages config
```

### Building
```bash
pnpm build           # Build for production
pnpm build:gh-pages  # Build for GitHub Pages deployment
```

### Testing
```bash
pnpm test            # Run all vitest tests
pnpm test:watch      # Run tests in watch mode
```

### Code Quality
```bash
pnpm format          # Format code with Prettier
pnpm check           # Type check with TypeScript
```

### Database
```bash
pnpm db:push         # Push schema changes to database
```

### Deployment
```bash
pnpm deploy:gh-pages # Build and deploy to GitHub Pages
pnpm clean:gh-pages  # Remove GitHub Pages build artifacts
```

---

## 🎨 Features

### 1. AI-Powered Scam Analyzer
Analyze suspicious messages, emails, and texts to identify potential scams. The AI identifies common scam patterns and provides clear, actionable advice.

**How it works:**
- User pastes a message or email
- AI analyzes for scam indicators
- Returns risk assessment and recommendations
- Explains why something might be suspicious

### 2. Interactive Learning Center
Four comprehensive guides covering essential cybersecurity topics:

- **Email Basics** — Understanding email structure, recognizing phishing
- **Passwords** — Creating strong passwords, password managers
- **Spotting Scams** — Common scam types and red flags
- **Safe Browsing** — Secure browsing habits and online safety

Each guide includes:
- Detailed explanations with examples
- Interactive quiz with scoring
- Real-world scenarios
- Actionable tips

### 3. Quiz System with Scoring
Test knowledge with interactive quizzes on each learning guide:
- Multiple-choice questions
- Instant feedback (correct/incorrect)
- Score tracking and progress
- Encouragement and learning reinforcement

### 4. Tech Help Assistant
Get step-by-step guidance for common technical issues:
- Browser troubleshooting
- Email setup and security
- Device updates and maintenance
- Account recovery

### 5. Contact & Support
Submit questions, report issues, or provide feedback:
- Category-based form (General, Bug Report, Feature Request, etc.)
- Direct communication with the team
- Owner notifications for urgent issues

---

## 🔧 Development Workflow

### Adding a New Feature

1. **Update the database schema** (if needed):
   ```bash
   # Edit drizzle/schema.ts
   pnpm db:push
   ```

2. **Create backend procedures** in `server/routers.ts`:
   ```typescript
   export const appRouter = router({
     myFeature: publicProcedure
       .input(z.object({ /* ... */ }))
       .query(async ({ input }) => {
         // Implementation
       }),
   });
   ```

3. **Build frontend UI** in `src/pages/` or `src/components/`:
   ```typescript
   const { data, isLoading } = trpc.myFeature.useQuery(params);
   ```

4. **Write tests** in `server/*.test.ts`:
   ```bash
   pnpm test
   ```

5. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin main
   ```

### Code Style

- **TypeScript** — Strict mode enabled
- **Prettier** — Auto-format on save
- **ESLint** — Code quality checks
- **Tailwind CSS** — Utility-first styling

---

## 🧪 Testing

Run all tests:
```bash
pnpm test
```

Test files are located alongside source files with `.test.ts` extension:
- `server/scamAnalyzer.test.ts` — AI scam analysis tests
- `server/contact.test.ts` — Contact form tests
- `server/auth.logout.test.ts` — Authentication tests

---

## 🚢 Deployment

### GitHub Pages Deployment

The project is configured for automatic GitHub Pages deployment:

1. **Build for GitHub Pages:**
   ```bash
   GITHUB_PAGES=true pnpm run build:gh-pages
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Verify deployment:**
   - GitHub Pages will automatically build and deploy
   - Visit: https://philipmag.github.io
   - Check deployment status: Settings → Pages

### Environment-Specific Configuration

- **Development:** `pnpm dev` uses local database
- **Production:** `pnpm build` optimizes for performance
- **GitHub Pages:** `GITHUB_PAGES=true pnpm build:gh-pages` prepares for static hosting

---

## 📚 Documentation

- **[GitHub Pages Setup](./GITHUB_PAGES_SETUP.md)** — Detailed GitHub Pages configuration
- **[SSH Key Setup](./SSH_KEY_SETUP.md)** — How to set up GitHub SSH authentication
- **[Push Script Guide](./PUSH_SCRIPT_GUIDE.md)** — Instructions for the push-to-github.sh script

---

## 🤝 Contributing

### Reporting Issues
Found a bug? Have a feature request?
1. Go to the Contact page on the site
2. Fill out the form with details
3. Submit — the team will be notified

### Making Changes
1. Create a new branch: `git checkout -b feature/your-feature`
2. Make your changes and test: `pnpm test`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Create a Pull Request on GitHub

---

## 📊 Project Statistics

- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Express, tRPC, Drizzle ORM
- **Testing:** 22+ vitest tests (all passing)
- **Performance:** Optimized builds, lazy loading, code splitting
- **Accessibility:** WCAG 2.1 AA compliant
- **Mobile:** Fully responsive design

---

## 🔐 Security

- **Authentication:** Manus OAuth integration
- **Database:** Encrypted connections, SQL injection prevention
- **API:** tRPC type-safe endpoints, input validation
- **Secrets:** Environment variables, no hardcoded credentials
- **HTTPS:** All connections encrypted

---

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📄 License

This project is part of the Digital Guardians nonprofit initiative. For licensing information, please contact the team.

---

## 👥 Team

**Digital Guardians** is built to serve seniors and their families. The project is maintained by a dedicated team focused on cybersecurity education and online safety.

**Contact:** Use the Contact form on the website to reach the team.

---

## 🙏 Acknowledgments

- **Manus Platform** — Hosting and infrastructure
- **React Community** — Modern UI patterns and best practices
- **shadcn/ui** — Beautiful component library
- **Tailwind CSS** — Utility-first styling framework

---

## 📞 Support

### Getting Help

1. **Check the Learning Center** — Most questions are answered in our guides
2. **Use the Contact Form** — Submit questions directly from the website
3. **Review Documentation** — See the docs folder for detailed guides

### Troubleshooting

**Dev server won't start:**
```bash
pnpm install
pnpm dev
```

**Tests failing:**
```bash
pnpm test --reporter=verbose
```

**Build errors:**
```bash
rm -rf node_modules dist
pnpm install
pnpm build
```

---

## 🎯 Roadmap

Future enhancements planned for Digital Guardians:

- [ ] Multi-language support (Spanish, Mandarin, etc.)
- [ ] Mobile app (iOS/Android)
- [ ] Video tutorials for visual learners
- [ ] Community forum for peer support
- [ ] Personalized learning paths
- [ ] Progress tracking and certificates
- [ ] Integration with cybersecurity resources
- [ ] Accessibility improvements (screen reader optimization)

---

**Last Updated:** March 2026  
**Version:** 1.0.0  
**Status:** Active Development

---

For more information, visit: https://philipmag.github.io
