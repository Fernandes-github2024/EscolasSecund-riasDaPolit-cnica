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




// Namespace para a aplicação
const AppAgenda = {
    // Dados e estado
    state: {
        currentDate: new Date(),
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        events: [],
        escolasMap: {
            'maputo': 'Acácias (Maputo)',
            'quelimane': 'Lourenço do Rosário (Quelimane)',
            'tete': 'Embondeiros (Tete)',
            'nampula': 'D\'A Politécnica (Nampula)',
            'nacala': 'D\'A Politécnica (Nacala)',
            'todas': 'Todas as Escolas'
        },
        supabase: null
    },

    // Inicialização
    init: async function () {
        // Inicializar Supabase
        await this.initSupabase();

        // Carregar eventos do Supabase
        await this.loadEventsFromSupabase();

        // Inicializar UI e eventos
        this.initUI();
        this.initEventHandlers();

        // Definir filtros padrão
        document.querySelector('.filter-btn[data-filter="todos"]')?.click();
        document.querySelector('.escola-btn[data-escola="todas"]')?.click();
    },

    // Inicializar Supabase
    initSupabase: async function () {
        try {
            const supabaseUrl = 'https://xtwwjzlusdjfxnexisku.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0d3dqemx1c2RqZnhuZXhpc2t1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0NzAwNzEsImV4cCI6MjA1ODA0NjA3MX0.TZS2RLMUAwxuIFzHWT5Cx58pd0N84slfhVjWMdSNKC4';

            // Função para inicializar o cliente Supabase
            function supabaseCreateClient(supabaseUrl, supabaseKey) {
                return window.supabase.createClient(supabaseUrl, supabaseKey);
            }

            this.state.supabase = supabaseCreateClient(supabaseUrl, supabaseKey);
        } catch (error) {
            console.error('Erro ao inicializar Supabase:', error);
        }
    },

    // Carregar eventos do Supabase
    loadEventsFromSupabase: async function () {
        try {
            if (!this.state.supabase) {
                console.error('Cliente Supabase não inicializado');
                return;
            }

            const { data: agendaEvents, error } = await this.state.supabase
                .from('agenda')
                .select('*');

            if (error) {
                throw error;
            }

            // Converter eventos para o formato esperado pela aplicação
            this.state.events = agendaEvents.map(event => {
                return {
                    id: event.id,
                    title: event.title,
                    type: event.type,
                    escola: event.escola,
                    date: new Date(event.date),
                    time: event.time,
                    location: event.location,
                    description: event.description,
                    timestamp: event.timestamp || Date.now()
                };
            });

        } catch (error) {
            console.error('Erro ao carregar eventos do Supabase:', error);
        }
    },

    // Inicializar elementos de UI
    initUI: function () {
        // Criar modais para todos os eventos
        this.state.events.forEach(event => {
            this.createEventModal(event);
        });

        // Renderizar a lista de eventos na agenda
        this.renderAgendaList();
    },

    // Renderizar a lista de eventos na agenda
    renderAgendaList: function () {
        const agendaList = document.querySelector('.agenda-list');
        if (!agendaList) return;

        // Limpar a lista existente
        agendaList.innerHTML = '';

        // Se não houver eventos, mostrar mensagem
        if (this.state.events.length === 0) {
            agendaList.innerHTML = '<div class="agenda-empty">Nenhum evento cadastrado.</div>';
            return;
        }

        // Adicionar todos os eventos à lista
        this.state.events.forEach(event => {
            const eventDate = new Date(event.date);
            const day = eventDate.getDate();
            const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const month = monthNames[eventDate.getMonth()];

            const agendaItem = document.createElement('div');
            agendaItem.classList.add('agenda-item');
            agendaItem.setAttribute('data-type', event.type);
            agendaItem.setAttribute('data-escola', event.escola);
            agendaItem.setAttribute('data-id', event.id);

            agendaItem.innerHTML = `
                <div class="agenda-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
                <div class="agenda-content">
                    <h3>${event.title}</h3>
                    <div class="agenda-details">
                        <p class="time"><i class="fa fa-clock-o"></i> ${event.time || '00:00'}</p>
                        <p class="location"><i class="fa fa-map-marker"></i> ${event.location || 'Local não definido'}</p>
                    </div>
                    <p class="description">${event.description || 'Sem descrição disponível'}</p>
                    <a href="#" class="agenda-link" data-id="${event.id}">Ver detalhes</a>
                </div>
            `;

            agendaList.appendChild(agendaItem);
        });

        // Aplicar filtros iniciais
        this.applyFilters();
    },

    // Criar modal para um evento
    createEventModal: function (event) {
        // Verificar se o modal já existe
        if (document.getElementById(`${event.id}-modal`)) return;

        const modal = document.createElement('div');
        modal.id = `${event.id}-modal`;
        modal.className = 'event-modal';

        const eventDate = new Date(event.date);
        const dateFormatted = eventDate.toLocaleDateString('pt-BR');

        modal.innerHTML = `
            <div class="event-modal-content">
                <span class="close-modal">&times;</span>
                <h2>${event.title}</h2>
                <div class="event-details">
                    <p><strong>Data:</strong> ${dateFormatted}</p>
                    <p><strong>Horário:</strong> ${event.time || 'Não definido'}</p>
                    <p><strong>Local:</strong> ${event.location || 'Local não definido'}</p>
                    <p><strong>Escola:</strong> ${this.state.escolasMap[event.escola] || 'Não definida'}</p>
                    <p><strong>Tipo:</strong> ${this.getTypeLabel(event.type)}</p>
                    <p><strong>Descrição:</strong></p>
                    <p>${event.description || 'Sem descrição disponível'}</p>
                </div>
            </div>
        `;

        // Adicionar o modal ao body
        document.body.appendChild(modal);
    },

    // Obter o rótulo do tipo de evento
    getTypeLabel: function (type) {
        const labels = {
            'academicos': 'Acadêmico',
            'culturais': 'Cultural',
            'desportivos': 'Desportivo'
        };
        return labels[type] || type;
    },

    // Inicializar manipuladores de eventos
    initEventHandlers: function () {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.applyFilters();
            });
        });

        // Escola buttons
        const escolaButtons = document.querySelectorAll('.escola-btn');
        escolaButtons.forEach(button => {
            button.addEventListener('click', () => {
                escolaButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                this.applyFilters();
            });
        });

        // Modal links
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('agenda-link')) {
                e.preventDefault();
                const eventId = e.target.getAttribute('data-id');
                const modal = document.getElementById(eventId + '-modal');
                if (modal) {
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            }
        });

        // Close modal buttons
        const closeModalButtons = document.querySelectorAll('.close-modal');
        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.event-modal, .calendar-modal');
                if (modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target.classList.contains('event-modal') ||
                event.target.classList.contains('calendar-modal')) {
                event.target.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Calendar button
        const calendarBtn = document.getElementById('calendar-btn');
        const calendarModal = document.getElementById('calendar-modal');
        if (calendarBtn && calendarModal) {
            calendarBtn.addEventListener('click', () => {
                calendarModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                this.renderCalendar();
            });
        }

        // Calendar navigation
        const prevMonthBtn = document.getElementById('prev-month');
        const nextMonthBtn = document.getElementById('next-month');
        if (prevMonthBtn) {
            prevMonthBtn.addEventListener('click', () => {
                this.state.currentMonth--;
                if (this.state.currentMonth < 0) {
                    this.state.currentMonth = 11;
                    this.state.currentYear--;
                }
                this.renderCalendar();
            });
        }

        if (nextMonthBtn) {
            nextMonthBtn.addEventListener('click', () => {
                this.state.currentMonth++;
                if (this.state.currentMonth > 11) {
                    this.state.currentMonth = 0;
                    this.state.currentYear++;
                }
                this.renderCalendar();
            });
        }

        // Escola select in calendar
        const escolaSelect = document.getElementById('escola-select');
        if (escolaSelect) {
            escolaSelect.addEventListener('change', () => {
                this.renderCalendar();
            });
        }
    },

    // Aplicar filtros na lista de eventos
    applyFilters: function () {
        const selectedType = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'todos';
        const selectedEscola = document.querySelector('.escola-btn.active')?.getAttribute('data-escola') || 'todas';

        const agendaItems = document.querySelectorAll('.agenda-item');
        agendaItems.forEach(item => {
            const itemType = item.getAttribute('data-type');
            const itemEscola = item.getAttribute('data-escola');

            const typeMatch = selectedType === 'todos' || itemType === selectedType;
            const escolaMatch = selectedEscola === 'todas' || itemEscola === selectedEscola || itemEscola === 'todas';

            if (typeMatch && escolaMatch) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    },

    // Renderizar o calendário
    renderCalendar: function () {
        const currentMonthEl = document.getElementById('current-month');
        const calendarDaysEl = document.getElementById('calendar-days');
        const escolaSelect = document.getElementById('escola-select');

        if (!currentMonthEl || !calendarDaysEl || !escolaSelect) return;

        // Atualiza o título do mês
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        currentMonthEl.textContent = `${monthNames[this.state.currentMonth]} ${this.state.currentYear}`;

        // Limpa os dias do calendário
        calendarDaysEl.innerHTML = '';

        // Obtém a escola selecionada
        const selectedEscola = escolaSelect.value;

        // Obtém o primeiro dia do mês
        const firstDayOfMonth = new Date(this.state.currentYear, this.state.currentMonth, 1);

        // Obtém o último dia do mês
        const lastDayOfMonth = new Date(this.state.currentYear, this.state.currentMonth + 1, 0);

        // Obtém o dia da semana do primeiro dia do mês (0 = domingo, 6 = sábado)
        const firstDayOfWeek = firstDayOfMonth.getDay();

        // Obtém o número de dias no mês
        const daysInMonth = lastDayOfMonth.getDate();

        // Obtém o último dia do mês anterior
        const prevMonthLastDay = new Date(this.state.currentYear, this.state.currentMonth, 0).getDate();

        // Calcula o número de dias para mostrar do mês anterior
        const prevMonthDays = firstDayOfWeek;

        // Calcula o número de dias para mostrar do próximo mês
        const nextMonthDays = 42 - (prevMonthDays + daysInMonth); // 42 = 6 linhas de 7 dias

        // Renderiza os dias do mês anterior
        for (let i = prevMonthDays - 1; i >= 0; i--) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.innerHTML = `<div class="day-number">${prevMonthLastDay - i}</div>`;
            calendarDaysEl.appendChild(dayEl);
        }

        // Renderiza os dias do mês atual
        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day';
            dayEl.innerHTML = `<div class="day-number">${i}</div>`;

            // Verifica se há eventos para este dia
            const currentDate = new Date(this.state.currentYear, this.state.currentMonth, i);
            const dayEvents = this.state.events.filter(event =>
                event.date.getDate() === i &&
                event.date.getMonth() === this.state.currentMonth &&
                event.date.getFullYear() === this.state.currentYear &&
                (selectedEscola === 'todas' || event.escola === selectedEscola || event.escola === 'todas')
            );

            // Adiciona marcadores de evento
            if (dayEvents.length > 0) {
                dayEl.classList.add('has-event');

                const dotsContainer = document.createElement('div');
                dotsContainer.className = 'event-dots';

                dayEvents.forEach(event => {
                    const dot = document.createElement('span');
                    dot.className = `event-dot ${event.type}`;
                    dot.setAttribute('title', event.title);
                    dotsContainer.appendChild(dot);
                });

                dayEl.appendChild(dotsContainer);

                // Adiciona evento de clique para mostrar detalhes
                dayEl.addEventListener('click', () => {
                    if (dayEvents.length > 0) {
                        const eventId = dayEvents[0].id;
                        const modal = document.getElementById(eventId + '-modal');

                        if (modal) {
                            calendarModal.classList.remove('active');
                            setTimeout(() => {
                                modal.classList.add('active');
                            }, 300);
                        }
                    }
                });
            }

            calendarDaysEl.appendChild(dayEl);
        }

        // Renderiza os dias do próximo mês
        for (let i = 1; i <= nextMonthDays; i++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'calendar-day other-month';
            dayEl.innerHTML = `<div class="day-number">${i}</div>`;
            calendarDaysEl.appendChild(dayEl);
        }

        // Atualiza a lista de eventos do mês
        this.updateEventList(selectedEscola);
    },

    // Atualiza a lista de eventos do mês atual
    updateEventList: function (selectedEscola) {
        const eventListEl = document.getElementById('event-list')?.querySelector('ul');
        if (!eventListEl) return;

        eventListEl.innerHTML = '';

        // Filtra eventos do mês atual
        const monthEvents = this.state.events.filter(event =>
            (selectedEscola === 'todas' || event.escola === selectedEscola || event.escola === 'todas') &&
            event.date.getMonth() === this.state.currentMonth &&
            event.date.getFullYear() === this.state.currentYear
        ).sort((a, b) => a.date - b.date);

        // Cria itens da lista
        monthEvents.forEach(event => {
            const li = document.createElement('li');
            li.className = `event-item ${event.type}`;

            const dateSpan = document.createElement('span');
            dateSpan.className = 'event-date';
            dateSpan.textContent = `${event.date.getDate()} ${this.getMonthShortName(event.date.getMonth())}`;

            const titleSpan = document.createElement('span');
            titleSpan.className = 'event-title';
            titleSpan.textContent = `${event.title} - ${this.state.escolasMap[event.escola] || ''}`;

            li.appendChild(dateSpan);
            li.appendChild(titleSpan);

            // Adiciona evento de clique
            if (event.id) {
                li.style.cursor = 'pointer';
                li.addEventListener('click', () => {
                    const modal = document.getElementById(event.id + '-modal');

                    if (modal) {
                        document.getElementById('calendar-modal')?.classList.remove('active');
                        setTimeout(() => {
                            modal.classList.add('active');
                        }, 300);
                    }
                });
            }

            eventListEl.appendChild(li);
        });

        // Mensagem se não houver eventos
        if (monthEvents.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Não há eventos programados para este mês.';
            eventListEl.appendChild(li);
        }
    },

    // Função auxiliar para obter o nome abreviado do mês
    getMonthShortName: function (monthIndex) {
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return months[monthIndex];
    }
};

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', async function () {
    // Verificar se o Supabase está disponível
    if (typeof window.supabase !== 'undefined') {
        await AppAgenda.init();
    } else {
        console.error('Supabase não encontrado. Verifique se o script está carregado corretamente.');
    }
});