import Item from "../../models/item.js";


export const createCateringItem = async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const newItem = new Item({
      name,
      category: "Food",
      type: "catering",
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
    console.log("error in admin createCateringItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const getCateringItem = async (req, res) => {
  try {
    const findItem = await Item.find({ type: "catering" });
    if (!findItem)
      return res
        .status(500)
        .json({ success: true, message: "No Catering items exists" });
    return res.status(200).json({
      success: true,
      message: "Item saved successFully",
      cateringItems: findItem,
    });
  } catch (error) {
    console.log("error in admin getCateringItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const editCateringItem = async (req, res) => {
  
  try {

    const { itemId } = req.query;
    const { name, price, available } = req.body;
    if (!itemId || !name || !price || available === undefined)
      return res.status(400).json({
        success: false,
        message: "Fill all the fields before submission",
      });

    const findItem = await Item.findByIdAndUpdate(
      itemId,
      { $set: { name, price, available } },
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

export const deleteCateringItem = async (req, res) => {
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
