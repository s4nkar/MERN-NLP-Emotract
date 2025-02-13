import chalk from 'chalk';

const logger = (req, res, next) => {
  const methodColors = {
    GET: chalk.green,
    POST: chalk.blue,
    PUT: chalk.yellow,
    DELETE: chalk.red,
  };

  const color = methodColors[req.method] || chalk.white;

  console.log(
    `${color(req.method)} ${color(req.protocol)}${color('://')}${color(req.get('host'))}${color(req.originalUrl)}`
  );

  next();
};

export default logger;
