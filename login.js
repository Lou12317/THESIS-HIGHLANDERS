// ===================================
// Login Page Interactions
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const usernameInput = document.getElementById('username');

    // ===================================
    // Password Toggle Functionality
    // ===================================
    togglePasswordBtn.addEventListener('click', function () {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Add visual feedback
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });

    // ===================================
    // Form Validation & Submission
    // ===================================
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Basic validation
        if (!username || !password) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        // Add loading state to button
        const submitBtn = loginForm.querySelector('.btn-signin');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">Signing in...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate login (replace with actual authentication)
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';

            // Example: Show success message
            showNotification('Login successful!', 'success');

            // Redirect to dashboard
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 600);

            console.log('Login attempt:', {
                username,
                password: '***',
                rememberMe
            });
        }, 1500);
    });

    // ===================================
    // Input Animations
    // ===================================
    const inputs = document.querySelectorAll('.form-input');

    inputs.forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'translateY(-2px)';
        });

        input.addEventListener('blur', function () {
            this.parentElement.style.transform = '';
        });
    });

    // ===================================
    // Notification System
    // ===================================
    function showNotification(message, type = 'info') {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '0.5rem',
            backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            fontWeight: '500',
            fontSize: '0.875rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            animation: 'slideInRight 0.3s ease-out',
            fontFamily: 'var(--font-family)'
        });

        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Add notification animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // Forgot Password Handler
    // ===================================
    const forgotPasswordLink = document.querySelector('.forgot-password');
    forgotPasswordLink.addEventListener('click', function (e) {
        e.preventDefault();
        showNotification('Password reset link would be sent to your email', 'info');
        // Implement your password reset logic here
    });
});