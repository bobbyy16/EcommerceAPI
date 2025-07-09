/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - totalAmount
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated order ID
 *         userId:
 *           type: integer
 *           description: User ID
 *         totalAmount:
 *           type: number
 *           format: float
 *           description: Total order amount
 *         status:
 *           type: string
 *           enum: [pending, processing, shipped, delivered, cancelled]
 *           description: Order status
 */

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Order", {
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
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled"
      ),
      defaultValue: "pending",
    },
  });

  Order.associate = (models) => {
    Order.belongsTo(models.User, { foreignKey: "userId" });
    Order.hasMany(models.OrderItem, { foreignKey: "orderId" });
  };

  return Order;
};
