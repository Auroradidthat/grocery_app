// Responsive nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const nav = navToggle.closest('nav');

function closeNav() {
    navLinks.classList.remove('nav-open');
    navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', isOpen);
});

// Close the mobile menu whenever the viewport crosses into desktop width,
// so it doesn't stay "open" if the window is later shrunk back down.
const desktopNavQuery = window.matchMedia('(min-width: 40rem)');

function closeNavOnDesktop(event) {
    if (event.matches) {
        closeNav();
    }
}

desktopNavQuery.addEventListener('change', closeNavOnDesktop);

// Close the menu when clicking anywhere outside the nav.
document.addEventListener('click', (event) => {
    const isOpen = navLinks.classList.contains('nav-open');
    if (isOpen && !nav.contains(event.target)) {
        closeNav();
    }
});

// Close the menu on Escape, and return focus to the toggle button
// so keyboard users land back where they started.
document.addEventListener('keydown', (event) => {
    const isOpen = navLinks.classList.contains('nav-open');
    if (isOpen && event.key === 'Escape') {
        closeNav();
        navToggle.focus();
    }
});

// Trap Tab/Shift+Tab focus inside the toggle button + links while the
// mobile menu is open, so keyboard users can't tab past it into content
// hidden behind it.
document.addEventListener('keydown', (event) => {
    const isOpen = navLinks.classList.contains('nav-open');
    if (!isOpen || event.key !== 'Tab') {
        return;
    }

    const focusableInMenu = [navToggle, ...navLinks.querySelectorAll('a')];
    const first = focusableInMenu[0];
    const last = focusableInMenu[focusableInMenu.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
});
