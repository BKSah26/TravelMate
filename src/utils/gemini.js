import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY && API_KEY !== 'your_google_gemini_api_key_here') {
    genAI = new GoogleGenerativeAI(API_KEY);
}

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

export async function generateItinerary(destination, days, budget) {
    if (!genAI) {
        console.warn("Using mock data as Gemini API key is missing.");
        await new Promise(r => setTimeout(r, 1500)); // Simulate network delay
        return getMockData(destination, days, budget);
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Plan a ${days}-day trip to ${destination} with a ${budget} budget. ${RESPONSE_SCHEMA}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(extractJSON(response.text()));
}

export async function suggestDestination(days, budget, people, travelType, location) {
    if (!genAI) {
        console.warn("Using mock data as Gemini API key is missing.");
        await new Promise(r => setTimeout(r, 1500));
        return getMockData("Switzerland (Mock Suggestion)", days, budget);
    }
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Suggest a single travel destination ${location === 'India' ? 'within India' : 'abroad (outside India)'} for ${people} people. The trip duration is ${days} days with a ${budget} budget. The preferred type of travel is ${travelType}. Provide a detailed itinerary for this suggested destination. ${RESPONSE_SCHEMA}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(extractJSON(response.text()));
}

function getMockData(destination, days, budget) {
    const mockDays = [];
    for (let i = 1; i <= days; i++) {
        mockDays.push({
            dayNumber: i,
            theme: `Exploring the best of ${destination}`,
            activities: [
                { timeWindow: "Morning", name: "Sightseeing", description: "Visit top local attractions.", emoji: "📸" },
                { timeWindow: "Afternoon", name: "Local Cuisine", description: "Enjoy a traditional lunch.", emoji: "🍽️" },
                { timeWindow: "Evening", name: "Relaxation", description: "Leisure time and dinner.", emoji: "🌅" }
            ]
        });
    }
    return {
        title: `${days} Days in ${destination}`,
        overview: `A ${budget} friendly trip exploring beautiful landmarks and culture. (This is Mock Data because no API key was provided)`,
        bannerUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080",
        budgetBreakdown: [
            { category: "Flights/Transport", estimatedCost: "$500", percentage: 40 },
            { category: "Accommodation", estimatedCost: "$350", percentage: 30 },
            { category: "Food & Dining", estimatedCost: "$200", percentage: 15 },
            { category: "Activities", estimatedCost: "$150", percentage: 15 }
        ],
        totalEstimatedCost: "$1200",
        days: mockDays
    };
}
