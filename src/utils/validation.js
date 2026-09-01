const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid!");
  } else if (!validator.isEmail(email)) {
    throw new Error(" email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please Enter a strong password!");
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "email",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((fields) =>
    allowedEditFields.includes(fields),
  );

  //In my openion below code seems more understandable to me but akshay teach me above
  //   const isEditAllowed = allowedEditFields.every((field) =>
  //   Object.keys(req.body).includes(field)
  // );
  return isEditAllowed;
};

module.exports = { validateSignUpData, validateEditProfileData };
