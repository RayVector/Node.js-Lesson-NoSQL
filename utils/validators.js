const {body} = require('express-validator');
const User = require('../models/user');


exports.registerValidators = [
  body('email', 'Некорректный Email').isEmail().custom(async (value, {req}) => {
    try {
      const candidate = await User.findOne({email: value});
      if (candidate) {
        return Promise.reject('Такой email уже используется')
      }
    } catch (e) {
      console.log(e);
    }
  }),
  body('password', 'Некорректный пароль').isLength({min: 6, max: 125}).isAlphanumeric(),
  body('confirmPassword').custom((value, {req}) => {
    if (value !== req.body.password) {
      throw new Error('Пароли должны совпадать')
    }
    return true
  }),
  body('name', 'Имя должно быть минимум 3 символа').isLength({min: 3}),
];