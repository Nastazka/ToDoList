/*Задачи, введенные пользователем в инпут, будут сохраняться
отдельными объектами в массив.
Полученный массив будет сохраняться в LocalStorage браузера
(т.е. при обновлении страницы задачи не будут пропадать) */

const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

function addLeadingZero(n) {
    return (n < 10) ? '0' + n : n;
}

function getUserTime(t) {
    let Y = t.getFullYear();
    let M = addLeadingZero(t.getMonth() + 1);
    let D = addLeadingZero(t.getDate());
    let d = days[t.getDay()];
    let h = addLeadingZero(t.getHours());
    let m = addLeadingZero(t.getMinutes());
    //console.log(Y, M, D, d, h, m);
    return `${Y}.${M}.${D} (${d}) ${h}:${m}`
}

const addTaskBtn = document.getElementById('add-task');
const titleTaskInput = document.getElementById('title-task');
const descTaskInput = document.getElementById('desc-task');
const todosWrapper = document.querySelector('.todos-wrapper');

let tasks;
!localStorage.tasks ? tasks = [] : tasks = JSON.parse(localStorage.getItem('tasks'));
/*если localStorage пустой, то массив tasks тоже будет пустым
и2наче мы получаем объекты из массива с помощью getItem
И если в localStorage уже были элементы, то прибавится тот, который введёт пользователь*/

let todoItemElems = [];

function Task(title, description, time) {
    this.title = title;/*получаем название из инпута*/
    this.description = description;/*получаем описание из инпута*/
    this.time = getUserTime(new Date(Date.now()));
    this.completed = false;/*по умолчанию задача не выполнена*/
    this.important = false;/*по умолчанию задача не важная*/
}


function createTemplate(task, index) {
    return `
        <div class="todo-item ${task.completed ? 'checked' : ''} ${task.important ? 'important' : ''}">
            <div class="task-text">
                <div class="title">${task.title}</div>
                <div class="description">${task.description}</div>
                <div class="date">${task.time}</div>
            </div>
            <div class="buttons">
                <input onclick="completeTask(${index})" class="btn-complete" type="checkbox" ${task.completed ? 'checked' : ''}>
                <input onclick="importantTask(${index})" class="btn-important" type="radio" ${task.important ? 'important' : ''}>
                <button onclick="deleteTask(${index})" class="btn-delete">Delete</button>
            </div>
        </div>
    `
}

/*фильтрация задач: наверху активные, внизу завершённые*/
const filterTasks = () => {
    const activeTasks = tasks.length && tasks.filter(item => item.completed == false);
    const completedTasks = tasks.length && tasks.filter(item => item.completed == true);
    tasks = [...activeTasks,...completedTasks];
}

const fillHtmlList = () => {
    todosWrapper.innerHTML = "";
    if(tasks.length > 0) {
        filterTasks();
        tasks.forEach((item, index) => {
            todosWrapper.innerHTML += createTemplate(item, index);
        });
        todoItemElems = document.querySelectorAll('.todo-item');
    }
}

fillHtmlList();/*инициализация страницы */

const updateLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const completeTask = index => {
    tasks[index].completed = !tasks[index].completed;
    if(tasks[index].completed) {
        todoItemElems[index].classList.add('checked');
    } else {
        todoItemElems[index].classList.remove('checked');
    }
    updateLocal();
    fillHtmlList();
}

const importantTask = index => {
    tasks[index].important = !tasks[index].important;
    if (tasks[index].important) {
        todoItemElems[index].classList.add('important');
    } else {
        todoItemElems[index].classList.remove('important');
    }
    updateLocal();
    fillHtmlList();
}

addTaskBtn.addEventListener('click', () => {
    tasks.push(new Task(titleTaskInput.value, descTaskInput.value));
    /*Метод push отправляет в конец массива новое значение
    в нашем случае, новую задачу */
    updateLocal();
    fillHtmlList();
    descTaskInput.value = '';/*зачистка инпута*/
    titleTaskInput.value = '';
})

const deleteTask = index => {
    todoItemElems[index].classList.add('delition');
    setTimeout(() => {
        tasks.splice(index, 1);
        updateLocal();
        fillHtmlList();
    }, 250)
}