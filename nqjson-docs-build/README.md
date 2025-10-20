# nqjson Documentation Website - Deployment Guide

This directory contains the complete nqjson documentation website ready for deployment.

## 📁 Directory Structure

```
nqjson-docs-build/
├── index.html          # Landing page
├── CNAME               # Custom domain configuration (docs.dhawalhost.com)
├── css/
│   └── main.css        # Complete styling with nqjson brand colors
├── js/
│   └── main.js         # Interactive features
├── assets/
│   ├── logo.svg        # nqjson logo
│   └── favicon.svg     # Favicon
└── data/
    └── (future: search index, examples)
```

## 🚀 Quick Deployment Steps

### Step 1: Create Orphan Docs Branch in nqjson Repository

```bash
# Navigate to your nqjson repository
cd c:/Users/dhawa/go/src/nqjson

# Create and switch to orphan docs branch (fresh history)
git checkout --orphan docs

# Remove all files from staging
git rm -rf .

# Confirm clean state
git status
# Should show: "On branch docs, No commits yet, nothing to commit"
```

### Step 2: Copy Documentation Files

```bash
# Copy all files from nqjson-docs-build to nqjson repository
# Windows (use PowerShell or Git Bash):
cp -r ../njson-playground/nqjson-docs-build/* .

# Or manually copy the following files:
# - index.html
# - CNAME
# - css/ (directory)
# - js/ (directory)
# - assets/ (directory)
```

### Step 3: Commit and Push Docs Branch

```bash
# Add all documentation files
git add .

# Commit
git commit -m "Initial documentation website

- Beautiful landing page with nqjson branding
- Cyan/blue color scheme (#00B4D8, #0077B6, #90E0EF)
- Responsive design for all devices
- Interactive code examples with copy functionality
- Performance stats and feature highlights
- Mobile-friendly navigation
"

# Push to GitHub (creates docs branch)
git push -u origin docs
```

### Step 4: Configure GitHub Pages

1. Go to your nqjson repository on GitHub: `https://github.com/dhawalhost/nqjson`
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select:
   - Branch: `docs`
   - Folder: `/ (root)`
4. Click **Save**
5. Under **Custom domain**, enter: `docs.dhawalhost.com`
6. Check **Enforce HTTPS** (wait a few minutes for SSL certificate)

### Step 5: Configure Cloudflare DNS

1. Log in to Cloudflare
2. Select your domain: `dhawalhost.com`
3. Go to **DNS** → **Records**
4. Add CNAME record:
   - **Type**: CNAME
   - **Name**: `docs`
   - **Target**: `dhawalhost.github.io`
   - **Proxy status**: **DNS only** (grey cloud, NOT proxied)
   - **TTL**: Auto
5. Click **Save**

### Step 6: Wait for Deployment

- GitHub Pages build: ~1-2 minutes
- DNS propagation: ~5-15 minutes
- SSL certificate: ~5-10 minutes
- Total: ~10-20 minutes

Visit: **https://docs.dhawalhost.com** 🎉

## 🔄 Updating Documentation

When you need to update the documentation:

```bash
# Switch to docs branch
cd c:/Users/dhawa/go/src/nqjson
git checkout docs

# Make your changes to HTML/CSS/JS files

# Commit and push
git add .
git commit -m "Update documentation: [describe changes]"
git push origin docs

# GitHub Pages will automatically rebuild (1-2 minutes)
```

## ✅ Verification Checklist

After deployment, verify:

- [ ] Website loads at https://docs.dhawalhost.com
- [ ] SSL certificate is active (green padlock)
- [ ] Logo and favicon display correctly
- [ ] Navigation works (all links functional)
- [ ] Mobile menu works on small screens
- [ ] Code copy buttons work
- [ ] Tab switching works (Basic Operations, Modifiers, etc.)
- [ ] All buttons and links function properly
- [ ] Scroll to top button appears
- [ ] Search modal opens with Ctrl+K

## 🎨 Brand Colors Used

```css
--color-primary: #00B4D8       /* Cyan */
--color-primary-dark: #0077B6  /* Deep Blue */
--color-primary-light: #90E0EF /* Light Cyan */
```

## 📦 What's Included

### Landing Page (`index.html`)
- Hero section with animated gradient background
- Feature highlights (6 cards)
- Interactive code examples with tabs
- Performance statistics
- Quick install command with copy button
- Responsive navigation
- Footer with links

### Styling (`css/main.css`)
- Complete nqjson brand styling
- Responsive design (mobile, tablet, desktop)
- Custom buttons and cards
- Smooth animations and transitions
- Dark code blocks with syntax highlighting
- Utility classes

### JavaScript (`js/main.js`)
- Mobile navigation toggle
- Tab switching for examples
- Copy to clipboard functionality
- Smooth scrolling
- Scroll to top button
- Search modal (Ctrl+K)
- Animation on scroll
- Syntax highlighting

## 🔧 Technical Details

- **Framework**: Pure HTML/CSS/JavaScript (no dependencies)
- **Fonts**: Inter (body), JetBrains Mono (code)
- **Font Source**: Google Fonts
- **Icons**: Inline SVG
- **Performance**: Optimized for fast loading
- **Browser Support**: All modern browsers
- **Mobile**: Fully responsive

## 📝 Next Steps (Future Pages)

Create additional documentation pages:

1. **getting-started.html** - Installation and quick start guide
2. **syntax.html** - Complete syntax reference with all 20+ modifiers
3. **api.html** - API documentation (Get, GetMany, Set, Delete, Result)
4. **examples.html** - Interactive examples and playground
5. **performance.html** - Benchmarks and performance analysis

Each page should:
- Use same navigation structure
- Include same footer
- Link to `css/main.css` and `js/main.js`
- Follow nqjson brand guidelines

## 🤝 Benefits of Orphan Docs Branch

✅ **Separate history**: Documentation changes don't clutter main branch
✅ **No bloat**: `go get` downloads ONLY library code (no docs)
✅ **Clean deployment**: Docs branch contains ONLY website files
✅ **Independent versioning**: Update docs without touching library code
✅ **Industry standard**: Used by Go standard library and major projects

## 🐛 Troubleshooting

### Website shows 404
- Wait 10-15 minutes for DNS propagation
- Verify CNAME file contains: `docs.dhawalhost.com`
- Check GitHub Pages settings (should show docs branch)

### SSL certificate error
- Wait 10 minutes for certificate provisioning
- Ensure Cloudflare proxy is "DNS only" (grey cloud)
- Try accessing via http://docs.dhawalhost.com first

### Logo not showing
- Verify `assets/logo.svg` exists
- Check file path in `index.html` is correct: `./assets/logo.svg`
- Clear browser cache

### Go get still downloads docs
- Verify you're on docs branch: `git branch`
- Ensure docs branch has no Go files (*.go)
- Main branch should not contain documentation website files

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/dhawalhost/nqjson/issues
- Repository: https://github.com/dhawalhost/nqjson
- Playground: https://nqjson.dhawalhost.com

---

Built with ❤️ for nqjson - Next-Generation JSON Queries for Go
