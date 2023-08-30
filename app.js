const express = require('express');
const app = express();
const session = require('express-session');
const flash = require ('connect-flash');
const ejs = require("ejs");
const { registerUser, loginUser } = require('./controller/userController');
const { combineBlog, combineUser } = require('./model');
const { sendMail, newPassword } = require('./controller/sendMailController');
const { blogUser } = require('./controller/blogController');
const { multer, storage } = require("./services/multerConfig");
const { isAuthenticated } = require('./services/isAuthenticated');
app.use (require("cookie-parser")());

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
app.get('/single_Page',(req,res)=>{
  res.render('singleBlog');
});


// adding blog data..
app.get("/home",async(req,res)=>{
  const blogs = await combineBlog.findAll({
    include: combineUser
  })
  console.log(blogs)
  res.render('main',{blogs})
  // res.render("main")
});

// for displaying singleBlog
app.get('/blogs/:id',async(req,res)=>{
  const blog = await combineBlog.findAll({
include: combineUser,    

      where:{
          id:req.params.id
            }
          });
          console.log(blog)
      res.render('singleBlog',{blog})
  });

  // for removing a blog
app.get('/delete/:id',async(req,res)=>{
  await combineBlog.destroy({
      where:{
          id:req.params.id
            }
          });
      res.redirect('/home');
  });

// Update blog data and redirect to the blog list page
app.get('/update/:id', async(req,res) => {
      
  const edit= await combineBlog.findAll({
     where:{
        id: req.params.id
     } 
  });
  console.log(edit)
  res.render('editBlogForm',{edit})
});

app.post('/update/:id',upload.single('image'), async(req,res) => {
  const update1 = await combineBlog.update({
    title:req.body.title,
        description: req.body.description,
        image: "http://localhost:3000/"+req.file.filename,
    },{
       where:{
          id:req.params.id
       }
  });
  console.log(update1)
  res.redirect('/blogs/' + req.params.id)
});

// .......
app.get("/my_Blog",isAuthenticated,async(req,res)=>{
  const blogs = await combineBlog.findAll({
    where:{
      userId: req.userId
  },

    include: combineUser
  });
  // console.log(blogs)
  res.render('main',{blogs})
});



// aairwko data lai store garne
app.post('/register',registerUser);
app.post('/login',loginUser);
app.post('/add_blog', isAuthenticated, upload.single('image'),blogUser); 
app.post('/verify_otp',sendMail);
app.post('/new_password',newPassword);


 


// start server
app.listen(3000,(req,res)=>{
    console.log('server starting on port no: 3000 !!')
});