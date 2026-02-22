/**
 * TravellerMate – Itinerary Generation Engine
 * Generates a smart, day-wise travel plan using a rule-based activity bank.
 * No external API required.
 */

const ItineraryEngine = {

    // ─── Activity Bank ────────────────────────────────────────────────────────
    // Keyed by interest/category → budget tier → array of activity objects
    activityBank: {
        nature: {
            budget: [
                { name: "Local Nature Walk", emoji: "🌿", desc: "Explore a nearby nature trail or community garden — free & refreshing.", duration: "2 hrs" },
                { name: "Public Park Picnic", emoji: "🧺", desc: "Pack a simple meal and enjoy the outdoors at a local park.", duration: "3 hrs" },
                { name: "Sunrise Viewpoint", emoji: "🌅", desc: "Catch the sunrise from the best free viewpoint in the area.", duration: "1.5 hrs" },
                { name: "River / Lake Walk", emoji: "🏞️", desc: "Stroll along a riverside promenade or lakeside path.", duration: "2 hrs" },
                { name: "Bird Watching Spot", emoji: "🦜", desc: "Visit a well-known bird sanctuary or wetland area.", duration: "2.5 hrs" },
            ],
            mid: [
                { name: "Guided Nature Trek", emoji: "🥾", desc: "Join a guided group trek through forests or hillside trails.", duration: "4 hrs" },
                { name: "Waterfall Hike", emoji: "💦", desc: "Hike to a nearby waterfall with a picnic lunch on the way.", duration: "5 hrs" },
                { name: "Botanical Garden Tour", emoji: "🌸", desc: "Explore curated flora in a well-maintained botanical garden.", duration: "2 hrs" },
                { name: "Sunset Boat Ride", emoji: "🚣", desc: "Peaceful boat ride on a lake or river at golden hour.", duration: "1.5 hrs" },
                { name: "Eco-Farm Visit", emoji: "🌾", desc: "Visit an organic farm, learn about local agriculture and sample produce.", duration: "3 hrs" },
            ],
            luxury: [
                { name: "Private Jungle Safari", emoji: "🐘", desc: "Exclusive guided jeep safari in a national park.", duration: "4 hrs" },
                { name: "Houseboat Cruise", emoji: "🛥️", desc: "Privately chartered houseboat through serene backwaters.", duration: "Full Day" },
                { name: "Hot Air Balloon Ride", emoji: "🎈", desc: "Soar above the landscape at sunrise in a luxury balloon.", duration: "2 hrs" },
                { name: "Luxury Spa Retreat", emoji: "🧖", desc: "Rejuvenating full-body Ayurvedic spa session at a resort.", duration: "3 hrs" },
                { name: "Private Waterfall Camp", emoji: "🏕️", desc: "Overnight glamping near a private waterfall.", duration: "Evening" },
            ],
        },

        adventure: {
            budget: [
                { name: "Local Cycling Tour", emoji: "🚴", desc: "Rent a bicycle and explore the town's streets and outskirts.", duration: "3 hrs" },
                { name: "Street Food Exploration", emoji: "🍢", desc: "Follow a self-guided street food map to taste local snacks.", duration: "2 hrs" },
                { name: "Public Beach Day", emoji: "🏖️", desc: "Relax and explore a popular public beach at your own pace.", duration: "4 hrs" },
                { name: "Rock Scrambling", emoji: "🧗", desc: "Explore local rock formations with a free map from the visitor centre.", duration: "3 hrs" },
            ],
            mid: [
                { name: "White Water Rafting", emoji: "🌊", desc: "Thrilling river rafting through grade 2–3 rapids with safety gear.", duration: "3 hrs" },
                { name: "Zip-lining", emoji: "🪂", desc: "Soar through forest canopy on a multi-line zip-lining course.", duration: "2 hrs" },
                { name: "Scuba Snorkeling", emoji: "🤿", desc: "Gear up and dive into clear waters to discover coral reefs.", duration: "3 hrs" },
                { name: "ATV Desert Ride", emoji: "🏜️", desc: "Quad biking across sand dunes with a trained guide.", duration: "2 hrs" },
                { name: "Paragliding", emoji: "🪁", desc: "Tandem paragliding flight over scenic valleys or coastline.", duration: "1.5 hrs" },
            ],
            luxury: [
                { name: "Heli-skiing / Heli-trek", emoji: "🚁", desc: "Helicopter drop at a remote peak for an exclusive trek or ski run.", duration: "Full Day" },
                { name: "Private Deep-Sea Diving", emoji: "🐠", desc: "Chartered boat with a private diving instructor.", duration: "4 hrs" },
                { name: "Luxury Camel Safari", emoji: "🐪", desc: "Sunset camel ride through the desert, ending with a private camp dinner.", duration: "4 hrs" },
                { name: "Skydiving Experience", emoji: "🌌", desc: "Tandem skydive from 10,000 ft with certified instructors.", duration: "3 hrs" },
            ],
        },

        culture: {
            budget: [
                { name: "Free Museum Visit", emoji: "🏛️", desc: "Explore a government museum or public art gallery free of charge.", duration: "2 hrs" },
                { name: "Local Market Walk", emoji: "🛍️", desc: "Browse the weekly local bazaar for handicrafts and artefacts.", duration: "2 hrs" },
                { name: "Street Art Walk", emoji: "🎨", desc: "Self-guided tour of local street murals and graffiti art zones.", duration: "1.5 hrs" },
                { name: "Temple / Shrine Visit", emoji: "🛕", desc: "Visit a historically significant religious site in the area.", duration: "1 hrs" },
            ],
            mid: [
                { name: "Cultural Dance Show", emoji: "🩰", desc: "Evening performance of classical or folk dance at a local theatre.", duration: "2 hrs" },
                { name: "Cooking Class", emoji: "👨‍🍳", desc: "Learn to cook 3 regional dishes with a local chef.", duration: "3 hrs" },
                { name: "Heritage Walk Tour", emoji: "🏰", desc: "Guided heritage tour through the old city's historic quarters.", duration: "3 hrs" },
                { name: "Handicraft Workshop", emoji: "🏺", desc: "Try pottery, weaving, or painting with a local artisan.", duration: "2 hrs" },
            ],
            luxury: [
                { name: "Private History Tour", emoji: "📜", desc: "Personal historian-guided private tour of UNESCO-listed sites.", duration: "4 hrs" },
                { name: "Exclusive Art Exhibition", emoji: "🖼️", desc: "VIP evening access to a premium art gallery with a curator walkthrough.", duration: "2 hrs" },
                { name: "Royal Palace Dinner", emoji: "🍽️", desc: "Gala dinner at a heritage palace with cultural performances.", duration: "3 hrs" },
            ],
        },

        food: {
            budget: [
                { name: "Local Dhaba Breakfast", emoji: "🍛", desc: "Start the day at a beloved local eatery with regional breakfast dishes.", duration: "1 hr" },
                { name: "Street Food Trail", emoji: "🌮", desc: "Taste 5–6 iconic local street foods under budget.", duration: "2 hrs" },
                { name: "Spice Market Visit", emoji: "🌶️", desc: "Wander through a vibrant spice market and pick up local flavours.", duration: "1.5 hrs" },
            ],
            mid: [
                { name: "Food Tour with Guide", emoji: "🗺️", desc: "Curated 4-hour walking food tour through key neighbourhoods.", duration: "4 hrs" },
                { name: "Rooftop Restaurant Lunch", emoji: "🏙️", desc: "Lunch at a popular rooftop restaurant with panoramic city views.", duration: "1.5 hrs" },
                { name: "Regional Thali Experience", emoji: "🍱", desc: "Sit-down thali meal exploring the full breadth of local cuisine.", duration: "1.5 hrs" },
                { name: "Evening Food Festival", emoji: "🎪", desc: "Attend a local food festival or weekly food market event.", duration: "2 hrs" },
            ],
            luxury: [
                { name: "Fine-Dining Tasting Menu", emoji: "🥂", desc: "8-course tasting menu at a Michelin-style regional restaurant.", duration: "2.5 hrs" },
                { name: "Private Chef Dinner", emoji: "🧑‍🍳", desc: "Exclusive in-villa or courtyard dinner prepared by a private chef.", duration: "2 hrs" },
                { name: "Wine & Cheese Pairing", emoji: "🍷", desc: "Curated wine tasting paired with artisanal local cheeses.", duration: "1.5 hrs" },
            ],
        },

        history: {
            budget: [
                { name: "Fort or Ruins Visit", emoji: "🏯", desc: "Explore a historic fort or archaeological ruins (low or no-entry fee).", duration: "2 hrs" },
                { name: "Heritage Library", emoji: "📚", desc: "Browse rare manuscripts and photographs at a public heritage library.", duration: "1.5 hrs" },
                { name: "Old Town Walking Tour", emoji: "🚶", desc: "Self-guided walk through the historical quarters of the city.", duration: "2 hrs" },
            ],
            mid: [
                { name: "Museum Itinerary", emoji: "🏛️", desc: "In-depth visit covering 2 thematic museums with audio guides.", duration: "4 hrs" },
                { name: "Archaeological Site Tour", emoji: "⛏️", desc: "Guided exploration of an active or preserved archaeological site.", duration: "3 hrs" },
                { name: "Mandir / Mosque Complex", emoji: "🕌", desc: "Detailed tour of a historic religious complex with a local guide.", duration: "2 hrs" },
            ],
            luxury: [
                { name: "Private Historian Tour", emoji: "📖", desc: "VIP access to restricted areas of heritage monuments with a scholar.", duration: "5 hrs" },
                { name: "Sunset at Taj / Palace", emoji: "🕌", desc: "Exclusive golden-hour visit to an iconic heritage monument.", duration: "2 hrs" },
            ],
        },

        // Generic fallback activities usable for any destination
        generic: {
            budget: [
                { name: "Morning Café Breakfast", emoji: "☕", desc: "Find the city's best-rated affordable breakfast café.", duration: "1 hr" },
                { name: "City Orientation Walk", emoji: "🗺️", desc: "Get your bearings with a casual self-guided walk around the city centre.", duration: "2 hrs" },
                { name: "Sunset Viewpoint", emoji: "🌇", desc: "Head to the most scenic viewpoint for sunset photographs.", duration: "1.5 hrs" },
                { name: "Local Evening Stroll", emoji: "🌙", desc: "Wind down with an evening walk, local tea, and people-watching.", duration: "2 hrs" },
            ],
            mid: [
                { name: "Day Trip to Outskirts", emoji: "🚗", desc: "Rent a car or bike and explore a scenic spot 20–40 km outside the city.", duration: "Full Day" },
                { name: "Spa & Wellness Session", emoji: "🛁", desc: "Mid-journey rejuvenation with a 90-minute spa treatment.", duration: "1.5 hrs" },
                { name: "Specialty Coffee & Work", emoji: "💻", desc: "Explore the city's café culture; great for slow mornings.", duration: "2 hrs" },
            ],
            luxury: [
                { name: "Personal Concierge Day", emoji: "🎩", desc: "A full day planned by your hotel's luxury concierge team.", duration: "Full Day" },
                { name: "Rooftop Pool Afternoon", emoji: "🏊", desc: "Unwind at your resort's rooftop infinity pool with city views.", duration: "2 hrs" },
            ],
        },
    },

    // ─── Budget Tiers ─────────────────────────────────────────────────────────
    budgetConfig: {
        budget: { label: "Economy", tier: "budget", accommodation: 800, food: 400, activities: 300, currency: "₹" },
        mid: { label: "Standard", tier: "mid", accommodation: 2500, food: 1000, activities: 800, currency: "₹" },
        luxury: { label: "Luxury", tier: "luxury", accommodation: 7000, food: 2500, activities: 3000, currency: "₹" },
    },

    // ─── Style intensity ──────────────────────────────────────────────────────
    styleConfig: {
        relaxed: { activitiesPerDay: 2, restNote: "Relaxed pace — rest time built in after each activity." },
        balanced: { activitiesPerDay: 3, restNote: "Balanced schedule — mix of exploration and downtime." },
        active: { activitiesPerDay: 4, restNote: "Packed schedule — lots of ground to cover each day!" },
    },

    // ─── Main Entry Point ─────────────────────────────────────────────────────
    /**
     * @param {object} formData  - { destination, days, budget, style, interests: string[] }
     * @returns {object}         - Full trip object with itinerary array
     */
    generateItinerary(formData) {
        const { destination, days, budget, style, interests } = formData;
        const numDays = Math.max(3, Math.min(parseInt(days) || 3, 14));
        const budgetCfg = this.budgetConfig[budget] || this.budgetConfig.mid;
        const styleCfg = this.styleConfig[style] || this.styleConfig.balanced;
        const interestList = Array.isArray(interests) ? interests : (interests ? [interests] : []);

        const itinerary = [];
        for (let i = 1; i <= numDays; i++) {
            itinerary.push(this._buildDayPlan(i, destination, {
                budgetCfg, styleCfg, interestList
            }));
        }

        const budgetBreakdown = this._estimateBudget(numDays, budgetCfg);

        return {
            id: Date.now(),
            destination,
            days: numDays,
            budget: budget,
            budgetLabel: budgetCfg.label,
            style,
            interests: interestList,
            status: "upcoming",
            createdAt: new Date().toISOString(),
            dateAdded: new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
            itinerarySummary: `${numDays}-day ${budgetCfg.label.toLowerCase()} trip to ${destination} — ${styleCfg.restNote}`,
            image: this._getDestinationImage(destination),
            itinerary,
            budgetBreakdown,
        };
    },

    // ─── Day Plan Builder ─────────────────────────────────────────────────────
    _buildDayPlan(dayNumber, destination, { budgetCfg, styleCfg, interestList }) {
        const pool = this._buildActivityPool(budgetCfg.tier, interestList);
        const count = styleCfg.activitiesPerDay;

        // Shuffle & pick unique activities
        const shuffled = this._shuffle([...pool]);
        const picked = shuffled.slice(0, count);

        const slots = ["Morning", "Afternoon", "Evening"];
        const slotEmojis = { Morning: "🌅", Afternoon: "☀️", Evening: "🌙" };

        const schedule = slots.slice(0, count).map((slot, i) => ({
            slot,
            slotEmoji: slotEmojis[slot],
            ...(picked[i] || this._fallback(budgetCfg.tier))
        }));

        return {
            day: dayNumber,
            label: `Day ${dayNumber}`,
            theme: this._dayTheme(dayNumber, destination),
            schedule,
            tip: this._randomTip(destination, dayNumber),
        };
    },

    // ─── Activity Pool ────────────────────────────────────────────────────────
    _buildActivityPool(tier, interestList) {
        let pool = [];
        const bankKeys = interestList.length
            ? interestList.filter(i => this.activityBank[i])
            : Object.keys(this.activityBank).filter(k => k !== "generic");

        bankKeys.forEach(key => {
            const bucket = this.activityBank[key];
            if (bucket && bucket[tier]) pool.push(...bucket[tier]);
        });

        // Always mix in some generic fallbacks so days feel distinct
        const generic = this.activityBank.generic[tier] || this.activityBank.generic.mid;
        pool.push(...generic);

        return pool;
    },

    _fallback(tier) {
        const g = this.activityBank.generic;
        const bank = g[tier] || g.mid;
        return bank[Math.floor(Math.random() * bank.length)];
    },

    // ─── Budget Estimator ─────────────────────────────────────────────────────
    _estimateBudget(numDays, budgetCfg) {
        const { accommodation, food, activities, currency, label } = budgetCfg;
        const totalAccom = accommodation * numDays;
        const totalFood = food * numDays;
        const totalActivities = activities * numDays;
        const misc = Math.round((totalAccom + totalFood + totalActivities) * 0.08);
        const total = totalAccom + totalFood + totalActivities + misc;

        return {
            currency,
            label,
            rows: [
                { category: "🛏️ Accommodation", perDay: accommodation, total: totalAccom },
                { category: "🍽️ Food & Dining", perDay: food, total: totalFood },
                { category: "🎟️ Activities", perDay: activities, total: totalActivities },
                { category: "🧾 Miscellaneous", perDay: Math.round(misc / numDays), total: misc },
            ],
            grandTotal: total,
            perPerson: total,
        };
    },

    // ─── Helpers ──────────────────────────────────────────────────────────────
    _dayTheme(dayNum, destination) {
        const themes = [
            `Arrival & First Impressions of ${destination}`,
            `Exploring the Heart of ${destination}`,
            `Hidden Gems & Local Life`,
            `Adventure & Outdoors`,
            `Culture, History & Heritage`,
            `Food, Markets & Local Flavour`,
            `Day Trips & Scenic Escapes`,
            `Relaxation & Reflection`,
            `Shopping & Souvenirs`,
            `Farewell Day — Last Experiences`,
        ];
        return themes[(dayNum - 1) % themes.length];
    },

    _randomTip(destination, day) {
        const tips = [
            `💡 Carry a refillable water bottle — staying hydrated is key while exploring.`,
            `💡 Download offline maps for ${destination} before heading out.`,
            `💡 Ask your hotel reception for their personal local recommendations today.`,
            `💡 Start early to beat crowds at popular spots.`,
            `💡 Try negotiating politely at local markets — it's part of the culture!`,
            `💡 Keep small change handy for entry fees and street food.`,
            `💡 Wear comfortable walking shoes — you'll cover more ground than you expect.`,
            `💡 The best photo light is in the first and last hours of the day.`,
            `💡 Book popular restaurants or experiences in advance to avoid disappointment.`,
            `💡 Don't forget to back up your photos at the end of the day!`,
        ];
        return tips[(day - 1) % tips.length];
    },

    _getDestinationImage(destination) {
        // Match known destinations from mockData
        const known = typeof destinations !== "undefined" ? destinations : [];
        const match = known.find(d =>
            d.title.toLowerCase().includes(destination.toLowerCase()) ||
            d.location.toLowerCase().includes(destination.toLowerCase()) ||
            destination.toLowerCase().includes(d.title.split(" ")[0].toLowerCase())
        );
        if (match) return match.image;

        // Fallback to a beautiful generic travel photo
        return `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop`;
    },

    _shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    },
};
