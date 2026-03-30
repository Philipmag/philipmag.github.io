# Push Commits to GitHub

This guide explains how to push the Digital Guardians project commits to your GitHub Pages repository using the provided shell script.

## Prerequisites

- Git installed on your local machine
- GitHub account with access to `philipmag/philipmag.github.io` repository
- Valid GitHub credentials (personal access token or SSH key)

## Quick Start

### Option 1: Using the Shell Script (Recommended)

1. **Download the script** from the Manus project to your local machine:
   - File: `push-to-github.sh`
   - Location: Project root directory

2. **Navigate to your project directory:**
   ```bash
   cd /path/to/digital-guardians-redesign
   ```

3. **Run the script:**
   ```bash
   bash push-to-github.sh
   ```

4. **Enter your GitHub credentials** when prompted

5. **Verify the push** — The script will show you the commits that were pushed

### Option 2: Manual Git Commands

If you prefer to push manually, run these commands in your project directory:

```bash
# 1. Add the GitHub remote if not already present
git remote add user_github https://github.com/Philipmag/philipmag.github.io.git

# 2. Push all commits to main branch
git push user_github main

# 3. Verify the push
git log user_github/main --oneline -5
```

## GitHub Authentication

### Using Personal Access Token (Recommended)

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create a new token with `repo` scope
3. When prompted for password during `git push`, paste your token instead

### Using SSH Key

1. Generate an SSH key if you don't have one:
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   ```

2. Add the public key to GitHub Settings → SSH and GPG keys

3. Update the remote URL to use SSH:
   ```bash
   git remote set-url user_github git@github.com:Philipmag/philipmag.github.io.git
   ```

## What Gets Pushed

The script will push all commits including:

- **GitHub Pages Configuration**
  - `vite.config.ts` — Updated with GitHub Pages support
  - `package.json` — Added build scripts for GitHub Pages
  - `GITHUB_PAGES_SETUP.md` — Complete deployment documentation

- **Logo and Animation Updates**
  - New sharp logo (DigitalGuardianslogo5)
  - Neon white light animation around logo

- **Feature Enhancements**
  - Interactive quiz system with scoring
  - Contact form merged into About page
  - Updated navigation

- **Build Output**
  - `index.html` — Main entry point
  - `assets/` — Bundled CSS and JavaScript
  - `__manus__/` — Debug assets

## After Pushing

Once the commits are pushed to GitHub:

1. **Verify on GitHub:**
   - Visit: https://github.com/Philipmag/philipmag.github.io/commits/main
   - You should see the new commits at the top

2. **Deploy to GitHub Pages:**
   - GitHub will automatically deploy from the repository root
   - Your site will be available at: https://philipmag.github.io/

3. **Check GitHub Pages Settings:**
   - Go to Repository Settings → Pages
   - Verify the source is set to `main` branch, root folder

## Troubleshooting

### "Authentication failed"
- Verify your GitHub credentials are correct
- Check that your personal access token hasn't expired
- Ensure you have push access to the repository

### "Permission denied (publickey)"
- If using SSH, verify your SSH key is added to GitHub
- Try using HTTPS instead: `git remote set-url user_github https://github.com/Philipmag/philipmag.github.io.git`

### "Everything up-to-date"
- This means all commits have already been pushed
- Verify by visiting: https://github.com/Philipmag/philipmag.github.io/commits/main

### Script won't run
- Make sure the script is executable: `chmod +x push-to-github.sh`
- Run from the project root directory
- Use `bash push-to-github.sh` instead of `./push-to-github.sh` if permissions issues persist

## Next Steps

After successfully pushing to GitHub:

1. **Build for GitHub Pages** (optional, for testing):
   ```bash
   GITHUB_PAGES=true pnpm run build:gh-pages
   ```

2. **View your site** at: https://philipmag.github.io/

3. **Monitor deployment** in GitHub Actions (if enabled)

## Questions?

Refer to the `GITHUB_PAGES_SETUP.md` file for complete GitHub Pages deployment documentation.
