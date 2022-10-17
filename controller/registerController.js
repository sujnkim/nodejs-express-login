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

  //해당 이메일의 유저가 이미 존재하는지 확인
  const duplicate = await User.findOne({ email: mail }).exec();
  if (duplicate) {
    return res.status(409).json({ message: `Email ${mail} is already exist.` }); //Conflict
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

    res.status(200).json({ success: `true/ New user ${mail} created.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
