# Đối chiếu nội dung 27 slide

Theo yêu cầu sau lần đối chiếu, các câu dẫn dắt và ghi chú phụ trên mặt slide
được chuyển vào ghi chú thuyết trình; các định nghĩa ký hiệu cần thiết vẫn giữ.
Bảng dưới đây ghi lại nội dung đối chiếu, không phải danh sách mọi dòng hiện trên mặt slide.

Bộ trình chiếu hiện có **63 trang**: 1 trang chủ đề, 1 trang sườn,
8 trang đề mục và 53 trang nội dung. Mỗi trang nội dung tập trung vào một ý nhỏ;
code, ví dụ và sơ đồ cùng minh họa ý đó được giữ cạnh nhau.
Số slide nguồn bên dưới theo **27 slide của tài liệu gốc**, không phải số trang trình chiếu.

| Phần | Slide nguồn | Trang đề mục | Trang nội dung trong bản trình chiếu |
|---|---|---|---|
| I — Ý tưởng | 1–3 | 3 | 4–9 |
| II — Thao tác | 4–8 | 10 | 11–19 |
| III — Chi phí | 9–11 | 20 | 21–25 |
| IV — So sánh | 12–15 | 26 | 27–34 |
| V — Lựa chọn | 16–18 | 35 | 36–41 |
| VI — Mở rộng | 19–23 | 42 | 43–51 |
| VII — Ứng dụng | 24–26 | 52 | 53–58 |
| VIII — Tổng kết | 27–27 | 59 | 60–63 |

## Ánh xạ sau khi tách nội dung

Trường `sourceSlide` trong frontmatter của mỗi trang nội dung giữ liên hệ với tài liệu nguồn.
Slide 4 mới chỉ đặt câu hỏi; slide 5 trình bày cách duyệt tuyến tính.
Các nhãn đề mục vẫn chỉ ghi “PHẦN I”, “PHẦN II”, …

| Slide nguồn | Trang mới | Nội dung sau khi tách |
|---|---|---|
| 1 | 4–5 | Đặt câu hỏi; duyệt tuyến tính |
| 2 | 6–7 | Trực giác tra từ điển; biểu diễn Trie |
| 3 | 8–9 | Có đường chưa chắc có từ; endCount |
| 4 | 11–12 | Mảng hai chiều; node và con trỏ |
| 5 | 13 | Chèn từ — code và demo cùng một thao tác |
| 6 | 14–16 | Tìm node; kiểm tra tiền tố; tìm từ hoàn chỉnh |
| 7 | 17–18 | Xóa logic; nhánh còn lại sau xóa |
| 8 | 19 | Nguyên lý chung: theo một đường ký tự |
| 9 | 21–22 | Thời gian; cấp phát bộ nhớ |
| 10 | 23 | Cận node đơn giản |
| 11 | 24–25 | Cận theo tầng; ví dụ tính số |
| 12 | 27 | Khung bốn kiểu truy vấn để đối chiếu |
| 13 | 28–29 | So sánh tìm từ; so sánh kiểm tra tiền tố |
| 14 | 30–31 | Đếm; chi phí liệt kê và đầu ra |
| 15 | 32–34 | Khóa/thứ tự; dữ liệu tĩnh; tiền tố kèm cập nhật |
| 16 | 36–37 | Gom nhóm theo tiền tố; thống kê trên node |
| 17 | 38–40 | Nhánh thưa; bảng chữ cái lớn; tiền tố khác chuỗi con |
| 18 | 41 | Checklist nhận diện bài toán phù hợp |
| 19 | 43–44 | Đọc passCount; duy trì khi chèn/xóa |
| 20 | 45–46 | Thứ tự từ điển; bỏ qua nhánh tìm từ thứ k |
| 21 | 47 | Tiền tố chung dài nhất |
| 22 | 48–49 | Biểu diễn số bằng bit; greedy XOR |
| 23 | 50–51 | Bài toán nhiều mẫu; failure link và đầu ra |
| 24 | 53–54 | Lấy gợi ý theo tiền tố; xếp hạng |
| 25 | 55–56 | 24 tuyến và bit tiền tố; chạy từng bit trên Binary Trie đầy đủ |
| 26 | 57–58 | Tìm gần đúng; nén đường một con |
| 27 | 60–63 | Nhớ cấu trúc; nhớ chi phí; chọn cấu trúc; tài liệu tham khảo |

