const newTodoForm = document.querySelector('#new-todo-form');
const todoList = document.querySelector('#todo-list');
const todoFooter = document.querySelector(".todo-footer");
const clearCompleted = document.querySelector(".clear-completed");
const footerMenus = document.querySelectorAll(".footer-menus li");

let todos = [],
  filteredTasks = [],
  isShowAllTasks = true;



window.addEventListener('load', () => {
	todos = JSON.parse(localStorage.getItem('todos')) || [];
	const nameInput = document.querySelector('#name');
	const newTodoForm = document.querySelector('#new-todo-form');

	const username = localStorage.getItem('username') || '';

	nameInput.value = username;

	nameInput.addEventListener('change', (e) => {
		localStorage.setItem('username', e.target.value);
	})

	newTodoForm.addEventListener('submit', e => {
		e.preventDefault();

		const todo = {
			content: e.target.elements.content.value,
			category: e.target.elements.category.value,
			done: false,
			createdAt: Date.now(),
		}

		todos.push(todo);

		localStorage.setItem('todos', JSON.stringify(todos));

		// Reset the form
		e.target.reset();

		//newly created
		todoList.dispatchEvent(new CustomEvent("updateTask"));
		displayFooterIfHaveTasks();


		DisplayTodos()
	})

	DisplayTodos()
})

function DisplayTodos () {
	const todoList = document.querySelector('#todo-list');
	todoList.innerHTML = "";

	todos.forEach(todo => {
		const todoItem = document.createElement('div');
		todoItem.classList.add('todo-item');

		const label = document.createElement('label');
		const input = document.createElement('input');
		const span = document.createElement('span');
		const content = document.createElement('div');
		const actions = document.createElement('div');
		const edit = document.createElement('button');
		const deleteButton = document.createElement('button');

		input.type = 'checkbox';
		input.checked = todo.done;
		span.classList.add('bubble');
		if (todo.category == 'personal') {
			span.classList.add('personal');
		} else {
			span.classList.add('business');
		}
		content.classList.add('todo-content');
		actions.classList.add('actions');
		edit.classList.add('edit');
		deleteButton.classList.add('delete');

		content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
		edit.innerHTML = 'Edit';
		deleteButton.innerHTML = 'Delete';


		label.appendChild(input);
		label.appendChild(span);
		actions.appendChild(edit);
		actions.appendChild(deleteButton);
		todoItem.appendChild(label);
		todoItem.appendChild(content);
		todoItem.appendChild(actions);

		todoList.appendChild(todoItem);

		if (todo.done) {
			todoItem.classList.add('done');
		}
		
		input.addEventListener('change', (e) => {
			todo.done = e.target.checked;
			localStorage.setItem('todos', JSON.stringify(todos));

			if (todo.done) {
				todoItem.classList.add('done');
			} else {
				todoItem.classList.remove('done');
			}

			DisplayTodos()

		})

		edit.addEventListener('click', (e) => {
			const input = content.querySelector('input');
			input.removeAttribute('readonly');
			input.focus();
			input.addEventListener('blur', (e) => {
				input.setAttribute('readonly', true);
				todo.content = e.target.value;
				localStorage.setItem('todos', JSON.stringify(todos));
				DisplayTodos()

			})
		})

		deleteButton.addEventListener('click', (e) => {
			todos = todos.filter(t => t != todo);
			localStorage.setItem('todos', JSON.stringify(todos));
			DisplayTodos()
		})

	})
}


// function clearAll(){
// 	document.querySelector('#todo-list').textContent='';
// 	localStorage.removeItem('todos', JSON.stringify(todos));
	
// }


function displayFooterIfHaveTasks() {
	if (todos.length === 0) {
	  todoFooter.style.display = "none";
	} else {
	  todoFooter.style.display = "flex";
	}
  
	const incompletedTasks = todos.filter((item) => !item.isCompleted).length;
  
	countLeftItems(incompletedTasks);
  }
  
  function countLeftItems(totalItems = 2) {
	const leftItems = document.querySelector(".left-items");
  
	const count = totalItems > 1 ? `${totalItems} Items Left` : `${totalItems} Item Left`;
	leftItems.innerHTML = count;
  }
  function clearCompletedTasks(e) {
	const countCompletedTask = todos.filter((todo) => todo.isCompleted);
	if (countCompletedTask.length === 0) return;
  
	const countInCompletedTask = tasks.filter((todo) => !todo.isCompleted);
  
	todos = countInCompletedTask;
	displayFooterIfHaveTasks();
	todoList.dispatchEvent(new CustomEvent("updateTask"));
  }

  function completeTask(createdAt) {
	const clickedItem = tasks.find((todo) => todo.id === createdAt.id);
	clickedItem.isCompleted = !clickedItem.isCompleted;
	todoList.dispatchEvent(new CustomEvent("updateTask"));
  
	// filter left items
	const incompletedTasks = todos.filter((todo) => !todo.isCompleted).length;
  
	countLeftItems(incompletedTasks);
  }



function filterMenus(e) {
  // remove selected class from all li's
  footerMenus.forEach((menu) => menu.classList.remove("selected"));
  // Add selectd class on clicked li

  const classList = e.target.classList;
  classList.add("selected");

  if (classList.contains("all")) {
    isShowAllTasks = true;

    todoList.dispatchEvent(new CustomEvent("updateTask"));
  } else if (classList.contains("active")) {
    isShowAllTasks = false;
    const clonedArray = [...todos];

    const newTasks = clonedArray.filter((todo) => !todo.isCompleted);
    filteredTasks = newTasks;


    todoList.dispatchEvent(new CustomEvent("updateTask"));
  } else if (classList.contains("completed")) {
    isShowAllTasks = false;
    const clonedArray = [...todos];

    const newTasks = clonedArray.filter((todo) => todo.isCompleted);
    filteredTasks = newTasks;

    todoList.dispatchEvent(new CustomEvent("updateTask"));
  }
}

  // Event listeners
todoForm.addEventListener("submit", handleSubmit);
todoList.addEventListener("updateTask", displayTasks);
todoList.addEventListener("updateTask", saveTasksIntoLocalStorage);
clearCompleted.addEventListener("click", clearCompletedTasks);



footerMenus.forEach((menu) => menu.addEventListener("click", filterMenus));

todoList.addEventListener("click", (e) => {
  const id = parseInt(e.target.id) || parseInt(e.target.value);
  if (e.target.matches("label.todo-left") || e.target.matches("input")) {
    completeTask(id);
  }
  });
// footerMenus.forEach(menu => {
//   menu.addEventListener('click', () => {
//     // remove selected class from all menus
//     footerMenus.forEach(m => m.classList.remove('selected'));
//     // add selected class to the clicked menu
//     menu.classList.add('selected');

//     // apply the filter to the todo list
//     const filter = menu.dataset.filter;
//     filteredTasks = todos.filter(task => {
//       if (filter === 'completed') {
//         return task.done;
//       } else if (filter === 'active') {
//         return !task.done;
//       } else {
//         return true;
//       }
//     });

//     isShowAllTasks = false;

//     todoList.dispatchEvent(new CustomEvent('updateTask'));
//   });
// });

displayTasksFromLocalStorage();