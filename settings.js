// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initializeSettings();
});

// ==========================================
// Main Initialization
// ==========================================
function initializeSettings() {
    // Setup navigation active state
    setupNavigationActiveState();
    
    // Setup tab switching
    setupTabSwitching();
    
    // Setup toggle switches
    setupToggleSwitches();
    
    // Setup form validations
    setupFormValidations();
    
    console.log('Settings page initialized');
}

// ==========================================
// Navigation Active State
// ==========================================
function setupNavigationActiveState() {
    const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
    const currentPage = window.location.pathname.split('/').pop() || 'settings.html';

    navItems.forEach(item => {
        // Remove active class from all items
        item.classList.remove('active');
        
        // Add active class to the current page
        if (item.href && item.href.includes(currentPage)) {
            item.classList.add('active');
        }
    });
}

// ==========================================
// Tab Switching
// ==========================================
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.textContent.toLowerCase();
            switchTab(tabId);
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and content
    const allTabs = document.querySelectorAll('.tab-btn');
    const allContent = document.querySelectorAll('.tab-content');
    
    allTabs.forEach(tab => tab.classList.remove('active'));
    allContent.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab
    const clickedTab = Array.from(allTabs).find(tab => 
        tab.textContent.toLowerCase() === tabName
    );
    if (clickedTab) {
        clickedTab.classList.add('active');
    }
    
    // Show corresponding content
    const targetContent = document.getElementById(tabName);
    if (targetContent) {
        targetContent.classList.add('active');
    }
    
    console.log('Switched to tab:', tabName);
}

// ==========================================
// Toggle Switches
// ==========================================
function setupToggleSwitches() {
    const toggles = document.querySelectorAll('.toggle-switch');
    
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            toggleSwitch(this);
        });
    });
}

function toggleSwitch(element) {
    element.classList.toggle('active');
    
    const isActive = element.classList.contains('active');
    const toggleTitle = element.parentElement.querySelector('.toggle-title').textContent;
    
    console.log(`Toggle "${toggleTitle}" is now: ${isActive ? 'ON' : 'OFF'}`);
    
    // You can add API calls here to save the toggle state
    // Example: saveToggleSetting(toggleTitle, isActive);
}

// ==========================================
// Save Settings
// ==========================================
function saveSettings() {
    // Show loading state
    const buttons = document.querySelectorAll('.btn-primary');
    buttons.forEach(btn => {
        if (btn.textContent.includes('Save') || btn.textContent.includes('Update')) {
            btn.disabled = true;
            btn.textContent = 'Saving...';
        }
    });
    
    // Simulate API call
    setTimeout(() => {
        // Reset button state
        buttons.forEach(btn => {
            btn.disabled = false;
            if (btn.textContent === 'Saving...') {
                btn.textContent = btn.textContent.replace('Saving...', 'Save Changes');
            }
        });
        
        // Show success toast
        showToast('Settings saved successfully!');
        
        console.log('Settings saved');
    }, 1500);
}

// ==========================================
// Toast Notification
// ==========================================
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    const toast = document.getElementById('toast');
    toast.classList.remove('show');
}

// ==========================================
// Form Validations
// ==========================================
function setupFormValidations() {
    const forms = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    forms.forEach(input => {
        input.addEventListener('change', function() {
            validateInput(this);
        });
        
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    
    // Email validation
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value) && value !== '') {
            input.style.borderColor = '#ef4444';
            return false;
        } else {
            input.style.borderColor = '#10b981';
        }
    }
    
    // Phone validation
    if (input.type === 'tel') {
        const phoneRegex = /^[+]?[\d\s-()]+$/;
        if (!phoneRegex.test(value) && value !== '') {
            input.style.borderColor = '#ef4444';
            return false;
        } else {
            input.style.borderColor = '#10b981';
        }
    }
    
    // Password validation
    if (input.type === 'password') {
        if (value.length > 0 && value.length < 8) {
            input.style.borderColor = '#ef4444';
            return false;
        } else if (value.length >= 8) {
            input.style.borderColor = '#10b981';
        }
    }
    
    // Reset border after 2 seconds
    setTimeout(() => {
        input.style.borderColor = '#d1d5db';
    }, 2000);
    
    return true;
}

// ==========================================
// Reset Form
// ==========================================
function resetForm() {
    const currentTab = document.querySelector('.tab-content.active');
    const inputs = currentTab.querySelectorAll('.form-input, .form-select, .form-textarea');
    
    inputs.forEach(input => {
        // Reset to original value or empty
        if (input.defaultValue) {
            input.value = input.defaultValue;
        } else {
            input.value = '';
        }
        input.style.borderColor = '#d1d5db';
    });
    
    console.log('Form reset');
}

// ==========================================
// Backup Functions (System Settings)
// ==========================================
function backupNow() {
    showToast('Backup started...');
    
    setTimeout(() => {
        showToast('Backup completed successfully!');
    }, 2000);
}

// ==========================================
// API Key Functions
// ==========================================
function regenerateApiKey() {
    if (confirm('Are you sure you want to regenerate the API key? This will invalidate the current key.')) {
        showToast('Generating new API key...');
        
        setTimeout(() => {
            const apiInput = document.querySelector('.form-input[value*="hgt_"]');
            const newKey = 'hgt_' + generateRandomKey(32);
            apiInput.value = newKey;
            showToast('API key regenerated successfully!');
        }, 1500);
    }
}

function copyToClipboard() {
    const apiInput = document.querySelector('.form-input[value*="hgt_"]');
    const tempInput = document.createElement('input');
    tempInput.value = apiInput.value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showToast('API key copied to clipboard!');
}

function generateRandomKey(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ==========================================
// Logout Session
// ==========================================
function logoutSession(sessionName) {
    if (confirm(`Are you sure you want to logout from "${sessionName}"?`)) {
        showToast('Session terminated successfully!');
        // Add logic to remove the session from the UI
    }
}

// ==========================================
// Enable 2FA
// ==========================================
function enable2FA() {
    showToast('Opening 2FA setup...');
    // Add logic to open 2FA setup modal or redirect
    console.log('2FA setup initiated');
}

// ==========================================
// Export Settings
// ==========================================
function exportSettings() {
    const settings = {
        company: {},
        regional: {},
        notifications: {},
        security: {},
        system: {}
    };
    
    // Collect all settings
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        // Add to settings object
    });
    
    // Convert to JSON and download
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'highlander-settings.json';
    link.click();
    
    showToast('Settings exported successfully!');
}

// ==========================================
// Import Settings
// ==========================================
function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const settings = JSON.parse(event.target.result);
                // Apply settings to form
                showToast('Settings imported successfully!');
                console.log('Imported settings:', settings);
            } catch (error) {
                showToast('Error importing settings!');
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}