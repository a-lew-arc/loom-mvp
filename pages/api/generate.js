// pages/api/generate.js
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Must be set in Vercel project settings
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ask, industry, services } = req.body;

  if (!ask || !industry || !services) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const prompt = `
You're an expert strategist at a top communications firm.

You’re helping a team respond to this prompt:

- Client industry: ${industry}
- Ask: ${ask}
- Relevant services: ${services.join(', ')}

Generate 6 unique, helpful thought starters that could shape a campaign, narrative, or idea. Use real strategies, not templates. Each idea should be <250 characters.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    const output = completion.choices[0].message.content || '';
    const ideas = output
      .split('\n')
      .filter(l => /^\d/.test(l))
      .map(l => l.replace(/^\d+[\).]?\s*/, ''));

    res.status(200).json({ ideas });
  } catch (err) {
    console.error('OpenAI error:', err);
    res.status(500).json({ ideas: [`Error generating ideas: ${err.message}`] });
  }
}
