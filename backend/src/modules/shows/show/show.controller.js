import { HTTP_STATUS } from "../../../constants/httpStatus.js"
import { createShowService, deleteShowService, getShowByIdService, getShowsByMovieService } from "./show.service.js"

export const createShow = async (req, res, next) => {

  try {
    console.log(req.body);

    const show = await createShowService(req.body)

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: "Show created successfully",
      show
    })
  } catch (error) {
    next(error)
  }
}

export const getShowById = async (req, res, next) => {
  try {
    const show = await getShowByIdService(req.params.id)
    res.json({
      success: true,
      data: show
    })
  } catch (error) {
    next(error)
  }
}

export const getShowsByMovie = async (req, res, next) => {
  try {
    const shows = await getShowsByMovieService(req.params.id);
    res.json({ success: true, data: shows });
  } catch (err) {
    next(err);
  }
};

export const deleteShow = async (req, res, next) => {
  try {
    await deleteShowService(req.params.id);
    res.json({
      success: true,
      message: "Show deleted  successfully"
    });
  } catch (err) {
    next(err);
  }
};