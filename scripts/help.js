let userName;

async function initHelp(){
    console.log('callinithelp');
    const urlParams = new URLSearchParams(window.location.search);
    userName = urlParams.get('name');
    console.log(userName);
    console.log(document.getElementById('menu_board'));
    setTimeout(setNameToHrefs,1000,userName);
}

