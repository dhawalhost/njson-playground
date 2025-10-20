const $ = (s) => document.querySelector(s);
const jsonInput = $('#json-input');
const pathInput = $('#path');
const valueInput = $('#value');
const out = {
  result: $('#result-output'),
  type: $('#result-type'),
  info: $('#result-info'),
  error: $('#result-error')
};

const sample = {
  user: {
    id: 123,
    name: "John",
    active: true,
    profile: {
      age: 30,
      interests: ["sports","music"],
      address: { city: "New York", zip: "10001" }
    }
  },
  items: Array.from({length: 5}).map((_,i) => ({ id:i, name:`Item ${i}`, tags:[`t${i}`, `t${i+1}`] }))
};

const docs = {
  default: {
    json: sample,
    examples: [
      { title: 'Basic key', path: 'user.name', note: 'Simple object key access' },
      { title: 'Nested key', path: 'user.profile.address.city', note: 'Nested object path' },
      { title: 'Array index (dot)', path: 'items.1.name', note: 'Index into array via dot' },
      { title: 'Array index (bracket)', path: 'items[2].tags[0]', note: 'Bracket notation' },
      { title: 'All array elements', path: 'items.#', note: 'Return the full array' },
      { title: 'Map field from all elements', path: 'items.#.name', note: 'Project a field' },
      { title: 'Filter: regex', path: 'items[?(@.name=~"Item [34]")].id', note: 'Regex filter' },
      { title: 'Modifier: reverse', path: 'items.#@reverse', note: 'Reverse order' },
    ],
  },
  store: {
    json: {
      store: {
        books: [
          { title: 'Go Programming', price: 29.99, authors: ['John Doe','Jane Smith'], metadata: { category: 'programming', tags: ['go','programming','backend'] } },
          { title: 'Web Design', price: 19.99, authors: ['Alice Johnson'], metadata: { category: 'design', tags: ['html','css','frontend'] } },
        ]
      }
    },
    examples: [
      { title: 'Title of first book', path: 'store.books.0.title' },
      { title: 'Books over $25', path: 'store.books[?(@.price>25)].title' },
      { title: 'All categories', path: 'store.books.#.metadata.category' },
      { title: 'First author of first book', path: 'store.books.0.authors[0]' },
      { title: 'Books in reverse', path: 'store.books.#@reverse' },
    ],
  },
  employees: {
    json: {
      employees: [
        { name: 'Alice', age: 30, department: 'engineering', active: true },
        { name: 'Bob', age: 25, department: 'marketing', active: false },
        { name: 'Charlie', age: 35, department: 'engineering', active: true },
      ]
    },
    examples: [
      { title: 'Active employee names', path: 'employees[?(@.active==true)].name' },
      { title: 'Engineering ages', path: 'employees[?(@.department=="engineering")].age' },
      { title: 'Age > 28 departments', path: 'employees[?(@.age>28)].department' },
    ],
  },
};

function setJSON(obj) {
  jsonInput.value = JSON.stringify(obj, null, 2);
}

function getJSONBytes() {
  const s = jsonInput.value.trim();
  return new TextEncoder().encode(s);
}

function setResult({ text = 'Ready to query...', type = '—', info = '—', error = '' } = {}) {
  out.result.textContent = text;
  out.type.textContent = type;
  if (out.info) out.info.textContent = info;
  out.error.textContent = error || 'No errors';
}

function updateStats() {
  const statsEl = $('#json-stats');
  if (statsEl) {
    try {
      const parsed = JSON.parse(jsonInput.value);
      const lines = jsonInput.value.split('\n').length;
      const chars = jsonInput.value.length;
      statsEl.textContent = `${lines} lines, ${chars} chars`;
    } catch {
      statsEl.textContent = 'Invalid JSON';
    }
  }
}

// WASM bridge helpers
function ensureGoRuntime() {
  if (!window.__goInstance) {
    // eslint-disable-next-line no-undef
    const go = new Go();
    window.__goInstance = go;
  }
  return window.__goInstance;
}

