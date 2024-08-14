class Task {
  static count = 1;
  constructor(text, complete) {
    this.text = text;
    this.complete = complete;
    this.setIndex();
  }
  getText() {
    return this.text;
  }
  seText(text) {
    if (text) {
      this.text = text;
    }
  }
  setIndex() {
    this.index = Task.count++;
  }
  getIndex() {
    return this.index;
  }
  isComplete() {
    return this.complete;
  }
  setComplete(complete) {
    this.complete =
      Boolean(complete) === false || Boolean(complete) === true
        ? complete
        : false;
  }
}

// Seleccionar los elementos HMTL.
const input = document.getElementById("ingresar-tarea");
const boton = document.querySelector("button");
const listaDeTareas = document.getElementById("lista-de-tareas");
const mainContainer = document.getElementsByClassName("contenedor");
const setOrderName = document.getElementById("set-order-name");
const setOrderId = document.getElementById("set-order-id");
const getTrue = document.getElementById("true-elements");
const getFalse = document.getElementById("false-elements");
const arrTasks = [];

boton.addEventListener("click", agregarTarea);
console.log(boton.dataset);

input.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    agregarTarea();
    e.target.value = "";
  }
});

// Crear y agreagar una tarea a la lista de tareas
// en el DOM.
function agregarTarea() {
  if (input.value) {
    // Crear tarea.
    const task = new Task(input.value, false);
    arrTasks[task.getIndex() - 1] = task;
    console.log("Object text: " + task.getText());

    let tareaNueva = document.createElement("div");
    tareaNueva.setAttribute("id", task.getIndex());
    tareaNueva.classList.add("tarea");
    // Texto ingresado por el usuario.
    let texto = document.createElement("p");
    texto.innerText = input.value;
    input.value = "";
    tareaNueva.appendChild(texto);
    let iconos = createChildren("div", tareaNueva, ["iconos"]);
    //add styles and elements to each node
    iconsElements(iconos, task);

    // Agregar la tarea a la lista.
    listaDeTareas.appendChild(tareaNueva);
  } else {
    alert("Por favor ingresa una tarea.");
  }
}
/**
 *
 * @param {object} parentElement
 * @param {object} task
 */
function iconsElements(parentElement, task = null) {
  createChildren("i", parentElement, [
    "bi",
    "bi-check-circle-fill",
    "icono-completar",
  ]).addEventListener("click", (e) => completarTarea(e, task));
  createChildren("i", parentElement, [
    "bi",
    "bi-trash3-fill",
    "icono-eliminar",
  ]).addEventListener("click", (e) => eliminarTarea(e, task));
  createChildren("i", parentElement, [
    "bi",
    "bi-pencil-square",
    "icono-editar",
  ]).addEventListener("click", (e) => editTask(e, task));
}

/**
 *
 * @param {string} element
 * @param {object} fatherElement
 * @param {styles[]} styles
 * @returns
 */

function createChildren(element, parentElement, styles) {
  let chldElem = document.createElement(element);
  for (let i = 0; i < styles.length; i++) {
    chldElem.classList.add(styles[i]);
  }
  parentElement.appendChild(chldElem);
  return chldElem;
}

// Marcar una tarea como completada.
function completarTarea(e, task) {
  const tarea = e.target.parentNode.parentNode;
  const index = arrTasks.indexOf(task);
  tarea.classList.toggle("completada");
  if (tarea.classList.contains("completada")) arrTasks[index].setComplete(true);
  else arrTasks[index].setComplete(false);
  console.log(arrTasks[index]);
}
/**
 *
 * @param {event/object} e
 * @param {object} task
 */
// Eliminar una tarea del DOM.
function eliminarTarea(e, task) {
  const tarea = e.target.parentNode.parentNode;
  arrTasks.splice(arrTasks.indexOf(task), 1);
  Task.setIndex();
  tarea.remove();
}

