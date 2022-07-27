const Post = require("../models/post");


exports.savePost = (req, res) => {
  const post = new Post({
    title: req.body.title,
    location: req.body.location,
    content:req.body.content,
    imageUrl:req.body.imageUrl,
    creator: req.userData.userId
  });
  post.save().then(result => {
      res.status(201).json({data: result});
    }).catch(error => {
      res.status(500).json({error: error});
    });

};


exports.getAllPosts = (req, res) => {
  Post.find({}, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
}


  exports.getPost = (req, res) => {
    Post.findById(req.params.id).then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
      .catch(error => {
        res.status(500).json({
          message: "Fetching post failed!"
        });
      });
  }


    exports.updatePost = (req, res) => {
      Post.updateOne({_id:req.body.id, creator:req.userData.userId },
        {
          _id:req.body.id,
          title: req.body.title,
          location: req.body.location,
          content:req.body.content,
          imageUrl:req.body.imageUrl,
          creator:req.userData.userId
        }).then(result => {
        if (result.modifiedCount > 0) {
          res.status(200).json({ message: "Update successful!" });
        } else {
          res.status(401).json({ message: "Not authorized!" });
        }
      })
        .catch(error => {
          res.status(500).json({
            message: "Couldn't update post!"
          });
        });
    }


      exports.deletePost = (req, res) => {
        Post.deleteOne({_id:req.params.id, creator:req.userData.userId }).then(
          result => {

            if (result.deletedCount > 0) {
              res.status(200).json({ message: "Deletion successful!" });
            } else {
              res.status(401).json({ message: "Not authorized!" });
            }
          })
          .catch(error => {

            res.status(500).json({
              message: "Deleting posts failed!"
            });
          });
      }





