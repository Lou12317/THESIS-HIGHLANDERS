// Dashboard Interactions & Logic

// Chart.js Default Configuration
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.color = '#6b7280';
Chart.defaults.scale.grid.color = '#e5e7eb';
Chart.defaults.plugins.tooltip.backgroundColor = '#f9fafb';
Chart.defaults.plugins.tooltip.titleColor = '#111827';
Chart.defaults.plugins.tooltip.bodyColor = '#4b5563';
Chart.defaults.plugins.tooltip.borderColor = '#e5e7eb';
Chart.defaults.plugins.tooltip.borderWidth = 1;
Chart.defaults.plugins.tooltip.padding = 12;
Chart.defaults.plugins.tooltip.displayColors = true;
Chart.defaults.plugins.tooltip.usePointStyle = true;
Chart.defaults.plugins.tooltip.boxPadding = 4;

document.addEventListener('DOMContentLoaded', function () {
    // 0. Initialize Lucide Icons
    lucide.createIcons();
    
    // 1. Initialize Real-time Clock
    updateTime();
    setInterval(updateTime, 60000);

    // 2. Initialize Charts
    initSalesChart();
    initInventoryChart();
    initSupplierChart();
    initTransactionChart();

    // 3. Setup Filter Buttons
    setupFilters();

    // 4. Setup Export Modal
    setupExportModal();

    // 5. Setup Interactive Cards
    setupCardInteractions();

    // 6. Setup Navigation Active State
    setupNavigationActiveState();
});

// ==========================================
// 1. Real-time Clock
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
// 2. Chart Initializations
// ==========================================

// Sales Performance Chart (Line)
function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');

    // Gradient for the area under the line
    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
    gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            datasets: [
                {
                    label: 'Actual Sales',
                    data: [245000, 312000, 278000, 389000, 412000, 501000, 478000, 589000, 623000, 687000],
                    borderColor: '#3b82f6',
                    backgroundColor: gradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor: '#3b82f6',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                },
                {
                    label: 'Target',
                    data: [300000, 300000, 300000, 350000, 350000, 400000, 400000, 500000, 500000, 550000],
                    borderColor: '#cbd5e1',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: 'index',
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '₱' + (value / 1000) + 'k';
                        }
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
}

// Inventory Distribution Chart (Doughnut)
function initInventoryChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Rice', 'Fertilizer', 'Feeds', 'Other'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: [
                    '#3b82f6', // Blue
                    '#f97316', // Orange
                    '#10b981', // Green
                    '#ef4444'  // Red
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

// Supplier Performance Chart (Horizontal Bar)
function initSupplierChart() {
    const ctx = document.getElementById('supplierChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'],
            datasets: [
                {
                    label: 'Total Deliveries',
                    data: [24, 18, 15, 12],
                    backgroundColor: '#10b981',
                    borderRadius: 4,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                },
                {
                    label: 'On Time',
                    data: [22, 16, 13, 10],
                    backgroundColor: 'rgba(16, 185, 129, 0.4)',
                    borderRadius: 4,
                    barPercentage: 0.6,
                    categoryPercentage: 0.8
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    });
}

// Transaction Types Chart (Doughnut)
function initTransactionChart() {
    const ctx = document.getElementById('transactionChart').getContext('2d');

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Walk-in', 'Wholesale'],
            datasets: [{
                data: [35, 65],
                backgroundColor: [
                    '#3b82f6', // Blue
                    '#1e3a8a'  // Dark Blue
                ],
                borderWidth: 0,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                }
            }
        }
    });
}

// ==========================================
// 3. Filter Buttons Logic
// ==========================================
function setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all
            buttons.forEach(b => b.classList.remove('active'));
            // Add to clicked
            this.classList.add('active');

            // Here you would typically trigger a data refresh
            console.log('Filter changed to:', this.dataset.filter);
        });
    });
}

// ==========================================
// 4. Export Modal Logic
// ==========================================
function setupExportModal() {
    const modal = document.getElementById('exportModal');
    const openBtn = document.getElementById('btnDownloadPDF');
    const cancelBtn = document.getElementById('btnModalCancel');
    const confirmBtn = document.getElementById('btnModalConfirm');

    // Open
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    // Close
    const closeModal = () => {
        modal.classList.remove('active');
    };

    cancelBtn.addEventListener('click', closeModal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Confirm
    confirmBtn.addEventListener('click', () => {
        // Show success visual feedback (simulated)
        const originalText = confirmBtn.textContent;
        confirmBtn.textContent = 'Generating...';
        confirmBtn.disabled = true;

        setTimeout(() => {
            alert('✅ Report generated successfully!');
            confirmBtn.textContent = originalText;
            confirmBtn.disabled = false;
            closeModal();
        }, 1500);
    });
}

// ==========================================
// 5. Card Interactions
// ==========================================
function setupCardInteractions() {
    const cards = document.querySelectorAll('.stat-card');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            // Add any specific hover logic here if needed beyond CSS
            // e.g. Triggering a mini-sparkline update
        });
    });
}
// ==========================================
// 6. Navigation Active State
// ==========================================
function setupNavigationActiveState() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

    navItems.forEach(item => {
        // Remove active class from all items
        item.classList.remove('active');
        
        // Add active class to the current page
        if (item.href && item.href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}