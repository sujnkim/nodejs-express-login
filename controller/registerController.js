const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  //이메일, 이름, 패스워드
  const { mail, name, pwd } = req.body;
  if (!mail || !name || !pwd) {
    return res
      .status(400)
      .json({ message: "Email, Username and password are required." });
  }

  try {
    //password encryption
    const hashedPwd = await bcrypt.hash(pwd, 10);

    //create new user
    const newUser = await User.create({
      email: mail,
      username: name,
      password: hashedPwd,
    });

    console.log(newUser);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
