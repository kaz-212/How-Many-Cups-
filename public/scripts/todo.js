const newTaskBtn = document.querySelector('#new-task')
const form = document.querySelector('#form')
// const axios = require('axios')

newTaskBtn.addEventListener('click', () => {
  form.classList.remove('none')
  newTaskBtn.classList.add('none')
})

const draggables = document.querySelectorAll('.draggable')
const containers = document.querySelectorAll('.td-list')

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })
  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
    const status = draggable.parentNode.id
    console.log(draggable.previousSibling.previousSibling.action)
  })
})

containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault()
    const draggable = document.querySelector('.dragging')
    const afterElement = getDragAfterElement(container, e.clientY) // pass through mouse y pos
    if (afterElement == null) {
      container.appendChild(draggable)
    } else {
      container.insertBefore(draggable, afterElement)
    }
  })
})

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect()
      const offset = y - box.top - box.height / 2 //half height of the
      if (offset < 0 && offset > closest.offset) {
        return {
          offset,
          element: child
        }
      } else {
        return closest
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element
}
