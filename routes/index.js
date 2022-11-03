const router = require("express").Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const {isLoggedIn, isLoggedOut} = require("../middleware/route-guard.js")

const User = require("../models/User.model");


/* GET home page */
router.get("/", (req, res, next) => {
  const user = req.session.currentUser
  res.render("index", user);
});

router.get("/signup", isLoggedOut, (req, res, next) => {
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

router.get("/login", isLoggedOut, (req, res) => {
  res.render("login")
})

router.post("/login", async (req, res)=> {
  console.log(req.session)
  const {username, password} = req.body
  try{
    const userData = await User.findOne({username})
    if (!userData){
      console.log("no user found")
      res.render("/login", {errorMessage: "This username is not registered"})
    } else if (bcrypt.compareSync(password, userData.password)){
      req.session.currentUser = userData;
      res.render("users/main", userData)
      console.log("login was success")
    } else {
      res.render("login", { errorMessage: "Incorrect password"})
      console.log("incorrect password")
    }
  }
  catch(err){
    console.log(err)}
})

//secret page
router.get("/users/main", isLoggedIn, (req, res) => {
  res.render("users/main")
})
router.get("/users/private", isLoggedIn, (req, res) => {
  res.render("users/private")
})

//logout route
router.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err)
    } else {
      res.redirect("/")
      console.log("Log out was a success")
    }
  })
})

module.exports = router;
