//1. HTML 요소 선택
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

//2. Todo 타입 정의
type Todo ={
    id: number;
    text: string;
    isDone: boolean; //수정 (완료 여부 상태 추가)
};

let todos : Todo[]= []; //수정 (todos 배열 하나만 사용)
// let doneTasks : Todo[]= []; //수정 (완료 배열 제거)

// - 할 일 목록 렌더링 하는 함수
const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo) : void => { //수정 (하나의 배열만 순회)
        const li = createTodoElement(todo); //수정 (isDone 인자 제거)

        if(todo.isDone){ //수정
            doneList.appendChild(li);
        }else{ //수정
            todoList.appendChild(li);
        }
    });
};

//3. 할 일 텍스트 입력 처리 함수
const getTodoText = (): string => {
    return todoInput.value.trim();
};

//4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({
        id: Date.now(),
        text: text,
        isDone: false //수정 (기본 상태 false)
    });
    todoInput.value = '';
    renderTasks();
};

//5. 할 일 상태 변경(완료 처리)
const completeTodo = (todo: Todo): void => {
    todo.isDone = true; //수정 (배열 이동 대신 상태 변경)
    renderTasks();
};

//6. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    todos = todos.filter((t) : boolean => t.id !== todo.id); //수정 (doneTasks 대신 todos에서 삭제)
    renderTasks();
};

//7. 할 일 아이템 생성 함수
const createTodoElement = (todo: Todo): HTMLLIElement => { //수정 (isDone 파라미터 제거)
    const li = document.createElement('li');
    li.classList.add('render-container__item');

    const text = document.createElement('p'); //수정 (텍스트 요소 분리)
    text.classList.add('render-container__item-text');
    text.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (todo.isDone) { //수정
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', () : void => {
        if (todo.isDone) { //수정
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });

    li.appendChild(text); //수정
    li.appendChild(button);
    return li;

};

//8. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event: Event) : void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

renderTasks();

/* 피드백 전 코드
//1. HTML 요소 선택(핸드북 자바 스크립트 편 참고)
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

//2. 할 일이 어떻게 생긴 애인지 Type을 정의
type Todo ={
    id: number;
    text: string;
};

let todos : Todo[]= [];
let doneTasks : Todo[]= [];

// - 할 일 목록 렌더링 하는 함수를 정의
const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo) : void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo) : void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    });
};

//3. 할 일 텍스트 입력 처리 함수(공백잘라줌)
const getTodoText = (): string => {
    return todoInput.value.trim();
};

//4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({
        id: Date.now(),
        text: text
    });
    todoInput.value = '';
    renderTasks();
};

//5. 할 일 상태 변경(완료로 이동)
const completeTodo = (todo: Todo): void => {
    todos = todos.filter((t) : boolean => t.id !== todo.id); //일치하지않는 것뺴고 렌더링 시키기
    doneTasks.push(todo);
    renderTasks();
};

//6. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t) : boolean => t.id !== todo.id);
    renderTasks();
};

//7. 할 일 아이템 생성 함수 (완료 여부에 따라 버튼 텍스트나 색상 설정)
//리스트 안에 아이템안에 텍스트와 버튼을 만들어 줬었음
// <ul id="todo-list" class="render-container__list">
//                     <li class="render-container__item">
//                         <p class="render-container__item-text">123</p>
//                         <button class="render-container__item-button">삭제</button>
//                     </li>
//                 </ul>  
//이걸 동적으로 만든다고 생각하기
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', () : void => {
        if (isDone) {
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;

};

//8. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event: Event) : void => {
    event.preventDefault();
    const text = getTodoText();
    if (text) {
        addTodo(text);
    }
});

renderTasks();

*/