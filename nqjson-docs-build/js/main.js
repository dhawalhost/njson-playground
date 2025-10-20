/**
 * nqjson Documentation JavaScript
 * Handles navigation, tabs, copy functionality, and interactivity
 */

// ==================== Mobile Navigation ====================
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
    
    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
});

// ==================== Tab Functionality ====================
document.addEventListener('DOMContentLoaded', () => {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      const targetContent = document.getElementById(`tab-${targetTab}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
});

// ==================== Copy to Clipboard ====================
document.addEventListener('DOMContentLoaded', () => {
  // Copy buttons with data-copy attribute
  const copyBtns = document.querySelectorAll('.btn-copy');
  
  copyBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const textToCopy = btn.getAttribute('data-copy');
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        showCopyFeedback(btn);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
  
  // Add copy buttons to all code blocks
  const codeBlocks = document.querySelectorAll('pre code');
  codeBlocks.forEach(codeBlock => {
    const pre = codeBlock.parentElement;
    
    // Skip if already has copy button
    if (pre.querySelector('.code-copy-btn')) return;
    
    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4 2a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 1h8a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"/>
        <path d="M2 0a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-1h1a2 2 0 002-2V2a2 2 0 00-2-2H5a2 2 0 00-2 2v1H2z"/>
      </svg>
    `;
    copyBtn.setAttribute('aria-label', 'Copy code');
    
    // Position relative to pre
    pre.style.position = 'relative';
    pre.appendChild(copyBtn);
    
    // Copy functionality
    copyBtn.addEventListener('click', async () => {
      const code = codeBlock.textContent;
      
      try {
        await navigator.clipboard.writeText(code);
        showCopyFeedback(copyBtn);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });
  });
});

// Show copy feedback
function showCopyFeedback(btn) {
  const originalHTML = btn.innerHTML;
  
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 11.708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
    </svg>
  `;
  btn.style.color = '#10b981';
  
  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.color = '';
  }, 2000);
}

// ==================== Smooth Scroll ====================
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if href is just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// ==================== Scroll to Top Button ====================
document.addEventListener('DOMContentLoaded', () => {
  // Create scroll to top button
  const scrollBtn = document.createElement('button');
  scrollBtn.className = 'scroll-to-top';
  scrollBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M10.707 3.293a1 1 0 00-1.414 0l-6 6a1 1 0 001.414 1.414L9 6.414V17a1 1 0 102 0V6.414l4.293 4.293a1 1 0 001.414-1.414l-6-6z"/>
    </svg>
  `;
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollBtn);
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top on click
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // Add CSS for scroll button
  const style = document.createElement('style');
  style.textContent = `
    .scroll-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #00B4D8 0%, #0077B6 100%);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 180, 216, 0.3);
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px);
      transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 99;
    }
    
    .scroll-to-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .scroll-to-top:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 20px rgba(0, 180, 216, 0.4);
    }
    
    .code-copy-btn {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #9ca3af;
      padding: 0.5rem;
      border-radius: 0.375rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 150ms;
      opacity: 0;
    }
    
    pre:hover .code-copy-btn {
      opacity: 1;
    }
    
    .code-copy-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #90E0EF;
    }
  `;
  document.head.appendChild(style);
});

// ==================== Active Navigation Link ====================
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href)) {
      link.style.color = '#00B4D8';
      link.style.fontWeight = '700';
    }
  });
});

// ==================== Search Functionality (Ctrl+K) ====================
document.addEventListener('DOMContentLoaded', () => {
  // Create search modal
  const searchModal = document.createElement('div');
  searchModal.className = 'search-modal';
  searchModal.innerHTML = `
    <div class="search-modal-backdrop"></div>
    <div class="search-modal-content">
      <div class="search-modal-header">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Search documentation..."
          aria-label="Search"
        />
        <button class="search-close" aria-label="Close search">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
          </svg>
        </button>
      </div>
      <div class="search-results">
        <p class="search-hint">Start typing to search...</p>
      </div>
    </div>
  `;
  document.body.appendChild(searchModal);
  
  const backdrop = searchModal.querySelector('.search-modal-backdrop');
  const closeBtn = searchModal.querySelector('.search-close');
  const searchInput = searchModal.querySelector('.search-input');
  
  // Open search with Ctrl+K or Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchModal.classList.add('active');
      searchInput.focus();
    }
    
    // Close with Escape
    if (e.key === 'Escape' && searchModal.classList.contains('active')) {
      searchModal.classList.remove('active');
    }
  });
  
  // Close search
  function closeSearch() {
    searchModal.classList.remove('active');
    searchInput.value = '';
  }
  
  backdrop.addEventListener('click', closeSearch);
  closeBtn.addEventListener('click', closeSearch);
  
  // Add CSS for search modal
  const searchStyle = document.createElement('style');
  searchStyle.textContent = `
    .search-modal {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
      display: none;
    }
    
    .search-modal.active {
      display: block;
    }
    
    .search-modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }
    
    .search-modal-content {
      position: relative;
      max-width: 600px;
      margin: 10vh auto 0;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }
    
    .search-modal-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .search-input {
      flex: 1;
      font-size: 1.125rem;
      border: none;
      outline: none;
      font-family: inherit;
    }
    
    .search-close {
      background: none;
      border: none;
      color: #6b7280;
      cursor: pointer;
      padding: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.375rem;
      transition: all 150ms;
    }
    
    .search-close:hover {
      background: #f3f4f6;
      color: #00B4D8;
    }
    
    .search-results {
      padding: 1.5rem;
      max-height: 400px;
      overflow-y: auto;
    }
    
    .search-hint {
      color: #9ca3af;
      text-align: center;
      margin: 0;
    }
  `;
  document.head.appendChild(searchStyle);
});

// ==================== Code Syntax Highlighting ====================
document.addEventListener('DOMContentLoaded', () => {
  // Basic syntax highlighting for Go code
  const codeBlocks = document.querySelectorAll('code.language-go');
  
  codeBlocks.forEach(block => {
    let html = block.innerHTML;
    
    // Keywords
    const keywords = ['package', 'import', 'func', 'var', 'const', 'type', 'struct', 'interface', 
                      'return', 'if', 'else', 'for', 'range', 'switch', 'case', 'default', 
                      'break', 'continue', 'go', 'defer', 'select', 'chan', 'map'];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      html = html.replace(regex, `<span class="token keyword">${keyword}</span>`);
    });
    
    // Strings
    html = html.replace(/"([^"]*)"/g, '<span class="token string">"$1"</span>');
    html = html.replace(/`([^`]*)`/g, '<span class="token string">`$1`</span>');
    
    // Numbers
    html = html.replace(/\b(\d+\.?\d*)\b/g, '<span class="token number">$1</span>');
    
    // Comments
    html = html.replace(/\/\/(.*?)$/gm, '<span class="token comment">//$1</span>');
    html = html.replace(/\/\*(.*?)\*\//gs, '<span class="token comment">/*$1*/</span>');
    
    // Functions
    html = html.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\(/g, '<span class="token function">$1</span>(');
    
    block.innerHTML = html;
  });
});

// ==================== Utility Functions ====================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// ==================== Animation on Scroll ====================
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, observerOptions);
  
  // Observe elements
  const animatedElements = document.querySelectorAll('.feature-card, .stat-card');
  animatedElements.forEach(el => {
    el.classList.add('aos-element');
    observer.observe(el);
  });
  
  // Add animation CSS
  const animStyle = document.createElement('style');
  animStyle.textContent = `
    .aos-element {
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .aos-element.aos-animate {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(animStyle);
});

console.log('nqjson documentation loaded successfully! 🚀');
