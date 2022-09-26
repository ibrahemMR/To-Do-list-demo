//add task button showing pop up element
let addTaskBtn = document.getElementById("addNew")
//get PopUp element
let popUpAddTask = document.getElementById("popUpAdd")
//Close PopUp BTN
let close = document.getElementById("closePopUp")
//get input field value of new task
let task = document.querySelector(".form #text")
let tasksContent = document.querySelector(".content")

//select add task final button
let addTaskFBtn = document.querySelector(".form button")

//create paragraph with message no tasks here
const noTask = document.createElement("p")
noTask.className = "noTask"
noTask.textContent = `There Is No Tasks To Do.. Have Fun 😉`

//Get All Stored tasks in localStorage
let tasksList = []
//create Data id and store in localStorage
let dataID
if (window.localStorage.getItem("data-ids") === null) {
	// console.log("No Data")
	dataID = 0
	window.localStorage.setItem("data-ids", dataID)
} else {
	dataID = parseInt(window.localStorage.getItem("data-ids"))
}
//get stored tasks => store im storedList
//on document load check if there is any tasks
document.addEventListener("DOMContentLoaded", function () {
	if (window.localStorage.getItem("tasks") !== null) {
		/* this will fix after delete all completed task show noTasks element */
		noTask.remove()
		let storedList = window.localStorage.getItem("tasks")
		//using json to return stored text as objects
		tasksList = tasksList.concat(JSON.parse(storedList))
		console.log("storedList: ", storedList)

		updater(tasksList)

		//Show  tasks list in content element
		showTasks()
	} else {
		tasksContent.appendChild(noTask)
	}
})
//add event listener document changed : add noTask Paragraph to tasksContent element
document.addEventListener("change", (e) => {
	setInterval((e) => {
		if (tasksContent.innerHTML === "") {
			tasksContent.innerHTML = noTask.textContent
		}
	})
})
//close pop up when click anywhere outside of add task element or close icon
document.addEventListener("click", function (e) {
	if (
		e.target.id === "popUpAdd" ||
		e.target.id === "closePopUp" ||
		e.target.classList.contains("fa-xmark")
	) {
		popUpAddTask.style.display = "none"
	}
	//remove textbox and alert text from Task List Content

	if (
		e.target.className !== "alert" &&
		e.target.getAttribute("type") !== "text"
	) {
		// console.log("e.target.attib ", e.target.getAttribute("type"))
		document.querySelectorAll(".alert").forEach((ele) => {
			ele.remove()
		})
		document.querySelectorAll(".editBox").forEach((ele) => {
			ele.remove()
		})
	}
})

/* add New Task function   */
//open popup element when click on add task button
addTaskBtn.onclick = function () {
	task.value = ""
	popUpAddTask.style.display = "flex"
	task.focus()
}

//if user hit enter key after edit text box ==> fire addTaskFBtn onclick
task.addEventListener("keyup", (e) => {
	if (e.keyCode === 13) {
		e.preventDefault()
		addTaskFBtn.click()
	}
})

//open pop up and create new task
addTaskFBtn.onclick = function () {
	if (task.value !== "") {
		//remove no task pragraph from tasks element
		if (tasksContent.firstChild.className === "noTask") {
			tasksContent.firstChild.remove()
		}
		let newtask = {
			id: ++dataID,
			text: task.value,
			completed: false,
		}
		window.localStorage.setItem("data-ids", dataID)
		//add new task to taskslist array
		tasksList.push(newtask)
		//store in localstorage
		window.localStorage.setItem("tasks", JSON.stringify(tasksList))
		//close popup form
		popUpAddTask.style.display = "none"
		createTasksElement(task.value, dataID, false)
	} else {
		//alert user thats the input field is empty
		task.classList.add("Shake")
		setTimeout(() => {
			task.classList.remove("Shake")
		}, 1000)
	}
}
//Create New Task Element from task add form
function createTasksElement(tasktxt, id, completed = false) {
	//create new task elements and append to to do list || store value in Local Storage
	let newTask = document.createElement("div")
	newTask.classList.add("task")
	//add id to data-id attribute
	newTask.setAttribute("data-id", id)
	let taskText = document.createElement("p")
	taskText.className = "taskText"
	taskText.textContent = ` - ${tasktxt}`
	//create controls list buttons
	let controls = document.createElement("div")
	controls.className = "controls"
	controls.innerHTML = `
		<button title="Completed" class="done">👍</button>
		<button title="Edit" class="edit">✍</button>
		<button  title="delete" class="delete">❌</button>`
	//append task text and controls to task div
	newTask.append(taskText, controls)
	//append task to tasks list but if task status is completed change things
	if (completed === false) {
		tasksContent.prepend(newTask)
	} else {
		newTask.style.backgroundColor = "#607d8b"
		//set line through task text
		newTask.childNodes[0].style.textDecoration = "line-through"
		//remove controls elements
		newTask.childNodes[1].remove()
		//create new controls with only delete button
		controls.innerHTML = `<button  title="delete" class="delete">❌</button>`
		newTask.append(controls)
		tasksContent.append(newTask)
	}
}
//show all tasks from tasksList array
function showTasks() {
	for (let i = 0; i < tasksList.length; i++) {
		createTasksElement(
			tasksList[i].text,
			tasksList[i].id,
			tasksList[i].completed
		)
		// console.log(i)
	}
}

