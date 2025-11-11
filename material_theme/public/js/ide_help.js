// Hide the Help dropdown (trigger + content) reliably, even after Desk re-renders.
(() => {
  const removeHelpNow = () => {
    // Remove the Help dropdown trigger (li.dropdown-help)
    document.querySelectorAll(
      '.dropdown-help, li.dropdown-help, .navbar [data-label="Help"], .navbar a[title="Help"], .navbar [aria-label="Help"]'
    ).forEach(el => {
      const box = el.closest('.dropdown, li') || el;
      box.style.display = 'none';
      box.remove?.();
    });

    // If the menu content already exists, hide its container as well
    const anyHelpItem = document.querySelector(
      '#help-links, .documentation-links, a.dropdown-item[href*="docs.erpnext.com"], a.dropdown-item[href*="discuss.frappe.io"], a.dropdown-item[href*="frappe.io/school"], a.dropdown-item[href*="github.com/frappe/erpnext/issues"], a.dropdown-item[href*="frappe.io/support"], button.dropdown-item[onclick*="show_about"], button.dropdown-item[onclick*="show_shortcuts"]'
    );
    if (anyHelpItem) {
      const menu = anyHelpItem.closest('.dropdown-menu');
      const container = menu?.closest('.dropdown, li.dropdown');
      if (menu) menu.style.display = 'none';
      if (container) { container.style.display = 'none'; container.remove?.(); }
    }
  };

  const start = () => {
    // try immediately
    removeHelpNow();

    // try repeatedly for a short while (handles lazy/batched renders)
    let tries = 0;
    const iv = setInterval(() => {
      removeHelpNow();
      if (++tries > 40) clearInterval(iv);
    }, 200);

    // keep watching long-term (handles page route changes)
    new MutationObserver(removeHelpNow).observe(document.documentElement, { childList: true, subtree: true });

    // run again after boot data loads (Desk events)
    (window.frappe && frappe.after_ajax) && frappe.after_ajax(removeHelpNow);
    document.addEventListener('app_ready', removeHelpNow, { once: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
