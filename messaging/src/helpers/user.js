const allUsers = [];

function addUser(userId, username, userChats) {
  const currentUser = { userId, username, userChats };

  allUsers.push(currentUser);

  return currentUser;
}

function getUser(userId) {
  return allUsers.find((currentUser) => currentUser.userId === userId);
}

module.exports = { addUser, getUser };
