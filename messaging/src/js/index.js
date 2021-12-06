const socket = io();

const chatInput = document.getElementById("chat-input");

const { username, userChats } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join-chat", { username, userChats });
socket.on("message", (message) => {
  console.log(message);
  displayChat(message);
});

chatInput.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = event.target.elements.messageText.value;

  socket.emit("chat-message", message);
});

function displayChat(message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.innerHTML = `<p class="info">${message.username}<span>${message.time}</span></p>
    <p class="mText">${message.message}</p>`;
  document.querySelector(".messageView").appendChild(messageDiv);
}
