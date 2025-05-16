const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  res.status(200).json(req.user);
});
module.exports = { getUserProfile };
