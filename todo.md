# Project TODO

- [x] Basic homepage layout with Nordic Clarity design
- [x] Navigation menu (simplified, clean)
- [x] Hero section with shield image and CTAs
- [x] Scam Analyzer section with simulated analysis
- [x] How It Works section (3-step cards)
- [x] Learning Center section
- [x] About Us section (4 values)
- [x] Emergency section with reporting links
- [x] Footer with organized links
- [x] Resources page with searchable/filterable cards
- [x] PPTX download on Resources page
- [x] Responsive design (mobile, tablet, desktop)
- [x] Smooth scroll-triggered animations
- [x] Upgrade to full-stack with web-db-user feature
- [x] Build AI-powered scam analysis backend API endpoint
- [x] Update frontend Scam Analyzer to call real AI backend
- [x] Write vitest tests for the AI scam analysis endpoint
- [x] Redesign UI to match Yeldra.com deep blue/black aesthetic
- [x] Add anime-style visual elements and illustrations
- [x] Add Digital Security for Seniors PPTX to Resources page
- [x] Update color scheme to deep blue/black with Yeldra-inspired gradients
- [x] Update typography and spacing to match Yeldra
- [x] Generate anime-style hero and section images
- [x] Ensure dark theme consistency across all sections
- [x] Create reusable ArticleLayout component for guide pages
- [x] Build Email Basics guide article page with detailed content
- [x] Build Passwords guide article page with detailed content
- [x] Build Spotting Scams guide article page with detailed content
- [x] Build Safe Browsing guide article page with detailed content
- [x] Add routes for all guide article pages in App.tsx
- [x] Update Learning Center section links to point to article pages
- [x] Update Resources page "View Guide" buttons to link to articles
- [x] Add breadcrumb navigation and back links on article pages
- [x] Write vitest tests for article routing
- [x] Update logo to DigitalGuardianslogo.png across the site
- [x] Upload training photos to CDN and add slideshow component
- [x] Add training photo slideshow to Home page (past trainings section)
- [x] Add Digital Security for Seniors PPTX to Resources
- [x] Add Seniors Cybersecurity and Video Skills PDF to Resources
- [x] Add DigitalGuardiansCybersecurityTraining PPTX to Resources (if not already)
- [x] Upgrade AI analyzer to dual-mode: Scam Analyzer + Ask AI for Help
- [x] Build AI tech help backend endpoint for step-by-step guides
- [x] Update frontend with tab-based UI for both AI modes
- [x] Write vitest tests for new AI tech help endpoint
- [x] Push changes to GitHub
- [x] Update logo to new transparent background version
- [x] Rename "Check for Scams" to "AI Assistant" in navbar and throughout site
- [x] Add interactive quiz scoring to Learning Center guide pages
- [x] Build Contact Us form page with backend endpoint
- [x] Add Contact Us to navigation
- [x] Write vitest tests for Contact Us endpoint
- [x] Push all changes to GitHub
- [x] Upload new sharp logo (DigitalGuardianslogo5) to CDN and replace site-wide
- [x] Add neon white light animation around the logo in the navbar
- [x] Move Contact form into About page and remove Contact from nav
- [x] Configure Vite for GitHub Pages deployment
- [x] Add build:gh-pages npm script
- [x] Add deploy:gh-pages npm script
- [x] Create GitHub Pages setup documentation
- [x] Test GitHub Pages build locally
- [x] Verify build output in repository root
- [x] Flatten repository structure: move client/ to root
- [x] Update vite.config.ts to use root as project root
- [x] Update server/_core/vite.ts to reference root index.html
- [x] Create index.html at project root
- [x] Verify build works with flattened structure
- [x] All tests pass (22 tests)
- [x] Create comprehensive README.md for the project
- [x] Create AccessibilityContext for text size and contrast state management
- [x] Build AccessibilityToggle component with UI controls
- [x] Add accessibility CSS variables and high-contrast styles
- [x] Integrate accessibility toggle into Navbar
- [x] Write tests for accessibility features
- [x] Update contact form email to info@digitalguards.ca
- [x] Remove old support@digitalguardians.org email
- [x] Create animated cybersecurity network background component
- [x] Add "Cybersecurity4 Seniors" animated mantra to Learn section
- [x] Fix message analyzer API endpoint (working on dev server, requires backend)
- [x] Add hover effects to tab switching in AI Assistant section
- [x] Highlight current active page/tab with visual indicator
- [x] Add cybersecurity web background animation blending into dark background
- [x] Add all 4 senior photos to website (natural, photorealistic images)
- [x] Create enhanced animated network background with blue-cyan gradient
- [x] Slow down network background animation speed for calming effect
- [x] Integrate senior photos into Hero and About sections
- [x] Deploy to Manus hosting with custom domain support
- [x] Fix animated network background not showing on deployed site
- [x] Update all email references to info@digitalguards.ca
- [x] Add phone number +1 (705) 772-5140 to contact/about sections
- [x] Fix navigation highlighting - only current page should be lit (IntersectionObserver-based)
- [x] Remove duplicate AI Assistant nav link (merged into Try AI Assistant CTA button)
- [x] Add copy/share functionality to scam analysis results
- [x] Identify and implement missing UI principles for better UX
- [x] Add ScrollToTop button for easy navigation
- [x] Add Toast notification system for user feedback
- [x] Add SkipToContent link for keyboard accessibility
- [x] Add PageProgress scroll indicator bar
- [x] Enhanced focus ring styles for keyboard navigation
- [x] Better text selection colors
- [x] Smooth transitions on all interactive elements
- [x] Optimize page load times and tab transitions (animations reduced to 150-200ms)
- [x] Add Canadian Anti-Fraud Centre scam alerts feed to homepage
- [x] Fix favicon/logo for search results and browser tabs (ICO + apple-touch-icon + manifest)
- [x] Improve SEO with meta tags, structured data, Open Graph, and JSON-LD for all pages
- [x] Text size toggle and high contrast mode verified working (already implemented)
- [x] Fix blank favicon in browser tabs (multi-size ICO + PNG fallbacks)
- [x] Fix broken senior video call image (re-uploaded to CDN)
- [x] Fix animated network background in Learn section
- [x] Extend animated network background to entire website (global)
- [x] Boost network background visibility with bright cyan particles and higher opacity
- [x] Fix network background hidden by page bg-background — removed opaque background from page root divs

