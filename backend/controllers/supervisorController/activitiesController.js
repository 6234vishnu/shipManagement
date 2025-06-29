import StatonaryOrders from "../../models/statinaryOrder.js";

export const superviorStationaryList = async (req, res) => {
  try {
    const getStationaryOrders = await StatonaryOrders.find().populate(
      "voyager"
    );
    if (!getStationaryOrders)
      return res
        .status(400)
        .json({ success: false, message: "couldint find any orders" });
    return res.status(200).json({ success: true, orders: getStationaryOrders });
  } catch (error) {
    console.log("error in superviorStationaryList supervisorSide", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};

export const updateDeliveryStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const findCateringItem = await StatonaryOrders.findByIdAndUpdate(
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
    console.log("error in updateDeliveryStatus supervisor side", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error try later" });
  }
};
