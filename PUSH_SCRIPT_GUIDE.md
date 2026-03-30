# Step-by-Step Guide: Running push-to-github.sh on Your Local Machine

This guide will walk you through downloading and running the push script to deploy your Digital Guardians project to GitHub Pages.

---

## Prerequisites

Before you start, make sure you have:

- ✅ **Git installed** on your local machine
  - Check: Open Terminal/Command Prompt and run `git --version`
  - If not installed, download from: https://git-scm.com/

- ✅ **GitHub account** with access to `philipmag/philipmag.github.io`

- ✅ **GitHub credentials** configured (see "Setting Up GitHub Credentials" section below)

---

## Part 1: Download the Project and Script

### Step 1: Clone the Repository

First, clone your GitHub Pages repository to your local machine:

```bash
git clone https://github.com/Philipmag/philipmag.github.io.git
cd philipmag.github.io
```

### Step 2: Download the Push Script

You have two options:

**Option A: Download from Manus**
1. Go to your Manus project: Digital Guardians Redesign
2. Click the **Code** button in the Management UI
3. Download `push-to-github.sh` file
4. Save it to your local `philipmag.github.io` directory

**Option B: Create the Script Manually**
1. Open a text editor (VS Code, Sublime, Notepad++, etc.)
2. Copy the entire content below
3. Save as `push-to-github.sh` in your `philipmag.github.io` directory

```bash
#!/bin/bash

###############################################################################
# Push Digital Guardians Project to GitHub Pages Repository
# 
# This script pushes all commits from the Manus sandbox to your GitHub
# repository (philipmag/philipmag.github.io)
#
# Usage:
#   1. Copy this script to your local machine
#   2. Run: bash push-to-github.sh
#   3. Enter your GitHub credentials when prompted
#
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "Digital Guardians - GitHub Push Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking git configuration...${NC}"
echo ""

# Display current remotes
echo "Current git remotes:"
git remote -v
echo ""

# Check if user_github remote exists
if git remote | grep -q "user_github"; then
    echo -e "${GREEN}✓ user_github remote found${NC}"
else
    echo -e "${YELLOW}⚠ user_github remote not found, adding it...${NC}"
    git remote add user_github https://github.com/Philipmag/philipmag.github.io.git
    echo -e "${GREEN}✓ user_github remote added${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2: Verifying commits to push...${NC}"
echo ""

# Show commits that will be pushed
echo "Commits to be pushed:"
git log --oneline user_github/main..main 2>/dev/null || git log --oneline -10
echo ""

# Count commits
COMMIT_COUNT=$(git log --oneline user_github/main..main 2>/dev/null | wc -l || echo "unknown")
echo "Total commits to push: $COMMIT_COUNT"
echo ""

echo -e "${YELLOW}Step 3: Pushing to GitHub...${NC}"
echo ""
echo "Repository: https://github.com/Philipmag/philipmag.github.io"
echo "Branch: main"
echo ""

# Push to GitHub
if git push user_github main; then
    echo ""
    echo -e "${GREEN}=========================================="
    echo "✓ Successfully pushed to GitHub!"
    echo "==========================================${NC}"
    echo ""
    echo "Your commits are now available at:"
    echo "https://github.com/Philipmag/philipmag.github.io/commits/main"
    echo ""
    echo "GitHub Pages will automatically deploy from the repository root."
    echo "Visit your site at: https://philipmag.github.io/"
    echo ""
else
    echo ""
    echo -e "${RED}=========================================="
    echo "✗ Push failed"
    echo "==========================================${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "1. Make sure you have git credentials configured"
    echo "2. Verify your GitHub token/SSH key is set up"
    echo "3. Check that you have push access to the repository"
    echo ""
    exit 1
fi

echo -e "${YELLOW}Step 4: Verifying push...${NC}"
echo ""

# Verify the push
if git log user_github/main --oneline -5; then
    echo ""
    echo -e "${GREEN}✓ Verification successful!${NC}"
else
    echo -e "${RED}✗ Could not verify push${NC}"
    exit 1
fi

echo ""
echo "Done!"
```

### Step 3: Verify the Script is in the Right Place

```bash
# You should be in the philipmag.github.io directory
ls -la push-to-github.sh
```

You should see output like:
```
-rw-r--r--  1 user  staff  3.4K Mar  8 18:12 push-to-github.sh
```

---

## Part 2: Setting Up GitHub Credentials

### Option A: Personal Access Token (Recommended for Beginners)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Give it a name: `Digital Guardians Push`
   - Select scopes: Check `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token** (you won't see it again!)

2. **Configure Git to Use the Token:**
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```

3. **Test Your Credentials:**
   ```bash
   git clone https://github.com/Philipmag/philipmag.github.io.git test-repo
   # When prompted for password, paste your token
   rm -rf test-repo
   ```

### Option B: SSH Key (More Secure)

