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
let generatedSubtasks = [];
let checkedSubtaskNames = [];
let assignedToNames = [];
let generatedTask = []


async function init() {
    setMinDate();
    includeHTML(); 
    await loadContacts();
    await loadRemote();
}


//-- ALLES BESCHREIBEN NOCH UND UMSCHREIBEN--//
async function createNEWTASK() {
    
    title = document.getElementById('title').value;
    description = document.getElementById('description').value;
    if (assignedToIsSelected()) {
        getTheAssignedNames();
        assignedTo = assignedToNames;
    }
    date = document.getElementById('date').value;
    if (prioIsSelected()) {
        priority = selectedPriority;
    }
    if (categoryIsSelected()) {
        category = document.getElementById('selectedCategory').innerHTML;
    }
    if (checkTheSelectedSubtasks()) {
        subtask = checkedSubtaskNames;
    }
    const task = {
        title: title,
        description: description,
        assignedTo: assignedToNames,
        date: date,
        priority: priority,
        category: category,
        subtask: checkedSubtaskNames,
    }
     tasks.push(task);
     await setTask('tasks', tasks);
    generatedSubtasks = [];
    assignedToNames = [];
}



function categoryIsSelected() {
    let checkCategoryValue = document.getElementById('selectedCategory');
    if (checkCategoryValue == null) {
        document.getElementById('errorCategory').classList.remove("d-none");
        return false;
    } else {
        return true;
    }
}

function prioIsSelected() {
    if (selectedPriority == undefined) {
        document.getElementById('errorPriority').classList.remove("d-none");
        return false
    } else {
        return true;
    }
}

/**
 * This function checks the HTML Collection of the given param and validates it.
 * @param {object} assignedTo - Should be the HTML Collection of the dropdown content.
 * @returns true on a passed test, else returns false.
 */
function assignedToIsSelected() {
    let assignedTo = document.getElementById('assignedToSelection').children;
    if (assignedTo.length < 2) {
        document.getElementById('errorAssigned').classList.remove("d-none");
        return false;
    } else if (!checkForAssignment(assignedTo)) {
        document.getElementById('errorAssigned').classList.remove("d-none");
        return false;
    } else {
        return true;
    }
}

function getTheAssignedNames() {
    let divId = document.getElementById('assignedToSelection');
    let labels = divId.querySelectorAll("label");

    for (let i = 0; i < labels.length; i++) {
        let selected = labels[i];
        if (selected.querySelector("input").checked) {
            assignedToNames.push(selected.textContent)
        }

    }
}
/**
* This function checks if any of the input checkboxes within the object is checked or not.
* @param {object} assignedTo - Should be the HTML Collection of the dropdown content.
* @returns Just returns true on passed test.
*/
function checkForAssignment(assignedTo) {

    for (let i = 0; i < assignedTo.length; i++) {
        if (assignedTo[2].form[i].checked) {
            return true;
        }
    }
}

//---Create a new Subtask--//
function createSubtask() {
    let inputfield = document.getElementById('subtask');
    let newSubtask = inputfield.value;
    if (newSubtask.length <= 2) {
        alert('Please insert a name for the new subtask')
    } else {
        document.getElementById('newCreatedSubtasks').innerHTML += `
        <label class="createdSubtask"><span>${newSubtask}</span><span><input type="checkbox" checked onchange="updateSubtask()"></span></label>  `
    }
    newSubtask = {
        name: newSubtask,
        status: "checked"
    }
    generatedSubtasks.push(newSubtask);
    inputfield.value = "";
}

function updateSubtask() {
    let subtaskBox = document.getElementById('newCreatedSubtasks');
    let subtasks = subtaskBox.querySelectorAll("label");
    let updatedSubtasks = [];

    subtasks.forEach((subtask) => {
        if (subtask.querySelector("input").checked) {
            const updatedSubtask = { name: subtask.textContent, status: "checked" };
            updatedSubtasks.push(updatedSubtask);
        } else {
            const updatedSubtask = { name: subtask.textContent, status: "unchecked" };
            updatedSubtasks.push(updatedSubtask);
        }
    });
    generatedSubtasks = updatedSubtasks;
}


function checkTheSelectedSubtasks() {

    const checkedSubtasks = generatedSubtasks.filter(subtask => subtask.status === 'checked');
    const checkedSubNames = checkedSubtasks.map(subtask => subtask.name);
    checkedSubtaskNames.push(checkedSubNames);

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

function choosenCategory(id) {
    document.getElementById('categorySelection').innerHTML = `<div><div id="selectedCategory">${categorys[id].name}</div><span style="background-color: #${categorys[id].color}; width: 20px; height: 20px; border-radius: 50%;"></span></div>`
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

function categoryBoxHTML() {
    return `<div><p>Select task category</p><img src="../img/addtask-img/arrow_drop_down.png"></div>`;
}

function selectableCategorysHTML() {
    return `<div onclick="createNewCategory();doNotCloseTheBoxOrReloadThePage(event)">New category</div>`
}

function getCreatedCategorysHTML(id, category) {
    return `<div onclick="doNotCloseTheBoxOrReloadThePage(event)"><button onclick="deleteCategory(${id})" class="deleteCategory">X</button><div class="hoverCategory" onclick="choosenCategory(${id})"><div>${category.name}</div><span style="background-color: #${category.color}; width: 20px; height: 20px; border-radius: 50%;"></span></div></div>`
}

//----OpenAssignedToSection--// 


function openAssignedToSelection() {

    let assignedToSelectionBox = document.getElementById('assignedToSelection');
    assignedToSelectionBox.innerHTML = assignedToBoxHTML();
    assignedToSelectionBox.innerHTML += `<label onclick="doNotCloseTheBoxOrReloadThePage(event)" id="assignedlabel" class="d-none" ><div>Myself</div><span><input id="checkboxAssignedTo" type="checkbox"></span></label>`
    contacts.forEach((contact, index) => {
        assignedToSelectionBox.innerHTML += getContactsFromContactListHTML(contact, index);
    })
    toggleVisability();
}

function assignedToBoxHTML() {
    return `<div onclick="toggleVisability()"><p>Select contacts to assign</p><img src="../img/addtask-img/arrow_drop_down.png"></div>`;
}

function getContactsFromContactListHTML(contact, index) {
    return `<label onclick="doNotCloseTheBoxOrReloadThePage(event)" id="assignedlabel${index}" class="d-none"><div>${contact.name}</div><span><input id="checkboxAssignedTo${index}" type="checkbox"></span></label>`
}

function toggleVisability() {
    document.getElementById('assignedlabel').classList.toggle('d-none');
    contacts.forEach((contact, index) => {
        document.getElementById('assignedlabel' + index).classList.toggle('d-none');
    });
}
//----Helpfunction---//

function doNotCloseTheBoxOrReloadThePage(event) {
    event.stopPropagation();
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

    let selectedColorBox = document.getElementById('color' + id);
    selectedColorBox.classList.add("selectedColorNewCategory");
}

//----Date---//

/**
 * this function makes it not posible to pick a date in the past
 */
function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", today);
}