/**
 * GameHub - Home Page
 * Handles functionality specific to the home page
 */

const HomePage = {
    init: function() {
        this.initCarousel();
        this.loadFeaturedGames();
        this.loadSpecialOffers();
        this.loadNewReleases();
        console.log('Home page initialized');
    },
    
    initCarousel: function() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.carousel-slide');
        const indicators = carousel.querySelectorAll('.carousel-indicator');
        const nextBtn = carousel.querySelector('.carousel-next');
        const prevBtn = carousel.querySelector('.carousel-prev');
        
        let currentSlide = 0;
        let slideInterval;
        const intervalTime = 5000; // 5 seconds per slide
        
        // Function to show a specific slide
        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            });
            
            // Remove active class from all indicators
            indicators.forEach(indicator => {
                indicator.classList.remove('active');
                indicator.setAttribute('aria-selected', 'false');
            });
            
            // Show the selected slide
            slides[index].classList.add('active');
            slides[index].setAttribute('aria-hidden', 'false');
            
            // Highlight the corresponding indicator
            indicators[index].classList.add('active');
            indicators[index].setAttribute('aria-selected', 'true');
            
            // Update current slide index
            currentSlide = index;
        }
        
        // Initialize first slide
        showSlide(0);
        
        // Start automatic rotation
        function startSlideInterval() {
            slideInterval = setInterval(() => {
                let nextSlide = currentSlide + 1;
                if (nextSlide >= slides.length) {
                    nextSlide = 0;
                }
                showSlide(nextSlide);
            }, intervalTime);
        }
        
        startSlideInterval();
        
        // Add event listeners to indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                clearInterval(slideInterval); // Stop the auto-rotation
                showSlide(index);
                startSlideInterval(); // Restart auto-rotation
            });
        });
        
        // Add event listeners to next/prev buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                let nextSlide = currentSlide + 1;
                if (nextSlide >= slides.length) {
                    nextSlide = 0;
                }
                showSlide(nextSlide);
                startSlideInterval();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                clearInterval(slideInterval);
                let prevSlide = currentSlide - 1;
                if (prevSlide < 0) {
                    prevSlide = slides.length - 1;
                }
                showSlide(prevSlide);
                startSlideInterval();
            });
        }
        
        // Pause rotation when hovering over carousel
        carousel.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        // Resume rotation when mouse leaves
        carousel.addEventListener('mouseleave', () => {
            startSlideInterval();
        });
    },
    
    loadFeaturedGames: function() {
        // Get the container where featured games will be displayed
        const featuredContainer = document.querySelector('.featured-games .game-grid');
        if (!featuredContainer) return;
        
        // Clear any existing content
        featuredContainer.innerHTML = '';
        
        // Get games data from localStorage
        const gamesData = JSON.parse(localStorage.getItem('gameHubGames')) || [];
        if (gamesData.length === 0) {
            console.error('No game data found');
            return;
        }
        
        // Select a few games to feature (e.g., games with high ratings)
        const featuredGames = gamesData
            .filter(game => game.rating >= 4.5)
            .sort(() => 0.5 - Math.random()) // Shuffle array
            .slice(0, 4); // Take first 4 games
        
        // Render each game card
        featuredGames.forEach(game => {
            const gameCard = this.createGameCard(game);
            featuredContainer.appendChild(gameCard);
        });
    },
    
    loadSpecialOffers: function() {
        // Get the container where special offers will be displayed
        const specialOffersContainer = document.querySelector('.special-offers .game-grid');
        if (!specialOffersContainer) return;
        
        // Clear any existing content
        specialOffersContainer.innerHTML = '';
        
        // Get games data from localStorage
        const gamesData = JSON.parse(localStorage.getItem('gameHubGames')) || [];
        if (gamesData.length === 0) {
            console.error('No game data found');
            return;
        }
        
        // Select games that are on sale
        const specialOffers = gamesData
            .filter(game => game.discountPercent > 0)
            .sort((a, b) => b.discountPercent - a.discountPercent) // Sort by highest discount first
            .slice(0, 4); // Take first 4 games
        
        // Render each game card
        specialOffers.forEach(game => {
            const gameCard = this.createGameCard(game);
            specialOffersContainer.appendChild(gameCard);
        });
    },
    
    loadNewReleases: function() {
        // Get the container where new releases will be displayed
        const newReleasesContainer = document.querySelector('.new-releases .game-grid');
        if (!newReleasesContainer) return;
        
        // Clear any existing content
        newReleasesContainer.innerHTML = '';
        
        // Get games data from localStorage
        const gamesData = JSON.parse(localStorage.getItem('gameHubGames')) || [];
        if (gamesData.length === 0) {
            console.error('No game data found');
            return;
        }
        
        // Get current date for comparison
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
        
        // Select recent games (released in the last 6 months)
        const newReleases = gamesData
            .filter(game => {
                const releaseDate = new Date(game.releaseDate);
                return releaseDate > sixMonthsAgo;
            })
            .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)) // Sort by most recent first
            .slice(0, 4); // Take first 4 games
        
        // Render each game card
        newReleases.forEach(game => {
            const gameCard = this.createGameCard(game);
            newReleasesContainer.appendChild(gameCard);
        });
    },
    
    createGameCard: function(game) {
        // Calculate the discounted price if there's a discount
        const discountedPrice = game.discountPercent > 0 
            ? game.price * (1 - game.discountPercent / 100) 
            : null;
        
        // Create the card element
        const card = document.createElement('div');
        card.className = 'game-card';
        card.dataset.gameId = game.id;
        
        // Create the card's HTML structure
        card.innerHTML = `
            <div class="game-card-image">
                <img src="${game.images.thumbnail}" alt="${game.title}" loading="lazy">
                ${game.discountPercent > 0 ? `<div class="discount-badge">-${game.discountPercent}%</div>` : ''}
            </div>
            <div class="game-card-content">
                <h3 class="game-title">${game.title}</h3>
                <div class="game-tags">
                    ${game.genres.slice(0, 3).map(genre => `<span class="tag">${genre}</span>`).join('')}
                </div>
                <div class="game-price">
                    ${game.discountPercent > 0 
                        ? `<span class="original-price">$${game.price.toFixed(2)}</span>
                          <span class="discounted-price">$${discountedPrice.toFixed(2)}</span>`
                        : game.price > 0 
                            ? `<span class="price">$${game.price.toFixed(2)}</span>`
                            : `<span class="free">Free to Play</span>`
                    }
                </div>
            </div>
        `;
        
        // Add event listener to navigate to game details page when clicked
        card.addEventListener('click', () => {
            window.location.href = `pages/game-details.html?id=${game.id}`;
        });
        
        // Add hover event for animation effect
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });
        
        return card;
    }
};

// Initialize module when page loads
document.addEventListener('DOMContentLoaded', function() {
    HomePage.init();
});