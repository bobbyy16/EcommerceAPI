/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - orderId
 *         - productId
 *         - quantity
 *         - priceAtTime
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated order item ID
 *         orderId:
 *           type: integer
 *           description: Order ID
 *         productId:
 *           type: integer
 *           description: Product ID
 *         quantity:
 *           type: integer
 *           description: Quantity ordered
 *         priceAtTime:
 *           type: number
 *           format: float
 *           description: Price at time of order
 */

module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Orders",
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
      validate: {
        min: 1,
      },
    },
    priceAtTime: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Price at time of order (persistent pricing)",
    },
  });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: "orderId" });
    OrderItem.belongsTo(models.Product, { foreignKey: "productId" });
  };

  return OrderItem;
};
