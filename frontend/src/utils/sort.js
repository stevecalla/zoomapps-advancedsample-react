const sortHandlerScreenName = (items) => {
  return [...items].sort((a, b) => a.screenName.localeCompare(b.screenName));
};

const sortHandlerNames = (items) => {
  return [...items].sort((a, b) => a.localeCompare(b));
};

module.exports = {
  sortHandlerScreenName,
  sortHandlerNames,
};