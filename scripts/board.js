let currentDraggedElement;
let allTasks = [];


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

function loadTasksForBoard(){

    for (let i = 0; i < tasks.length; i++) {
        let task = tasks[i]; 
        remoteTask = {
            'id': i, 
            'category': task['category'],
            'title': task['title'],
            'description': task['description'],
            'progessText': '0/2 Done', //To-Do
            'member': 'WD',//To-Do
            'section': 'taskCategoryToDo',
            'color': task['categoryColor'],
        }
        allTasks.push(remoteTask);
    }

}

function renderTasks() {

    let todoCat = allTasks.filter(t => t['section'] == 'taskCategoryToDo');

    document.getElementById('taskCategoryToDo').innerHTML = '';
    if (todoCat.length > 0) {
        for (let i = 0; i < todoCat.length; i++) {
            task = todoCat[i];
            document.getElementById('taskCategoryToDo').innerHTML += createdTaskHTML(task);
        }
    } else {
        document.getElementById('taskCategoryToDo').innerHTML = '<div class="noTask"> No task in "To do"</div>';
    }



    let progressCat = allTasks.filter(t => t['section'] == 'taskCategoryInProgress');

    document.getElementById('taskCategoryInProgress').innerHTML = '';
    if (progressCat.length > 0) {
        for (let i = 0; i < progressCat.length; i++) {
            task = progressCat[i];
            document.getElementById('taskCategoryInProgress').innerHTML += createdTaskHTML(task);
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


async function deleteSelectedTask(id){
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
    
function showDetailsTaskPopUp(id){
   
    let showDetailsTaskPopUp =  document.getElementById('editTaskPopUpWindowContent');
    showDetailsTaskPopUp.style.display = 'flex';
    showDetailsTaskPopUp.innerHTML = showDetailsTaskPopUpHTML(id);

   
    if(window.innerWidth <= 800){
        document.getElementById('content').style.display ='none';
    }
}
function closeEditTaskPopUp(){
    document.getElementById('editTaskPopUpWindowContent').style.display = 'none';
    document.getElementById('content').style.display ='unset';
}



//----Helpfunctions---//

function showPopUpAddTask() {
    document.getElementById('addTaskPopUpWindowContent').style.display = 'flex';
}
function closePopUpAddTask() {
    document.getElementById('addTaskPopUpWindowContent').style.display = 'none';
}

function SelectedTaskEditWindow(){
    document.getElementById('editSelectedTask').style.display = 'flex';
    if(window.innerWidth <= 800){
        document.getElementById('content').style.display ='none';
    }
}
function closeSelectedTaskEditWindow(){
    document.getElementById('editSelectedTask').style.display = 'none';
    document.getElementById('content').style.display ='unset';
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

 //----------------------HTML-Templates------------//

function showDetailsTaskPopUpHTML(id){
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
        <div class="editPopUpIconAndName"><span class="editPopUpIconName">WD</span><span
                class="editPopUpName">${tasks[id]['assignedTo']}</span></div>
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



function createdTaskHTML(task) {
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
        <span class="createdTaskProgressBar"></span>
        <span class="createdTaskProgressText">${task['progressText']}</span>
    </div>
    <div class="createdTaskAssignedAndPriority">
        <span class="createdTaskAssignedMember">${task['member']}</span>
        <span class="createdTaskPriority"><img src="../img/addtask-img/higPrio.png"></span>
    </div>
</div>
`
}







