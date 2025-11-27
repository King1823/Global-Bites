// ===== Homepage Functionality =====
class Homepage {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupSmoothScrolling();
        this.setupAddToCart();
    }

    setupScrollAnimations() {
        const dishSections = document.querySelectorAll('.featured-dish-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: 0.3,
            rootMargin: '-50px 0px -50px 0px'
        });

        dishSections.forEach(section => observer.observe(section));
    }

    setupSmoothScrolling() {
        // Smooth scroll for hero options
        document.querySelectorAll('.hero-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = option.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    targetSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupAddToCart() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const button = e.target;
                const itemId = button.getAttribute('data-id');
                const itemName = button.getAttribute('data-name');
                const itemPrice = button.getAttribute('data-price');
                
                // Use the global cart from script.js
                if (window.cart) {
                    window.cart.addItem(itemId, itemName, itemPrice, 1);
                    
                    // Visual feedback
                    button.textContent = 'Added!';
                    button.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                    
                    setTimeout(() => {
                        button.textContent = 'Add to Cart';
                        button.style.background = 'linear-gradient(135deg, var(--primary), var(--secondary))';
                    }, 2000);
                }
            }
        });
    }
}

// Initialize homepage
document.addEventListener('DOMContentLoaded', function() {
    new Homepage();
});