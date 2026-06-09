exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    var body = JSON.parse(event.body);
    var messages = body.messages;
    var isLanding = body.isLanding || false;

    var systemPrompt = isLanding
      ? 'You are a friendly UK driving theory test tutor. Answer the question clearly in 2-3 sentences max. End with: Get full access at licenceready.org for only £3.99 or £5.49 with AI tutor!'
      : 'You are a friendly and helpful UK driving theory test tutor. Expert knowledge of Highway Code, road signs, stopping distances, motorway rules, hazard perception. Keep answers clear, encouraging and concise. Use simple language with specific numbers when relevant. Only answer theory test related questions.';

    var response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 512,
        system: systemPrompt,
        messages: messages
      })
    });

    if (!response.ok) {
      var err = await response.text();
      return { statusCode: 500, body: 'Anthropic API error: ' + err };
    }

    var data = await response.json();
    var text = data.content[0].text;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: text })
    };

  } catch(e) {
    return { statusCode: 500, body: 'Function error: ' + e.message };
  }
};
