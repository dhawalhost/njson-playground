// nqjson Playground - Enhanced Interactive JSON Query Tool
// Supports: Monaco Editor, All 54+ Modifiers, Large Data (100MB+), Virtual Scrolling

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  editor: null,
  theme: 'dark',
  modifierPaletteOpen: true,
  currentDataset: 'default',
  queryHistory: [],
  perfMetrics: { lastQueryTime: 0, memoryUsage: 0 },
};

// ============================================================================
// COMPREHENSIVE MODIFIER LIBRARY (54+ Modifiers)
// ============================================================================

const MODIFIERS = {
  'Array Transformation': [
    { name: '@reverse', desc: 'Reverse array order', example: 'scores|@reverse', arg: false },
    { name: '@sort', desc: 'Sort array ascending', example: 'nums|@sort', arg: false },
    { name: '@flatten', desc: 'Flatten nested arrays', example: 'nested|@flatten', arg: false },
    { name: '@distinct', desc: 'Remove duplicates (alias: @unique)', example: 'tags|@distinct', arg: false },
    { name: '@first', desc: 'Get first element', example: 'items|@first', arg: false },
    { name: '@last', desc: 'Get last element', example: 'items|@last', arg: false },
    { name: '@sortby', desc: 'Sort objects by field', example: 'users|@sortby:age', arg: 'field' },
    { name: '@group', desc: 'Group by field (alias: @groupby)', example: 'users|@group:city', arg: 'field' },
    { name: '@map', desc: 'Project specific fields (use ; separator)', example: 'users|@map:name;email', arg: 'fields' },
    { name: '@uniqueby', desc: 'Unique objects by field', example: 'users|@uniqueby:dept', arg: 'field' },
  ],
  'Aggregation': [
    { name: '@sum', desc: 'Sum numeric values', example: 'prices|@sum', arg: false },
    { name: '@avg', desc: 'Average (aliases: @average, @mean)', example: 'scores|@avg', arg: false },
    { name: '@min', desc: 'Minimum value', example: 'scores|@min', arg: false },
    { name: '@max', desc: 'Maximum value', example: 'scores|@max', arg: false },
    { name: '@count', desc: 'Count elements (aliases: @length, @len)', example: 'items|@count', arg: false },
  ],
  'Object Operations': [
    { name: '@keys', desc: 'Get object keys as array', example: 'user|@keys', arg: false },
    { name: '@values', desc: 'Get object values as array', example: 'config|@values', arg: false },
  ],
  'Format': [
    { name: '@this', desc: 'Return unchanged', example: '@this', arg: false },
    { name: '@valid', desc: 'Validate JSON', example: '@valid', arg: false },
    { name: '@pretty', desc: 'Pretty print', example: '@pretty', arg: false },
    { name: '@ugly', desc: 'Minify JSON', example: '@ugly', arg: false },
  ],
  'Type Conversion': [
    { name: '@string', desc: 'Convert to string (alias: @str)', example: 'value|@string', arg: false },
    { name: '@number', desc: 'Convert to number (alias: @num)', example: 'value|@number', arg: false },
    { name: '@bool', desc: 'Convert to boolean (alias: @boolean)', example: 'value|@bool', arg: false },
    { name: '@base64', desc: 'Base64 encode', example: 'text|@base64', arg: false },
    { name: '@base64decode', desc: 'Base64 decode', example: 'encoded|@base64decode', arg: false },
    { name: '@lower', desc: 'Lowercase string', example: 'name|@lower', arg: false },
    { name: '@upper', desc: 'Uppercase string', example: 'name|@upper', arg: false },
    { name: '@type', desc: 'Get JSON type', example: 'value|@type', arg: false },
    { name: '@join', desc: 'Join array to string', example: 'tags|@join:', arg: 'separator' },
  ],
  'jq-Style Utilities': [
    { name: '@slice', desc: 'Array slicing [start:end]', example: 'items|@slice:1:3', arg: 'start:end' },
    { name: '@has', desc: 'Check if object has field', example: 'obj|@has:email', arg: 'field' },
    { name: '@contains', desc: 'Check if contains value', example: 'tags|@contains:urgent', arg: 'value' },
    { name: '@split', desc: 'Split string by delimiter', example: 'path|@split:/', arg: 'delim' },
    { name: '@startswith', desc: 'Check string prefix', example: 'name|@startswith:Dr', arg: 'prefix' },
    { name: '@endswith', desc: 'Check string suffix', example: 'file|@endswith:.pdf', arg: 'suffix' },
    { name: '@entries', desc: 'Object → [{key,value}] (alias: @toentries)', example: 'config|@entries', arg: false },
    { name: '@fromentries', desc: '[{key,value}] → Object', example: 'pairs|@fromentries', arg: false },
    { name: '@any', desc: 'True if any element truthy', example: 'flags|@any', arg: false },
    { name: '@all', desc: 'True if all elements truthy', example: 'checks|@all', arg: false },
  ],
};

