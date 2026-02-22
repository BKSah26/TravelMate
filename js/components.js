const UI = {
    createDestinationCard(destination) {
        return `
            <div class="card" data-category="${destination.category}">
                <img src="${destination.image}" alt="${destination.title}" class="card-img" loading="lazy" 
                    onerror="this.src='https://placehold.co/600x400?text=${encodeURIComponent(destination.title)}'">
                <div class="card-body">
                    <span class="card-tag">${destination.category}</span>
                    <h4 class="card-title">${destination.title}</h4>
                    <p class="text-muted" style="font-size: 0.9rem;">${destination.description}</p>
                    <div class="card-info">
                        <span class="price">${destination.price}</span>
                        <div style="display: flex; align-items: center; gap: 0.25rem;">
                            <span style="color: #f59e0b;">★</span>
                            <span style="font-weight: 600;">${destination.rating}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="width: 100%; margin-top: 1.5rem;" onclick="app.startPlanning(${destination.id})">Plan This Trip</button>
                </div>
            </div>
        `;
    },

    renderDiscoverPage() {
        return `
            <section class="hero">
                <div class="container hero-content">
                    <h2 class="hero-title">Your Next Adventure, <br><span class="text-gradient">Intelligently Planned.</span></h2>
                    <p class="hero-subtitle">Discover hidden gems and receive AI-powered personalized itineraries tailored to your pace and budget.</p>
                    <div style="margin-top: 3rem;">
                        <button class="btn btn-primary" onclick="window.location.hash='#planner'">Plan Your Trip Now</button>
                    </div>
                </div>
            </section>
            <section id="discover" class="section">
                <div class="container">
                    <div class="section-header">
                        <div>
                            <h3 class="section-title">Trending Destinations</h3>
                            <p>Popular choices by the TravelMate community</p>
                        </div>
                        <div class="filters">
                            <button class="filter-btn active" data-filter="all">All</button>
                            <button class="filter-btn" data-filter="nature">Nature</button>
                            <button class="filter-btn" data-filter="adventure">Adventure</button>
                            <button class="filter-btn" data-filter="heritage">Heritage</button>
                        </div>
                    </div>
                    <div class="destination-grid" id="featuredGrid"></div>
                </div>
            </section>
        `;
    },

    renderPlanTripPage(prefillDestination = '') {
        return `
            <section class="section">
                <div class="container" style="max-width: 800px;">
                    <div class="section-header" style="text-align: center; display: block; margin-bottom: 4rem;">
                        <h2 class="section-title" style="font-size: 3rem;">Plan Your <span class="text-gradient">Dream Trip</span></h2>
                        <p>Tell our AI about your preferences and get a custom itinerary in seconds.</p>
                    </div>
                    
                    <form id="planTripForm" class="glass" style="padding: 3rem; border-radius: 30px; box-shadow: var(--shadow-lg);">
                        <div class="form-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
                            <div class="form-group">
                                <label class="form-label">Where to?</label>
                                <input type="text" name="destination" id="destinationInput"
                                    placeholder="City, Region or Destination" required 
                                    value="${prefillDestination}"
                                    style="width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; font-family: inherit; font-size: 1rem;">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Number of Days</label>
                                <input type="number" name="days" min="3" max="14" value="3" required
                                    style="width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; font-family: inherit; font-size: 1rem;">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Budget Range</label>
                                <select name="budget" style="width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; appearance: none; font-family: inherit; font-size: 1rem; background: white;">
                                    <option value="budget">Economy (₹)</option>
                                    <option value="mid" selected>Standard (₹₹)</option>
                                    <option value="luxury">Luxury (₹₹₹)</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Travel Style</label>
                                <select name="style" style="width: 100%; padding: 1rem; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; appearance: none; font-family: inherit; font-size: 1rem; background: white;">
                                    <option value="relaxed">Relaxed</option>
                                    <option value="balanced" selected>Balanced</option>
                                    <option value="active">Active / Adventure</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-group" style="margin-top: 2rem;">
                            <label class="form-label">Interests <span style="font-weight: 400; color: var(--text-muted);">(select all that apply)</span></label>
                            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 0.5rem;">
                                <label class="chip-label"><input type="checkbox" name="interests" value="nature"> 🌿 Nature</label>
                                <label class="chip-label"><input type="checkbox" name="interests" value="culture"> 🎭 Culture</label>
                                <label class="chip-label"><input type="checkbox" name="interests" value="food"> 🍜 Food</label>
                                <label class="chip-label"><input type="checkbox" name="interests" value="history"> 🏛️ History</label>
                                <label class="chip-label"><input type="checkbox" name="interests" value="adventure"> 🧗 Adventure</label>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" id="generateBtn"
                            style="width: 100%; margin-top: 3rem; padding: 1.25rem; font-size: 1.1rem;">
                            Generate Smart Itinerary ✨
                        </button>
                    </form>

                    <!-- Itinerary result injected here -->
                    <div id="itineraryResult"></div>
                </div>
            </section>
        `;
    },

    // ─── Itinerary Result View ───────────────────────────────────────────────

    renderItineraryResult(trip) {
        const { destination, days, budgetLabel, style, itinerary, budgetBreakdown, dateAdded } = trip;

        const dayCards = itinerary.map((day, i) => this.renderDayCard(day, i)).join('');
        const budgetRows = budgetBreakdown.rows.map(row => `
            <div class="budget-row">
                <span class="budget-cat">${row.category}</span>
                <span class="budget-per">${budgetBreakdown.currency}${row.perDay.toLocaleString('en-IN')}/day</span>
                <span class="budget-total">${budgetBreakdown.currency}${row.total.toLocaleString('en-IN')}</span>
            </div>
        `).join('');

        const styleLabel = { relaxed: 'Relaxed 😌', balanced: 'Balanced 🎯', active: 'Active 🔥' }[style] || style;
        const interests = (trip.interests || []).map(i => `<span class="activity-tag">${i}</span>`).join('');

        return `
            <div class="itinerary-result" id="itineraryResultCard">
                <!-- Summary Banner -->
                <div class="itinerary-banner">
                    <img src="${trip.image}" alt="${destination}" class="itinerary-banner-img"
                        onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop'">
                    <div class="itinerary-banner-overlay">
                        <div class="itinerary-banner-content">
                            <span class="itinerary-badge">${budgetLabel} • ${styleLabel}</span>
                            <h2 class="itinerary-title">${destination}</h2>
                            <p class="itinerary-subtitle">${days}-Day Smart Itinerary &nbsp;·&nbsp; Generated on ${dateAdded}</p>
                            ${interests ? `<div style="margin-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">${interests}</div>` : ''}
                        </div>
                    </div>
                </div>

                <!-- Controls -->
                <div class="itinerary-controls">
                    <button class="btn btn-secondary" onclick="app.collapseAllDays()">Collapse All</button>
                    <button class="btn btn-secondary" onclick="app.expandAllDays()">Expand All</button>
                    <button class="btn btn-primary" onclick="app.saveTrip()" id="saveTripBtn">💾 Save to My Trips</button>
                </div>

                <!-- Day-by-Day Accordion -->
                <div class="day-accordion" id="dayAccordion">
                    ${dayCards}
                </div>

                <!-- Budget Breakdown -->
                <div class="budget-breakdown glass">
                    <h3 class="budget-title">💰 Estimated Budget Breakdown</h3>
                    <p class="budget-note">Per person, based on ${budgetLabel.toLowerCase()} tier for ${days} days</p>
                    <div class="budget-table">
                        <div class="budget-header">
                            <span>Category</span>
                            <span>Per Day</span>
                            <span>Total</span>
                        </div>
                        ${budgetRows}
                        <div class="budget-grand">
                            <span>🏷️ Grand Total</span>
                            <span></span>
                            <span>${budgetBreakdown.currency}${budgetBreakdown.grandTotal.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                    <p class="budget-disclaimer">* Estimates only. Actual costs may vary depending on season, availability, and individual choices.</p>
                </div>

                <!-- Bottom CTA -->
                <div class="itinerary-cta">
                    <button class="btn btn-primary" onclick="app.saveTrip()" id="saveTripBtn2" style="padding: 1rem 2.5rem; font-size: 1rem;">
                        💾 Save to My Trips
                    </button>
                    <button class="btn btn-secondary" onclick="app.regenerateItinerary()" style="padding: 1rem 2rem; font-size: 1rem;">
                        🔄 Regenerate
                    </button>
                </div>
            </div>
        `;
    },

    renderDayCard(day, index) {
        const scheduleHtml = day.schedule.map(slot => `
            <div class="timeline-slot">
                <div class="timeline-slot-header">
                    <span class="slot-badge">${slot.slotEmoji} ${slot.slot}</span>
                    <span class="slot-duration">${slot.duration || ''}</span>
                </div>
                <div class="timeline-activity">
                    <span class="activity-emoji">${slot.emoji}</span>
                    <div>
                        <strong class="activity-name">${slot.name}</strong>
                        <p class="activity-desc">${slot.desc}</p>
                    </div>
                </div>
            </div>
        `).join('');

        // First day expanded by default
        const isOpen = index === 0;
        return `
            <div class="day-card ${isOpen ? 'expanded' : ''}" id="day-${index}">
                <button class="day-card-header" onclick="app.toggleDay(${index})">
                    <div>
                        <span class="day-number">Day ${day.day}</span>
                        <span class="day-theme">${day.theme}</span>
                    </div>
                    <span class="day-chevron">${isOpen ? '▲' : '▼'}</span>
                </button>
                <div class="day-card-body">
                    <div class="day-timeline">
                        ${scheduleHtml}
                    </div>
                    <div class="day-tip">
                        <p>${day.tip}</p>
                    </div>
                </div>
            </div>
        `;
    },

    // ─── My Trips Page ────────────────────────────────────────────────────────

    renderMyTripsPage() {
        const storedTrips = typeof Storage !== 'undefined' ? Storage.getTrips() : [];
        const allTrips = [...storedTrips].reverse(); // newest first

        const tripsHtml = allTrips.length
            ? allTrips.map(trip => this.createTripCard(trip)).join('')
            : `<div class="empty-state">
                <div class="empty-icon">🗺️</div>
                <h3>No trips planned yet</h3>
                <p>Generate your first smart itinerary and save it here!</p>
                <button class="btn btn-primary" onclick="window.location.hash='#planner'" style="margin-top: 1.5rem;">
                    Plan Your First Trip ✨
                </button>
               </div>`;

        return `
            <section class="section">
                <div class="container">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">My <span class="text-gradient">Planned Trips</span></h2>
                            <p>Revisit your generated itineraries and upcoming adventures.</p>
                        </div>
                        <button class="btn btn-primary" onclick="window.location.hash='#planner'">+ Plan New Trip</button>
                    </div>
                    <div class="destination-grid" id="myTripsGrid">
                        ${tripsHtml}
                    </div>
                </div>
            </section>

            <!-- Trip Detail Modal -->
            <div class="modal-overlay" id="tripModal" onclick="app.closeModal(event)">
                <div class="modal-box glass">
                    <div id="modalContent"></div>
                </div>
            </div>
        `;
    },

    createTripCard(trip) {
        const statusColors = { upcoming: '#2563eb', completed: '#10b981', draft: '#64748b' };
        const statusColor = statusColors[trip.status] || '#64748b';
        const hasItinerary = trip.itinerary && trip.itinerary.length > 0;

        return `
            <div class="card trip-card">
                <div style="position: relative;">
                    <img src="${trip.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800&auto=format&fit=crop'}"
                        alt="${trip.destination}" class="card-img" style="height: 200px;"
                        onerror="this.src='https://placehold.co/600x400?text=${encodeURIComponent(trip.destination)}'">
                    <span style="position: absolute; top: 1rem; right: 1rem; background: ${statusColor}; color: white;
                        padding: 0.25rem 0.75rem; border-radius: 50px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                        ${trip.status || 'saved'}
                    </span>
                </div>
                <div class="card-body">
                    <span class="card-tag">${trip.days || '?'} Days · ${trip.budgetLabel || trip.budget || 'Standard'}</span>
                    <h4 class="card-title">${trip.destination}</h4>
                    <p class="text-muted" style="font-size: 0.9rem;">${trip.itinerarySummary || 'A custom trip itinerary.'}</p>
                    <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
                        ${hasItinerary
                ? `<button class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;"
                                onclick="app.viewTripDetail(${trip.id})">View Itinerary</button>`
                : `<button class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;" disabled>No Detail</button>`
            }
                        <button class="btn btn-secondary" style="padding: 0.5rem 0.85rem; font-size: 0.85rem; color: #ef4444; border-color: #fee2e2;"
                            onclick="app.deleteTrip(${trip.id})">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    },

    // ─── Trip Detail Modal ────────────────────────────────────────────────────

    renderTripDetailModal(trip) {
        const dayCards = (trip.itinerary || []).map((day, i) => this.renderDayCard(day, i)).join('');

        const budgetRows = trip.budgetBreakdown
            ? trip.budgetBreakdown.rows.map(row => `
                <div class="budget-row">
                    <span class="budget-cat">${row.category}</span>
                    <span class="budget-per">${trip.budgetBreakdown.currency}${row.perDay.toLocaleString('en-IN')}/day</span>
                    <span class="budget-total">${trip.budgetBreakdown.currency}${row.total.toLocaleString('en-IN')}</span>
                </div>
              `).join('')
            : '';

        return `
            <button class="modal-close" onclick="app.closeModal()">✕</button>
            <div class="itinerary-banner" style="border-radius: 16px; overflow: hidden; margin-bottom: 2rem;">
                <img src="${trip.image}" alt="${trip.destination}" class="itinerary-banner-img"
                    onerror="this.src='https://placehold.co/800x400?text=${encodeURIComponent(trip.destination)}'">
                <div class="itinerary-banner-overlay">
                    <div class="itinerary-banner-content">
                        <h2 class="itinerary-title">${trip.destination}</h2>
                        <p class="itinerary-subtitle">${trip.days}-Day ${trip.budgetLabel || ''} Trip</p>
                    </div>
                </div>
            </div>
            <div class="day-accordion">${dayCards}</div>
            ${budgetRows ? `
            <div class="budget-breakdown glass" style="margin-top: 2rem;">
                <h3 class="budget-title">💰 Budget Breakdown</h3>
                <div class="budget-table">
                    <div class="budget-header"><span>Category</span><span>Per Day</span><span>Total</span></div>
                    ${budgetRows}
                    <div class="budget-grand">
                        <span>🏷️ Grand Total</span><span></span>
                        <span>${trip.budgetBreakdown.currency}${trip.budgetBreakdown.grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>` : ''}
        `;
    },

    renderDestinations(container, list) {
        if (!container) return;
        container.innerHTML = list.map(item => this.createDestinationCard(item)).join('');
    },
};
