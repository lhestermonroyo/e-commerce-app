import query from '../lib/db';
import { formatColSet } from '../utils/common.util';

class ProductService {
  private tableName: string;

  constructor() {
    this.tableName = 'product';
  }

  async getProducts(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `SELECT * FROM ${this.tableName} WHERE ${colSet}`;

      const res = await query(sql, [...values]);
      return res[0] as any;
    } catch (error) {
      console.log('[getProducts] error: ', error);
      throw new Error(error.message);
    }
  }

  async createProduct(params: any) {
    try {
      const { colSet, values } = formatColSet(params);

      const sql = `INSERT INTO ${this.tableName} SET ${colSet}`;

      const res = await query(sql, [...values]);
      return res;
    } catch (error) {
      console.log('[createProduct] error: ', error);
      throw new Error(error.message);
    }
  }
}

export default new ProductService();
