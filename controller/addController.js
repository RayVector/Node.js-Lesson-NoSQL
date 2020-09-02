const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');

// add new course page:
router.get('/', auth,  (req, res) => {
  res.render('add', {
    title: 'Add new course',
    isAddCourse: true
  })
});

// add new course:
router.post('/', auth, async (req, res) => {
  const {title, price, img} = req.body;
  const course = new Course({
    title: title,
    price: price,
    img: img,
    userId: req.user
  });

  try {
    await course.save();
    res.redirect('/courses')
  } catch (e) {
    console.log(e);
  }

});


module.exports = router;