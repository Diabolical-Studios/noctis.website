const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;

exports.handler = async function (event, context) {
    const CLIENT_ID = '2ZQbOdViSPl7sGF3HTAY3g4f5WuuuErWN87Jre8evgDaKC6dSdCbBum835gS7H_-';
    const REDIRECT_URI = 'https://diabolical.services/.netlify/functions/patreon-auth';
    const queryString = require('querystring');

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
            const response = await axios.post('https://www.patreon.com/api/oauth2/token', queryString.stringify({
                code: code,
                grant_type: 'authorization_code',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
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

// When the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have an accessToken (you'll have to determine how you're passing this back, e.g., in a cookie)
    const accessToken = getAccessToken(); // You'll need to define this function to retrieve the token

    if (accessToken) {
        checkSubscriptionStatusAndUpdateButton(accessToken);
    }
});

async function checkSubscriptionStatusAndUpdateButton(accessToken) {
    const response = await fetch(`/check-subscriber-status?accessToken=${accessToken}`);
    const data = await response.json();

    const btn = document.querySelector('.header__btn');
    const btnWrapper = btn.querySelector('.header__btn-wrapper');
    const btnText = btnWrapper.querySelector('.header__btn-text');
    const svg = btnWrapper.querySelector('svg');

    if (!data.isSubscriber) {
        btn.onclick = startDownload;
        btnText.textContent = 'Download';

        // Remove Patreon SVG 
        if (svg) svg.remove();
    }
    // If the user is a subscriber, the button remains unchanged
}

function startDownload() {
    // Your download logic here...
    window.location.href = "../assets/images/logo.png";
}

function getAccessToken() {
    // Implement the logic to retrieve the accessToken (e.g., from a cookie or session)
    // This is a placeholder, adjust accordingly
    return document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];
}
