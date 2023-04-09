export const rules = {
  name: [{ required: true, message: "Tên sản phẩm không được bỏ trống" }],
  content: [
    {
      required: true,
      message: "Nội dung chi tiết sản phẩm không được bỏ trống",
    },
  ],
  price: [{ required: true, message: "Giá sản phẩm không được bỏ trống" }],
  state: [
    { required: true, message: "Trạng thái sản phẩm không được bỏ trống" },
  ],
  sapo: [
    { required: true, message: "Mô tả ngắn sản phẩm không được bỏ trống" },
  ],
};
