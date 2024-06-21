import { BadRequestError } from "../errors/BadRequestError";
import brandModel from "../models/brand.model";
import memberModel from "../models/member.model";
import watchModel from "../models/watch.model";
import { verifyToken } from "../utils/jwt";

export class HomeController {
  static async homePage(req, res, next) {
    const user = res.locals.user;
    const { brand, search } = req.query;

    let query = {};

    if (search) {
      query["name"] = { $regex: search, $options: "i" }; // 'i' makes it case-insensitive
    }

    if (brand && brand.length > 0) {
      query["brand"] = { $in: brand };
    }

    try {
      const watches = await watchModel.find(query).populate("brand").lean();
      const newWatches = watches.map((watch) => ({
        ...watch,
        _id: watch._id.toString(),
        brand: {
          ...watch.brand,
          _id: watch.brand._id.toString(),
        },
      }));
      const brands = await brandModel.find({}).lean();
      const newBrands = brands.map((brand) => ({
        ...brand,
        _id: brand._id.toString(),
      }));

      res.render("./home", {
        watches: newWatches,
        user,
        brands: newBrands,
        query: req.query,
      });
    } catch (err) {
      next(new BadRequestError(err.message));
    }
  }
  static async watchDetailPage(req, res, next) {
    const { action } = req.query;

    const { _id } = req.params;
    const { accessToken } = req.cookies;
    let user = null;
    if (!accessToken) {
      user = null;
    } else {
      const { error, payload } = verifyToken(accessToken);
      if (error) {
        user = null;
      } else {
        if (payload && payload.userId) {
          user = await memberModel.findById(payload.userId);
        }
      }
    }
    try {
      const watch = await watchModel
        .findById(_id)
        .populate("brand")
        .populate("comments.author")
        .lean();
      const newWatch = {
        ...watch,
        _id: watch._id.toString(),
        brand: {
          ...watch.brand,
          _id: watch.brand._id.toString(),
        },
      };

      const comments = newWatch.comments.map((comment) => ({
        ...comment,
        _id: comment._id.toString(),
      }));
      if (!user)
        return res.render("./watchDetail", {
          watch: newWatch,
          otherComments: comments,
          userComment: null,
        });
      const userComment = comments.find(
        (cm) => cm.author._id.toString() === user._id.toString()
      );
      const otherComments = comments.filter(
        (cm) => cm.author._id.toString() !== user._id.toString()
      );
      console.log(userComment);

      res.render("./watchDetail", {
        edit: action === "edit" ? true : false,
        watch: newWatch,
        userComment,
        otherComments,
      });
    } catch (err) {
      next(new BadRequestError(err.message));
    }
  }
}
