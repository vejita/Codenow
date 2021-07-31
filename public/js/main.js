const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//geting username and room from url

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);

const soket = io();
// join chatroom
// sending rooom data to server
soket.emit("joinRoom", { username, room });

//Get room users
soket.on("roomUsers", ({ users, room }) => {
  outputRoomname(room);
  outputUsers(users);
});

soket.on("message", (message) => {
  console.log(message);
  output(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  console.log(msg);

  //   sending msg to server
  soket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function output(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
      ${message.txt}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// add room name to DOM
function outputRoomname(room) {
  document.getElementById("room-name").innerHTML = room;
}

function outputUsers(users) {
  document.getElementById("users").innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}

function currentUser(id) {
  const user = getCurrentUser(id);
  document.getElementById("usersname").innerHTML = `User Nme : ${user}`;
}
