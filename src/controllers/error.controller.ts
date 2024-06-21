export class Error {
  static forbiddenErrorPage(req, res) {
    return res.render("./401");
  }
}
