const ms = require('ms');
const sendMail = require('../services/sendMail');
const makeToken = require('../db/makeToken');
const findUser = require('../db/findUser');
const validateAndNormalizeApiRequestFields = require('../utils/validateAndNormalizeApiRequestFields');
const apiErrorHandler = require('../utils/apiErrorHandler');

module.exports = ({ db }) => {
  async function forgotPassword(req, res) {
    
    try {
      const {
        campaign,
        body: {
          email,
        },
      } = req;

      const validationResult = validateAndNormalizeApiRequestFields({ email });

      if (Array.isArray(validationResult)) {
        res.status(400).json({
          field: validationResult[0],
          error: validationResult[1],
        });

        return;
      }

      const user = await findUser(db, validationResult.email, campaign);
      // console.log(user.email);

      if (user instanceof Error) {
        throw user;
      }

      if (user) {
        const resetToken = await makeToken(db, user, ms('1 hour'));

        const resetUrl = `https://${campaign.domains.pop()}/friendbank/reset-password?token=${resetToken}`;

        const mailResult = await sendMail(
          user.email,
          process.env.MAIL_PASSWORD_RESET_ID,
          {
            resetUrl,
            campaignName: campaign.name,
            accountEmail: user.email,
          },
        );

        if (mailResult instanceof Error) {
          throw mailResult;
        }
      }

      res.json({ ok: true });
    } catch (error) {
      apiErrorHandler(res, error);
    }
  }

  // async function forgotPassword2(req, res) {

  // set api key

  //   const msg = {
  //     to: 'lucho@c6digital.io', // Change to your recipient
  //     from: 'support@jamiedriscoll.org  ', // Change to your verified sender
  //     subject: 'Sending with SendGrid is Fun',
  //     text: 'and easy to do anywhere, even with Node.js',
  //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  //   }

  //   sgMail
  //   .send(msg)
  //   .then(() => {
  //     console.log('Email sent')
  //   })
  //   .catch((error) => {
  //     console.error(error)
  //   })
    

  // }

  return forgotPassword;



};
