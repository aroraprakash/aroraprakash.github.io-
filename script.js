const canvas = document.getElementById("car-sequence");
if (canvas) {
    const context = canvas.getContext("2d");

    const frameCount = 50;
    const currentFrame = index => (
        `images/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
    );

    const images = [];
    const carSequence = {
        frame: 0
    };

    // Preload images
    for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        images.push(img);
    }

    // Initial Canvas setup
    images[0].onload = render;

    function render() {
        // Keep aspect ratio
        const img = images[carSequence.frame];
        
        // Scale canvas dynamically to fit window width/height, covering or containing
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        // use Math.max to cover the screen on desktop, Math.min on mobile to avoid cropping
        const ratio = window.innerWidth < 768 ? Math.min(hRatio, vRatio) : Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, img.width, img.height,
                          centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }

    window.addEventListener('resize', () => {
        if(images[0].complete) {
            render();
        }
    });

    // Scroll Event for Image Sequence
    window.addEventListener('scroll', () => {
        const html = document.documentElement;
        const canvasContainer = document.querySelector('.canvas-container');
        
        if (canvasContainer) {
            // Offset Top of the container
            const containerTop = canvasContainer.offsetTop;
            const containerHeight = canvasContainer.scrollHeight - window.innerHeight;
            
            // Calculate how far we've scrolled inside the container
            let scrollProgress = (html.scrollTop - containerTop) / containerHeight;
            
            // Clamp the progress between 0 and 1
            if (scrollProgress < 0) scrollProgress = 0;
            if (scrollProgress > 1) scrollProgress = 1;

            // Calculate which frame we should be on
            const frameIndex = Math.min(
                frameCount - 1,
                Math.floor(scrollProgress * frameCount)
            );

            // Update canvas if frame changed
            if(carSequence.frame !== frameIndex) {
                carSequence.frame = frameIndex;
                // requestAnimationFrame for smoother rendering
                requestAnimationFrame(() => render());
            }
        }
    });
}


// Intersection Observer for Text Animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 // Trigger earlier
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const textSections = document.querySelectorAll('.text-section, .fade-up, .product-card, .review-card');
textSections.forEach(section => {
    if(section) observer.observe(section);
});

// --- ADVANCED FEATURES ---

// 1. Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
        }, 1500); // 1.5 second loading screen
    }
});

// 2. Custom Cursor
const cursor = document.querySelector('.custom-cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const hoverables = document.querySelectorAll('a, button, .product-card, .review-card');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// 3. Slide-Out Cart
const cartBtn = document.getElementById('cart-open-btn');
const cartPanel = document.getElementById('cart-panel');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart');

if (cartBtn && cartPanel && cartOverlay && closeCartBtn) {
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        cartPanel.classList.add('active');
        cartOverlay.classList.add('active');
    });

    const closeCart = () => {
        cartPanel.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
}

// 4. Reservation Modal
const reserveBtns = document.querySelectorAll('.btn-buy');
const reservationModal = document.getElementById('reservation-modal');
const closeModalBtn = document.querySelector('.close-modal');
const reservationForm = document.getElementById('reservation-form');

if (reserveBtns.length > 0 && reservationModal && closeModalBtn) {
    reserveBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            reservationModal.classList.add('active');
        });
    });

    closeModalBtn.addEventListener('click', () => {
        reservationModal.classList.remove('active');
    });

    reservationModal.addEventListener('click', (e) => {
        if (e.target === reservationModal) {
            reservationModal.classList.remove('active');
        }
    });

    if (reservationForm) {
        reservationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your test drive has been requested! Our team will contact you shortly.');
            reservationModal.classList.remove('active');
            reservationForm.reset();
        });
    }
}

// 5. Theme Toggle
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeBtn.textContent = '🌙';
        } else {
            themeBtn.textContent = '☀️';
        }
    });
}

// 6. Audio Experience
const engineSound = document.getElementById('engine-sound');
const bgMusic = document.getElementById('bg-music');
const audioToggleBtn = document.getElementById('audio-toggle');

if (audioToggleBtn && bgMusic) {
    let isPlaying = false;
    audioToggleBtn.addEventListener('click', () => {
        if (!isPlaying) {
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
            audioToggleBtn.innerHTML = '🎵 Pause';
            isPlaying = true;
        } else {
            bgMusic.pause();
            audioToggleBtn.innerHTML = '🎵 Play';
            isPlaying = false;
        }
    });
    bgMusic.volume = 0.3;
}

if (engineSound && reserveBtns) {
    engineSound.volume = 0.5;
    reserveBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            engineSound.currentTime = 0;
            engineSound.play().catch(e => console.log("Audio play failed:", e));
        });
    });
}

// 7. Virtual Assistant Chatbot
const chatToggleBtn = document.getElementById('chat-toggle');
const chatPanel = document.getElementById('chat-panel');
const closeChatBtn = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat');
const chatMessages = document.getElementById('chat-messages');

if (chatToggleBtn && chatPanel && closeChatBtn) {
    chatToggleBtn.addEventListener('click', () => {
        chatPanel.classList.toggle('active');
    });

    closeChatBtn.addEventListener('click', () => {
        chatPanel.classList.remove('active');
    });

    const botReplies = [
        "That sounds like a great choice!",
        "Our latest models feature state-of-the-art aerodynamics.",
        "Would you like to schedule a test drive to experience it yourself?",
        "We offer premium customization options. What color do you prefer?",
        "I can have a sales representative contact you with more details."
    ];

    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (text) {
            const userMsg = document.createElement('div');
            userMsg.className = 'msg user';
            userMsg.textContent = text;
            chatMessages.appendChild(userMsg);
            
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            setTimeout(() => {
                const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)];
                const botMsg = document.createElement('div');
                botMsg.className = 'msg bot';
                botMsg.textContent = randomReply;
                chatMessages.appendChild(botMsg);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    };

    if (sendChatBtn && chatInput) {
        sendChatBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}
