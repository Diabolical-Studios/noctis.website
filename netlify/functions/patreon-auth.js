const axios = require('axios');

exports.handler = async function(event, context) {
    const CLIENT_ID = 'YOUR_CLIENT_ID';
    const REDIRECT_URI = 'https://yourwebsite.com/callback.html';

    // If it's the start of the auth
    if (event.path === '/startPatreonAuth') {
        const patreonURL = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
        return {
            statusCode: 302,
            headers: {
                Location: patreonURL
            }
        };
    }
    
    // If it's the callback
    if (event.path === '/patreonCallback') {
        const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
        const code = event.queryStringParameters.code;

        try {
            const response = await axios.post('https://www.patreon.com/api/oauth2/token', {
                code: code,
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI
            });

            const accessToken = response.data.access_token;
            // In a real-world scenario, you'd store the token in a database and associate it with the user.
            
            // For now, we'll just redirect back to the main page
            return {
                statusCode: 302,
                headers: {
                    Location: 'https://yourwebsite.com/index.html'
                }
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: 'Error authenticating with Patreon.'
            };
        }
    }
}