## Đối chiếu nội dung trước khi tách

Bảng chi tiết bên dưới là lịch sử đối chiếu bản 27 trang nội dung trước khi tách;
các số slide trong lời nhận xét là số nguồn. Vị trí hiện tại xem bảng ánh xạ ở trên.

Nguồn: [NMTDTT-Nội-Dung-Slide-Trie.md](../NMTDTT-Nội-Dung-Slide-Trie.md).

Bản rút gọn trước đã bỏ một số nội dung thuộc phần **HIỂN THỊ** của nguồn.
Lần sửa này khôi phục các ý chính trên slide, giữ câu ngắn và các hình minh họa.
Phần chứng minh, nhận xét sâu và công thức LCP mở rộng nằm trong ghi chú.
Không sửa tài liệu nguồn.

| Slide | Nội dung được đối chiếu | Kết quả / xử lý |
|---|---|---|
| 1 | Bộ 5 từ, hai truy vấn, brute force, O(nL), O(n\|p\|) | Khôi phục duyệt tuyến tính, hai cận xấu nhất và ký hiệu; bộ ví dụ đủ 5 từ. |
| 2 | Trực giác tra từ điển, gom tiền tố, cạnh ký tự, gốc rỗng | Khôi phục chuỗi A → AP → APP → APPLE và đối chiếu quét / chọn nhánh. Không gán O(L) cho tra từ điển giấy. |
| 3 | Đường đi khác từ hoàn chỉnh, endCount, từ trùng | Giữ bảng apple / ape / app và thêm ví dụ endCount[app] = 2. Node kết thúc vẫn có thể có con. |
| 4 | Mảng / con trỏ, 0 / nullptr, 26 liên kết | Bổ sung ý nghĩa trie[u][c], child[c], khởi tạo 0, MAXN; ghi chú nêu khác biệt cấp phát và bộ nhớ. |
| 5 | Insert tạo cạnh thiếu, tăng bộ đếm cuối | Giữ code và demo dùng lại app, thêm l–e. Điều kiện mảng / MAXN được nêu ở slide 4 và ghi chú. |
| 6 | Search và StartsWith chung đường đi, khác kết luận | Giữ code, điều kiện và demo app trong cây chỉ chứa apple / ape. |
| 7 | Xóa một lần, không đếm âm, giữ nhánh dùng chung | Giữ code có kiểm tra endCount và demo 2 → 1 → 0; lưu ý StartsWith sau xóa nằm trên slide. |
| 8 | Tổng hợp thao tác trên 5 từ | Giữ bảng / cây, nhắc một lượt duyệt ký tự và điều kiện sau xóa. |
| 9 | Thời gian cả hai cài đặt, xây toàn bộ, số hàng và byte | Khôi phục O(S), S ≤ nL; memory theo MAXN; MAXN ≥ N + 1, truy cập cạnh O(1), chưa tính khởi tạo bảng. |
| 10 | N ≤ 1 + tổng độ dài ≤ 1 + nL | Khôi phục chuỗi bất đẳng thức, ký hiệu và ý nghĩa cận an toàn chưa chặt. Ví dụ 20.001 và hình thực tế 7 node được kiểm tra lại. |
| 11 | min(n, σ^d), cận chặt, 18.703, tiền tố phân biệt / LCP | Khôi phục công thức cận chặt trên slide. Số node chính xác theo tiền tố phân biệt được nêu dưới hình; công thức LCP và điều kiện sắp xếp giữ trong ghi chú, đúng phần mở rộng tùy chọn của nguồn. |
| 12 | Cùng dữ liệu, bốn truy vấn, n/L/q/p/S | Khôi phục đầy đủ ký hiệu; giữ bốn loại truy vấn. |
| 13 | Đủ 5 cách lưu và giả định so sánh | Khôi phục mảng chưa sắp xếp, mảng + binary search, std::set<string>, std::unordered_set<string>, Trie; đủ cận / đặc điểm / chú thích kỳ vọng, xấu nhất và lower_bound. |
| 14 | Đếm Trie / mảng, liệt kê k, tìm chính xác, chi phí tổng | Khôi phục hai cận trên mảng O(p log n), hash O(L) kỳ vọng, bộ đếm mở rộng, chi phí đầu ra và xây dựng + q × truy vấn. |
| 15 | Chọn unordered_set, mảng, Trie, set / BST | Ghi tên C++ cụ thể, thêm đếm tiền tố với dữ liệu tĩnh và kết luận không cấu trúc nào tối ưu mọi truy vấn. |
| 16 | Điểm mạnh, thống kê bổ sung, dãy ký hiệu khác | Bổ sung trọng số / kích thước cây con, bit / chữ số / mã phân cấp và chi phí cập nhật thống kê. |
| 17 | Nhánh thưa, MAXN, cache / cấp phát, Unicode, substring | Khôi phục bộ nhớ theo MAXN, cache / cấp phát và đối chiếu hash. Giữ ví dụ ple không phải tiền tố apple. |
| 18 | Checklist nhận diện và trường hợp không phù hợp | Bổ sung dãy ký hiệu / bit, khoảng không theo tiền tố và bảng nhánh lớn. |
| 19 | Bộ 5 từ, ap → 3, đếm số lần xuất hiện | Khôi phục đầy đủ bộ từ, định nghĩa passCount / endCount và cập nhật đường đi. Hình chỉ thể hiện cây con ap. |
| 20 | Thứ tự từ điển, điểm kết thúc trước con, bỏ qua nhánh | Giữ k = 3 → apple. Thay hình nhóm từ bằng cây Trie thật: app là tổ tiên của apple, mỗi cạnh đúng một ký tự; thống kê nhánh a = 3, b = 2 nêu riêng. |
| 21 | flower / flow / flight → fl; dừng phân nhánh / kết thúc | Giữ đúng điều kiện, hình và thêm ứng dụng gom nhóm; lưu ý về nhánh cũ sau xóa trong ghi chú. |
| 22 | Bit 0/1, cùng B bit, XOR với 6, greedy có nhánh dự phòng | Khôi phục 6 = 0110 và quy tắc thiếu bit đối nghịch thì chọn nhánh còn lại. Kiểm tra 3 XOR 6 = 5, 5 XOR 6 = 3, 10 XOR 6 = 12. |
| 23 | Bài toán nhiều mẫu, định nghĩa failure link, đầu ra | Khôi phục hậu tố thực sự dài nhất đồng thời là tiền tố một mẫu; không có về gốc. Giữ fail(she) = he, link nét đứt và yêu cầu thông tin đầu ra. |
| 24 | Autocomplete, xếp hạng, Redis compact trie, giới hạn | Khôi phục độ phổ biến, ví dụ Redis với liên kết nguồn, giới hạn về ứng dụng khác / cá nhân hóa. Gợi ý app / apple khớp đúng cây minh họa. |
| 25 | Longest prefix match, trie bit / nén, độ dài IP, nguồn | Giữ /24 thắng /16; khôi phục IPv4 32 bit, IPv6 128 bit và liên kết nghiên cứu. Không khẳng định mọi router cùng một cài đặt. |
| 26 | Fuzzy + edit distance, Aho, nén / Radix / Patricia | Khôi phục tên các biến thể và nhấn mạnh Trie cần cơ chế bổ sung. Hình nén không có nhánh / điểm kết thúc trung gian. |
| 27 | 5 kết luận, cận node, lựa chọn và ứng dụng | Khôi phục hai cận node, các phương án đối chiếu và danh sách ứng dụng. |

