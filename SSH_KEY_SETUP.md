# GitHub SSH Key Setup Guide

This guide shows you how to set up SSH keys for secure GitHub authentication. SSH keys are more secure than personal access tokens and don't require entering passwords.

---

## What is SSH?

SSH (Secure Shell) is a secure protocol for communicating with GitHub. Instead of entering your password every time, you use a pair of keys:
- **Private Key** — Kept secret on your computer (like a password)
- **Public Key** — Shared with GitHub (like a username)

---

## Step 1: Check if You Already Have SSH Keys

Open Terminal/Command Prompt and run:

```bash
ls -la ~/.ssh/
```

**If you see files like `id_ed25519` and `id_ed25519.pub`, you already have SSH keys!**
- Skip to **Step 3: Add Your Public Key to GitHub**

**If you see "No such file or directory", continue to Step 2.**

---

## Step 2: Generate a New SSH Key

### On macOS or Linux:

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Replace `your-email@example.com` with your actual email address (the one you use for GitHub).

### On Windows (PowerShell):

```powershell
ssh-keygen -t ed25519 -C "your-email@example.com"
```

### What You'll See:

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/yourname/.ssh/id_ed25519):
```

**Just press Enter** to use the default location.

```
Enter passphrase (empty for no passphrase):
```

**You have two options:**

**Option A: No Passphrase (Easier)**
- Press Enter twice (skip passphrase)
- You won't need to enter a password when using Git

**Option B: With Passphrase (More Secure)**
- Type a passphrase (e.g., "MySecurePass123")
- Press Enter
- Confirm by typing it again
- You'll need to enter this passphrase when using Git

### Success Message:

You should see:
```
Your identification has been saved in /Users/yourname/.ssh/id_ed25519
Your public key has been saved in /Users/yourname/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:abc123... your-email@example.com
```

---

## Step 3: View Your Public Key

Display your public key so you can copy it:

### On macOS or Linux:

```bash
cat ~/.ssh/id_ed25519.pub
```

### On Windows (PowerShell):

```powershell
Get-Content ~/.ssh/id_ed25519.pub
```

You should see output like:

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIF... your-email@example.com
```

**Copy this entire line** (Ctrl+C or Cmd+C)

---

## Step 4: Add Your Public Key to GitHub

1. **Go to GitHub SSH Settings:**
   - Visit: https://github.com/settings/ssh/new
   - Or: GitHub → Settings → SSH and GPG keys → New SSH key

2. **Fill in the Form:**
   - **Title:** Give it a name like "My Laptop" or "Work Computer"
   - **Key type:** Select "Authentication Key"
   - **Key:** Paste your public key (the one you copied)

3. **Click "Add SSH key"**

You might be asked to confirm with your GitHub password. Enter it and continue.

---

## Step 5: Test Your SSH Connection

Verify that your SSH key works:

```bash
ssh -T git@github.com
```

**You should see:**

```
Hi Philipmag! You've successfully authenticated, but GitHub does not provide shell access.
```

If you see this message, **congratulations! Your SSH key is set up correctly!** ✅

### If You Get an Error:

**Error: "Permission denied (publickey)"**
- Make sure you copied the **public key** (id_ed25519.pub), not the private key
- Verify the key was added to GitHub: https://github.com/settings/ssh
- Try again with: `ssh -T git@github.com`

**Error: "Could not resolve hostname"**
- Check your internet connection
- Try: `ping github.com`

---

## Step 6: Configure Git to Use SSH

Tell Git to use SSH instead of HTTPS:

```bash
git config --global url."git@github.com:".insteadOf "https://github.com/"
```

This makes Git automatically use SSH for all GitHub repositories.

---

## Step 7: Update Your Git Configuration

Set your Git username and email (if you haven't already):

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Verify it worked:

```bash
git config --global --list | grep user
```

You should see:
```
user.name=Your Name
user.email=your-email@example.com
```

---

## Step 8: Test with Your Repository

Now test with your actual GitHub repository:

```bash
# Clone your repository using SSH
git clone git@github.com:Philipmag/philipmag.github.io.git
cd philipmag.github.io

# Verify remote is using SSH
git remote -v
```

You should see:
```
origin  git@github.com:Philipmag/philipmag.github.io.git (fetch)
origin  git@github.com:Philipmag/philipmag.github.io.git (push)
```

---

## Step 9: Run the Push Script

Now you're ready to run the push script:

```bash
bash push-to-github.sh
```

The script will push your commits using SSH. If you set a passphrase, you might be asked to enter it once.

---

## Troubleshooting SSH Issues

### Problem: "Host key verification failed"

**Solution:**
```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

Then try again:
```bash
ssh -T git@github.com
```

### Problem: "Permission denied (publickey)"

**Solutions:**
1. Verify your public key is on GitHub: https://github.com/settings/ssh
2. Check that you're using the correct email:
   ```bash
   ssh -vT git@github.com
   ```
3. Make sure your private key file has correct permissions:
   ```bash
   chmod 600 ~/.ssh/id_ed25519
   chmod 700 ~/.ssh
   ```

### Problem: "Could not open a connection to your authentication agent"

**Solution (macOS/Linux):**
```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

**Solution (Windows PowerShell):**
```powershell
# Start SSH agent
Start-Service ssh-agent

# Add your key
ssh-add $env:USERPROFILE\.ssh\id_ed25519
```

### Problem: "Passphrase for key is wrong"

**Solution:**
- You entered the wrong passphrase
- Try again and make sure Caps Lock is off
- If you forgot it, you'll need to generate a new key

### Problem: "No such file or directory ~/.ssh/id_ed25519"

**Solution:**
- Your SSH key doesn't exist
- Go back to **Step 2: Generate a New SSH Key**

---

## Managing Multiple SSH Keys

If you have multiple computers or GitHub accounts:

### Generate a key with a custom name:

```bash
ssh-keygen -t ed25519 -C "your-email@example.com" -f ~/.ssh/id_ed25519_work
```

### Create `~/.ssh/config` file:

```bash
nano ~/.ssh/config
```

Add:
```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
    AddKeysToAgent yes
```

Save (Ctrl+X, then Y, then Enter)

---

## Security Best Practices

✅ **Do:**
- Keep your private key (`id_ed25519`) secret
- Use a strong passphrase if you set one
- Regularly review your SSH keys on GitHub: https://github.com/settings/ssh
- Delete old SSH keys you no longer use

❌ **Don't:**
- Share your private key with anyone
- Commit your private key to Git
- Post your private key online
- Use the same SSH key across multiple computers (unless necessary)

---

## Summary

You now have:
1. ✅ Generated an SSH key pair
2. ✅ Added your public key to GitHub
3. ✅ Tested your SSH connection
4. ✅ Configured Git to use SSH
5. ✅ Ready to push your project!

**Next Step:** Run the push script!
```bash
bash push-to-github.sh
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Generate SSH key | `ssh-keygen -t ed25519 -C "email@example.com"` |
| View public key | `cat ~/.ssh/id_ed25519.pub` |
| Test SSH connection | `ssh -T git@github.com` |
| Set Git username | `git config --global user.name "Your Name"` |
| Set Git email | `git config --global user.email "email@example.com"` |
| View Git config | `git config --global --list` |
| Use SSH for HTTPS | `git config --global url."git@github.com:".insteadOf "https://github.com/"` |

---

## Need Help?

- GitHub SSH Documentation: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- GitHub SSH Troubleshooting: https://docs.github.com/en/authentication/troubleshooting-ssh
- SSH Key Permissions: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/working-with-ssh-key-passphrases

Good luck! 🔐
