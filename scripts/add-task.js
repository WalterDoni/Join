let selectableColorsForNewCategorys = ['FF7A00', 'FC71FF', '1FD7C1', 'FFC701', '0038FF', '068f43'];
let selectedColor;
let selectedPriority = null;
let colorCode;
let generatedSubtasks = [];
let checkedSubtaskNames = [];
let assignedToNames = [];
let generatedTask = [];
let formCorrect = false;
let hideDropMenu = true;


async function init() {
    setMinDate();
    includeHTML();
    await loadContacts();
    await loadRemote();
    await loadCategorys();
    addNameToHref();
    openAssignedToSelection();
}

/**
 * Take the value from several fields and push it in the array "tasks".
 * After the task was created, some variable get resetted to value "null".
 */
async function createNEWTASK() {
    title = document.getElementById('title').value;
    description = document.getElementById('description').value;
    date = document.getElementById('date').value;
    if (assignedToIsSelected()) {
        getTheAssignedNames();
        assignedTo = assignedToNames;
        formAssigned = true;
     } else { formAssigned = false}
    if (prioIsSelected()) {
        priority = selectedPriority;
        formPrio = true;
    } else { formPrio = false}
    if (categoryIsSelected()) {
        category = document.getElementById('selectedCategory').innerHTML;
        formCategory = true;
    } else { formCategory = false}
    if (checkTheSelectedSubtasks()) {
        subtask = checkedSubtaskNames;
    } 
    if (formAssigned && formPrio && formCategory) {
        createTaskAndClearEverything();
    }
}

async function createTaskAndClearEverything() {
    getCategoryColor();
    const task = getNewTaskJson();
    await createdTaskSuccesfull();
    tasks.push(task);
    await setTask('tasks', tasks);
    clearValues();
    await init();
    cancelCreateTask();
    document.getElementById('taskCreated').style.display = 'none';
    formCorrect = false;
    priority = '';
    category = '';
    subTask = '';
}

function getNewTaskJson(){
    return {
        title: title,
        description: description,
        assignedTo: assignedTo,
        date: date,
        priority: priority,
        category: category,
        subtask: checkedSubtaskNames,
        categoryColor: colorCode,
        section: 'taskCategoryToDo',
    }
}

function clearValues(){
    generatedSubtasks = [];
    assignedToNames = [];
    checkedSubtaskNames = [];
    highlightPriority(selectedPriority);
    selectedPriority = null;
    colorCode = null;
}

/**
 * Show a PopUp-window if a task get created succesfully.
 */
function createdTaskSuccesfull() {
    let created = document.getElementById('taskCreated')
    created.style.display = "flex";
    setTimeout(() => {
        created.style.display = "none";
    }, 1000);
}

/**
 * @returns false when there isn't selected a category. After that a small text will show up below the category selection
 * @returns true if a category is selected
 */
function categoryIsSelected() {
    let checkCategoryValue = document.getElementById('selectedCategory');
    if (checkCategoryValue == null) {
        document.getElementById('errorCategory').classList.remove("d-none");
        return false;
    } else {
        document.getElementById('errorCategory').classList.add("d-none");
        return true;
    }
}

/**
 * 
 * @returns same like function before, but for priorities.
 */
function prioIsSelected() {
    if (selectedPriority == null) {
        document.getElementById('errorPriority').classList.remove("d-none");
        return false
    } else {
        document.getElementById('errorPriority').classList.add("d-none");
        return true;
    }
}

/**
 * Check the HTML Collection of the given param and validates it.
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
        document.getElementById('errorAssigned').classList.add("d-none");
        return true;
    }
}

/**
 * Iterate through every label. If there is a checked checkbox, it will push the name into 
 * * @param {object} assignedToNames. After that it will get pushed in the array tasks.
 */
function getTheAssignedNames() {
    let divId = document.getElementById('assignedToSelection');
    let labels = divId.querySelectorAll("label");
    assignedToNames = [];
    for (let i = 0; i < labels.length; i++) {
        let selected = labels[i];
        if (selected.querySelector("input").checked) {
            assignedToNames.push(selected.textContent)
        }
    }
}

