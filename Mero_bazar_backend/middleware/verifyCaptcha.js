// middleware/verifyCaptcha.js
const axios = require('axios');

const verifyCaptcha = async (req, res, next) => {
    const { captchaToken } = req.body;

    if (!captchaToken) {
        return res.status(400).json({
            success: false,
            message: 'CAPTCHA verification failed'
        });
    }

    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
        );

        if (response.data.success) {
            next();
        } else {
            return res.status(400).json({
                success: false,
                message: 'CAPTCHA verification failed'
            });
        }
    } catch (error) {
        console.error('CAPTCHA verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'CAPTCHA verification failed'
        });
    }
};

module.exports = verifyCaptcha;