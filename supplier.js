// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    initializeApp();
    setupNavigationActiveState();
});

// Global state
let suppliers = [
    { id: 1, supplierId: 'SUP001', supplierName: 'Golden Harvest Rice Mill', category: 'Rice', contactPerson: 'Juan Dela Cruz', contactNumber: '0917-123-4567', email: 'juan@goldenharvest.ph', address: 'Nueva Ecija', status: 'Active', rating: 5, totalOrders: 45, onTimeDelivery: 95 },
    { id: 2, supplierId: 'SUP002', supplierName: 'AgriGrow Fertilizers Inc.', category: 'Fertilizer', contactPerson: 'Maria Santos', contactNumber: '0918-234-5678', email: 'maria@agrigrow.ph', address: 'Bulacan', status: 'Active', rating: 4, totalOrders: 32, onTimeDelivery: 88 },
    { id: 3, supplierId: 'SUP003', supplierName: 'Premium Feed Solutions', category: 'Feed', contactPerson: 'Pedro Reyes', contactNumber: '0919-345-6789', email: 'pedro@premiumfeed.ph', address: 'Pampanga', status: 'Active', rating: 5, totalOrders: 28, onTimeDelivery: 92 },
    { id: 4, supplierId: 'SUP004', supplierName: 'EcoGreen Organics', category: 'Fertilizer', contactPerson: 'Ana Mercado', contactNumber: '0920-456-7890', email: 'ana@ecogreen.ph', address: 'Tarlac', status: 'Active', rating: 4, totalOrders: 18, onTimeDelivery: 85 },
    { id: 5, supplierId: 'SUP005', supplierName: 'Rice Valley Suppliers', category: 'Rice', contactPerson: 'Carlos Mendoza', contactNumber: '0921-567-8901', email: 'carlos@ricevalley.ph', address: 'Isabela', status: 'Inactive', rating: 3, totalOrders: 12, onTimeDelivery: 75 },
];

let purchaseOrders = [
    { id: 1, orderId: 'PO-2025-001', supplierId: 'SUP001', supplierName: 'Golden Harvest Rice Mill', dateOrdered: '2025-10-10', dateExpected: '2025-10-20', amount: 150000, status: 'Delivered', items: 'Rice 25kg - 100 sacks', deliveredDate: '2025-10-19' },
    { id: 2, orderId: 'PO-2025-002', supplierId: 'SUP002', supplierName: 'AgriGrow Fertilizers Inc.', dateOrdered: '2025-10-12', dateExpected: '2025-10-22', amount: 85000, status: 'Pending', items: 'NPK Fertilizer - 50 bags', deliveredDate: null },
    { id: 3, orderId: 'PO-2025-003', supplierId: 'SUP003', supplierName: 'Premium Feed Solutions', dateOrdered: '2025-10-08', dateExpected: '2025-10-18', amount: 120000, status: 'Overdue', items: 'Chicken Feed - 80 bags', deliveredDate: null },
    { id: 4, orderId: 'PO-2025-004', supplierId: 'SUP001', supplierName: 'Golden Harvest Rice Mill', dateOrdered: '2025-10-14', dateExpected: '2025-10-24', amount: 200000, status: 'Pending', items: 'Brown Rice 10kg - 150 bags', deliveredDate: null },
    { id: 5, orderId: 'PO-2025-005', supplierId: 'SUP004', supplierName: 'EcoGreen Organics', dateOrdered: '2025-10-11', dateExpected: '2025-10-21', amount: 95000, status: 'Delivered', items: 'Organic Fertilizer - 60 bags', deliveredDate: '2025-10-20' },
];

let searchTerm = '';
let categoryFilter = 'all';
let statusFilter = 'all';
let orderStatusFilter = 'all';
let activeTab = 'dashboard';
let modalMode = 'add';
let selectedSupplier = null;

// Initialize the application
function initializeApp() {
    updateTime();
    setInterval(updateTime, 60000);

    updateStats();
    renderDashboard();
    renderSuppliersTable();
    renderOrdersTable();
    attachEventListeners();
}

