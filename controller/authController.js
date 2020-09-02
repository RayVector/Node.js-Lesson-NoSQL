const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const {registerValidators} = require('../utils/validators');
// user:
const User = require('../models/user');


/**
 * login
 * get
 */
router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    registerError: req.flash('registerError'),
    loginEmailError: req.flash('loginEmailError'),
    loginPasswordError: req.flash('loginPasswordError')
  })
});

/**
 * login
 * post
 */
router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const candidate = await User.findOne({email});

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {

        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err
          } else {

            res.redirect('/')
          }
        })

      } else {
        req.flash('loginPasswordError', 'Password not valid');
        res.redirect('/auth/login#login')
      }
    } else {
      req.flash('loginEmailError', 'User not found');
      res.redirect('/auth/login#login')
    }

  } catch (e) {
    console.log(e);
  }

});

/**
 * register
 * post
 * validated
 */
router.post('/register', registerValidators, async (req, res) => {
  try {
    const {name, email, password} = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashPassword,
      cart: {items: []}
    });
    await user.save();
    res.redirect('/auth/login#login');

  } catch (e) {
    console.log(e);
  }
});

/**
 * logout
 * get
 */
router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login#login')
  });
});

module.exports = router;