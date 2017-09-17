let enabled = false;
let tabTimer = 0;
let delay = 10000;

// Check at startup if we should be enabled or not
chrome.storage.local.get('enabled', function (result) {
  enabled = !!result.enabled; // Ensure boolean
  updateBadge();
});

// Browser Button
chrome.browserAction.onClicked.addListener(toggleEnabled);
// Shortcut
chrome.commands.onCommand.addListener(command => { if (command === "toggleEnabled") toggleEnabled() });
// Tab change
chrome.tabs.onActivated.addListener(info => queueMove(info.tabId));

function queueMove(tabId) {
  clearTimeout(tabTimer); // Tab change always clears timeout
  if (enabled) {
    tabTimer = setTimeout(()=>{
      chrome.tabs.move(tabId, {index: 0});
    }, delay)
  }
}

function toggleEnabled() {
  enabled = !enabled;
  updateBadge();
  saveState();
}

function updateBadge(txt) {
  if (enabled) {
    chrome.browserAction.setBadgeBackgroundColor({color:[0,0,255,255]});
    chrome.browserAction.setBadgeText({text:"On"});
  
    // Start timer going in current tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      queueMove(tabs[0].id);
    });
  } else {
    chrome.browserAction.setBadgeBackgroundColor({color:[255,0,0,255]});
    chrome.browserAction.setBadgeText({text:"Off"});    
  }
}

function saveState() {
  chrome.storage.local.set({'enabled': enabled}, function() {
    console.log(`Saved State - Enabled = ${enabled}`);
  });
}