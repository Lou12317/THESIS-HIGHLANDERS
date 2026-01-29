// Sales Module JavaScript
// Highlander Grains & Trading Co.

// =======================
// Products Data
// =======================
const products = [
    { id: 1, name: 'Rice Sack 25kg', category: 'Food Products', price: 2000, stock: 120, wholesaleMin: 10, wholesaleDiscount: 10, note: 'Wholesale discount applies for 10+ sacks' },
    { id: 2, name: 'Brown Rice 10kg', category: 'Food Products', price: 1000, stock: 45, wholesaleMin: 15, wholesaleDiscount: 8, note: 'Premium quality brown rice' },
    { id: 3, name: 'Corn Feed 50kg', category: 'Food Products', price: 800, stock: 80, wholesaleMin: 20, wholesaleDiscount: 12, note: 'High protein corn feed' },
    { id: 4, name: 'Chicken Feed 25kg', category: 'Food Products', price: 650, stock: 95, wholesaleMin: 15, wholesaleDiscount: 10, note: 'Complete nutrition for poultry' },
    { id: 5, name: 'Paper Plates Set', category: 'Paperware', price: 1200, stock: 60, wholesaleMin: 10, wholesaleDiscount: 15, note: 'Eco-friendly paper plates' },
    { id: 6, name: 'Paper Cups 100pcs', category: 'Paperware', price: 1500, stock: 40, wholesaleMin: 8, wholesaleDiscount: 12, note: 'High quality paper cups' },
    { id: 7, name: 'Jasmine Rice 5kg', category: 'Food Products', price: 500, stock: 150, wholesaleMin: 20, wholesaleDiscount: 5, note: 'Fragrant jasmine variety' },
    { id: 8, name: 'Wooden Spoons Pack', category: 'Woodenware', price: 900, stock: 70, wholesaleMin: 12, wholesaleDiscount: 10, note: 'Natural wooden utensils' },
    { id: 9, name: 'Plastic Containers 50L', category: 'Plasticware', price: 750, stock: 85, wholesaleMin: 15, wholesaleDiscount: 10, note: 'Durable plastic containers' },
    { id: 10, name: 'Glass Water Bottles', category: 'Reusable Items', price: 450, stock: 110, wholesaleMin: 12, wholesaleDiscount: 8, note: 'Eco-friendly reusable bottles' },
    { id: 11, name: 'Disinfectant Spray 500ml', category: 'Household & Cleaning Products', price: 300, stock: 200, wholesaleMin: 20, wholesaleDiscount: 12, note: 'Multi-purpose disinfectant' },
    { id: 12, name: 'All-Purpose Cleaner 1L', category: 'Household & Cleaning Products', price: 250, stock: 180, wholesaleMin: 15, wholesaleDiscount: 10, note: 'Safe for all surfaces' }
];

// =======================
// Cart State
// =======================
let cart = [];
let paymentMethod = 'cash';
let deliveryScheduled = false;
let deliveryFee = 500;

// =======================
// Update Time
// =======================
function updateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentTime').textContent =
        now.toLocaleDateString('en-US', options);
}

// =======================
// Render Products
// =======================
function renderProducts(filteredProducts = products) {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="product-name">${product.name}</div>
                <div class="product-note">${product.note}</div>
            </td>
            <td><span class="category-badge">${product.category}</span></td>
            <td><span class="product-price">₱${product.price.toLocaleString()}</span></td>
            <td>
                <span class="product-stock ${product.stock < 50 ? 'stock-low' : 'stock-ok'}">
                    ${product.stock}
                </span>
            </td>
            <td>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">➕ Add</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// =======================
// Filter Products
// =======================
function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || product.category === category;
        return matchesSearch && matchesCategory;
    });

    renderProducts(filtered);
}

// =======================
// Cart Functions
// =======================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    updateSummary();
}

function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }

    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        renderCart();
        updateSummary();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    renderCart();
    updateSummary();
}

function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        renderCart();
        updateSummary();
    }
}

