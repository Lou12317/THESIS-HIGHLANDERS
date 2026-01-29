// ===================================
// System Logs & Offline Sync Module
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // State Management
    let currentPage = 1;
    const logsPerPage = 15;
    let allLogs = [];
    let filteredLogs = [];
    let isOnline = navigator.onLine;
    let pendingSyncCount = 0;

    // DOM Elements
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const syncButton = document.getElementById('syncButton');
    const searchInput = document.getElementById('searchInput');
    const activityFilter = document.getElementById('activityFilter');
    const branchFilter = document.getElementById('branchFilter');
    const dateFilter = document.getElementById('dateFilter');
    const exportButton = document.getElementById('exportButton');
    const refreshButton = document.getElementById('refreshButton');
    const logsTableBody = document.getElementById('logsTableBody');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');

    // Stats Elements
    const totalActivitiesEl = document.getElementById('totalActivities');
    const pendingSyncEl = document.getElementById('pendingSync');
    const activeUsersEl = document.getElementById('activeUsers');
    const lastSyncEl = document.getElementById('lastSync');

    // ===================================
    // Update Current Time
    // ===================================
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

    // Initialize time and update every minute
    updateTime();
    setInterval(updateTime, 60000);

    // ===================================
    // Sample Data Generator
    // ===================================
    function generateSampleLogs() {
        const users = [
            { name: 'Juan Dela Cruz', initial: 'JD' },
            { name: 'Maria Santos', initial: 'MS' },
            { name: 'Pedro Reyes', initial: 'PR' },
            { name: 'Ana Garcia', initial: 'AG' },
            { name: 'Carlos Mendoza', initial: 'CM' },
            { name: 'Rosa Fernandez', initial: 'RF' }
        ];

        const activities = ['login', 'sales', 'inventory', 'purchase', 'report'];
        const branches = ['Main Office', 'Branch 1 - North', 'Branch 2 - South', 'Branch 3 - East', 'Branch 4 - West'];
        const details = {
            login: ['User logged in successfully', 'Session started', 'Authentication successful'],
            sales: ['New sale transaction #', 'Sale invoice generated #', 'Payment received for order #'],
            inventory: ['Stock updated for item #', 'Inventory adjustment made', 'Low stock alert triggered'],
            purchase: ['Purchase order created #', 'Supplier payment processed', 'Goods received #'],
            report: ['Monthly report generated', 'Sales report exported', 'Inventory report created']
        };

        const logs = [];
        const now = new Date();

        for (let i = 0; i < 150; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const activity = activities[Math.floor(Math.random() * activities.length)];
            const branch = branches[Math.floor(Math.random() * branches.length)];
            const detail = details[activity][Math.floor(Math.random() * details[activity].length)];
            
            // Random timestamp within last 30 days
            const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            
            // Random sync status (most should be synced)
            const syncChance = Math.random();
            let status = 'synced';
            if (syncChance > 0.95) status = 'pending';
            else if (syncChance > 0.90) status = 'syncing';

            logs.push({
                id: 1000 + i,
                timestamp: timestamp,
                user: user,
                action: activity,
                branch: branch,
                details: detail + (activity !== 'login' ? Math.floor(Math.random() * 9000 + 1000) : ''),
                status: status
            });
        }

        return logs.sort((a, b) => b.timestamp - a.timestamp);
    }

    // ===================================
    // Initialize Data
    // ===================================
    function initializeLogs() {
        allLogs = generateSampleLogs();
        filteredLogs = [...allLogs];
        updateStats();
        renderLogs();
    }

    // ===================================
    // Update Statistics
    // ===================================
    function updateStats() {
        totalActivitiesEl.textContent = allLogs.length.toLocaleString();
        
        pendingSyncCount = allLogs.filter(log => log.status === 'pending').length;
        pendingSyncEl.textContent = pendingSyncCount;
        
        const pendingChange = document.querySelector('#pendingSync').parentElement.querySelector('.stat-change');
        if (pendingSyncCount === 0) {
            pendingChange.textContent = 'All synced';
            pendingChange.className = 'stat-change neutral';
        } else {
            pendingChange.textContent = `${pendingSyncCount} items pending`;
            pendingChange.className = 'stat-change negative';
        }

        // Simulate active users
        const activeUsers = Math.floor(Math.random() * 10 + 20);
        activeUsersEl.textContent = activeUsers;

        updateLastSync();
    }

    // ===================================
    // Network Status Management
    // ===================================
    function updateNetworkStatus(online) {
        isOnline = online;
        
        if (online) {
            statusIndicator.className = 'status-indicator online';
            statusText.textContent = 'Online';
            showNotification('Connection restored. Syncing data...', 'success');
            syncPendingLogs();
        } else {
            statusIndicator.className = 'status-indicator offline';
            statusText.textContent = 'Offline';
            showNotification('You are offline. Changes will sync when connection is restored.', 'info');
        }
    }

    // Listen for online/offline events
    window.addEventListener('online', () => updateNetworkStatus(true));
    window.addEventListener('offline', () => updateNetworkStatus(false));

    // ===================================
    // Sync Functionality
    // ===================================
    function syncPendingLogs() {
        const pendingLogs = allLogs.filter(log => log.status === 'pending');
        
        if (pendingLogs.length === 0) {
            showNotification('All logs are already synced', 'success');
            return;
        }

        statusIndicator.className = 'status-indicator syncing';
        statusText.textContent = 'Syncing...';

        // Simulate sync process
        let synced = 0;
        const syncInterval = setInterval(() => {
            if (synced < pendingLogs.length) {
                pendingLogs[synced].status = 'synced';
                synced++;
                updateStats();
                renderLogs();
            } else {
                clearInterval(syncInterval);
                statusIndicator.className = 'status-indicator online';
                statusText.textContent = 'Online';
                showNotification(`Successfully synced ${synced} log${synced > 1 ? 's' : ''}`, 'success');
                updateLastSync();
            }
        }, 300);
    }

    syncButton.addEventListener('click', function() {
        if (!isOnline) {
            showNotification('Cannot sync while offline', 'error');
            return;
        }
        syncPendingLogs();
    });

    // ===================================
    // Update Last Sync Time
    // ===================================
    function updateLastSync() {
        lastSyncEl.textContent = 'Just now';
        
        // Update relative time
        let seconds = 0;
        const interval = setInterval(() => {
            seconds++;
            if (seconds < 60) {
                lastSyncEl.textContent = `${seconds}s ago`;
            } else if (seconds < 3600) {
                lastSyncEl.textContent = `${Math.floor(seconds / 60)}m ago`;
            } else {
                lastSyncEl.textContent = `${Math.floor(seconds / 3600)}h ago`;
            }
        }, 1000);
    }

    // ===================================
    // Filter Logs
    // ===================================
    function filterLogs() {
        const searchTerm = searchInput.value.toLowerCase();
        const activityType = activityFilter.value;
        const branchType = branchFilter.value;
        const dateType = dateFilter.value;

        filteredLogs = allLogs.filter(log => {
            // Search filter
            const matchesSearch = 
                log.user.name.toLowerCase().includes(searchTerm) ||
                log.action.toLowerCase().includes(searchTerm) ||
                log.branch.toLowerCase().includes(searchTerm) ||
                log.details.toLowerCase().includes(searchTerm);

            // Activity filter
            const matchesActivity = activityType === 'all' || log.action === activityType;

            // Branch filter
            const matchesBranch = branchType === 'all' || log.branch === branchType;

            // Date filter
            let matchesDate = true;
            const now = new Date();
            const logDate = new Date(log.timestamp);
            
            if (dateType === 'today') {
                matchesDate = logDate.toDateString() === now.toDateString();
            } else if (dateType === 'week') {
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                matchesDate = logDate >= weekAgo;
            } else if (dateType === 'month') {
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                matchesDate = logDate >= monthAgo;
            }

            return matchesSearch && matchesActivity && matchesBranch && matchesDate;
        });

        currentPage = 1;
        renderLogs();
    }

    // Add event listeners for filters
    searchInput.addEventListener('input', filterLogs);
    activityFilter.addEventListener('change', filterLogs);
    branchFilter.addEventListener('change', filterLogs);
    dateFilter.addEventListener('change', filterLogs);

    // ===================================
    // Render Logs Table
    // ===================================
    function renderLogs() {
        const startIndex = (currentPage - 1) * logsPerPage;
        const endIndex = startIndex + logsPerPage;
        const logsToDisplay = filteredLogs.slice(startIndex, endIndex);

        logsTableBody.innerHTML = '';

        if (logsToDisplay.length === 0) {
            logsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                        <svg style="width: 48px; height: 48px; margin: 0 auto 1rem; opacity: 0.5;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                        </svg>
                        <div style="font-weight: 500;">No logs found</div>
                        <div style="font-size: 0.875rem;">Try adjusting your filters</div>
                    </td>
                </tr>
            `;
            return;
        }

        logsToDisplay.forEach(log => {
            const row = document.createElement('tr');
            
            const formattedTime = formatTimestamp(log.timestamp);
            
            row.innerHTML = `
                <td>${formattedTime}</td>
                <td>
                    <div class="user-cell">
                        <div class="user-avatar">${log.user.initial}</div>
                        <span>${log.user.name}</span>
                    </div>
                </td>
                <td>
                    <span class="action-badge ${log.action}">${capitalizeFirst(log.action)}</span>
                </td>
                <td>${log.branch}</td>
                <td>${log.details}</td>
                <td>
                    <span class="status-badge ${log.status}">
                        <span class="status-dot"></span>
                        ${capitalizeFirst(log.status)}
                    </span>
                </td>
            `;
            
            logsTableBody.appendChild(row);
        });

        updatePagination();
    }

    // ===================================
    // Pagination
    // ===================================
    function updatePagination() {
        const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
        
        currentPageSpan.textContent = currentPage;
        totalPagesSpan.textContent = totalPages;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderLogs();
            scrollToTop();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderLogs();
            scrollToTop();
        }
    });

    function scrollToTop() {
        document.querySelector('.logs-container').scrollIntoView({ behavior: 'smooth' });
    }

    // ===================================
    // Refresh Logs
    // ===================================
    refreshButton.addEventListener('click', function() {
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 600);

        showNotification('Refreshing logs...', 'info');
        
        setTimeout(() => {
            initializeLogs();
            showNotification('Logs refreshed successfully', 'success');
        }, 1000);
    });

    // ===================================
    // Export Logs
    // ===================================
    exportButton.addEventListener('click', function() {
        showNotification('Exporting logs to CSV...', 'info');
        
        setTimeout(() => {
            const csvContent = generateCSV(filteredLogs);
            downloadCSV(csvContent, 'system-logs-export.csv');
            showNotification('Logs exported successfully', 'success');
        }, 1000);
    });

    function generateCSV(logs) {
        const headers = ['Timestamp', 'User', 'Action', 'Branch', 'Details', 'Status'];
        const rows = logs.map(log => [
            formatTimestamp(log.timestamp),
            log.user.name,
            log.action,
            log.branch,
            log.details,
            log.status
        ]);

        const csvRows = [headers, ...rows].map(row => 
            row.map(cell => `"${cell}"`).join(',')
        );

        return csvRows.join('\n');
    }

    function downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    // ===================================
    // Utility Functions
    // ===================================
    function formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return date.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return 'Just now';
        }
    }

    function capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ===================================
    // Notification System
    // ===================================
    function showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'notification';
        
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };

        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"/></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"/></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"/></svg>'
        };

        notification.innerHTML = icons[type] + '<span>' + message + '</span>';
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '24px',
            right: '24px',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            backgroundColor: colors[type],
            color: 'white',
            fontWeight: '500',
            fontSize: '0.875rem',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            maxWidth: '400px'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add animation styles
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // ===================================
    // Settings Button
    // ===================================
    document.getElementById('settingsButton').addEventListener('click', function() {
        showNotification('Settings panel coming soon', 'info');
    });

    // ===================================
    // Initialize Application
    // ===================================
    initializeLogs();
    updateNetworkStatus(isOnline);

    // Simulate periodic activity
    setInterval(() => {
        if (Math.random() > 0.7) {
            // Randomly add a new log entry
            const newLog = generateSampleLogs()[0];
            newLog.timestamp = new Date();
            allLogs.unshift(newLog);
            
            if (filteredLogs === allLogs) {
                filteredLogs = [...allLogs];
            }
            
            updateStats();
            if (currentPage === 1) {
                renderLogs();
            }
        }
    }, 10000); // Every 10 seconds

    // ===================================
    // Navigation Active State
    // ===================================
    setupNavigationActiveState();
});

function setupNavigationActiveState() {
    const currentUrl = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.classList.remove('active');
        const href = item.getAttribute('href');
        
        if (href && currentUrl.includes(href)) {
            item.classList.add('active');
        } else if (currentUrl.includes('system-logs') && href === 'system-logs.html') {
            item.classList.add('active');
        }
    });
}