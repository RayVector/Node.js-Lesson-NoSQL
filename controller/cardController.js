const {Router} = require('express');
const Course = require('../models/course');
const router = Router();
const auth = require('../middleware/auth');

function mapCartList(cartList) {
  return cartList.map(cartItem => ({
    ...cartItem.courseId._doc,
    id: cartItem.courseId.id,
    count: cartItem.count
  }))
}

function computePrice(courses) {
  return courses.reduce((total, course) => {
    return total += course.price * course.count
  }, 0)
}

// add to cart:
router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id).lean();
  await req.user.addToCart(course);
  res.redirect('/card')
});

// get cart list:
router.get('/', auth, async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate();

  const courses = mapCartList(user.cart.items);

  res.render('card', {
    title: 'Card',
    isCard: true,
    courses,
    price: computePrice(courses)
  })
});

// remove from cart:
router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate('cart.items.courseId').execPopulate();
  const courses = mapCartList(user.cart.items);
  const cart = {
    courses,
    price: computePrice(courses)
  };

  console.log(12314214, cart);

  res.status(200).json(cart)
});


module.exports = router;