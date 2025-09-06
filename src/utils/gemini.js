// Gemini 1.5 Flash API integration

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const getGeminiResponse = async (prompt) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.error('Gemini API key not found or not configured');
    return 'AI features are not available. Please add your Gemini API key to the .env file.';
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return 'Sorry, I encountered an error. Please try again later.';
  }
};

// Specific prompts for different use cases

export const generateEQImprovementPlan = async (assessmentResult) => {
  const prompt = `You are an EQ improvement coach. Here is the user's EQ assessment result:
${JSON.stringify(assessmentResult, null, 2)}

Please provide a 2-sentence personalized improvement plan focusing on their weakest area. Be encouraging and specific.`;

  return await getGeminiResponse(prompt);
};

export const generateJournalFeedback = async (journalEntry, mood, tags) => {
  const prompt = `Here is the user's journal entry: "${journalEntry}"
Mood: ${mood}/10
Emotions: ${tags.join(', ')}

Give 1 short supportive sentence to help them manage their emotions and improve their well-being. Be empathetic and practical.`;

  return await getGeminiResponse(prompt);
};

export const generateChatResponse = async (userMessage, context = '') => {
  const prompt = `You are a supportive EQ coach. The user is asking: "${userMessage}"
${context ? `Context: ${context}` : ''}

Provide a helpful, practical response in 2-3 sentences. Focus on emotional intelligence and practical strategies.`;

  return await getGeminiResponse(prompt);
};

