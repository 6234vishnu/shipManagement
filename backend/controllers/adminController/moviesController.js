import Item from "../../models/item.js";

export const createMoviesCenterItem = async (req, res) => {

  
  try {
    const { name, price } = req.body;
    if (!name || !price)
      return res.status(400).json({
        success: false,
        message: "fill all the feilds before submission",
      });

    const newItem = new Item({
      name,
      category: "Entertainment",
      type: "Movies",
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
    console.log("error in admin moviesCenterItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const getMoviesCenterItem = async (req, res) => {
  try {
    const findItem = await Item.find({ type: "Movies" });
    if (!findItem)
      return res
        .status(500)
        .json({ success: true, message: "No movies items exists" });
    return res.status(200).json({
      success: true,
      message: "Item saved successFully",
      MoviesList: findItem,
    });
  } catch (error) {
    console.log("error in admin getMoviesCenterItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const editMoviesCenterItem = async (req, res) => {
  
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
    console.log("error in admin editMoviesCenterItem", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const deleteMoviesCenterItem = async (req, res) => {
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
    console.log("error in admin deleteMoviesCenterItem", error);

    return res
      .status(500)
      .json({ success: false, message: "server error try later" });
  }
};
