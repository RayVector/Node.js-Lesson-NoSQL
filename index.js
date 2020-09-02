const express = require('express');
const Handlebars = require('handlebars');
const exbars = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path');
const flash = require('connect-flash');
const keys = require('./keys/index');
const compression = require('compression');

// security:
const csrf = require('csurf');
const helmet = require('helmet');

// mongodb:
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

// app + port
const port = process.env.PORT || 3000;
const app = express();


// require controllers:
const homeRoutes = require('./controller/homeController');
const addRoutes = require('./controller/addController');
const coursesRoutes = require('./controller/coursesController');
const cardRoutes = require('./controller/cardController');
const ordersRoutes = require('./controller/ordersController');
const authRoutes = require('./controller/authController');
const profileRoutes = require('./controller/profileController');

// require external middleware:
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const fileMiddleware = require('./middleware/file');


// handlebars:
const hbs = exbars.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});
app.engine('hbs', hbs.engine);
app.engine('handlebars', exbars({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'hbs');
app.set('views', 'view');

//static:
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.urlencoded({extended: true}));

// session:
// session/MongoStore
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGODB_URI
});

// session init:
app.use(session({
  secret: keys.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));


// external middleware init:
//// file
app.use(fileMiddleware.single('avatar'));
//// security:
app.use(csrf());
app.use(helmet());
//// other
app.use(compression());
app.use(flash());
app.use(varMiddleware);
//// user
app.use(userMiddleware);


// controller routes:
app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/card', cardRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// mongodb:
async function start() {
  try {
    await mongoose.connect(keys.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log('MongoDB successfully connected');
    app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
  } catch (e) {
    console.log(e)
  }
}


// run
start();