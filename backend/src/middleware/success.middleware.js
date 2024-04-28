module.exports = async function (req, res, next) {
  return res.status(200).json({
    status: 'ok',
  });
};
