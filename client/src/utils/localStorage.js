const userKey = "chatty-user";

export function setUser(userData) {
  localStorage.setItem(userKey, JSON.stringify(userData));
}

export function getUser() {
  return JSON.parse(localStorage.getItem(userKey));
}
