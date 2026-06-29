const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function updateStats() {
    totalCount.textContent = todos.length;
    completedCount.textContent = todos.filter(todo => todo.completed).length;
}

function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        todoList.innerHTML = '<div class="empty-message">할일을 추가해보세요! ✨</div>';
        updateStats();
        return;
    }

    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input
                type="checkbox"
                class="checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${index})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">삭제</button>
        `;

        todoList.appendChild(li);
    });

    updateStats();
}

function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('할일을 입력해주세요!');
        return;
    }

    todos.push({
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    });

    todoInput.value = '';
    todoInput.focus();
    saveTodos();
    renderTodos();
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function deleteTodo(index) {
    if (confirm('정말 삭제하시겠습니까?')) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, char => map[char]);
}

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

renderTodos();
