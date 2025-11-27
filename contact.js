// ===== Contact Form Validation =====
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.handleSubmit();
            }
        });

        // Real-time validation
        this.form.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], textarea[required]');
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;

        // Remove any existing validation styles
        field.classList.remove('is-invalid', 'is-valid');

        // Check if required field is empty
        if (field.hasAttribute('required') && !value) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            // Field-specific validation
            switch (field.type) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    }
                    break;
                case 'tel':
                    if (!this.isValidPhone(value)) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    }
                    break;
                case 'text':
                    if (field.id === 'name' && !this.isValidName(value)) {
                        field.classList.add('is-invalid');
                        isValid = false;
                    }
                    break;
            }
        }

        // Add valid class if field is valid and not empty
        if (isValid && value) {
            field.classList.add('is-valid');
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        // Basic phone validation - allows various formats
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        return phoneRegex.test(cleaned);
    }

    isValidName(name) {
        // Name should have at least 2 characters and only letters/spaces
        return name.length >= 2 && /^[a-zA-Z\s]+$/.test(name);
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // In a real application, you would send data to a server here
            console.log('Form submitted:', data);
            
            // Show success message
            this.showSuccessMessage();
            
            // Reset form
            this.form.reset();
            this.form.classList.remove('was-validated');
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showSuccessMessage() {
        // Create and show success alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            <strong>Success!</strong> Your message has been sent. We'll get back to you soon!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        this.form.parentNode.insertBefore(alertDiv, this.form);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize contact form
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('contactForm')) {
        new ContactForm();
    }
});