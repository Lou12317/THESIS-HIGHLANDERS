// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeApp();
    setupNavigationActiveState();
});

// Global state
let inventory = [
    { id: 1, productId: 'P001', productName: 'Rice Sack 25kg', category: 'Food Products', quantity: 120, unit: 'sacks', price: 2000, reorderLevel: 50, lastUpdated: '2025-10-15' },
    { id: 2, productId: 'P002', productName: 'Brown Rice 10kg', category: 'Food Products', quantity: 15, unit: 'bags', price: 1000, reorderLevel: 30, lastUpdated: '2025-10-15' },
    { id: 3, productId: 'P003', productName: 'Disposable Paper Plates', category: 'Paperware', quantity: 200, unit: 'pieces', price: 5, reorderLevel: 50, lastUpdated: '2025-10-14' },
    { id: 4, productId: 'P004', productName: 'Disposable Paper Cups', category: 'Paperware', quantity: 180, unit: 'pieces', price: 4, reorderLevel: 50, lastUpdated: '2025-10-15' },
    { id: 5, productId: 'P005', productName: 'Wooden Spoon Set', category: 'Woodenware', quantity: 80, unit: 'pieces', price: 25, reorderLevel: 30, lastUpdated: '2025-10-13' },
    { id: 6, productId: 'P006', productName: 'Plastic Food Container', category: 'Plasticware', quantity: 60, unit: 'pieces', price: 120, reorderLevel: 20, lastUpdated: '2025-10-15' },
    { id: 7, productId: 'P007', productName: 'Eco Shopping Bag', category: 'Reusable Items', quantity: 90, unit: 'pieces', price: 50, reorderLevel: 40, lastUpdated: '2025-10-14' },
    { id: 8, productId: 'P008', productName: 'Dishwashing Liquid 500ml', category: 'Household & Cleaning Products', quantity: 70, unit: 'bottles', price: 85, reorderLevel: 35, lastUpdated: '2025-10-15' },
];

let searchTerm = '';
let categoryFilter = 'all';
let stockFilter = 'all';
let modalMode = 'add';
let selectedItem = null;

// Initialize the application
function initializeApp() {
    updateTime();
    setInterval(updateTime, 60000);

    updateStats();
    renderTable();
    attachEventListeners();
}

// Update current time
function updateTime() {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    document.getElementById('currentTime').textContent = formatted;
}

// Get stock status
function getStockStatus(item) {
    if (item.quantity === 0) return 'out';
    if (item.quantity <= item.reorderLevel * 0.3) return 'critical';
    if (item.quantity <= item.reorderLevel) return 'low';
    return 'good';
}

// Get stock status class
function getStockStatusClass(status) {
    const classes = {
        out: 'status-out',
        critical: 'status-critical',
        low: 'status-low',
        good: 'status-good'
    };
    return classes[status] || 'status-good';
}

// Get stock status text
function getStockStatusText(status) {
    const texts = {
        out: 'Out of Stock',
        critical: 'Critical',
        low: 'Low Stock',
        good: 'In Stock'
    };
    return texts[status] || 'In Stock';
}

// Filter inventory
function getFilteredInventory() {
    return inventory.filter(item => {
        const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.productId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
        const status = getStockStatus(item);
        const matchesStock = stockFilter === 'all' ||
            (stockFilter === 'low' && (status === 'low' || status === 'critical' || status === 'out'));

        return matchesSearch && matchesCategory && matchesStock;
    });
}

// Update statistics
function updateStats() {
    const lowStockCount = inventory.filter(item => {
        const status = getStockStatus(item);
        return status === 'low' || status === 'critical' || status === 'out';
    }).length;

    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);

    document.getElementById('totalProducts').textContent = inventory.length;
    document.getElementById('totalUnits').textContent = `${totalItems} total units`;
    document.getElementById('lowStockCount').textContent = lowStockCount;
    document.getElementById('totalValue').textContent = `₱${(totalValue / 1000000).toFixed(2)}M`;
}

