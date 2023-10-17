const axios = require('axios');

exports.handler = async function (event, context) {
    const CLIENT_ID = '2ZQbOdViSPl7sGF3HTAY3g4f5WuuuErWN87Jre8evgDaKC6dSdCbBum835gS7H_-';
    const REDIRECT_URI = 'https://diabolical.services/.netlify/functions/patreon-auth';

    // If it's the start of the auth
    if (event.httpMethod === "GET" && !event.queryStringParameters.code) {
        const patreonURL = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
        return {
            statusCode: 302,
            headers: {
                Location: patreonURL
            }
        };
    }

    // If it's the callback
    if (event.httpMethod === "GET" && event.queryStringParameters.code) {
        const CLIENT_SECRET = 'buryt7Ox5xCiyaGzxEXL_XKBovayQd-ZvdeRPFfRrQP68TEm4Jnpx47LkmdRsVR1';  // Remember to replace this
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
                    Location: 'https://diabolical.services'
                }
            };
        } catch (error) {
            console.error("Error:", error.response ? error.response.data : error.message);
            return {
                statusCode: 500,
                body: 'Error authenticating with Patreon.'
            };
        }
    }
}
