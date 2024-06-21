export enum errorTypeEnum {
  VALIDATION = 'Validation', // redirect trang hiện tại
  AUTHENTICATED = 'Authenticated', // lỗi này khi vào trang cần đăng nhập thì redirect về login page
  UNAUTHORIZED = 'Unauthorized', // lỗi này redirect về trang 401
  BAD_REQUEST = 'Bad Request', // lỗi ví dụ như email k tồn tại, user not found..., redirect trang hiện tại
  NOT_FOUND = 'Not Found', // lỗi k tìm thấy url
}