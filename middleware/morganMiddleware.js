const morgan = require("morgan");
const logger = require("../config/logger");

const stream = {
  write: (message) => logger.http(message.trim()),
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream }
);

module.exports = morganMiddleware;

//킹받음... 로그 파일에는 찍히는데 콘솔에는 안찍힘
//그냥 morgan('dev')랑 같이 쓰는걸루 ㅎ
