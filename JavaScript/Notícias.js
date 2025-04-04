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





// ---------------------------------------Função Noticias (interligação com a pagina "news-management.html" ------------------------------------
// Arquivo externo para integrar com a página de eventos
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Supabase client
    const supabaseUrl = 'https://xtwwjzlusdjfxnexisku.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0d3dqemx1c2RqZnhuZXhpc2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzAwNzEsImV4cCI6MjA1ODA0NjA3MX0.TZS2RLMUAwxuIFzHWT5Cx58pd0N84slfhVjWMdSNKC4';

    // Função para inicializar o cliente Supabase
    function supabaseCreateClient(supabaseUrl, supabaseKey) {
        return window.supabase.createClient(supabaseUrl, supabaseKey);
    }

    const supabase = supabaseCreateClient(supabaseUrl, supabaseKey);

    // Função principal para atualizar a lista de eventos na página
    async function updateEventList() {
        try {
            // Fetch news items from Supabase
            const { data: newsItems, error } = await supabase
                .from('news')
                .select('*');

            if (error) throw error;

            // Convert news items to events format
            const events = {};
            newsItems.forEach((item, index) => {
                events[index + 1] = {
                    title: item.title,
                    date: `Data: ${item.formatteddate || new Date(item.date).toLocaleDateString('pt-BR')}`,
                    category: item.category,
                    description: item.description,
                    image: item.image
                };
            });

            // Update event list on the page
            const eventList = document.querySelector('.event-list');
            if (eventList) {
                eventList.innerHTML = ''; // Clear existing events
                Object.entries(events).forEach(([id, event]) => {
                    const eventItem = document.createElement('div');
                    eventItem.classList.add('event-item');
                    eventItem.setAttribute('data-event', id);

                    eventItem.innerHTML = `
                        <img src="${event.image || 'Img/Evento1.jpeg'}" alt="Imagem do evento">
                        <div class="event-details">
                            <h3>${event.title}</h3>
                            <p>${event.date}</p>
                            <p>Categoria: ${event.category}</p>
                            <a href="#" class="btn">Ver Mais</a>
                        </div>
                    `;

                    eventList.appendChild(eventItem);
                });

                // Setup modal functionality
                setupEventModal(events);
            }
        } catch (error) {
            console.error('Error updating event list:', error);
        }
    }

    // Configurar funcionalidade do modal para os eventos
    function setupEventModal(events) {
        const modal = document.getElementById('event-modal');
        if (!modal) return;

        const titleElem = document.getElementById('event-title');
        const dateElem = document.getElementById('event-date');
        const categoryElem = document.getElementById('event-category');
        const descriptionElem = document.getElementById('event-description');
        const closeBtn = modal.querySelector('.close-btn');

        document.querySelectorAll('.event-item .btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const eventId = button.closest('.event-item').getAttribute('data-event');
                const eventDetails = events[eventId];

                if (eventDetails) {
                    titleElem.textContent = eventDetails.title;
                    dateElem.textContent = eventDetails.date;
                    categoryElem.textContent = "Categoria: " + eventDetails.category;
                    descriptionElem.textContent = eventDetails.description;

                    modal.style.display = 'flex';
                }
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Iniciar a atualização da lista de eventos
    updateEventList();
});