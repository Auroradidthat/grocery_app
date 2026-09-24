// Grocery list: clicking a category item button adds it to the grocery list
// (quantity 1), then reveals "− Bell Pepper +" controls next to it. "+"
// increments by 1 each click; "−" decrements, removing the item once it
// reaches 0 and collapsing the controls back to the original plain button.
const groceryListUl = document.getElementById('grocery-list-ul');
const shoppingSection = document.querySelector('.category-list');
const itemStatus = document.getElementById('item-status');
const itemQuantities = new Map(); // item name -> current quantity (only present while > 0)
const groceryListItemElements = new Map(); // item name -> its <li> in the grocery list

function formatItemLabel(name, quantity) {
    return quantity > 1 ? `${name} ×${quantity}` : name; // × for quantities above 1
}

// The single announcer for shopping-list changes (the Grocery List section
// itself is no longer a live region, to avoid the same change being
// announced twice — one announcer per region).
function announce(message) {
    itemStatus.textContent = message;
}

// Creates/updates/removes the item's <li> in the grocery list to match its
// current quantity. Single source of truth so the list never drifts out of
// sync with the shopping-section controls.
function syncGroceryListItem(name) {
    const quantity = itemQuantities.get(name) || 0;
    let li = groceryListItemElements.get(name);

    if (quantity <= 0) {
        if (li) {
            li.remove();
            groceryListItemElements.delete(name);
        }
        return;
    }

    if (!li) {
        li = document.createElement('li');
        groceryListUl.appendChild(li);
        groceryListItemElements.set(name, li);
    }
    li.textContent = formatItemLabel(name, quantity);
}

function handleFirstAddClick(addButton) {
    const itemName = addButton.textContent.trim();
    itemQuantities.set(itemName, 1);
    syncGroceryListItem(itemName);

    // Group "− Bell Pepper +" so a screen reader announces the two buttons
    // and the name as related controls for this item, not unrelated pieces.
    const group = document.createElement('span');
    group.className = 'item-controls';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', itemName);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = '−'; // minus sign
    removeButton.setAttribute('aria-label', `Remove ${itemName}`);
    removeButton.dataset.role = 'remove';
    removeButton.dataset.item = itemName;

    const nameLabel = document.createElement('span');
    nameLabel.className = 'item-name';
    nameLabel.textContent = formatItemLabel(itemName, 1);

    // Reuse the same button element as "+" rather than destroying it —
    // its visible text is now just a glyph, so aria-label carries the name.
    addButton.textContent = '+';
    addButton.setAttribute('aria-label', `Add ${itemName}`);
    addButton.dataset.item = itemName;

    addButton.before(group);
    group.append(removeButton, nameLabel, addButton); // reparenting keeps focus/identity intact

    announce(`${itemName} added`);

    // Move focus to the newly revealed control rather than letting it fall
    // back to <body> — the user just acted here, so keep them oriented.
    removeButton.focus();
}

function handleIncrementClick(addButton) {
    const itemName = addButton.dataset.item;
    const quantity = (itemQuantities.get(itemName) || 0) + 1;
    itemQuantities.set(itemName, quantity);
    syncGroceryListItem(itemName);

    const nameLabel = addButton.closest('.item-controls').querySelector('.item-name');
    nameLabel.textContent = formatItemLabel(itemName, quantity);

    announce(`${itemName} quantity ${quantity}`);
}

function handleDecrementClick(removeButton) {
    const itemName = removeButton.dataset.item;
    const quantity = (itemQuantities.get(itemName) || 0) - 1;

    if (quantity <= 0) {
        itemQuantities.delete(itemName);
        syncGroceryListItem(itemName);

        const group = removeButton.parentElement;
        const addButton = group.querySelector('button:not([data-role="remove"])');

        addButton.textContent = itemName;
        addButton.removeAttribute('aria-label');
        addButton.removeAttribute('data-item');

        group.before(addButton); // move the add button back out before removing its wrapper
        group.remove();

        announce(`${itemName} removed`);
        addButton.focus();
        return;
    }

    itemQuantities.set(itemName, quantity);
    syncGroceryListItem(itemName);

    const nameLabel = removeButton.parentElement.querySelector('.item-name');
    nameLabel.textContent = formatItemLabel(itemName, quantity);

    announce(`${itemName} quantity ${quantity}`);
}

shoppingSection.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) {
        return;
    }

    if (button.dataset.role === 'remove') {
        handleDecrementClick(button);
    } else if (button.closest('.item-controls')) {
        handleIncrementClick(button);
    } else {
        handleFirstAddClick(button);
    }
});

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
