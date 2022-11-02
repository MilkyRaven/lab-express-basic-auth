const router = require("express").Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("signup")
})

router.post("/signup", async (req, res)=> {
const {username, password} = req.body
try {
  const salt = bcrypt.genSaltSync(saltRounds)
  const hash = bcrypt.hashSync(password, salt)
  await User.create({
    username ,
    email,
    password: hash 
  })
  res.redirect("index")
}catch (err){
  console.log(err)
}
})

module.exports = router;
