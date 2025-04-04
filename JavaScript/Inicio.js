// ---------------------------------------Função carousel(colaboradores)------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.colaborador-card');
    const dots = document.querySelectorAll('.nav-dote');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    let currentIndex = 0;
    const cardCount = cards.length;
    let cardWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(cards[0]).marginRight);
    let interval;

    // Função para atualizar os dots
    function updateDots() {
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    // Atualiza o carrossel e ajusta a posição
    function updateCarousel() {
        // Mover o primeiro card para o final da lista para criar um efeito contínuo
        track.appendChild(track.firstElementChild);
        track.style.transition = 'none';
        track.style.transform = `translateX(0)`;

        // Atualiza os dots
        updateDots();

        // Atraso para reativar a animação de transição
        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease-in-out';
        }, 50);
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cardCount; // Incrementa e garante que volta ao início
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${cardWidth}px)`;

        setTimeout(updateCarousel, 500); // Atualiza após a animação
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cardCount) % cardCount; // Decrementa e garante que volta ao final
        // Move o último card para o começo antes de animar para trás
        track.style.transition = 'none';
        track.insertBefore(track.lastElementChild, track.firstElementChild);
        track.style.transform = `translateX(-${cardWidth}px)`;

        setTimeout(() => {
            track.style.transition = 'transform 0.5s ease-in-out';
            track.style.transform = `translateX(0)`;
        }, 50);
    }

    function startAutoSlide() {
        if (interval) clearInterval(interval);
        interval = setInterval(() => {
            nextSlide();
        }, 4000);
    }

    // Botões de navegação
    nextButton.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
    });

    prevButton.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
    });

    // Ajuste no resize da tela
    window.addEventListener('resize', () => {
        cardWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(cards[0]).marginRight);
    });

    // Inicialização do carrossel e atualização dos dots
    updateDots(); // Ativar o dot correto no início
    startAutoSlide();
});











// ---------------------------------------Função carousel inicio------------------------------------
const slider = {
    currentSlide: 0,
    slides: document.querySelectorAll('.slide'),
    dots: document.querySelectorAll('.nav-dot'),

    init() {
        document.querySelector('.prev-btn').addEventListener('click', () => this.prevSlide());
        document.querySelector('.next-btn').addEventListener('click', () => this.nextSlide());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        setInterval(() => this.nextSlide(), 5000);
    },

    updateSlides() {
        this.slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
        });

        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    },

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlides();
    },

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.updateSlides();
    },

    goToSlide(n) {
        this.currentSlide = n;
        this.updateSlides();
    }
};

slider.init();



// ---------------------------------------Função POP-UP ------------------------------------
// Delay the popup appearance after 20 seconds
window.onload = function () {
    const popup = document.getElementById('popup');

    // Set a timer to show the popup after 20 seconds
    const seconds = 50; // Define the delay in seconds
    const timeInMilliseconds = seconds * 1000; // Convert seconds to milliseconds

    setTimeout(() => {
        popup.classList.add('show');
    }, timeInMilliseconds); // Show popup after the specified time
};

// Function to close the popup manually
function closePopup() {
    const popup = document.getElementById('popup');
    popup.classList.remove('show');
}






// ---------------------------------------Função Menu Mobile ------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.menu-btn button');
    const closeBtn = document.querySelector('.close-button');
    const menuOverlay = document.querySelector('.menu-overlay');
    const mobileEventosMenu = document.getElementById('mobile-eventos-menu');
    const mobileGaleriaMenu = document.getElementById('mobile-galeria-menu');

    // Function to toggle main menu
    function toggleMenu() {
        menuOverlay.classList.toggle('active');
        closeBtn.classList.toggle('active');
        document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : 'auto';

        // Reset submenus when closing main menu
        if (!menuOverlay.classList.contains('active')) {
            mobileEventosMenu.classList.remove('active');
            mobileGaleriaMenu.classList.remove('active');
        }
    }

    // Attach event listeners to menu buttons
    menuBtn.addEventListener('click', toggleMenu);
    closeBtn.addEventListener('click', toggleMenu);

    // Handle mobile submenu toggles
    const handleSubmenuToggle = function (e) {
        // Only prevent default and toggle active class if clicking the main menu item
        if (e.target === this.querySelector('a')) {
            e.preventDefault();
            this.classList.toggle('active');
        }
        // Allow submenu links to work normally
    };

    // Add event listeners to mobile submenus
    mobileEventosMenu.addEventListener('click', handleSubmenuToggle);
    mobileGaleriaMenu.addEventListener('click', handleSubmenuToggle);
});




//----------------------------------- Secção Sobre nós -----------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    // Animação dos contadores
    const counters = document.querySelectorAll('.counter');

    const animateCounters = () => {
        counters.forEach(counter => {
            // Restaura para zero no início
            counter.innerText = '0';

            const target = parseInt(counter.getAttribute('data-target'));

            // Decide a velocidade com base no tamanho do número
            const duration = 1500; // Duração total da animação em ms
            const steps = 50; // Número de passos da animação

            // Calcula incremento baseado na duração
            const increment = target / steps;
            let currentCount = 0;

            // Função de animação
            const updateCounter = () => {
                currentCount += increment;

                // Arredonda para baixo durante a animação
                if (currentCount < target) {
                    counter.innerText = Math.floor(currentCount);
                    setTimeout(updateCounter, duration / steps);
                } else {
                    // Garante que o número final seja exatamente o target
                    counter.innerText = target;
                }
            };

            // Inicia a animação
            updateCounter();
        });
    };

    // Usando Intersection Observer para detectar quando os contadores estão visíveis
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const countersObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
            animateCounters();
            countersObserver.unobserve(entries[0].target);
        }
    }, observerOptions);

    // Observe o contêiner de estatísticas
    const statsSection = document.querySelector('.sobre-nos-stats');
    if (statsSection) {
        countersObserver.observe(statsSection);
    }



    // Código para o botão "Saiba Mais" (mantido do exemplo anterior)
    document.getElementById('saiba-mais-btn').addEventListener('click', function () {
        const moreInfo = document.getElementById('more-info');

        if (moreInfo.style.display === 'block') {
            // Esconder com animação
            moreInfo.style.opacity = '1';
            moreInfo.style.maxHeight = moreInfo.scrollHeight + 'px';

            // Animar para fechar
            setTimeout(() => {
                moreInfo.style.opacity = '0';
                moreInfo.style.maxHeight = '0';

                // Após a animação, esconder completamente
                setTimeout(() => {
                    moreInfo.style.display = 'none';
                }, 300);
            }, 10);

            this.textContent = 'Saiba Mais';
        } else {
            // Preparar para exibir
            moreInfo.style.display = 'block';
            moreInfo.style.opacity = '0';
            moreInfo.style.maxHeight = '0';

            // Animar para abrir
            setTimeout(() => {
                moreInfo.style.opacity = '1';
                moreInfo.style.maxHeight = '1000px'; // Valor grande o suficiente
            }, 10);

            this.textContent = 'Mostrar Menos';
        }
    });
});

// Função para atualizar o indicador de progresso de rolagem
function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;

    const progressBar = document.getElementById('scrollProgressBar');
    if (progressBar) {
        progressBar.style.width = scrollPercentage + '%';
    }
}

// Adicionar o evento de rolagem para atualizar o progresso
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
document.addEventListener('DOMContentLoaded', function () {
    updateScrollProgress();
});