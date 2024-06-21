import { BadRequestError } from "../errors/BadRequestError";
import brandModel from "../models/brand.model";
import memberModel from "../models/member.model";
import watchModel from "../models/watch.model";

export class DashboardController {
  static async brandsPage(req, res, next) {
    try {
      const brands = await brandModel.find({}).lean();
      const newBrands = brands.map((brand) => ({
        ...brand,
        _id: brand._id.toString(),
      }));
      console.log(newBrands, "LL");

      res.render("./auth/dashboard/brands", { brands: newBrands });
    } catch (err) {
      next(new BadRequestError(err.message));
    }
  }
  static async usersPage(req, res, next) {
    try {
      const members = await memberModel.find({}).lean();
      console.log(members);

      const newMembers = members.map((member) => ({
        ...member,
        _id: member._id.toString(),
      }));

      res.render("./auth/dashboard/users", { members: newMembers });
    } catch (err) {
      next(new BadRequestError(err.message));
    }
  }
  static async addBrand(req, res, next) {
    try {
      const result = await brandModel.create({ brandName: req.body.brandName });
      res.redirect("/auth/dashboard/brands");
    } catch (err) {
      next(err);
    }
  }
  static async putBrand(req, res, next) {
    const { _id } = req.params;
    console.log(_id, "id");

    try {
      const result = await brandModel.findById(_id);
      if (!result) throw new BadRequestError("Brand not found");
      result.brandName = req.body.brandName;
      await result.save();
      res.redirect("/auth/dashboard/brands");
    } catch (err) {
      next(err);
    }
  }
  static async deleteBrand(req, res, next) {
    const { _id } = req.params;
    try {
      const result = await brandModel.findById(_id);
      if (!result) throw new BadRequestError("Brand not found");
      const watches = await watchModel.findOne({
        brand: _id,
      });
      console.log(watches, "watches");

      if (watches) {
        const brands = await brandModel.find({}).lean();
        const newBrands = brands.map((brand) => ({
          ...brand,
          _id: brand._id.toString(),
        }));

        return res.render("./auth/dashboard/brands", {
          brands: newBrands,
          errorMessage:
            "Brand has watches, can't delete brand!: " +
            watches.toObject().name,
        });
      }
      await brandModel.deleteOne({ _id: _id });
      return res.redirect("/auth/dashboard/brands");
    } catch (err) {
      next(err);
    }
  }
  static async watchesPage(req, res, next) {
    try {
      const watches = await watchModel.find({}).populate("brand").lean();
      const brands = await brandModel.find({}).lean();
      const newBrands = brands.map((brand) => ({
        ...brand,
        _id: brand._id.toString(),
      }));

      const newWatches = watches.map((watch) => ({
        ...watch,
        _id: watch._id.toString(),
        brand: {
          ...watch.brand,
          _id: watch.brand._id.toString(),
        },
      }));

      console.log(newWatches, "LL");

      res.render("./auth/dashboard/watches", {
        watches: newWatches,
        brands: newBrands,
      });
    } catch (err) {
      console.log(err, "err");

      next(new BadRequestError(err.message));
    }
  }
  static async addWatch(req, res, next) {
    try {
      console.log(req.body, "body");

      const result = await watchModel.create({
        ...req.body,
        automatic: req.body.automatic === "on" ? true : false,
      });

      res.redirect("/auth/dashboard/watches");
    } catch (err) {
      next(err);
    }
  }
  static async putWatch(req, res, next) {
    const { _id } = req.params;
    console.log(_id, "id");

    try {
      const result = await watchModel.findById(_id);
      if (!result) throw new BadRequestError("Watch not found");

      Object.assign(result, {
        ...req.body,
        automatic: req.body.automatic === "on" ? true : false,
      });
      console.log(result, "result", req.body, "body");

      await result.save();
      res.redirect("/auth/dashboard/watches");
    } catch (err) {
      next(err);
    }
  }
  static async deleteWatch(req, res, next) {
    const { _id } = req.params;
    console.log(_id, "id");
    try {
      const result = await watchModel.findById(_id);
      if (!result) throw new BadRequestError("Watch not found");
      await watchModel.deleteOne({ _id: _id });
      res.redirect("/auth/dashboard/watches");
    } catch (err) {
      next(err);
    }
  }
}
