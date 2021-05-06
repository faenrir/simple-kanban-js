const navbar = document.querySelector("#navbar");
const container = document.querySelector("#container");
const cardContainers = Array.from(document.querySelectorAll("#card-container"));
const todoTemplate = document.querySelector("#data-todo-template");

const btnSubmitTodo = document.querySelector("#btn-submit-todo");
const modalTitle = document.querySelector("#todoTitle");
const modalText = document.querySelector("#todoText");

const LOCAL_STORAGE_PREFIX = "SIMPLE_KANBAN_BOARD";
const TODOS_STORAGE_KEY = `${LOCAL_STORAGE_PREFIX}-todos`;
let todos = loadTodos();

document.addEventListener("click", e => {
  if (!e.target.matches("[data-button-delete]")) return;

  const parent = e.target.closest(".card");
  const todoId = parent.dataset.todoId;

  parent.remove();
  todos = todos.filter(t => t.id !== todoId);

  saveTodos();
});

document.addEventListener("dragend", e => {
  if (!e.target.matches("#todoCard")) return;
  const elementFromPoint = document.elementFromPoint(e.x, e.y);
  const cardContainer = elementFromPoint
    .closest(".col")
    .querySelector("#card-container");
  if (cardContainer) {
    const todoIndex = todos.findIndex(x => x.id === e.target.dataset.todoId);

    const todoElement = {
      title: todos[todoIndex].title,
      text: todos[todoIndex].text,
      id: todos[todoIndex].id,
      col: elementFromPoint.closest(".col").id,
    };

    todos[todoIndex] = todoElement;
    renderTodos();
  }
});

function renderTodos() {
  cardContainers.forEach(element => {
    element.innerHTML = "";
  });
  todos.forEach(todo => {
    const cardContainer = document
      .querySelector(`#${todo.col}`)
      .querySelector("#card-container");

    const todoElement = todoTemplate.content.cloneNode(true);

    const todoCard = todoElement.querySelector(".card");

    const todoTitle = todoElement.querySelector("[data-todo-title]");
    todoTitle.innerText = todo.title;

    const todoText = todoElement.querySelector("[data-todo-text]");
    todoText.innerText = todo.text;

    todoCard.dataset.todoId = todo.id;

    cardContainer.appendChild(todoElement);
  });
  saveTodos();
}

btnSubmitTodo.addEventListener("click", e => {
  const todoElement = {
    title: modalTitle.value,
    text: modalText.value,
    id: new Date().valueOf().toString(),
    col: "col-todo",
  };

  todos.push(todoElement);
  renderTodos();
});

function saveTodos() {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  const todosString = localStorage.getItem(TODOS_STORAGE_KEY);
  return JSON.parse(todosString) || [];
}
renderTodos();