## Quy ước và hình vẽ

- Gốc đánh số 1 trong code; chỉ số 0 biểu diễn không có cạnh.
- endCount cho phép từ trùng; passCount chỉ là phần mở rộng, không thêm vào code Trie cơ bản.
- Các số trong hình Trie là endCount, không phải chỉ số node. Gốc ký hiệu ε.
- Các nhánh được bố trí theo ký tự tăng dần (a–z hoặc 0–1), kể cả khi thứ tự chèn khác nhau.
- Vòng kép đánh dấu từ kết thúc. Từ kết thúc có thể có con, ví dụ app / apple.
- Đường được chọn dùng **màu xanh #2563eb** cho cả cạnh, đầu mũi tên và nhãn ký tự.
  Cạnh được chọn và cạnh thường đều dày **1.8**, đầu mũi tên cùng kích thước.
- Failure link dùng đường nét đứt màu đỏ nhạt, độc lập với đường được chọn.
- Với hình bộ nhớ, các ô minh họa liên kết không được hiểu là một cây Trie thứ hai.

## Giới hạn của đối chiếu

Đây là kiểm tra tính đầy đủ và nhất quán với tài liệu trong workspace, không phải
một lần xác minh mới các tài liệu bên ngoài. Các liên kết Redis, Tufts và nghiên
cứu IP được giữ theo nguồn. Phần mở rộng LCP / chứng minh cận chặt được để trong
ghi chú theo mức trình bày mà nguồn cho phép.

