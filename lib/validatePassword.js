import { PASSWORD } from "./constants";

export function validatePasswordLocally(password) {
  // first check the password length
  if (password.length < PASSWORD.LENGTH.MIN) {
    return {
      isValid: false,
      reason: PASSWORD.LENGTH.TOO_SHORT,
    };
  } else if (password.length > PASSWORD.LENGTH.MAX) {
    return {
      isValid: false,
      reason: PASSWORD.LENGTH.TOO_LONG,
    };
  } else if (PASSWORD.REQUIRED.CHARACTERS.REGEX.test(password) === false) {
    return {
      isValid: false,
      reason: PASSWORD.REQUIRED.CHARACTERS.MISSING,
    };
  } else if (
    PASSWORD.REQUIRED.SPECIAL_CHARACTERS.REGEX.test(password) === false
  ) {
    return {
      isValid: false,
      reason: PASSWORD.REQUIRED.SPECIAL_CHARACTERS.MISSING,
    };
  } else {
    return { isValid: true };
  }
}
export default validatePasswordLocally;
