# Setup nqjson Documentation - Step-by-Step Guide

## 🎯 Goal
Create comprehensive documentation for nqjson in the same repository without affecting `go get` downloads.

## ✅ Solution: Orphan `docs` Branch

This is the **standard Go practice** used by major projects. The documentation lives in a separate branch with no shared history with the main branch.

---

## 📋 Step-by-Step Setup

### Step 1: Create Orphan Docs Branch

Run these commands in the nqjson repository:

```bash
# Navigate to nqjson repository
cd c:/Users/dhawa/go/src/nqjson

# Create orphan branch (clean slate, no history from main)
git checkout --orphan docs

# Remove all existing files from staging
git rm -rf .

# Verify clean state
git status
# Should show: "On branch docs, No commits yet"
```

### Step 2: Create Initial Structure

```bash
# Create directory structure
mkdir -p css js assets/images data

# Create a simple README for the docs branch
cat > README.md << 'EOF'
# nqjson Documentation

This branch contains the documentation website for nqjson.

**Live Site**: https://docs.dhawalhost.com

## Local Development

Open `index.html` in a browser or run:
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000
```

Then visit: http://localhost:8000
EOF

# Create placeholder index
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>nqjson Documentation</title>
</head>
<body>
    <h1>nqjson Documentation</h1>
    <p>Documentation site under construction...</p>
</body>
</html>
EOF

# Add CNAME for custom domain
echo "docs.dhawalhost.com" > CNAME

# Stage all files
git add .

# Commit
git commit -m "Initial documentation structure"

# Push to create the docs branch on GitHub
git push -u origin docs
```

### Step 3: Verify Branch is Created

```bash
# Check current branch
git branch
# Should show: * docs

# View branches on GitHub
git branch -r
# Should include: origin/docs

# Switch back to main
git checkout main
```

### Step 4: Configure GitHub Pages

1. **Go to GitHub Repository Settings**
   ```
   https://github.com/dhawalhost/nqjson/settings/pages
   ```

2. **Configure Source**
   - **Source**: Deploy from a branch
   - **Branch**: `docs` (select from dropdown)
   - **Folder**: `/ (root)`
   - Click **Save**

3. **Add Custom Domain**
   - **Custom domain**: Enter `docs.dhawalhost.com`
   - Click **Save**
   - Wait for DNS check ✅

4. **Enable HTTPS**
   - After DNS check passes
   - Check ☑️ **Enforce HTTPS**

### Step 5: Configure DNS (Cloudflare)

1. **Login to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com/
   - Select: dhawalhost.com

2. **Add CNAME Record**
   ```
   Type:   CNAME
   Name:   docs
   Target: dhawalhost.github.io
   Proxy:  DNS only (gray cloud) ⚠️ Important!
   TTL:    Auto
   ```

3. **Save and Verify**
   ```bash
   # Check DNS propagation (after 5-15 minutes)
   nslookup docs.dhawalhost.com
   
   # Should return: docs.dhawalhost.com -> dhawalhost.github.io
   ```

### Step 6: Wait for Deployment

- **DNS Propagation**: 5-15 minutes
- **GitHub Pages Build**: 2-5 minutes
- **SSL Certificate**: Up to 24 hours

### Step 7: Verify Site is Live

```bash
# Test the site
curl -I https://docs.dhawalhost.com

# Should return: HTTP/2 200
```

---

## 🔄 Working with Docs Branch

### Switching Between Branches

```bash
# Work on documentation
git checkout docs
# ... edit HTML, CSS, JS files ...
git add .
git commit -m "Update syntax guide"
git push origin docs
# Changes auto-deploy to docs.dhawalhost.com

