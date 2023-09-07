let currentDraggedElement;
let allTasks = [];
let short = [];
let iconNameColor = [];

async function init() {
    await loadContacts();
    await loadRemote();
    await setMinDate();
    await includeHTML();
    await loadCategorys();
    await loadTasksForBoard();
    await renderTasks();

}

//----Render functions---//

function loadTasksForBoard() {

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i];
        getAssignedShortAndColor(task, short, iconNameColor);

        let remoteTask = {
            'id': i,
            'category': task['category'],
            'title': task['title'],
            'description': task['description'],
            'members': short,
            'iconColors': iconNameColor,
            'section': 'taskCategoryToDo',
            'color': task['categoryColor'],
            'priority': task['priority'],
            'subtask': task['subtask']
        };
        allTasks.push(remoteTask);
        short = [];
        iconNameColor = [];

    }
}

function getAssignedShortAndColor(task, short, iconNameColor) {
    const assignedNames = task.assignedTo;
    if (assignedNames.length <= 1) {
        const selectedAssignedNames = assignedNames;
        contacts.forEach((contact, index) => {
            if (assignedNames == "Myself" && short.length < 1) {
                short.push("M");
                iconNameColor.push("#9327FF");
                return false
            }
            if (contact.name == selectedAssignedNames && short.length < 1) {
                short.push(contacts[index].short);
                iconNameColor.push(contacts[index].iconColor);
                return false
            }
        });
    } else {
        const selectedAssignedNames = assignedNames;
        if (assignedNames[0] == "Myself") {
            short.push("M");
            iconNameColor.push("#9327FF");
            contacts.forEach((contact, index) => {
                if (assignedNames[0] == "Myself" && contact.name == selectedAssignedNames[index + 1]) {
                    short.push(contacts[index].short);
                    iconNameColor.push(contacts[index].iconColor);
                }
            });
        } else {
            const selectedAssignedNames = assignedNames;
            contacts.forEach((contact, index) => {
                if (contact.name == selectedAssignedNames[index]) {
                    short.push(contacts[index].short);
                    iconNameColor.push(contacts[index].iconColor);
                }
            });
        }
    }
}

function renderTasks() {

    let todoCat = allTasks.filter(t => t['section'] == 'taskCategoryToDo');

    document.getElementById('taskCategoryToDo').innerHTML = '';
    if (todoCat.length > 0) {
        for (let i = 0; i < todoCat.length; i++) {
            task = todoCat[i];
            counter = 0;
            document.getElementById('taskCategoryToDo').innerHTML += createdTaskHTML(task, i);
            for (let m = 0; m < task['members'].length; m++) {
                document.getElementById('createdTaskAssignedMember' + i).innerHTML += `<span class="memberIcon" style="background-color: ${task['iconColors'][m]}">${task['members'][m]}</span>`;
            }
            document.getElementById('rightPrio' + i).innerHTML = checkPriority(task);
            checkSubtaskProgress(task, counter);
            document.getElementById('progressCounter' + i).innerHTML = counter + `/${task['subtask'].length}`;
            barPercentLength = checkProgressBar(task, counter);
            document.getElementById('progressBar' + i).style.width = barPercentLength;
        }
    } else {
        document.getElementById('taskCategoryToDo').innerHTML = '<div class="noTask"> No task in "To do"</div>';

    }



    let progressCat = allTasks.filter(t => t['section'] == 'taskCategoryInProgress');

    document.getElementById('taskCategoryInProgress').innerHTML = '';
    if (progressCat.length > 0) {
        for (let i = 0; i < progressCat.length; i++) {
            task = progressCat[i];
            counter = 0;
            document.getElementById('taskCategoryInProgress').innerHTML += createdTaskHTML(task, i);
            for (let m = 0; m < task['members'].length; m++) {
                document.getElementById('createdTaskAssignedMember' + i).innerHTML += `<span class="memberIcon" style="background-color: ${task['iconColors'][m]}">${task['members'][m]}</span>`;
            }
            document.getElementById('rightPrio' + i).innerHTML = checkPriority(task);
            checkSubtaskProgress(task, counter);
            document.getElementById('progressCounter' + i).innerHTML = counter + `/${task['subtask'].length}`;
            barPercentLength = checkProgressBar(task, counter);
            document.getElementById('progressBar' + i).style.width = barPercentLength;

        }
    } else {
        document.getElementById('taskCategoryInProgress').innerHTML = '<div class="noTask" > No task "in progress"</div>';
    }



    let feedbackCat = allTasks.filter(t => t['section'] == 'taskCategoryAwaitFeedback');

    document.getElementById('taskCategoryAwaitFeedback').innerHTML = '';
    if (feedbackCat.length > 0) {
        for (let i = 0; i < feedbackCat.length; i++) {
            task = feedbackCat[i];
            document.getElementById('taskCategoryAwaitFeedback').innerHTML += createdTaskHTML(task);
        }
    } else {
        document.getElementById('taskCategoryAwaitFeedback').innerHTML = '<div class="noTask" > No task in "Await feedback"</div>';
    }



    let doneCat = allTasks.filter(t => t['section'] == 'taskCategoryDone');

    document.getElementById('taskCategoryDone').innerHTML = '';
    if (doneCat.length > 0) {
        for (let i = 0; i < doneCat.length; i++) {
            task = doneCat[i];
            document.getElementById('taskCategoryDone').innerHTML += createdTaskHTML(task);
        }
    } else {
        document.getElementById('taskCategoryDone').innerHTML = '<div class="noTask"> No task in "Done"</div>';
    }
}

