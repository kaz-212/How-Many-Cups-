// document.getElementById('numberOfCups').addEventListener('submit', calcTime)

// function calcTime(e) {
//   e.preventDefault();
//   let selected = document.getElementById('selecta').value;
//   let y = selected * 25
//   let hrs = y/60
//   let hours = Math.floor(hrs)
//   let minutes = y - hours*60
//   let text = 'Hours: ' + hours + ' Minutes: ' + minutes;
//   document.getElementById('return').innerHTML=text;
// }

const form =  document.querySelector('#numberOfCups');
const rtn = document.querySelector('#return');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const cups = form.elements.selecta.value;
  let hrs = Math.floor((cups*25)/60);
  let mins = (cups * 25) - (hrs * 60);
  if (hrs == 1){
    rtn.innerText = `1 hour and ${mins} minutes`;
  } else {
    rtn.innerText = `${hrs} hours and ${mins} minutes`;
  }
});