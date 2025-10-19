document.addEventListener('DOMContentLoaded', function () {
    const surveyForm = document.getElementById('surveyForm');
    const nextStepBtn = document.getElementById('nextStep');
    const backStepBtn = document.getElementById('backStep');
    const quantitySpan = document.querySelector('.step-counter');
    const phoneInput = surveyForm.querySelector('input[name="phone"]');
    const errorMessageContainer = surveyForm.querySelector('.quiz-error-message');

    // Disable HTML5 validation
    surveyForm.setAttribute('novalidate', true);

    let currentStep = 1;
    const totalSteps = 6;

    // Initialize phone input
    let itiSurvey = null;
    if (phoneInput) {
        itiSurvey = window.intlTelInput(phoneInput, {
            loadUtils: () => import("https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.2/build/js/utils.js"),
            initialCountry: "auto",
            geoIpLookup: (success, failure) => {
                fetch("https://ipapi.co/json")
                    .then((res) => res.json())
                    .then((data) => success(data.country_code))
                    .catch(() => failure());
            },
            strictMode: true,
            separateDialCode: true,
        });

        setTimeout(() => {
            const countryDropdownDivs = document.querySelectorAll('.phone-group .iti__country-container .iti__dropdown-content > div');
            countryDropdownDivs.forEach(div => {
                div.style.marginBottom = '10px';
            });
        }, 100);
    }

    // Create error message elements for contact form fields
    const contactFormFields = surveyForm.querySelectorAll('.contact-form input');
    contactFormFields.forEach(field => {
        const fieldWrapper = document.createElement('div');
        fieldWrapper.style.cssText = `
            margin-bottom: 20px;
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
            color: #CD2A2A;
            font-size: 12px;
            margin-top: 5px;
            display: none;
            text-align: left;
            width: 100%;
        `;
        fieldWrapper.appendChild(errorDiv);
    });

    // Add radio button change handlers
    const radioButtons = surveyForm.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', () => {
            const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
            const checkedInputs = currentStepElement.querySelectorAll('input:checked');
            if (checkedInputs.length > 0) {
                clearSurveyError();
            }
        });
    });

    // Validation rules
    const validators = {
        first_name: (value) => {
            return value.length >= 2 ? '' : 'Must be at least 2 characters long';
        },
        email: (value) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(value) ? '' : 'Please enter a valid email address';
        },
        phone: (value) => {
            if (!itiSurvey) return 'Phone initialization failed';
            return itiSurvey.isValidNumber() ? '' : 'Please enter a valid phone number';
        }
    };

    // Show error message
    function showError(field, message) {
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            field.style.borderColor = '#CD2A2A';
        }
    }

    // Clear error message
    function clearError(field) {
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
            field.style.borderColor = '';
        }
    }

    // Show survey error message
    function showSurveyError(message) {
        errorMessageContainer.textContent = message;
        errorMessageContainer.style.display = 'block';
    }

    // Clear survey error message
    function clearSurveyError() {
        errorMessageContainer.textContent = '';
        errorMessageContainer.style.display = 'none';
    }

    // Show form error message
    function showFormError(message) {
        const existingError = surveyForm.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorMessage = document.createElement('div');
        errorMessage.style.cssText = 'color: #000; text-align: center; padding: 10px; margin-top: 10px; background: rgba(255, 35, 20, 0.1); border-radius: 5px;';
        errorMessage.textContent = message;
        errorMessage.className = 'form-error-message';

        surveyForm.appendChild(errorMessage);
    }

    // Clear form error message
    function clearFormError() {
        const existingError = surveyForm.querySelector('.form-error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // Validate single field
    function validateField(field) {
        const value = field.value.trim();
        const validator = validators[field.name];

        if (validator) {
            const error = validator(value);
            if (error) {
                showError(field, error);
                return false;
            }
            clearError(field);
            return true;
        }

        // For radio buttons
        if (field.type === 'radio') {
            const name = field.name;
            const checked = surveyForm.querySelector(`input[name="${name}"]:checked`);
            if (!checked) {
                const fieldset = field.closest('fieldset');
                if (fieldset) {
                    showError(fieldset, 'Please select an option');
                }
                return false;
            }
            const fieldset = field.closest('fieldset');
            if (fieldset) {
                clearError(fieldset);
            }
        }

        return true;
    }

    // Add input event listeners for real-time validation
    contactFormFields.forEach(field => {
        field.addEventListener('input', function () {
            validateField(this);
        });
    });

    // Update step display
    function updateStepDisplay() {
        const allSteps = document.querySelectorAll('[data-step]');
        const quizHeader = document.querySelector('.quiz-header');

        allSteps.forEach(step => {
            if (parseInt(step.dataset.step) === currentStep) {
                step.style.display = 'block';
            } else {
                step.style.display = 'none';
            }
        });

        // Hide quiz header on step 6 (thank you)
        if (quizHeader) {
            if (currentStep === 6) {
                quizHeader.style.display = 'none';
            } else {
                quizHeader.style.display = 'block';
            }
        }

        quantitySpan.textContent = `${currentStep}/${totalSteps}`;

        // Update button visibility
        if (currentStep === 1) {
            backStepBtn.style.display = 'none';
        } else {
            backStepBtn.style.display = 'flex';
        }

        if (currentStep === 5) {
            nextStepBtn.textContent = 'Submit Survey';
        } else if (currentStep === 6) {
            nextStepBtn.style.display = 'none';
            backStepBtn.style.display = 'none';
        } else {
            nextStepBtn.textContent = 'Next';
            nextStepBtn.style.display = 'flex';
        }
    }

    // Validate current step
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (!currentStepElement) return true;

        let isValid = true;

        // Для кроків з радіо-кнопками (1-4)
        if (currentStep < 5) {
            const checkedInputs = currentStepElement.querySelectorAll('input:checked');
            if (!checkedInputs.length) {
                showSurveyError('Please select an option before proceeding');
                return false;
            }
        } else if (currentStep === 5) {
            // Для 5-го кроку з текстовими полями
            const inputs = currentStepElement.querySelectorAll('input[required]');
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
        }
        // 6-й крок (thank you) не потребує валідації

        return isValid;
    }

    // Next step button handler
    nextStepBtn.addEventListener('click', function () {
        if (validateCurrentStep()) {
            if (currentStep === 5) {
                // Submit form
                submitForm();
            } else {
                currentStep++;
                updateStepDisplay();
                clearSurveyError();
                clearFormError();
            }
        }
    });

    // Back step button handler
    backStepBtn.addEventListener('click', function () {
        if (currentStep > 1) {
            currentStep--;
            updateStepDisplay();
            clearSurveyError();
            clearFormError();
        }
    });

    // Form submission function
    function submitForm() {
        // Clear old error messages before validation
        clearFormError();
        clearSurveyError();

        if (!validateCurrentStep()) {
            return;
        }

        const emailField = surveyForm.querySelector('input[name="email"]');
        const firstNameField = surveyForm.querySelector('input[name="first_name"]');

        const formData = {
            fraud_type: surveyForm.querySelector('input[name="fraud_type"]:checked').value,
            residence_status: surveyForm.querySelector('input[name="residence_status"]:checked').value,
            fund_source: surveyForm.querySelector('input[name="fund_source"]:checked').value,
            monetary_loss: surveyForm.querySelector('input[name="monetary_loss"]:checked').value,
            first_name: firstNameField.value.trim(),
            email: emailField.value.trim(),
            phone: itiSurvey ? itiSurvey.getNumber() : phoneInput.value.trim()
        };

        let thankYouWin = window.open('thank-you.html', '_blank');
        let offerWin = null;

        const data = {
            ApiKey: 'TVRRNE9ETmZOelkyWHpFME9EZ3pYdz09',
            ApiPassword: 'D3l069fwxV',
            CampaignID: '19654',
            FirstName: formData.first_name,
            LastName: formData.first_name, // Using first_name for both since we only have one name field
            Email: formData.email,
            PhoneNumber: formData.phone,
            Page: 'Corina Survey',
            Description: `Survey Results:\nFraud Type: ${formData.fraud_type}\nResidence Status: ${formData.residence_status}\nFund Source: ${formData.fund_source}\nMonetary Loss: ${formData.monetary_loss}`
        };

        const submitBtn = nextStepBtn;
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';

        fetch('https://tracker.pablos.team/repost.php?act=register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: Object.entries(data)
                .map(([key, value]) => `${key}=${value}`)
                .join('&')
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(responseJson => {
                if (responseJson.ret_code === '404') {
                    showFormError(responseJson.ret_message || 'An error occurred. Please try again.');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    return;
                }

                if (responseJson.ret_code !== '404') {
                    localStorage.setItem('responseJson', JSON.stringify(responseJson));
                    if (responseJson.url) {
                        offerWin = window.open(responseJson.url, '_blank');
                        localStorage.removeItem('responseJson');
                    }
                    if (thankYouWin) {
                        thankYouWin.focus();
                    }
                    currentStep = 6;
                    updateStepDisplay();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFormError('An error occurred while sending your survey. Please try again later.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            });
    }

    // Form submission handler (for direct form submission)
    surveyForm.addEventListener('submit', function (event) {
        event.preventDefault();
        submitForm();
    });

    // Initialize first step
    updateStepDisplay();
});
