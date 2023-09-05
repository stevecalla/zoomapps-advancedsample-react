const setStorage = (text) => {
  localStorage.setItem("attendeeList", text);
};

const getStorage = () => {
  const storedData = localStorage.getItem("attendeeList");
  console.log(storedData);
  return storedData;
};

const removeStorage = () => {
  localStorage.removeItem("attendeeList");
}

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
};