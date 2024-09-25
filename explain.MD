# Link db: https://dbdiagram.io/d/66f398be3430cb846c876073
# Bảng users

Mục đích: Lưu trữ thông tin của tất cả người dùng trong hệ thống, bao gồm cả chủ nhà và người thuê.

Các trường chính:
- id: Khóa chính, định danh duy nhất cho mỗi người dùng.
- name: Tên đầy đủ của người dùng.
- phone_number: Số điện thoại liên lạc.
- avatar: URL hoặc đường dẫn đến ảnh đại diện.
- date_of_birth: Ngày sinh của người dùng.
- gender: Giới tính (0: nam, 1: nữ).
- hometown, city, district, address: Thông tin địa chỉ chi tiết.
- facebook, telegram: Thông tin liên lạc qua mạng xã hội.
- role: Vai trò của người dùng (0: người thuê, 1: chủ nhà, 2: cả hai).

Ý nghĩa:
- Trường `role` cho phép phân biệt và quản lý quyền hạn của người dùng.
- Cung cấp đầy đủ thông tin cá nhân để hỗ trợ quá trình cho thuê và quản lý.

# Bảng houses

Lưu trữ thông tin về các căn nhà/chung cư cho thuê.
Bao gồm thông tin như loại nhà, địa chỉ, diện tích, giá cả, số phòng.
Trường owner_id liên kết với bảng users để xác định chủ nhà.
Trạng thái cho biết nhà đang trống, đã cho thuê hay đã xóa.

# Bảng rooms:

Chứa thông tin chi tiết về các phòng trong nhà cho thuê theo phòng.
Liên kết với bảng houses qua house_id.
Bao gồm thông tin về giá, diện tích, trạng thái của từng phòng.


# Bảng posts:

Lưu trữ thông tin về các bài đăng cho thuê nhà/phòng.
Liên kết với users (người đăng), houses, và rooms.
Cho phép đăng cả nhà nguyên căn hoặc phòng riêng lẻ.


# Bảng requests:

Quản lý các yêu cầu thuê nhà/phòng từ người dùng.
Liên kết với posts và users để theo dõi ai yêu cầu thuê bài đăng nào.


# Bảng saved_posts:

Lưu trữ các bài đăng mà người dùng đã lưu để xem lại sau.
Giúp người dùng dễ dàng theo dõi các bài đăng họ quan tâm.


# Bảng notifications:

Quản lý thông báo cho người dùng.
Có thể liên quan đến bài đăng, yêu cầu thuê, hoặc thông báo hệ thống.


# Bảng services:

Lưu trữ thông tin về các dịch vụ đi kèm (điện, nước, internet, v.v.).
Có thể áp dụng cho cả nhà và phòng riêng lẻ.


# Bảng service_usage:

Theo dõi việc sử dụng dịch vụ hàng tháng.
Tính toán chi phí dịch vụ dựa trên mức sử dụng.


# Bảng rentals:

Quản lý thông tin về các hợp đồng thuê nhà/phòng.
Liên kết người thuê với nhà/phòng cụ thể.
Theo dõi thời gian bắt đầu và kết thúc thuê.


# Bảng bills:

Lưu trữ thông tin hóa đơn hàng tháng.
Bao gồm tiền thuê, chi phí dịch vụ, và các khoản phụ thu/giảm giá.
Theo dõi trạng thái thanh toán của hóa đơn.


# Bảng invoices:

Quản lý các giao dịch tài chính cụ thể.
Có thể là biên lai thu tiền hoặc chứng từ chi tiền.
Liên kết với nhà/phòng và người dùng liên quan.