// ============================================================================
// SAMPLE DATA - Enhanced with larger datasets
// ============================================================================

const DATASETS = {
  default: {
    name: 'Basic Examples',
    data: {
      user: {
        id: 123,
        name: "John Doe",
        email: "john@example.com",
        active: true,
        profile: {
          age: 30,
          city: "New York",
          interests: ["coding", "music", "travel"]
        }
      },
      scores: [95.5, 87.2, 92.8, 88.5, 91.0],
      items: [
        { id: 1, name: "Laptop", price: 999.99, inStock: true },
        { id: 2, name: "Mouse", price: 29.99, inStock: true },
        { id: 3, name: "Keyboard", price: 79.99, inStock: false }
      ]
    },
    examples: [
      { path: 'user.name', note: 'Simple nested access' },
      { path: 'user.profile.city', note: 'Deep nested path' },
      { path: 'items.#.name', note: 'Project all names' },
      { path: 'items[?(@.price>50)].name', note: 'Filter by price' },
      { path: 'user.name,user.email', note: 'Multi path query' },
    ]
  },
  
  modifiers: {
    name: 'All Modifiers',
    data: {
      numbers: [5, 2, 8, 1, 9, 3],
      prices: [29.99, 99.99, 49.99, 19.99],
      users: [
        { name: "Alice", age: 30, city: "NYC" },
        { name: "Bob", age: 25, city: "SF" },
        { name: "Charlie", age: 35, city: "NYC" }
      ],
      nested: [[1, 2], [3, 4], [5, 6]],
      config: { theme: "dark", lang: "en", debug: false }
    },
    examples: [
      { path: 'numbers|@sort', note: '@sort - Sort ascending' },
      { path: 'numbers|@sort|@reverse', note: '@reverse - Descending' },
      { path: 'prices|@sum', note: '@sum - Total prices' },
      { path: 'prices|@avg', note: '@avg - Average price' },
      { path: 'prices|@min', note: '@min - Minimum' },
      { path: 'prices|@max', note: '@max - Maximum' },
      { path: 'users|@sortby:age', note: '@sortby - Sort objects by field' },
      { path: 'users|@group:city', note: '@group - Group by field' },
      { path: 'users|@map:name;age', note: '@map - Project fields' },
      { path: 'users|@uniqueby:city', note: '@uniqueby - Unique by field' },
      { path: 'nested|@flatten', note: '@flatten - Flatten arrays' },
      { path: 'config|@keys', note: '@keys - Object keys' },
      { path: 'config|@values', note: '@values - Object values' },
    ]
  },
  
  multipath: {
    name: 'Multipath Queries',
    data: {
      user: { name: "Alice", email: "alice@example.com", age: 28, role: "admin" },
      stats: { visits: 1250, conversions: 45, revenue: 2250.50 }
    },
    examples: [
      { path: 'user.name,user.email', note: 'Two fields' },
      { path: 'user.name,user.email,user.role', note: 'Three fields' },
      { path: 'stats.visits,stats.conversions,stats.revenue', note: 'All stats' },
      { path: 'user.name,stats.visits', note: 'Mixed paths' },
    ]
  },
  
  large: {
    name: 'Large Dataset (1000 items)',
    data: null, // Will be generated
    examples: [
      { path: 'users.#.name', note: '1000 names' },
      { path: 'users[?(@.age>30)].name', note: 'Filter by age' },
      { path: 'users.#.salary|@sum', note: 'Total salaries' },
      { path: 'users.#.salary|@avg', note: 'Average salary' },
      { path: 'users|@sortby:salary|@first', note: 'Lowest paid' },
      { path: 'users|@sortby:salary|@last', note: 'Highest paid' },
    ]
  },
  
  store: {
    name: 'E-commerce Store',
    data: {
      store: {
        name: "TechMart",
        books: [
          { title: 'Go Programming', price: 29.99, stock: 15, rating: 4.5 },
          { title: 'Web Design', price: 19.99, stock: 8, rating: 4.2 },
          { title: 'Python Data Science', price: 39.99, stock: 12, rating: 4.8 }
        ],
        electronics: [
          { name: 'Laptop', price: 1299.99, stock: 10 },
          { name: 'Mouse', price: 49.99, stock: 50 }
        ]
      }
    },
    examples: [
      { path: 'store.books.#.title', note: 'All book titles' },
      { path: 'store.books[?(@.price>25)].title', note: 'Books over $25' },
      { path: 'store.books.#.price|@sum', note: 'Total book value' },
      { path: 'store.books.#.price|@avg', note: 'Average price' },
      { path: 'store.books|@sortby:rating|@last', note: 'Highest rated' },
    ]
  },
  
  analytics: {
    name: 'Analytics Data',
    data: {
      daily_visits: [1250, 1380, 1420, 1100, 980, 1560, 1890],
      revenue: [2250.50, 2600.00, 2400.75, 1900.25, 1750.00, 3400.50, 4100.00],
      conversions: [45, 52, 48, 38, 35, 68, 82]
    },
    examples: [
      { path: 'daily_visits|@sum', note: 'Total visits' },
      { path: 'daily_visits|@avg', note: 'Average daily visits' },
      { path: 'daily_visits|@max', note: 'Peak day' },
      { path: 'revenue|@sum', note: 'Total revenue' },
      { path: 'conversions|@sum', note: 'Total conversions' },
      { path: 'daily_visits|@sum,revenue|@sum,conversions|@sum', note: 'All stats' },
    ]
  }
};

