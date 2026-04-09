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
        const icon = type === 'success' ? '✓' : '✕';
        statusDiv.innerHTML = `
            <div class="form-status-banner form-status-${type}">
                <span class="form-status-icon">${icon}</span>
                <p class="form-status-msg">${message}</p>
            </div>`;
        statusDiv.style.display = 'block';
        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    registerForm.reset();
                    registerForm.style.display = 'none';
                    if (statusDiv) showStatus(statusDiv, 'success', 'Your credentials have been submitted! Our team will review your profile and reach out shortly.');
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
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
                const response = await fetch('/api/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    if (statusDiv) showStatus(statusDiv, 'success', "Your enquiry has been received. We'll be in touch within one business day.");
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            } catch (error) {
                if (statusDiv) showStatus(statusDiv, 'error', `Something went wrong: ${error.message}. Please try again.`);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Request';
            }
        });
    }

});
