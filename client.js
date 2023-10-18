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
    window.location.href = "URL_TO_YOUR_DOWNLOADABLE_RESOURCE";
}

function getAccessToken() {
    // Implement the logic to retrieve the accessToken (e.g., from a cookie or session)
    // This is a placeholder, adjust accordingly
    return document.cookie.split('; ').find(row => row.startsWith('accessToken=')).split('=')[1];
}
