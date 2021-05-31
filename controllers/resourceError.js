const NotFoundError = require('../errors/notFoundError');

module.exports.resourceError = () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден.');
};
