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







// ---------------------------------------Função Galeria(interligação com a pagina "gallery-management.html" e anexo ao codigo função modal) ------------------------------------
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase client
    const supabaseUrl = 'https://xtwwjzlusdjfxnexisku.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0d3dqemx1c2RqZnhuZXhpc2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzAwNzEsImV4cCI6MjA1ODA0NjA3MX0.TZS2RLMUAwxuIFzHWT5Cx58pd0N84slfhVjWMdSNKC4';

    // Função para inicializar o cliente Supabase
    function supabaseCreateClient(supabaseUrl, supabaseKey) {
        return window.supabase.createClient(supabaseUrl, supabaseKey);
    }

    const supabase = supabaseCreateClient(supabaseUrl, supabaseKey);

    // Função para carregar as imagens da galeria do Supabase
    async function loadGallery() {
        try {
            const galleryContainer = document.querySelector('.gallery'); // Onde as imagens serão exibidas
            if (!galleryContainer) return; // Se não existir o container, sai da função

            // Fetch gallery items from Supabase
            const { data: galleryItems, error } = await supabase
                .from('gallery')
                .select('*');

            if (error) {
                console.error('Erro ao carregar galeria:', error);
                return;
            }

            galleryContainer.innerHTML = ''; // Limpa antes de renderizar

            if (!galleryItems || galleryItems.length === 0) {
                galleryContainer.innerHTML = '<div class="empty-gallery">Nenhuma imagem disponível no momento.</div>';
                return;
            }

            galleryItems.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('gallery-card');
                div.onclick = () => expandImage(item.image, item.title, item.description); // Chama expandImage() ao clicar

                div.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="card-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `;
                galleryContainer.appendChild(div);
            });
        } catch (error) {
            console.error('Falha ao carregar a galeria:', error);
        }
    }

    // Iniciar carregamento da galeria
    loadGallery();

    // Função para abrir o modal com a imagem
    function expandImage(imageSrc, title, description) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');

        modal.style.display = "block";
        modalImg.src = imageSrc;
        modalCaption.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
    }

    // Função para fechar o modal
    function closeModal() {
        const modal = document.getElementById('imageModal');
        modal.style.display = "none";
    }

    // Configurar eventos para fechar o modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Fechar o modal clicando fora da imagem
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', function (event) {
            if (event.target === this) {
                closeModal();
            }
        });
    }
});

