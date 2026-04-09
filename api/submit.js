/**
 * Vercel Serverless Function to proxy form submissions to Web3Forms.
 * This keeps the API key hidden from the client.
 */
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  
  if (!accessKey) {
    return res.status(500).json({ success: false, message: 'API key not configured on server' });
  }

  try {
    // Parse form data from request
    // Note: req.body is automatically parsed if it's JSON or URL-encoded.
    // If it's FormData (multipart), it might need different handling, 
    // but for simple fetch requests from scripts.js, we can send JSON.
    
    const body = req.body;
    body.access_key = accessKey;

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    return res.status(response.status).json(result);
  } catch (error) {
    console.error('Submission error:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
