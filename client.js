// When the page loads
document.addEventListener('DOMContentLoaded', () => {
    const isPatron = getIsPatronFromCookie();
    console.log("Is Patron:", isPatron);

    if (isPatron !== null) {
        checkSubscriptionStatusAndUpdateButton(isPatron === "true");
    }
});

function getIsPatronFromCookie() {
    const cookieString = document.cookie.split('; ').find(row => row.startsWith('isPatron='));
    if (cookieString) {
        return cookieString.split('=')[1];
    } else {
        return null;
    }
};


async function checkSubscriptionStatusAndUpdateButton(isPatron) {
    const btn = document.querySelector('.header__btn');
    const btnWrapper = btn.querySelector('.header__btn-wrapper');
    const btnText = btnWrapper.querySelector('.header__btn-text');
    const svg = btnWrapper.querySelector('svg');

    if (isPatron) {
        btn.onclick = startDownload;
        btnText.textContent = 'Download';
        if (svg) svg.remove();
    }
    else {
        btn.onclick = visitPatreon;
        btnText.textContent = 'Become A Supporter';
    }
    // If the user is a subscriber, the button remains unchanged
}


function visitPatreon() {
    // Your download logic here...
    window.open("https://www.patreon.com/noctisgame");
}

function startDownload() {
    // Your download logic here...
    window.location.href = "URL_TO_YOUR_DOWNLOADABLE_RESOURCE";
}

function getAccessToken() {
    const cookieString = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
    if (cookieString) {
        return cookieString.split('=')[1];
    } else {
        return null;
    }
}

