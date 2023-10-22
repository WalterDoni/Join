let madeSmall;//madeSmall= true, when we went from fullscreen to smallscreen, false, when we went from smallcreen to fullscreen
let actualContact;
let detailDialog = false;
let colorsIcon = ['#FF7A00', '#9327FF', '#29ABE2', '#FC71FF', '#02CF2F', '#AF1616', '#462F8A', '#FFC700', '#0223cf'];
contacts;

setMadeSmall();
window.addEventListener("resize", resizeListenerContacts);

/**
 * Set the initial values for madeSmall
 */
function setMadeSmall() {
  if (window.innerWidth <= 800) {
    madeSmall = true;
  } else { madeSmall = false; }
}

/**
 * Used, wenn window resize from <=800 to >800 and back
 */
function resizeListenerContacts() {
  if (window.innerWidth <= 800 && !madeSmall) {
    madeSmall = true;
    document.getElementById('contactsContainer').style.display = 'none';
  }
  if (window.innerWidth > 800 && madeSmall) {
    madeSmall = false;
    if (detailDialog) {
      responsiveContactDetailsBackButton();
    } else {
      document.getElementById('contactsContainer').style.display = 'block';
    }
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

/**
 * Is an onload function. It will render every contact, from the server. And will only stop when 
 * the length from contacts(array) is reached. It will also create the seperator and letters and sort it 
 * alphabetical. LettersHtml and contactListHtml is a created function only for returning the HTML part.
 */
async function renderContacts() {
  await loadContacts();
  let containerContactlist = document.getElementById('contactList');
  containerContactlist.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    let currentLetter = contact['name'].charAt(0).toUpperCase();
    let prevLetter = i > 0 ? contacts[i - 1]['name'].charAt(0).toUpperCase() : null;
    if (currentLetter !== prevLetter) {
      containerContactlist.innerHTML += lettersHtml(currentLetter);
      generatedLetters.push(currentLetter);
    }
    containerContactlist.innerHTML += contactListHtml(contact, i);
  }
  addNameToHref();
}

/**
 * First it will get the value from the inputfields. After that it will split the first letter from the first- and 
 * secondname. After that it will create the short-Icon. Max Mustermann -> MM . After that it will push everything
 * in the current place from the contacts-array and save so the changes.
 */
async function saveContactChanges(i) {
  let name = document.getElementById('changeName').value;
  let email = document.getElementById('changeEmail').value;
  let phone = document.getElementById('changePhone').value;
  
  if (name.length <= 2) {
    alert('Please add a Name');
  } else {
    const { firstName, lastName, short } = calculateNameDetails(name);

    contacts[i].name = name;
    contacts[i].email = email;
    contacts[i].phone = phone;
    contacts[i].short = short;
    
    await setItem('contacts', JSON.stringify(contacts));
  
    let newContact = document.getElementById('newContact');
    newContact.classList.add('d-none');
    showContactDetails(i);
    renderContacts();
  }
}

function calculateNameDetails(name) {
  const [firstName, lastName] = name.trim().split(' ');
  const short = (firstName ? firstName.charAt(0) : '') + (lastName ? lastName.charAt(0) : '');
  return { firstName, lastName, short };
}

/**
 * This will delete the selected contact from the array contacts.
 */
async function deleteContact(i) {
  contacts.splice(i, 1);
  await setItem('contacts', JSON.stringify(contacts));
  await updateClasses();
  checkSizeForContactContainer();
}  

async function updateClasses(){
  let newContact = document.getElementById('newContact');
  newContact.classList.add('d-none');
  document.getElementById('resetName').innerHTML = "";
  document.getElementById('resetInfo').innerHTML = "";
  document.getElementById('resetEmailPhone').innerHTML = "";
  await renderContacts();
  document.getElementById('contactList').classList.remove('d-none');
  document.getElementById('responsiveButton').classList.remove('d-none');
  document.getElementById('responsiveHeadlinePhrase').classList.add('d-none');
  document.getElementById('responsiveDelete').classList.add('d-none');
  document.getElementById('responsiveEdit').classList.add('d-none');
  document.getElementById('backArrowResponsive').classList.add('d-none')
}

function checkSizeForContactContainer(){
 if(window.innerWidth <= 800){
  document.getElementById('contactsContainer').style.display = 'none';
 }else{
  document.getElementById('contactsContainer').style.display = 'unset';
 }
}

/**
 * First it checks the validity from the inputfields, after that it will save the created contact in contacts
 * and push it into the remote server.
 */
async function newContact() {
  let name = document.getElementById('newName').value;
  let email = document.getElementById('newEmail').value;
  let phone = document.getElementById('newPhone').value;
  let form = document.querySelector('form');
  let iconColor = colorsIcon[(contacts.length) % 9];
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const { firstName, lastName, short } = calculateNameDetails(name);
  let contact = {
    name,
    email,
    phone,
    short,
    iconColor,
  };
  contacts.push(contact);
  await setItem('contacts', JSON.stringify(contacts));
  let newContact = document.getElementById('newContact');
  newContact.classList.add('d-none');
  renderContacts();
}

/**
 * Show the current clicked contact and give details about it.
 */
function showContactDetails(i) {
  actualContact = i;
  let container = document.getElementById('contactDetails');
  let contact = contacts[i];
  container.innerHTML = "";
  if (window.innerWidth >= 800) {
    container.innerHTML = showContactDetailsHtml(contact, i);
  } else {
    detailDialog = true;
    container.innerHTML = showContactDetailsHtml(contact, i);
    updateShowContactDetailsClasses();
  }
}

function updateShowContactDetailsClasses(){
  document.getElementById('contactList').classList.add('d-none');
  document.getElementById('responsiveButton').classList.add('d-none');
  document.getElementById('responsiveHeadlinePhrase').classList.remove('d-none');
  document.getElementById('responsiveDelete').classList.remove('d-none');
  document.getElementById('responsiveEdit').classList.remove('d-none');
  document.getElementById('backArrowResponsive').classList.remove('d-none')
  document.getElementById('contactsContainer').style.display = 'block';
}

/**
 * Add and remove some classes for the responsive view
 */
function responsiveContactDetailsBackButton() {
  detailDialog = false;
  document.getElementById('contactList').classList.remove('d-none');
  document.getElementById('responsiveButton').classList.remove('d-none');
  document.getElementById('responsiveHeadlinePhrase').classList.add('d-none');
  document.getElementById('responsiveDelete').classList.add('d-none');
  document.getElementById('responsiveEdit').classList.add('d-none');
  document.getElementById('backArrowResponsive').classList.add('d-none')
  if (window.innerWidth <= 800) { document.getElementById('contactsContainer').style.display = 'none'; }
}

/**
 * Show the pop-up window for new contact.
 */
function showPopUpWindowNewContact() {
  let newContact = document.getElementById('newContact');
  newContact.classList.remove('d-none');
  newContact.innerHTML = newContactPopUpHtml();
}

/**
 * close the pop-up window for new contact.
 */
function closePopUpWindow() {
  document.getElementById('newContact').classList.add('d-none');
}

/**
 * Show the pop-up window for edit contact.
 */
function editContact(i) {
  let newContact = document.getElementById('newContact');
  newContact.classList.remove('d-none');
  newContact.innerHTML = editContactHtml(i);
}

/**
 * Only show the new contact button for responsive side, when the window is smaller than 800px
 */
async function buttonVisibility() {
  let button = document.getElementById('responsiveButton');
  if (window.innerWidth < 800) {
    button.classList.remove('d-none');
    await renderContacts();
  } else {
    button.classList.add('d-none');
  }
}

window.addEventListener('resize', function (event) {
  buttonVisibility();
});



/*-------------------------------HTML-Templates-------------------------*/

function lettersHtml(currentLetter) {
  return `
<div class="firstLetterContainer">
  <span class="firstLetter">${currentLetter}</span>
</div>
<img src="../img/seperatorContacts.png">
`
}

function contactListHtml(contact, i) {
  return `
    <div class="contactContainer" onclick="showContactDetails(${i})">
      <div class="profile " style="background-color:${contact['iconColor']}">${contact['short']}</div>
      <div class="contact">
        <div class="name">${contact['name']}</div>
        <a  class="email">${contact['email']}</a>
      </div>
    </div>
  `
}


function showContactDetailsHtml(contact, i) {
  return `
<div class="nameContainer" id="resetName">
                      <div class="detailsProfile" style="background-color:${contacts[i]['iconColor']}">${contacts[i]['short']}</div>
                      <div class="detailsName">
                          <h2>${contact['name']}</h2>
                          <div class="addTask">
                              <span>Add Task</span>
                          </a>
                          </div>
                      </div>
                      </div>
                  <div class="detailsContactInfo" id="resetInfo">
                      <div class="contactInfo">Contact Information</div>
                      <div class="editContact" onclick="editContact(${i})">
                          <svg width="21" height="30" viewBox="0 0 21 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.87121 22.0156L7.69054 24.9405L20.3337 4.10836C20.6203 3.63622 20.4698 3.02119 19.9977 2.73465L16.8881 0.847421C16.4159 0.560878 15.8009 0.71133 15.5144 1.18347L2.87121 22.0156Z" fill="#2A3647"/>
                              <path d="M2.28614 22.9793L7.10547 25.9042L2.37685 28.1891L2.28614 22.9793Z" fill="#2A3647"/>
                          </svg>
                          <span>Edit Contact</span>
                      </div>
                  </div>
                  <div class="emailPhone" id="resetEmailPhone">
                      <div class="contactEmail">
                          <span class="designation">Email</span>
                          <a href="mailto:${contact['email']}" class="email">${contact['email']}</a>
                      </div>
                      <div class="contactPhone">
                          <span class="designation">Phone</span>
                          <span>${contact['phone']}</span>
                      </div>
                  </div>

                  <img  onclick="deleteContact(${i})" src="../img/deleteButtonResponsive.png" id="responsiveDelete" class="responsiveButtons respButtDel d-none">
                  <img onclick="editContact(${i})"src="../img/editButtonResponsive.png"  id="responsiveEdit" class="responsiveButtons respButtEdit d-none">
                  <img  onclick="responsiveContactDetailsBackButton()" src="../img/backArrowResponsive.png" id="backArrowResponsive" class="responsiveBackArrowButton d-none">
              </div>`
}

function newContactPopUpHtml() {
  return `
<div class="newContactContent">
<div class="newContactContainer">
  <div class="leftSideNewContactContainer">
      <img class="contact-logo" src="../img/sidebar-img/logo-sidebar.png">
      <h2>Add contact</h2>
      <p>Tasks are better with a team!</p>
      <div class="leftSideNewContactContainerSeperator"></div>
  </div>
  <div class="rightSideNewContactContainer">
  
      <span class="plr60px newIcon"><img class="" src="../img/newContact.png"></span>
      <span class="mb-120">
      <div class="closeAddContactButton" onclick="closePopUpWindow()"><img class="" src="../img/cancelIcon.png"></div>
          <form>
              <input type="text"  id="newName" class="avatarIcon" placeholder="Name" required>
              <input type="email" id="newEmail" class="emailIcon" placeholder="Email" required>
              <input type="tel" id="newPhone" class="phoneIcon" placeholder="Phone" oninput="this.value = this.value.replace(/[^0-9/+]/g, '');">

          <div class="buttonContainer">
          <button class="cancelButton" onclick="closePopUpWindow()">Cancel <img class="" src="../img/cancelIcon.png"></button>
          <button  type="button" class="createButton" onclick="newContact()">Create contact <img class="" src="../img/createAccIcon.png"> </button>
          </form>
          </div>
      </span>
  </div>
</div>
</div>
`
}

function editContactHtml(i) {
  return `
<div class="newContactContent">
<div class="newContactContainer">
    <div class="leftSideNewContactContainer">
        <img class="contact-logo" src="../img/sidebar-img/logo-sidebar.png">
        <h2>Edit contact</h2>
        <div class="leftSideNewContactContainerSeperator"></div>
    </div>
    <div class="rightSideNewContactContainer h450">
    
        <span class="editContactAvatar " style="background-color:${contacts[i]['iconColor']}">${contacts[i]['short']}</span>
        <span class="mb-30 pt60">
        <div class="closeAddContactButton" onclick="closePopUpWindow()"><img class="" src="../img/cancelIcon.png"></div>
            <form>
                <input required type="text" id="changeName" class="avatarIcon" placeholder="Name" value="${contacts[i]['name']}">
                <input required type="email" id="changeEmail" class="emailIcon" placeholder="Email" value="${contacts[i]['email']}">
                <input required type="tel" id="changePhone" class="phoneIcon" placeholder="Phone" value="${contacts[i]['phone']}" oninput="this.value = this.value.replace(/[^0-9/+]/g, '');">
          

            </form>
            <div class="buttonContainer">
            <button class="cancelButton" onclick="deleteContact(${i})">Delete</button>
            <button class="createButton" onclick="saveContactChanges(${i})">Save</button>
            </div>
        </span>
    </div>
</div>
</div>
`
}

















