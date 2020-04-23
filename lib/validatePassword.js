const { PASSWORD } = require("./constants");
function validatePasswordLocally(password) {
  // first check the password length
  if (password.length < PASSWORD.LENGTH.MIN) {
    return {
      isValid: false,
      reason: PASSWORD.LENGTH.TOO_SHORT.REASON,
      description: PASSWORD.LENGTH.TOO_SHORT.DESCRIPTION,
    };
  } else if (password.length > PASSWORD.LENGTH.MAX) {
    return {
      isValid: false,
      reason: PASSWORD.LENGTH.TOO_LONG.REASON,
      description: PASSWORD.LENGTH.TOO_LONG.DESCRIPTION,
    };
  } else if (PASSWORD.REQUIRED.CHARACTERS.REGEX.test(password) === false) {
    console.log("checking password for basic characters");
    return {
      isValid: false,
      reason: PASSWORD.REQUIRED.CHARACTERS.MISSING.REASON,
      description: PASSWORD.REQUIRED.CHARACTERS.MISSING.DESCRIPTION,
    };
  } else if (
    PASSWORD.REQUIRED.SPECIAL_CHARACTERS.REGEX.test(password) === false
  ) {
    return {
      isValid: false,
      reason: PASSWORD.REQUIRED.SPECIAL_CHARACTERS.MISSING.REASON,
      description: PASSWORD.REQUIRED.SPECIAL_CHARACTERS.MISSING.DESCRIPTION,
    };
  } else {
    return { isValid: true };
  }
}
module.exports = validatePasswordLocally;