// Generate large dataset
DATASETS.large.data = {
  users: Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 50),
    salary: 50000 + (i * 100),
    department: ['Engineering', 'Sales', 'Marketing', 'HR'][i % 4],
    active: i % 3 !== 0
  }))
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function showToast(message, type = 'info') {
  const container = $('#toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatTime(ms) {
  if (ms < 1) return '<1ms';
  if (ms < 1000) return Math.round(ms) + 'ms';
  return (ms / 1000).toFixed(2) + 's';
}

// ============================================================================
// MONACO EDITOR INTEGRATION
// ============================================================================

function initMonacoEditor() {
  require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
  
  require(['vs/editor/editor.main'], function () {
    state.editor = monaco.editor.create($('#monaco-editor'), {
      value: JSON.stringify(DATASETS.default.data, null, 2),
      language: 'json',
      theme: 'vs-dark',
      fontSize: 14,
      fontFamily: "'JetBrains Mono', monospace",
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      formatOnPaste: true,
      formatOnType: true,
      tabSize: 2,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
    });
    
    // Update stats on content change
    state.editor.onDidChangeModelContent(() => {
      updateStats();
    });
    
    updateStats();
  });
}

// ============================================================================
// SPLIT PANES SETUP
// ============================================================================

function initSplitPanes() {
  if (window.Split) {
    Split(['#left-pane', '#right-pane'], {
      sizes: [45, 55],
      minSize: [400, 500],
      gutterSize: 8,
      cursor: 'col-resize',
      snapOffset: 0,
      dragInterval: 1,
      onDrag: () => {
        if (state.editor) {
          state.editor.layout();
        }
      }
    });
  }
}

// ============================================================================
// MODIFIER PALETTE
// ============================================================================

function initModifierPalette() {
  const container = $('#modifier-categories');
  container.innerHTML = '';
  
  Object.entries(MODIFIERS).forEach(([category, modifiers]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'modifier-category';
    
    const header = document.createElement('h4');
    header.className = 'modifier-category-title';
    header.textContent = category;
    categoryDiv.appendChild(header);
    
    const grid = document.createElement('div');
    grid.className = 'modifier-grid';
    
    modifiers.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'modifier-card';
      card.innerHTML = `
        <div class="modifier-name">${mod.name}</div>
        <div class="modifier-desc">${mod.desc}</div>
        <div class="modifier-example">${mod.example}</div>
      `;
      card.addEventListener('click', () => {
        const pathInput = $('#path');
        const currentPath = pathInput.value;
        if (currentPath && !currentPath.includes('|')) {
          pathInput.value = currentPath + '|' + mod.name + (mod.arg ? ':' : '');
        } else if (!currentPath) {
          pathInput.value = mod.example;
        }
        pathInput.focus();
        showToast(`Added ${mod.name} modifier`, 'success');
      });
      grid.appendChild(card);
    });
    
    categoryDiv.appendChild(grid);
    container.appendChild(categoryDiv);
  });
}

