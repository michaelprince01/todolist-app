// =======================
// SELECT ELEMENTS
// =======================
const input = document.querySelector('input[type=text]');
const todoList = document.querySelector('.todo-items');
const itemsLeft = document.querySelector('.remain .number');
const filterAll = document.querySelector('.all-todos');
const filterActive = document.querySelector('.active-todos');
const filterCompleted = document.querySelector('.completed-todos');
const clearCompleted = document.querySelector('.clear-todos');
const themeIcon = document.querySelector('.theme-icon');

// toggle between light and dark logic
// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeIcon.src = './images/icon-sun.svg';
}

// Toggle theme
themeIcon.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  if (document.body.classList.contains('dark')) {
    themeIcon.src = './images/icon-sun.svg';
    localStorage.setItem('theme', 'dark');
  } else {
    themeIcon.src = './images/icon-moon.svg';
    localStorage.setItem('theme', 'light');
  }
});

// a group array of filter buttons for easy looping
filterBtns = [filterAll, filterActive, filterCompleted];

// =======================
// LOAD TODOS
// =======================
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Load saved todos on page load
todos.forEach((todo) => {
  createTodoItem(todo.text, todo.completed, true); // true = loading mode
});

// Update counter after all todos are loaded
updateItemsLeft();

// =======================
// CREATE TODO FUNCTION
// =======================
function createTodoItem(text, completed = false, isLoading = false) {
  const newTodo = { text: text, completed: completed };

  // Only push & save when it's a new todo
  if (!isLoading) {
    todos.push(newTodo);
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  // Create DOM elements
  const li = document.createElement('li');
  li.classList.add('todo-item');

  const check = document.createElement('div');
  check.classList.add('check');

  const todoText = document.createElement('p');
  todoText.classList.add('todo-text');
  todoText.textContent = text;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete');

  const deleteImg = document.createElement('img');
  deleteImg.src = './images/icon-cross.svg';
  deleteBtn.appendChild(deleteImg);

  // Append to li
  li.appendChild(check);
  li.appendChild(todoText);
  li.appendChild(deleteBtn);

  // Apply completed style if loaded from storage
  if (completed) {
    check.classList.add('completed');
    todoText.classList.add('completed');
  }

  // =======================
  // MARK COMPLETED
  // =======================
  check.addEventListener('click', () => {
    check.classList.toggle('completed');
    todoText.classList.toggle('completed');

    // Update the actual todo in the array
    const todoInArray = todos.find((t) => t.text === text);
    if (todoInArray) {
      todoInArray.completed = !todoInArray.completed;
    }

    localStorage.setItem('todos', JSON.stringify(todos));
    updateItemsLeft();
  });

  // =======================
  // DELETE TODO
  // =======================
  deleteBtn.addEventListener('click', () => {
    li.remove();

    // Remove from array
    todos = todos.filter((t) => t.text !== text);
    localStorage.setItem('todos', JSON.stringify(todos));

    updateItemsLeft();
  });

  // Add li to list
  todoList.appendChild(li);

  // Clear input
  input.value = '';
}

// =======================
// ADD TODO ON ENTER
// =======================
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const text = input.value.trim();
    if (text) {
      createTodoItem(text);
      updateItemsLeft();
    }
  }
});

// =======================
// UPDATE ITEMS LEFT
// =======================
function updateItemsLeft() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  itemsLeft.textContent = remaining;
}

function renderTodos(filter = 'all') {
  // clear list
  todoList.innerHTML = '';

  // loop through todos and display based on filter
  todos.forEach((todo) => {
    if (filter === 'all') {
      createTodoItem(todo.text, todo.completed, true);
    }

    if (filter === 'active' && !todo.completed) {
      createTodoItem(todo.text, false, true);
    }

    if (filter === 'completed' && todo.completed) {
      createTodoItem(todo.text, true, true);
    }
  });

  updateItemsLeft();
}

filterAll.addEventListener('click', () => {
  renderTodos('all');
  setActiveFilter(filterAll);
});

filterActive.addEventListener('click', () => {
  renderTodos('active');
  setActiveFilter(filterActive);
});

filterCompleted.addEventListener('click', () => {
  renderTodos('completed');
  setActiveFilter(filterCompleted);
});

clearCompleted.addEventListener('click', () => {
  // Remove completed todos from array
  todos = todos.filter((todo) => !todo.completed);

  // Save updated array
  localStorage.setItem('todos', JSON.stringify(todos));

  // Re-render only active todos
  renderTodos('all');
});

// looping through our filter button to add the active class
function setActiveFilter(button) {
  filterBtns.forEach((btn) => btn.classList.remove('active'));
  button.classList.add('active');
}
