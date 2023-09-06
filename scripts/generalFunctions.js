const STORAGE_TOKEN = '58RE1XWB5QA2T4MW9JTFPUQWSJ1VFNSUZSHHEJPA';    
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item'; 
let tasks = []; 
let categorys = [];
let p;  
let contacts ;
let generatedLetters = [];

/**
 * load all external html files with the attribut w3-include-html
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

/**
 * Adds the username to the href of the links.
 * 
 * @param {string} userNameAddTask  username
 */
function setNameToHrefs(userNameAddTask){
    document.getElementById('menu_board').href = `board.html?name=${userNameAddTask}`;
    document.getElementById('menu_add-task').href = `add-task.html?name=${userNameAddTask}`;
    document.getElementById('menu_contacts').href = `contacts.html?name=${userNameAddTask}`;
    document.getElementById('menu_summary').href = `summary.html?name=${userNameAddTask}`;
    document.getElementById('menu_legal-notice').href = `legal-notice.html?name=${userNameAddTask}`;
    document.getElementById('helpId').href = `help.html?name=${userNameAddTask}`;
    document.getElementById('menu_help').href = `help.html?name=${userNameAddTask}`;
}

/**
 * Stores a key-value pair in the remote storage using the provided token.
 * @async
 * @param {string} key - The key to be stored in the remote storage.
 * @param {any} value - The value to be associated with the specified key.
 * @returns {Promise<any>} - A Promise that contains the response data from the remote storage API.
 * @throws {Error} - If there is an error while making the request or processing the response.
 */
 async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    try {
        const response = await fetch(STORAGE_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
}

/**
 * Retrieves the value associated with the specified key from the remote storage using the provided token.
 * @async
 * @param {string} key - The key for which to retrieve the value from the remote storage.
 * @returns {Promise<any>} - A Promise that contains the value associated with the specified key.
 * @throws {Error} - If there is an error while making the request or processing the response, or if the key is not found.
 */
 async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
}

/**
 * This function saves the tasks on the remote storage.
 * @param {string} key - key e.g. 'tasks'
 * @param {string} value - the JSON Array, that should be saved
 * @returns - the promise
 */
async function setTask(key, value) {
    let v = value
    if (value.length == 0) {
        v = '[]';
    }
    const payload = { key: key, value: v, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }).then(resp => resp.json());
}


async function getTasks(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    p = await fetch(url).then(resp => resp.json()).then(resp => resp.data.value);
    return p;
}

async function getCategorys(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    p = await fetch(url).then(resp => resp.json()).then(resp => resp.data.value);
    return p;
}

async function loadCategorys() {
    try {
        await getCategorys('categorys');
        categorys = JSON.parse(p.replaceAll('\'', '"'));
        return categorys;
    } catch (e) {
        console.info('Could not found categorys');
    }
}
/**
 * This function loads the tasks from the remote storage and saves it in tasks.
 * @returns returns the tasks as an JSON Array
 */
async function loadRemote() {
    try {
        await getTasks('tasks');
        tasks = JSON.parse(p.replaceAll('\'', '"'));
        return tasks;
    } catch (e) {
        console.info('Could not found tasks');
    }
}

/**
 * This function stores a value under a specific key in the remote storage and handles error cases.
 */
async function setItemRegister(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    try {
        const response = await fetch('https://remote-storage.developerakademie.org/item', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
}

/**
 * This function retrieves the value of a specific key from the remote storage and handles error cases.
 */
async function getItemRegister(key) {
    const url = `https://remote-storage.developerakademie.org/item?key=${key}&token=${STORAGE_TOKEN}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.data) {
            return data.data.value;
        } else {
            throw new Error(`Could not find data with key "${key}".`);
        }
    } catch (error) {
        console.error('Request error:', error);
        throw error;
    }
}

/**
 * Give contacts a value and load every created contact from the Server
 */

async function loadContacts() {
    try {
      const response = await getItem('contacts');
      if (response && response.data && response.data.value) {
        contacts = JSON.parse(response.data.value).sort((a, b) => a.name.localeCompare(b.name));
      } else {
        contacts = []; // Fallback, wenn die Server-Antwort kein gültiges JSON enthält
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      contacts = []; // Fallback, wenn ein Fehler beim Laden der Kontakte auftritt
    }
  }