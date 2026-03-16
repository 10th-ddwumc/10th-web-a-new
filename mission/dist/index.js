"use strict";
const inputField = document.getElementById('todo-input');
const activeListContainer = document.getElementById('active-list');
const doneListContainer = document.getElementById('done-list');
window.onload = () => {
    fetchSavedTasks();
};
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const value = inputField.value.trim();
        if (value !== "") {
            createTaskItem(value, false);
            inputField.value = "";
            syncWithStorage();
        }
    }
});
function createTaskItem(text, completed) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (completed)
        li.classList.add('is-done');
    li.innerHTML = `
    <span class="task-text">${text}</span>
    <div class="button-group">
      ${!completed ? '<button class="btn btn--complete">완료</button>' : ''}
      <button class="btn btn--delete">삭제</button>
    </div>
  `;
    const completeBtn = li.querySelector('.btn--complete');
    const deleteBtn = li.querySelector('.btn--delete');
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
    }
    else {
        activeListContainer.appendChild(li);
    }
}
function syncWithStorage() {
    const data = [];
    document.querySelectorAll('.task-item').forEach((item) => {
        const textElement = item.querySelector('.task-text');
        data.push({
            content: textElement.innerText,
            status: item.classList.contains('is-done')
        });
    });
    localStorage.setItem('my_task_data_ts_v1', JSON.stringify(data));
}
function fetchSavedTasks() {
    const stored = localStorage.getItem('my_task_data_ts_v1');
    if (stored) {
        try {
            const parsedData = JSON.parse(stored);
            if (Array.isArray(parsedData)) {
                parsedData.forEach((task) => {
                    createTaskItem(task.content, task.status);
                });
            }
        }
        catch (error) {
            console.error("데이터 복구 중 오류 발생:", error);
        }
    }
}
