// HTML 요소 선택
var todoInput = document.getElementById('todo-input');
var todoForm = document.getElementById('todo-form');
var todoList = document.getElementById('todo-list');
var doneList = document.getElementById('done-list');
var todos = [];
var doneTasks = [];
//할 일 목록 랜더링 하는 함수 정의
var renderTasks = function () {
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    todos.forEach(function (todo) {
        var li = createTodoELement(todo, false);
        todoList.appendChild(li);
    });
    doneTasks.forEach(function (todo) {
        var li = createTodoELement(todo, true);
        doneList.appendChild(li);
    });
};
//할 일 텍스트 입력 처리 함수(공백잘라줌)
var getTodoText = function () {
    return todoInput.value.trim();
};
//할 일 추가 처리 함수
var addTodo = function (text) {
    todos.push({ id: Date.now(), text: text });
    todoInput.value = '';
    renderTasks();
};
// 할 일 상태 변경(완료로 이동) 
var completeTodo = function (todo) {
    todos = todos.filter(function (t) { return t.id !== todo.id; });
    doneTasks.push(todo);
    renderTasks();
};
// 완료된 할 일 삭제 함수
var deleteTodo = function (todo) {
    doneTasks = doneTasks.filter(function (t) { return t.id !== todo.id; });
    renderTasks();
};
// 할 일 아이템 생성 함수(완료 여부에 다라 버튼 텍스트나 색상 설정)
var createTodoELement = function (todo, isDone) {
    var li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;
    var button = document.createElement('button');
    button.classList.add('render-container__item-button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }
    button.addEventListener('click', function () {
        if (isDone) {
            deleteTodo(todo);
        }
        else {
            completeTodo(todo);
        }
    });
    li.appendChild(button);
    return li;
};
//폼 제출 이벤트 리스너 
todoForm.addEventListener('submit', function (event) {
    event.preventDefault();
    var text = getTodoText();
    if (text) {
        addTodo(text);
    }
});
renderTasks();