// =======================
// Render Cart
// =======================
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    const clearBtn = document.getElementById('clearCartBtn');
    const summaryCard = document.getElementById('summaryCard');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="cart-empty">Cart is empty. Add products to start.</div>';
        clearBtn.style.display = 'none';
        summaryCard.style.display = 'none';
        return;
    }

    clearBtn.style.display = 'block';
    summaryCard.style.display = 'block';
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = calculateItemTotal(item);
        const hasDiscount = item.quantity >= item.wholesaleMin;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-header">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₱${item.price.toLocaleString()} each</div>
                </div>
                <button class="btn-remove-item" onclick="removeFromCart(${item.id})">✕</button>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <span>₱${itemTotal.toLocaleString()}</span>
            </div>
            ${hasDiscount ? `<div class="discount-notice">✓ Bulk discount applied (${item.wholesaleDiscount}% off)</div>` : ''}
        `;
        cartContainer.appendChild(div);
    });
}

// =======================
// Calculations
// =======================
function calculateItemTotal(item) {
    const subtotal = item.price * item.quantity;
    const discount = item.quantity >= item.wholesaleMin
        ? subtotal * item.wholesaleDiscount / 100
        : 0;
    return subtotal - discount;
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateTotalDiscount() {
    return cart.reduce((sum, item) => {
        const subtotal = item.price * item.quantity;
        const discount = item.quantity >= item.wholesaleMin
            ? subtotal * item.wholesaleDiscount / 100
            : 0;
        return sum + discount;
    }, 0);
}

function calculateGrandTotal() {
    return calculateSubtotal() - calculateTotalDiscount() +
        (deliveryScheduled ? deliveryFee : 0);
}

// =======================
// Summary
// =======================
function updateSummary() {
    document.getElementById('subtotalAmount').textContent = `₱${calculateSubtotal().toLocaleString()}`;
    document.getElementById('discountAmount').textContent = `-₱${calculateTotalDiscount().toLocaleString()}`;
    document.getElementById('grandTotal').textContent = `₱${calculateGrandTotal().toLocaleString()}`;

    document.getElementById('deliveryFeeRow').style.display =
        deliveryScheduled ? 'flex' : 'none';

    document.getElementById('deliveryFeeAmount').textContent =
        `₱${deliveryFee.toLocaleString()}`;
}

// =======================
// Sale & Delivery
// =======================
function submitSale() {
    if (!cart.length) {
        alert('⚠️ Cart is empty.');
        return;
    }

    alert(`✅ Sale completed!\nTotal: ₱${calculateGrandTotal().toLocaleString()}\nPayment: ${paymentMethod.toUpperCase()}`);
    cart = [];
    deliveryScheduled = false;
    renderCart();
    updateSummary();
}

function showDeliveryModal() {
    document.getElementById('deliveryModal').classList.add('show');
}

function hideDeliveryModal() {
    document.getElementById('deliveryModal').classList.remove('show');
}

function confirmDelivery() {
    deliveryScheduled = true;
    alert('✅ Delivery scheduled!');
    hideDeliveryModal();
    updateSummary();
}

// =======================
// Event Listeners
// =======================
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updateTime();
    setInterval(updateTime, 60000);
    renderProducts();

    document.getElementById('searchInput').addEventListener('input', filterProducts);
    document.getElementById('categoryFilter').addEventListener('change', filterProducts);
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('submitSaleBtn').addEventListener('click', submitSale);
    document.getElementById('scheduleDeliveryBtn').addEventListener('click', showDeliveryModal);
    document.getElementById('closeModalBtn').addEventListener('click', hideDeliveryModal);
    document.getElementById('cancelDeliveryBtn').addEventListener('click', hideDeliveryModal);
    document.getElementById('confirmDeliveryBtn').addEventListener('click', confirmDelivery);

    setupNavigationActiveState();
});

// =======================
// Console Branding
// =======================
console.log('%c Highlander Grains & Trading Co. ', 'background:#1e3a8a;color:white;font-size:16px;padding:10px;');
console.log('%c Sales Module Loaded ', 'background:#10b981;color:white;padding:5px;');

// =======================
// Navigation Active State
// =======================
function setupNavigationActiveState() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'sales.html';

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.href && item.href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}
