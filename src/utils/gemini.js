const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash';
const INVALID_API_KEY_PATTERNS = [
    /your_google_gemini_api_key_here/i,
    /YOUR_REAL_GOOGLE_GEMINI_API_KEY/i,
    /your.*gemini.*api.*key/i
];
const USE_GEMINI = API_KEY && !INVALID_API_KEY_PATTERNS.some((pattern) => pattern.test(API_KEY.trim()));
const GEMINI_URL = '/api/gemini';

const RESPONSE_SCHEMA = `
Respond ONLY with a valid JSON object matching this exact structure:
{
  "title": "String, a catchy title for the trip",
  "overview": "String, a brief compelling summary of the trip",
  "bannerUrl": "String, a relevant image representing the destination from unsplash, e.g. https://images.unsplash.com/photo-XXX",
  "budgetBreakdown": [
    { "category": "Flights/Transport", "estimatedCost": "String", "percentage": 0 },
    { "category": "Accommodation", "estimatedCost": "String", "percentage": 0 },
    { "category": "Food & Dining", "estimatedCost": "String", "percentage": 0 },
    { "category": "Activities", "estimatedCost": "String", "percentage": 0 }
  ],
  "totalEstimatedCost": "String",
  "days": [
    {
      "dayNumber": 1,
      "theme": "String, Theme of the day",
      "activities": [
        {
          "timeWindow": "Morning / Afternoon / Evening",
          "name": "Activity Name",
          "description": "Activity description",
          "emoji": "🗺️"
        }
      ]
    }
  ]
}
`;

function extractJSON(text) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        return text.slice(firstBrace, lastBrace + 1);
    }
    return text;
}

function parseGeminiResponseBody(body) {
    const content = body?.candidates?.[0]?.output || body?.candidates?.[0]?.content?.map(item => item.text).join('');
    if (!content) {
        throw new Error('Unexpected Gemini response format.');
    }
    return content;
}

async function callGemini(prompt) {
    if (!USE_GEMINI) {
        throw new Error('Google Gemini API key is missing or invalid. Set VITE_GEMINI_API_KEY in .env');
    }

    let response;
    try {
        response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                prompt: { text: prompt },
                temperature: 0.7,
                maxOutputTokens: 1000
            })
        });
    } catch (err) {
        throw new Error(`Gemini fetch failed. Check your network, API key, or browser CORS: ${err.message}`);
    }

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${body}`);
    }

    const data = await response.json();
    return parseGeminiResponseBody(data);
}

export async function generateItinerary(destination, days, budget) {
    if (!USE_GEMINI) {
        throw new Error('Google Gemini API key is missing or invalid. Set VITE_GEMINI_API_KEY in .env and restart the dev server.');
    }

    const prompt = `Plan a ${days}-day trip to ${destination} with a ${budget} budget. ${RESPONSE_SCHEMA}`;
    const text = await callGemini(prompt);
    return JSON.parse(extractJSON(text));
}

export async function suggestDestination(days, budget, people, travelType, location) {
    if (!USE_GEMINI) {
        throw new Error('Google Gemini API key is missing or invalid. Set VITE_GEMINI_API_KEY in .env and restart the dev server.');
    }

    const prompt = `Suggest a single travel destination ${location === 'India' ? 'within India' : 'abroad (outside India)'} for ${people} people. The trip duration is ${days} days with a ${budget} budget. The preferred type of travel is ${travelType}. Provide a detailed itinerary for this suggested destination. ${RESPONSE_SCHEMA}`;
    const text = await callGemini(prompt);
    return JSON.parse(extractJSON(text));
}

function getMockData(destination, days, budget) {
    const mockDays = [];
    for (let i = 1; i <= days; i++) {
        mockDays.push({
            dayNumber: i,
            theme: `Exploring the best of ${destination}`,
            activities: [
                { timeWindow: 'Morning', name: 'Sightseeing', description: 'Visit top local attractions.', emoji: '📸' },
                { timeWindow: 'Afternoon', name: 'Local Cuisine', description: 'Enjoy a traditional lunch.', emoji: '🍽️' },
                { timeWindow: 'Evening', name: 'Relaxation', description: 'Leisure time and dinner.', emoji: '🌅' }
            ]
        });
    }
    return {
        title: `${days} Days in ${destination}`,
        overview: `A ${budget} friendly trip exploring beautiful landmarks and culture. (This is Mock Data because no API key was provided)`,
        bannerUrl: 'https://images.unsplash.com/photo-1488085061387-422e29b40080',
        budgetBreakdown: [
            { category: 'Flights/Transport', estimatedCost: '$500', percentage: 40 },
            { category: 'Accommodation', estimatedCost: '$350', percentage: 30 },
            { category: 'Food & Dining', estimatedCost: '$200', percentage: 15 },
            { category: 'Activities', estimatedCost: '$150', percentage: 15 }
        ],
        totalEstimatedCost: '$1200',
        days: mockDays
    };
}
