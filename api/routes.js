
const express = require('express')
const axios = require("axios")
const router = express.Router();

router.post("/register", async(req, res) => {
  const {username , password} = req.body;
  try{
    const hashPassword = await bcrypt.hash(password, 10);
    await pool.query(
        "insert into users (username, password) values ($1, $2)",[username, hashPassword]
    );
    res.json({message: "User registed successfully"});
  }catch(err){
    console.log(err);
  }
});

router.post("/login", async(req, res) => {
  const {username , password} = req.body;
  try{
    const result = await pool.query(
        "select * from users where username = $1",[username]
    );
    if(result.rows.length === 0){
        return res.json({error : "user not found"})
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if(!valid){
        return res.json({message: "invalid password"});
    }
    res.json({message: "User registed successfully"});
  }catch(err){
    console.log(err);
  }
});

module.export = router;
