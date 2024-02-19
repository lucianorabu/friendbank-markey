const mail = require('@sendgrid/mail');
const _writeServiceOutput = require('./_writeServiceOutput');

const {
  MAIL_DEBUG,
  MAIL_FROM,
  MAIL_FROM_NAME,
  SENDGRID_API_KEY,
} = process.env;

async function sendMail(
  to = '',
  templateId = '',
  templateData = {},
) {
  try {
    mail.setApiKey(SENDGRID_API_KEY);

    const message = {
      to,
      from: {
        name: MAIL_FROM_NAME,
        email: MAIL_FROM,
      },
      templateId,
      dynamic_template_data: templateData,
    };

    console.log(message)

    // if (MAIL_DEBUG) {
    //   message.mailSettings = {
    //     sandboxMode: {
    //       enable: true,
    //     },
    //   };

    //   await _writeServiceOutput('mail', message);
    // }

    mail.send(message).then((response) => {
      console.log('sent!')
      // console.log(response[0].statusCode)
      // console.log(response[0].headers)
    })
    .catch((error) => {
      error.message = JSON.stringify(error);
      console.log(error)
      return error;
    })

  //   const msg = {
  //     to: 'lucho.rabu@gmail.com', // Change to your recipient
  //     from: { name: 'Team Jamie', email: 'support@jamiedriscoll.org' },
  //     subject: 'New test on this email',
  //     text: 'and easy to do anywhere, even with Node.js',
  //     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  //   }

  //   mail
  //   .send(msg)
  //   .then((response) => {
  //     console.log('sent!')
  //     console.log(response[0].statusCode)
  //     console.log(response[0].headers)
  //   })
  //   .catch((error) => {
  //     console.log('errorrrr !')
  //     console.error(error)
  //   })

  } catch (error) {
    error.message = JSON.stringify(error);
    console.log(error)
    return error;
  }
}

module.exports = sendMail;