- [x] Fix blank white page on Safari iOS — replaced all oklch() CSS values with RGB fallbacks for cross-browser compatibility
- [x] Fix canvas background color from oklch to rgb for Safari iOS canvas support
- [x] Add prefers-reduced-motion support to network background animation

## Calendar & Training Sessions Feature
- [x] Add `events` table to drizzle schema (id, title, description, date, location, capacity, type)
- [x] Add `trainingRequests` table to drizzle schema (id, name, email, phone, preferredDate, message, status, createdAt)
- [x] Run pnpm db:push to migrate schema
- [x] Add server DB helpers for events and training requests
- [x] Add tRPC procedures: list events, get event, submit training request
- [x] Seed initial upcoming events in the database
- [x] Build Calendar page with upcoming events list and tab switcher
- [x] Build Training Request form with name, email, phone, preferred date, topics, message
- [x] Add owner notification on new training request submission
- [x] Add Calendar link to Navbar (Events)
- [x] Add Calendar route to App.tsx (/calendar)
- [x] Write vitest tests for calendar procedures (11 tests)
- [x] Add monthly calendar grid view to the Events page (enhancement — already implemented in Calendar.tsx)
- [x] Save checkpoint and publish

## ## Calendar Updates — June 21, 2026
- [x] Fix location from Barrie to Peterborough, Ontario across the site (index.html, SEO, structured data)
- [x] Update events DB: add `dateConfirmed` boolean and `sessionSlot` field (morning/afternoon) to schema
- [x] Clear existing seeded events and re-seed: June 21, 2026 morning + afternoon as confirmed; other events as TBD
- [x] Add `eventSignups` table for session registrations (name, email, phone, session preference, eventId)
- [x] Add tRPC procedure: signUpForSession (public, with validation)
- [x] Update Calendar page: show June 21, 2026 as confirmed with sign-up button; show other events as "Date TBD"
- [x] Add session sign-up modal/form on the Calendar page for June 21 sessions
- [x] Notify owner on new session sign-up
- [x] Run tests and save checkpoint (33 tests passing)

