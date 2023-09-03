let categorys = [
    { name: "Design", color: "FF7A00;" },
    { name: "Sales", color: "FC71FF" },
    { name: "Backoffice", color: "1FD7C1" },
    { name: "Media", color: "FFC701" },
    { name: "Marketing", color: "0038FF" },
];

let selectableColorsForNewCategorys = ['FF7A00', 'FC71FF', '1FD7C1', 'FFC701', '0038FF', '068f43'];
let selectedColor;
let selectedPriority;


function init() {
    setMinDate();
}


function createSubtask(){
    let inputfield = document.getElementById('subtask');
    let newSubtask = inputfield.value;
    if( newSubtask.length <= 2){
        alert ('Please insert a name for the new subtask')
    } else {
        document.getElementById('newCreatedSubtasks').innerHTML += `
        <label class="createdSubtask"><span>${newSubtask}</span><span><input type="checkbox"></span></label>  `
    }

    inputfield.value = ""; 
}

//---Select priority for task (currently : urgent,medium and low)----//

function highlightPriority(prio) {
    if (selectedPriority) {
        let priority = 'select' + selectedPriority;
        document.getElementById(priority).classList.remove(priority)
    }
    selectedPriority = prio;
    let priority = 'select' + prio;
    document.getElementById(priority).classList.add(priority);
}


//----OpenCategory----// 

function openCategorySelection() {
    let categorySelectionBox = document.getElementById('categorySelection');
    if (categorySelectionBox.childElementCount >= 2) {
        categorySelectionBox.innerHTML = categoryBoxHTML();
    } else {
        categorySelectionBox.innerHTML = categoryBoxHTML();
        categorySelectionBox.innerHTML += selectableCategorysHTML();

        categorys.forEach((category, index) => {
            let id = index;
            categorySelectionBox.innerHTML += getCreatedCategorysHTML(id, category);
        })
    }
}

function choosenCategory(id){
    document.getElementById('categorySelection').innerHTML = `<div><div>${categorys[id].name}</div><span style="background-color: #${categorys[id].color}; width: 20px; height: 20px; border-radius: 50%;"></span></div>`
}
//----Create new category(and delete)----//

function newCategoryAdd() {
    let name = document.getElementById('newCategoryName').value;

    if (selectedColor) {
        categorys.push({ name: name, color: selectedColor });
        selectedColor = null;
    } else {
        categorys.push({ name: name });
    }

    document.getElementById('colorSelection').style.display = "none";
    openCategorySelection();
}


function categoryBoxHTML() {
    return `<div><p>Select task category</p><img src="../img/addtask-img/arrow_drop_down.png"></div>`;
}

function selectableCategorysHTML() {
    return `<div onclick="createNewCategory();doNotCloseTheBoxOrReloadThePage(event)">New category</div>`
}

function getCreatedCategorysHTML(id, category) {
    return `<div onclick="doNotCloseTheBoxOrReloadThePage(event)"><button onclick="deleteCategory(${id})" class="deleteCategory">X</button><div class="hoverCategory" onclick="choosenCategory(${id})"><div>${category.name}</div><span style="background-color: #${category.color}; width: 20px; height: 20px; border-radius: 50%;"></span></div></div>`
}

function createNewCategory() {
    let newCategory = document.getElementById('categorySelection');
    document.getElementById('colorSelection').style.display = "flex";
    newCategory.innerHTML =
        `<div onclick="doNotCloseTheBoxOrReloadThePage(event)"><input class="inputCat" id="newCategoryName" placeholder="Name for the new category">
    <span> <img onclick="closeNewCategory()" src="../img/cancelIcon.png"><span class="smallSeperator"></span><img onclick="newCategoryAdd()" src="../img/addtask-img/check-icon-black.svg"></span>
    </div>`;
}

function closeNewCategory() {
    document.getElementById('categorySelection').innerHTML = categoryBoxHTML();
    document.getElementById('colorSelection').style.display = "none";
}


function deleteCategory(id) {
    categorys.splice(id, 1);
    openCategorySelection();
}


/**
 * this function removes the active color class from all colors and assignes it to the clicked color
 *
 * @param {string} color name of the selected color
 * @param {string} id of the selected color
 */
function selectColor(color, id) {
    let colorSelectionContainer = document.getElementById("colorSelection");
   let colorBoxes = colorSelectionContainer.querySelectorAll("div");
    selectedColor = color;
  
    colorBoxes.forEach((colorBox) => {
      colorBox.classList.remove("selectedColorNewCategory");
    });
  
    let selectedColorBox = document.getElementById('color'+id);
    selectedColorBox.classList.add("selectedColorNewCategory");
  }
  

//----OpenAssignedToSection--// 

function openAssignedToSelection() {
    let assignedToSelectionBox = document.getElementById('assignedToSelection');
    if (assignedToSelectionBox.childElementCount >= 2) {
        assignedToSelectionBox.innerHTML = assignedToBoxHTML();
    } else {
        assignedToSelectionBox.innerHTML = assignedToBoxHTML();
        assignedToSelectionBox.innerHTML += `<label onclick="doNotCloseTheBoxOrReloadThePage(event)"><div>Myself</div><span><input type="checkbox"></span></label>`
        contacts.forEach((contact) => {
            assignedToSelectionBox.innerHTML += getContactsFromContactListHTML(contact);
        })
    }
}

function assignedToBoxHTML() {
    return `<div><p>Select contacts to assign</p><img src="../img/addtask-img/arrow_drop_down.png"></div>`;
}

function getContactsFromContactListHTML(contact) {
    return `<label onclick="doNotCloseTheBoxOrReloadThePage(event)" ><div>${contact.name}</div><span><input type="checkbox"></span></label>`
}


//----Helpfunction---//

function doNotCloseTheBoxOrReloadThePage(event) {
    event.stopPropagation();
}


//----Date---//

/**
 * this function makes it not posible to pick a date in the past
 */
function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", today);
}