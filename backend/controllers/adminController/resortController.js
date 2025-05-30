import Item from "../../models/item.js";

export const createResortListItem = async (req, res) => {

  
  try {
    const { name, price,totalRooms } = req.body;
    if (!name || !price ||!totalRooms)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const newItem = new Item({
      name,
      category: "Stays",
      type: "resort",
      totalSlots:Number(totalRooms),
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
    console.log("error in admin createResortListItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const getResortListItem = async (req, res) => {
  try {
    const findItem = await Item.find({ type: "resort" });
    if (!findItem)
      return res
        .status(500)
        .json({ success: true, message: "No resort items exists" });
    return res.status(200).json({
      success: true,
      ResortList: findItem,
    });
  } catch (error) {
    console.log("error in admin getResortListItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const editResortListItem = async (req, res) => {
  
  try {

    const { itemId } = req.query;
    const { name, price, available,totalRooms } = req.body;
    if (!itemId || !name || !price||!totalRooms || available === undefined)
      return res.status(400).json({
        success: false,
        message: "Fill all the fields before submission",
      });

    const findItem = await Item.findByIdAndUpdate(
      itemId,
      { $set: { name, price, available,totalSlots:totalRooms } },
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
    console.log("error in admin editResortListItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const deleteResortListItem = async (req, res) => {
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
    console.log("error in admin deleteResortListItem", error);

    return res
      .status(500)
      .json({ success: false, message: "server error try later" });
  }
};