## Email Receipt for Session Sign-Up
- [x] Research available email sending API in Manus built-in APIs (no built-in user email; using Resend external service)
- [~] Add sendConfirmationEmail helper to server (DEFERRED — requires Resend API key)
- [~] Update signUpForEvent procedure to send email receipt (DEFERRED)
- [~] Email receipt content (DEFERRED)
- [x] Update sign-up modal UI with polished success confirmation screen (green checkmark, session details, what to bring, contact info)
- [x] Save checkpoint and publish

## Event Date Update — June 21 → June 28, 2026
- [x] Update seed-events-v2.mjs: change June 21 timestamps to June 28, 2026
- [x] Re-run seed script to update database events
- [x] Update Calendar.tsx: all "June 21" text references changed to "June 28, 2026"
- [x] Create church bulletin announcement (PDF) for June 28 event with full program/agenda
- [x] Create promotional poster for June 28 event (similar style to June 22 poster)
- [x] Run tests (33 passing) and save checkpoint

## Resources Page Update — June 28, 2026
- [x] Upload DigitalGuardians_Cybersecurity_2026.pptx to CDN and replace Seniors Cybersecurity Training resource
- [x] Upload DigitalSecurity_Seniors_2026_Redesigned.pptx to CDN and replace Digital Security for Seniors resource
- [x] Upload Staying_Connected_Seniors_Guide.pptx to CDN and replace Seniors Cybersecurity & Video Skills resource
- [x] Upload AIforSeniors_ChatGPT_Guide_2026_Redesigned.pptx to CDN and add as new AI for Seniors resource
- [x] Update all descriptions to accurately reflect actual file content
- [x] Run tests (33 passing) and save checkpoint

## Performance Optimisation
- [x] Code-split all routes with React.lazy + Suspense (eliminate 1.1MB monolithic bundle)
- [x] Add manual Rollup chunks for vendor libs (framer-motion, recharts, radix-ui, trpc)
- [x] Reduce canvas particle count and O(n²) connection loop in EnhancedNetworkBackground
- [x] Add loading="lazy" + decoding="async" to all below-fold images
- [x] Add fetchpriority="high" + loading="eager" to LCP hero image
- [x] Add <link rel="preload"> for hero image in index.html
- [x] Add font-display: swap and subset Google Fonts URL
- [x] Isolate framer-motion into its own lazy chunk (not on critical path)
- [x] Add will-change: transform to animated canvas element

## Server-Side Performance Fix (June 28)
- [x] Add in-memory user cache (5-min TTL) to skip DB read on every authenticated request
- [x] Throttle lastSignedIn DB write to fire-and-forget, max once per hour per user
- [x] Add gzip compression middleware (compression npm package) to cut HTML/JS/CSS payload ~75%

## Mobile Performance Optimisation — July 2026
- [x] Disable canvas animation on mobile, use static CSS gradient instead
- [x] Replace backdrop-blur-xl on Navbar with solid semi-transparent bg on mobile
- [x] Replace AnimatedSection (framer-motion) with pure CSS IntersectionObserver animation
- [x] Hide expensive blur orbs on mobile (hero section)
- [x] Remove unused useAuth() call from Home page
- [x] Add lazy loading to all non-first TrainingSlideshow images

## SEO & Full-Stack Performance Audit — July 2026
- [x] Measure live TTFB, FCP, LCP on mobile/tablet/desktop
- [x] Audit Google indexing status and keyword rankings
- [x] Fix meta tags (title, description, og:image) on all pages
- [x] Add sitemap.xml and robots.txt
- [x] Add JSON-LD structured data (Organization schema)
- [x] Fix canonical URL (www vs non-www redirect)
- [x] Add preconnect + dns-prefetch for CDN and font origins
- [x] Fix DB connection pool (eliminates 300-800ms TCP handshake per request)
- [x] Fix asset caching (1-year immutable cache for hashed JS/CSS bundles)
- [x] Add staleTime to auth.me query (eliminates repeat DB calls on navigation)
