function save_options() {
    var newTab = document.getElementById('newTabInput').checked;
    var localeSelect = document.getElementById('localeSelect');
    var locale = localeSelect.options[localeSelect.selectedIndex].value;

    chrome.storage.sync.set({
        newTab: newTab,
        locale: locale
    }, function () {
        var status = document.getElementById('status');
        status.textContent = chrome.i18n.getMessage("optionSaved");
        setTimeout(function () {
            status.textContent = '';
        }, 1000);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        newTab: false,
        locale: 'ja-jp'
    }, function (items) {
        document.getElementById('newTabInput').checked = items.newTab;
        var localeSelect = document.getElementById('localeSelect');
        for (var i =0; i < localeSelect.options.length; i++){
            if (items.locale == localeSelect.options[i].value){
                localeSelect.selectedIndex = i;
                break;
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

/// i18n
document.getElementById('newTabLabel').innerText = chrome.i18n.getMessage("newTabLabel");
document.getElementById('localeLabel').innerText = chrome.i18n.getMessage("localeLabel");
document.getElementById('save').innerText = chrome.i18n.getMessage("save");
document.title = chrome.i18n.getMessage("optionsTitle");