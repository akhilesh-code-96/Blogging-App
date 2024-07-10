export const auth = (req, res, next) => {
  if (req.session.id) {
    console.log("User is authenticated.");
    next();
  } else {
    res.status(401).json({ user: null });
  }
};
