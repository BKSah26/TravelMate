import { useState } from 'react';
import { generateItinerary, suggestDestination } from '../utils/gemini';

export default function Planner() {
    const [mode, setMode] = useState('plan'); // 'plan' or 'suggest'
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [itinerary, setItinerary] = useState(null);
    const [expandedDays, setExpandedDays] = useState({});

    // Plan state
    const [planData, setPlanData] = useState({ destination: '', days: 3, budget: 'Moderate' });
    
    // Suggest state
    const [suggestData, setSuggestData] = useState({ days: 5, budget: 'Moderate', people: 2, travelType: 'Adventure', location: 'India' });

    const handlePlanSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setItinerary(null);
        try {
            const data = await generateItinerary(planData.destination, planData.days, planData.budget);
            setItinerary(data);
            setExpandedDays({ 1: true }); // auto expand day 1
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setItinerary(null);
        try {
            const data = await suggestDestination(suggestData.days, suggestData.budget, suggestData.people, suggestData.travelType, suggestData.location);
            setItinerary(data);
            setExpandedDays({ 1: true }); // auto expand day 1
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleDay = (dayNum) => {
        setExpandedDays(prev => ({...prev, [dayNum]: !prev[dayNum]}));
    };

    return (
        <section className="section" id="planner">
            <div className="container">
                <div className="section-header" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <h2 className="section-title">AI Trip Planner</h2>
                    <p className="text-muted">Let artificial intelligence build your perfect itinerary.</p>
                </div>

                {/* Mode Selector */}
                {!itinerary && !isLoading && !error && (
                    <div className="filters" style={{ justifyContent: 'center', marginBottom: '3rem' }}>
                        <button className={mode === 'plan' ? 'filter-btn active' : 'filter-btn'} onClick={() => setMode('plan')}>Plan a Trip</button>
                        <button className={mode === 'suggest' ? 'filter-btn active' : 'filter-btn'} onClick={() => setMode('suggest')}>Suggest a Trip</button>
                    </div>
                )}

                {/* Forms */}
                {!itinerary && !isLoading && !error && (
                    <div className="glass" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem', borderRadius: '24px' }}>
                        {mode === 'plan' ? (
                            <form onSubmit={handlePlanSubmit}>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label className="form-label">Destination</label>
                                    <input type="text" className="search-input" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white' }} placeholder="e.g. Paris, Tokyo, Bali" value={planData.destination} onChange={e => setPlanData({...planData, destination: e.target.value})} required />
                                </div>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <label className="form-label">Duration (Days)</label>
                                        <input type="number" min="1" max="14" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} value={planData.days} onChange={e => setPlanData({...planData, days: e.target.value})} required />
                                    </div>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <label className="form-label">Budget Range</label>
                                        <select style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} value={planData.budget} onChange={e => setPlanData({...planData, budget: e.target.value})}>
                                            <option value="Budget">Budget</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Luxury">Luxury</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span>Generate Itinerary</span>
                                    <span>✨</span>
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSuggestSubmit}>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <label className="form-label">Duration (Days)</label>
                                        <input type="number" min="1" max="14" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} value={suggestData.days} onChange={e => setSuggestData({...suggestData, days: e.target.value})} required />
                                    </div>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <label className="form-label">Travelers</label>
                                        <input type="number" min="1" max="10" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} value={suggestData.people} onChange={e => setSuggestData({...suggestData, people: e.target.value})} required />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <label className="form-label">Budget Range</label>
                                        <select style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} value={suggestData.budget} onChange={e => setSuggestData({...suggestData, budget: e.target.value})}>
                                            <option value="Budget">Budget</option>
                                            <option value="Moderate">Moderate</option>
                                            <option value="Luxury">Luxury</option>
                                        </select>
                                    </div>
                                    <div style={{ flex: '1 1 200px' }}>
                                        <label className="form-label">Travel Style</label>
                                        <select style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} value={suggestData.travelType} onChange={e => setSuggestData({...suggestData, travelType: e.target.value})}>
                                            <option value="Nature">Nature</option>
                                            <option value="Adventure">Adventure</option>
                                            <option value="Culture & History">Culture & History</option>
                                            <option value="Relaxing">Relaxing</option>
                                            <option value="City Break">City Break</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label className="form-label">Location Preference</label>
                                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }} value={suggestData.location} onChange={e => setSuggestData({...suggestData, location: e.target.value})}>
                                        <option value="India">Within India</option>
                                        <option value="Abroad">Abroad (Outside India)</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span>Suggest a Trip</span>
                                    <span>✨</span>
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {/* State: Loading */}
                {isLoading && (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <h3 className="section-title">Generating your perfect trip...</h3>
                        <p className="text-muted">Our AI is analyzing thousands of possibilities.</p>
                        <div style={{ marginTop: '2rem', fontSize: '3rem' }}>
                            ✨
                        </div>
                    </div>
                )}

                {/* State: Error */}
                {error && (
                    <div className="glass" style={{ padding: '2rem', textAlign: 'center', color: '#dc2626', borderColor: '#fca5a5', maxWidth: '600px', margin: '0 auto', borderRadius: '24px' }}>
                        <h3>Oops! Something went wrong.</h3>
                        <p style={{ marginTop: '1rem', opacity: 0.8 }}>{error}</p>
                        <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }} onClick={() => setError(null)}>Go Back and Try Again</button>
                    </div>
                )}

                {/* Render Result */}
                {itinerary && (
                    <div className="itinerary-result">
                        <div className="itinerary-banner">
                            <img src={itinerary.bannerUrl || 'https://images.unsplash.com/photo-1488085061387-422e29b40080'} alt="Destination" className="itinerary-banner-img" />
                            <div className="itinerary-banner-overlay">
                                <div className="itinerary-banner-content">
                                    <span className="itinerary-badge">AI Generated Plan</span>
                                    <h2 className="itinerary-title">{itinerary.title}</h2>
                                    <p className="itinerary-subtitle">{itinerary.overview}</p>
                                </div>
                            </div>
                        </div>

                        <div className="itinerary-controls" style={{ justifyContent: 'space-between' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Your Custom Plan</h3>
                            <button className="btn btn-secondary" onClick={() => setItinerary(null)}>Create Another Plan</button>
                        </div>

                        <div className="budget-breakdown glass">
                            <h3 className="budget-title">Estimated Budget</h3>
                            <p className="budget-note">Total Estimated Cost: <strong>{itinerary.totalEstimatedCost}</strong></p>
                            
                            <div className="budget-table">
                                <div className="budget-header">
                                    <div>Category</div>
                                    <div>Cost</div>
                                    <div>Percentage</div>
                                </div>
                                {itinerary.budgetBreakdown && itinerary.budgetBreakdown.map((item, idx) => (
                                    <div className="budget-row" key={idx}>
                                        <div className="budget-cat">{item.category}</div>
                                        <div className="budget-total">{item.estimatedCost}</div>
                                        <div className="budget-per">{item.percentage}%</div>
                                    </div>
                                ))}
                                <div className="budget-grand">
                                    <span>Total Estimation</span>
                                    <span>{itinerary.totalEstimatedCost}</span>
                                </div>
                            </div>
                        </div>

                        <div className="day-accordion">
                            {itinerary.days && itinerary.days.map((day) => {
                                const isExpanded = expandedDays[day.dayNumber];
                                return (
                                    <div className={`day-card ${isExpanded ? 'expanded' : ''}`} key={day.dayNumber}>
                                        <button className="day-card-header" onClick={() => toggleDay(day.dayNumber)}>
                                            <div style={{ textAlign: 'left' }}>
                                                <span className="day-number">Day {day.dayNumber}</span>
                                                <span className="day-theme">{day.theme}</span>
                                            </div>
                                            <span className="day-chevron" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                                        </button>
                                        <div className="day-card-body">
                                            <div className="day-timeline">
                                                {day.activities && day.activities.map((act, idx) => (
                                                    <div className="timeline-slot" key={idx}>
                                                        <div className="timeline-slot-header">
                                                            <span className="slot-badge">{act.timeWindow}</span>
                                                        </div>
                                                        <div className="timeline-activity">
                                                            <span className="activity-emoji">{act.emoji}</span>
                                                            <div>
                                                                <span className="activity-name">{act.name}</span>
                                                                <p className="activity-desc">{act.description}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