let wasmReady = null;
function loadWasm() {
  if (wasmReady) return wasmReady;
  const go = ensureGoRuntime();
  const base = (function(){
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

async function onGet() {
  try {
    await loadWasm();
    const jsonStr = jsonInput.value;
    const data = window.nqjsonGet(jsonStr, pathInput.value);
    if (!data.exists) {
      setResult({ text: 'null (not found)', type: 'null', info: 'Path does not exist in document' });
      return;
    }
    if (data.value !== undefined) {
      const typeInfo = data.type === 'array' ? `array (${Array.isArray(data.value) ? data.value.length : 0} items)` :
                      data.type === 'object' ? `object (${data.value && typeof data.value === 'object' ? Object.keys(data.value).length : 0} keys)` :
                      data.type;
      setResult({ text: JSON.stringify(data.value, null, 2), type: data.type, info: typeInfo });
    } else if (typeof data.string === 'string') {
      setResult({ text: JSON.stringify(data.string), type: data.type, info: `string (${data.string.length} chars)` });
    } else if (typeof data.number === 'number') {
      setResult({ text: String(data.number), type: data.type, info: 'number' });
    } else if (typeof data.bool === 'boolean') {
      setResult({ text: String(data.bool), type: data.type, info: 'boolean' });
    } else {
      setResult({ text: 'null', type: 'null', info: 'null value' });
    }
    updateStats();
  } catch (e) {
    setResult({ error: e.message });
  }
}

async function onSet() {
  try {
    await loadWasm();
    const valueText = valueInput.value.trim();
    if (!valueText) throw new Error('Provide a JSON value to set');
    let parsed;
    try { parsed = JSON.parse(valueText); } catch { throw new Error('Value must be valid JSON'); }
    const resp = window.nqjsonSet(jsonInput.value, pathInput.value, JSON.stringify(parsed));
    if (resp.error) throw new Error(resp.error);
    jsonInput.value = JSON.stringify(JSON.parse(resp.json), null, 2);
    updateStats();
    setResult({ text: 'Value set successfully', type: 'success', info: 'JSON document updated' });
  } catch (e) {
    setResult({ error: e.message });
  }
}

async function onDelete() {
  try {
    await loadWasm();
    const resp = window.nqjsonDelete(jsonInput.value, pathInput.value);
    if (resp.error) throw new Error(resp.error);
    jsonInput.value = JSON.stringify(JSON.parse(resp.json), null, 2);
    updateStats();
    setResult({ text: 'Value deleted successfully', type: 'success', info: 'JSON document updated' });
  } catch (e) {
    setResult({ error: e.message });
  }
}

// Pretty/Compact
$('#btn-pretty').addEventListener('click', () => {
  try { 
    setJSON(JSON.parse(jsonInput.value)); 
    setResult({ text: 'JSON formatted', type: 'success', info: 'Applied pretty formatting' });
  } catch { 
    setResult({ error: 'Invalid JSON' }); 
  }
});
$('#btn-compact').addEventListener('click', () => {
  try { 
    jsonInput.value = JSON.stringify(JSON.parse(jsonInput.value)); 
    updateStats();
    setResult({ text: 'JSON compacted', type: 'success', info: 'Removed formatting' });
  } catch { 
    setResult({ error: 'Invalid JSON' }); 
  }
});

// Clear JSON button
const clearBtn = $('#clear-json');
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    jsonInput.value = '{}';
    updateStats();
    setResult({ text: 'JSON cleared', type: 'success', info: 'Document reset to empty object' });
  });
}

// JSON input change tracking
jsonInput.addEventListener('input', updateStats);

$('#btn-get').addEventListener('click', onGet);
$('#btn-set').addEventListener('click', onSet);
$('#btn-delete').addEventListener('click', onDelete);

// Initialize
setJSON(sample);
pathInput.value = 'user.profile.address.city';
setResult();
updateStats();

// Examples UI
const exampleList = document.getElementById('example-list');
const docsetButtons = document.querySelectorAll('.dataset-btn');

function renderExamples(key) {
  const set = docs[key] || docs.default;
  setJSON(set.json);
  exampleList.innerHTML = '';
  set.examples.forEach(ex => {
    const el = document.createElement('div');
    el.className = 'example-item';
    el.innerHTML = `
      <div class="example-content">
        <div class="example-title">${ex.title}</div>
        <div class="example-path">${ex.path}</div>
        <div class="example-note">${ex.note || ''}</div>
      </div>
      <div class="actions">
        <button class="btn btn-ghost" data-path="${ex.path}">Try</button>
        <button class="btn btn-ghost" data-copy="${ex.path}">Copy</button>
      </div>
    `;
    exampleList.appendChild(el);
  });

  exampleList.querySelectorAll('[data-path]').forEach(btn => {
    btn.addEventListener('click', () => {
      pathInput.value = btn.getAttribute('data-path');
      onGet();
    });
  });
  exampleList.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(btn.getAttribute('data-copy'));
      setResult({ text: 'Path copied to clipboard', type: 'success', info: 'Query path copied' });
    });
  });
}

docsetButtons.forEach(b => b.addEventListener('click', () => {
  // Update active state
  docsetButtons.forEach(btn => btn.classList.remove('active'));
  b.classList.add('active');
  renderExamples(b.dataset.doc);
}));
renderExamples('default');
renderExamples('default');