# Work on library code
git checkout main
# ... edit nqjson_get.go, etc ...
git add .
git commit -m "Add new feature"
git push origin main
# Users get this with go get
```

### Keeping Logo in Sync

```bash
# On docs branch, copy logo from main
git checkout docs
git checkout main -- assets/icon-gradient.svg
mv assets/icon-gradient.svg assets/logo.svg
git add assets/logo.svg
git commit -m "Update logo"
git push origin docs
```

---

## 📁 Final Branch Structure

### `main` branch (Library Code)
```
nqjson/
├── nqjson_get.go
├── nqjson_set.go
├── nqjson_format.go
├── nqjson_get_test.go
├── nqjson_set_test.go
├── format_test.go
├── go.mod
├── go.sum
├── README.md
├── API.md
├── SYNTAX.md
├── EXAMPLES.md
├── LICENSE
├── Makefile
└── assets/
    └── *.svg (logos)
```
**Downloaded by**: `go get github.com/dhawalhost/nqjson`

### `docs` branch (Documentation Website)
```
nqjson/ (docs branch)
├── index.html
├── getting-started.html
├── syntax.html
├── api.html
├── examples.html
├── performance.html
├── css/
│   ├── main.css
│   ├── prism.css
│   └── components.css
├── js/
│   ├── main.js
│   ├── prism.js
│   └── search.js
├── assets/
│   ├── logo.svg
│   ├── favicon.svg
│   └── images/
├── data/
│   └── examples.json
├── CNAME
└── README.md
```
**Served at**: `https://docs.dhawalhost.com`

---

## ✅ Verification Checklist

After setup, verify:

- [ ] `docs` branch exists on GitHub
- [ ] `git checkout docs` works locally
- [ ] GitHub Pages configured to deploy from `docs` branch
- [ ] DNS CNAME record added (docs → dhawalhost.github.io)
- [ ] DNS propagated (nslookup returns correct value)
- [ ] Site accessible at https://docs.dhawalhost.com
- [ ] HTTPS enabled (green padlock in browser)
- [ ] Can switch between main and docs branches
- [ ] `go get github.com/dhawalhost/nqjson` only downloads main branch

---

## 🎨 Next: Add Documentation Content

Once the docs branch is set up, I'll create:

1. **Beautiful Landing Page** - Hero, features, quick start
2. **Getting Started Guide** - Installation, first query
3. **Comprehensive Syntax Guide** - All modifiers, filters, examples
4. **Complete API Reference** - All methods with examples
5. **Interactive Examples** - Live code playground
6. **Performance Page** - Benchmarks and optimization

All styled with nqjson brand colors and fully responsive!

---

## 🚨 Troubleshooting

### Issue: "fatal: A branch named 'docs' already exists"
```bash
# Delete local docs branch if needed
git branch -D docs

# Delete remote docs branch
git push origin --delete docs

# Start over with Step 1
```

### Issue: GitHub Pages shows 404
```bash
# Ensure index.html exists in root of docs branch
git checkout docs
ls index.html  # Should exist

# Check GitHub Pages settings
# Branch should be "docs", folder should be "/ (root)"
```

### Issue: DNS not resolving
```bash
# Check DNS record is correct
nslookup docs.dhawalhost.com

# Ensure CNAME record points to dhawalhost.github.io
# Ensure proxy is "DNS only" (gray cloud)
# Wait 15-30 minutes for propagation
```

### Issue: SSL certificate warning
```bash
# Wait up to 24 hours for GitHub to provision certificate
# Ensure DNS check passed in GitHub Pages settings
# Ensure "Enforce HTTPS" is checked
```

---

## 🎉 Ready to Build!

Once you've completed Steps 1-6, let me know and I'll:
1. Create all documentation files
2. You add them to the docs branch
3. Push to GitHub
4. Site goes live automatically!

**Commands Summary:**
```bash
# Quick setup (run in nqjson repo)
cd c:/Users/dhawa/go/src/nqjson
git checkout --orphan docs
git rm -rf .
mkdir -p css js assets/images data
echo "docs.dhawalhost.com" > CNAME
# ... I'll provide all other files ...
git add .
git commit -m "Initial documentation website"
git push -u origin docs
git checkout main
```

Then configure GitHub Pages and DNS! 🚀