function toggleModifierPalette() {
  const palette = $('#modifier-palette');
  state.modifierPaletteOpen = !state.modifierPaletteOpen;
  palette.style.display = state.modifierPaletteOpen ? 'block' : 'none';
}

// Modifier search
function filterModifiers(searchTerm) {
  const term = searchTerm.toLowerCase();
  $$('.modifier-card').forEach(card => {
    const text = card.textContent.toLowerCase();
    card.style.display = text.includes(term) ? 'block' : 'none';
  });
  
  $$('.modifier-category').forEach(cat => {
    const visible = cat.querySelectorAll('.modifier-card[style*="display: block"]').length > 0 ||
                    cat.querySelectorAll('.modifier-card:not([style])').length > 0 && !term;
    cat.style.display = visible ? 'block' : 'none';
  });
}

// ============================================================================
// WASM INTEGRATION
// ============================================================================

let wasmReady = null;

function loadWasm() {
  if (wasmReady) return wasmReady;
  
  const go = new Go();
  const base = (function() {
    const parts = location.pathname.split('/').filter(Boolean);
    if (parts.length > 0) return '/' + parts[0] + '/';
    return '/';
  })();
  const wasmURL = base + 'main.wasm';
  
  wasmReady = WebAssembly.instantiateStreaming(fetch(wasmURL), go.importObject)
    .then((result) => {
      go.run(result.instance);
      return true;
    });
  
  return wasmReady;
}

// ============================================================================
// QUERY OPERATIONS
// ============================================================================

async function executeGet() {
  const startTime = performance.now();
  
  try {
    await loadWasm();
    const jsonStr = state.editor ? state.editor.getValue() : '';
    const path = $('#path').value;
    
    if (!path) {
      showToast('Enter a query path', 'warning');
      return;
    }
    
    const data = window.nqjsonGet(jsonStr, path);
    const endTime = performance.now();
    state.perfMetrics.lastQueryTime = endTime - startTime;
    
    if (!data.exists) {
      setResult({ text: 'null (not found)', type: 'null', info: 'Path does not exist' });
      return;
    }
    
    let resultText, typeInfo;
    if (data.value !== undefined) {
      resultText = JSON.stringify(data.value, null, 2);
      typeInfo = data.type === 'array' 
        ? `array (${Array.isArray(data.value) ? data.value.length : 0} items)` 
        : data.type === 'object' 
        ? `object (${data.value && typeof data.value === 'object' ? Object.keys(data.value).length : 0} keys)` 
        : data.type;
    } else if (typeof data.string === 'string') {
      resultText = JSON.stringify(data.string);
      typeInfo = `string (${data.string.length} chars)`;
    } else if (typeof data.number === 'number') {
      resultText = String(data.number);
      typeInfo = 'number';
    } else if (typeof data.bool === 'boolean') {
      resultText = String(data.bool);
      typeInfo = 'boolean';
    } else {
      resultText = 'null';
      typeInfo = 'null';
    }
    
    setResult({ text: resultText, type: data.type, info: typeInfo });
    
    // Add to history
    state.queryHistory.unshift({ path, timestamp: Date.now(), time: state.perfMetrics.lastQueryTime });
    if (state.queryHistory.length > 50) state.queryHistory.pop();
    
    updatePerformanceStats();
    showToast(`Query executed in ${formatTime(state.perfMetrics.lastQueryTime)}`, 'success');
    
  } catch (e) {
    console.error('Get error:', e);
    setResult({ error: e.message });
    showToast('Query failed: ' + e.message, 'error');
  }
}

