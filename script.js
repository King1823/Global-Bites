// ===== Global Cart Functionality =====
class ShoppingCart {
    constructor() {
        this.items = this.loadCartFromStorage();
        this.updateCartCount();
    }

    loadCartFromStorage() {
        const savedCart = localStorage.getItem('globalBitesCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCartToStorage() {
        localStorage.setItem('globalBitesCart', JSON.stringify(this.items));
    }

    addItem(itemId, itemName, itemPrice, quantity = 1) {
        const existingItem = this.items.find(item => item.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: itemId,
                name: itemName,
                price: parseFloat(itemPrice),
                quantity: quantity
            });
        }
        
        this.saveCartToStorage();
        this.updateCartCount();
        this.showAddToCartAnimation(itemId);
    }

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.saveCartToStorage();
        this.updateCartCount();
    }

    updateQuantity(itemId, quantity) {
        const item = this.items.find(item => item.id === itemId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.removeItem(itemId);
            } else {
                this.saveCartToStorage();
            }
            this.updateCartCount();
        }
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    clearCart() {
        this.items = [];
        this.saveCartToStorage();
        this.updateCartCount();
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const totalItems = this.getTotalItems();
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            if (totalItems > 0) {
                element.classList.add('pulse');
                setTimeout(() => element.classList.remove('pulse'), 300);
            }
        });
    }

    showAddToCartAnimation(itemId) {
        const button = document.querySelector(`[data-id="${itemId}"]`);
        if (button) {
            button.classList.add('added-to-cart');
            setTimeout(() => button.classList.remove('added-to-cart'), 1000);
        }
    }
}

// Initialize global cart
const cart = new ShoppingCart();

// ===== Add to Cart Event Handlers =====
function initAddToCartButtons() {
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const itemId = button.getAttribute('data-id');
            const itemName = button.getAttribute('data-name');
            const itemPrice = button.getAttribute('data-price');
            
            cart.addItem(itemId, itemName, itemPrice, 1);
            
            // Visual feedback
            button.innerHTML = '✓ Added!';
            button.classList.add('btn-success');
            button.classList.remove('btn-outline-primary', 'btn-primary');
            
            setTimeout(() => {
                button.innerHTML = 'Add to Cart';
                button.classList.remove('btn-success');
                button.classList.add(button.classList.contains('btn-primary') ? 'btn-primary' : 'btn-outline-primary');
            }, 2000);
        }
    });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== Page Initialization =====
document.addEventListener('DOMContentLoaded', function() {
    initAddToCartButtons();
    initNavbarScroll();
    
    // Update cart count on page load
    cart.updateCartCount();
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShoppingCart };
}