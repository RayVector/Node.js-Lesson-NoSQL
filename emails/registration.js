const keys = require('../keys/index');

module.exports = function (email) {
  console.log(email);
  return {
    to: email,
    from: keys.EMAIL_FROM,
    subject: 'Registration success',
    html: `
      <h1>Welcome to our Shop</h1>
      <br>
      <p>Registration successful! Account ${email} created</p>
      <hr>
      <a href="${keys.BASE_URL}">Courses shop</a>
      <br>
    `
  }
};