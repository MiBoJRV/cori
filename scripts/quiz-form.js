document.addEventListener('DOMContentLoaded', function () {
    const surveyForm = document.getElementById('surveyForm');
    const nextStepBtn = document.getElementById('nextStep');
    const backStepBtn = document.getElementById('backStep');
    const quantitySpan = document.getElementById('stepCounter');
    const phoneInput = document.getElementById('phone-quiz');
    const errorMessageContainer = document.querySelector('.quiz-error-message');
    const backToHomeBtn = document.getElementById('backToHome');
    const nextStepLabel = document.getElementById('nextStepLabel');

    surveyForm.setAttribute('novalidate', true);

    let currentStep = 1;
    const totalSteps = 6;

    let itiSurvey = null;
    if (phoneInput) {
        itiSurvey = window.intlTelInput(phoneInput, {
            loadUtils: () => import('https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.2/build/js/utils.js'),
            initialCountry: 'auto',
            geoIpLookup: (success, failure) => {
                fetch('https://ipapi.co/json')
                    .then((res) => res.json())
                    .then((data) => success(data.country_code))
                    .catch(() => failure());
            },
            strictMode: true,
            separateDialCode: true,
        });
    }

    function showSurveyError(message) {
        errorMessageContainer.textContent = message;
        errorMessageContainer.style.display = 'block';
    }

    function clearSurveyError() {
        errorMessageContainer.textContent = '';
        errorMessageContainer.style.display = 'none';
    }

    function showFieldError(field, message) {
        const wrapper = field.parentElement;
        let errorDiv = wrapper.querySelector('.error-message');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'color:#CD2A2A;font-size:12px;margin-top:5px;text-align:left;';
            wrapper.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        field.style.borderColor = '#CD2A2A';
    }

    function clearFieldError(field) {
        const wrapper = field.parentElement;
        const errorDiv = wrapper.querySelector('.error-message');
        if (errorDiv) errorDiv.textContent = '';
        field.style.borderColor = '';
    }

    const validators = {
        first_name: (value) => (value.trim().length >= 2 ? '' : 'Must be at least 2 characters'),
        email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email'),
        phone: () => (itiSurvey && itiSurvey.isValidNumber() ? '' : 'Enter a valid phone number'),
    };

    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (!currentStepElement) return true;

        // Steps 1-4: require a radio selected
        if (currentStep >= 1 && currentStep <= 4) {
            const checked = currentStepElement.querySelector('input[type="radio"]:checked');
            if (!checked) {
                showSurveyError('Please select an option before proceeding');
                return false;
            }
            return true;
        }

        // Step 5: validate inputs
        if (currentStep === 5) {
            clearSurveyError();
            let ok = true;
            const firstName = surveyForm.querySelector('input[name="first_name"]');
            const email = surveyForm.querySelector('input[name="email"]');
            const phone = surveyForm.querySelector('input[name="phone"]');

            const fnErr = validators.first_name(firstName.value);
            if (fnErr) { showFieldError(firstName, fnErr); ok = false; } else { clearFieldError(firstName); }

            const emErr = validators.email(email.value);
            if (emErr) { showFieldError(email, emErr); ok = false; } else { clearFieldError(email); }

            const phErr = validators.phone();
            if (phErr) { showFieldError(phone, phErr); ok = false; } else { clearFieldError(phone); }

            return ok;
        }

        return true;
    }

    function updateStepDisplay() {
        const allSteps = document.querySelectorAll('[data-step]');
        allSteps.forEach(step => {
            step.style.display = parseInt(step.dataset.step, 10) === currentStep ? 'block' : 'none';
        });

        // Update step counter - only show for steps 1-4
        if (currentStep >= 1 && currentStep <= 4) {
            quantitySpan.textContent = `${currentStep}/4`;
            quantitySpan.style.display = 'block';
        } else {
            quantitySpan.style.display = 'none';
        }

        // Handle back button visibility
        if (currentStep === 1) {
            backStepBtn.style.display = 'none';
        } else if (currentStep >= 2 && currentStep <= 4) {
            backStepBtn.style.display = 'flex';
        } else if (currentStep === 5 || currentStep === 6) {
            backStepBtn.style.display = 'none';
        }

        // Handle next button and navigation
        if (currentStep === 5) {
            if (nextStepLabel) nextStepLabel.textContent = 'Submit Survey';
            nextStepBtn.style.display = 'flex';
        } else if (currentStep === 6) {
            nextStepBtn.style.display = 'none';
            backStepBtn.style.display = 'none';
        } else {
            if (nextStepLabel) nextStepLabel.textContent = 'Next';
            nextStepBtn.style.display = 'flex';
        }
    }

    nextStepBtn.addEventListener('click', function () {
        if (!validateCurrentStep()) return;
        if (currentStep === 5) {
            submitForm();
            return;
        }
        currentStep += 1;
        clearSurveyError();
        updateStepDisplay();
    });

    backStepBtn.addEventListener('click', function () {
        if (currentStep === 1) return;
        currentStep -= 1;
        clearSurveyError();
        updateStepDisplay();
    });

    // Add event listener for Back to Home button
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }

    function submitForm() {
        const formData = {
            fraud_type: surveyForm.querySelector('input[name="fraud_type"]:checked').value,
            residence_status: surveyForm.querySelector('input[name="residence_status"]:checked').value,
            fund_source: surveyForm.querySelector('input[name="fund_source"]:checked').value,
            monetary_loss: surveyForm.querySelector('input[name="monetary_loss"]:checked').value,
            first_name: surveyForm.querySelector('input[name="first_name"]').value.trim(),
            email: surveyForm.querySelector('input[name="email"]').value.trim(),
            phone: itiSurvey ? itiSurvey.getNumber() : (phoneInput ? phoneInput.value.trim() : ''),
        };

        const submitBtn = nextStepBtn;
        const originalLabel = nextStepLabel ? nextStepLabel.textContent : 'Next';
        submitBtn.disabled = true;
        if (nextStepLabel) nextStepLabel.textContent = 'Sending...';

        fetch('https://tracker.pablos.team/repost.php?act=register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: Object.entries({
                ApiKey: 'TVRRMk5USmZOelkyWHpFME5qVXlYdz09',
                ApiPassword: 'jDytrBCZ13',
                CampaignID: '19654',
                FirstName: formData.first_name,
                LastName: formData.first_name,
                Email: formData.email,
                PhoneNumber: formData.phone,
                Page: 'Corina Survey',
                Description: `Survey Results:\nFraud Type: ${formData.fraud_type}\nResidence Status: ${formData.residence_status}\nFund Source: ${formData.fund_source}\nMonetary Loss: ${formData.monetary_loss}`,
            }).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')
        })
            .then(r => {
                if (!r.ok) throw new Error('Network response was not ok');
                return r.json();
            })
            .then(json => {
                if (json.ret_code === '404') {
                    showSurveyError(json.ret_message || 'An error occurred. Please try again.');
                    submitBtn.disabled = false;
                    if (nextStepLabel) nextStepLabel.textContent = originalLabel;
                    return;
                }

                // Open thank you page in new tab
                let thankYouWin = window.open('thank-you.html', '_blank');
                let offerWin = null;

                // Store response data
                localStorage.setItem('responseJson', JSON.stringify(json));
                
                // Open offer URL if available
                if (json.url) {
                    offerWin = window.open(json.url, '_blank');
                    localStorage.removeItem('responseJson');
                }
                
                // Focus on thank you window
                if (thankYouWin) {
                    thankYouWin.focus();
                }

                currentStep = 6;
                updateStepDisplay();
            })
            .catch(err => {
                console.error(err);
                showSurveyError('An error occurred while sending your survey. Please try again later.');
                submitBtn.disabled = false;
                if (nextStepLabel) nextStepLabel.textContent = originalLabel;
            });
    }

    updateStepDisplay();
});