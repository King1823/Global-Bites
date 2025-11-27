// ===== Cart Page Functionality =====
class CartPage {
    constructor() {
        this.cart = window.cart; // Use the global cart instance
        this.init();
    }

    init() {
        this.renderCartItems();
        this.updateOrderSummary();
        this.setupEventListeners();
    }

    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        const emptyMessage = document.getElementById('empty-cart-message');
        
        if (this.cart.items.length === 0) {
            emptyMessage.style.display = 'block';
            container.innerHTML = '';
            container.appendChild(emptyMessage);
            return;
        }

        emptyMessage.style.display = 'none';
        
        const cartItemsHTML = this.cart.items.map(item => this.createCartItemHTML(item)).join('');
        container.innerHTML = cartItemsHTML;
    }

    createCartItemHTML(item) {
        const itemTotal = item.price * item.quantity;
        return `
            <div class="cart-item d-flex align-items-center" data-item-id="${item.id}">
                <div class="cart-item-image me-3">
                    ${this.getItemEmoji(item.name)}
                </div>
                <div class="flex-grow-1">
                    <h6 class="mb-1">${item.name}</h6>
                    <p class="text-muted mb-0">${this.formatPrice(item.price)} each</p>
                </div>
                <div class="quantity-controls me-3">
                    <button class="quantity-btn decrease-quantity" data-item-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99" data-item-id="${item.id}">
                    <button class="quantity-btn increase-quantity" data-item-id="${item.id}">+</button>
                </div>
                <div class="item-total me-3">
                    ${this.formatPrice(itemTotal)}
                </div>
                <button class="remove-btn" data-item-id="${item.id}" title="Remove item">
                    🗑️
                </button>
            </div>
        `;
    }

    getItemEmoji(itemName) {
        const emojiMap = {
            'Pizza': '🍕',
            'Pasta': '🍝',
            'Salad': '🥗',
            'Tacos': '🌮',
            'Burrito': '🫔',
            'Guacamole': '🥑',
            'Chicken': '🍗',
            'Naan': '🫓',
            'Biryani': '🍚',
            'Sushi': '🍣',
            'Ramen': '🍜',
            'Stir Fry': '🥢',
            'Fish': '🐟',
            'Rice': '🍚'
        };

        for (const [key, emoji] of Object.entries(emojiMap)) {
            if (itemName.includes(key)) {
                return emoji;
            }
        }
        return '🍽️';
    }

    updateOrderSummary() {
        const subtotal = this.cart.getTotalPrice();
        const deliveryFee = 3.99;
        const tax = subtotal * 0.08;
        const total = subtotal + deliveryFee + tax;

        document.getElementById('subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('tax').textContent = this.formatPrice(tax);
        document.getElementById('total').textContent = this.formatPrice(total);

        // Enable/disable checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        checkoutBtn.disabled = this.cart.items.length === 0;
    }

    setupEventListeners() {
        // Decrease quantity
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('decrease-quantity')) {
                const itemId = e.target.getAttribute('data-item-id');
                this.decreaseQuantity(itemId);
            }
        });

        // Increase quantity
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('increase-quantity')) {
                const itemId = e.target.getAttribute('data-item-id');
                this.increaseQuantity(itemId);
            }
        });

        // Remove item
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) {
                const itemId = e.target.getAttribute('data-item-id');
                this.removeItem(itemId);
            }
        });

        // Direct quantity input
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const itemId = e.target.getAttribute('data-item-id');
                const quantity = parseInt(e.target.value);
                this.updateItemQuantity(itemId, quantity);
            }
        });

        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.handleCheckout();
        });
    }

    decreaseQuantity(itemId) {
        const item = this.cart.items.find(item => item.id === itemId);
        if (item && item.quantity > 1) {
            this.cart.updateQuantity(itemId, item.quantity - 1);
            this.renderCartItems();
            this.updateOrderSummary();
        }
    }

    increaseQuantity(itemId) {
        const item = this.cart.items.find(item => item.id === itemId);
        if (item) {
            this.cart.updateQuantity(itemId, item.quantity + 1);
            this.renderCartItems();
            this.updateOrderSummary();
        }
    }

    removeItem(itemId) {
        this.cart.removeItem(itemId);
        this.renderCartItems();
        this.updateOrderSummary();
    }

    updateItemQuantity(itemId, quantity) {
        if (quantity >= 1 && quantity <= 99) {
            this.cart.updateQuantity(itemId, quantity);
            this.renderCartItems();
            this.updateOrderSummary();
        } else {
            // Reset to previous value if invalid
            this.renderCartItems();
        }
    }

    handleCheckout() {
        const address = document.getElementById('delivery-address').value.trim();
        
        if (!address) {
            alert('Please enter your delivery address');
            document.getElementById('delivery-address').focus();
            return;
        }

        // Save order total for thank you page
        localStorage.setItem('lastOrderTotal', this.cart.getTotalPrice());
        
        // In a real application, you would process payment here
        alert('Order placed successfully! Redirecting to thank you page...');
        
        // Clear cart and redirect
        setTimeout(() => {
            this.cart.clearCart();
            window.location.href = 'thankyou.html';
        }, 1000);
    }

    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }
}

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.cart-content')) {
        new CartPage();
    }
});