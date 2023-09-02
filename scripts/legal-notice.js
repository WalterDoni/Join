let nameUser;

async function initLegal() {
    await includeHTML();   
    addNameToHref();
}

/**
 * Make the name of the current user available in all tabs
 */
async function addNameToHref() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('name');
    if (msg) {
      nameUser = msg;
    }
    setNameToHrefs(nameUser);
  }
  
function toggleDropdown() {
    const dropdown = document.getElementById("dropdown");
    dropdown.classList.toggle("open");
}