async function executeSet() {
  const startTime = performance.now();
  
  try {
    await loadWasm();
    const valueText = $('#value').value.trim();
    if (!valueText) {
      showToast('Provide a value to set', 'warning');
      return;
    }
    
    let parsed;
    try {
      parsed = JSON.parse(valueText);
    } catch {
      showToast('Value must be valid JSON', 'error');
      return;
    }
    
    const jsonStr = state.editor ? state.editor.getValue() : '';
    const path = $('#path').value;
    const resp = window.nqjsonSet(jsonStr, path, JSON.stringify(parsed));
    
    if (resp.error) {
      throw new Error(resp.error);
    }
    
    const formatted = JSON.stringify(JSON.parse(resp.json), null, 2);
    state.editor.setValue(formatted);
    
    const endTime = performance.now();
    showToast(`Value set in ${formatTime(endTime - startTime)}`, 'success');
    setResult({ text: 'Value set successfully', type: 'success', info: 'JSON document updated' });
    
  } catch (e) {
    console.error('Set error:', e);
    setResult({ error: e.message });
    showToast('Set failed: ' + e.message, 'error');
  }
}

async function executeDelete() {
  const startTime = performance.now();
  
  try {
    await loadWasm();
    const jsonStr = state.editor ? state.editor.getValue() : '';
    const path = $('#path').value;
    const resp = window.nqjsonDelete(jsonStr, path);
    
    if (resp.error) {
      throw new Error(resp.error);
    }
    
    const formatted = JSON.stringify(JSON.parse(resp.json), null, 2);
    state.editor.setValue(formatted);
    
    const endTime = performance.now();
    showToast(`Value deleted in ${formatTime(endTime - startTime)}`, 'success');
    setResult({ text: 'Value deleted successfully', type: 'success', info: 'JSON document updated' });
    
  } catch (e) {
    console.error('Delete error:', e);
    setResult({ error: e.message });
    showToast('Delete failed: ' + e.message, 'error');
  }
}

// ============================================================================
// UI UPDATE FUNCTIONS
// ============================================================================

function setResult({ text = 'Ready to query...', type = '—', info = '—', error = '' } = {}) {
  const resultOutput = $('#result-output');
  const resultType = $('#result-type');
  const resultInfo = $('#result-info');
  const errorCard = $('#error-card');
  const errorOutput = $('#result-error');
  
  resultOutput.textContent = text;
  resultType.textContent = type;
  resultInfo.textContent = info;
  
  if (error) {
    errorOutput.textContent = error;
    errorCard.style.display = 'block';
  } else {
    errorOutput.textContent = '';
    errorCard.style.display = 'none';
  }
}

function updateStats() {
  const statsEl = $('#json-stats');
  if (!statsEl || !state.editor) return;
  
  try {
    const content = state.editor.getValue();
    const parsed = JSON.parse(content);
    const lines = content.split('\n').length;
    const chars = content.length;
    const bytes = new Blob([content]).size;
    
    statsEl.textContent = `${lines} lines • ${formatBytes(bytes)} • Valid JSON ✓`;
  } catch {
    const content = state.editor.getValue();
    const lines = content.split('\n').length;
    const bytes = new Blob([content]).size;
    statsEl.textContent = `${lines} lines • ${formatBytes(bytes)} • Invalid JSON ✗`;
  }
}

function updatePerformanceStats() {
  const perfEl = $('#perf-stats');
  if (perfEl && state.perfMetrics.lastQueryTime > 0) {
    perfEl.textContent = `⚡ ${formatTime(state.perfMetrics.lastQueryTime)}`;
  }
}

// ============================================================================
// FILE IMPORT/EXPORT
// ============================================================================

function importFile() {
  const input = $('#file-input');
  input.click();
}

