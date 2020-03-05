const auth = commandHandler =>
    async (req, res, next) => {
        try {
            if (req.originalUrl.startsWith('/api/auth')) {
                return next();
            }
            const result = await commandHandler.authenticate(req.headers.authorization);
            req.user = result.user;
            next();
        } catch (err) {
            next(err);
        }
    };

module.exports = auth;
