// ===== Food Wall Functionality =====
class FoodWall {
    constructor() {
        this.posts = this.loadPosts();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.renderPolaroidGrid();
        this.setupEventListeners();
        this.setupSearchFilter();
    }

    loadPosts() {
        const savedPosts = localStorage.getItem('globalBitesPosts');
        if (savedPosts) {
            return JSON.parse(savedPosts);
        }

        // Sample initial posts with polaroid data
        return [
            {
                id: 1,
                user: 'Sarah M.',
                avatar: '👩',
                type: 'customer',
                content: 'Just tried the Butter Chicken for the first time and WOW! The flavors are incredible! So authentic and rich. Definitely ordering again!',
                snippet: 'The Butter Chicken was absolutely amazing! Rich, creamy, and perfectly spiced...',
                dish: 'Butter Chicken',
                rating: 5,
                likes: 12,
                comments: 3,
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                polaroidStyle: { '--delay': 0 }
            },
            {
                id: 2,
                user: 'Marco Romano',
                avatar: '👨‍🍳',
                type: 'chef',
                content: 'Buongiorno! Today we\'re making fresh pasta dough with semolina flour. The key is letting it rest properly for that perfect al dente texture.',
                snippet: 'Fresh pasta making in progress! The secret is in the resting time...',
                dish: 'Fresh Pasta',
                rating: null,
                likes: 24,
                comments: 5,
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
                polaroidStyle: { '--delay': 1 }
            },
            {
                id: 3,
                user: 'David L.',
                avatar: '👨',
                type: 'customer',
                content: 'The Jerk Chicken had the perfect amount of spice! So tender and flavorful. Felt like I was in Jamaica!',
                snippet: 'Jerk Chicken transported me straight to the Caribbean! Perfect spice blend...',
                dish: 'Jerk Chicken',
                rating: 5,
                likes: 8,
                comments: 2,
                timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                polaroidStyle: { '--delay': 2 }
            }
        ];
    }

    renderPolaroidGrid() {
        const grid = document.getElementById('polaroid-grid');
        const filteredPosts = this.getFilteredPosts();
        
        if (filteredPosts.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="empty-state">
                        <h3>No posts found</h3>
                        <p>Be the first to share your Global Bites experience!</p>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredPosts.map(post => this.createPolaroidHTML(post)).join('');
    }

    createPolaroidHTML(post) {
        const timeAgo = this.getTimeAgo(post.timestamp);
        const ratingStars = post.rating ? this.createRatingStars(post.rating) : '';
        
        return `
            <div class="polaroid-card" style="${this.objectToStyle(post.polaroidStyle)}" data-post-id="${post.id}" data-type="${post.type}">
                <div class="polaroid-image">
                    ${this.getDishEmoji(post.dish)}
                    <span class="image-text">${post.dish || 'Global Bites'}</span>
                </div>
                <div class="polaroid-content">
                    <div class="polaroid-user">
                        <div class="user-avatar">${post.avatar}</div>
                        <span class="user-name">${post.user}</span>
                        ${post.type === 'chef' ? '<span class="chef-badge">CHEF</span>' : ''}
                    </div>
                    <div class="polaroid-snippet">${post.snippet}</div>
                    ${ratingStars}
                    <div class="polaroid-meta">
                        ${post.dish ? `<span class="dish-tag">${post.dish}</span>` : '<span></span>'}
                        <span class="post-time">${timeAgo}</span>
                    </div>
                </div>
                <div class="polaroid-overlay">
                    <div class="overlay-content">
                        <div class="overlay-text">${post.content}</div>
                        <div class="overlay-stats">
                            <div class="stat">❤️ ${post.likes} likes</div>
                            <div class="stat">💬 ${post.comments} comments</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createRatingStars(rating) {
        return `
            <div class="rating" style="margin-bottom: 1rem;">
                ${'⭐'.repeat(rating)}${'☆'.repeat(5 - rating)}
            </div>
        `;
    }

    getDishEmoji(dish) {
        const emojiMap = {
            'Pizza': '🍕',
            'Chicken': '🍗',
            'Tacos': '🌮',
            'Sushi': '🍣',
            'Pasta': '🍝',
            'Curry': '🍛'
        };
        
        for (const [key, emoji] of Object.entries(emojiMap)) {
            if (dish.includes(key)) {
                return emoji;
            }
        }
        return '🍽️';
    }

    getFilteredPosts() {
        switch (this.currentFilter) {
            case 'customer':
                return this.posts.filter(post => post.type === 'customer');
            case 'chef':
                return this.posts.filter(post => post.type === 'chef');
            case 'featured':
                return this.posts.filter(post => post.rating === 5 || post.type === 'chef');
            default:
                return this.posts;
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.getAttribute('data-filter');
                this.renderPolaroidGrid();
            });
        });

        // Polaroid card clicks
        document.addEventListener('click', (e) => {
            const polaroidCard = e.target.closest('.polaroid-card');
            if (polaroidCard) {
                this.showPostDetail(polaroidCard.getAttribute('data-post-id'));
            }
        });
    }

    setupSearchFilter() {
        const searchInput = document.querySelector('.search-input');
        const searchBtn = document.querySelector('.search-btn');

        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();
            if (query) {
                const filtered = this.posts.filter(post => 
                    post.content.toLowerCase().includes(query) ||
                    post.user.toLowerCase().includes(query) ||
                    (post.dish && post.dish.toLowerCase().includes(query))
                );
                this.renderSearchResults(filtered);
            } else {
                this.renderPolaroidGrid();
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    renderSearchResults(posts) {
        const grid = document.getElementById('polaroid-grid');
        
        if (posts.length === 0) {
            grid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="empty-state">
                        <h3>No matching posts</h3>
                        <p>Try different search terms</p>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = posts.map(post => this.createPolaroidHTML(post)).join('');
    }

    showPostDetail(postId) {
        // In a real app, this would show a detailed view
        const post = this.posts.find(p => p.id == postId);
        if (post) {
            alert(`Post by ${post.user}:\n\n${post.content}`);
        }
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const postTime = new Date(timestamp);
        const diffInSeconds = Math.floor((now - postTime) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    objectToStyle(obj) {
        return Object.entries(obj).map(([key, value]) => `${key}: ${value}`).join('; ');
    }
}

// Initialize food wall
const foodWall = new FoodWall();