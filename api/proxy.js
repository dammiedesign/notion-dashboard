// api/proxy.js
// Deploy this file to Vercel at /api/proxy.js
// Add ANTHROPIC_API_KEY to your Vercel environment variables

export default async function handler(req, res) {
  // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

          if (req.method === 'OPTIONS') {
              return res.status(200).end();
                }

                  if (req.method !== 'POST') {
                      return res.status(405).json({ error: 'Method not allowed' });
                        }

                          const { messages, mcp_servers } = req.body;

                            // Validate input
                              if (!messages || !Array.isArray(messages)) {
                                  return res.status(400).json({ error: 'messages array is required' });
                                    }

                                      if (!process.env.ANTHROPIC_API_KEY) {
                                          return res.status(500).json({ error: 'API key not configured' });
                                            }

                                              try {
                                                  const response = await fetch('https://api.anthropic.com/v1/messages', {
                                                        method: 'POST',
                                                              headers: {
                                                                      'x-api-key': process.env.ANTHROPIC_API_KEY,
                                                                              'anthropic-beta': 'interop-2024-12-19',
                                                                                      'content-type': 'application/json',
                                                                                            },
                                                                                                  body: JSON.stringify({
                                                                                                          model: 'claude-sonnet-4-20250514',
                                                                                                                  max_tokens: 1024,
                                                                                                                          messages,
                                                                                                                                  ...(mcp_servers && { mcp_servers }),
                                                                                                                                        }),
                                                                                                                                            });
                                                                                                                                            
                                                                                                                                                const data = await response.json();
                                                                                                                                                
                                                                                                                                                    if (!response.ok) {
                                                                                                                                                          return res.status(response.status).json(data);
                                                                                                                                                              }
                                                                                                                                                              
                                                                                                                                                                  return res.status(200).json(data);
                                                                                                                                                                    } catch (error) {
                                                                                                                                                                        console.error('API Error:', error);
                                                                                                                                                                            return res.status(500).json({ error: 'Internal server error' });
                                                                                                                                                                              }
                                                                                                                                                                              }
