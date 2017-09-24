let toggle = document.getElementById("fs");
let delay = document.getElementById("delay");
let position = document.getElementById("position");
let fsInner = document.getElementById("fs-inner");
let fsSwitch = document.getElementById("fs-switch");

chrome.storage.local.get('enabled', function (result) {
  toggle.checked = !!result.enabled; // Ensure boolean
});

chrome.storage.local.get('delay', function (result) {
  delay.value = (result.delay) ? result.delay : 10;
});

chrome.storage.local.get('position', function (result) {
  position.value = (result.position) ? result.position : "left";
});

setTimeout(() => {
  fsInner.classList.add("delayTransition");
  fsSwitch.classList.add("delayTransition");
},50) // Hacky. Stops animations being shown every time popup is opened

document.body.addEventListener("change", saveAll);

function saveAll() {
  delay.value =  Math.abs(delay.value);
  chrome.storage.local.set({'enabled': toggle.checked, 'delay': Math.abs(delay.value), 'position': position.value}, function() {
    console.log(`Saved State - Enabled = ${toggle.checked}, Delay = ${delay.value}, Position = ${position.value}, `);
  });
}