## Kiểm tra bản nội dung trước khi thêm trang chủ đề

- `npm run build`: thành công.
- Đọc bản hiển thị 27/27 trang: không tràn nội dung, không lỗi KaTeX / công thức bị vỡ trong bảng.
- Demo chèn, tìm, xóa 2 → 1 → 0: đúng trạng thái.
- Slide 13 có đủ 5 hàng phương án và hai tên container C++ cụ thể.
- Cạnh được chọn / thường cùng độ dày 1.8 và kích thước marker 6 × 6; màu cạnh và đầu mũi tên được chọn đều #2563eb.
- Cây thật ở slide 20 giữ app là tổ tiên apple; nhánh e đứng trước p theo thứ tự từ điển.


## Kiểm tra bản tách nội dung (62 trang)

- `npm run build`: thành công.
- Kiểm tra trình duyệt đủ 62/62 trang: không tràn nội dung vào chân trang, không lỗi KaTeX.
- Đọc ảnh toàn bộ trang để rà bố cục và mạch trình bày; slide 4 chỉ đặt câu hỏi, slide 5 mới nêu duyệt tuyến tính.
- Demo chèn ở trang 13, tìm ở trang 16, xóa 2 → 1 → 0 ở trang 17: hoạt động đúng.
- Có đủ 27 nhóm `sourceSlide`, 8 trang đề mục; mọi trang có ghi chú thuyết trình.
- Trang 18 minh họa đường còn sau xóa bằng chuỗi cạnh và `endCount[app] = 0`, tránh nhầm với từ đang lưu.
- Các liên kết tham khảo giữ theo nguồn; lần chỉnh này không xác minh lại tài liệu trực tuyến.

## Demo tự chạy trên cây (bản trước: 27 trang)

- 27 trang có một nút Chạy thử / Dừng / Tiếp tục / Chạy lại; không tăng số slide.
- Các bước được tính bằng thuật toán trên dữ liệu ví dụ: chèn, xóa logic, tìm, đếm tiền tố, DFS, từ thứ k, LCP, XOR, Aho–Corasick, longest prefix match và nén đường một con.
- Node đang xét tô đen; trạng thái bộ đếm và từ kết thúc được cập nhật trên cây. Node cũ được giữ khi minh họa xóa logic.
- Khung vẽ giữ vị trí node trong lúc chèn, tránh cây nhảy vị trí hoặc thay đổi tỷ lệ giữa các bước.
- Chuyển slide sẽ dừng và đặt lại demo; bản in ẩn nút chạy.
- Kiểm tra trình duyệt: 27/27 demo hoàn thành đúng, không tràn nội dung và không lỗi công thức/runtime. Kiểm tra riêng tốc độ thật cho chạy, dừng, tiếp tục, chạy lại và chuyển slide.
- `npm run test:demo`: 11 nhóm kiểm tra, gồm XOR so với vét cạn, DFS/từ thứ k so với sắp xếp, Aho–Corasick so với tìm mẫu trực tiếp, từ trùng, xóa, bộ đếm và fallback định tuyến.
- `npm run build`: thành công.


