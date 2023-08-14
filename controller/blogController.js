const { users, Blog, combineBlog } = require("../model");
exports.blogUser = async (req,res)=> {
    
    const {title, image, description} = req.body;
    console.log(req.file);

    await combineBlog.create({
        title: title,
        image:"http://localhost:3000/"+ req.file.filename,
        description: description
       } );
      res.redirect("/home");
 };
