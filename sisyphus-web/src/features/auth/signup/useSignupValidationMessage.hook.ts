export const useSignupValidationMessage = (
  confirm: boolean,
  emailChecked: boolean,
  age: boolean | undefined,
  checkBox1: boolean | undefined,
  checkBox2: boolean | undefined,
) => {
  let msg = '';

  if (!confirm) {
    msg = 'signup.requiredEmail';
  } else if (!emailChecked) {
    msg = 'signup.confirmEmail';
  } else if (!age) {
    msg = 'signup.age14Desc';
  } else if (!checkBox1) {
    msg = 'signup.requireTerms';
  } else if (!checkBox2) {
    msg = 'signup.requireInfo';
  }

  return { msg };
};
