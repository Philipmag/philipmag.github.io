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
