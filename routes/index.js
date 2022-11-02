const router = require("express").Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");


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
    password: hash 
  })
  res.redirect("/") 
}catch (err){
  console.log(err)
}
})

//login route

router.get("/login", (req, res) => {
  res.render("login")
})

router.post("/login", async (req, res)=> {
  const {username, password} = req.body
  try{
    const userData = await User.findOne({username})
    if (!userData){
      console.log("no user found")
      res.render("/login", {errorMessage: "This username is not registered"})
    } else if (bcrypt.compareSync(password, userData.password)){
      //req.session.currentUser = userData
      res.render("users/profile", userData)
      console.log("login was success")
    } else {
      res.render("login", { errorMessage: "Incorrect password"})
      console.log("incorrect password")
    }
  }
  catch(err){
    console.log(err)}
})

module.exports = router;
