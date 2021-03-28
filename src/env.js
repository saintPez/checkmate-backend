const environments = {
  MYSQL_DATABASE: process.env.MYSQL_DATABASE || "checkmate",
  MYSQL_USER: process.env.MYSQL_USER || "root",
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || "",
  MYSQL_HOST: process.env.MYSQL_HOST || "localhost",
};

module.exports = environments;
