/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *         - categoryId
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated product ID
 *         name:
 *           type: string
 *           description: Product name
 *         description:
 *           type: string
 *           description: Product description
 *         price:
 *           type: number
 *           format: float
 *           description: Product price
 *         stock:
 *           type: integer
 *           description: Available stock quantity
 *         categoryId:
 *           type: integer
 *           description: Category ID
 *         imageUrl:
 *           type: string
 *           description: Cloudinary image URL
 */

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("Product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: "categoryId" });
    Product.hasMany(models.Cart, { foreignKey: "productId" });
    Product.hasMany(models.OrderItem, { foreignKey: "productId" });
  };

  return Product;
};
