//1.HTML 요소 선택 
const todoInput = document.getElementById('todo-input') as HTMLInputElement; //할일 입력하는 값
//const var let 타입 정해진게 x
//getElementById의 기본 반환 타입이 애매해서 두가지 타입 HTMLElement와 null 중 입력이 무조건 들어올거라고 안심시키는 용도 ->에러로 처리 안함
const todoForm = document.getElementById('todo-form') as HTMLFormElement; //폼 내용 받아오기이므로
const todoList = document.getElementById('todo-list') as HTMLUListElement; //unorderlist 내용 가져오기 - 할일목록
const doneList = document.getElementById('done-list') as HTMLUListElement;

//2.할 일이 어떻게 생긴애인지 Type을 정의
type Todo = {
    id: number; //id가 발생하면 number type이고 text는 string 타입임을 정의
    text: string;
};

//값이 들어갈 빈 배열 만들기
let todos: Todo[] = []; //todos에는 위에 선언한 Todo 타입에 맞춘 값만 배열로 들어갈 수 있음
let doneTasks: Todo[] = [];

//-할 일 목록 렌더링 하는 함수를 정의
const renderTasks = (): void => { //비어있고 반환도 void함수
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach((todo): void => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });

    doneTasks.forEach((todo) : void => {
        const li = createTodoElement(todo, true);
        doneList.appendChild(li);
    })
};

//3.할 일 텍스트 입력 처리 함수 (사용자가 앞에 공백넣어 입력했을 때 공백 잘라줌)
const getTodoText = (): string => {
    return todoInput.value.trim(); //앞 공백 자른 문자열 반환
}

//4. 할 일 추가 처리 함수
const addTodo = (text: string): void => {
    todos.push({id: Date.now(), text}) //text: text이지만 변수와 타입 같으면 자바스크립트에서 삭제 가능
    todoInput.value = ''; //값 입력 받고 그 창 지워주기
    renderTasks(); //추가했으니 렌더링 다시 할 것
}

//5. 할 일 상태 변경 (완료로 이동)
const completeTodo = (todo: Todo): void => {
    todos = todos.filter((t): boolean => t.id !== todo.id);
    //todo의 리스트에서 없애주는 역할 fileter 함수
    //(id, text) 쌍들이 있는 구조에서 t라는 객체 변수로 그 쌍들을 차례로 순회
    //어떤 쌍의 id가 조건 만족하면 배열에 남김
    //지워지기로 한 todo.id와 일치하지 않는 t.id는 리스트에 남는 함수
    doneTasks.push(todo);
    renderTasks();
}

//6. 완료된 할 일 삭제 함수
const deleteTodo = (todo: Todo): void => {
    doneTasks = doneTasks.filter((t): boolean => t.id !== todo.id);
    renderTasks();
}

//7. 할 일 아이템 생성
const createTodoElement = (todo: Todo, isDone: boolean): HTMLLIElement => {
    const li = document.createElement('li');
    li.classList.add('render-container__item');
    li.textContent = todo.text;

    const button = document.createElement('button');
    button.classList.add('render-container__item-button');

    if(isDone) {
        button.textContent = '삭제'; //버튼이 삭제이면 배경색 맞게 설정
        button.style.backgroundColor = '#dc3545';
    } else{
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745';
    }
    
    button.addEventListener('click', () : void => {
        if(isDone) {
            deleteTodo(todo); //완료 목록에서 누른거면 삭제
        }else {
            completeTodo(todo);
        }
    });

    li.appendChild(button);
    return li;
};

//8. 폼 제출 이벤트 리스너
todoForm.addEventListener('submit', (event: Event): void => { //submit이라는 동작을 하면, event는 내장이고 event 발생 정보를 넘겨줌
    event.preventDefault(); //폼 제출하면 기본적으로 새로고침->그거(브라우저의 기본동작) 막기
    const text = getTodoText(); //아까 3번 함수로 처리한 입력값 text로
    if(text) { //text가 있으면 todoList에 만들어 놓은 함수 이용해서 넣기
        addTodo(text);
    }
});

renderTasks();