// Update current time
function updateTime() {
    const now = new Date();
    const formatted = now.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) + ' at ' + now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    document.getElementById('currentTime').textContent = formatted;
}

// Update statistics
function updateStats() {
    const activeSuppliers = suppliers.filter(s => s.status === 'Active').length;
    const pendingOrders = purchaseOrders.filter(o => o.status === 'Pending').length;
    const overdueOrders = purchaseOrders.filter(o => o.status === 'Overdue').length;
    const totalOrderValue = purchaseOrders.reduce((sum, order) => sum + order.amount, 0);

    document.getElementById('totalSuppliers').textContent = suppliers.length;
    document.getElementById('activeSuppliers').textContent = `${activeSuppliers} Active`;
    document.getElementById('totalOrders').textContent = purchaseOrders.length;
    document.getElementById('pendingOrders').textContent = pendingOrders;
    document.getElementById('overdueOrders').textContent = `${overdueOrders} Overdue`;
    document.getElementById('totalValue').textContent = `₱${(totalOrderValue / 1000).toFixed(0)}K`;
}

// Render dashboard alerts and recent orders
function renderDashboard() {
    const alertsList = document.getElementById('alertsList');
    const overdueOrders = purchaseOrders.filter(o => o.status === 'Overdue').length;
    const pendingOrders = purchaseOrders.filter(o => o.status === 'Pending').length;

    alertsList.innerHTML = '';

    if (overdueOrders > 0) {
        alertsList.innerHTML += `
            <div class="alert-item alert-overdue">
                <i data-lucide="alert-circle" class="alert-icon alert-icon-red"></i>
                <div class="alert-content">
                    <p class="alert-title alert-title-red">Overdue Orders</p>
                    <p class="alert-message">${overdueOrders} purchase order(s) are overdue and require attention</p>
                </div>
                <button class="alert-btn alert-btn-red" onclick="switchTab('orders')">View Orders</button>
            </div>
        `;
    }

    if (pendingOrders > 0) {
        alertsList.innerHTML += `
            <div class="alert-item alert-pending">
                <i data-lucide="truck" class="alert-icon alert-icon-yellow"></i>
                <div class="alert-content">
                    <p class="alert-title alert-title-yellow">Pending Deliveries</p>
                    <p class="alert-message">${pendingOrders} order(s) awaiting delivery confirmation</p>
                </div>
                <button class="alert-btn alert-btn-yellow" onclick="switchTab('orders')">Track Orders</button>
            </div>
        `;
    }

    const recentOrdersTable = document.getElementById('recentOrdersTable');
    recentOrdersTable.innerHTML = '';

    purchaseOrders.slice(0, 5).forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="order-id">${order.orderId}</span></td>
            <td>
                <div class="supplier-name">${order.supplierName}</div>
                <div class="contact-person">${order.items}</div>
            </td>
            <td><span class="date-text">${order.dateOrdered}</span></td>
            <td><span class="amount-text">₱${order.amount.toLocaleString()}</span></td>
            <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
        `;
        recentOrdersTable.appendChild(tr);
    });

    lucide.createIcons();
}

// Get status class
function getStatusClass(status) {
    const classes = {
        'Active': 'status-active',
        'Inactive': 'status-inactive',
        'Delivered': 'status-delivered',
        'Pending': 'status-pending',
        'Overdue': 'status-overdue'
    };
    return classes[status] || 'status-inactive';
}

// Render stars
function renderStars(rating) {
    let html = '<div class="rating-stars">';
    for (let i = 0; i < 5; i++) {
        html += `<i data-lucide="star" class="star ${i < rating ? 'star-filled' : 'star-empty'}"></i>`;
    }
    html += '</div>';
    return html;
}

// Filter suppliers
function getFilteredSuppliers() {
    const searchTerm = document.getElementById('supplierSearchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    return suppliers.filter(supplier => {
        const matchesSearch = supplier.supplierName.toLowerCase().includes(searchTerm) ||
                             supplier.supplierId.toLowerCase().includes(searchTerm);
        const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
        return matchesSearch && matchesCategory && matchesStatus;
    });
}

// Filter orders
function getFilteredOrders() {
    const orderSearch = document.getElementById('orderSearchInput').value.toLowerCase();
    const orderStatusFilter = document.getElementById('orderStatusFilter').value;

    return purchaseOrders.filter(order => {
        const matchesSearch = order.orderId.toLowerCase().includes(orderSearch) ||
                             order.supplierName.toLowerCase().includes(orderSearch);
        const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
        return matchesSearch && matchesStatus;
    });
}

// Render suppliers table
function renderSuppliersTable() {
    const tbody = document.getElementById('suppliersTableBody');
    const filtered = getFilteredSuppliers();

    tbody.innerHTML = '';

    filtered.forEach(supplier => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><span class="supplier-id">${supplier.supplierId}</span></td>
            <td>
                <div class="supplier-name">${supplier.supplierName}</div>
                <div class="contact-person">${supplier.contactPerson}</div>
            </td>
            <td><span class="category-badge">${supplier.category}</span></td>
            <td>
                <div class="contact-number">${supplier.contactNumber}</div>
                <div class="contact-email">${supplier.email}</div>
            </td>
            <td>
                ${renderStars(supplier.rating)}
                <div class="on-time-delivery">${supplier.onTimeDelivery}% on-time</div>
            </td>
            <td><span class="status-badge ${getStatusClass(supplier.status)}">${supplier.status}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn action-btn-edit" onclick="openEditModal(${supplier.id})">
                        <i data-lucide="edit-2"></i>
                    </button>
                    <button class="action-btn action-btn-delete" onclick="deleteSupplier(${supplier.id})">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

// Render orders table
function renderOrdersTable() {
    const tbody = document.getElementById('ordersTableBody');
    const filtered = getFilteredOrders();

    tbody.innerHTML = '';

    filtered.forEach(order => {
        const tr = document.createElement('tr');
        if (order.status === 'Overdue') tr.className = 'row-overdue';
        
        tr.innerHTML = `
            <td><span class="order-id">${order.orderId}</span></td>
            <td>
                <div class="supplier-name">${order.supplierName}</div>
                <div class="contact-person">${order.items}</div>
            </td>
            <td><span class="date-text">${order.dateOrdered}</span></td>
            <td><span class="date-text">${order.dateExpected}</span></td>
            <td><span class="amount-text">₱${order.amount.toLocaleString()}</span></td>
            <td><span class="status-badge ${getStatusClass(order.status)}">${order.status}</span></td>
            <td>
                <div class="action-buttons">
                    ${(order.status === 'Pending' || order.status === 'Overdue') ? `
                        <button class="action-btn action-btn-check" onclick="markAsDelivered(${order.id})" title="Mark as Delivered">
                            <i data-lucide="check-circle"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });

    lucide.createIcons();
}

// Switch tabs
function switchTab(tab) {
    activeTab = tab;

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('tab-btn-active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('tab-btn-active');

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('tab-content-active');
    });
    document.getElementById(`${tab}Tab`).classList.add('tab-content-active');
}

// Attach event listeners
function attachEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    document.getElementById('supplierSearchInput').addEventListener('input', renderSuppliersTable);
    document.getElementById('categoryFilter').addEventListener('change', renderSuppliersTable);
    document.getElementById('statusFilter').addEventListener('change', renderSuppliersTable);
    document.getElementById('orderSearchInput').addEventListener('input', renderOrdersTable);
    document.getElementById('orderStatusFilter').addEventListener('change', renderOrdersTable);

    document.getElementById('addSupplierBtn').addEventListener('click', openAddModal);
    document.getElementById('supplierModalClose').addEventListener('click', closeModal);
    document.getElementById('supplierModalCancel').addEventListener('click', closeModal);
    document.getElementById('supplierModalSubmit').addEventListener('click', handleSubmit);

    document.getElementById('supplierModal').addEventListener('click', (e) => {
        if (e.target.id === 'supplierModal') closeModal();
    });
}

// Open add modal
function openAddModal() {
    modalMode = 'add';
    selectedSupplier = null;

    document.getElementById('supplierModalTitle').textContent = 'Add New Supplier';
    document.getElementById('supplierModalSubmit').textContent = 'Add Supplier';

    document.getElementById('formSupplierId').value = `SUP${String(suppliers.length + 1).padStart(3, '0')}`;
    document.getElementById('formSupplierId').disabled = false;
    document.getElementById('formSupplierName').value = '';
    document.getElementById('formCategory').value = 'Rice';
    document.getElementById('formContactPerson').value = '';
    document.getElementById('formContactNumber').value = '';
    document.getElementById('formEmail').value = '';
    document.getElementById('formAddress').value = '';
    document.getElementById('formStatus').value = 'Active';
    document.getElementById('formRating').value = 5;

    document.getElementById('supplierModal').classList.add('active');
    lucide.createIcons();
}

// Open edit modal
function openEditModal(supplierId) {
    modalMode = 'edit';
    selectedSupplier = suppliers.find(s => s.id === supplierId);

    if (!selectedSupplier) return;

    document.getElementById('supplierModalTitle').textContent = 'Edit Supplier';
    document.getElementById('supplierModalSubmit').textContent = 'Save Changes';

    document.getElementById('formSupplierId').value = selectedSupplier.supplierId;
    document.getElementById('formSupplierId').disabled = true;
    document.getElementById('formSupplierName').value = selectedSupplier.supplierName;
    document.getElementById('formCategory').value = selectedSupplier.category;
    document.getElementById('formContactPerson').value = selectedSupplier.contactPerson;
    document.getElementById('formContactNumber').value = selectedSupplier.contactNumber;
    document.getElementById('formEmail').value = selectedSupplier.email;
    document.getElementById('formAddress').value = selectedSupplier.address;
    document.getElementById('formStatus').value = selectedSupplier.status;
    document.getElementById('formRating').value = selectedSupplier.rating;

    document.getElementById('supplierModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('supplierModal').classList.remove('active');
}

// Handle form submit
function handleSubmit() {
    const formData = {
        supplierId: document.getElementById('formSupplierId').value,
        supplierName: document.getElementById('formSupplierName').value,
        category: document.getElementById('formCategory').value,
        contactPerson: document.getElementById('formContactPerson').value,
        contactNumber: document.getElementById('formContactNumber').value,
        email: document.getElementById('formEmail').value,
        address: document.getElementById('formAddress').value,
        status: document.getElementById('formStatus').value,
        rating: parseInt(document.getElementById('formRating').value) || 5
    };

    if (!formData.supplierName || !formData.contactPerson || !formData.contactNumber) {
        alert('Please fill in all required fields.');
        return;
    }

    if (modalMode === 'add') {
        const newSupplier = {
            id: suppliers.length + 1,
            ...formData,
            onTimeDelivery: 100
        };
        suppliers.push(newSupplier);
        alert('Supplier added successfully!');
    } else {
        suppliers = suppliers.map(supplier => 
            supplier.id === selectedSupplier.id 
                ? { ...supplier, ...formData }
                : supplier
        );
        alert('Supplier updated successfully!');
    }

    closeModal();
    updateStats();
    renderSuppliersTable();
    renderDashboard();
}

// Delete supplier
function deleteSupplier(supplierId) {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;

    if (confirm(`Are you sure you want to delete "${supplier.supplierName}"?`)) {
        suppliers = suppliers.filter(s => s.id !== supplierId);
        alert('Supplier deleted successfully!');
        updateStats();
        renderSuppliersTable();
        renderDashboard();
    }
}

// Mark order as delivered
function markAsDelivered(orderId) {
    purchaseOrders = purchaseOrders.map(order => 
        order.id === orderId 
            ? { ...order, status: 'Delivered' }
            : order
    );
    alert('Order marked as delivered!');
    updateStats();
    renderOrdersTable();
    renderDashboard();
}

// Navigation Active State
function setupNavigationActiveState() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'supplier.html';

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.href && item.href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}