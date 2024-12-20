export const validateSignUp = (payload: any) => {
  const { email, password, confirm_password, fullname, phone, role } = payload;

  const errors: any = {};

  if (email.trim() === '') {
    errors.email = 'Email must not be empty.';
  } else {
    const regEx = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address.';
    }
  }

  if (password === '') {
    errors.password = 'Password must not be empty.';
  } else {
    if (password !== confirm_password) {
      errors.confirm_password = 'Passwords must match.';
    }
  }

  if (fullname.trim() === '') {
    errors.fullname = 'Fullname must not be empty.';
  }

  if (phone.trim() === '') {
    errors.phone = 'Phone number must not be empty.';
  } else {
    if (phone.length < 10) {
      errors.phone = 'Phone number must be at least 10 characters.';
    }
  }

  if (role.trim() === '') {
    // role should be user or admin
    errors.role = 'Role must not be empty.';
  } else {
    if (role !== 'user' && role !== 'admin') {
      errors.role = 'Role must be user or admin.';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateSignIn = (payload: any) => {
  const { email, password } = payload;

  const errors: any = {};

  if (email.trim() === '') {
    errors.email = 'Email is required';
  }

  if (password === '') {
    errors.password = 'Password must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateUpdateProfile = (payload: any) => {
  const { email, fullname, phone, role } = payload;

  const errors: any = {};

  if (email.trim() === '') {
    errors.email = 'Email must not be empty.';
  } else {
    const regEx = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/;

    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address.';
    }
  }

  if (fullname.trim() === '') {
    errors.fullname = 'Fullname must not be empty.';
  }

  if (phone.trim() === '') {
    errors.phone = 'Phone number must not be empty.';
  } else {
    if (phone.length < 10) {
      errors.phone = 'Phone number must be at least 10 characters.';
    }
  }

  if (role.trim() === '') {
    // role should be user or admin
    errors.role = 'Role must not be empty.';
  } else {
    if (role !== 'user' && role !== 'admin') {
      errors.role = 'Role must be user or admin.';
    }
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validatePaymentMethodInput = (payload: any) => {
  const { type, card_number, expiration_date, cvv } = payload;

  const errors: any = {};

  if (type.trim() === '') {
    errors.type = 'Type must not be empty.';
  } else {
    if (
      type !== 'credit' &&
      type !== 'debit' &&
      type !== 'paypal' &&
      type !== 'stripe' &&
      type !== 'cash'
    ) {
      errors.type = 'Type must be credit, debit, paypal, stripe, or CASH.';
    }
  }

  if (card_number.trim() === '') {
    errors.card_number = 'Card number must not be empty.';
  }

  if (expiration_date.trim() === '') {
    errors.expiration_date = 'Expiration date must not be empty.';
  }

  if (cvv.trim() === '') {
    errors.cvv = 'CVV must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

export const validateAddressInput = (payload: any) => {
  const { address, city, state, zip } = payload;

  const errors: any = {};

  if (address.trim() === '') {
    errors.address = 'Address must not be empty.';
  }

  if (city.trim() === '') {
    errors.city = 'City must not be empty.';
  }

  if (state.trim() === '') {
    errors.state = 'State must not be empty.';
  }

  if (zip.trim() === '') {
    errors.zip = 'Zip must not be empty.';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