1. **Generate SSH Key (if you don't have one):**
   ```bash
   ssh-keygen -t ed25519 -C "your-email@example.com"
   # Press Enter for all prompts to use defaults
   ```

2. **Add SSH Key to GitHub:**
   - Copy your public key:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to: https://github.com/settings/ssh/new
   - Paste the key and save

3. **Test SSH Connection:**
   ```bash
   ssh -T git@github.com
   # You should see: "Hi [username]! You've successfully authenticated..."
   ```

---

## Part 3: Run the Push Script

### Step 1: Make the Script Executable

```bash
# Navigate to your project directory
cd /path/to/philipmag.github.io

# Make the script executable
chmod +x push-to-github.sh
```

### Step 2: Run the Script

```bash
bash push-to-github.sh
```

### Step 3: What You'll See

The script will display:

```
==========================================
Digital Guardians - GitHub Push Script
==========================================

Step 1: Checking git configuration...

Current git remotes:
origin  https://github.com/Philipmag/philipmag.github.io.git (fetch)
origin  https://github.com/Philipmag/philipmag.github.io.git (push)

✓ user_github remote found

Step 2: Verifying commits to push...

Commits to be pushed:
3b5a6f0 Checkpoint: GitHub Pages deployment fully configured...
36e36eb Configure GitHub Pages deployment with automatic root...

Total commits to push: 2

Step 3: Pushing to GitHub...

Repository: https://github.com/Philipmag/philipmag.github.io
Branch: main

Pushing to github.com:Philipmag/philipmag.github.io.git
```

### Step 4: Enter Your Credentials

When prompted, enter your GitHub credentials:

**If using Personal Access Token:**
```
Username for 'https://github.com': Philipmag
Password for 'https://Philipmag@github.com': [paste your token here]
```

**If using SSH:**
- You may be prompted for your SSH key passphrase (if you set one)
- Just press Enter if you didn't set a passphrase

### Step 5: Success!

If everything works, you'll see:

```
==========================================
✓ Successfully pushed to GitHub!
==========================================

Your commits are now available at:
https://github.com/Philipmag/philipmag.github.io/commits/main

GitHub Pages will automatically deploy from the repository root.
Visit your site at: https://philipmag.github.io/

Step 4: Verifying push...

3b5a6f0 (HEAD -> main, user_github/main) Checkpoint: GitHub Pages...
36e36eb Configure GitHub Pages deployment with automatic root...
...

✓ Verification successful!

Done!
```

---

## Part 4: Verify the Deployment

### Step 1: Check GitHub Repository

1. Go to: https://github.com/Philipmag/philipmag.github.io
2. Click the "Commits" button
3. You should see your new commits at the top:
   - "Checkpoint: GitHub Pages deployment fully configured..."
   - "Configure GitHub Pages deployment with automatic root..."

### Step 2: Check GitHub Pages Settings

1. Go to: https://github.com/Philipmag/philipmag.github.io/settings/pages
2. Verify:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main` / `root`
   - **Status:** Should show a green checkmark

### Step 3: Visit Your Live Site

1. Go to: https://philipmag.github.io
2. You should see your Digital Guardians website live!

---

## Troubleshooting

### Problem: "Permission denied (publickey)"

**Solution:**
- Make sure your SSH key is added to GitHub: https://github.com/settings/ssh
- Or switch to using a Personal Access Token instead

### Problem: "Authentication failed"

**Solution:**
- Verify your Personal Access Token hasn't expired
- Try creating a new token: https://github.com/settings/tokens
- Make sure you have push access to the repository

### Problem: "fatal: Not a git repository"

**Solution:**
- Make sure you're in the `philipmag.github.io` directory
- Run: `cd /path/to/philipmag.github.io`
- Verify `.git` folder exists: `ls -la .git`

### Problem: Script won't run

**Solution:**
- Make sure script is executable: `chmod +x push-to-github.sh`
- Try running with explicit bash: `bash push-to-github.sh`
- Check file permissions: `ls -la push-to-github.sh`

### Problem: "Everything up-to-date"

**Solution:**
- This means commits are already pushed
- Check GitHub: https://github.com/Philipmag/philipmag.github.io/commits/main
- If you see the new commits, you're done!

---

## Next Steps

After successfully pushing:

1. **Monitor GitHub Pages Deployment:**
   - Go to: https://github.com/Philipmag/philipmag.github.io/actions
   - Wait for the deployment workflow to complete (usually 1-2 minutes)

2. **Access Your Live Site:**
   - Visit: https://philipmag.github.io
   - Your Digital Guardians website is now live!

3. **Test the Features:**
   - Check the AI Assistant functionality
   - Test the Learning Center quizzes
   - Try the Contact form

---

## Questions?

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the `GITHUB_PAGES_SETUP.md` file for more details
3. Verify your GitHub credentials are correct
4. Make sure you have push access to the repository

Good luck! 🚀
