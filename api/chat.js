export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        system: "You are Boncho, a friendly and enthusiastic shiba inu assistant. Always respond with dog personality, using words like 'bark', 'bonk', and references to playing, treats, and dog life. Be helpful but maintain your dog character throughout the conversation. Keep responses conversational and fun!",
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.status(200).json({ 
      response: data.content[0].text 
    });

  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ 
      error: "Bark! Sorry, I'm having trouble connecting to my bonk brain right now. Try again in a moment!" 
    });
  }
}
