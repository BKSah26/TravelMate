const Storage = {
    saveTrip(trip) {
        const trips = this.getTrips();
        trips.push({
            ...trip,
            id: Date.now(),
            createdAt: new Date().toISOString()
        });
        localStorage.setItem('travellermate_trips', JSON.stringify(trips));
    },

    getTrips() {
        const trips = localStorage.getItem('travellermate_trips');
        return trips ? JSON.parse(trips) : [];
    },

    deleteTrip(id) {
        const trips = this.getTrips().filter(t => t.id !== id);
        localStorage.setItem('travellermate_trips', JSON.stringify(trips));
    },

    saveUserPrefs(prefs) {
        localStorage.setItem('travellermate_user_prefs', JSON.stringify(prefs));
    },

    getUserPrefs() {
        const prefs = localStorage.getItem('travellermate_user_prefs');
        return prefs ? JSON.parse(prefs) : null;
    }
};
