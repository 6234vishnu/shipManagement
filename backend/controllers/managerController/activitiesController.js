import Movies from "../../models/movieBooking.js";
import Fitness from "../../models/fitnessCenterBooking.js";
import PartyHall from "../../models/partyHallBooking.js";

export const managerDashboardData = async (req, res) => {
  try {
    const findMovieBookings = Movies.find().populate("voyager");
    const findFitnessBookings = Fitness.find().populate("voyager");
    const findPartyHallBookings = PartyHall.find().populate("voyager");

    const [movies, fitness, partyHall] = await Promise.all([
      findMovieBookings,
      findFitnessBookings,
      findPartyHallBookings,
    ]);

    return res
      .status(200)
      .json({ success: true, items: { movies, fitness, partyHall } });
  } catch (error) {
    console.log("error in managerDashboardData", error);

    return res
      .status(500)
      .json({ success: true, message: "server error try later" });
  }
};

export const managerUpdateBookingsStatus = async (req, res) => {
  try {
    const { id, newStatus } = req.body;

    const movie = await Movies.findById(id);
    if (movie) {
      const updated = await Movies.findByIdAndUpdate(
        id,
        { $set: { status: newStatus } },
        { new: true }
      );
      if (!updated) {
        return res
          .status(500)
          .json({
            success: false,
            message: "Couldn't update movie booking status. Try again later.",
          });
      }
      return res
        .status(200)
        .json({
          success: true,
          message: "Movie booking status updated successfully.",
        });
    }

    const fitness = await Fitness.findById(id);
    if (fitness) {
      const updated = await Fitness.findByIdAndUpdate(
        id,
        { $set: { status: newStatus } },
        { new: true }
      );
      if (!updated) {
        return res
          .status(500)
          .json({
            success: false,
            message: "Couldn't update fitness booking status. Try again later.",
          });
      }
      return res
        .status(200)
        .json({
          success: true,
          message: "Fitness booking status updated successfully.",
        });
    }

    const party = await PartyHall.findById(id);
    if (party) {
      const updated = await PartyHall.findByIdAndUpdate(
        id,
        { $set: { status: newStatus } },
        { new: true }
      );
      if (!updated) {
        return res
          .status(500)
          .json({
            success: false,
            message:
              "Couldn't update party hall booking status. Try again later.",
          });
      }
      return res
        .status(200)
        .json({
          success: true,
          message: "Party hall booking status updated successfully.",
        });
    }

    return res
      .status(404)
      .json({
        success: false,
        message: "No booking found with the provided ID.",
      });
  } catch (error) {
    console.error("Error in managerUpdateBookingsStatus:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error, try again later." });
  }
};
