// ===================================
// Registration Page Interactions
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    // Get form elements
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const toggleConfirmPasswordBtn = document.getElementById('toggleConfirmPassword');
    const fullnameInput = document.getElementById('fullname');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    const passwordStrength = document.getElementById('passwordStrength');

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

    toggleConfirmPasswordBtn.addEventListener('click', function () {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);

        // Add visual feedback
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });

    // ===================================
    // Password Strength Checker
    // ===================================
    passwordInput.addEventListener('input', function () {
        const password = this.value;
        const strength = calculatePasswordStrength(password);

        // Remove all strength classes
        passwordStrength.classList.remove('strength-weak', 'strength-medium', 'strength-strong');

        if (password.length === 0) {
            strengthText.textContent = 'Enter a password';
            passwordStrength.classList.remove('strength-weak', 'strength-medium', 'strength-strong');
            return;
        }

        // Add appropriate strength class
        if (strength.score <= 2) {
            passwordStrength.classList.add('strength-weak');
            strengthText.textContent = 'Weak password';
        } else if (strength.score <= 4) {
            passwordStrength.classList.add('strength-medium');
            strengthText.textContent = 'Medium strength';
        } else {
            passwordStrength.classList.add('strength-strong');
            strengthText.textContent = 'Strong password';
        }
    });

    function calculatePasswordStrength(password) {
        let score = 0;

        if (!password) return { score: 0 };

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(password)) score++; // lowercase
        if (/[A-Z]/.test(password)) score++; // uppercase
        if (/[0-9]/.test(password)) score++; // numbers
        if (/[^a-zA-Z0-9]/.test(password)) score++; // special characters

        return { score: Math.min(score, 6) };
    }

    // ===================================
    // Email Validation
    // ===================================
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===================================
    // Form Validation & Submission
    // ===================================
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullname = fullnameInput.value.trim();
        const email = emailInput.value.trim();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const agreeTerms = agreeTermsCheckbox.checked;

        // Validation checks
        if (!fullname || !email || !username || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            return;
        }

        if (fullname.length < 2) {
            showNotification('Please enter your full name', 'error');
            fullnameInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            emailInput.focus();
            return;
        }

        if (username.length < 3) {
            showNotification('Username must be at least 3 characters', 'error');
            usernameInput.focus();
            return;
        }

        if (password.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            passwordInput.focus();
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            confirmPasswordInput.focus();
            return;
        }

        if (!agreeTerms) {
            showNotification('Please agree to the Terms & Conditions', 'error');
            return;
        }

        // Check password strength
        const strength = calculatePasswordStrength(password);
        if (strength.score < 3) {
            showNotification('Please use a stronger password', 'error');
            passwordInput.focus();
            return;
        }

        // Add loading state to button
        const submitBtn = registerForm.querySelector('.btn-register');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="btn-text">Creating account...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';

        // Simulate registration (replace with actual API call)
        setTimeout(() => {
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';

            // Show success message
            showNotification('Account created successfully!', 'success');

            // Redirect to login or dashboard
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);

            console.log('Registration attempt:', {
                fullname,
                email,
                username,
                password: '***',
                agreeTerms
            });
        }, 1500);
    });

    // ===================================
    // Real-time Confirm Password Validation
    // ===================================
    confirmPasswordInput.addEventListener('input', function () {
        if (this.value && this.value !== passwordInput.value) {
            this.style.borderColor = 'var(--accent-red)';
        } else if (this.value === passwordInput.value) {
            this.style.borderColor = 'var(--primary-green)';
        } else {
            this.style.borderColor = '';
        }
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
    // Username Validation (No spaces)
    // ===================================
    usernameInput.addEventListener('input', function () {
        // Remove spaces
        this.value = this.value.replace(/\s/g, '');
        
        // Show validation
        if (this.value.length > 0 && this.value.length < 3) {
            this.style.borderColor = 'var(--accent-red)';
        } else if (this.value.length >= 3) {
            this.style.borderColor = 'var(--primary-green)';
        } else {
            this.style.borderColor = '';
        }
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
    // Terms & Conditions Link Handler
    // ===================================
    const termsLink = document.querySelector('.terms-link');
    if (termsLink) {
        termsLink.addEventListener('click', function (e) {
            e.preventDefault();
            showNotification('Terms & Conditions page will open', 'info');
            // Implement your terms page redirect here
        });
    }
});