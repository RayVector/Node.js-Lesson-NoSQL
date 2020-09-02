const {Schema, model} = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: String,
  password: {
    type: String,
    required: true
  },
  avatarUrl: String,
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function (course) {
  const items = [...this.cart.items];
  const index = items.findIndex(clonedItem => {
    return clonedItem.courseId.toString() === course._id.toString()
  });

  if (index >= 0) {
    items[index].count = items[index].count + 1;
  } else {
    items.push({
      courseId: course._id,
      count: 1
    })
  }

  this.cart = {items};
  return this.save()
};

userSchema.methods.removeFromCart = function (courseId) {
  let items = [...this.cart.items];
  const index = items.findIndex(clonedItem => {
    return clonedItem.courseId.toString() === courseId.toString()
  });

  if (items[index].count === 1) {
    items = items.filter(c => c.courseId.toString() !== courseId.toString())
  } else {
    items[index].count--
  }

  this.cart = {items};
  return this.save()

};

userSchema.methods.clearCart = function () {
  this.cart = {items: []};
  return this.save()
};

module.exports = model('User', userSchema);