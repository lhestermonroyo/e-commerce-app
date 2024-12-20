import { checkAuth } from '../utils/auth.util';
import UserService from './user.service';

export default {
  Query: {
    async getProfile(_: any, __: any, ctx: any) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('Unauthorized');
        }

        const profile = await UserService.getUser({ email: user.email });

        return profile;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    async signUp(_: any, { userInput }: any) {
      try {
        const res = await UserService.signUp(userInput);
        return res;
      } catch (error) {
        throw error;
      }
    },
    async signIn(_: any, { email, password }: any) {
      try {
        const res = await UserService.signIn(email, password);
        return res;
      } catch (error) {
        throw error;
      }
    },
    async updateProfile(_: any, { userInput }: any, ctx: any) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('Unauthorized');
        }

        const res = await UserService.updateProfile(userInput, user.email);
        return res;
      } catch (error) {
        throw error;
      }
    },
    async addPaymentMethod(_: any, { paymentMethodInput }: any, ctx: any) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('Unauthorized');
        }

        const res = await UserService.addPaymentMethod(
          paymentMethodInput,
          user.email
        );
        return res;
      } catch (error) {
        throw error;
      }
    },
    async updatePaymentMethod(
      _: any,
      { paymentMethodInput, id }: any,
      ctx: any
    ) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('Unauthorized');
        }

        const res = await UserService.updatePaymentMethod(
          paymentMethodInput,
          id,
          user.email
        );
        return res;
      } catch (error) {
        throw error;
      }
    },
    async deletePaymentMethod(_: any, { id }: any, ctx: any) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('Unauthorized');
        }

        const res = await UserService.deletePaymentMethod(id, user.email);
        return res;
      } catch (error) {
        throw error;
      }
    },
    async addAddress(_: any, { addressInput }: any, ctx: any) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('Unauthorized');
        }

        const res = await UserService.addAddress(addressInput, user.email);
        return res;
      } catch (error) {
        throw error;
      }
    },
    async updateAddress(_: any, { addressInput, id }: any, ctx: any) {
      try {
        const user = checkAuth(ctx);

        if (!user) {
          throw new Error('Unauthorized');
        }

        const res = await UserService.updateAddress(
          addressInput,
          id,
          user.email
        );
        return res;
      } catch (error) {
        throw error;
      }
    },
  },
};
