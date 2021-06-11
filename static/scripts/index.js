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
  let container = document.createElement("div");
  for (let i = 0; i < 3; i++) {
    let messageDate = document.createElement("span");
    switch (i) {
      case 0:
        messageDate.innerText = `[ ${[message.time]}] `;
        break;
      case 1:
        messageDate.innerText = `<@${[message.author]}> `;
        messageDate.style.color = message.color;
        break;
      case 2:
        messageDate.innerText = `${[message.messageContent]}`;
        $(messageDate).emoticonize();
        break;
      default:
        break;
    }
    container.appendChild(messageDate);
  }
  document.querySelector(".chat").appendChild(container);
}

function init() {
  fetch("/message")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
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
