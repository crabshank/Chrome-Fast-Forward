function setup() {
  noCanvas();

	send("Scan!");
  function send(message) {

    let params = {
      active: true,
      currentWindow: true
    }
    chrome.tabs.query(params, gotTabs);

    function gotTabs(tabs) {
      console.log("got tabs");
      console.log(tabs);
      // send a message to the content script
     // let message = userinput.value();
      let msg = {
        message: message
      };
      chrome.tabs.sendMessage(tabs[0].id, msg);
    }

  }
  
  setTimeout(function(){window.close() }, 5000);

}
