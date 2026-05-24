// tooltips.js - implementa tooltips leves sem dependências
(function(){
  'use strict';

  function initTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
      // set title for fallback
      if (!el.getAttribute('title')) el.setAttribute('title', el.getAttribute('data-tooltip'));

      // build tooltip element
      const tip = document.createElement('div');
      tip.className = 'simple-tooltip';
      tip.textContent = el.getAttribute('data-tooltip');
      tip.style.position = 'absolute';
      tip.style.padding = '6px 8px';
      tip.style.background = 'rgba(0,0,0,0.85)';
      tip.style.color = '#fff';
      tip.style.borderRadius = '6px';
      tip.style.fontSize = '0.9rem';
      tip.style.pointerEvents = 'none';
      tip.style.opacity = '0';
      tip.style.transition = 'opacity 0.12s ease, transform 0.12s ease';
      tip.style.zIndex = '9999';
      document.body.appendChild(tip);

      let showTimer = null;

      function show(e) {
        clearTimeout(showTimer);
        const rect = el.getBoundingClientRect();
        const top = rect.top - 8;
        const left = rect.left + window.scrollX + rect.width / 2;
        tip.style.transform = 'translate(-50%, -6px)';
        tip.style.left = left + 'px';
        tip.style.top = (top + window.scrollY) + 'px';
        tip.style.opacity = '1';
      }

      function hide() {
        tip.style.opacity = '0';
        tip.style.transform = 'translate(-50%, 0)';
      }

      el.addEventListener('mouseenter', show);
      el.addEventListener('focus', show);
      el.addEventListener('mouseleave', hide);
      el.addEventListener('blur', hide);

      // cleanup when element removed
      const observer = new MutationObserver(() => {
        if (!document.body.contains(el)) {
          tip.remove();
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Auto init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
  } else {
    initTooltips();
  }
})();
