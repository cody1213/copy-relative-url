browser.contextMenus.create({
  id: "copy-link-to-clipboard",
  title: "Copy Relative URL",
  contexts: ["link"],
});
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copy-link-to-clipboard") {
    // get text link
    const link = info.linkUrl;
    var parser = document.createElement('a');
    parser.href = link;
    const text = parser.pathname + parser.search + parser.hash;
    // parser.protocol; // => "http:"
    // parser.hostname; // => "example.com"
    // parser.port; // => "3000"
    // parser.pathname; // => "/pathname/"
    // parser.search; // => "?search=test"
    // parser.hash; // => "#hash"
    // parser.host; // => "example.com:3000"


    // clipboard-helper.js defines function copyToClipboard.
    const code = "copyToClipboard(" +
      JSON.stringify(text) + ");";

    browser.tabs.executeScript({
      code: "typeof copyToClipboard === 'function';",
    }).then((results) => {
      // The content script's last expression will be true if the function
      // has been defined. If this is not the case, then we need to run
      // clipboard-helper.js to define function copyToClipboard.
      if (!results || results[0] !== true) {
        return browser.tabs.executeScript(tab.id, {
          file: "clipboard-helper.js",
        });
      }
    }).then(() => {
      return browser.tabs.executeScript(tab.id, {
        code,
      });
    }).catch((error) => {
      // This could happen if the extension is not allowed to run code in
      // the page, for example if the tab is a privileged page.
      console.error("Failed to copy text: " + error);
    });
  }
});