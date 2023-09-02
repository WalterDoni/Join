let users = [];
let email;
let user;


/**
 * This function initializes the startup process by loading the user data.
 */
async function init() {
    await loadUsersRegister();
}

/**
 * This function loads the user data from a remote storage and handles potential loading errors.
 */
async function loadUsersRegister() {
    try {
        users = JSON.parse(await getItem('users')) || [];
        console.log(users)
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This function handles the registration process by checking if the email already exists, adding the new user, resetting the form, and displaying a success message.
 */
async function register() {
    const newUser = getNewUserFromInputs();
    const emailExists = await checkEmailExists(newUser.email);
    if (emailExists) {
        displayEmailExistsMessage();
        return;
    }
    addUser(newUser);
    resetForm();
    displayRegistrationSuccess();
}
/**
 * This function reads the values from the input fields for name, email, and password, and returns an object with the user data. 
 */
function getNewUserFromInputs() {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('emailLogin');
    const passwordInput = document.getElementById('password');
    return {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
    };
}

function displayEmailExistsMessage() {
    alert('The email is already registered.');
}

/**
 * Adds a new user to the user list, disables the registration button, and saves the updated user list.
 * @param {Object} user - The user object to be added to the user list.
 */
function addUser(user) {
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.disabled = true;
    users.push(user);
    setItem('users', users);
    setTimeout(() => {
        window.location.href= '../index.html';
    }, 1500);
}

/**
 * This function resets the registration form by clearing the values of the input fields and enabling the registration button.
 */
function resetForm() {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('emailLogin');
    const passwordInput = document.getElementById('password');
    const registerBtn = document.getElementById('registerBtn');
    nameInput.value = '';
    emailInput.value = '';
    passwordInput.value = '';
    registerBtn.disabled = false;
}

/**
 * This function displays a success message for registration and redirects the user to the login page after a short delay.
 */
function displayRegistrationSuccess() {
    let infoBox = document.getElementById("infoBox");
    infoBox.style.display = "block";
    setTimeout(() => {
        infoBox.style.display = "none";
    }, 1500); // Weiterleitung nach 1 Sekunde (1000 Millisekunden)
}

function showInfoBox() {
    let infoBox = document.getElementById("infoBox");
    infoBox.style.display = "block";
    setTimeout(() => {
        infoBox.style.display = "none";
    }, 1500); // Weiterleitung nach 1 Sekunde (1000 Millisekunden)
}

// Login // 

/**
 * This function enables guest access to the application by populating the login fields with pre-defined guest email and password and redirecting the user to the summary page.
 */
function openGuestLogin() {
    const emailField = document.getElementById("emailLogin");
    const passwordField = document.getElementById("passwordLogin");
    const loginError = document.getElementById('login-error');
    const emailValue = "testguest@test.de";
    const passwordValue = "123";
    emailField.value = emailValue;
    passwordField.value = passwordValue;
    loginError.style.display = 'none';
    setTimeout(function () {
        emailField.value = "";
        passwordField.value = "";
        loginError.style.display = 'none';
        const urlParams = new URLSearchParams(window.location.search);
        const userName = urlParams.get('name');
        window.location.href = `./html/summary.html?name=${userName || 'Guest'}`;
    },);
}

/**
 * Handles the login process by comparing the entered email and password with the registered users.
 * If a matching user is found, the page is redirected to the summary page with the user's name.
 * Otherwise, a login error message is displayed.
 * @param {Event} event - The event object from the login form submission.
 */
async function loginUser(event) {
    event.preventDefault();
    const emailInput = document.getElementById('emailLogin');
    const passwordInput = document.getElementById('passwordLogin');
    const loginError = document.getElementById('login-error');
    const email = emailInput.value;
    const password = passwordInput.value;
    const registeredUsers = await loadUsers();
    const user = registeredUsers.find(user => user.email === email && user.password === password);
    if (user) {
        window.location.href = `./html/summary.html?name=${user.name}`;
    } else {
        loginError.style.display = 'block';
    }
}

/**
 * Loads the list of registered users from the data source.
 * @function
 * @async
 * @returns {Promise<Array<Object>>} - A Promise that resolves to an array of user objects containing the registered users.
 * @throws {Error} - If there is an error while loading the user data.
 */

async function loadUsers() {
    try {
        const usersData = await getItem('users');
        return JSON.parse(usersData) || [];
    } catch (error) {
        console.error('Loading error:', error);
        return [];
    }
}

/**
 * Checks if the specified email address exists in the list of registered users and returns a boolean value.
 * @param {string} email - The email address to be checked for existence in the list of registered users.
 * @returns {Promise<boolean>} - A Promise that resolves to a boolean value indicating whether the email exists.
 */

async function checkEmailExists(email) {
    const registeredUsers = await loadUsers();
    const user = registeredUsers.find(user => user.email === email);
    return !!user;
}

/**
 * This function greets the user based on the URL parameters and updates the greeting message according to the time of day.
 */
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userName = urlParams.get('name');
    const greetingTextElement = document.getElementById('greetingText');
    const userElement = document.getElementById('user');
    let today = new Date();
    let currentHour = today.getHours();
    let greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good day" : "Good evening";
    if (userName === null || userName === "") {
        userElement.textContent = "Guest";
        greetingTextElement.textContent = greeting + ",";
        greetingTextElement.style.color = "black";
    } else {
        userElement.textContent = userName;
        greetingTextElement.textContent = greeting + ",";
    }
};

/**
 * This function changes the source of the logo image after the page has loaded to display the "Join-Logo.svg" image.
 */
window.onload = function () {
    setTimeout(function () {
        let logo = document.getElementById("join-logo");
        logo.src = "./img/Join-Logo.svg";
    }, 800);
}

async function onSubmit(event) {
    event.preventDefault();
    let formData = new FormData(event.target);
    let response = await action(formData);
    if (response.ok) {
        showInfoBox();
    } else {
        alert('E-Mail was not sent!');
    }
}

function action(formData) {
    const input = 'https://walter-doni.developerakademie.net/Join/send_mail.php';
    const requestInit = {
        method: 'post',
        body: formData
    };
    return fetch(input, requestInit);
}


function showInfoBox() {
    let infoBox = document.getElementById("infoBox");
    infoBox.style.display = "block";
    setTimeout(() => {
        infoBox.style.display = "none";
    }, 1500); // Weiterleitung nach 1 Sekunde (1000 Millisekunden)
}

async function onPageLoad() {
    email = getEmailUrl();
    user = await getPasswordResetUser();
}

/**
 * Retrieves the user object for password reset based on the email.
 * 
 * @returns {Object|null} - The user object for password reset, or null if not found.
 */
async function getPasswordResetUser() {
    await loadUsers();
    let user = users.find(u => u.email == email);
    return user;
}

function getEmailUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    return email;
}




