// Regex for at least one upper case letter, one lower case letter, one number and one symbol.
export const PASSWORD_REGEX =
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
