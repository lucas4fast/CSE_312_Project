const socket = io();
const { getAllUsers } = require("./helpers/user");

const chatList = document.getElementById("userChats");
const users = getAllUsers();

for (user of users) {
  const chat = document.createElement("option");
  chat.value = user.username;
  chat.innerHTML = user.username;
  chatList.appendChild(chat);
}

const { username, userChats } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, userChats });
socket.on("message", (message) => {
  console.log(message);
  displayChat(message);
});

const inputChat = document.getElementById("chat-input");
inputChat.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.getElementById("messageText").value;
  console.log(message);
  socket.emit("chat-message", message);
});

function displayChat(message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `<p class="info">${message.username}</p>
    <p class="mText">${message.message}</p>`;
  document.querySelector(".messageView").appendChild(messageDiv);
}
