# nqjson Playground • Professional JSON Query Tool

Interactive playground to explore the **nqjson** library with a modern, feature-rich interface. Fully browser-based via Go WebAssembly—zero backend required.

🎉 **Recently Upgraded!** Now featuring Monaco Editor, 54+ modifiers, dual themes, and large data support.

## ✨ Features

### 🎨 Modern UI/UX
- **Monaco Editor** - Professional code editor with syntax highlighting, minimap, and multi-cursor
- **Resizable Split Panes** - Adjust workspace layout to your preference
- **Dual Themes** - Beautiful dark and light modes with smooth transitions
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Toast Notifications** - Clear, non-intrusive feedback

### 🚀 Comprehensive Feature Support
- **54+ Modifiers** - Complete nqjson modifier library with interactive palette
  - Array Transformation: `@reverse`, `@sort`, `@flatten`, `@sortby`, `@group`, `@map`, etc.
  - Aggregation: `@sum`, `@avg`, `@min`, `@max`, `@count`
  - Object Operations: `@keys`, `@values`
  - Type Conversion: `@string`, `@number`, `@bool`, `@base64`, etc.
  - jq-Style Utilities: `@slice`, `@has`, `@contains`, `@split`, `@entries`, etc.
- **Searchable Modifier Library** - Find modifiers quickly with fuzzy search
- **Click-to-Add** - Add modifiers to your query with a single click

### 📊 Query Operations
- **Get** - Execute powerful path queries with multipath support
- **Set** - Update JSON values at any path
- **Delete** - Remove JSON values safely
- **Query History** - Track your recent queries (last 50)
- **Performance Metrics** - See query execution times

### 📁 File Operations
- **Import JSON** - Load JSON files up to 100MB
- **Export JSON** - Save your work with one click
- **Format/Minify** - Beautify or compact your JSON
- **Copy to Clipboard** - Quick copy for JSON and results

### 📦 Large Data Handling
- **Monaco Editor** efficiently handles large files
- **Large Dataset Example** - Test with 1,000-item datasets (181.92 KB)
- **Real-time Validation** - Instant JSON syntax checking
- **Line Numbers & Minimap** - Navigate large documents easily

### 🎯 Developer Experience
- **6 Example Datasets** - Learn by example (Basics, Modifiers, Multipath, Large Data, Store, Analytics)
- **Interactive Examples** - Click "Try" to run any example
- **Keyboard Shortcuts** - `Ctrl+Enter` (query), `Ctrl+L` (format)
- **Comprehensive Documentation** - Links to API docs and syntax guides

## 🎬 Quick Start

### Run Locally (WASM)

1. **Build the WASM module**:
```bash
GOOS=js GOARCH=wasm go build -o web/main.wasm ./wasm

# Copy WASM runtime (choose one that works):
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" web/wasm_exec.js
# OR
cp "$(brew --prefix golang)/libexec/misc/wasm/wasm_exec.js" web/wasm_exec.js
```

2. **Serve the web directory**:
```bash
cd web
python3 -m http.server 8080
```

3. **Open in browser**: <http://localhost:8080>

### Requirements
- Go >= 1.23.10 (for nqjson v1.4.1+)
- Modern browser with WebAssembly support

## 📖 Usage

### Basic Query
```
user.name           # Get nested value
items.#.price       # Project all prices
scores|@sum         # Sum array values
```

### Multipath Query
```
user.name,user.email,user.age    # Multiple fields in one query
```

### With Modifiers
```
items.#.price|@sum              # Total price
users|@sortby:age               # Sort by field
data|@group:category            # Group by field
values|@sort|@reverse           # Descending sort
```

### Filters
```
items[?(@.price>100)].name      # Expensive items
users[?(@.active==true)].email  # Active users
```

## 🎨 Screenshots

### Main Interface
![nqjson Playground](./screenshot.png)

Features:
- **Left**: Monaco Editor with JSON document (syntax highlighting, line numbers, minimap)
- **Right**: Query controls, modifier palette (54+ modifiers), results viewer
- **Header**: Import/Export files, Theme toggle, GitHub link
- **Footer**: API docs and syntax guide

### Key Capabilities
- ✅ **Monaco Editor** - Professional code editing experience
- ✅ **54+ Modifiers** - Complete nqjson feature set
- ✅ **Large Data** - Tested with 1,000-item datasets (181.92 KB)
- ✅ **Dual Themes** - Dark and light modes
- ✅ **File Operations** - Import/export JSON files
- ✅ **Real-time Validation** - Instant feedback
- ✅ **Performance Monitoring** - Query execution times

## 🚀 Deploy to GitHub Pages

Already configured via GitHub Actions:

1. **Setup** (one-time):
   - Repository Settings → Pages → Source: GitHub Actions
   
2. **Deploy**:
   - Push to `main` branch
   - Workflow builds WASM and publishes to Pages automatically
   
3. **Access**:
   - Visit `https://<username>.github.io/<repo>/`

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), Monaco Editor, Split.js
- **Backend**: Go WebAssembly (client-side processing)
- **Library**: nqjson v1.4.1+ with all 54+ modifiers
- **Build**: Zero build tools (CDN-based dependencies)

## 📚 Documentation

- **[nqjson API Docs](https://github.com/dhawalhost/nqjson/blob/main/API.md)** - Complete API reference
- **[Syntax Guide](https://github.com/dhawalhost/nqjson/blob/main/SYNTAX.md)** - Path expression reference
- **[Examples](https://github.com/dhawalhost/nqjson/blob/main/EXAMPLES.md)** - Real-world usage patterns

## 🎯 What's New?

### Version 2.0 (Latest)
- ✅ Monaco Editor integration (replaces basic textarea)
- ✅ Comprehensive modifier library (54+ modifiers with UI)
- ✅ Resizable split panes
- ✅ Dual theme system (dark/light)
- ✅ File import/export
- ✅ Large data support (tested with 181.92 KB datasets)
- ✅ Performance metrics
- ✅ Toast notifications
- ✅ Keyboard shortcuts
- ✅ Query history tracking
- ✅ Responsive design

### Coming Soon
- 🔜 Virtual scrolling for 100k+ item arrays
- 🔜 Autocomplete for path expressions
- 🔜 Visual query builder
- 🔜 Shareable playground links
- 🔜 Custom modifier registration

## 🤝 Contributing

Found a bug or have a feature request? Open an issue on GitHub!

## 📄 License

MIT License - see [nqjson repository](https://github.com/dhawalhost/nqjson) for details.

---

**Built with ❤️ using nqjson • Next-Generation JSON Queries**

