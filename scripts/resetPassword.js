let email = "";
let users;

function onPageLoad() {
    email = getEmailUrlPrameter();
    users = getUsers();
}

function getEmailUrlPrameter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    return email;
}

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function onSubmit(event) {
    event.preventDefault();
}

function showInfoBox() {
    let infoBox = document.getElementById("infoBox");
    infoBox.style.display = "block";
}


