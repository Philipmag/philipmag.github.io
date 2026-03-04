# GitHub Pages Deployment Guide

This document provides step-by-step instructions for deploying the Digital Guardians React application to GitHub Pages from the repository root.

## Prerequisites

- Node.js 16.7+ and pnpm installed
- Git configured with your GitHub credentials
- Repository set up as `philipmag.github.io` (or your GitHub Pages repository)

## Configuration Overview

The project is configured to deploy to GitHub Pages with the following setup:

- **Build Output**: `dist/` directory (for safety during build)
- **Deployment Target**: Repository root (`index.html`, `assets/`, etc.)
- **Base Path**: `/` (root-relative paths)
- **Post-Build**: Automatic copy from `dist/` to root using Vite plugin

## Deployment Steps

### Step 1: Build for GitHub Pages

Run the GitHub Pages-specific build command:

```bash
pnpm run build:gh-pages
```

This command:
- Sets `GITHUB_PAGES=true` environment variable
- Builds the React app into `dist/` directory
- Automatically copies build output to the repository root
- Preserves existing files (`.git`, `node_modules`, etc.)

**Output files created in repository root:**
- `index.html` - Main HTML entry point
- `assets/` - Directory containing CSS and JavaScript bundles
- `__manus__/` - Debug collector assets (development only)

### Step 2: Verify Build Output

Check that files are in the repository root:

```bash
ls -la index.html assets/
```

You should see:
- `index.html` (368 KB)
- `assets/index-*.css` (145 KB)
- `assets/index-*.js` (1.0 MB)

### Step 3: Commit and Push to GitHub

```bash
git add index.html assets/ __manus__/
git commit -m "Deploy to GitHub Pages"
git push origin main
```

Or use the automated deployment script:

```bash
pnpm run deploy:gh-pages
```

### Step 4: Verify Deployment

1. Go to your GitHub repository settings
2. Scroll to "GitHub Pages" section
3. Verify that the source is set to `main` branch and root directory
4. Your site should be live at: `https://philipmag.github.io/`

## Available npm Scripts

| Script | Purpose |
|--------|---------|
| `pnpm run build:gh-pages` | Build for GitHub Pages (outputs to root) |
| `pnpm run deploy:gh-pages` | Build + commit + push (full deployment) |
| `pnpm run clean:gh-pages` | Remove build artifacts from root |
| `pnpm run dev:gh-pages` | Dev server with GitHub Pages config |
| `pnpm run dev` | Normal dev server (Manus configuration) |
| `pnpm run build` | Normal build (outputs to `dist/public`) |

## Important Notes

### Base Path Configuration

The app is configured with `base: "/"` in `vite.config.ts`, which means:
- All assets are referenced from the repository root
- No subdirectory prefix is needed
- Works correctly with `philipmag.github.io` domain

### Build Output Structure

```
/home/ubuntu/digital-guardians-redesign/
├── index.html              ← Copied to root
├── assets/                 ← Copied to root
│   ├── index-*.css
│   └── index-*.js
├── dist/                   ← Build staging directory
│   ├── index.html
│   ├── assets/
│   └── __manus__/
├── client/                 ← Source code (not deployed)
├── server/                 ← Backend code (not deployed)
└── ...
```

### GitHub Pages Settings

Ensure your repository is configured correctly:

1. Go to **Settings** → **Pages**
2. Set **Source** to `Deploy from a branch`
3. Set **Branch** to `main` (or your default branch)
4. Set **Folder** to `/ (root)`
5. Click **Save**

### Troubleshooting

**Issue**: Files not appearing on GitHub Pages
- **Solution**: Ensure you've pushed the `index.html` and `assets/` to the `main` branch
- **Check**: Verify in GitHub repository that files are visible in the root directory

**Issue**: Assets not loading (404 errors)
- **Solution**: Verify that `assets/` directory is in the repository root
- **Check**: Ensure base path is `/` in `vite.config.ts`

**Issue**: Build fails with "outDir must not be the same directory"
- **Solution**: This is expected during build. The post-build plugin handles copying safely.

**Issue**: Old version still showing
- **Solution**: GitHub Pages caches for up to 10 minutes. Try a hard refresh (Ctrl+Shift+R)
- **Alternative**: Clear browser cache or use an incognito window

## Continuous Deployment (Optional)

To automate deployment on every push, create a GitHub Actions workflow:

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 10.4.1
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build for GitHub Pages
        run: pnpm run build:gh-pages
      
      - name: Commit and push
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add index.html assets/ __manus__/
          git diff --quiet && git diff --staged --quiet || (git commit -m "Auto-deploy: GitHub Pages build" && git push)
```

## Development vs. Production

### Development (Manus Configuration)
```bash
pnpm run dev
```
- Runs on `http://localhost:3000`
- Includes backend server and database
- Full-stack development environment

### GitHub Pages (Static Site)
```bash
pnpm run build:gh-pages
pnpm run dev:gh-pages
```
- Builds static React app only
- No backend or database
- Outputs to repository root
- Suitable for static hosting

## File Size Optimization

The build includes a warning about chunk size (1.0 MB). To optimize:

1. **Enable code splitting** in `vite.config.ts`:
   ```typescript
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           'vendor': ['react', 'react-dom'],
           'ui': ['@radix-ui/react-dialog', '@radix-ui/react-button'],
         }
       }
     }
   }
   ```

2. **Lazy load routes** in `client/src/App.tsx`:
   ```typescript
   const Home = lazy(() => import('./pages/Home'));
   const About = lazy(() => import('./pages/About'));
   ```

3. **Monitor bundle size**:
   ```bash
   npm install -D vite-plugin-visualizer
   ```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review GitHub Pages documentation: https://docs.github.com/en/pages
3. Check Vite documentation: https://vitejs.dev/guide/static-deploy.html
