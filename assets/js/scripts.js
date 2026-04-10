document.addEventListener('DOMContentLoaded', () => {
    
    // --- Global: Theme Toggler ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    
    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            if (document.body.getAttribute('data-theme') === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // --- Global: Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
        });
    }

    // --- Shared: Show in-page status banner ---
    function showStatus(statusDiv, type, message) {
        const icon = type === 'success' ? 'check_circle' : 'error';
        
        // Clear previous content
        statusDiv.innerHTML = '';
        
        // Create banner container
        const banner = document.createElement('div');
        banner.className = `form-status-banner form-status-${type}`;
        
        // Create icon using Material Symbols
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined form-status-icon';
        iconSpan.textContent = icon;
        
        // Create message text
        const msgText = document.createElement('p');
        msgText.className = 'form-status-msg';
        msgText.textContent = message;
        
        // Assemble and show
        banner.appendChild(iconSpan);
        banner.appendChild(msgText);
        statusDiv.appendChild(banner);
        
        statusDiv.style.display = 'block';
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // --- Web3Forms Config ---
    const WEB3FORMS_URL = 'https://api.web3forms.com/submit';
    const WEB3FORMS_KEY = '6659b1f0-e76f-4d59-b717-0de9e04361ff';

    // --- Shared: Submit form data to Web3Forms ---
    async function submitToWeb3Forms(formData, subject) {
        const payload = {
            access_key: WEB3FORMS_KEY,
            subject: subject || 'Website form submission',
            ...formData
        };

        const response = await fetch(WEB3FORMS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Submission failed');
        }

        return data;
    }

    // --- Page Specific: Register Form ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById('register-status');

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            if (statusDiv) statusDiv.style.display = 'none';

            const formData = new FormData(registerForm);
            const object = Object.fromEntries(formData.entries());
            
            try {
                await submitToWeb3Forms(object, 'New Worker Registration — BK Contractors');
                registerForm.reset();
                registerForm.style.display = 'none';
                if (statusDiv) showStatus(statusDiv, 'success', 'Your credentials have been submitted! Our team will review your profile and reach out shortly.');
            } catch (error) {
                if (statusDiv) showStatus(statusDiv, 'error', `Something went wrong: ${error.message}. Please try again.`);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Credentials';
            }
        });
    }

    // --- Page Specific: Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const statusDiv = document.getElementById('contact-status');

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            if (statusDiv) statusDiv.style.display = 'none';

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData.entries());

            try {
                await submitToWeb3Forms(object, 'New Contact Enquiry — BK Contractors');
                contactForm.reset();
                contactForm.style.display = 'none';
                if (statusDiv) showStatus(statusDiv, 'success', "Your enquiry has been received. We'll be in touch within one business day.");
            } catch (error) {
                if (statusDiv) showStatus(statusDiv, 'error', `Something went wrong: ${error.message}. Please try again.`);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Request';
            }
        });
    }

});
