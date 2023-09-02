let categorys = [
    { name: "Design", color: "FF7A00;" },
    { name: "Sales", color: "FC71FF" },
    { name: "Backoffice", color: "1FD7C1" },
    { name: "Media", color: "FFC701" },
    { name: "Marketing", color: "0038FF" },
];

let selectableColorsForNewCategorys = ['FF7A00', 'FC71FF', '1FD7C1', 'FFC701', '0038FF', '068f43'];
let selectedColor;

//----OpenCategorySection--// 
function openCategorySelection() {
    let categorySelectionBox = document.getElementById('categorySelection');
    if (categorySelectionBox.childElementCount >= 2) {
        categorySelectionBox.innerHTML = categoryBoxHTML();
    } else {
        categorySelectionBox.innerHTML = categoryBoxHTML();
        categorySelectionBox.innerHTML += selectableCategorysHTML();

        categorys.forEach((category, index) => {
           let  id = index;
            categorySelectionBox.innerHTML += getCreatedCategorysHTML(id, category);
        })
    }
}

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

function selectColor(color) {
    selectedColor = color;
}

function categoryBoxHTML() {
    return `<div><p>Select task category</p><img src="../img/addtask-img/arrow_drop_down.png"></div>`;
}

function selectableCategorysHTML() {
    return `<div onclick="createNewCategory();doNotCloseTheBoxOrReloadThePage(event)">New category</div>`
}

function getCreatedCategorysHTML(id, category) {
    return `<div onclick="doNotCloseTheBoxOrReloadThePage(event)"><button onclick="deleteCategory(${id})" class="deleteCategory">X</button><div>${category.name}</div><span style="background-color: #${category.color}; width: 20px; height: 20px; border-radius: 50%;"></span></div>`
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


function deleteCategory(id){
    categorys.splice(id, 1);
    openCategorySelection();
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

function doNotCloseTheBoxOrReloadThePage(event) {
    event.stopPropagation();
}


//----Date---//*css*/

/**
 * this function makes it not posible to pick a date in the past
 *
 */
function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", today);
}