// define var to hold setInterval() function
let interval = null

// var to hold timer status (started/stopped)
let isStopped = true

// select html things
const startBtn = document.querySelector('#start-stop')
const resetBtn = document.querySelector('#reset')
const timeDisplay = document.querySelector('#time')
const buzz = document.querySelector('#buzz')
const workBtn = document.querySelector('#work')
const shortBtn = document.querySelector('#short')
const longBtn = document.querySelector('#long')
const editText = document.querySelector('#edit-text')

class Timer {
  constructor(min = 25) {
    this.ultimateTime = min
    this.seconds = 0
    this.minutes = min
    this.displaySeconds = 0
    this.displayMinutes = 0
    if (this.minutes < 10) {
      timeDisplay.innerHTML = `0${this.minutes}:00`
    } else {
      timeDisplay.innerHTML = this.minutes.toString() + ':00'
    }
  }

  runTimer() {
    this.seconds--
    // when to decrement minutes
    if (this.seconds === -1) {
      this.seconds = 59
      this.minutes--
    }
    // put in leading 0 for numbers greater than 10
    if (this.seconds < 10) {
      this.displaySeconds = '0' + this.seconds.toString()
    } else {
      this.displaySeconds = this.seconds.toString()
    }
    if (this.minutes < 10) {
      this.displayMinutes = '0' + this.minutes.toString()
    } else {
      this.displayMinutes = this.minutes.toString()
    }

    this.time = this.displayMinutes + ':' + this.displaySeconds

    // when timer reaches 00
    if (this.minutes === 0 && this.seconds === 0) {
      buzz.play()
      window.clearInterval(interval)
      timeDisplay.innerHTML = this.time
      return (document.title = 'BEEP')
    }
    // display updated time values to user
    timeDisplay.innerHTML = this.time
    document.title = this.time
  }

  resetTimer() {
    window.clearInterval(interval)
    this.seconds = 0
    this.minutes = this.ultimateTime
    this.displaySeconds = 0
    this.displayMinutes = 0
    isStopped = true
    startBtn.innerHTML = 'Start'
    document.title = 'Timer'
    if (this.minutes < 10) {
      this.displayMinutes = '0' + this.minutes.toString()
    } else {
      this.displayMinutes = this.minutes.toString()
    }
    this.time = this.displayMinutes + ':00'
    timeDisplay.innerHTML = this.time
  }

  startStop() {
    if (isStopped) {
      //start the timer by calling interval function
      interval = window.setInterval(this.runTimer.bind(this), 1000) // call the function every 1000 miliseconds
      startBtn.innerHTML = 'Stop'
      isStopped = false
    } else {
      // stop running the interval function
      window.clearInterval(interval)
      startBtn.innerHTML = 'Start'
      isStopped = true
    }
  }
  editTime() {
    timeDisplay.classList.add('none')
    editText.classList.remove('none')
    const timeDiv = document.querySelector('#time-box')
    editText.id = 'edit-text'
    editText.value = timeDisplay.innerHTML
    editText.autofocus = true
    timeDiv.append(editText)
  }
  unfocus() {
    editText.classList.add('none')
    timeDisplay.classList.remove('none')
    const regMins = /(\d\d):/
    const mins = regMins.exec(editText.value)
    const regSecs = /:([0-5]\d)/
    const secs = regSecs.exec(editText.value)
    if (mins && secs) {
      this.seconds = parseInt(secs[1])
      this.minutes = parseInt(mins[1])
      console.log(this.seconds)
      timeDisplay.innerHTML = editText.value
    } else {
      timeDisplay.innerHTML = '25:00'
    }
  }
}

const timer = new Timer(25)

const configureTimer = (min, sec = 0) => {
  timer.ultimateTime = min
  timer.seconds = sec
  timer.minutes = min
  // timer.displaySeconds = 0
  // timer.displayMinutes = 0
  if (min < 10) {
    timeDisplay.innerHTML = '0' + min + ':00'
  } else {
    timeDisplay.innerHTML = min + ':00'
  }
  isStopped = true
  startBtn.innerHTML = 'Start'
  window.clearInterval(interval)
}

workBtn.addEventListener('click', () => {
  configureTimer(25)
})

shortBtn.addEventListener('click', () => {
  configureTimer(5)
})

longBtn.addEventListener('click', () => {
  configureTimer(10)
})

startBtn.addEventListener('click', timer.startStop.bind(timer))
resetBtn.addEventListener('click', timer.resetTimer.bind(timer))

// on doubleclick, be able to change the time
// WHY DOES THIS NOT JUST WORK WHEN STOPPED
if (isStopped) {
  timeDisplay.addEventListener('dblclick', timer.editTime)
  // console.log(editText)
  editText.addEventListener('blur', timer.unfocus.bind(timer))
  editText.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      timer.unfocus()
    }
  })
}

// ADD STOP/START FUNCTIONALITY WITH SPACE (WATCH OUT FOR BUBBLING)
