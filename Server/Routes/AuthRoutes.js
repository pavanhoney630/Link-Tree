const router = require("express").Router();

const {signup,login,setUsername,getUser,updateUser} = require("../Controllers/AuthController");

router.post('/signup', signup);

router.post('/username', setUsername);

router.post('/login', login);

router.get('/user',getUser);

router.put('/update', updateUser);

module.exports = router;