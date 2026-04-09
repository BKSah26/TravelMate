import { useState } from 'react';
import DestinationCard from '../components/DestinationCard';
import { destinations } from '../data/mockData';

export default function Discover() {
    const [filter, setFilter] = useState('all');

    const filteredDestinations = filter === 'all' 
        ? destinations 
        : destinations.filter(d => d.category === filter);

    return (
        <section className="section" id="discover">
            <section className="hero" style={{marginBottom: '3rem'}}>
                <div className="container hero-content">
                    <h2 className="hero-title">Your Next Adventure, <br/><span className="text-gradient">Intelligently Planned.</span></h2>
                    <p className="hero-subtitle">Discover hidden gems and receive personalized itineraries tailored to your pace and budget.</p>
                </div>
            </section>
            <div className="container">
                <div className="section-header">
                    <div>
                        <h3 className="section-title">Trending Destinations</h3>
                        <p>Popular choices by the TravellerMate community</p>
                    </div>
                    <div className="filters">
                        {['all', 'nature', 'adventure', 'heritage'].map(f => (
                            <button 
                                key={f}
                                className={`filter-btn ${filter === f ? 'active' : ''}`} 
                                onClick={() => setFilter(f)}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="destination-grid">
                    {filteredDestinations.map(dest => (
                        <DestinationCard key={dest.id} destination={dest} />
                    ))}
                </div>
            </div>
        </section>
    );
}
