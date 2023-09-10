let currentDraggedElement;
let allTasks = [];
let short = [];
let iconNameColor = [];
let searchTaskArray = [];

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
                short.push(contacts[index]['short']);
                iconNameColor.push(contacts[index]['iconColor']);
                return false
            }
        });
    } else {
        const selectedAssignedNames = assignedNames;
        if (assignedNames[0] == "Myself") {
            short.push("M");
            iconNameColor.push("#9327FF");
            contacts.forEach((contact, index) => {
                for (let i = 0; i < contacts.length+1; i++) {
                    if (contact.name == selectedAssignedNames[i]) {
                        short.push(contacts[index]['short']);
                        iconNameColor.push(contacts[index]['iconColor']);
                    }}
            });
        } else {
            const selectedAssignedNames = assignedNames;
            contacts.forEach((contact, index) => {
                for (let i = 0; i < contacts.length+1; i++) {
                if (contact.name == selectedAssignedNames[i]) {
                    short.push(contacts[index]['short']);
                    iconNameColor.push(contacts[index]['iconColor']);
                }}
            });
        }
    }
}

function renderTasks() {
    if(searchTaskArray.length >= 1){
        arrayToFilter = searchTaskArray;
    } else{
        arrayToFilter = allTasks;
    }
    let todoCat = arrayToFilter.filter(t => t['section'] == 'taskCategoryToDo');

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



    let progressCat = arrayToFilter.filter(t => t['section'] == 'taskCategoryInProgress');

    document.getElementById('taskCategoryInProgress').innerHTML = '';
    if (progressCat.length > 0) {
        for (let i = 0; i < progressCat.length; i++) {
            task = progressCat[i];
            counter = 0;
            document.getElementById('taskCategoryInProgress').innerHTML = createdTaskHTML(task, i);
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



    let feedbackCat = arrayToFilter.filter(t => t['section'] == 'taskCategoryAwaitFeedback');

    document.getElementById('taskCategoryAwaitFeedback').innerHTML = '';
    if (feedbackCat.length > 0) {
        for (let i = 0; i < feedbackCat.length; i++) {
            task = feedbackCat[i];
            document.getElementById('taskCategoryAwaitFeedback').innerHTML += createdTaskHTML(task);
        }
    } else {
        document.getElementById('taskCategoryAwaitFeedback').innerHTML = '<div class="noTask" > No task in "Await feedback"</div>';
    }



    let doneCat = arrayToFilter.filter(t => t['section'] == 'taskCategoryDone');

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
    return counter
}

function checkProgressBar(task, counter) {
    let subTaskLength = task['subtask'].length;
    let barPercentLength = ((counter / subTaskLength) * 100).toFixed(2);
    return barPercentLength + '%';
}

//----Functionality---//

function klickOnArrowToMoveTask(id, section, move) {
    let taskCategorys = ['taskCategoryToDo', 'taskCategoryInProgress', 'taskCategoryAwaitFeedback', 'taskCategoryDone'];
    if ((section == taskCategorys[0] || section == taskCategorys[1] || section == taskCategorys[2]) && move == 'down') {
        let currentSectionIndex = taskCategorys.indexOf(section);
        if (currentSectionIndex < taskCategorys.length - 1) {
            allTasks[id]['section'] = taskCategorys[currentSectionIndex + 1];
        }
    }

    if ((section == taskCategorys[1] || section == taskCategorys[2] || section == taskCategorys[3]) && move == 'up') {
        let currentSectionIndex = taskCategorys.indexOf(section);
        if (currentSectionIndex <= taskCategorys.length - 1) {
            allTasks[id]['section'] = taskCategorys[currentSectionIndex - 1];
        }
    }

    renderTasks();
}

function showTaskDelete(){
document.getElementById('taskDelete').style.display="flex";
}

function closeTaskDelete(){
document.getElementById('taskDelete').style.display="none";
}

async function deleteSelectedTask(id) {
    document.getElementById('taskDelete').style.display="none";
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
        document.getElementById('editPopUpName').innerHTML += `<div><span class="iconStylePopUp"style="background-color:${allTasks[id]['iconColors'][i]}">${allTasks[id]['members'][i]}</span><span style="padding-left: 10px">${tasks[id]['assignedTo'][i]}</span</div>`;
    }
    for (let l = 0; l < tasks[id]['subtask'].length; l++) {
        document.getElementById('editPopUpList').innerHTML += `<div id="editTaskCheckboxes" onclick="changeProgressBarFromSelectedTask(${id})"><input ${tasks[id]['subtask'][l]['status']} id="editChecks${l}"type="checkbox">${tasks[id]['subtask'][l]['name']}</div>`
    }
    if (tasks[id]['priority'] == 'urgent') {
        document.getElementById('editPopUpPriority').innerHTML = '<p>urgent</p> <img src="../img/addtask-img/higPrio.png">';
        document.getElementById('editPopUpPriority').classList.add('selecturgent')
    }
    if (tasks[id]['priority'] == 'medium') {
        document.getElementById('editPopUpPriority').innerHTML = '<p>medium</p> <img src="../img/addtask-img/mediumPrio.png">';
        document.getElementById('editPopUpPriority').classList.add('selectmedium')
    }
    if (tasks[id]['priority'] == 'low') {
        document.getElementById('editPopUpPriority').innerHTML = '<p>low</p> <img src="../img/addtask-img/lowPrio.png">';
        document.getElementById('editPopUpPriority').classList.add('selectlow')
    }

    if (window.innerWidth <= 800) {
        document.getElementById('content').style.display = 'none';
    }
}

function closeEditTaskPopUp() {
    document.getElementById('editTaskPopUpWindowContent').style.display = 'none';
    document.getElementById('content').style.display = 'unset';
}


 function changeProgressBarFromSelectedTask(id){
    let task = tasks[id];
    let counter = 0;
    for (let subs = 0; subs < task.subtask.length; subs++) {
    let isChecked = document.getElementById('editChecks'+subs).checked;
        if (isChecked) {
            tasks[id].subtask[subs].status = "checked";
        } else {
            tasks[id].subtask[subs].status = "unchecked";
        }
    }
    counter = checkSubtaskProgress(task, counter);
    barPercentLength = checkProgressBar(task, counter);
    document.getElementById('progressBar' + id).style.width = barPercentLength;
    document.getElementById('progressCounter' + id).innerHTML = counter + `/${task['subtask'].length}`;
    counter = "";
    
}

//---Edit Selected Task---//

function SelectedTaskEditWindow(id) {
    let content = document.getElementById('editSelectedTask');
    content.innerHTML = "";
    content.innerHTML = selectedTaskHTML(id);
    selectedPriority = tasks[id]['priority'];
    document.getElementById('select' + tasks[id]['priority']).classList.add('select' + tasks[id]['priority']);
    /*for (let name = 0; name < allTasks[id]['members'].length; name++) {
        document.getElementById('editTaskContacts').innerHTML += `<span class="editTaskContactShort" style="background-color: ${allTasks[id]['iconColors'][name]};">${allTasks[id]['members'][name]}</span>`;
    }*/
    document.getElementById('editSelectedTask').style.display = 'flex';
    if (window.innerWidth <= 800) {
        document.getElementById('content').style.display = 'none';
    }
}


function checkSelectedContacts(id) {
    if (tasks[id]['assignedTo'][0] == "Myself") {
        document.getElementById('checkboxAssignedTo0').checked = true;
    }
    for (let checked = 0; checked < tasks[id]['assignedTo'].length; checked++) {
        for (let checkTheNames = 0; checkTheNames < contacts.length+1; checkTheNames++) {
            if (tasks[id]['assignedTo'][checked] == document.getElementById('assignedName' + checkTheNames).innerHTML) {
                document.getElementById('checkboxAssignedTo' + checkTheNames).checked = true;
            }
        }
    }
}


function closeSelectedTaskEditWindow() {
    document.getElementById('editSelectedTask').style.display = 'none';
    document.getElementById('content').style.display = 'unset';
}

async function saveChangesInTask(id){
    let title = document.getElementById('editTaskTitle').value;
    let description = document.getElementById('editTaskDescription').value;
    let date = document.getElementById('editTaskDate').value;
    if (prioIsSelected()) {
        priority = selectedPriority;
    } if (assignedToIsSelected()) {
        getTheAssignedNames();
        assignedTo = assignedToNames;
    }
    

    tasks[id]['title'] = title;
    tasks[id]['description'] = description;
    tasks[id]['date'] = date;
    tasks[id]['priority'] = priority;
    tasks[id]['assignedTo'] = assignedTo;
    
    await setTask('tasks', tasks); 
    await init();

}
//--Searchfunction--//


/**
 * this function searches tasks based on input value
 */
function searchTask() {
    const input = document.getElementById("input").value;
    searchTaskArray = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = allTasks[i];
      if (
        task.title.toLowerCase().includes(input.toLowerCase()) ||
        task.description.toLowerCase().includes(input.toLowerCase())
      ) {
        searchTaskArray.push(task);
        renderTasks();
      }
    }
  }


