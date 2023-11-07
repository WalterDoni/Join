function taskData(task, i) {
    return {
        'id': i,
        'category': task['category'],
        'title': task['title'],
        'description': task['description'],
        'members': short,
        'iconColors': iconNameColor,
        'section': task['section'],
        'color': task['categoryColor'],
        'priority': task['priority'],
        'subtask': task['subtask']}
    
}

async function updateTaskDetails(id, title, description, date, priority, assignedTo) {
    tasks[id]['title'] = title;
    tasks[id]['description'] = description;
    tasks[id]['date'] = date;
    tasks[id]['priority'] = priority;
    tasks[id]['assignedTo'] = assignedTo;

    await setTask('tasks', tasks);
}

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
        <span class="createdTaskProgressBar"><div id="progressBar${task['id']}" class="barColor"></div></span>
        <span class="createdTaskProgressText" id="progressCounter${task['id']}"></span>
    </div>
    <div class="createdTaskAssignedAndPriority">
        <span class="createdTaskAssignedMember" id="createdTaskAssignedMember${task['id']}"></span>
        <span class="createdTaskPriority" id="rightPrio${task['id']}"><img src="../img/addtask-img/higPrio.png"></span>
    </div>
</div>
`
}

function showDetailsTaskPopUpHTML(id) {
    return `
<div class="editPopUpWindow" onclick="doNotCloseWhenClickedInsightContainer()">
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
    <form onclick="hideAssignedToDropDownMenu()">
    <img onclick="closeSelectedTaskEditWindow()" class="closeSelectedTaskEdit" src="../img/cancelIcon.png">
    <p class="editTaskTitles">Title</p>
    <input required id="editTaskTitle" placeholder="Enter a title....." value="${tasks[id]['title']}">
    <p class="editTaskTitles">Description</p>
    <textarea required id="editTaskDescription" placeholder="Describe your task.....">${tasks[id]['description']}</textarea>
    <p class="editTaskTitles">Due Date</p>
    <input id="editTaskDate" type="date" placeholder="dd.mm.yyyy" value="${tasks[id]['date']}">
    <p class="editTaskTitles">Prio</p>
    <div class="priorities" id="editPriorities">
    <span id="editSelecturgent" onclick="editHighlightPriority('urgent')">
        <p>Urgent</p><img src="../img/addtask-img/higPrio.png">
    </span>
    <span id="editSelectmedium" onclick="editHighlightPriority('medium')">
        <p>Medium</p><img src="../img/addtask-img/mediumPrio.png">
    </span>
    <span id="editSelectlow" onclick="editHighlightPriority('low')">
        <p>Low</p><img src="../img/addtask-img/lowPrio.png">
    </span>
</div>
    <p class="editTaskTitles">Assigned to</p>
    <div class="selectionAssignedTo" id="editAssignedToSelection">
    <div onclick="checkSelectedContacts(${id})"><p>Select contacts to assign</p><img src="../img/addtask-img/arrow_drop_down.png"></div>
    </div>
    
    <div class="createdTaskAssignedMember" id="assginedMembersEditTask" ></div>

    <div id="editTaskContacts"></div>
    <div class="editTaskButtonCont"><button class="editTaskOkButton" onclick="saveChangesInTask(${id}); return false"> OK <img
                src="../img/createAccIcon.png"></button></div>
    </form>`;
}


