const urlPattern = "*://*.discord.com/*";


chrome.commands.onCommand.addListener((command) => {
    if (command === "toogle_mic_key") {
        console.log("shortcut toogle_mic_key");
        chrome.tabs.query({url: urlPattern}, (tabs) => {
            tabs.forEach((tab) => {
                toogleMic(tab.id);
            });
        });
    }
    if (command === "toogle_sound_key") {
        console.log("shortcut toogle_sound_key");
        chrome.tabs.query({url: urlPattern}, (tabs) => {
            tabs.forEach((tab) => {
                console.log("sending: toogle_sound_key");
                chrome.tabs.sendMessage(tab.id, { action: 'toogle_sound_key'});
            });
        });
    }
    if (command === "active_mic_key") {
        console.log("shortcut active_mic_key");
        chrome.tabs.query({url: urlPattern}, (tabs) => {
            tabs.forEach((tab) => {
                console.log("sending: active_mic_key");
                chrome.tabs.sendMessage(tab.id, { action: 'active_mic_key'});
            });
        });
    }
    if (command === "deactivate_mic_key") {
        console.log("shortcut deactivate_mic_key");
        chrome.tabs.query({url: urlPattern}, (tabs) => {
            tabs.forEach((tab) => {
                console.log("sending: deactivate_mic_key");
                chrome.tabs.sendMessage(tab.id, { action: 'deactivate_mic_key'});
            });
        });
    }
    if (command === "active_sound_key") {
        console.log("shortcut active_sound_key");
        chrome.tabs.query({url: urlPattern}, (tabs) => {
            tabs.forEach((tab) => {
                console.log("sending: active_sound_key");
                chrome.tabs.sendMessage(tab.id, { action: 'active_sound_key'});
            });
        });
    }
    if (command === "deactivate_sound_key") {
        console.log("shortcut deactivate_sound_key");
        chrome.tabs.query({url: urlPattern}, (tabs) => {
            tabs.forEach((tab) => {
                console.log("sending: deactivate_sound_key");
                chrome.tabs.sendMessage(tab.id, { action: 'deactivate_sound_key'});
            });
        });
    }
    if (command === "disconnect_key") {
        console.log("shortcut disconnect_key");
        chrome.tabs.query({url: urlPattern}, (tabs) => {
            tabs.forEach((tab) => {
                console.log("sending: disconnect");
                chrome.tabs.sendMessage(tab.id, { action: 'disconnect'});
            });
        });
    }
});

chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.query({url: urlPattern}, (tabs) => {
        if (tabs.length === 0) {
            chrome.tabs.create({ url: "https://discord.com/channels/@me" });
            return;
        } 
        tabs.forEach((tab) => {
            toogleMic(tab.id);
        });
    });
});


chrome.runtime.onInstalled.addListener(() => {
    console.log("Success installed.");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateIcon") {
        updateIcon(message.isOn);
    }
    if (message.action === "focusOnMe") {
        chrome.tabs.update(message.tabId, { active: true });
    }
});

function toogleMic(tabId) {
    console.log("sending: toogleMic");
    chrome.tabs.sendMessage(tabId, { action: 'toogleMic', tabId: tabId });
}

function updateIcon(isOn) {
    let iconPath = {
        "16": "images/logo_16.png",
        "48": "images/logo_48.png",
        "128": "images/logo.png"
    }
    if (isOn !== null) {
        let icon = "images/mic_" + (isOn ? "on" : "off");
        iconPath = {
            "16": icon + "_16.png",
            "48": icon + "_48.png",
            "128": icon + ".png"
        }
    }
    chrome.action.setIcon({ path: iconPath });
}