// Render table
function renderTable() {
    const tbody = document.getElementById('inventoryTableBody');
    const emptyState = document.getElementById('emptyState');
    const filtered = getFilteredInventory();

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        emptyState.style.display = 'block';
        tbody.closest('.table-wrapper').style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        tbody.closest('.table-wrapper').style.display = 'block';

        filtered.forEach(item => {
            const status = getStockStatus(item);
            const tr = document.createElement('tr');

            let rowClass = '';
            if (status === 'critical' || status === 'out') rowClass = 'row-critical';
            else if (status === 'low') rowClass = 'row-low';

            if (rowClass) tr.className = rowClass;

            tr.innerHTML = `
                <td><span class="product-id">${item.productId}</span></td>
                <td>
                    <div class="product-name">${item.productName}</div>
                    <div class="product-updated">Updated: ${item.lastUpdated}</div>
                </td>
                <td><span class="category-badge">${item.category}</span></td>
                <td>
                    <div class="quantity-main">${item.quantity}</div>
                    <div class="quantity-min">Min: ${item.reorderLevel}</div>
                </td>
                <td><span class="unit-text">${item.unit}</span></td>
                <td><span class="price-text">₱${item.price.toLocaleString()}</span></td>
                <td><span class="status-badge ${getStockStatusClass(status)}">${getStockStatusText(status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn action-btn-edit" onclick="openEditModal(${item.id})">
                            <i data-lucide="edit-2"></i>
                        </button>
                        <button class="action-btn action-btn-delete" onclick="deleteItem(${item.id})">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Reinitialize Lucide icons for the new content
        lucide.createIcons();
    }

    // Update footer counts
    document.getElementById('showingCount').textContent = filtered.length;
    document.getElementById('totalCount').textContent = inventory.length;
}

// Attach event listeners
function attachEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value;
        renderTable();
    });

    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        categoryFilter = e.target.value;
        renderTable();
    });

    // Stock filter
    document.getElementById('stockFilter').addEventListener('change', (e) => {
        stockFilter = e.target.value;
        renderTable();
    });

    // Add new button
    document.getElementById('addNewBtn').addEventListener('click', openAddModal);

    // Modal close button
    document.getElementById('modalClose').addEventListener('click', closeModal);

    // Modal cancel button
    document.getElementById('modalCancel').addEventListener('click', closeModal);

    // Modal submit button
    document.getElementById('modalSubmit').addEventListener('click', handleSubmit);

    // Close modal when clicking outside
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') {
            closeModal();
        }
    });
}

// Open add modal
function openAddModal() {
    modalMode = 'add';
    selectedItem = null;

    document.getElementById('modalTitle').textContent = 'Add New Item';
    document.getElementById('modalSubmit').textContent = 'Add Item';

    // Reset form
    document.getElementById('formProductId').value = `P${String(inventory.length + 1).padStart(3, '0')}`;
    document.getElementById('formProductId').disabled = false;
    document.getElementById('formProductName').value = '';
    document.getElementById('formCategory').value = 'Rice';
    document.getElementById('formUnit').value = 'sacks';
    document.getElementById('formQuantity').value = 0;
    document.getElementById('formPrice').value = 0;
    document.getElementById('formReorderLevel').value = 20;

    document.getElementById('modal').classList.add('active');
}

// Open edit modal
function openEditModal(itemId) {
    modalMode = 'edit';
    selectedItem = inventory.find(item => item.id === itemId);

    if (!selectedItem) return;

    document.getElementById('modalTitle').textContent = 'Edit Item';
    document.getElementById('modalSubmit').textContent = 'Save Changes';

    // Fill form with item data
    document.getElementById('formProductId').value = selectedItem.productId;
    document.getElementById('formProductId').disabled = true;
    document.getElementById('formProductName').value = selectedItem.productName;
    document.getElementById('formCategory').value = selectedItem.category;
    document.getElementById('formUnit').value = selectedItem.unit;
    document.getElementById('formQuantity').value = selectedItem.quantity;
    document.getElementById('formPrice').value = selectedItem.price;
    document.getElementById('formReorderLevel').value = selectedItem.reorderLevel;

    document.getElementById('modal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Handle form submit
function handleSubmit() {
    const formData = {
        productId: document.getElementById('formProductId').value,
        productName: document.getElementById('formProductName').value,
        category: document.getElementById('formCategory').value,
        unit: document.getElementById('formUnit').value,
        quantity: parseInt(document.getElementById('formQuantity').value) || 0,
        price: parseFloat(document.getElementById('formPrice').value) || 0,
        reorderLevel: parseInt(document.getElementById('formReorderLevel').value) || 0
    };

    // Validation
    if (!formData.productName || formData.quantity < 0 || formData.price < 0) {
        alert('⚠️ Please fill in all required fields correctly.');
        return;
    }

    if (modalMode === 'add') {
        const newItem = {
            id: inventory.length + 1,
            ...formData,
            lastUpdated: new Date().toISOString().split('T')[0]
        };
        inventory.push(newItem);
        alert('✅ Item added successfully!');
    } else {
        inventory = inventory.map(item =>
            item.id === selectedItem.id
                ? { ...item, ...formData, lastUpdated: new Date().toISOString().split('T')[0] }
                : item
        );
        alert('✅ Item updated successfully!');
    }

    closeModal();
    updateStats();
    renderTable();
}

// Delete item
function deleteItem(itemId) {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    if (confirm(`Are you sure you want to delete "${item.productName}"?`)) {
        inventory = inventory.filter(i => i.id !== itemId);
        alert('✅ Item deleted successfully!');
        updateStats();
        renderTable();
    }
}

// Navigation Active State
function setupNavigationActiveState() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'invetory.html';

    navItems.forEach(item => {
        // Remove active class from all items
        item.classList.remove('active');
        
        // Add active class to the current page
        if (item.href && item.href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}