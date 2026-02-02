// Account Management System

// Sample data structure
let accounts = [
    {
        id: 'EMP001',
        firstName: 'Juan',
        lastName: 'Dela Cruz',
        email: 'juan.delacruz@highlander.com',
        phone: '+63 917 123 4567',
        role: 'manager',
        department: 'sales',
        username: 'jdelacruz',
        address: '123 Main St, Makati City',
        isActive: true,
        created: '2024-01-15'
    },
    {
        id: 'EMP002',
        firstName: 'Maria',
        lastName: 'Santos',
        email: 'maria.santos@highlander.com',
        phone: '+63 917 234 5678',
        role: 'employee',
        department: 'inventory',
        username: 'msantos',
        address: '456 Oak Ave, Quezon City',
        isActive: true,
        created: '2024-02-20'
    },
    {
        id: 'EMP003',
        firstName: 'Pedro',
        lastName: 'Reyes',
        email: 'pedro.reyes@highlander.com',
        phone: '+63 917 345 6789',
        role: 'manager',
        department: 'procurement',
        username: 'preyes',
        address: '789 Pine Rd, Pasig City',
        isActive: true,
        created: '2024-01-10'
    },
    {
        id: 'EMP004',
        firstName: 'Ana',
        lastName: 'Garcia',
        email: 'ana.garcia@highlander.com',
        phone: '+63 917 456 7890',
        role: 'employee',
        department: 'finance',
        username: 'agarcia',
        address: '321 Elm St, Taguig City',
        isActive: true,
        created: '2024-03-05'
    },
    {
        id: 'EMP005',
        firstName: 'Carlos',
        lastName: 'Mendoza',
        email: 'carlos.mendoza@highlander.com',
        phone: '+63 917 567 8901',
        role: 'employee',
        department: 'logistics',
        username: 'cmendoza',
        address: '654 Birch Ln, Mandaluyong',
        isActive: false,
        created: '2023-12-01'
    }
];

// State management
let currentFilter = 'all';
let currentPage = 1;
let itemsPerPage = 10;
let editingAccountId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize time
    updateTime();
    setInterval(updateTime, 60000);

    // Update statistics
    updateStatistics();

    // Render accounts table
    renderAccountsTable();

    // Setup event listeners
    setupEventListeners();
});

// ==========================================
// 1. Time Display
// ==========================================
function updateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentTime').textContent = now.toLocaleDateString('en-US', options);
}

// ==========================================
// 2. Statistics Updates
// ==========================================
function updateStatistics() {
    const total = accounts.length;
    const managers = accounts.filter(acc => acc.role === 'manager').length;
    const employees = accounts.filter(acc => acc.role === 'employee').length;
    const inactive = accounts.filter(acc => !acc.isActive).length;

    document.getElementById('totalAccounts').textContent = total;
    document.getElementById('totalManagers').textContent = managers;
    document.getElementById('totalEmployees').textContent = employees;
    document.getElementById('totalInactive').textContent = inactive;
}

// ==========================================
// 3. Event Listeners Setup
// ==========================================
function setupEventListeners() {
    // Search input
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });

    // Create account button
    document.getElementById('btnCreateAccount').addEventListener('click', openCreateModal);

    // Modal close buttons
    document.getElementById('closeModal').addEventListener('click', closeAccountModal);
    document.getElementById('btnCancel').addEventListener('click', closeAccountModal);

    // Form submission
    document.getElementById('accountForm').addEventListener('submit', handleFormSubmit);

    // Delete modal buttons
    document.getElementById('btnCancelDelete').addEventListener('click', closeDeleteModal);
    document.getElementById('btnConfirmDelete').addEventListener('click', confirmDelete);

    // Pagination buttons
    document.getElementById('prevPage').addEventListener('click', () => changePage(-1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(1));

    // Close modal on outside click
    document.getElementById('accountModal').addEventListener('click', (e) => {
        if (e.target.id === 'accountModal') {
            closeAccountModal();
        }
    });

    document.getElementById('deleteModal').addEventListener('click', (e) => {
        if (e.target.id === 'deleteModal') {
            closeDeleteModal();
        }
    });
}

