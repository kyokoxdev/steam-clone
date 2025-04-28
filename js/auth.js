/**
 * GameHub - Authentication Module
 * Handles user authentication, form validation, and account management
 */

const Auth = {
    // Current user data (will be null if not logged in)
    currentUser: null,
    
    init: function() {
        // Initialize auth components
        this.loadUserFromStorage();
        this.initAuthForms();
        this.updateAuthUI();
        console.log('Auth module initialized');
    },
    
    loadUserFromStorage: function() {
        // Check if there's a logged-in user in localStorage
        const userData = localStorage.getItem('gameHubCurrentUser');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('User loaded from storage:', this.currentUser.username);
            } catch (error) {
                console.error('Failed to parse user data from storage', error);
                localStorage.removeItem('gameHubCurrentUser');
            }
        }
    },
    
    saveUserToStorage: function() {
        // Save current user to localStorage
        if (this.currentUser) {
            localStorage.setItem('gameHubCurrentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('gameHubCurrentUser');
        }
    },
    
    initAuthForms: function() {
        // Initialize auth tab functionality if on auth page
        this.initAuthTabs();
        
        // Login form validation and submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            this.initLoginForm(loginForm);
        }
        
        // Registration form validation and submission
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            this.initRegisterForm(registerForm);
        }
        
        // Logout functionality
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
    },
    
    initAuthTabs: function() {
        const authTabs = document.querySelectorAll('.auth-tab');
        if (authTabs.length === 0) return;
        
        authTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                authTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show corresponding form
                const targetForm = tab.getAttribute('data-form');
                document.querySelectorAll('.auth-form').forEach(form => {
                    form.classList.remove('active');
                });
                document.getElementById(targetForm).classList.add('active');
            });
        });
    },
    
    initLoginForm: function(form) {
        // Reference to this for use in event handlers
        const self = this;
        
        // Add validation to username/email field
        const usernameField = form.querySelector('#login-username');
        const passwordField = form.querySelector('#login-password');
        const rememberMeCheckbox = form.querySelector('#remember-me');
        const errorDisplay = form.querySelector('.form-error');
        
        // Clear errors when user types
        usernameField.addEventListener('input', function() {
            this.classList.remove('error');
            errorDisplay.textContent = '';
        });
        
        passwordField.addEventListener('input', function() {
            this.classList.remove('error');
            errorDisplay.textContent = '';
        });
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            errorDisplay.textContent = '';
            usernameField.classList.remove('error');
            passwordField.classList.remove('error');
            
            // Get form values
            const username = usernameField.value.trim();
            const password = passwordField.value.trim();
            const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;
            
            // Validate fields
            let isValid = true;
            
            if (!username) {
                usernameField.classList.add('error');
                errorDisplay.textContent = 'Username or email is required';
                isValid = false;
            }
            
            if (!password) {
                passwordField.classList.add('error');
                errorDisplay.textContent = errorDisplay.textContent || 'Password is required';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Show loading state
            const submitButton = form.querySelector('[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Signing in...';
            
            // Simulate login request with timeout
            setTimeout(() => {
                const loginResult = self.login(username, password, rememberMe);
                
                if (loginResult.success) {
                    // Show success message
                    errorDisplay.textContent = '';
                    errorDisplay.classList.remove('error');
                    errorDisplay.classList.add('success');
                    errorDisplay.textContent = 'Login successful! Redirecting...';
                    
                    // Redirect after a brief delay
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1000);
                } else {
                    // Show error message
                    errorDisplay.classList.add('error');
                    errorDisplay.classList.remove('success');
                    errorDisplay.textContent = loginResult.message;
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }, 1000);
        });
    },
    
    initRegisterForm: function(form) {
        // Reference to this for use in event handlers
        const self = this;
        
        // Get form fields
        const usernameField = form.querySelector('#register-username');
        const emailField = form.querySelector('#register-email');
        const passwordField = form.querySelector('#register-password');
        const confirmPasswordField = form.querySelector('#register-confirm-password');
        const termsCheckbox = form.querySelector('#accept-terms');
        const errorDisplay = form.querySelector('.form-error');
        const passwordStrengthIndicator = form.querySelector('.password-strength-indicator');
        
        // Clear errors when user types
        const fields = [usernameField, emailField, passwordField, confirmPasswordField];
        fields.forEach(field => {
            if (!field) return;
            
            field.addEventListener('input', function() {
                this.classList.remove('error');
                errorDisplay.textContent = '';
            });
        });
        
        // Add password strength meter
        if (passwordField && passwordStrengthIndicator) {
            passwordField.addEventListener('input', function() {
                const strength = self.checkPasswordStrength(this.value);
                passwordStrengthIndicator.className = 'password-strength-indicator';
                
                // Update indicator based on strength
                if (this.value.length === 0) {
                    passwordStrengthIndicator.textContent = '';
                    passwordStrengthIndicator.classList.remove('weak', 'medium', 'strong');
                } else {
                    passwordStrengthIndicator.classList.add(strength.level);
                    passwordStrengthIndicator.innerHTML = `
                        <div class="strength-bar">
                            <div class="strength-bar-fill ${strength.level}" style="width: ${strength.percentage}%"></div>
                        </div>
                        <span>${strength.message}</span>
                    `;
                }
            });
        }
        
        // Verify matching passwords
        if (confirmPasswordField) {
            confirmPasswordField.addEventListener('input', function() {
                if (passwordField.value !== this.value) {
                    this.classList.add('error');
                    errorDisplay.textContent = 'Passwords do not match';
                } else {
                    this.classList.remove('error');
                    errorDisplay.textContent = '';
                }
            });
        }
        
        // Username availability check
        if (usernameField) {
            usernameField.addEventListener('blur', function() {
                const username = this.value.trim();
                
                if (username.length >= 3) {
                    // Simulate server check with timeout
                    const checkingMessage = document.createElement('span');
                    checkingMessage.textContent = 'Checking availability...';
                    checkingMessage.className = 'username-checking';
                    this.parentNode.appendChild(checkingMessage);
                    
                    setTimeout(() => {
                        checkingMessage.remove();
                        
                        const isAvailable = self.checkUsernameAvailability(username);
                        
                        if (!isAvailable) {
                            this.classList.add('error');
                            errorDisplay.textContent = 'Username is already taken';
                        } else {
                            const availableMessage = document.createElement('span');
                            availableMessage.textContent = 'Username available';
                            availableMessage.className = 'username-available';
                            this.parentNode.appendChild(availableMessage);
                            
                            setTimeout(() => {
                                availableMessage.remove();
                            }, 2000);
                        }
                    }, 800);
                }
            });
        }
        
        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset errors
            errorDisplay.textContent = '';
            fields.forEach(field => {
                if (field) field.classList.remove('error');
            });
            
            // Get form values
            const username = usernameField ? usernameField.value.trim() : '';
            const email = emailField ? emailField.value.trim() : '';
            const password = passwordField ? passwordField.value.trim() : '';
            const confirmPassword = confirmPasswordField ? confirmPasswordField.value.trim() : '';
            const acceptTerms = termsCheckbox ? termsCheckbox.checked : false;
            
            // Validate fields
            let isValid = true;
            
            if (!username || username.length < 3) {
                usernameField.classList.add('error');
                errorDisplay.textContent = 'Username must be at least 3 characters';
                isValid = false;
            }
            
            if (!email || !self.isValidEmail(email)) {
                emailField.classList.add('error');
                errorDisplay.textContent = errorDisplay.textContent || 'Please enter a valid email address';
                isValid = false;
            }
            
            if (!password || password.length < 8) {
                passwordField.classList.add('error');
                errorDisplay.textContent = errorDisplay.textContent || 'Password must be at least 8 characters';
                isValid = false;
            }
            
            if (password !== confirmPassword) {
                confirmPasswordField.classList.add('error');
                errorDisplay.textContent = errorDisplay.textContent || 'Passwords do not match';
                isValid = false;
            }
            
            if (!acceptTerms) {
                errorDisplay.textContent = errorDisplay.textContent || 'You must accept the terms and conditions';
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Check username availability one more time
            if (!self.checkUsernameAvailability(username)) {
                usernameField.classList.add('error');
                errorDisplay.textContent = 'Username is already taken';
                return;
            }
            
            // Show loading state
            const submitButton = form.querySelector('[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Creating account...';
            
            // Simulate registration request with timeout
            setTimeout(() => {
                const userData = {
                    username,
                    email,
                    password, // In a real app, this would be hashed on the server
                    createdAt: new Date().toISOString()
                };
                
                const registerResult = self.register(userData);
                
                if (registerResult.success) {
                    // Show success message
                    errorDisplay.textContent = '';
                    form.reset();
                    
                    // Replace form with success message
                    form.innerHTML = `
                        <div class="register-success">
                            <h3>Registration Successful!</h3>
                            <p>Your account has been created and you are now logged in.</p>
                            <p>Redirecting to the store homepage...</p>
                        </div>
                    `;
                    
                    // Redirect after a brief delay
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 2000);
                } else {
                    // Show error message
                    errorDisplay.classList.add('error');
                    errorDisplay.textContent = registerResult.message;
                    
                    // Reset button
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }, 1500);
        });
    },
    
    updateAuthUI: function() {
        // Update UI based on login status
        const loggedInElements = document.querySelectorAll('.logged-in');
        const loggedOutElements = document.querySelectorAll('.logged-out');
        const usernameElements = document.querySelectorAll('.username-display');
        
        if (this.currentUser) {
            // User is logged in
            loggedInElements.forEach(el => el.style.display = 'block');
            loggedOutElements.forEach(el => el.style.display = 'none');
            
            // Display username
            usernameElements.forEach(el => {
                el.textContent = this.currentUser.username;
            });
        } else {
            // User is logged out
            loggedInElements.forEach(el => el.style.display = 'none');
            loggedOutElements.forEach(el => el.style.display = 'block');
            
            // Clear username
            usernameElements.forEach(el => {
                el.textContent = '';
            });
        }
    },
    
    login: function(username, password, rememberMe = false) {
        // Get registered users from localStorage
        const users = JSON.parse(localStorage.getItem('gameHubUsers') || '[]');
        
        // Find the user by username or email
        const user = users.find(u => 
            u.username.toLowerCase() === username.toLowerCase() || 
            (u.email && u.email.toLowerCase() === username.toLowerCase())
        );
        
        if (!user) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }
        
        // In a real app, we would hash the password and compare the hash
        // For this demo, we're comparing the plain text password (insecure!)
        if (user.password !== password) {
            return {
                success: false,
                message: 'Invalid username or password'
            };
        }
        
        // Set current user
        this.currentUser = {
            id: user.id || user.username,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            // Don't include the password in currentUser!
            
            // If you want to persist sessions between page refreshes
            sessionStarted: new Date().toISOString(),
            rememberMe: rememberMe
        };
        
        // Save to localStorage
        this.saveUserToStorage();
        
        // Update UI
        this.updateAuthUI();
        
        return {
            success: true,
            message: 'Login successful'
        };
    },
    
    register: function(userData) {
        // Get registered users from localStorage
        const users = JSON.parse(localStorage.getItem('gameHubUsers') || '[]');
        
        // Check if username already exists
        if (users.some(u => u.username.toLowerCase() === userData.username.toLowerCase())) {
            return {
                success: false,
                message: 'Username already taken'
            };
        }
        
        // Check if email already exists
        if (users.some(u => u.email && u.email.toLowerCase() === userData.email.toLowerCase())) {
            return {
                success: false,
                message: 'Email already registered'
            };
        }
        
        // Add new user
        const newUser = {
            id: 'user_' + Date.now(),
            username: userData.username,
            email: userData.email,
            password: userData.password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        
        // Save to localStorage
        localStorage.setItem('gameHubUsers', JSON.stringify(users));
        
        // Log in the new user
        this.currentUser = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            createdAt: newUser.createdAt,
            // Don't include the password in currentUser!
            
            sessionStarted: new Date().toISOString(),
            rememberMe: false
        };
        
        // Save to localStorage
        this.saveUserToStorage();
        
        // Update UI
        this.updateAuthUI();
        
        return {
            success: true,
            message: 'Registration successful'
        };
    },
    
    logout: function() {
        // Clear current user
        this.currentUser = null;
        
        // Remove from localStorage
        this.saveUserToStorage();
        
        // Update UI
        this.updateAuthUI();
        
        // Redirect to home page
        window.location.href = '../index.html';
    },
    
    checkUsernameAvailability: function(username) {
        // Get registered users from localStorage
        const users = JSON.parse(localStorage.getItem('gameHubUsers') || '[]');
        
        // Check if username already exists
        return !users.some(u => u.username.toLowerCase() === username.toLowerCase());
    },
    
    isValidEmail: function(email) {
        // Basic email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    checkPasswordStrength: function(password) {
        // Password strength criteria
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        let strength = 0;
        let message = '';
        let level = '';
        
        // Add points for length
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 1;
        
        // Add points for character types
        if (hasLowerCase) strength += 1;
        if (hasUpperCase) strength += 1;
        if (hasNumbers) strength += 1;
        if (hasSpecialChars) strength += 1;
        
        // Determine strength level
        if (password.length === 0) {
            level = '';
            message = '';
            return { level, message, percentage: 0 };
        } else if (password.length < 8) {
            level = 'weak';
            message = 'Too short';
            return { level, message, percentage: 20 };
        } else if (strength < 3) {
            level = 'weak';
            message = 'Weak';
            return { level, message, percentage: 33 };
        } else if (strength < 5) {
            level = 'medium';
            message = 'Medium';
            return { level, message, percentage: 66 };
        } else {
            level = 'strong';
            message = 'Strong';
            return { level, message, percentage: 100 };
        }
    },
    
    initPasswordReset: function() {
        const resetForm = document.getElementById('password-reset-form');
        if (!resetForm) return;
        
        const emailField = resetForm.querySelector('#reset-email');
        const errorDisplay = resetForm.querySelector('.form-error');
        const successDisplay = resetForm.querySelector('.form-success');
        
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Reset messages
            errorDisplay.textContent = '';
            successDisplay.textContent = '';
            
            // Get email
            const email = emailField.value.trim();
            
            // Validate email
            if (!email || !this.isValidEmail(email)) {
                emailField.classList.add('error');
                errorDisplay.textContent = 'Please enter a valid email address';
                return;
            }
            
            // Show loading state
            const submitButton = resetForm.querySelector('[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            
            // Simulate reset request with timeout
            setTimeout(() => {
                // Check if email exists in users
                const users = JSON.parse(localStorage.getItem('gameHubUsers') || '[]');
                const userExists = users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase());
                
                if (userExists) {
                    // Show success message
                    successDisplay.textContent = 'Password reset instructions have been sent to your email.';
                    resetForm.reset();
                } else {
                    // Show error message
                    errorDisplay.textContent = 'No account found with that email address.';
                }
                
                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }, 1500);
        });
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    Auth.init();
});