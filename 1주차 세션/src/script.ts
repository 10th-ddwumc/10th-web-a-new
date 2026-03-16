//1.HTML 요소 선택 
const todoInput = document.getElementById('todo-input') as HTMLInputElement;
const todoForm = document.getElementById('todo-form') as HTMLFormElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;

//2.Todo 타입 정의
type Todo = {
    id: number;
    text: string;
    isDone: boolean; // 완료 여부 추가
};

//배열 하나만 사용
let todos: Todo[] = [];

//할 일 목록 렌더링
const renderTasks = (): void => {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo): void => {
        const li = createTodoElement(todo);

        if (todo.isDone) {
            doneList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }
    });
};

//할 일 텍스트 입력 처리
const getTodoText = (): string => {
    return todoInput.value.trim();
}

//할 일 추가
const addTodo = (text: string): void => {
    todos.push({
        id: Date.now(),
        text,
        isDone: false
    });

    todoInput.value = '';
    renderTasks();
}

//할 일 완료 처리
const completeTodo = (todo: Todo): void => {
    todos = todos.map((t): Todo =>
        t.id === todo.id ? { ...t, isDone: true } : t
    );

    renderTasks();
}

//완료된 할 일 삭제
const deleteTodo = (todo: Todo): void => {
    todos = todos.filter((t): boolean => t.id !== todo.id);
    renderTasks();
}

//할 일 아이템 생성
const createTodoElement = (todo: Todo): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if (todo.isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545';
    } else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }

    button.addEventListener('click', (): void => {
        if (todo.isDone) {
            deleteTodo(todo);
        } else {
            completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;
};

//폼 제출 이벤트
todoForm.addEventListener('submit', (event: Event): void => {
    event.preventDefault();
    const text = getTodoText();

    if (text) {
        addTodo(text);
    }
});

renderTasks();