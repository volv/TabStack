let enabled = false;
let tabTimer = 0;
let delay = 10000;
let position = 0;

// Check at startup if we should be enabled or not
let readStored  = () => {
  clearTimeout(tabTimer);
  chrome.storage.local.get(null, function (result) {
    enabled = !!result.enabled; // Ensure boolean

    if (Number(result.delay)) {
      delay = Math.floor(Number(result.delay)*1000);
    } else {
      delay = 1000;
    }

    if (result.position) {
      if (result.position.toLowerCase() === "left" || result.position.toLowerCase() === "right") {
        position = result.position.toLowerCase();
      } else if (Number(result.position) && Number(result.position) >= 0) {
        position = Math.floor(Number(result.position));
      } else {
        position = 0;
      }
    }

    updateBadge();
  });
};

readStored(); // Start us off

// Browser Button. Not fired now theres a popup
// chrome.browserAction.onClicked.addListener(toggleEnabled);
// Shortcut
chrome.commands.onCommand.addListener(command => { if (command === "toggleEnabled") toggleEnabled() });
// Tab change
chrome.tabs.onActivated.addListener(info => queueMove(info.tabId));
// Option change
chrome.storage.onChanged.addListener(readStored);

function queueMove(tabId) {
  clearTimeout(tabTimer); // Tab change always clears timeout
  if (enabled) {
    tabTimer = setTimeout(()=>{

      let pushToPos = 0;

      chrome.tabs.query({}, function(foundTabs) {              
        if (position === "right") {
          pushToPos = foundTabs.length - 1;
        } else if (position === "left") {
          pushToPos = 0;
        } else {
          pushToPos = position;
        }

        chrome.tabs.move(tabId, {index: pushToPos});
      });
      
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