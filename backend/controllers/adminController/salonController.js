import Item from "../../models/item.js";

export const createBeautySalonItem = async (req, res) => {
  try {
    const { name, price, totalSlots } = req.body;

    if (!name || !price || !totalSlots) {
      return res.status(400).json({
        success: false,
        message: "Fill all the fields before submission",
      });
    }

    const newItem = new Item({
      name,
      category: "Services",
      type: "beautySalon",
      totalSlots,
      price,
    });

    const saveItem = await newItem.save();

    if (!saveItem) {
      return res
        .status(500)
        .json({ success: false, message: "Server error, try again later" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Item saved successfully" });
  } catch (error) {
    console.log("error in admin createBeautySalonItem", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
  }
};

// Get All Beauty Salon Items
export const getBeautySalonItem = async (req, res) => {
  try {
    const findItem = await Item.find({ type: "beautySalon", available: true });

    if (!findItem) {
      return res
        .status(404)
        .json({ success: false, message: "No Beauty Salon items exist" });
    }

    return res.status(200).json({
      success: true,
      message: "Items fetched successfully",
      beautySalonList: findItem,
    });
  } catch (error) {
    console.log("error in admin getBeautySalonItem", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
  }
};

// Edit Beauty Salon Item
export const editBeautySalonItem = async (req, res) => {
  try {
    const { itemId } = req.query;
    const { name, price, available, totalSlots } = req.body;

    if (!itemId || !name || !price || !totalSlots || available === undefined) {
      return res.status(400).json({
        success: false,
        message: "Fill all the fields before submission",
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $set: { name, price, available, totalSlots } },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(500).json({
        success: false,
        message: "Couldn't edit item, try again later",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item edited successfully",
    });
  } catch (error) {
    console.log("error in admin editBeautySalonItem", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
  }
};

// Delete Beauty Salon Item
export const deleteBeautySalonItem = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Could not find item",
      });
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(500).json({
        success: false,
        message: "Couldn't delete item, try again later",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.log("error in admin deleteBeautySalonItem", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error, try again later" });
  }
};
