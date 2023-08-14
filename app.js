const express = require('express');
const app = express();
const session = require('express-session');
const flash = require ('connect-flash');
const ejs = require("ejs");
const { registerUser, loginUser } = require('./controller/userController');
const { combineBlog } = require('./model');
const { sendMail, newPassword } = require('./controller/sendMailController');
const { blogUser } = require('./controller/blogController');
const { multer, storage } = require("./services/multerConfig");
const upload = multer({ storage: storage });



// Middlewares    //body batw aako datalai read gar vaneko.
app.use(express.json());
app.use(express.urlencoded({extended:true}));


// Configure express-session middleware
app.use(session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: true
  })
);
// Configure connect-flash middleware
app.use(flash());

// Set the view engine to EJS 
app.set('view engine', 'ejs');
app.use(express.static("uploads"));



// routing

app.get('/nav',(req,res)=>{
  req.flash('message', 'Welcome to MyBlog');
  res.render('navbar');
});
app.get('/blog',(req,res)=>{
  res.render('blogForm');
});
app.get('/register',(req,res)=>{
  res.render('regForm');
});
app.get('/login',(req,res)=>{
  res.render('loginForm');
});
app.get('/otp',(req,res)=>{
  res.render('sendOTP');
});
app.get('/verify_otp',(req,res)=>{
  res.render('sendOTP');
});
app.get('/input_otp',(req,res)=>{
  res.render('inputOTP');
});
app.get('/password',(req,res)=>{
  res.render('comfirmPassword');
});



// adding blog data..
app.get("/home",async(req,res)=>{
  const blogs = await combineBlog.findAll()
  res.render('main',{blogs})
  // res.render("main")
});






// aairwko data lai store garne
app.post('/register',registerUser);
app.post('/login',loginUser);
app.post('/add_blog', upload.single('image'),blogUser); 
app.post('/verify_otp',sendMail);
app.post('/new_password',newPassword);


 


// start server
app.listen(3000,(req,res)=>{
    console.log('server starting on port no: 3000 !!')
});