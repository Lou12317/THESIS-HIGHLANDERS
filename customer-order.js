// Customer Order Page - Interactive Logic

// Initialize
document.addEventListener('DOMContentLoaded', function () {
    lucide.createIcons();
    initializeCart();
});

// ==========================================
// Cart State Management
// ==========================================
let cart = [];

function initializeCart() {
    // Load cart from localStorage if exists
    const savedCart = localStorage.getItem('wholesaleCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem('wholesaleCart', JSON.stringify(cart));
}

// ==========================================
// Cart Functions
// ==========================================
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Reinitialize icons after DOM update
    lucide.createIcons();
}

function addToCart(button) {
    const productCard = button.closest('.product-card');
    const qtyInput = productCard.querySelector('.qty-input');
    const quantity = parseInt(qtyInput.value);
    
    // Get product details
    const product = {
        id: Date.now(), // Simple ID generation
        name: productCard.querySelector('.product-name').textContent,
        description: productCard.querySelector('.product-description').textContent,
        price: parseFloat(productCard.querySelector('.product-price').textContent.replace('₱', '').replace(',', '')),
        quantity: quantity,
        image: productCard.querySelector('.product-image img').src
    };
    
    // Check if product already exists in cart
    const existingIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingIndex > -1) {
        // Update quantity
        cart[existingIndex].quantity += quantity;
    } else {
        // Add new product
        cart.push(product);
    }
    
    // Visual feedback
    button.textContent = 'Added! ✓';
    button.style.background = 'linear-gradient(to right, #059669, #047857)';
    
    setTimeout(() => {
        button.innerHTML = '<i data-lucide="shopping-cart"></i> Add to Cart';
        button.style.background = '';
        lucide.createIcons();
    }, 1500);
    
    // Reset quantity to 1
    qtyInput.value = 1;
    
    // Update cart
    updateCartUI();
    saveCart();
}

function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const cartDiscount = document.getElementById('cartDiscount');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    
    // Update cart items display
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i data-lucide="shopping-bag" class="empty-icon"></i>
                <p class="empty-text">Your cart is empty</p>
                <p class="empty-subtext">Add items to get started</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">₱${item.price.toLocaleString()}</p>
                    <div class="cart-item-actions">
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                            <span style="font-weight: 700; font-size: 14px;">${item.quantity}</span>
                            <button class="qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="btn-remove" onclick="removeFromCart(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Calculate bulk discount (example: 5% for orders over 50 items)
    let discount = 0;
    if (totalItems >= 100) {
        discount = subtotal * 0.15; // 15% discount
    } else if (totalItems >= 50) {
        discount = subtotal * 0.10; // 10% discount
    } else if (totalItems >= 20) {
        discount = subtotal * 0.05; // 5% discount
    }
    
    const total = subtotal - discount;
    
    // Update UI
    cartSubtotal.textContent = '₱' + subtotal.toLocaleString();
    cartDiscount.textContent = discount > 0 ? '-₱' + discount.toLocaleString() : '₱0';
    cartTotal.textContent = '₱' + total.toLocaleString();
    
    // Reinitialize icons
    lucide.createIcons();
}

function updateCartQuantity(id, change) {
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        
        // Remove if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        updateCartUI();
        saveCart();
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartUI();
    saveCart();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before checking out.');
        return;
    }
    
    // Calculate final total
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let discount = 0;
    if (totalItems >= 100) {
        discount = subtotal * 0.15;
    } else if (totalItems >= 50) {
        discount = subtotal * 0.10;
    } else if (totalItems >= 20) {
        discount = subtotal * 0.05;
    }
    
    const total = subtotal - discount;
    
    // Create order summary
    const orderSummary = `
Order Summary
═══════════════════════════════════
Total Items: ${totalItems}
Subtotal: ₱${subtotal.toLocaleString()}
Discount: -₱${discount.toLocaleString()}
─────────────────────────────────
TOTAL: ₱${total.toLocaleString()}
═══════════════════════════════════

Items:
${cart.map(item => `• ${item.name} (${item.quantity}x) - ₱${(item.price * item.quantity).toLocaleString()}`).join('\n')}
    `;
    
    alert('🎉 Order Confirmed!\n\n' + orderSummary + '\n\nYour order has been placed successfully. Our team will contact you shortly for delivery arrangements.');
    
    // Clear cart
    cart = [];
    updateCartUI();
    saveCart();
    toggleCart();
}

// ==========================================
// Product Quantity Controls
// ==========================================
function incrementQty(button) {
    const input = button.previousElementSibling;
    input.value = parseInt(input.value) + 1;
}

function decrementQty(button) {
    const input = button.nextElementSibling;
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}

// ==========================================
// Filter & Search Functions
// ==========================================
function filterProducts() {
    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const products = document.querySelectorAll('.product-card');
    
    // Get checked categories
    const checkedCategories = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.parentElement.textContent.toLowerCase().split(' ')[0]);
    
    products.forEach(product => {
        const category = product.dataset.category;
        
        if (checkedCategories.length === 0 || checkedCategories.includes(category)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function searchProducts() {
    const searchInput = document.querySelector('.search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        const name = product.querySelector('.product-name').textContent.toLowerCase();
        const description = product.querySelector('.product-description').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || description.includes(searchTerm)) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

function sortProducts() {
    const select = document.querySelector('.sort-select');
    const sortValue = select.value;
    const productsGrid = document.getElementById('productsGrid');
    const products = Array.from(document.querySelectorAll('.product-card'));
    
    products.sort((a, b) => {
        switch(sortValue) {
            case 'price-low':
                return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
            case 'price-high':
                return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
            case 'name':
                const nameA = a.querySelector('.product-name').textContent;
                const nameB = b.querySelector('.product-name').textContent;
                return nameA.localeCompare(nameB);
            case 'popular':
            default:
                return 0; // Keep original order
        }
    });
    
    // Clear and re-append sorted products
    productsGrid.innerHTML = '';
    products.forEach(product => productsGrid.appendChild(product));
}

// ==========================================
// View Toggle
// ==========================================
function setView(viewType) {
    const buttons = document.querySelectorAll('.view-btn');
    const productsGrid = document.getElementById('productsGrid');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.closest('.view-btn').classList.add('active');
    
    if (viewType === 'list') {
        productsGrid.style.gridTemplateColumns = '1fr';
    } else {
        productsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    }
    
    lucide.createIcons();
}

// ==========================================
// Close cart on escape key
// ==========================================
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('overlay');
        
        if (cartSidebar.classList.contains('active')) {
            toggleCart();
        }
    }
});