# Trie — Cây tiền tố

63 slide tiếng Việt (1 trang chủ đề + 1 trang sườn + 8 trang đề mục + 53 trang nội dung) cho seminar Nhập môn tư duy thuật toán, dựa trên
[`NMTDTT-Nội-Dung-Slide-Trie.md`](../NMTDTT-Nội-Dung-Slide-Trie.md).

Bố cục đơn giản, chữ ngắn gọn, sơ đồ cây node tròn và cạnh có mũi tên.
Mỗi trang nội dung tập trung vào một ý nhỏ; câu hỏi và lời giải được trình bày ở các trang riêng.
Các nội dung dài được giữ trong ghi chú người thuyết trình.
Bảng ánh xạ 27 slide nguồn sang các trang đã tách: [CONTENT-AUDIT.md](./CONTENT-AUDIT.md).
Node đang xét được tô đen; cạnh và đầu mũi tên giữ cùng kích thước.

## Chạy trình chiếu

```bash
cd slidev
npm install
npm run dev
```

Mở http://localhost:3030. Dùng mũi tên / Space để chuyển slide;
phím `p` mở chế độ Presenter để xem ghi chú.

Bản trình chiếu dùng tone trắng đen cố định.

16 trang có nút **Chạy thử**: trang bìa tìm MSSV và các trang trực tiếp giải thích thao tác / thuật toán.
Các thao tác chạy 1 giây/bước; riêng định tuyến và tìm MSSV chạy 0,45 giây/bước. Khi tìm thấy MSSV, dừng 1,8 giây để đọc tên.
Các hình giới thiệu, so sánh và minh họa lặp lại giữ dạng tĩnh.
Trang 23 có demo riêng đối chiếu cận tính toán với số node thực tế.
Trang 55 liệt kê 24 tuyến; trang 56 chạy Binary Trie đủ từng bit, có thể chọn IP, bấm Bước tiếp, kéo sơ đồ và trở lại Theo node.
Bấm **Dừng** để tạm dừng, **Tiếp tục** để chạy tiếp, **Chạy lại** để bắt đầu từ dữ liệu ban đầu.
Chuyển sang slide khác sẽ dừng và đặt lại demo.

| Demo | Trang |
|---|---|
| Tìm 4 MSSV, hiện mã và tên thành viên | 1 |
| Chèn / kiểm tra tiền tố / tìm từ / xóa | 13, 15, 16, 17 |
| Tính cận và đếm node thực tế | 23 |
| Đếm node theo từng tầng | 24 |
| Đếm tiền tố / cập nhật bộ đếm | 43, 44 |
| Liệt kê / tìm từ thứ k / LCP | 45, 46, 47 |
| XOR / Aho–Corasick | 49, 51 |
| Binary Trie chọn tuyến mạng / nén đường | 56, 58 |

## Nội dung và hình ảnh

- `slides.md`: nội dung và ghi chú của 63 slide.
- `styles/index.css`: bố cục, phông và phong cách chung.
- `components/TrieDiagram.vue`: cây Trie SVG tạo từ danh sách từ.
- `components/StudentTrieCover.vue`: trang bìa với Trie MSSV và danh sách thành viên hiện sau khi tìm thấy.
- `lib/student-trie.ts`: dữ liệu thành viên và các bước tra cứu chính xác.
- `components/TrieRun.vue`: nút chạy/dừng và trình diễn từng bước trên cây.
- `components/BinaryRoutingDemo.vue`: Binary Trie định tuyến đầy đủ, khung nhìn theo node và 32 bit IP.
- `components/RoutingDataset.vue`: bảng 24 tuyến cùng tiền tố nhị phân.
- `components/TrieDemo.vue`: giữ cách dùng Insert / Search / Delete đã có, thông qua `TrieRun`.
- `lib/trie-demo.ts`: tính các bước từ thuật toán và dữ liệu ví dụ.
- `lib/trie-demo.test.ts`: kiểm tra kết quả bằng tìm kiếm vét cạn, sắp xếp và các ca biên.
- `components/TreeSketch.vue`: cây node tròn trắng viền đen, mũi tên cha → con,
  vòng kép đánh dấu kết thúc từ.
- `components/ConceptSketch.vue`: bộ nhớ node, số node theo tầng, từ thứ k,
  router, cấu trúc tìm kiếm, cây con tiền tố và nén đường đi.
- `public/fonts/`: Baloo 2, Nunito và Noto Sans Mono, kèm giấy phép SIL Open Font License.

Sơ đồ và phông nằm trong dự án; trình chiếu không cần tải chúng từ mạng.

## Build và xuất

```bash
npm run build
npm run test:demo
npm run export
```

Build web tĩnh ở `dist/`. Xuất PDF cần Playwright/Chromium tương thích.
Nút tương tác hoạt động trong bản web; PDF chỉ hiển thị trạng thái ban đầu.
