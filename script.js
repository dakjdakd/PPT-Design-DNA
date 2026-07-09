/* ==================== PPT NAVIGATION SCRIPT ==================== */
/* Handles slide navigation, keyboard controls, and animations */

class PPTPresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.isTransitioning = false;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Update slide counter
        document.getElementById('total-slides').textContent = this.totalSlides;
        
        // Show first slide
        this.showSlide(1);
        
        // Add event listeners
        this.addEventListeners();
    }
    
    addEventListeners() {
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Mouse wheel navigation
        document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: true });
        
        // Click navigation
        document.addEventListener('click', (e) => this.handleClick(e));
        
        // Touch navigation (for mobile)
        let touchStartX = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });
        
        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const difference = touchStartX - touchEndX;
            
            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }
    
    handleKeyPress(e) {
        if (this.isTransitioning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'f':
            case 'F':
                this.toggleFullscreen();
                break;
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
        }
    }
    
    handleWheel(e) {
        if (this.isTransitioning) return;
        
        // Only navigate on significant wheel movement
        if (e.deltaY > 50) {
            this.nextSlide();
        } else if (e.deltaY < -50) {
            this.previousSlide();
        }
    }
    
    handleClick(e) {
        // Don't navigate if clicking buttons or interactive elements
        if (e.target.closest('.controls') || 
            e.target.closest('.cta-btn') ||
            e.target.closest('.fullscreen-btn')) {
            return;
        }
        
        // Click on left side = previous, right side = next
        if (e.clientX < window.innerWidth / 2) {
            this.previousSlide();
        } else {
            this.nextSlide();
        }
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1, 'next');
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1, 'prev');
        }
    }
    
    goToSlide(slideNumber, direction = 'next') {
        if (slideNumber < 1 || slideNumber > this.totalSlides || this.isTransitioning) {
            return;
        }
        
        this.isTransitioning = true;
        
        const slides = document.querySelectorAll('.slide');
        const currentSlideEl = slides[this.currentSlide - 1];
        const nextSlideEl = slides[slideNumber - 1];
        
        // Remove active class from current slide
        if (currentSlideEl) {
            currentSlideEl.classList.remove('active');
            
            // Add direction class
            if (direction === 'next') {
                currentSlideEl.classList.add('next');
                currentSlideEl.classList.remove('prev');
            } else {
                currentSlideEl.classList.add('prev');
                currentSlideEl.classList.remove('next');
            }
        }
        
        // Add active class to next slide
        nextSlideEl.classList.add('active');
        nextSlideEl.classList.remove('prev', 'next');
        
        // Update current slide number
        this.currentSlide = slideNumber;
        document.getElementById('current-slide').textContent = slideNumber;
        
        // Re-trigger animations on new slide
        this.retriggerAnimations(nextSlideEl);
        
        // Allow next navigation after transition
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }
    
    retriggerAnimations(slideElement) {
        // Get all animated elements
        const animatedElements = slideElement.querySelectorAll(
            '[class*="animate-"], .celebration-text, .agenda-item, .feature-card, ' +
            '.stat-box, .testimonial-card, .achievement-card, .partner-logo'
        );
        
        animatedElements.forEach(el => {
            // Clone and replace to retrigger animation
            const parent = el.parentNode;
            const clone = el.cloneNode(true);
            parent.replaceChild(clone, el);
        });
    }
    
    toggleFullscreen() {
        const elem = document.documentElement;
        
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
}

// Global functions for HTML onclick handlers
function nextSlide() {
    ppt.nextSlide();
}

function previousSlide() {
    ppt.previousSlide();
}

function toggleFullscreen() {
    ppt.toggleFullscreen();
}

// Initialize presentation when DOM is ready
let ppt;
document.addEventListener('DOMContentLoaded', () => {
    ppt = new PPTPresentation();
});

// Optional: Preload animations for better performance
window.addEventListener('load', () => {
    // Force reflow to optimize animations
    document.querySelectorAll('.slide').forEach(slide => {
        slide.offsetHeight; // Trigger reflow
    });
});