## Thu gọn demo theo đúng nội dung

- Giữ demo ở 12 trang trực tiếp trình bày thuật toán: 13, 16, 17, 43–47, 49, 51, 55, 57.
- Bỏ nút ở 15 trang giới thiệu, so sánh, phân tích hoặc minh họa lặp lại; khôi phục hình tĩnh theo đúng dữ liệu trên trang.
- Trang 18 giữ hình đường đi sau xóa logic với `endCount[app] = 0`.
- Tốc độ chạy tăng từ 650 lên 1.000 ms mỗi bước.
- Kiểm tra trình duyệt bản thu gọn: 12/12 demo hoàn thành đúng; 15 trang đã bỏ demo không còn nút chạy; không tràn nội dung, không lỗi công thức/runtime. Kiểm tra tốc độ thật xác nhận bước đầu chưa đổi ở 0,75 giây và đã đổi sau 1 giây; dừng/tiếp tục/chạy lại vẫn hoạt động.
- `npm run build`: thành công.


Trang 14 giữ hình tĩnh theo yêu cầu; tổng cộng 12 trang có demo, tốc độ 1 giây/bước.

### Demo kiểm tra tiền tố ở trang 15

Theo yêu cầu, thêm Chạy thử cho `app` trên cây lưu `apple`, `ape`; mỗi bước 1 giây.
Kết thúc: có đường `app` nên StartsWith đúng, dù `endCount[app] = 0`.
Trang 14 vẫn giữ hình tĩnh. Tổng cộng 13 trang có demo; kiểm tra trình duyệt và build thành công.

### Demo đối chiếu cận và số node thực tế ở trang 23

- Chạy thử chèn `app`, `apple`, `ape`, tốc độ giữ 1 giây/bước.
- Tính cận đơn giản theo bộ từ minh họa: `1 + 3 × 5 = 16 node`.
- Bộ đếm lấy các node thực sự có trong khung cây, gồm gốc; tăng 1 → 2 → 3 → 4 → 5 → 6 → 7 khi tạo node mới. Tiền tố dùng lại không tăng bộ đếm.
- Kết thúc: 7 node thực tế; cận theo tổng 11 ký tự là 12 (giữ trong ghi chú), khác với cận đơn giản 16.
- Giữ ví dụ 1.000 từ × tối đa 20 ký tự ở phần nội dung bên trái và khung sơ đồ hiện có.
- Tổng cộng 14 trang có demo. Kiểm tra trình duyệt: số đếm khớp số node hiển thị ở mọi bước; chạy lại bắt đầu từ gốc; không tràn nội dung hay lỗi công thức/runtime. Build thành công.

### Mở rộng ví dụ chọn tuyến mạng (trang 55)

- Có 8 tuyến, từ tuyến mặc định /0 đến các mạng /8, /12, /16, /24, /26 và /27; bảng tuyến và hình cây cùng ký hiệu cổng A–H.
- IP 192.168.1.42 đi qua các lựa chọn A (/0) → D (/16) → E (/24) → G (/27). Các nhánh B, C, F, H không được chọn.
- Cây hiển thị quan hệ chứa nhau của mạng con, lược bỏ các node bit; thuật toán vẫn duyệt trie bit để tính longest prefix match.
- Riêng trang này dùng 450 ms/bước; các demo khác vẫn 1.000 ms/bước.
- Kiểm tra 11 nhóm test, gồm đối chiếu định tuyến bằng phép chia khoảng địa chỉ cho toàn bộ 256 IP thuộc 192.168.1.0/24 và các ca fallback, ranh giới /27, /26, /12.
- Trình duyệt: đủ 8 node và 7 cạnh; chọn đúng G; toàn bộ lượt chạy khoảng 2,3 giây, không tràn nội dung hoặc lỗi runtime. Build và kiểm tra TypeScript của thuật toán thành công.

