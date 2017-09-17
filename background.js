let enabled = true;
let tabTimer = 0;

chrome.browserAction.setBadgeBackgroundColor({color:[0,0,255,255]});
chrome.browserAction.setBadgeText({text:"On"});
chrome.browserAction.onClicked.addListener(toggleEnabled);

chrome.commands.onCommand.addListener(function(command) {
  if (command === "toggleEnabled") {
    toggleEnabled();
  }
});

chrome.tabs.onActivated.addListener( function(info) {
  queueMove(info.tabId);
});

function queueMove(tabId) {
  clearTimeout(tabTimer);
  if (enabled) {
    tabTimer = setTimeout(()=>{
      placeFirst(tabId);
    }, 10000)
  }
}

function placeFirst(tabId) {
  chrome.tabs.move(tabId, {index: 0});
}

function toggleEnabled() {
  if (enabled) {
    chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
    chrome.browserAction.setBadgeText({text:"Off"});
    enabled = false;
  } else {
    chrome.browserAction.setBadgeBackgroundColor({color:[0,0,255,255]});
    chrome.browserAction.setBadgeText({text:"On"});
    enabled = true;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      queueMove(tabs[0].id);
    });
  }
}