/**
 * @swagger
 * components:
 *   schemas:
 *     Cart:
 *       type: object
 *       required:
 *         - userId
 *         - productId
 *         - quantity
 *         - priceAtTime
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated cart item ID
 *         userId:
 *           type: integer
 *           description: User ID
 *         productId:
 *           type: integer
 *           description: Product ID
 *         quantity:
 *           type: integer
 *           description: Quantity of the product
 *         priceAtTime:
 *           type: number
 *           format: float
 *           description: Price when added to cart (persistent pricing)
 */

module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define("Cart", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Products",
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    priceAtTime: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Price when item was added to cart (persistent pricing)",
    },
  });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: "userId" });
    Cart.belongsTo(models.Product, { foreignKey: "productId" });
  };

  return Cart;
};