function checkPriority(task) {
    if (task.priority == 'urgent') {
        return `<img src="../img/addtask-img/higPrio.png"></img>`
    } if (task.priority == 'medium') {
        return `<img src="../img/addtask-img/mediumPrio.png"></img>`
    } if (task.priority == 'low') {
        return `<img src="../img/addtask-img/lowPrio.png"></img>`
    }
}

function checkSubtaskProgress(task, counter) {
    for (let i = 0; i < task['subtask'].length; i++) {
        if (task['subtask'][i]['status'] == "checked") {
            counter++;
        }
    }
}

function checkProgressBar(task, counter) {
    let subTaskLength = task['subtask'].length;
    let barPercentLength = ((counter / subTaskLength) * 100).toFixed(2);
    return barPercentLength + '%';
}

//----Functionality---//

function klickOnArrowToMoveTask(id, section, move) {
    let taskCategorys = ['taskCategoryToDo', 'taskCategoryInProgress', 'taskCategoryAwaitFeedback', 'taskCategoryDone'];

    if ((section == taskCategorys[0] || section == taskCategorys[1] || section == taskCategorys[2]) && move == 'up') {
        let currentSectionIndex = taskCategorys.indexOf(section);
        if (currentSectionIndex < taskCategorys.length - 1) {
            allTasks[id]['section'] = taskCategorys[currentSectionIndex + 1];
        }
    }


    if ((section == taskCategorys[1] || section == taskCategorys[2] || section == taskCategorys[3]) && move == 'down') {
        let currentSectionIndex = cattaskCategorysgorys.indexOf(section);
        if (currentSectionIndex <= taskCategorys.length - 1) {
            allTasks[id]['section'] = taskCategorys[currentSectionIndex - 1];
        }
    }

    renderTasks();
}


async function deleteSelectedTask(id) {
    tasks.splice(id, 1);
    await setTask('tasks', tasks);
    await init();

}

//----Drag- and dropfunctions---//

function startDragging(id) {
    currentDraggedElement = id;
}

function dragToOtherCategory(section) {
    allTasks[currentDraggedElement]['section'] = section;
    renderTasks();
}

function allowDrop(ev) {
    ev.preventDefault();
}

//---Show and close Edit-Task-Popup-Window---//

function showDetailsTaskPopUp(id) {

    let showDetailsTaskPopUp = document.getElementById('editTaskPopUpWindowContent');
    showDetailsTaskPopUp.style.display = 'flex';
    showDetailsTaskPopUp.innerHTML = showDetailsTaskPopUpHTML(id);
    for (let i = 0; i < tasks[id]['assignedTo'].length; i++) {
        document.getElementById('editPopUpName').innerHTML += `<div><span style="background-color:${allTasks[id]['iconColors'][i]}">${allTasks[id]['members'][i]}</span><span style="padding-left: 10px">${tasks[id]['assignedTo'][i]}</span</div>`;
    }
   


    if (window.innerWidth <= 800) {
        document.getElementById('content').style.display = 'none';
    }
}

