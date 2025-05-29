import Item from "../../models/item.js";

export const createStationaryListItem = async (req, res) => {

  
  try {
    const { name, price,quantity } = req.body;
    if (!name || !price ||!quantity)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const newItem = new Item({
      name,
      category: "Fancy",
      type: "stationary",
      quantity,
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
    console.log("error in admin createStationaryListItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const getStationaryListItem = async (req, res) => {
  try {
    const findItem = await Item.find({ type: "stationary" });
    if (!findItem)
      return res
        .status(500)
        .json({ success: true, message: "No stationary items exists" });
    return res.status(200).json({
      success: true,
      StationaryList: findItem,
    });
  } catch (error) {
    console.log("error in admin getStationaryListItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const editStationaryListItem = async (req, res) => {
  
  try {

    const { itemId } = req.query;
    const { name, price, available,quantity } = req.body;
    if (!itemId || !name || !price||!quantity || available === undefined)
      return res.status(400).json({
        success: false,
        message: "Fill all the fields before submission",
      });

    const findItem = await Item.findByIdAndUpdate(
      itemId,
      { $set: { name, price, available,quantity } },
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
    console.log("error in admin editStationaryListItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const deleteStationaryListItem = async (req, res) => {
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
    console.log("error in admin deleteStationaryListItem", error);

    return res
      .status(500)
      .json({ success: false, message: "server error try later" });
  }
};
