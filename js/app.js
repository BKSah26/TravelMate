const app = {
    _currentTrip: null,
    _prefillDestination: '',

    init() {
        this.featuredGrid = document.getElementById('featuredGrid');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.appContainer = document.getElementById('app');
        this.navLinks = document.querySelectorAll('.nav-links a');

        this.setupEventListeners();
        this.initRouter();
    },

    setupEventListeners() {
        // Category Filtering
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.filterDestinations(e.target.dataset.filter);
            });
        });

        // Hash-based routing
        window.addEventListener('hashchange', () => this.handleRoute());
    },

    initRouter() {
        this.handleRoute();
    },

    handleRoute() {
        const hash = window.location.hash || '#discover';

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === hash);
        });

        this.switchView(hash);
    },

    switchView(hash) {
        window.scrollTo(0, 0);
        switch (hash) {
            case '#planner': this.renderPlanner(); break;
            case '#my-trips': this.renderMyTrips(); break;
            case '#discover':
            default: this.renderDiscover(); break;
        }
    },

    // ─── Views ────────────────────────────────────────────────────────────────

    renderDiscover() {
        this.appContainer.innerHTML = UI.renderDiscoverPage();
        this.renderAllDestinations();
        this.setupEventListeners();
    },

    renderPlanner() {
        this.appContainer.innerHTML = UI.renderPlanTripPage(this._prefillDestination);
        this._prefillDestination = '';   // consume it
        this._currentTrip = null;
        this.setupPlannerListeners();
    },

    renderMyTrips() {
        this.appContainer.innerHTML = UI.renderMyTripsPage();
    },

    // ─── Planner Form ─────────────────────────────────────────────────────────

    setupPlannerListeners() {
        const form = document.getElementById('planTripForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePlanFormSubmit(form);
        });
    },

    handlePlanFormSubmit(form) {
        const btn = document.getElementById('generateBtn');

        // Collect interests (checkboxes)
        const interestCheckboxes = form.querySelectorAll('input[name="interests"]:checked');
        const interests = Array.from(interestCheckboxes).map(cb => cb.value);

        const formData = {
            destination: form.destination.value.trim(),
            days: form.days.value,
            budget: form.budget.value,
            style: form.style.value,
            interests,
        };

        if (!formData.destination) {
            form.destination.focus();
            return;
        }

        // Loading state
        btn.disabled = true;
        btn.textContent = '⏳ Generating your itinerary...';

        // Small delay for UX feel
        setTimeout(() => {
            const trip = ItineraryEngine.generateItinerary(formData);
            this._currentTrip = trip;

            const resultContainer = document.getElementById('itineraryResult');
            if (resultContainer) {
                resultContainer.innerHTML = UI.renderItineraryResult(trip);
                resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            btn.disabled = false;
            btn.textContent = '✨ Regenerate Itinerary';
        }, 600);
    },

    // ─── Itinerary Controls ───────────────────────────────────────────────────

    toggleDay(index) {
        const card = document.getElementById(`day-${index}`);
        if (!card) return;
        const isExpanded = card.classList.toggle('expanded');
        const chevron = card.querySelector('.day-chevron');
        if (chevron) chevron.textContent = isExpanded ? '▲' : '▼';
    },

    expandAllDays() {
        document.querySelectorAll('.day-card').forEach((card, i) => {
            card.classList.add('expanded');
            const chevron = card.querySelector('.day-chevron');
            if (chevron) chevron.textContent = '▲';
        });
    },

    collapseAllDays() {
        document.querySelectorAll('.day-card').forEach(card => {
            card.classList.remove('expanded');
            const chevron = card.querySelector('.day-chevron');
            if (chevron) chevron.textContent = '▼';
        });
    },

    saveTrip() {
        if (!this._currentTrip) return;

        // Avoid duplicates: check by same id
        const existing = Storage.getTrips();
        const alreadySaved = existing.some(t => t.id === this._currentTrip.id);

        if (alreadySaved) {
            this._showToast('✅ Already saved to My Trips!', 'info');
            return;
        }

        this._currentTrip.status = 'upcoming';
        Storage.saveTrip(this._currentTrip);
        this._showToast('✅ Trip saved to My Trips!', 'success');

        // Disable both save buttons
        ['saveTripBtn', 'saveTripBtn2'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.disabled = true;
                btn.textContent = '✓ Saved!';
            }
        });
    },

    regenerateItinerary() {
        const form = document.getElementById('planTripForm');
        if (form) {
            this.handlePlanFormSubmit(form);
        }
    },

    // ─── My Trips ─────────────────────────────────────────────────────────────

    viewTripDetail(tripId) {
        const trip = Storage.getTrips().find(t => t.id === tripId);
        if (!trip) return;

        const modal = document.getElementById('tripModal');
        const content = document.getElementById('modalContent');
        if (!modal || !content) return;

        content.innerHTML = UI.renderTripDetailModal(trip);
        modal.classList.add('visible');
        document.body.style.overflow = 'hidden';

        // Wire up day toggles in modal
        (trip.itinerary || []).forEach((_, i) => {
            const card = document.getElementById(`day-${i}`);
            if (card) {
                const header = card.querySelector('.day-card-header');
                if (header) {
                    header.onclick = () => this.toggleDay(i);
                }
            }
        });
    },

    closeModal(e) {
        if (e && e.target !== document.getElementById('tripModal')) return;
        const modal = document.getElementById('tripModal');
        if (modal) modal.classList.remove('visible');
        document.body.style.overflow = '';
    },

    deleteTrip(tripId) {
        if (!confirm('Delete this trip from your saved trips?')) return;
        Storage.deleteTrip(tripId);
        this.renderMyTrips();
        this._showToast('🗑️ Trip removed.', 'info');
    },

    // ─── Discover ─────────────────────────────────────────────────────────────

    renderAllDestinations() {
        const grid = document.getElementById('featuredGrid');
        if (grid) UI.renderDestinations(grid, destinations);
    },

    filterDestinations(category) {
        const grid = document.getElementById('featuredGrid');
        if (!grid) return;
        const list = category === 'all'
            ? destinations
            : destinations.filter(d => d.category === category);
        UI.renderDestinations(grid, list);
    },

    startPlanning(id) {
        const dest = destinations.find(d => d.id === id);
        if (dest) {
            this._prefillDestination = dest.title;
        }
        window.location.hash = '#planner';
    },

    // ─── Toast ────────────────────────────────────────────────────────────────

    _showToast(message, type = 'success') {
        // Remove existing toast
        const old = document.getElementById('tmToast');
        if (old) old.remove();

        const toast = document.createElement('div');
        toast.id = 'tmToast';
        toast.className = `tm-toast tm-toast--${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('visible'));

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 2800);
    },
};

document.addEventListener('DOMContentLoaded', () => app.init());