// ==========================================
// 4. Search Functionality
// ==========================================
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = accounts.filter(acc => {
        const fullName = `${acc.firstName} ${acc.lastName}`.toLowerCase();
        const email = acc.email.toLowerCase();
        const id = acc.id.toLowerCase();
        
        return fullName.includes(searchTerm) || 
               email.includes(searchTerm) || 
               id.includes(searchTerm);
    });

    renderAccountsTable(filtered);
}

// ==========================================
// 5. Filter Functionality
// ==========================================
function handleFilterChange(e) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Update current filter
    currentFilter = e.target.dataset.filter;
    currentPage = 1;

    // Render with filter
    renderAccountsTable();
}

// ==========================================
// 6. Render Accounts Table
// ==========================================
function renderAccountsTable(customAccounts = null) {
    const tableBody = document.getElementById('accountsTableBody');
    
    // Use custom accounts or apply filter
    let filteredAccounts = customAccounts || getFilteredAccounts();

    // Calculate pagination
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedAccounts = filteredAccounts.slice(startIndex, endIndex);

    // Clear table
    tableBody.innerHTML = '';

    // Populate table
    paginatedAccounts.forEach(account => {
        const row = createAccountRow(account);
        tableBody.appendChild(row);
    });

    // Update pagination info
    updatePaginationInfo(filteredAccounts.length, totalPages);

    // Reinitialize icons for new elements
    lucide.createIcons();
}

// Get filtered accounts based on current filter
function getFilteredAccounts() {
    if (currentFilter === 'all') {
        return accounts;
    } else if (currentFilter === 'manager') {
        return accounts.filter(acc => acc.role === 'manager');
    } else if (currentFilter === 'employee') {
        return accounts.filter(acc => acc.role === 'employee');
    } else if (currentFilter === 'inactive') {
        return accounts.filter(acc => !acc.isActive);
    }
    return accounts;
}

// Create table row for an account
function createAccountRow(account) {
    const tr = document.createElement('tr');
    
    tr.innerHTML = `
        <td><span class="account-id">${account.id}</span></td>
        <td><span class="account-name">${account.firstName} ${account.lastName}</span></td>
        <td><span class="account-email">${account.email}</span></td>
        <td>
            <span class="role-badge role-${account.role}">
                ${account.role}
            </span>
        </td>
        <td>${capitalizeFirst(account.department)}</td>
        <td>
            <span class="status-badge status-${account.isActive ? 'active' : 'inactive'}">
                <span class="status-dot"></span>
                ${account.isActive ? 'Active' : 'Inactive'}
            </span>
        </td>
        <td><span class="account-date">${formatDate(account.created)}</span></td>
        <td>
            <div class="action-buttons">
                <button class="action-btn action-btn-edit" onclick="editAccount('${account.id}')">
                    <i data-lucide="edit-2" class="action-icon"></i>
                    Edit
                </button>
                <button class="action-btn action-btn-delete" onclick="deleteAccount('${account.id}')">
                    <i data-lucide="trash-2" class="action-icon"></i>
                    Delete
                </button>
            </div>
        </td>
    `;
    
    return tr;
}

// Update pagination information
function updatePaginationInfo(totalItems, totalPages) {
    const showingCount = Math.min(currentPage * itemsPerPage, totalItems);
    
    document.getElementById('showingCount').textContent = showingCount;
    document.getElementById('totalCount').textContent = totalItems;
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;

    // Update pagination buttons
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage >= totalPages;
}

// ==========================================
// 7. Pagination
// ==========================================
function changePage(direction) {
    const filteredAccounts = getFilteredAccounts();
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    
    currentPage += direction;
    
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    renderAccountsTable();
}