//----Helpfunctions---//

function showPopUpAddTask() {
    document.getElementById('addTaskPopUpWindowContent').style.display = 'flex';
}
function closePopUpAddTask() {
    document.getElementById('addTaskPopUpWindowContent').style.display = 'none';
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

//----------------------HTML-Templates------------//

function createdTaskHTML(task, i) {
    return `
    <div draggable="true" ondragstart="startDragging(${task['id']})"  onclick="showDetailsTaskPopUp(${task['id']})" class="createdTaskContent">
    <div class="categoryAndRespArrows">
        <span class="createdTaskCategory" style="background-color:#${task['color']}">${task['category']}</span>
        <span>
            <img id="arrowUpId${task['id']}" onclick="event.stopPropagation(); klickOnArrowToMoveTask(${task['id']},'${task['section']}', 'up')" class="respArrows" src="../img/board-img/ArrowUp.png"></img>
            <img id="arrowDownId${task['id']}" onclick=" event.stopPropagation();klickOnArrowToMoveTask(${task['id']},'${task['section']}', 'down')" class="respArrows" src="../img/board-img/ArrowDown.png"></img>
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
    <div style="display: flex; align-items: center; gap: 10px"> <b> Priority: </b> <span id="editPopUpPriority">${tasks[id]['priority']} <img
                src="../img/addtask-img/mediumPrio.png"></span></div>
    <div>
        <div><b>Assigned To</b></div>
        <div class="editPopUpIconAndName" id="editPopUpName"></div>
    </div>
    <div>
        <div><b>Subtasks</b></div>
        <div>
            <div class="editPopUpList" id="editPopUpList"></div>
            
        </div>
    </div>
    <div class="editPopUpDelAndEditButton">
        <span onclick="showTaskDelete()"><img src="../img/board-img/editPopUpdelete.png"> Delete </span>
        <seperator></seperator>
        <span onclick="SelectedTaskEditWindow(${id}); closeEditTaskPopUp()" class="popUpEdit"><imgactShort
                src="../img/board-img/editPopUpEdit.png"> Edit
        </span>
    </div>
</div>
<div id="taskDelete"><div><p>Are you sure?</p><div><button onclick="deleteSelectedTask(${id})">Yes!</button><button onclick="closeTaskDelete()">No!</button></div></div></div>
`

}

function selectedTaskHTML(id) {
    return `      
    <form>
    <img onclick="closeSelectedTaskEditWindow()" class="closeSelectedTaskEdit" src="../img/cancelIcon.png">
    <p class="editTaskTitles">Title</p>
    <input required id="editTaskTitle" placeholder="Enter a title....." value="${tasks[id]['title']}">
    <p class="editTaskTitles">Description</p>
    <textarea required id="editTaskDescription" placeholder="Describe your task.....">${tasks[id]['description']}</textarea>
    <p class="editTaskTitles">Due Date</p>
    <input id="editTaskDate" type="date" placeholder="dd.mm.yyyy" value="${tasks[id]['date']}">
    <p class="editTaskTitles">Prio</p>
    <div class="priorities" id="priorities">
    <span id="selecturgent" onclick="highlightPriority('urgent')">
        <p>Urgent</p><img src="../img/addtask-img/higPrio.png">
    </span>
    <span id="selectmedium" onclick="highlightPriority('medium')">
        <p>Medium</p><img src="../img/addtask-img/mediumPrio.png">
    </span>
    <span id="selectlow" onclick="highlightPriority('low')">
        <p>Low</p><img src="../img/addtask-img/lowPrio.png">
    </span>
</div>
    <p class="editTaskTitles">Assigned to</p>
    <div class="selectionAssignedTo" id="assignedToSelection">
    <div onclick="openAssignedToSelection(); checkSelectedContacts(${id})"><p>Select contacts to assign</p><img src="../img/addtask-img/arrow_drop_down.png"></div>
    </div>
    <div id="editTaskContacts"></div>
    <div class="editTaskButtonCont"><button class="editTaskOkButton" onclick="saveChangesInTask(${id}); return false"> OK <img
                src="../img/createAccIcon.png"></button></div>
    </form>`;
}





