const winston = require("winston");
const winstonDaily = require("winston-daily-rotate-file");

const { combine, timestamp, label, printf } = winston.format;
const CATEGORY = "Project"; //어플 이름

//로그파일 저장 경로: 루트/logs
const logDir = `${process.cwd()}/logs`;

//log 출력 format function
const logFormat = printf(({ level, message, label, timestamp }) => {
  //날짜 [시스템이름] 로그레벨: 메시지
  return `${timestamp} [${label}] ${level}: ${message}`;
});

//DailyRotateFile function
const fileRotateTransport = (level, filename) =>
  new winstonDaily({
    level: level,
    datePattern: "YYYY-MM-DD",
    dirname: logDir,
    filename: filename,
    maxFiles: "7d",
    zippedArchive: true,
  });

const logger = winston.createLogger({
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    label({ label: CATEGORY }),
    logFormat
  ),

  transports: [
    //level: info(error, warn, info)
    fileRotateTransport("http", `%DATE%.log`),

    //level: error(only error)
    fileRotateTransport("error", `%DATE%.error.log`),
  ],
});

//production 환경이 아닌 경우
//화면 출력 추가, simple 포맷
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: combine(winston.format.colorize(), winston.format.simple()),
    })
  );
}

module.exports = logger;