function closeEditTaskPopUp() {
    document.getElementById('editTaskPopUpWindowContent').style.display = 'none';
    document.getElementById('content').style.display = 'unset';
}



//----Helpfunctions---//

function showPopUpAddTask() {
    document.getElementById('addTaskPopUpWindowContent').style.display = 'flex';
}
function closePopUpAddTask() {
    document.getElementById('addTaskPopUpWindowContent').style.display = 'none';
}

function SelectedTaskEditWindow() {
    document.getElementById('editSelectedTask').style.display = 'flex';
    if (window.innerWidth <= 800) {
        document.getElementById('content').style.display = 'none';
    }
}
function closeSelectedTaskEditWindow() {
    document.getElementById('editSelectedTask').style.display = 'none';
    document.getElementById('content').style.display = 'unset';
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

//----------------------HTML-Templates------------//

function showDetailsTaskPopUpHTML(id) {
    return `
<div class="editPopUpWindow">
    <div class="editPopUpCatAndCanc"><span style="background-color:#${tasks[id]['categoryColor']}" class="editPopUpCategory"">${tasks[id]['category']}</span>
        <span onclick="closeEditTaskPopUp()"><img src="../img/cancelIcon.png"></span>
    </div>
    <div>
        <div class="editPopUpTitle">${tasks[id]['title']}</div>
        <div class="editPopUpText">${tasks[id]['description']}</div>
    </div>
    <div> <b> Due Date: </b>${tasks[id]['date']}</div>
    <div> <b> Priority: </b> <span class="editPopUpPriority">${tasks[id]['priority']} <img
                src="../img/addtask-img/mediumPrio.png"></span></div>
    <div>
        <div><b>Assigned To</b></div>
        <div class="editPopUpIconAndName" id="editPopUpName"></div>
    </div>
    <div>
        <div><b>Subtasks</b></div>
        <div>
            <div class="editPopUpList"><input type="checkbox">${tasks[id]['subtask']}</div>
            
        </div>
    </div>
    <div class="editPopUpDelAndEditButton">
        <span onclick="deleteSelectedTask(${id})"><img src="../img/board-img/editPopUpdelete.png"> Delete </span>
        <seperator></seperator>
        <span onclick="SelectedTaskEditWindow(); closeEditTaskPopUp()" class="popUpEdit"><img
                src="../img/board-img/editPopUpEdit.png"> Edit
        </span>
    </div>
</div>
`

}



function createdTaskHTML(task, i) {
    return `
    <div draggable="true" ondragstart="startDragging(${task['id']})"  onclick="showDetailsTaskPopUp(${task['id']})" class="createdTaskContent">
    <div class="categoryAndRespArrows">
        <span class="createdTaskCategory" style="background-color:#${task['color']}">${task['category']}</span>
        <span>
            <img id="arrowUpId${task['id']}" onclick="klickOnArrowToMoveTask(${task['id']},'${task['section']}', 'up'); event.stopPropagation();" class="respArrows" src="../img/board-img/ArrowUp.png"></img>
            <img id="arrowDownId${task['id']}" onclick="klickOnArrowToMoveTask(${task['id']},'${task['section']}', 'down'); event.stopPropagation();" class="respArrows" src="../img/board-img/ArrowDown.png"></img>
        </span>
    </div>
    <div class="createdTaskTitleAndDescription">
        <p class="createdTaskTitle">${task['title']}</p>
        <p class="createdTaskDescription">${task['description']}</p>
    </div>
    <div class="createdTaskProgress">
        <span class="createdTaskProgressBar"><div id="progressBar${i}" class="barColor"></div></span>
        <span class="createdTaskProgressText" id="progressCounter${i}"></span>
    </div>
    <div class="createdTaskAssignedAndPriority">
        <span class="createdTaskAssignedMember" id="createdTaskAssignedMember${i}"></span>
        <span class="createdTaskPriority" id="rightPrio${i}"><img src="../img/addtask-img/higPrio.png"></span>
    </div>
</div>
`
}







