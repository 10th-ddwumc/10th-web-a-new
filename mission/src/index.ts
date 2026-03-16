
interface Task {
  content: string;
  status: boolean;
}

const inputField = document.getElementById('todo-input') as HTMLInputElement;
const activeListContainer = document.getElementById('active-list') as HTMLUListElement;
const doneListContainer = document.getElementById('done-list') as HTMLUListElement;

window.onload = (): void => {
  fetchSavedTasks();
};

inputField.addEventListener('keydown', (e: KeyboardEvent): void => {
  if (e.key === 'Enter') {
    const value: string = inputField.value.trim();
    if (value !== "") {
      createTaskItem(value, false); 
      inputField.value = "";
      syncWithStorage(); 
    }
  }
});


function createTaskItem(text: string, completed: boolean): void {
  const li: HTMLLIElement = document.createElement('li');
  li.className = 'task-item';
  if (completed) li.classList.add('is-done');

  li.innerHTML = `
    <span class="task-text">${text}</span>
    <div class="button-group">
      ${!completed ? '<button class="btn btn--complete">완료</button>' : ''}
      <button class="btn btn--delete">삭제</button>
    </div>
  `;

  const completeBtn = li.querySelector('.btn--complete') as HTMLButtonElement | null;
  const deleteBtn = li.querySelector('.btn--delete') as HTMLButtonElement;


  if (completeBtn) {
    completeBtn.onclick = () => {
      li.classList.add('is-done');
      completeBtn.remove(); 
      doneListContainer.appendChild(li); 
      syncWithStorage();
    };
  }

  deleteBtn.onclick = () => {
    if (confirm('이 할 일을 목록에서 삭제할까요?')) {
      li.remove();
      syncWithStorage();
    }
  };
  
  if (completed) {
    doneListContainer.appendChild(li);
  } else {
    activeListContainer.appendChild(li);
  }
}


function syncWithStorage(): void {
  const data: Task[] = [];

  document.querySelectorAll('.task-item').forEach((item) => {
    const textElement = item.querySelector('.task-text') as HTMLElement;
    data.push({
      content: textElement.innerText,
      status: item.classList.contains('is-done')
    });
  });
  localStorage.setItem('my_task_data_ts_v1', JSON.stringify(data));
}


function fetchSavedTasks(): void {
  const stored: string | null = localStorage.getItem('my_task_data_ts_v1');
  if (stored) {
    try {
      const parsedData: unknown = JSON.parse(stored);
     
      if (Array.isArray(parsedData)) {
        parsedData.forEach((task: Task) => {
          createTaskItem(task.content, task.status);
        });
      }
    } catch (error) {
      console.error("데이터 복구 중 오류 발생:", error);
    }
  }
}