// ==========================================
// 8. Modal Management
// ==========================================
function openCreateModal() {
    editingAccountId = null;
    document.getElementById('modalTitle').textContent = 'Create New Account';
    document.getElementById('btnSubmit').textContent = 'Create Account';
    document.getElementById('accountForm').reset();
    document.getElementById('isActive').checked = true;
    
    showModal('accountModal');
}

function openEditModal(account) {
    editingAccountId = account.id;
    document.getElementById('modalTitle').textContent = 'Edit Account';
    document.getElementById('btnSubmit').textContent = 'Update Account';
    
    // Populate form with account data
    document.getElementById('firstName').value = account.firstName;
    document.getElementById('lastName').value = account.lastName;
    document.getElementById('email').value = account.email;
    document.getElementById('phone').value = account.phone || '';
    document.getElementById('role').value = account.role;
    document.getElementById('department').value = account.department;
    document.getElementById('username').value = account.username;
    document.getElementById('password').value = '********'; // Placeholder
    document.getElementById('password').required = false;
    document.getElementById('address').value = account.address || '';
    document.getElementById('isActive').checked = account.isActive;
    
    showModal('accountModal');
}

function closeAccountModal() {
    hideModal('accountModal');
    document.getElementById('accountForm').reset();
    document.getElementById('password').required = true;
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
    lucide.createIcons();
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// ==========================================
// 9. Form Submission
// ==========================================
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        role: document.getElementById('role').value,
        department: document.getElementById('department').value,
        username: document.getElementById('username').value,
        address: document.getElementById('address').value,
        isActive: document.getElementById('isActive').checked
    };
    
    if (editingAccountId) {
        // Update existing account
        updateAccount(editingAccountId, formData);
    } else {
        // Create new account
        createAccount(formData);
    }
    
    closeAccountModal();
}

// Create new account
function createAccount(data) {
    const newAccount = {
        id: generateAccountId(),
        ...data,
        created: new Date().toISOString().split('T')[0]
    };
    
    accounts.unshift(newAccount);
    updateStatistics();
    renderAccountsTable();
    
    showNotification('Account created successfully!', 'success');
}

// Update existing account
function updateAccount(id, data) {
    const index = accounts.findIndex(acc => acc.id === id);
    
    if (index !== -1) {
        accounts[index] = {
            ...accounts[index],
            ...data
        };
        
        updateStatistics();
        renderAccountsTable();
        
        showNotification('Account updated successfully!', 'success');
    }
}

// ==========================================
// 10. Edit Account
// ==========================================
function editAccount(id) {
    const account = accounts.find(acc => acc.id === id);
    
    if (account) {
        openEditModal(account);
    }
}

// ==========================================
// 11. Delete Account
// ==========================================
function deleteAccount(id) {
    const account = accounts.find(acc => acc.id === id);
    
    if (account) {
        document.getElementById('deleteAccountName').textContent = 
            `Account: ${account.firstName} ${account.lastName} (${account.id})`;
        
        // Store the ID to delete
        document.getElementById('btnConfirmDelete').dataset.accountId = id;
        
        showModal('deleteModal');
    }
}

function closeDeleteModal() {
    hideModal('deleteModal');
}

function confirmDelete() {
    const id = document.getElementById('btnConfirmDelete').dataset.accountId;
    
    const index = accounts.findIndex(acc => acc.id === id);
    
    if (index !== -1) {
        accounts.splice(index, 1);
        updateStatistics();
        renderAccountsTable();
        
        showNotification('Account deleted successfully!', 'success');
    }
    
    closeDeleteModal();
}

// ==========================================
// 12. Utility Functions
// ==========================================
function generateAccountId() {
    const maxId = accounts.reduce((max, acc) => {
        const num = parseInt(acc.id.replace('EMP', ''));
        return num > max ? num : max;
    }, 0);
    
    return `EMP${String(maxId + 1).padStart(3, '0')}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function showNotification(message, type = 'success') {
    // Simple alert for now - can be enhanced with custom notification component
    alert(`✅ ${message}`);
}

// Make functions available globally for onclick handlers
window.editAccount = editAccount;
window.deleteAccount = deleteAccount;