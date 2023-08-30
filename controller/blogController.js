const { users, Blog, combineBlog } = require("../model");
exports.blogUser = async (req,res)=> {
     console.log("the token ID is :)- "+ req.userId);
    
    const {title, image, description,userId} = req.body;
    console.log(req.file);

    await combineBlog.create({
        title: title,
        image:"http://localhost:3000/"+ req.file.filename,
        description: description,
        userId: req.userId
       } );
      res.redirect("/home");
 };