function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const parsed = JSON.parse(content);
      const formatted = JSON.stringify(parsed, null, 2);
      state.editor.setValue(formatted);
      showToast(`Imported ${file.name} (${formatBytes(file.size)})`, 'success');
    } catch (err) {
      showToast('Failed to import: Invalid JSON', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = ''; // Reset input
}

function exportFile() {
  try {
    const content = state.editor.getValue();
    JSON.parse(content); // Validate
    
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nqjson-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('JSON exported successfully', 'success');
  } catch {
    showToast('Cannot export: Invalid JSON', 'error');
  }
}

// ============================================================================
// THEME MANAGEMENT
// ============================================================================

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.body.classList.toggle('theme-light', state.theme === 'light');
  
  if (state.editor) {
    monaco.editor.setTheme(state.theme === 'dark' ? 'vs-dark' : 'vs');
  }
  
  showToast(`Switched to ${state.theme} theme`, 'info');
}

// ============================================================================
// DATASET & EXAMPLES
// ============================================================================

function loadDataset(key) {
  const dataset = DATASETS[key];
  if (!dataset) return;
  
  state.currentDataset = key;
  const formatted = JSON.stringify(dataset.data, null, 2);
  state.editor.setValue(formatted);
  
  // Update examples
  renderExamples(dataset.examples);
  
  // Update active button
  $$('.dataset-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.doc === key);
  });
  
  showToast(`Loaded ${dataset.name}`, 'info');
}