/**
* Check if any of the input checkboxes within the object is checked or not.
* @param {object} assignedTo - Should be the HTML Collection of the dropdown content.
* @returns Just returns true on passed test.
*/
function checkForAssignment(assignedTo) {
    if (assignedTo.length > 0) {
        const lastAssignment = assignedTo[assignedTo.length - 1];
        if (lastAssignment.form && lastAssignment.form.length > 0) {
            for (let i = 0; i < lastAssignment.form.length; i++) {
                if (lastAssignment.form[i].checked) {
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * The value from the inputfield create a new subtask. Automatically the status will be on checked from the checkbox, after it get created. If there isn't any value in the field,
 * an alert will pop up. 
 * * @param {object} newSubtask - IS the result and will be pushed into the array tasks after that. 
 */
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

/**
 * Iterate through every label and update the status to checked or unchecked and push it back in the array tasks.
 */
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

/**
 * Change the status from checked to unchecked. It's necessary for the progressbar later at the board.
 */
function checkTheSelectedSubtasks() {
    const checkedSubtasks = generatedSubtasks.filter(subtask => subtask.status === "checked");
    const updatedSubtasks = checkedSubtasks.map(subtask => ({
        name: subtask.name,
        status: "unchecked"
    }));
    checkedSubtaskNames.push(...updatedSubtasks);
}

//---Select priority for task (currently : urgent,medium and low)----//

/**
 * 
 * @param {object} selectedPriority - get the value depends of the selected prio (urgent,medium or low)
 * If the object has a value, it will remove the highlight from the selected priority and change it to the new one.
 */
function highlightPriority(prio) {
    if (selectedPriority) {
        let priority = 'select' + selectedPriority;
        document.getElementById(priority).classList.remove('select' + selectedPriority)
    }
    selectedPriority = prio;
    let priority = 'select' + prio;
    document.getElementById(priority).classList.add('select' + selectedPriority);

}

//----OpenCategory----// 

/**
 * Depends of the category-section is open or closed.
 * Open -> it will close the section and hide every selectable category, also the possibility to create one
 * Closed -> it will load every category and show up below the div
 */
async function openCategorySelection() {
    await getItem('categorys')
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

/**
 * Return the color code of the selected category color
 * @returns category color
 */
function getCategoryColor() {
    const categoryName = document.getElementById('selectedCategory');
    if (categoryName) {
        const selectCategoryContent = categoryName.innerHTML;
        categorys.forEach((category) => {
            if (category.name == selectCategoryContent) {
                colorCode = category.color;
            }
        });
    }
}

//----Create new category(and delete)----//

/**
 * After a click on "new category" a new category can be created
 */
function createNewCategory() {
    let newCategory = document.getElementById('categorySelection');
    document.getElementById('colorSelection').style.display = "flex";
    newCategory.innerHTML =
        `<div onclick="doNotCloseTheBoxOrReloadThePage(event)"><input class="inputCat" id="newCategoryName" placeholder="Name for the new category">
    <span> <img onclick="closeNewCategory()" src="../img/cancelIcon.png"><span class="smallSeperator"></span><img onclick="newCategoryAdd()" src="../img/addtask-img/check-icon-black.svg"></span>
    </div>`;
}

/**
 * The name from the new category will be pushed into the categorys array.
 */
async function newCategoryAdd() {
    let name = document.getElementById('newCategoryName').value;

    if (selectedColor) {
        categorys.push({ name: name, color: selectedColor });
        selectedColor = null;
    } else {
        categorys.push({ name: name });
    }
    await setItem('categorys', categorys);
    document.getElementById('colorSelection').style.display = "none";
    openCategorySelection();
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

/**
 * Every possible contact will show up and can be selected.
 */
function openAssignedToSelection() {
    let assignedToSelectionBox = document.getElementById('assignedToSelection');
    assignedToSelectionBox.innerHTML = assignedToBoxHTML();
    assignedToSelectionBox.innerHTML += `<label onclick="doNotCloseTheBoxOrReloadThePage(event)" id="assignedlabel" class="d-none" ><div id="assignedName0" >Myself</div><span><input id="checkboxAssignedTo0" type="checkbox"></span></label>`
    contacts.forEach((contact, index) => {
        assignedToSelectionBox.innerHTML += getContactsFromContactListHTML(contact, index);
    })
    toggleVisability();
}

function assignedToBoxHTML() {
    return `<div onclick="toggleVisability();doNotCloseTheBoxOrReloadThePage(event); checkboxChangesNewTask()"><p>Select contacts to assign</p><img src="../img/addtask-img/arrow_drop_down.png"></div>`;
}

function getContactsFromContactListHTML(contact, index) {
    return `<label onclick="doNotCloseTheBoxOrReloadThePage(event)" id="assignedlabel${index}" class="d-none"><div id="assignedName${index + 1}" >${contact.name}</div><span><input id="checkboxAssignedTo${index + 1}" type="checkbox"></span></label>`
}

function editGetContactsFromContactListHTML(contact, index) {
    return `<label onclick="doNotCloseTheBoxOrReloadThePage(event)" id="editAssignedlabel${index}" class="d-none"><div id="editAssignedName${index + 1}" >${contact.name}</div><span><input id="editCheckboxAssignedTo${index + 1}" type="checkbox"></span></label>`
}

function toggleVisability() {
    document.getElementById('assignedlabel').classList.toggle('d-none');
    document.getElementById('assginedMembersCreateTask').classList.toggle('d-none');
    contacts.forEach((contact, index) => {
        document.getElementById('assignedlabel' + index).classList.toggle('d-none');
    });
}

/**
 * If the dropdown menu gets closed, below the "shorts" and "iconColor" will appear below the selected contact. 
 *Every selected name will be pushed into the "assignedToSelection" array after it iterates through every possibility.
 */
function checkboxChangesNewTask() {
    let divId = document.getElementById('assignedToSelection');
    let labels = divId.querySelectorAll("label");
    let editAssignedToNamesShorts = { names: [], colors: [],};
    for (let i = 0; i < labels.length; i++) {
        let selected = labels[i];
        if (selected.querySelector("input").checked) {
            createArrayForIcons(selected, editAssignedToNamesShorts);
        }
    }
    renderNewTaskAssignedMembers(editAssignedToNamesShorts);
}

/**
 * Creates the neccesary array for the box below the "assignedTo" section.
 * @param {*} selected --> Current name in label
 */
function createArrayForIcons(selected, editAssignedToNamesShorts) {
    if (selected.textContent == 'Myself') {
        editAssignedToNamesShorts.names.push('M');
        editAssignedToNamesShorts.colors.push('#04B404');
    } else {
        for (let index = 0; index < contacts.length; index++) {
            let contactName = contacts[index]['name'];
            let contactColor = contacts[index]['iconColor'];
            let contactShort = contacts[index]['short'];
            if (selected.textContent == contactName) {
                editAssignedToNamesShorts.names.push(contactShort);
                editAssignedToNamesShorts.colors.push(contactColor);
            }
        }
    }
}

function renderNewTaskAssignedMembers(editAssignedToNamesShorts){
    document.getElementById('assginedMembersCreateTask').innerHTML = "";
    for (let a = 0; a < editAssignedToNamesShorts.names.length; a++) {
        document.getElementById('assginedMembersCreateTask').innerHTML += `<span class="memberIcon" style="background-color:${editAssignedToNamesShorts['colors'][a]}">${editAssignedToNamesShorts['names'][a]}</span> `;
    }
}

//----Helpfunction---//

function doNotCloseTheBoxOrReloadThePage(event) {
    event.stopPropagation();
}

function hideAssignedToDropMenu() {
    let dropdown = document.getElementById('assignedlabel');
    let includesDnone = dropdown.classList.contains('d-none');
    if (!includesDnone) {
        hideDropMenu = true;
    } else {
        hideDropMenu = false;
    }
    if (hideDropMenu) {
        document.getElementById('assignedlabel').classList.add('d-none');
        document.getElementById('assginedMembersCreateTask').classList.remove('d-none');
        contacts.forEach((contact, index) => {
            document.getElementById('assignedlabel' + index).classList.add('d-none');
        });
        checkboxChangesNewTask();
    }
}

/**
 * Reset every field from the form.
 */
function cancelCreateTask() {
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
    document.getElementById('date').value = "";
    for (let i = 0; i < contacts.length + 1; i++) {
        const checkbox = document.getElementById('checkboxAssignedTo' + i);
        if (checkbox && checkbox.checked === true) {
            checkbox.checked = false;
        }}
    if (selectedPriority) {
        let priority = 'select' + selectedPriority;
        document.getElementById(priority).classList.remove(priority);
    }
    document.getElementById('categorySelection').innerHTML = assignedToBoxHTML();
    document.getElementById('newCreatedSubtasks').innerHTML = "";
    document.getElementById('assginedMembersCreateTask').innerHTML = "";
}

/**
 * Remove the active color class from all colors and assignes it to the clicked color
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
 * With this function it isn't possible to pick a date in the past.
 */
function setMinDate() {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("date").setAttribute("min", today);
}