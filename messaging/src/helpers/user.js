const allUsers = [];

function addUser(id, username, userChats) {
  const currentUser = { id, username, userChats };
  //add this user to the list of all users
  allUsers.push(currentUser);
  //return this user so that we can add him/her to a room later
  return currentUser;
}

function getUser(userId) {
  return allUsers.find((currentUser) => currentUser.userId === userId);
}

function getAllUsers() {
  return allUsers;
}

module.exports = { addUser, getUser, getAllUsers };
