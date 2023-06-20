const express = require("express");
const router = express.Router();
const userSchema = require("../schemas/user.js");

router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

  // 패스워드와 패스워드 확인
  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드와 전달된 패스워드 확인값이 일치하지 않습니다."
    });
    return;
  }

  // 이메일, 닉네임이 실제로 DB에 존재하는지 확인
  const isExistUser = await userSchema.findOne({
    $or: [{ email }, { nickname }], // 이메일 또는 닉네임이 일치할 때 조회한다.
  });
  if (isExistUser) {
    res.status(400).json({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다."
    });
    return;
  }

  const user = new userSchema({ email, nickname, password });
  await user.save(); // DB에 저장

  return res.status(200).json({});
});

module.exports = router;