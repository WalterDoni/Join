let currentDraggedElement;

let allTasks = [{
    'id': 0,
    'category': 'IT',
    'title': 'Programmieren',
    'description': 'Neu aufsetzen',
    'progressText': '0/2 Done',
    'member': 'WD',
    'section': 'taskCategoryToDo',
},
{
    'id': 1,
    'category': 'Lernen',
    'title': 'Arbeiten',
    'description': 'Anstrengend',
    'progressText': '0/2 Done',
    'member': 'WD',
    'section': 'taskCategoryInProgress',
}];


//----Render functions---//

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
    let categorys = ['taskCategoryToDo', 'taskCategoryInProgress', 'taskCategoryAwaitFeedback', 'taskCategoryDone'];
    
    if ((section == categorys[0] || section == categorys[1] || section == categorys[2]) && move == 'up') {
        let currentSectionIndex = categorys.indexOf(section);
        if (currentSectionIndex < categorys.length - 1) {
            allTasks[id]['section'] = categorys[currentSectionIndex + 1];
        }
    }

    
    if ((section == categorys[1] || section == categorys[2] || section == categorys[3]) && move == 'down') {
        let currentSectionIndex = categorys.indexOf(section);
        if (currentSectionIndex <= categorys.length - 1) {
            allTasks[id]['section'] = categorys[currentSectionIndex - 1];
        }
    }
    
    renderTasks();
}






//----Help functions---//

function showPopUpAddTask() {
    document.getElementById('addTaskPopUpWindowContent').style.display = 'flex';
}
function closePopUpAddTask() {
    document.getElementById('addTaskPopUpWindowContent').style.display = 'none';
}


function showEditTaskPopUp(){
    document.getElementById('editTaskPopUpWindowContent').style.display = 'flex';
    if(window.innerWidth <= 800){
        document.getElementById('content').style.display ='none';
    }
}
function closeEditTaskPopUp(){
    document.getElementById('editTaskPopUpWindowContent').style.display = 'none';
    document.getElementById('content').style.display ='unset';
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

//----Drag and drop functions---//

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

function createdTaskHTML(task) {
return `
    <div draggable="true" ondragstart="startDragging(${task['id']})"  onclick="showEditTaskPopUp()" class="createdTaskContent">
    <div class="categoryAndRespArrows">
        <span class="createdTaskCategory">${task['category']}</span>
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







