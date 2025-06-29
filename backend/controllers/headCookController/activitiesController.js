import CateringOrders from "../../models/cateringOrder.js";

export const CateringOrdersLists = async (req, res) => {
  try {
    const getCateringOrders = await CateringOrders.find().populate("voyager");
    if (!getCateringOrders)
      return res
        .status(400)
        .json({ success: false, message: "couldint find any orders" });
    return res.status(200).json({ success: true, orders: getCateringOrders });
  } catch (error) {
    console.log("error in getCateringOrders headCookSide", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const findCateringItem = await CateringOrders.findByIdAndUpdate(
      orderId,
      {
        $set: { status: "Delivered" },
      },
      { new: true }
    );
    if (!findCateringItem)
      return res
        .status(400)
        .json({ success: false, message: "Couldint update status try later" });
    return res
      .status(200)
      .json({ success: true, message: "Status Updated SuccessFully" });
  } catch (error) {
    console.log("error in updateDeliveryStatus headCookSide", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};