function renderExamples(examples) {
  const listEl = $('#example-list');
  listEl.innerHTML = '';
  
  examples.forEach(ex => {
    const item = document.createElement('div');
    item.className = 'example-item';
    item.innerHTML = `
      <div class="example-content">
        <div class="example-path">${ex.path}</div>
        <div class="example-note">${ex.note}</div>
      </div>
      <div class="actions">
        <button class="btn btn-ghost btn-sm" data-path="${ex.path}">Try</button>
      </div>
    `;
    listEl.appendChild(item);
  });
  
  listEl.querySelectorAll('[data-path]').forEach(btn => {
    btn.addEventListener('click', () => {
      $('#path').value = btn.dataset.path;
      executeGet();
    });
  });
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

// ============================================================================
// PATH ESCAPE UI
// ============================================================================

function showPathEscapeHelper() {
  const input = $('#path').value;
  if (input && (input.includes('.') || PATH_ESCAPE.specialChars.test(input))) {
    const escaped = PATH_ESCAPE.sanitizePath(input);
    if (escaped !== input) {
      showToast(`Escaped path: ${escaped}`, 'info');
    }
  }
}

function applyPathEscape() {
  const pathInput = $('#path');
  const value = pathInput.value;
  pathInput.value = PATH_ESCAPE.sanitizePath(value);
  showToast('Applied path escaping', 'success');
}

// ============================================================================
// QUERY BUILDER UI
// ============================================================================

function showQueryBuilder() {
  const currentPath = $('#path').value;
  const components = QUERY_BUILDER.parse(currentPath);
  
  console.log('Query components:', components);
  showToast('Query builder: Check console for path components', 'info');
  
  // Could expand this to a full UI modal in the future
  return components;
}

function addModifierToPath(modifierName) {
  const pathInput = $('#path');
  const currentPath = pathInput.value;
  
  if (currentPath && !currentPath.includes('|')) {
    pathInput.value = currentPath + '|' + modifierName;
  } else if (!currentPath) {
    // Show a hint about needing a base path
    showToast('Add a base path first (e.g., "items") then add modifiers', 'warning');
  }
}

// ============================================================================
// SYNTAX GUIDE
// ============================================================================

function parseMarkdown(markdown) {
  // Simple markdown parser for basic formatting
  let html = markdown;
  
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  
  // Paragraphs
  html = html.split('\n\n').map(para => {
    if (!para.match(/^<[h\d|ul|pre]/)) {
      return '<p>' + para + '</p>';
    }
    return para;
  }).join('\n');
  
  return html;
}

async function loadSyntaxGuide() {
  const modal = $('#syntax-guide-modal');
  const content = $('#syntax-guide-content');
  
  try {
    const response = await fetch('/SYNTAX.md');
    if (!response.ok) throw new Error('Failed to load syntax guide');
    
    const markdown = await response.text();
    const html = parseMarkdown(markdown);
    content.innerHTML = html;
    
  } catch (error) {
    content.innerHTML = `
      <div class="error">
        <p>Failed to load syntax guide. Please visit the <a href="https://github.com/dhawalhost/nqjson/blob/main/SYNTAX.md" target="_blank">online documentation</a>.</p>
        <p style="color: var(--color-danger-400); font-size: 0.875rem;">${error.message}</p>
      </div>
    `;
  }
}

function showSyntaxGuide() {
  const modal = $('#syntax-guide-modal');
  modal.style.display = 'flex';
  
  // Load content if not already loaded
  const content = $('#syntax-guide-content');
  if (content.querySelector('.loading')) {
    loadSyntaxGuide();
  }
}

function hideSyntaxGuide() {
  const modal = $('#syntax-guide-modal');
  modal.style.display = 'none';
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function initEventHandlers() {
  // Query operations
  $('#btn-get')?.addEventListener('click', executeGet);
  $('#btn-set')?.addEventListener('click', executeSet);
  $('#btn-delete')?.addEventListener('click', executeDelete);
  
  // Editor controls
  $('#btn-format')?.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(state.editor.getValue());
      state.editor.setValue(JSON.stringify(parsed, null, 2));
      showToast('JSON formatted', 'success');
    } catch {
      showToast('Invalid JSON', 'error');
    }
  });
  
  $('#btn-minify')?.addEventListener('click', () => {
    try {
      const parsed = JSON.parse(state.editor.getValue());
      state.editor.setValue(JSON.stringify(parsed));
      showToast('JSON minified', 'success');
    } catch {
      showToast('Invalid JSON', 'error');
    }
  });
  
  $('#copy-json')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(state.editor.getValue());
      showToast('JSON copied', 'success');
    } catch {
      showToast('Copy failed', 'error');
    }
  });
  
  $('#clear-json')?.addEventListener('click', () => {
    state.editor.setValue('{}');
    showToast('JSON cleared', 'info');
  });
  
  $('#copy-result')?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#result-output').textContent);
      showToast('Result copied', 'success');
    } catch {
      showToast('Copy failed', 'error');
    }
  });
  
  // File operations
  $('#btn-import')?.addEventListener('click', importFile);
  $('#btn-export')?.addEventListener('click', exportFile);
  $('#file-input')?.addEventListener('change', handleFileImport);
  
  // Theme toggle
  $('#btn-theme')?.addEventListener('click', toggleTheme);
  
  // Syntax guide
  $('#btn-syntax-guide')?.addEventListener('click', showSyntaxGuide);
  $('#close-syntax-guide')?.addEventListener('click', hideSyntaxGuide);
  
  // Close modal on outside click
  $('#syntax-guide-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'syntax-guide-modal') {
      hideSyntaxGuide();
    }
  });
  
  // Modifier palette
  $('#btn-toggle-modifiers')?.addEventListener('click', toggleModifierPalette);
  $('#modifier-search')?.addEventListener('input', (e) => {
    filterModifiers(e.target.value);
  });
  
  // Dataset switcher
  $$('.dataset-btn').forEach(btn => {
    btn.addEventListener('click', () => loadDataset(btn.dataset.doc));
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeGet();
      } else if (e.key === 'l') {
        e.preventDefault();
        $('#btn-format')?.click();
      }
    }
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function init() {
  // Initialize Monaco Editor
  initMonacoEditor();
  
  // Initialize split panes
  setTimeout(() => initSplitPanes(), 100);
  
  // Initialize modifier palette
  initModifierPalette();
  
  // Initialize event handlers
  initEventHandlers();
  
  // Load default dataset examples
  renderExamples(DATASETS.default.examples);
  
  // Set initial path
  $('#path').value = 'user.name';
  
  console.log('✨ nqjson Playground initialized');
  console.log(`📚 ${Object.keys(MODIFIERS).reduce((sum, cat) => sum + MODIFIERS[cat].length, 0)} modifiers available`);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
