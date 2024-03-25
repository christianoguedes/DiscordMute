function toogleMic(tabId) {
    if (isOnVoiceChannel()) {
        micButton().click();
        chrome.runtime.sendMessage({
            action: "updateIcon",
            isOn: !isMicOn()
        });
    } else {
        var message = {
            action: 'focusOnMe',
            tabId: tabId
        };
        chrome.runtime.sendMessage(message);
    }
}

function isOnVoiceChannel() {
    return document.querySelectorAll('div[class^="actionButtons"]').length > 0
}

function micButton() {
    return audioButtons()[0]
}

function disableAudioButton() {
    return audioButtons()[1]
}

function audioButtons() {
    return document.querySelectorAll('button[role="switch"]');
}

function isMicOn() {
    return micButton().getAttribute('aria-checked') == "false"
}

function endButton() {
    return document.querySelectorAll('div[class*="connection"] button')[2];
}

function voiceChannels() {
    return  document.querySelectorAll('div[class*=" typeVoice"], div[class^="typeVoice"]');
}

function sendIconMessage(negative = false, endCall = false) {
    let isOn = negative ? !isMicOn() : isMicOn();
    isOn = endCall ? null : isOn;
    console.log("Send updateIcon - isOn: " + isOn);
    var message = {
        action: 'updateIcon',
        isOn: isOn
    };
    chrome.runtime.sendMessage(message);
}

function injectCodeAfterStart() {
    if (audioButtons().length > 0) {
        let voice = voiceChannels();
        if (voice.length > 0) {
            console.log("voice buttons found");
            voice.forEach(function (el) {
                el.addEventListener('click', function (event) {
                    console.log("Audio Channel clicked:");
                    setTimeout(function () {
                        sendIconMessage();
                        endButton().addEventListener('click', function (event) {
                            console.log("Audio Channel clicked:");
                            sendIconMessage(false, true);
                        });
                    }, 1000);
                });
            });
        }
        micButton().addEventListener('click', function (event) {
            console.log("Mic Button clicked");
            if (isOnVoiceChannel()) {
                sendIconMessage(true);
            }
        });
        disableAudioButton().addEventListener('click', function (event) {
            console.log("Disable Audio Button clicked");
            setTimeout(function () {
                if (isOnVoiceChannel()) {
                    sendIconMessage();
                }
            }, 300);
        });
        document.querySelectorAll('div[class*="listItem"]').forEach(function(server) {
            server.addEventListener('click', function (event) {
                console.log("Server clicked:");
                setTimeout(injectCodeAfterStart, 1000);
            });
        });
    } else {
        setTimeout(injectCodeAfterStart, 1000);
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("listen: " + message.action);
    if (message.action === 'toogleMic') {
        toogleMic(message.tabId)
    }
    if (message.action === 'toogle_sound_key') {
        if (isOnVoiceChannel()) {
            audioButtons()[1].click();
        }
    }
    if (message.action === 'active_mic_key') {
        if (isOnVoiceChannel() && !isMicOn()) {
            toogleMic(null);
        }
    }
    if (message.action === 'deactivate_mic_key') {
        if (isOnVoiceChannel() && isMicOn()) {
            toogleMic(null);
        }
    }
    if (message.action === 'active_sound_key') {
        if (isOnVoiceChannel()) {
            let soundButton = audioButtons()[1];
            if (soundButton.getAttribute('aria-checked') != "false") {
                soundButton.click();
            }
        }
    }
    if (message.action === 'deactivate_sound_key') {
        if (isOnVoiceChannel()) {
            let soundButton = audioButtons()[1];
            if (soundButton.getAttribute('aria-checked') == "false") {
                soundButton.click();
            }
        }
    }
    if (message.action === 'disconnect') {
        if (isOnVoiceChannel()) {
            endButton().click();
        }
    }
});

setTimeout(injectCodeAfterStart, 1000);