## Binary Trie định tuyến đầy đủ (trang 55–56)

- Thay ví dụ 8 tuyến và hình phân cấp bằng 24 tuyến, 90 node, 89 cạnh; mọi cạnh là đúng một bit 0/1, mọi node có tối đa hai con. Không nén cạnh hay bỏ node bit.
- Trang 55 liệt kê đủ CIDR, tiền tố nhị phân và cổng A–X; trang 56 dành toàn bộ chiều ngang cho chạy từng bit. Bộ trình chiếu tăng lên 63 trang; ánh xạ nguồn và README đã cập nhật.
- Giữ 450 ms/bước. Hiện đủ 32 bit của IP, bit đang đọc, số cạnh đã đi, số bit đã xét, tuyến tốt nhất và node hiện tại. Khung nhìn tự đi theo node; có kéo xem nhánh và nút Theo node.
- Có Bước tiếp, chạy/dừng/tiếp tục/chạy lại và 5 IP mẫu. 192.168.1.42 đi đủ 32 cạnh và chọn /32 U; 192.168.1.43 đi 31 cạnh, thiếu cạnh ở bit 32 và giữ /30 S.
- Kiểm tra thuật toán: 13 nhóm test; 1.024 IP đối chiếu bằng phép chia khoảng địa chỉ độc lập, cùng các ca biên, mặc định và thiếu cạnh.
- Kiểm tra trình duyệt: đủ 90 node/89 cạnh/24 cổng và nhãn 0/1 hợp lệ; cả 5 IP, Bước tiếp, kéo, tự theo node, chuyển slide đặt lại và dừng ở tốc độ thật đều đúng. Kiểm tra trang 55, trang 56 ở gốc, bit 16, bit 32 và trường hợp thiếu cạnh: không tràn nội dung hay lỗi runtime. Demo nén ở trang mới 58 vẫn chạy đúng.
- `npm run build`, kiểm tra TypeScript thuật toán và `npm run test:demo`: thành công.

## Trie mã số sinh viên trên trang bìa

- Dựng cây từ bốn MSSV: 24120093 (Lê Quang Minh), 24120022 (Hà Văn Thiên Bảo), 24120225 (Trịnh Văn Thành), 24120214 (Nguyễn Ngọc Phúc). Cây có 16 node, dùng chung tiền tố 24120.
- Chạy thử duyệt lần lượt từng mã, 450 ms/bước; chỉ hiện MSSV và tên sau khi xác nhận đủ mã tại node kết thúc. Giữ tên đã tìm thấy, dừng 1.800 ms giữa các kết quả.
- Có dừng, tiếp tục và chạy lại; rời slide đặt lại demo. Bản in hiện đủ bốn thành viên và ẩn nút chạy.
- Tổng cộng 15 trang có demo. Kiểm tra trình duyệt xác nhận thứ tự, tên, node kết thúc, thao tác điều khiển và bản in; không tràn nội dung hay lỗi runtime.
- 16 nhóm test, kiểm tra TypeScript và build thành công.

## Demo đếm theo từng tầng (trang 24)

- Thay hình tĩnh bằng cây của ba từ aaa, aab, bba; σ=2, L=3. Tô sáng lần lượt gốc và các tầng, 900 ms/bước.
- Số node từng tầng: 2, 2, 3; thực tế gồm gốc là 8. Cận theo tầng: 1 + 2 + 3 + 3 = 9. Số đếm lấy từ các tiền tố phân biệt của bộ từ.
- Có chạy/dừng/tiếp tục/chạy lại, rời slide đặt lại; tổng cộng 16 trang có demo.
- Kiểm tra trình duyệt: các tầng, bộ đếm cộng dồn, kết quả, thao tác điều khiển và đặt lại đều đúng; không lỗi runtime. Build thành công.
