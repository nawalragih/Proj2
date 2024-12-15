module.exports = (req, res, next) => {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).json({ error: 'Client ID is missing. Please log in first.' });
    }
    next();
};