function newInputEdit(e, obj) {
  console.log(e.pointerType);
  if (
    (e.key == "Enter" && e.target.value) ||
    (e.pointerType == "mouse" && e.target.parentNode.previousSibling.value)
  ) {
    const p = document.createElement("p");
    let parent, auxChild;
    if (e.key == "Enter") {
      p.innerText = e.target.value;
      parent = e.target.parentNode;
      auxChild = e.target.nextSibling;
      e.target.nextSibling.remove();
      e.target.remove();
    } else {
      p.innerText = e.target.parentNode.previousSibling.value;
      parent = e.target.parentNode.parentNode;
      auxChild = e.target.parentNode;
      e.target.parentNode.previousSibling.remove();
      e.target.parentNode.remove();
    }
    auxChild.lastChild.remove();
    createChildren("i", auxChild, [
      "bi",
      "bi-pencil-square",
      "icono-editar",
    ]).addEventListener("click", (e) => editTask(e, obj));
    // auxChild.lastChild.removeEventListener("click", newInputEdit);
    obj.seText(p.innerText);
    parent.append(p, auxChild);
    editTaskStyles(auxChild.lastChild);
  } else if (
    (e.key == "Enter" && !e.target.value) ||
    (e.pointerType == "mouse" && !e.target.parentNode.previousSibling.value)
  )
    alert("Por favor ingresa una tarea.");
}

function editTaskStyles(e) {
  e.classList.toggle("bi-box-arrow-in-right", "icono-enter");
  e.classList.add("bi", "bi-pencil-square", "icono-editar");
  console.log(e.classList);
}
/**
 *
 * @param {event} e
 * @param {object} obj
 */
function editTask(e, obj) {
  console.log("enters editTask method");
  const userInput = document.createElement("input");
  const auxChild = e.target.parentNode;
  const parent = e.target.parentNode.parentNode;
  const userText = e.target.parentNode.previousElementSibling.innerText;
  // e.target.parentNode.previousElementSibling.style;
  //removing both elements
  e.target.parentNode.previousElementSibling.remove();
  e.target.parentNode.remove();
  //rearranging nodes within parent
  userInput.value = userText;
  parent.append(userInput, auxChild);
  //switching out styles
  if (parent.classList.contains("completada"))
    parent.classList.remove("completada");
  /*  e.target.classList.toggle("bi-pencil-square");
    e.target.classList.add("bi-box-arrow-in-right", "icono-enter"); */
  e.target.remove();
  createChildren("i", auxChild, [
    "bi-box-arrow-in-right",
    "icono-enter",
    "icono-editar",
  ]).addEventListener("click", (e) => newInputEdit(e, obj));
  /*  userInput.addEventListener("keydown", function (e) {
      newInputEdit(e)      
      }); */
  userInput.addEventListener("keydown", (e) => newInputEdit(e, obj));
}

function orderTasksByName() {
  if (arrTasks.length >= 1) {
    return arrTasks.sort((task1, task2) => {
      return compare(
        task1.getText().toLowerCase(),
        task2.getText().toLowerCase()
      );
    });
  }
  console.log(arrTasks);
  return [];
}

function orderTasksById() {
  if (arrTasks.length >= 1) {
    return arrTasks.sort((task1, task2) => {
      return compare(task1.getIndex(), task2.getIndex());
    });
  }
  console.log(arrTasks);
  return [];
}

/**
 *
 * @param {Object Field} attrOne
 * @param {Object Field} attrTwo
 * @returns
 */
function compare(attrOne, attrTwo) {
  if (attrOne > attrTwo) return 1;
  else if (attrOne < attrTwo) return -1;
  else return 0;
}

/**
 *
 * @param {boolean} complete
 * @returns
 */

function getTasks(complete) {
  if (arrTasks.length >= 1)
    return arrTasks.filter((element) => element.isComplete() === complete);
  return [];
}
/**
 *
 * @param {object} task
 */
function creatTask(task) {
  const newTask = document.createElement("div");
  newTask.classList.add("tarea");
  const texto = document.createElement("p");
  texto.innerText = task.getText();
  newTask.appendChild(texto);
  const iconos = createChildren("div", newTask, ["iconos"]);
  iconsElements(iconos, task);
  if (task.isComplete()) newTask.classList.add("completada");
  newTask.setAttribute("id", task.getIndex());
  listaDeTareas.appendChild(newTask);
}

function removeElements() {
  // [...listaDeTareas.childNodes].forEach((node) => node.remove());
  Array.from(listaDeTareas.childNodes).forEach((node) => node.remove());
}

setOrderName.addEventListener("click", () => {
  removeElements();
  orderTasksByName().forEach((task) => {
    creatTask(task);
  });
  console.log(arrTasks);
});

setOrderId.addEventListener("click", () => {
  removeElements();
  orderTasksById().forEach((task) => {
    creatTask(task);
  });
  console.log(arrTasks);
});

getTrue.addEventListener("click", () => {
  removeElements();
  getTasks(true).forEach((task) => {
    creatTask(task);
  });
});

getFalse.addEventListener("click", () => {
  removeElements();
  getTasks(false).forEach((task) => {
    creatTask(task);
  });
});
