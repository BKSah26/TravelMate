const destinations = [
    {
        id: 1,
        title: "Leh-Ladakh Adventure",
        location: "Ladakh, India",
        category: "adventure",
        image: "https://plus.unsplash.com/premium_photo-1661962344178-19930ba15492?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹45,000",
        duration: "7 Days",
        rating: 4.8,
        description: "Experience high-altitude passes, stunning monasteries, and the crystal-clear Pangong Lake."
    },
    {
        id: 2,
        title: "Varanasi Spiritual Walk",
        location: "Uttar Pradesh, India",
        category: "heritage",
        image: "https://images.unsplash.com/photo-1627938823193-fd13c1c867dd?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹15,000",
        duration: "3 Days",
        rating: 4.9,
        description: "Witness the mystical evening Ganga Aarti and explore the world's oldest living city."
    },
    {
        id: 3,
        title: "Kerala Backwater Bliss",
        location: "Kerala, India",
        category: "nature",
        image: "https://plus.unsplash.com/premium_photo-1697729600773-5b039ef17f3b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹25,000",
        duration: "5 Days",
        rating: 4.7,
        description: "Retreat into luxury houseboats amidst emerald green waters and coconut groves."
    },
    {
        id: 4,
        title: "Rishikesh Yoga & Rafting",
        location: "Uttarakhand, India",
        category: "adventure",
        image: "https://images.unsplash.com/photo-1603867106100-0d2039fc8757?q=80&w=881&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹12,000",
        duration: "4 Days",
        rating: 4.9,
        description: "Find your inner peace or conquer the Ganges rapids in the yoga capital of the world."
    },
    {
        id: 5,
        title: "Jaipur Royalty Tour",
        location: "Rajasthan, India",
        category: "heritage",
        image: "https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹20,000",
        duration: "4 Days",
        rating: 4.6,
        description: "Explore the Pink City's grand palaces, majestic forts, and vibrant local markets."
    },
    {
        id: 6,
        title: "Munnar Tea Gardens",
        location: "Kerala, India",
        category: "nature",
        image: "https://plus.unsplash.com/premium_photo-1697730314165-2cd71dc3a6a4?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹18,000",
        duration: "3 Days",
        rating: 4.8,
        description: "Walk through rolling hills covered in lush tea plantations and misty valleys."
    },
    {
        id: 7,
        title: "Hampi Ruins Exploration",
        location: "Karnataka, India",
        category: "heritage",
        image: "https://plus.unsplash.com/premium_photo-1697730337612-8bd916249e30?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹14,000",
        duration: "3 Days",
        rating: 4.8,
        description: "Discover the remnants of the Vijayanagara Empire amidst boulder-strewn landscapes."
    },
    {
        id: 8,
        title: "Goa Beach Adventure",
        location: "Goa, India",
        category: "adventure",
        image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹22,000",
        duration: "4 Days",
        rating: 4.7,
        description: "From water sports to vibrant nightlife, experience the ultimate coastal escape."
    },
    {
        id: 9,
        title: "Gulmarg Ski Retreat",
        location: "Kashmir, India",
        category: "adventure",
        image: "https://images.unsplash.com/photo-1676441019594-07142b925bc2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹35,000",
        duration: "5 Days",
        rating: 4.9,
        description: "Powder-soft snow and the world's highest cable car await in this winter paradise."
    },
    {
        id: 10,
        title: "Udaipur Lake Palace",
        location: "Rajasthan, India",
        category: "heritage",
        image: "https://plus.unsplash.com/premium_photo-1661964079694-ccfaf7dc8028?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹28,000",
        duration: "3 Days",
        rating: 4.8,
        description: "The City of Lakes offers romantic boat rides and stunning royal architecture."
    },
    {
        id: 11,
        title: "Andaman Island Snorkeling",
        location: "Andaman & Nicobar, India",
        category: "nature",
        image: "https://plus.unsplash.com/premium_photo-1661962958462-9e52fda9954d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹55,000",
        duration: "6 Days",
        rating: 4.9,
        description: "Dive into turquoise waters to witness vibrant coral reefs and marine life."
    },
    {
        id: 12,
        title: "Khajuraho Temple Tour",
        location: "Madhya Pradesh, India",
        category: "heritage",
        image: "https://images.unsplash.com/photo-1708627664712-85087ba123bc?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹16,000",
        duration: "3 Days",
        rating: 4.7,
        description: "Marvel at the intricate carvings of UNESCO World Heritage Hindu and Jain temples."
    },
    {
        id: 13,
        title: "Spiti Valley Road Trip",
        location: "Himachal Pradesh, India",
        category: "adventure",
        image: "https://plus.unsplash.com/premium_photo-1661878309257-f4343940ce4d?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹40,000",
        duration: "10 Days",
        rating: 4.9,
        description: "A rugged journey through cold desert landscapes and remote mountain villages."
    },
    {
        id: 14,
        title: "Coorg Coffee Highlands",
        location: "Karnataka, India",
        category: "nature",
        image: "https://images.unsplash.com/photo-1599922760936-e840fa373d8d?q=80&w=978&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹19,000",
        duration: "4 Days",
        rating: 4.8,
        description: "Savor the aroma of sprawling coffee plantations in the Scotland of India."
    },
    {
        id: 15,
        title: "Jaisalmer Desert Safari",
        location: "Rajasthan, India",
        category: "adventure",
        image: "https://images.unsplash.com/photo-1700756102943-fa388b2ed119?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "₹24,000",
        duration: "4 Days",
        rating: 4.7,
        description: "Ride camels through the Thar Desert and stay overnight under starlit skies."
    }
];

const mockUser = {
    name: "John Doe",
    preferences: {
        interests: ["nature", "heritage"],
        budget: "mid",
        pace: "balanced"
    }
};
const myTrips = [
    {
        id: 101,
        destination: "Leh-Ladakh Adventure",
        dateRange: "June 15 - June 22, 2026",
        status: "upcoming",
        image: "https://images.unsplash.com/photo-1491497895121-1334fc14d8c9?q=80&w=800&auto=format&fit=crop",
        itinerarySummary: "A 7-day high-altitude journey through Ladakh's monastaries and lakes."
    },
    {
        id: 102,
        destination: "Kerala Backwaters",
        dateRange: "Dec 10 - Dec 15, 2025",
        status: "completed",
        image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
        itinerarySummary: "Relaxing houseboat retreat through the tranquil backwaters of Alleppey."
    }
];
