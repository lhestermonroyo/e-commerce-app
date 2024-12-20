export default {
  Query: {
    async getProducts(_: any, __: any, ctx: any) {
      try {
        const products = await ProductService.getProducts();
        return products;
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    
  },
};
