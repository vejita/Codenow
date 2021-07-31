const moment = require("moment");

const formateMessage = (username, txt) => {
  return {
    username,
    txt,
    time: moment().format("h:mm a"),
  };
};

module.exports = formateMessage;
