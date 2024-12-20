import { UserInputError } from 'apollo-server';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

import query from '../lib/db';
import { formatColSet } from '../utils/common.util';
import {
  validateSignIn,
  validateSignUp,
  validatePaymentMethodInput,
  validateUpdateProfile,
  validateAddressInput,
} from '../middleware/validator.middleware';
import { generateToken } from '../utils/auth.util';

class UserService {
  private tableName: string;

  constructor() {
    this.tableName = 'user';
  }

  async getUser(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet}`;

      const res = await query(sql, [...values]);
      return res[0] as any;
    } catch (error) {
      console.log('[getUser] error: ', error);
      throw error;
    }
  }

  async signUp(userInput: any) {
    try {
      const { valid, errors } = validateSignUp(userInput);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const { email, password, fullname, phone, role } = userInput;
      const sql = `INSERT INTO ${this.tableName} (user_id, email, password, fullname, phone, role, paymentmethod_list, address_list) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        uuidv4(),
        email,
        bcrypt.hashSync(password, 10),
        fullname,
        phone,
        role,
        '[]',
        '[]',
      ];

      const { affectedRows } = (await query(sql, values)) as any;

      if (affectedRows) {
        const user = await this.getUser({ email });
        delete user.password;

        const token = generateToken(user);
        return { user, token };
      }
    } catch (error) {
      console.log('[signUp] error: ', error);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new UserInputError('Errors', {
          errors: {
            general: 'Email/username already exists.',
          },
        });
      }
      throw new Error(error);
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { valid, errors } = validateSignIn({ email, password });

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await this.getUser({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: { email: 'User not found' },
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw new UserInputError('Wrong crendetials', {
          errors: { password: 'Wrong credentials' },
        });
      }
      delete user.password;

      const token = generateToken(user);

      return { user, token };
    } catch (error) {
      console.log('[signIn] error: ', error);
      throw new Error(error.message);
    }
  }

  async updateProfile(userInput: any, email: string) {
    try {
      const { valid, errors } = validateUpdateProfile(userInput);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const { colSet, values } = formatColSet(userInput);
      console.log('values: ', values);
      const sql = `UPDATE ${this.tableName} SET ${colSet} WHERE email = ?`;

      const { affectedRows } = (await query(sql, [...values, email])) as any;

      if (affectedRows) {
        const user = await this.getUser({ email });
        delete user.password;

        return user;
      }
    } catch (error) {
      console.log('[updateProfile] error: ', error);
      throw new Error(error.message);
    }
  }

  async addPaymentMethod(paymentMethodInput: any, email: string) {
    try {
      const { valid, errors } = validatePaymentMethodInput(paymentMethodInput);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await this.getUser({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: { email: 'User not found' },
        });
      }

      paymentMethodInput.id = uuidv4();
      paymentMethodInput.user_id = user.user_id;

      const paymentmethod_list = user.paymentmethod_list;
      paymentmethod_list.push(paymentMethodInput);

      const colSet = 'paymentmethod_list';
      const values = [JSON.stringify(paymentmethod_list)];

      const sql = `UPDATE ${this.tableName} SET ${colSet} = ? WHERE email = ?`;
      const { affectedRows } = (await query(sql, [...values, email])) as any;

      if (affectedRows) {
        user.paymentmethod_list = paymentmethod_list;
        delete user.password;

        return user;
      }
    } catch (error) {
      console.log('[addPaymentMethod] error: ', error);
      throw new Error(error.message);
    }
  }

  async updatePaymentMethod(
    paymentMethodInput: any,
    id: string,
    email: string
  ) {
    try {
      const { valid, errors } = validatePaymentMethodInput(paymentMethodInput);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await this.getUser({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: { email: 'User not found' },
        });
      }

      const paymentmethod_list = user.paymentmethod_list;
      const index = paymentmethod_list.findIndex((item: any) => item.id === id);

      if (index === -1) {
        throw new UserInputError('Payment method not found', {
          errors: { id: 'Payment method not found' },
        });
      }

      paymentmethod_list[index] = {
        id,
        user_id: user.id,
        ...paymentMethodInput,
      };

      const colSet = 'paymentmethod_list';
      const values = [JSON.stringify(paymentmethod_list)];

      const sql = `UPDATE ${this.tableName} SET ${colSet} = ? WHERE email = ?`;
      const { affectedRows } = (await query(sql, [...values, email])) as any;

      if (affectedRows) {
        user.paymentmethod_list = paymentmethod_list;
        delete user.password;

        return user;
      }
    } catch (error) {
      console.log('[editPaymentMethod] error: ', error);
      throw new Error(error.message);
    }
  }

  async deletePaymentMethod(id: string, email: string) {
    try {
      const user = await this.getUser({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: { email: 'User not found' },
        });
      }

      const paymentmethod_list = user.paymentmethod_list;
      const index = paymentmethod_list.findIndex((item: any) => item.id === id);

      if (index === -1) {
        throw new UserInputError('Payment method not found', {
          errors: { id: 'Payment method not found' },
        });
      }

      paymentmethod_list.splice(index, 1);

      const colSet = 'paymentmethod_list';
      const values = [JSON.stringify(paymentmethod_list)];

      const sql = `UPDATE ${this.tableName} SET ${colSet} = ? WHERE email = ?`;
      const { affectedRows } = (await query(sql, [...values, email])) as any;

      if (affectedRows) {
        user.paymentmethod_list = paymentmethod_list;
        delete user.password;

        return user;
      }
    } catch (error) {
      console.log('[deletePaymentMethod] error: ', error);
      throw new Error(error.message);
    }
  }

  async addAddress(addressInput: any, email: string) {
    try {
      const { valid, errors } = validateAddressInput(addressInput);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await this.getUser({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: { email: 'User not found' },
        });
      }

      addressInput.id = uuidv4();
      addressInput.user_id = user.user_id;

      const address_list = user.address_list;
      address_list.push(addressInput);

      const colSet = 'address_list';
      const values = [JSON.stringify(addressInput)];

      const sql = `UPDATE ${this.tableName} SET ${colSet} = ? WHERE email = ?`;
      const { affectedRows } = (await query(sql, [...values, email])) as any;

      if (affectedRows) {
        user.address_list = address_list;
        delete user.password;

        return user;
      }
    } catch (error) {
      console.log('[addAddress] error: ', error);
      throw new Error(error.message);
    }
  }

  async updateAddress(addressInput: any, id: string, email: string) {
    try {
      const { valid, errors } = validateAddressInput(addressInput);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await this.getUser({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: { email: 'User not found' },
        });
      }

      const address_list = user.address_list;
      const index = address_list.findIndex((item: any) => item.id === id);

      if (index === -1) {
        throw new UserInputError('Address not found', {
          errors: { id: 'Address not found' },
        });
      }

      address_list[index] = { id, user_id: user.id, ...addressInput };

      const colSet = 'address_list';
      const values = [JSON.stringify(address_list)];

      const sql = `UPDATE ${this.tableName} SET ${colSet} = ? WHERE email = ?`;
      const { affectedRows } = (await query(sql, [...values, email])) as any;

      if (affectedRows) {
        user.address_list = address_list;
        delete user.password;

        return user;
      }
    } catch (error) {
      console.log('[editAddress] error: ', error);
      throw new Error(error.message);
    }
  }

  async deleteAddress(id: string, email: string) {
    try {
      const user = await this.getUser({ email });

      if (!user) {
        throw new UserInputError('User not found', {
          errors: { email: 'User not found' },
        });
      }

      const address_list = user.address_list;
      const index = address_list.findIndex((item: any) => item.id === id);

      if (index === -1) {
        throw new UserInputError('Address not found', {
          errors: { id: 'Address not found' },
        });
      }

      address_list.splice(index, 1);

      const colSet = 'address_list';
      const values = [JSON.stringify(address_list)];

      const sql = `UPDATE ${this.tableName} SET ${colSet} = ? WHERE email = ?`;
      const { affectedRows } = (await query(sql, [...values, email])) as any;

      if (affectedRows) {
        user.address_list = address_list;
        delete user.password;

        return user;
      }
    } catch (error) {
      console.log('[deleteAddress] error: ', error);
      throw new Error(error.message);
    }
  }
}

export default new UserService();
