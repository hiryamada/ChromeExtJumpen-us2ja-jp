function getCurrentUrlOfTab(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];

        var url = tab.url;
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });
}


function renderStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

function getLocales() {
    return [
        'ar-sa',
        'bg-bg',
        'bs-cyrl-ba',
        'bs-latn-ba',
        'ca-es',
        'cs-cz',
        'da-dk',
        'de-AT',
        'de-CH',
        'de-de',
        'el-gr',
        'en-AU',
        'en-CA',
        'en-GB',
        'en-IE',
        'en-IN',
        'en-MY',
        'en-NZ',
        'en-SG',
        'en-us',
        'en-ZA',
        'es-es',
        'es-MX',
        'et-ee',
        'eu-es',
        'fi-fi',
        'fil-ph',
        'fr-BE',
        'fr-CA',
        'fr-CH',
        'fr-fr',
        'ga-ie',
        'gl-es',
        'he-il',
        'hi-in',
        'hr-hr',
        'hu-hu',
        'id-id',
        'is-is',
        'it-CH',
        'it-it',
        'ja-jp',
        'kk-kz',
        'ko-kr',
        'lb-lu',
        'lt-lt',
        'lv-lv',
        'ms-my',
        'mt-mt',
        'nb-NO',
        'nl-BE',
        'nl-nl',
        'pl-pl',
        'pt-BR',
        'pt-pt',
        'ro-ro',
        'ru-ru',
        'sk-sk',
        'sl-si',
        'sr-cyrl-rs',
        'sr-latn-rs',
        'sv-se',
        'th-th',
        'tr-tr',
        'uk-ua',
        'vi-vn',
        'zh-CN',
        'zh-hk',
        'zh-tw'
    ];
}
document.addEventListener('DOMContentLoaded', function() {
    var UILanguage = chrome.i18n.getUILanguage(); // ja
    var locales = getLocales();

    var defaultLocale = 'ja-jp';
    for (var l of locales) {
        if (l.indexOf(UILanguage) == 0) {
            defaultLocale = l;
            break;
        }
    }

    chrome.storage.sync.set({
        locale: defaultLocale
    }, function() {
        getCurrentUrlOfTab(function(url) {
            chrome.storage.sync.get({
                newTab: false,
                locale: defaultLocale
            }, function(items) {
                var currentLang, otherLang;
                var _url = url.toLowerCase();
                var otherUrl;

                var locale = items.locale.toLowerCase();

                if (0 < _url.indexOf("/en-us/")) {
                    currentLang = "en-us";
                    otherLang = locale;
                    otherUrl = _url.replace("/en-us/", "/" + locale + "/");
                } else if (0 < _url.indexOf("/en/")) {
                    currentLang = "en";
                    otherLang = locale.split("-")[0];
                    otherUrl = _url.replace("/en/", "/" + locale.split("-")[0] + "/");
                } else if (0 < _url.indexOf("/" + locale + "/")) {
                    currentLang = locale;
                    otherLang = "en-us";
                    otherUrl = _url.replace("/" + locale + "/", "/en-us/");
                } else if (0 < _url.indexOf("/" + locale.split("-")[0] + "/")) {
                    currentLang = locale.split("-")[0];
                    otherLang = "en";
                    otherUrl = _url.replace("/" + locale.split("-")[0] + "/", "/en/");
                }

                if (otherUrl) {
                    if (items.newTab) {
                        renderStatus(
                            chrome.i18n.getMessage("openInNewTab")
                            .replace(/_0_/g, currentLang)
                            .replace(/_1_/g, otherLang)
                        );
                        chrome.tabs.create({
                            url: otherUrl
                        });
                    } else {
                        renderStatus(
                            chrome.i18n.getMessage("openInCurrentTab")
                            .replace(/_0_/g, currentLang)
                            .replace(/_1_/g, otherLang)
                        );
                        chrome.tabs.update({
                            url: otherUrl
                        });
                    }
                } else renderStatus(chrome.i18n.getMessage("languageUnknown"));
            });
        });
    });
});

/// i18n
document.title = chrome.i18n.getMessage("popupTitle");