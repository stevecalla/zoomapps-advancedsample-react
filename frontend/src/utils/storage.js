const setStorage = (textInput) => {
  localStorage.setItem("attendeeList", textInput);
};

const retrieveStorage = () => {
  const storedData = localStorage.getItem("attendeeList");
  console.log(storedData);
  return storedData;
};

const removeStorage = () => {
  localStorage.removeItem("attendeeList");
}

module.exports = {
  setStorage,
  retrieveStorage,
  removeStorage,
};