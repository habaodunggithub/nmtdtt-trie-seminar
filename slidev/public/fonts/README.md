# Phông chữ tiếng Việt

Các tệp phông được đóng gói cùng slide, không phụ thuộc phông cài trên máy:

- `Baloo2.ttf`: tiêu đề, weight 400–800.
- `Nunito.ttf`: nội dung, bảng, nhãn SVG, weight 200–1000.
- `NotoSansMono.ttf`: code và chuỗi monospace, weight 100–900.

Nguồn: Google Fonts, giấy phép SIL Open Font License đi kèm từng phông.

Đã kiểm tra charset thực của cả ba tệp: đủ 154 ký tự gồm các nguyên âm tiếng
Việt ở sáu thanh, chữ hoa / thường, đ / Đ và các dấu tổ hợp NFD. Mẫu tiếng Việt
NFC và NFD được kiểm tra trên Chromium: từng phông được tải từ dự án và dùng
trực tiếp để dựng chữ, không rơi về phông hệ thống trong mẫu kiểm tra.

Các công thức toán sử dụng bộ KaTeX được Slidev đóng gói riêng.
