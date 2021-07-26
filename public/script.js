const e = require("express")

function renderTodos(todosArray) {
    const todosHtmlArray = todosArray.map(todo => {
        return `<li class="${todo.completed ? 'completed' : 'incomplete'}">
        ${todo.text}
        <button class="complete-button" data-id="${todo.id}"
            data-completed="${todo.completed ? 'completed' : 'incomplete'}"
        >✅</button>
        <input class="edit-field" id="edit-${todo.id} type="text" value="${todo.text}">
        <button class="update-button" data-id="${todo.id}">💾</button>
        <button class="complete-button" data-id="${todo.id}"></button>
        <button class="delete-button" data-id="${todo.id}">🗑</button>
        </li>`
    })

    return todosHtmlArray.join('')
}

function fetchTodos() {
    fetch('/api/v1/todos')
        .then(res => res.json())
        .then(data => {
            console.log(data)
            todos.innerHTML = renderTodos(data)
        })
}

const todos = document.getElementById('todos')
const todoForm = document.getElementById('todoForm')

fetchTodos()

todoForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const input = document.getElementById('todo_text')
    fetch('/api/v1/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: input.value
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error)
            }
            fetchTodos()
            todoForm.reset()
        })
})

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
        const id = e.target.dataset.id;
        fetch(`/api/v1/todos/${id}`, {
            method: 'DELETE'
        })
            .then(res => !res.ok && res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error)
                }
                fetchTodos()
            })
    }

    if (e.target.classList.contains('complete-button')) {
        const id = e.target.dataset.id;
        const completed = e.target.dataset.completed;
        fetch(`/api/v1/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completed: completed === 'completed' ? false : true
            })
        })
            .then(res => !res.ok && res.json())
            .then(data => {
                if (data.error) {
                    alert(data.error)
                }
                fetchTodos()
            })
    }
})

if (e.target.classList.contains('update-button')) {
    // get the id
    const id = e.target.dataset.id;
    // get input using the same it 
    const editField = document.getElementById(`edit-${id}`)
    // get the text from the text field
    const newValue =editField.value
}
