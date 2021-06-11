const { response } = require("express");

function alerter() {
  let nick = prompt("Podaj nick");
  if (nick === null || nick.length === 0 || nick === undefined) {
    alerter();
  } else {
    fetch("/newUser", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: nick,
      }),
    });
    return;
  }
}
alerter();

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("button").addEventListener("click", send);
  window.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      send();
    }
  });

  init();
});

function createMessage(message) {
  let div = document.createElement("div");
  for (let i = 0; i < 3; i++) {
    let messages = document.createElement("span");
    switch (i) {
      case 0:
        messages.innerText = `[ ${[message.time]}] `;
        break;
      case 1:
        messages.innerText = `<@${[message.author]}> `;
        messages.style.color = message.color;
        break;
      case 2:
        messages.innerText = `${[message.messageContent]}`;
        $(messages).emoticonize();
        break;
      default:
        break;
    }
    div.appendChild(messages);
  }
  document.querySelector(".chat").appendChild(div);
}

function init() {
  fetch("/message")
    .then((response) => 
    {response.json()
    console.log(response.status)})
    .then((data) => {
      createMessage(data);
      init();
    });
}

function send() {
  let value = document.querySelector("input").value;
  switch (value) {
    case "/quit":
      window.location.reload();
      break;
    case "/color":
      fetch("/color");
      break;
  }
  if (value.startsWith("/nick"))
    fetch("/nick", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value,
      }),
    });
  else if (value.length === 0) return;
  else
    fetch("/newMessage", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: value,
      }),
    });
  document.querySelector("input").value = "";

}
