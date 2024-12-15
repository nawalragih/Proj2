module.exports = (req, res, next) => {
    if (!req.session || !req.session.clientId) {
        return res.status(401).json({ error: 'Client ID is missing. Please log in first.' });
    }
    next();
};
