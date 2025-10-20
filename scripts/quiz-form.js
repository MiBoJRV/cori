document.addEventListener('DOMContentLoaded', function () {
    const surveyForm = document.getElementById('surveyForm');
    const nextStepBtn = document.getElementById('nextStep');
    const backStepBtn = document.getElementById('backStep');
    const quantitySpan = document.getElementById('stepCounter');
    const phoneInput = document.getElementById('phone-quiz');
    const errorMessageContainer = document.querySelector('.quiz-error-message');
    const backToHomeBtn = document.getElementById('backToHome');
    const nextStepLabel = document.getElementById('nextStepLabel');
    const nextStepIcon = nextStepBtn ? nextStepBtn.querySelector('svg') : null;
    const quizNav = document.querySelector('.quiz-navigation');

    surveyForm.setAttribute('novalidate', true);

    let currentStep = 1;
    const totalSteps = 6;

    let itiSurvey = null;
    if (phoneInput) {
        itiSurvey = window.intlTelInput(phoneInput, {
            loadUtils: () => import('https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.2/build/js/utils.js'),
            initialCountry: 'auto',
            geoIpLookup: callback => {
                fetch("https://ipwho.is/")
                    .then(res => res.json())
                    .then(data => callback(data.country_code))
                    .catch(() => callback("us"));
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
            wrapper.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        field.classList.add('error');
    }

    function clearFieldError(field) {
        const wrapper = field.parentElement;
        const errorDiv = wrapper.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        field.classList.remove('error');
    }

    const validators = {
        first_name: (value) => {
            const trimmed = value.trim();
            if (trimmed.length < 2) return 'Must be at least 2 characters long';
            if (!trimmed.includes(' ')) return 'Please enter both first and last name';
            return '';
        },
        email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Please enter a valid email address'),
        phone: () => {
            if (!itiSurvey) return 'Phone initialization failed';
            if (!phoneInput || !phoneInput.value.trim()) return 'Phone number is required';
            return itiSurvey.isValidNumber() ? '' : 'Please enter a valid phone number';
        },
        privacy_policy: (checked) => (checked ? '' : 'You must agree to the Privacy Policy'),
    };

    function isStep5Valid() {
        const firstName = surveyForm.querySelector('input[name="first_name"]');
        const email = surveyForm.querySelector('input[name="email"]');
        const phone = surveyForm.querySelector('input[name="phone"]');
        const privacy = surveyForm.querySelector('input[name="privacy_policy"]');
        if (!firstName || !email || !phone || !privacy) return false;
        const fnErr = validators.first_name(firstName.value);
        const emErr = validators.email(email.value);
        const phErr = validators.phone();
        const ppErr = validators.privacy_policy(privacy.checked);
        return !fnErr && !emErr && !phErr && !ppErr;
    }

    function updateSubmitState() {
        if (currentStep === 5) {
            const isValid = isStep5Valid();
            nextStepBtn.disabled = !isValid;
            return;
        }
        nextStepBtn.disabled = false;
    }

    function validateCurrentStep() {
        const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
        if (!currentStepElement) return true;

        if (currentStep >= 1 && currentStep <= 4) {
            const checked = currentStepElement.querySelector('input[type="radio"]:checked');
            if (!checked) {
                showSurveyError('Please select an option before proceeding');
                return false;
            }
            return true;
        }

        if (currentStep === 5) {
            clearSurveyError();
            let ok = true;
            const firstName = surveyForm.querySelector('input[name="first_name"]');
            const email = surveyForm.querySelector('input[name="email"]');
            const phone = surveyForm.querySelector('input[name="phone"]');
            const privacy = surveyForm.querySelector('input[name="privacy_policy"]');

            const fnErr = validators.first_name(firstName.value);
            if (fnErr) { showFieldError(firstName, fnErr); ok = false; } else { clearFieldError(firstName); }

            const emErr = validators.email(email.value);
            if (emErr) { showFieldError(email, emErr); ok = false; } else { clearFieldError(email); }

            const phErr = validators.phone();
            if (phErr) { showFieldError(phone, phErr); ok = false; } else { clearFieldError(phone); }

            const ppErr = validators.privacy_policy(privacy.checked);
            if (ppErr) { showSurveyError(ppErr); ok = false; }

            updateSubmitState();
            return ok;
        }

        return true;
    }

    function updateStepDisplay() {
        const allSteps = document.querySelectorAll('[data-step]');
        allSteps.forEach(step => {
            step.style.display = parseInt(step.dataset.step, 10) === currentStep ? 'block' : 'none';
        });

        if (currentStep >= 1 && currentStep <= 4) {
            quantitySpan.textContent = `${currentStep}/4`;
            quantitySpan.style.display = 'block';
        } else {
            quantitySpan.style.display = 'none';
        }

        if (currentStep === 1) {
            backStepBtn.style.display = 'none';
        } else if (currentStep >= 2 && currentStep <= 4) {
            backStepBtn.style.display = 'flex';
        } else if (currentStep === 5 || currentStep === 6) {
            backStepBtn.style.display = 'none';
        }

        if (currentStep === 5) {
            if (nextStepLabel) nextStepLabel.textContent = 'Submit Survey';
            if (nextStepIcon) nextStepIcon.style.display = 'none';
            if (quizNav) quizNav.classList.add('centered');
            nextStepBtn.style.display = 'flex';
            updateSubmitState();
        } else if (currentStep === 6) {
            if (quizNav) quizNav.classList.remove('centered');
            nextStepBtn.style.display = 'none';
            backStepBtn.style.display = 'none';
        } else {
            if (nextStepLabel) nextStepLabel.textContent = 'Next';
            if (nextStepIcon) nextStepIcon.style.display = '';
            if (quizNav) quizNav.classList.remove('centered');
            nextStepBtn.style.display = 'flex';
            nextStepBtn.disabled = false;
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

    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function () {
            window.location.href = 'index.html';
        });
    }

    const firstNameField = surveyForm.querySelector('input[name="first_name"]');
    const emailField = surveyForm.querySelector('input[name="email"]');
    const phoneField = surveyForm.querySelector('input[name="phone"]');
    const privacyField = surveyForm.querySelector('input[name="privacy_policy"]');

    function attachLiveValidation(field, validatorKey) {
        if (!field) return;
        field.addEventListener('input', function () {
            if (currentStep !== 5) return;
            const err = validators[validatorKey](validatorKey === 'privacy_policy' ? field.checked : field.value);
            if (err) {
                if (validatorKey === 'privacy_policy') {
                    showSurveyError(err);
                } else {
                    showFieldError(field, err);
                }
            } else {
                if (validatorKey !== 'privacy_policy') clearFieldError(field);
                clearSurveyError();
            }
            updateSubmitState();
        });
        field.addEventListener('change', function () {
            if (currentStep !== 5) return;
            const err = validators[validatorKey](validatorKey === 'privacy_policy' ? field.checked : field.value);
            if (err) {
                if (validatorKey === 'privacy_policy') {
                    showSurveyError(err);
                } else {
                    showFieldError(field, err);
                }
            } else {
                if (validatorKey !== 'privacy_policy') clearFieldError(field);
                clearSurveyError();
            }
            updateSubmitState();
        });
    }

    attachLiveValidation(firstNameField, 'first_name');
    attachLiveValidation(emailField, 'email');
    attachLiveValidation(phoneField, 'phone');
    attachLiveValidation(privacyField, 'privacy_policy');

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

        const nameParts = formData.first_name.split(' ').filter(Boolean);
        const firstNameOnly = nameParts[0] || '';
        const lastNameOnly = nameParts.slice(1).join(' ');

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
                FirstName: firstNameOnly,
                LastName: lastNameOnly,
                Email: formData.email,
                PhoneNumber: formData.phone,
                Page: 'ICO-CA',
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

                let thankYouWin = window.open('thank-you.html', '_blank');
                let offerWin = null;

                localStorage.setItem('responseJson', JSON.stringify(json));
                
                if (json.url) {
                    offerWin = window.open(json.url, '_blank');
                    localStorage.removeItem('responseJson');
                }
                
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