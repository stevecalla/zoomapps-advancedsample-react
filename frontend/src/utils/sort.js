
const sortHandlerScreenName = (items) => {
  return [...items].sort((a, b) => a.screenName.localeCompare(b.screenName));
};

const sortHandlerNames = (items) => {
  return [...items].sort((a, b) => a.name.localeCompare(b.name));
};

module.exports = {
  sortHandlerScreenName,
  sortHandlerNames,
};