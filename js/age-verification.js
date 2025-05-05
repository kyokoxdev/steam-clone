/**
 * Age Verification System
 * Handles age verification for mature content
 */

const AgeVerificationSystem = (function() {
    // Default mature content age (18 years)
    const MATURE_AGE = 18;
    
    // Storage key for age verification
    const STORAGE_KEY = 'age_verification';
    const REMEMBER_KEY = 'remember_age_verification';
    
    // Check if user has previously verified their age
    const isAgeVerified = () => {
        return localStorage.getItem(STORAGE_KEY) === 'verified';
    };
    
    // Set age verification status in storage
    const setAgeVerified = (remember = false) => {
        if (remember) {
            localStorage.setItem(STORAGE_KEY, 'verified');
            localStorage.setItem(REMEMBER_KEY, 'true');
        } else {
            sessionStorage.setItem(STORAGE_KEY, 'verified');
        }
    };
    
    // Calculate age from birthdate
    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        // Adjust age if birthday hasn't occurred yet this year
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };
    
    // Check if user meets age requirement
    const checkAge = (year, month, day) => {
        const birthDate = `${year}-${month}-${day}`;
        const age = calculateAge(birthDate);
        return age >= MATURE_AGE;
    };
    
    // Create age gate modal
    const createAgeGateModal = () => {
        // Create modal container
        const modal = document.createElement('div');
        modal.className = 'age-gate-modal';
        modal.setAttribute('aria-labelledby', 'age-gate-title');
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'age-gate-content';
        
        // Add title
        const title = document.createElement('h2');
        title.id = 'age-gate-title';
        title.textContent = 'Age Verification Required';
        
        // Add description
        const description = document.createElement('p');
        description.textContent = 'This content may not be appropriate for all ages. Please enter your date of birth to continue.';
        
        // Create date selection form
        const form = document.createElement('form');
        form.id = 'age-verification-form';
        
        // Create date selectors
        const dateContainer = document.createElement('div');
        dateContainer.className = 'date-selector';
        
        // Create day selector
        const dayLabel = document.createElement('label');
        dayLabel.textContent = 'Day';
        dayLabel.setAttribute('for', 'age-day');
        
        const daySelect = document.createElement('select');
        daySelect.id = 'age-day';
        daySelect.name = 'day';
        daySelect.required = true;
        
        // Add day options
        const dayOption = document.createElement('option');
        dayOption.value = '';
        dayOption.textContent = 'Day';
        dayOption.selected = true;
        daySelect.appendChild(dayOption);
        
        for (let i = 1; i <= 31; i++) {
            const option = document.createElement('option');
            option.value = i.toString().padStart(2, '0');
            option.textContent = i.toString();
            daySelect.appendChild(option);
        }
        
        // Create month selector
        const monthLabel = document.createElement('label');
        monthLabel.textContent = 'Month';
        monthLabel.setAttribute('for', 'age-month');
        
        const monthSelect = document.createElement('select');
        monthSelect.id = 'age-month';
        monthSelect.name = 'month';
        monthSelect.required = true;
        
        // Add month options
        const monthOption = document.createElement('option');
        monthOption.value = '';
        monthOption.textContent = 'Month';
        monthOption.selected = true;
        monthSelect.appendChild(monthOption);
        
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = (index + 1).toString().padStart(2, '0');
            option.textContent = month;
            monthSelect.appendChild(option);
        });
        
        // Create year selector
        const yearLabel = document.createElement('label');
        yearLabel.textContent = 'Year';
        yearLabel.setAttribute('for', 'age-year');
        
        const yearSelect = document.createElement('select');
        yearSelect.id = 'age-year';
        yearSelect.name = 'year';
        yearSelect.required = true;
        
        // Add year options
        const yearOption = document.createElement('option');
        yearOption.value = '';
        yearOption.textContent = 'Year';
        yearOption.selected = true;
        yearSelect.appendChild(yearOption);
        
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= currentYear - 100; i--) {
            const option = document.createElement('option');
            option.value = i.toString();
            option.textContent = i.toString();
            yearSelect.appendChild(option);
        }
        
        // Create remember me checkbox
        const rememberContainer = document.createElement('div');
        rememberContainer.className = 'remember-container';
        
        const rememberCheckbox = document.createElement('input');
        rememberCheckbox.type = 'checkbox';
        rememberCheckbox.id = 'remember-verification';
        rememberCheckbox.name = 'remember';
        
        const rememberLabel = document.createElement('label');
        rememberLabel.setAttribute('for', 'remember-verification');
        rememberLabel.textContent = 'Remember my age verification';
        
        rememberContainer.appendChild(rememberCheckbox);
        rememberContainer.appendChild(rememberLabel);
        
        // Create submit button
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.className = 'btn btn-primary';
        submitButton.textContent = 'Continue';
        
        // Create error message container
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-message';
        errorContainer.style.display = 'none';
        
        // Add elements to the form
        dateContainer.appendChild(dayLabel);
        dateContainer.appendChild(daySelect);
        dateContainer.appendChild(monthLabel);
        dateContainer.appendChild(monthSelect);
        dateContainer.appendChild(yearLabel);
        dateContainer.appendChild(yearSelect);
        
        form.appendChild(dateContainer);
        form.appendChild(rememberContainer);
        form.appendChild(errorContainer);
        form.appendChild(submitButton);
        
        // Add form submission event
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const day = daySelect.value;
            const month = monthSelect.value;
            const year = yearSelect.value;
            const remember = rememberCheckbox.checked;
            
            if (!day || !month || !year) {
                errorContainer.textContent = 'Please select your complete date of birth.';
                errorContainer.style.display = 'block';
                return;
            }
            
            if (checkAge(year, month, day)) {
                setAgeVerified(remember);
                // Close the modal
                document.body.removeChild(modal);
                // Enable content
                enableMatureContent();
            } else {
                errorContainer.textContent = 'Sorry, you must be at least 18 years old to view this content.';
                errorContainer.style.display = 'block';
            }
        });
        
        // Add elements to modal content
        modalContent.appendChild(title);
        modalContent.appendChild(description);
        modalContent.appendChild(form);
        
        // Add content to modal
        modal.appendChild(modalContent);
        
        return modal;
    };
    
    // Show age verification modal
    const showAgeGate = () => {
        const modal = createAgeGateModal();
        document.body.appendChild(modal);
        
        // Focus the first input for accessibility
        setTimeout(() => {
            const firstInput = modal.querySelector('select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    };
    
    // Apply blur to mature content
    const blurMatureContent = () => {
        const matureElements = document.querySelectorAll('.mature-content');
        matureElements.forEach(element => {
            element.classList.add('content-blurred');
            
            // Add warning overlay
            if (!element.querySelector('.mature-warning')) {
                const warning = document.createElement('div');
                warning.className = 'mature-warning';
                warning.innerHTML = '<i class="icon-warning"></i><span>Mature Content</span>';
                
                const viewButton = document.createElement('button');
                viewButton.className = 'btn btn-small';
                viewButton.textContent = 'View Content';
                viewButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (isAgeVerified()) {
                        // If already verified, show content
                        element.classList.remove('content-blurred');
                        element.removeChild(warning);
                    } else {
                        // Otherwise show age gate
                        showAgeGate();
                    }
                });
                
                warning.appendChild(viewButton);
                element.appendChild(warning);
            }
        });
    };
    
    // Enable mature content by removing blurs
    const enableMatureContent = () => {
        const matureElements = document.querySelectorAll('.mature-content');
        matureElements.forEach(element => {
            element.classList.remove('content-blurred');
            
            const warning = element.querySelector('.mature-warning');
            if (warning) {
                element.removeChild(warning);
            }
        });
    };
    
    // Check for mature content on page load
    const checkContentOnLoad = () => {
        if (isAgeVerified()) {
            enableMatureContent();
        } else {
            blurMatureContent();
            
            // Check if page requires immediate age verification
            const requiresVerification = document.querySelector('.requires-age-verification');
            if (requiresVerification) {
                showAgeGate();
            }
        }
    };
    
    // Initialize age verification system
    const init = () => {
        // Check for stored verification
        if (sessionStorage.getItem(STORAGE_KEY) === 'verified' || 
            localStorage.getItem(STORAGE_KEY) === 'verified') {
            enableMatureContent();
        } else {
            checkContentOnLoad();
        }
        
        // Add event listener for toggling mature content preferences
        const contentPreferences = document.querySelector('#mature-content-preferences');
        if (contentPreferences) {
            contentPreferences.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Enable mature content display
                    if (isAgeVerified()) {
                        enableMatureContent();
                    } else {
                        showAgeGate();
                    }
                } else {
                    // Disable and blur mature content
                    blurMatureContent();
                }
            });
        }
    };
    
    // Public API
    return {
        init,
        isAgeVerified,
        showAgeGate,
        enableMatureContent,
        blurMatureContent
    };
})();

// Initialize age verification system on page load
document.addEventListener('DOMContentLoaded', AgeVerificationSystem.init);

export default AgeVerificationSystem;