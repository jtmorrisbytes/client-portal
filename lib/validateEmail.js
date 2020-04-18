// below regex credits to http://regexlib.com/REDetails.aspx?regexp_id=26
const regex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
export default function validateEmail(email) {
  return regex.test(email);
}
