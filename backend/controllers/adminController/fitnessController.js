import Item from "../../models/item.js";

export const createfitnessCenterItem = async (req, res) => {
  try {
    const { name, price, totalSlots, equipment } = req.body;
    if (!name || !price || !totalSlots || !equipment)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const newItem = new Item({
      name,
      category: "Fitness",
      type: "Gym",
      totalSlots,
      equipment,
      price,
    });

    const saveItem = await newItem.save();

    if (!saveItem)
      return res
        .status(500)
        .json({ success: false, message: "server error try later" });

    return res
      .status(200)
      .json({ success: true, message: "Item saved successFully" });
  } catch (error) {
    console.log("error in admin createfitnessCenterItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const getfitnessCenterItem = async (req, res) => {
  try {
    const findItem = await Item.find({ type: "Gym" });
    if (!findItem)
      return res
        .status(500)
        .json({ success: true, message: "No gym's exists" });
    return res.status(200).json({
      success: true,
      message: "Item saved successFully",
      fitnessCenters: findItem,
    });
  } catch (error) {
    console.log("error in admin getCateringItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const editfitnessCenterItem = async (req, res) => {
  try {
    const { itemId } = req.query;
    const { name, price, available, totalSlots } = req.body;
    if (!itemId || !name || !price || !totalSlots || available === undefined)
      return res.status(400).json({
        success: false,
        message: "Fill all the fields before submission",
      });

    const findItem = await Item.findByIdAndUpdate(
      itemId,
      { $set: { name, price, available, totalSlots } },
      { new: true }
    );
    if (!findItem)
      return res.status(500).json({
        success: false,
        message: "Couldint edit item try later",
      });

    return res.status(200).json({
      success: true,
      message: "Item Edited SuccessFully",
    });
  } catch (error) {
    console.log("error in admin editCateringItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const deletefitnessCenterItem = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Couldint find item",
      });
    const findAndDeleteItem = await Item.findByIdAndDelete(id);
    if (!findAndDeleteItem)
      return res.status(500).json({
        success: false,
        message: "Couldint delete item try later",
      });
    return res.status(200).json({
      success: true,
      message: "item Deleted successfully",
    });
  } catch (error) {
    console.log("error in admin deleteCateringItem", error);

    return res
      .status(500)
      .json({ success: false, message: "server error try later" });
  }
};
