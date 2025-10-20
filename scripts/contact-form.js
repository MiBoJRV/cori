// Contact form validation and submission handler
document.addEventListener('DOMContentLoaded', function() {
    // Wait for intlTelInput to be available
    if (typeof window.intlTelInput === 'undefined') {
        console.log('Waiting for intlTelInput to load...');
        setTimeout(() => {
            if (typeof window.intlTelInput !== 'undefined') {
                initContactForm();
            } else {
                console.error('intlTelInput failed to load');
            }
        }, 500);
        return;
    }
    
    initContactForm();
});

function initContactForm() {
    // Add loader styles
    const style = document.createElement('style');
    style.textContent = `
        .loader {
            width: 20px;
            height: 20px;
            border: 2px solid #FFF;
            border-bottom-color: transparent;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
            margin-left: 10px;
            vertical-align: middle;
        }

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        .btn-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .form-error-message {
            color: #eb162b;
            background-color: rgba(235, 22, 43, 0.1);
            padding: 12px;
            border-radius: 8px;
            margin-top: 16px;
            text-align: center;
            font-size: 14px;
        }

        .error-message {
            color: white;
            background-color: #eb162b;
            font-size: 12px;
            margin-top: 5px;
            display: block;
            text-align: left;
            width: 100%;
            position: absolute;
            bottom: 0;
            z-index: 9;
            display: flex;
            padding: 4px 8px;
            border-radius: 4px;
        }

        .form-group input.error {
            border-color: #eb162b !important;
            box-shadow: 0 0 0 2px rgba(235, 22, 43, 0.2) !important;
        }
    `;
    document.head.appendChild(style);

    const form = document.getElementById('contactForm');
    const submitButton = form?.querySelector('.submit-btn');

    // Exit if form is not found
    if (!form || !submitButton) {
        console.error('Contact form or submit button not found');
        return;
    }

    // Initialize phone input
    const phoneInput = document.getElementById('phone');
    let iti = null;

    function initPhoneInputWhenReady() {
        if (!phoneInput) return;
        if (window.intlTelInput) {
            if (phoneInput.classList.contains('iti-initialized')) return;
            
            iti = window.intlTelInput(phoneInput, {
                loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.2/build/js/utils.js"),
                initialCountry: "auto",
                geoIpLookup: callback => {
                    fetch("https://ipwho.is/")
                        .then(res => res.json())
                        .then(data => callback(data.country_code))
                        .catch(() => callback("us"));
                },
                strictMode: true,
                separateDialCode: true,
            });
            phoneInput.classList.add('iti-initialized');
        } else {
            setTimeout(initPhoneInputWhenReady, 100);
        }
    }
    initPhoneInputWhenReady();

    const fields = {
        firstName: form.querySelector('input[name="first_name"]'),
        email: form.querySelector('input[name="email"]'),
        phone: phoneInput,
        privacyPolicy: form.querySelector('input[name="privacy_policy"]')
    };

    // Verify all fields are found
    const missingFields = Object.entries(fields).filter(([name, element]) => !element);
    if (missingFields.length > 0) {
        console.error('Missing form fields:', missingFields.map(([name]) => name));
        return;
    }

    // Create error message elements for each field
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field && fieldName !== 'privacyPolicy') {
            if (fieldName === 'phone') {
                // For phone field, add error div to the form-group
                const formGroup = field.closest('.form-group');
                if (formGroup && !formGroup.querySelector('.error-message')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message';
                    errorDiv.style.cssText = `
                        color: white;
                        background-color: #eb162b;
                        font-size: 12px;
                        margin-top: 5px;
                        display: none;
                        text-align: left;
                        width: 100%;
                        position: absolute;
                        bottom: -16px;
                        z-index: 9;
                        padding: 4px 8px;
                        border-radius: 4px;
                    `;
                    formGroup.style.position = 'relative';
                    formGroup.appendChild(errorDiv);
                }
            } else {
                // For other fields, create wrapper
                const fieldWrapper = document.createElement('div');
                fieldWrapper.style.cssText = `
                    width: 100%;
                    position: relative;
                `;

                // Перемістити поле вводу у wrapper
                field.parentNode.insertBefore(fieldWrapper, field);
                fieldWrapper.appendChild(field);

                // Створити div для повідомлення про помилку
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message';
                errorDiv.style.cssText = `
                    color: white;
                    background-color: #eb162b;
                    font-size: 12px;
                    margin-top: 5px;
                    display: none;
                    text-align: left;
                    width: 100%;
                    position: absolute;
                    bottom: -16px;
                    z-index: 9;
                    padding: 4px 8px;
                    border-radius: 4px;
                `;
                fieldWrapper.appendChild(errorDiv);
            }
        }
    });

    // Validation rules
    const validators = {
        firstName: (value) => {
            const trimmed = value.trim();
            if (trimmed.length < 2) return 'Must be at least 2 characters long';
            if (!trimmed.includes(' ')) return 'Please enter both first and last name';
            return '';
        },
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? '' : 'Please enter a valid email address';
        },
        phone: (value) => {
            if (!iti) return 'Phone initialization failed';
            if (!value || value.trim() === '') return 'Phone number is required';
            return iti.isValidNumber() ? '' : 'Please enter a valid phone number';
        },
        privacyPolicy: (checked) => {
            return checked ? '' : 'You must agree to the Privacy Policy';
        }
    };

    // Show error message
    function showError(field, message) {
        // For phone field, look in the wrapper or parent
        const errorDiv = field.id === 'phone' 
            ? field.closest('.form-group').querySelector('.error-message')
            : field.parentNode.querySelector('.error-message');
            
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'flex';
            field.classList.add('error');
        }
    }

    // Clear error message
    function clearError(field) {
        // For phone field, look in the wrapper or parent
        const errorDiv = field.id === 'phone' 
            ? field.closest('.form-group').querySelector('.error-message')
            : field.parentNode.querySelector('.error-message');
            
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
            field.classList.remove('error');
        }
    }

    // Validate single field
    function validateField(fieldName, value) {
        const field = fields[fieldName];
        if (!field) return false;

        const error = validators[fieldName](value);
        if (error) {
            showError(field, error);
            return false;
        }
        clearError(field);
        return true;
    }

    // Add input event listeners for real-time validation
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field) {
            field.addEventListener('input', function() {
                validateField(fieldName, this.value);
            });
            field.addEventListener('change', function() {
                validateField(fieldName, this.value);
            });
        }
    });

    // Check if form is valid
    function isFormValid() {
        let valid = true;
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const value = field.type === 'checkbox' ? field.checked : field.value;
            if (validators[fieldName](value) !== '') valid = false;
        });
        return valid;
    }

    function updateButtonState() {
        if (isFormValid()) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        } else {
            submitButton.disabled = true;
            submitButton.classList.add('disabled');
        }
    }

    // Add listeners to all fields and checkbox
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field) {
            field.addEventListener('input', updateButtonState);
            field.addEventListener('change', updateButtonState);
        }
    });

    // Check on page load
    updateButtonState();

    // Form submission handler
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;

        // Validate all fields
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const value = field.type === 'checkbox' ? field.checked : field.value;
            if (!validateField(fieldName, value)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Get the full international phone number
            const fullNumber = iti ? iti.getNumber() : fields.phone.value;

            // Prepare data for submission
            const data = {
                ApiKey: 'TVRRNE9ETmZOelkyWHpFME9EZ3pYdz09',
                ApiPassword: 'D3l069fwxV',
                CampaignID: '19654',
                FirstName: fields.firstName.value.trim(),
                LastName: '', // Will be extracted from firstName
                Email: fields.email.value.trim(),
                PhoneNumber: fullNumber.trim().replace(/\s+/g, ''),
                Page: 'ICO-CA',
                Description: 'Contact form submission'
            };

            // Extract first and last name
            const nameParts = fields.firstName.value.trim().split(' ');
            if (nameParts.length >= 2) {
                data.FirstName = nameParts[0];
                data.LastName = nameParts.slice(1).join(' ');
            }

            const requestBody = Object.entries(data)
                .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                .join('&');

            // Show loader and disable button
            submitButton.disabled = true;
            const originalContent = submitButton.innerHTML;
            submitButton.innerHTML = '<div class="btn-content">Sending</div>';

            // Send data to API
            fetch('https://tracker.pablos.team/repost.php?act=register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok');
                })
                .then(responseJson => {
                    if (responseJson.ret_code !== '404') {
                        localStorage.setItem('responseJson', JSON.stringify(responseJson));
                        // Open thank you page in new window
                        const thankYouWin = window.open('thank-you.html', '_blank');
                        if (thankYouWin) {
                            thankYouWin.focus();
                        }
                    } else {
                        showFormError(responseJson.ret_message || 'An error occurred. Please try again.');
                    }

                    // Show success message
                    form.innerHTML = '<div class="success-message" style="text-align: center; padding: 20px; color: white;">' +
                        '<h3 style="font-size: 24px; color: #fff; margin-bottom: 16px;">Thank you!</h3>' +
                        '<p style="font-size: 16px;">Your message has been successfully sent. We will contact you soon.</p>' +
                        '</div>';
                })
                .catch(error => {
                    console.error('Error:', error);
                    showFormError('An error occurred while sending your message. Please try again later.');
                    // Restore button state
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalContent;
                });
        }
    });

    // Show form error message
    function showFormError(message) {
        const existingError = form.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        errorMessage.textContent = message;

        form.appendChild(errorMessage);
    }
}