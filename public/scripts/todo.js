const newTaskBtn = document.querySelector('#new-task')
const form = document.querySelector('#form')

newTaskBtn.addEventListener('click', () => {
  form.classList.remove('none')
  newTaskBtn.classList.add('none')
})
