const axios = require('axios');
require('dotenv').config();

const RECAPTCHA_V2_SECRET_KEY = process.env.RECAPTCHA_V2_SECRET_KEY;

const verifyRecaptcha = async (req, res, next) => {
    const recaptchaToken = req.body.recaptchaToken;

    if (!RECAPTCHA_V2_SECRET_KEY) {
        console.error('CRITICAL: RECAPTCHA_V2_SECRET_KEY is not set.');
        return res.status(500).json({ message: 'Server configuration error (reCAPTCHA).' });
    }

    if (!recaptchaToken) {
        return res.status(400).json({ message: 'reCAPTCHA token is missing.' });
    }

    try {
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_V2_SECRET_KEY}&response=${recaptchaToken}&remoteip=${req.ip}`;

        const response = await axios.post(verificationURL);
        const { success, score, action, challenge_ts, hostname, "error-codes": errorCodes } = response.data;

        
        if (success) {
            console.log('reCAPTCHA verification successful.');
            next();
        } else {
            console.warn('reCAPTCHA verification failed:', errorCodes);
            return res.status(400).json({ message: 'reCAPTCHA verification failed.', errors: errorCodes });
        }
    } catch (error) {
        console.error('Error during reCAPTCHA verification:', error.message);
        return res.status(500).json({ message: 'Error during reCAPTCHA verification.' });
    }
};

module.exports = { verifyRecaptcha };