//delete task from Content and localstorage
let delTask = document.addEventListener("click", function (e) {
	if (e.target.classList.contains("delete")) {
		/* get Element With indexOf in content array */
		//get element index with data-id
		const i = parseInt(
			e.target.parentNode.parentElement.getAttribute("data-id")
		)
		tasksList.shift(i)

		//check array length to determind if showing no task paragraph and delete stored object task or not
		if (tasksList.length < 1) {
			//remove tasks object from localstorage
			window.localStorage.removeItem("tasks")
			//reset data-ids item to zero index
			window.localStorage.setItem("data-ids", 0)
			//append no task pragraph element
			tasksContent.appendChild(noTask)
		} else {
			//update local storage with array elements
			updater(tasksList)
		}
		e.target.parentNode.parentElement.remove()
	}
})

//Compelete Task
let doneBtn = document.addEventListener("click", function (e) {
	if (e.target.classList.contains("done")) {
		let x = e.target.parentNode.parentElement.getAttribute("data-id")
		for (let l = 0; l < tasksList.length; l++) {
			if (parseInt(x) === tasksList[l].id) {
				tasksList[l].completed = true
			}
		}
		//update local object whit array elements
		updater(tasksList)
		//update tasksContainer with new tasks in localstorage
		tasksContent.innerHTML = ""
		showTasks()
	}
})

/* updater : arguments [array of tasks list]
	-filter array from empty elements which happend when [delete] some task
	-update all tasks [object id] to current index in tasksList array 
*/
let updater = function (arr) {
	arr.concat(
		arr.filter((e) => {
			e
		})
	)
	window.localStorage.setItem("tasks", JSON.stringify(arr))
}

//edit task function
let editBtn = document.addEventListener("click", function (e) {
	if (e.target.classList.contains("edit")) {
		//check if there is any opened text box

		const i = parseInt(
			//error with reading this fucking id
			e.target.parentNode.parentElement.getAttribute("data-id")
		)
		//create new div element to set textBox
		let editBox = document.createElement("div")
		editBox.setAttribute("class", "editBox")
		let inputBox = document.createElement("input")
		let alertText = document.createElement("span")
		alertText.className = "alert"
		alertText.style.cssText = "font-size:12px;color:#000;font-weight:bold"
		alertText.textContent = `* Hit Enter key to Update *`
		inputBox.setAttribute("type", "text")

		//set edit input box value to selected task text
		//create loop through taskslist array to set new value depending on data-id
		for (let l = 0; l < tasksList.length; l++) {
			if (i === tasksList[l].id) {
				inputBox.value = tasksList[l].text
			}
		}
		editBox.appendChild(inputBox)
		e.target.parentElement.parentElement.after(alertText, editBox)
		inputBox.focus()
		inputBox.addEventListener("keyup", (e) => {
			if (e.keyCode === 13) {
				e.preventDefault()
				//loooop again to set new value
				for (let l = 0; l < tasksList.length; l++) {
					if (i === tasksList[l].id) {
						tasksList[l].text = inputBox.value
					}
				}

				//update local object whit array elements
				updater(tasksList)
				editBox.remove()
				tasksContent.innerHTML = ""
				showTasks()
			}
		})
	}
})
