if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}


//import stuff
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMAte = require('ejs-mate')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const session = require('express-session');
const flash = require('connect-flash');

//routes
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');

//////////////////////////////////
//connect mongoose
dbUrl = process.env.DB_URL;
//'mongodb://localhost:27017/yelp-camp'
mongoose.connect( 'mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true 
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('mongoDB connected');
});

const app = express();

//////////////////////////////////////////////////////
//middleware
//EJS
app.engine('ejs', ejsMAte) //EJS-MATE
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(__dirname + '/public'))
//post method
app.use(express.urlencoded({extended: true}))
//PUT METHOD
app.use(methodOverride('_method'))
//session configure
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());
//passport
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//session adn flash

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


//////////////////////////////////////////////////////
//ROUTES
app.use('/', userRoutes);
app.use('/', campgroundRoutes)
app.use('/', reviewRoutes)


app.get('/', (req,res) => {
    res.render('home')
})


/////////////////////////////////////////////////
//error handling
app.use((err,req,res,next) => {
    res.send('oh no! Something went wrong')
    console.log(err);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`serving on port ${port}`)
})