// ===== Thank You Page Functionality =====
class ThankYouPage {
    constructor() {
        this.orderNumber = this.generateOrderNumber();
        this.deliveryTime = this.calculateDeliveryTime();
        this.init();
    }

    init() {
        this.displayOrderDetails();
        this.setupEventListeners();
        this.startCelebration();
    }

    generateOrderNumber() {
        // Generate a random order number
        return Math.floor(100000 + Math.random() * 900000);
    }

    calculateDeliveryTime() {
        // Calculate delivery time (30-45 minutes from now)
        const now = new Date();
        const deliveryTime = new Date(now.getTime() + (35 + Math.floor(Math.random() * 16)) * 60000);
        
        return deliveryTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    displayOrderDetails() {
        // Display order number and delivery time
        document.querySelector('.text-primary').textContent = `#GB${this.orderNumber}`;
        document.getElementById('delivery-time').textContent = `~${this.deliveryTime}`;
        
        // Try to get order total from localStorage (from cart)
        const lastOrderTotal = localStorage.getItem('lastOrderTotal');
        if (lastOrderTotal) {
            document.getElementById('order-total').textContent = this.formatPrice(parseFloat(lastOrderTotal));
        }
    }

    setupEventListeners() {
        // Social sharing buttons
        document.querySelectorAll('.share-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleSocialShare(e.target.getAttribute('data-platform'));
            });
        });

        // Add some interactive fun
        this.addInteractiveElements();
    }

    handleSocialShare(platform) {
        const message = "I just ordered delicious global cuisine from Global Bites! 🌍🍽️ Can't wait to taste the world!";
        const url = window.location.origin;
        
        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(url)}`,
            instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
        };

        if (platform === 'instagram') {
            alert('Share your Global Bites experience on Instagram! 📷\n\nTag us: @GlobalBites\nUse hashtag: #TasteTheWorld');
        } else {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
        }
    }

    addInteractiveElements() {
        // Make the heart clickable for fun
        const heart = document.querySelector('.heart');
        if (heart) {
            heart.style.cursor = 'pointer';
            heart.addEventListener('click', () => {
                this.createFloatingHearts();
            });
        }
    }

    createFloatingHearts() {
        const container = document.querySelector('.thank-you-animation');
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.textContent = '💖';
            heart.style.position = 'absolute';
            heart.style.fontSize = '1.5rem';
            heart.style.left = '50%';
            heart.style.bottom = '50%';
            heart.style.transform = 'translateX(-50%)';
            heart.style.animation = `floatUp ${1 + Math.random()}s ease-in forwards`;
            heart.style.zIndex = '10';
            
            container.appendChild(heart);
            
            // Remove heart after animation
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 2000);
        }
    }

    startCelebration() {
        // Add some celebration effects
        setTimeout(() => {
            this.createConfetti();
        }, 1000);
    }

    createConfetti() {
        const colors = ['#FF6B35', '#222A68', '#574AE2', '#E8E1EF', '#654597'];
        const confettiContainer = document.querySelector('.thank-you-hero');
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -20px;
                left: ${Math.random() * 100}%;
                animation: fallConfetti ${2 + Math.random() * 3}s linear forwards;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                opacity: ${0.7 + Math.random() * 0.3};
            `;
            
            confettiContainer.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
}

// Add confetti animation to CSS
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes floatUp {
        0% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
    }
    
    @keyframes fallConfetti {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(100vh) rotate(360deg); }
    }
`;
document.head.appendChild(confettiStyle);

// Initialize thank you page
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.thank-you-hero')) {
        new ThankYouPage();
    }
});