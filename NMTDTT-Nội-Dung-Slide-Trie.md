# SƯỜN CHI TIẾT THUYẾT TRÌNH: TRIE (PREFIX TREE)

**Học phần:** Nhập môn tư duy thuật toán  
**Đối tượng:** Sinh viên năm 3  
**Thời lượng:** khoảng 50–55 phút (linh hoạt, không cố định) — 27 slide  
**Định hướng:** Giải thích trực giác và tư duy thuật toán là chính; minh họa code C++ ngay ở các thao tác, nhưng không đọc code từng dòng.  
**Tài liệu nền:** [Trie — VNOI Wiki](https://wiki.vnoi.info/algo/string/trie)

## Mục tiêu sau bài thuyết trình

Người nghe có thể (1) giải thích vì sao Trie phù hợp cho các truy vấn tiền tố; (2) hiểu vai trò của `endCount` và viết các thao tác cơ bản bằng mảng hai chiều; (3) so sánh cài đặt bằng mảng và con trỏ; (4) chọn kích thước mảng an toàn bằng cận trên đơn giản và cận chặt theo từng độ sâu, liên hệ tiền tố phân biệt/LCP; (5) nhận diện những dạng bài dùng Trie, kể cả Trie nhị phân; (6) biết lựa chọn giữa Trie, hashing, tìm kiếm nhị phân và cây cân bằng; (7) nhận biết Aho–Corasick là một mở rộng của Trie với failure link để tìm nhiều mẫu; (8) xác định khi nào Trie không phù hợp và nhận diện ứng dụng thực tiễn.

## Quy ước xuyên suốt

- Trie xâu sử dụng bảng chữ cái `a`–`z` (26 ký tự), mỗi cạnh mang một ký tự.
- Cài đặt chính: `int trie[MAXN][26]` và `int endCount[MAXN]`. Gốc là node `1`, giá trị `0` biểu diễn không có cạnh. Các mảng được khởi tạo bằng 0, `nodeCount = 1`; `MAXN` phải đủ chứa cả gốc.
- Cho phép từ xuất hiện nhiều lần; `endCount[u]` đếm số lần một từ kết thúc ở node `u`.
- **Không dùng `passCount` trong Trie cơ bản.** Chỉ đề cập các bộ đếm bổ sung ở phần ứng dụng.
- Bộ ví dụ xuyên suốt: `app`, `apple`, `ape`, `bat`, `bath` (thứ tự từ điển: `ape`, `app`, `apple`, `bat`, `bath`). Có thể thêm trùng `app` để minh họa `endCount = 2`.
- Khi nói `O(L)` giả định truy cập một cạnh theo ký tự mất `O(1)` và kích thước bảng chữ cái là hằng số.

## Phân bổ thời gian (gợi ý, có thể điều chỉnh)

| Phần | Slide | Phút tham khảo |
|---|---|---:|
| I. Động lực và ý tưởng Trie | 1–3 | 7 |
| II. Cài đặt và thao tác cơ bản | 4–8 | 10 |
| III. Độ phức tạp và giới hạn số node | 9–11 | 9 |
| IV. Đối chiếu trên cùng bài toán | 12–15 | 8 |
| V. Điểm mạnh, hạn chế, dấu hiệu nhận biết | 16–18 | 5 |
| VI. Các dạng bài toán ứng dụng và mở rộng | 19–23 | 8 |
| VII. Ứng dụng ngoài đời thực | 24–26 | 6 |
| VIII. Tổng kết và định hướng | 27 | 2 |
| **Tổng** | **27** | **55** |

---

# PHẦN I — ĐẶT VẤN ĐỀ VÀ Ý TƯỞNG TRIE (7 phút)

## Slide 1 — Đặt vấn đề: Cách làm trâu tốn bao nhiêu?

### Nội dung HIỂN THỊ trên slide

- Tiêu đề: **Tìm từ trong một danh sách lớn — làm thế nào?**
- Ví dụ tập từ: `app`, `apple`, `ape`, `bat`, `bath`.
- Hai truy vấn: **(1)** `apple` có xuất hiện không? **(2)** Có bao nhiêu từ bắt đầu bằng `ap`?
- Khung **Cách làm trâu (brute force)**:
  1. Duyệt từng từ trong danh sách.
  2. So sánh từ đang xét với từ cần tìm, hoặc so sánh phần tiền tố.
  3. Trả lời khi tìm thấy / sau khi đếm xong.
- Bảng độ phức tạp (giả sử có `n` từ, mỗi từ dài tối đa `L` ký tự):

  | Truy vấn | Duyệt tuyến tính |
  |---|---|
  | Tìm một từ | `O(nL)` trong trường hợp xấu nhất |
  | Đếm từ có tiền tố `p` | `O(n|p|)` trong trường hợp xấu nhất (nếu `|p| ≤ L`) |

- Một câu gợi mở ở cuối: **Khi có rất nhiều truy vấn, liệu có cần duyệt lại cả danh sách mỗi lần?**

### Nội dung NÓI cần truyền đạt

- Cách đầu tiên ai cũng nghĩ đến là duyệt lần lượt danh sách và so sánh các xâu. Một phép so sánh có thể cần đọc nhiều ký tự, nên tìm một từ trong trường hợp xấu nhất mất `O(nL)`.
- Với yêu cầu đếm các từ bắt đầu bằng `ap`, không thể dừng khi tìm thấy một từ: phải xét toàn bộ `n` từ; mỗi lần kiểm tra tiền tố dài `|p|` tốn tối đa `O(|p|)`.
- **Vì sao chưa tối ưu?** Các từ có thể chia sẻ nhiều ký tự đầu, nhưng cách duyệt trâu vẫn phải kiểm tra phần đầu đó ở nhiều từ; mỗi truy vấn mới lại làm việc tương tự từ đầu. Khi `n` và số truy vấn lớn, chi phí lặp lại đáng kể.
- Nêu ngắn gọn rằng sắp xếp + tìm kiếm nhị phân hay `set`/`map` cũng là lựa chọn hợp lý; ở đây ta muốn tìm một cách tổ chức **đặc biệt thuận lợi cho truy vấn tiền tố**, không khẳng định Trie luôn hơn mọi phương án.
- Chuyển ý: **Con người tra một cuốn từ điển giấy có thực sự đọc từng từ từ trang đầu không?**

### Lưu ý về ký hiệu

- Cận `O(nL)` là trường hợp xấu nhất cho **tìm kiếm tuần tự có so sánh ký tự**, không phải `O(n)` nếu coi so sánh hai xâu là miễn phí.
- Nếu cần diễn đạt ngắn trên slide, dùng `n` = số từ, `L` = độ dài từ tối đa, `|p|` = độ dài tiền tố truy vấn.

## Slide 2 — Từ cách tra từ điển của con người đến ý tưởng Trie

### Nội dung HIỂN THỊ trên slide

- Tiêu đề: **Bạn tìm “apple” trong từ điển giấy như thế nào?**
- Chuỗi hình minh họa hoặc mũi tên:

  **Mở vùng chữ A → tìm nhóm AP → tiếp tục APP → APPL → APPLE**

- Hai hình đặt cạnh nhau:
  - **Cách làm trâu:** đi từ đầu, kiểm tra từng từ một.
  - **Cách con người tìm:** dựa vào thứ tự chữ cái / các phần đầu giống nhau để thu hẹp vùng tìm kiếm.
- Kết luận nổi bật: **Tổ chức các từ theo tiền tố chung → chỉ theo nhánh liên quan.**
- Dẫn vào khái niệm: **Trie (cây tiền tố): mỗi cạnh ứng với một ký tự; đường đi từ gốc biểu diễn một tiền tố.**
- Hình Trie rất nhỏ với các nhánh `app`, `apple`, `ape` (chỉ cần phần `a → p` dùng chung).

### Nội dung NÓI cần truyền đạt

- Ví dụ: để tìm `apple` trong một cuốn từ điển giấy đã sắp xếp, ta không đọc tuần tự mọi trang. Ta tìm vùng chữ **A**, trong đó tìm các từ bắt đầu bằng **AP**, rồi thu hẹp tiếp đến **APP...** cho đến từ cần tìm.
- Đây là **phép so sánh trực giác**, không phải khẳng định người tra từ điển thực hiện đúng thuật toán Trie hoặc thời gian tra từ điển giấy là `O(L)`.
- Ý tưởng rút ra là: thay vì giữ các từ như những xâu hoàn toàn độc lập, hãy **gom các từ có chung phần đầu**. Trong Trie, các tiền tố chung sử dụng cùng một đường đi; mỗi ký tự ta chỉ chọn cạnh tương ứng.
- Giới thiệu nhanh: root là vị trí bắt đầu; mỗi node ứng với một tiền tố (root là xâu rỗng). Chẳng hạn `app`, `apple`, `ape` dùng chung đường đi `a → p`.
- Với Trie đã xây dựng, tìm đường đi của một xâu `s` cần tối đa `|s|` bước, giả sử việc truy cập cạnh là `O(1)`; so với việc quét `n` từ, bước tra cứu không cần xét từng từ riêng lẻ.
- Chuyển ý: khi cùng một đường đi có thể vừa là tiền tố vừa là một từ, **làm sao biết từ đó thực sự được thêm vào Trie?** (dẫn sang Slide 3 về `endCount`).

### Lưu ý khi thiết kế hình minh họa

- Vẽ trang từ điển theo nhóm **A → AP → APP** (không cần mô phỏng trang số cụ thể), kèm mũi tên chuyển sang **cây phân nhánh**.
- Tránh đặt công thức `O(L)` lên thao tác tra từ điển giấy; chỉ áp dụng cho tìm kiếm trên Trie đã được xây dựng.

## Slide 3 — Xây dựng cây và đánh dấu điểm kết thúc từ

### Nội dung HIỂN THỊ trên slide

- Hoạt ảnh/hình ba bước: chèn `apple`, chèn `ape`, kiểm tra `app`.
- Trên cây, node kết thúc `apple` và `ape` được đánh dấu riêng; node tương ứng `app` **không** đánh dấu.
- Bảng đối chiếu:

  | Truy vấn | Đường đi tồn tại | Từ đã được thêm |
  |---|---|---|
  | `apple` | Có | Có |
  | `ape` | Có | Có |
  | `app` | Có | **Không** |

- Kết luận lớn: **Có đường đi ≠ Có từ hoàn chỉnh.**
- Giải pháp: `endCount[u]` = số lần một từ kết thúc tại node `u`.

### Nội dung NÓI cần truyền đạt

- Nếu chỉ dựa vào sự tồn tại của các cạnh thì `app` bị hiểu nhầm là từ đã lưu, vì nó là tiền tố của `apple`.
- `endCount[u] > 0` mới khẳng định xâu ứng với node `u` thực sự đã được chèn.
- Chọn bộ đếm thay vì boolean vì cùng một từ có thể được thêm nhiều lần; ví dụ chèn `app` hai lần thì `endCount` của node `app` bằng 2.
- Một node kết thúc từ **vẫn có thể có con**, chẳng hạn khi cả `app` lẫn `apple` đều được lưu.
- Chuyển ý: cần tổ chức các cạnh và bộ đếm trong C++ thế nào?

---

# PHẦN II — CÀI ĐẶT VÀ THAO TÁC CƠ BẢN (10 phút)

## Slide 4 — Hai cách biểu diễn Trie trong C++

### Nội dung HIỂN THỊ trên slide

- Hai cột đối chiếu:

  **Mảng hai chiều (dùng để minh họa):**
  ```cpp
  int trie[MAXN][26];
  int endCount[MAXN];
  int nodeCount = 1; // root = 1
  ```

  **Node và con trỏ (chỉ giới thiệu):**
  ```cpp
  struct Node {
      Node* child[26]{};
      int endCount = 0;
  };
  ```

- Sơ đồ ánh xạ: `trie[u][c]` là chỉ số node con; `child[c]` là con trỏ đến node con.
- Chú thích: giá trị `0` (mảng) / `nullptr` (con trỏ) nghĩa là chưa có cạnh.

### Nội dung NÓI cần truyền đạt

- Hai cách biểu diễn **cùng một Trie**, cùng logic thêm và tìm; khác ở việc liên kết bằng chỉ số hay địa chỉ bộ nhớ.
- Mảng tĩnh thuận tiện trong thi lập trình, truy cập liên tục và không phải cấp phát riêng từng node; phải đặt trước giới hạn `MAXN`.
- Con trỏ cấp phát node khi cần, không cần giới hạn node cố định, nhưng có chi phí cấp phát và mỗi con trỏ có thể tốn nhiều byte hơn chỉ số nguyên.
- Với `child[26]` ở cả hai cách, **cả hai đều có 26 ô liên kết trên mỗi node**; con trỏ không tự động tiết kiệm bộ nhớ.
- Từ đây mọi đoạn code chính sẽ dùng mảng hai chiều.

## Slide 5 — Insert: Chèn một từ

### Nội dung HIỂN THỊ trên slide

- Hình/hoạt ảnh thêm `apple` vào cây đang có `app`: tái sử dụng `a-p-p`, tạo `l-e`.
- Pseudocode 3 bước: bắt đầu ở gốc → duyệt ký tự, tạo cạnh còn thiếu → tăng `endCount` tại node cuối.
- Code minh họa ngắn:

  ```cpp
  void insert(const string& s) {
      int u = 1;
      for (char ch : s) {
          int c = ch - 'a';
          if (!trie[u][c]) trie[u][c] = ++nodeCount;
          u = trie[u][c];
      }
      ++endCount[u];
  }
  ```

### Nội dung NÓI cần truyền đạt

- Chỉ tạo node khi không có cạnh; các tiền tố đã xuất hiện được dùng lại.
- Vì vậy mỗi ký tự được xử lý một lần; với xâu dài `L`, thời gian `O(L)`.
- Cuối cùng đánh dấu từ bằng cách tăng `endCount` ở **node cuối cùng**, không phải mọi node trên đường đi.
- Giả định mảng đã khởi tạo bằng 0 và `MAXN` đủ lớn để tránh vượt giới hạn.

## Slide 6 — Search và StartsWith: Khác nhau ở điều kiện kết luận

### Nội dung HIỂN THỊ trên slide

- Sơ đồ cùng một quá trình đi theo ký tự đến node `u`.
- Hai câu hỏi:
  - `startsWith(s)`: có đi hết đường `s` không?
  - `search(s)`: có đi hết đường `s` **và** `endCount[u] > 0` không?
- Code cô đọng:

  ```cpp
  int findNode(const string& s) {
      int u = 1;
      for (char ch : s) {
          u = trie[u][ch - 'a'];
          if (u == 0) return 0;
      }
      return u;
  }
  // search(s): u = findNode(s), u && endCount[u] > 0
  // startsWith(s): findNode(s) != 0
  ```

- Ví dụ từ `apple`, `ape`: `startsWith("app") = true`, `search("app") = false`.

### Nội dung NÓI cần truyền đạt

- Quy trình duyệt là như nhau, chỉ khác điều kiện xác nhận kết quả.
- Liên hệ lại slide 3 để làm rõ vì sao mảng `endCount` bắt buộc nếu muốn phân biệt từ và tiền tố.
- Mỗi lần kiểm tra đi qua tối đa `L` ký tự ⇒ `O(L)`.

## Slide 7 — Delete: Xóa một lần xuất hiện của từ

### Nội dung HIỂN THỊ trên slide

- Minh họa `app` đã được thêm 2 lần: `endCount[app] = 2` → xóa một lần → còn 1.
- Ba bước: tìm node cuối → nếu từ đang tồn tại thì giảm `endCount` → **không cần xóa node trong bản cơ bản**.
- Chú thích: các node/cạnh cũ được giữ lại để không ảnh hưởng các từ chung tiền tố.

### Nội dung NÓI cần truyền đạt

- Không được giảm `endCount` nếu từ không tồn tại, tránh đếm âm.
- Xóa logic bằng cách giảm bộ đếm khác với thu hồi các node không dùng nữa.
- Với cách xóa logic, `search` vẫn đúng; nhưng các cạnh từng tạo có thể còn tồn tại. Vì vậy `startsWith` dựa *chỉ trên đường đi* có thể trả về true dù không còn từ đang lưu nào mang tiền tố đó. Nếu cần thao tác xóa và tiền tố luôn chính xác, phải thêm bộ đếm số từ đi qua hoặc dọn các nhánh không còn được sử dụng. Trong bài này **chỉ giới thiệu Delete**, không triển khai xóa vật lý.

## Slide 8 — Tổng hợp cách thao tác trên cùng một Trie

### Nội dung HIỂN THỊ trên slide

- Một cây chung `app`, `apple`, `ape`, `bat`, `bath`, các node kết thúc được đánh dấu.
- Bảng ngắn cho từng thao tác: Insert (tạo cạnh thiếu, tăng kết thúc), Search (đường đi + kết thúc), StartsWith (đường đi), Delete (giảm kết thúc, lưu ý dọn nhánh).
- Dòng chốt: **Mỗi thao tác chủ yếu là một lượt duyệt theo ký tự.**

### Nội dung NÓI cần truyền đạt

- Lần lượt nêu một truy vấn ví dụ cho mỗi thao tác, không lặp lại toàn bộ code.
- Người nghe cần hình dung được trạng thái cây thay đổi ra sao sau một lần chèn hoặc xóa.
- Chuyển ý: mọi thao tác đã có mô hình tương tự nhau; hãy đánh giá chúng tốn bao nhiêu thời gian và bộ nhớ.

---

# PHẦN III — PHÂN TÍCH ĐỘ PHỨC TẠP VÀ BỘ NHỚ (9 phút)

## Slide 9 — Bài toán cấp phát bộ nhớ cho Trie bằng mảng

### Nội dung HIỂN THỊ trên slide

- Câu hỏi trung tâm: **Với `n` xâu, mỗi xâu dài tối đa `L`, cần khai báo `MAXN` bao nhiêu để không tràn mảng?**
- Cài đặt đang sử dụng:

  ```cpp
  int trie[MAXN][26];
  int endCount[MAXN];
  ```

- Đặt `N` là **số node thực sự cần tạo**, tính cả gốc; phải chọn `MAXN >= N` nếu chỉ số chạy từ `0` đến `MAXN-1`. Với gốc đánh chỉ số `1` như giáo án này, cần **`MAXN >= N + 1`** (vì chỉ số `0` để chỉ cạnh không tồn tại).
- **Độ phức tạp thời gian** (`L` là độ dài xâu truy vấn, truy cập một nhánh `O(1)`):

  | Thao tác | Mảng 2 chiều | Con trỏ với `child[26]` |
  |---|---|---|
  | Insert | `O(L)` | `O(L)` |
  | Search | `O(L)` | `O(L)` |
  | StartsWith | `O(L)` | `O(L)` |
  | Delete logic (giảm `endCount`) | `O(L)` | `O(L)` |
  | Xây Trie từ `n` xâu | `O(Σ|sᵢ|)`, tối đa `O(nL)` | `O(Σ|sᵢ|)`, tối đa `O(nL)` |

  *Lưu ý:* Đánh giá trên chưa tính thời gian khởi tạo toàn bộ bảng tĩnh `MAXN × 26`; việc xóa vật lý và dọn nhánh là một thao tác khác.
- So sánh ngắn: mảng tĩnh phải **ước lượng giới hạn trước**; con trỏ có thể cấp phát node khi cần. Cả hai vẫn tạo cùng số node logic nếu lưu cùng một Trie.

### Nội dung NÓI cần truyền đạt

- Trọng tâm phần này không phải tranh luận `int` hay `Node*` nhanh hơn, mà là **quy hoạch tài nguyên trước khi code**.
- Trie càng nhiều node, bảng `trie[MAXN][26]` càng lớn. Khai báo quá nhỏ sẽ tràn; quá lớn sẽ lãng phí hoặc vượt giới hạn bộ nhớ.
- **Về thời gian:** cả hai phiên bản đều đi theo từng ký tự nên Insert, Search, StartsWith và xóa logic đều là `O(L)`; xây cả Trie là `O(Σ|sᵢ|)`. Đừng nhầm thời gian này với chi phí khởi tạo mảng tĩnh.
- Nhấn mạnh phân biệt **số node `N`**, **số hàng của mảng `MAXN`** và **số byte cấp phát**. Chuyển sang cách ước lượng dễ tính nhất.

## Slide 10 — Cận trên đơn giản: `1 + nL`

### Nội dung HIỂN THỊ trên slide

- `n`: số xâu; `L`: độ dài tối đa; `N`: số node của Trie, **gồm root**.
- Mỗi xâu dài `L` thêm tối đa `L` node; root có sẵn:

  \[
  N\le 1+\sum_{i=1}^{n}|s_i|\le 1+nL.
  \]

- Ví dụ `n = 1000`, `L = 20`: cận đơn giản là **20.001 node**.
- **An toàn nhưng chưa chặt**, vì không thể có quá 26 node khác nhau ở độ sâu 1, hoặc hơn `26²` node ở độ sâu 2.

### Nội dung NÓI cần truyền đạt

- Đây là cách tính phổ biến, nhanh và thuận tiện khi dùng `trie[MAXN][26]` trong lập trình thi đấu.
- Tuy nhiên, kể cả khi các từ cố gắng khác nhau nhiều nhất, số node ở các tầng nông vẫn bị giới hạn bởi số ký tự có thể xuất hiện.
- Chuyển sang đếm theo **độ sâu** thay vì cộng máy móc `L` node cho từng từ.

## Slide 11 — Cận trên chặt theo độ sâu và liên hệ LCP

### Nội dung HIỂN THỊ trên slide

**Khi chỉ biết `n`, `L` và kích thước bảng chữ cái `σ` (`σ = 26`):**

- Ở độ sâu `d`, mỗi từ đóng góp tối đa một tiền tố ⇒ nhiều nhất `n` node.
- Có tối đa `σ^d` tiền tố dài `d` ⇒ nhiều nhất `σ^d` node.

  \[
  N_d\le\min(n,\sigma^d)
  \]

- Do đó, **cận trên chặt nhất** trong trường hợp mọi xâu dài không quá `L` là:

  \[
  \boxed{N_{\max}=1+\sum_{d=1}^{L}\min(n,\sigma^d)}.
  \]

- Ví dụ `n = 1000`, `L = 20`, `σ = 26`:
  - Độ sâu 1: `26` node; độ sâu 2: `676` node; độ sâu 3–20: mỗi mức `1000` node.
  - **`N_max = 1 + 26 + 676 + 18 × 1000 = 18.703`**, nhỏ hơn cận đơn giản **20.001**.
- **Mở rộng (không cần chứng minh trên lớp):** Với bộ xâu cụ thể, số node **chính xác** bằng `1 + số tiền tố không rỗng phân biệt`. Nếu xâu được sắp xếp từ điển:

  \[
  N=1+|s_1|+\sum_{i=2}^{n} (|s_i|-\operatorname{LCP}(s_{i-1},s_i)).
  \]

### Nội dung NÓI cần truyền đạt

- Tại mỗi tầng, phải thỏa **cả hai giới hạn**: số từ và số tiền tố có thể có. Lấy `min` rồi cộng theo độ sâu.
- Công thức `1 + Σ min(n, σ^d)` không chỉ là một cận an toàn; nó **có thể đạt được** khi chọn `n` xâu có độ dài `L` sao cho các tiền tố phân bố đủ đều. Vì vậy không thể giảm cận này nếu chỉ biết ba thông số `n`, `L`, `σ` (với `σ >= 2`).
- Chỉ rõ: `N_max` đếm **node**, không phải byte. Với mảng `int trie[MAXN][26]`, phần liên kết cần `MAXN × 26 × sizeof(int)` byte; cộng thêm `MAXN × sizeof(int)` cho `endCount` và bộ nhớ khác. **Theo quy ước root=1, 0 là null, nếu có `N_max` node thì cấp tối thiểu `MAXN = N_max + 1` hàng**.
- Công thức LCP trả số node **thực tế của một bộ từ cụ thể**, không phải cận trên tối ưu chỉ từ `n`, `L`, `σ`. Có thể nhắc như một liên hệ nâng cao hoặc đưa vào slide phụ nếu thiếu thời gian.
- Nếu biết độ dài từng từ, có thể siết cận theo độ sâu thêm nữa: với `n_d` là số từ có độ dài ít nhất `d`, `N <= 1 + Σ min(n_d, σ^d)`.

---

# PHẦN IV — SO SÁNH TRÊN CÙNG MỘT BÀI TOÁN (8 phút)

> Không so sánh chung chung cấu trúc nào “nhanh nhất”. Phải đặt **cùng dữ liệu, cùng loại truy vấn, cùng giả định**.

## Slide 12 — Bộ bài toán chuẩn để so sánh

### Nội dung HIỂN THỊ trên slide

- Cho `n` từ, độ dài tối đa `L`; nhận `q` truy vấn.
- Truy vấn A: Từ `apple` có trong tập không?
- Truy vấn B: Có từ nào bắt đầu bằng `app` không?
- Truy vấn C: Có bao nhiêu từ bắt đầu bằng `app`?
- Truy vấn D: Liệt kê `k` kết quả theo thứ tự từ điển.
- Ký hiệu: `p` là độ dài tiền tố; `S = Σ|s_i|` là tổng chiều dài các từ.

### Nội dung NÓI cần truyền đạt

- Một cấu trúc xuất sắc ở truy vấn A chưa chắc xuất sắc ở B–D. Trường hợp có nhiều truy vấn (`q` lớn) cũng khác bài toán chỉ hỏi một lần.
- Với truy vấn xuất ra `k` từ, không thể nói `O(p)` cho *toàn bộ* công việc: còn chi phí liệt kê và xuất kết quả.
- Tạo một khung so sánh công bằng trước khi đi vào bảng.

## Slide 13 — Duyệt tuyến tính, mảng đã sắp xếp, bảng băm và Trie

### Nội dung HIỂN THỊ trên slide

| Cách lưu | Tìm từ chính xác dài `L` | Kiểm tra tiền tố dài `p` | Ghi chú |
|---|---|---|---|
| Mảng chưa sắp xếp | `O(nL)` xấu nhất | `O(np)` xấu nhất | Không tốn tiền xử lý |
| Mảng sắp xếp + binary search | `O(L log n)` xấu nhất | `O(p log n)`* | Cần sắp xếp trước |
| `std::set<string>` | `O(L log n)` xấu nhất | `O(p log n)`* | Dữ liệu động, có thứ tự |
| `std::unordered_set<string>` | `O(L)` kỳ vọng | Không hỗ trợ trực tiếp; quét `O(np)` | Phải băm toàn bộ từ |
| Trie 26 nhánh | `O(L)` | `O(p)` | Cần thêm bộ nhớ theo node |

`*` Với phép tìm cận dưới (lower_bound) và so sánh tiền tố thích hợp; phải tính chi phí so sánh ký tự. Bảng giả định băm chất lượng tốt, truy cập cạnh Trie `O(1)`; `unordered_set` có tình huống xấu hơn kỳ vọng.

### Nội dung NÓI cần truyền đạt

- Binary search không phải phương pháp trâu: với danh sách *tĩnh và đã sắp xếp*, nó là đối thủ thật sự của Trie.
- Với kiểm tra tiền tố, so sánh theo `p` ký tự đầu có thể thực hiện qua lower_bound; không nên khẳng định `set` hay mảng sắp xếp buộc phải quét tất cả.
- Bảng băm có ưu thế khi chỉ hỏi “từ có tồn tại không?”; Trie nổi bật khi tiền tố là thao tác cốt lõi.

## Slide 14 — So sánh trên truy vấn đếm và liệt kê

### Nội dung HIỂN THỊ trên slide

| Bài toán | Phương án hiệu quả | Ý tưởng |
|---|---|---|
| Đếm số từ tiền tố `p` | Trie có `passCount`: `O(p)` | Lưu số từ dưới mỗi node |
| Đếm bằng mảng sắp xếp | `O(p log n)` cho hai cận tìm kiếm* | Xác định khoảng các từ có tiền tố `p` |
| Liệt kê `k` gợi ý | Trie: tới node tiền tố rồi duyệt `k` kết quả | Chi phí phụ thuộc tổng độ dài kết quả |
| Chỉ tìm từ chính xác | Hash set: `O(L)` kỳ vọng | Không cần cơ chế tiền tố |

`*` Giả sử có phép so sánh tiền tố dài `p` và cách tìm biên thích hợp; cách cài đặt thực tế có thể thêm chi phí xử lý chuỗi/khóa biên.

### Nội dung NÓI cần truyền đạt

- `passCount` là **mở rộng theo bài toán**, không phải thành phần bắt buộc của Trie cơ bản.
- Một cấu trúc tiền xử lý dữ liệu có thể giúp nhiều truy vấn về sau; cần đánh giá *chi phí xây dựng + q × chi phí truy vấn*.
- Dùng ví dụ 100.000 từ với hàng nghìn lượt gõ tiền tố để minh họa lợi ích tích lũy, nhưng không tự gán số mili-giây khi chưa benchmark.

## Slide 15 — Khi nào chọn cái nào? (bài toán tương đương, kết luận khác nhau)

### Nội dung HIỂN THỊ trên slide

- **Chỉ cần kiểm tra từ tồn tại:** ưu tiên cân nhắc `unordered_set`.
- **Dữ liệu tĩnh, đã sắp xếp, tìm kiếm/đếm theo tiền tố:** mảng + binary search rất đáng cân nhắc.
- **Tập từ cập nhật liên tục và nhiều truy vấn theo tiền tố:** Trie có lợi thế.
- **Cần thứ tự tổng quát, predecessor/successor:** `set` hoặc cây tìm kiếm cân bằng thuận tiện hơn.
- Kết luận: **Không có cấu trúc tối ưu trên mọi truy vấn.**

### Nội dung NÓI cần truyền đạt

- Lựa chọn phụ thuộc tần suất cập nhật, giới hạn bộ nhớ, bộ ký tự và loại truy vấn.
- Trie hỗ trợ truy vấn theo tiền tố rất tự nhiên; nó không thay thế mọi bài toán tìm kiếm có thứ tự.
- Đưa ra hai tình huống tương phản để cả lớp tự chọn cấu trúc và bảo vệ lựa chọn.

---

# PHẦN V — ĐIỂM MẠNH, HẠN CHẾ VÀ ĐIỀU KIỆN ÁP DỤNG (5 phút)

## Slide 16 — Điểm mạnh của Trie

### Nội dung HIỂN THỊ trên slide

- Truy vấn theo tiền tố trong `O(p)` với bảng chữ cái cố định.
- Dùng lại các tiền tố chung; kết quả cùng tiền tố nằm trong cùng một cây con.
- Có thể mở rộng node với tần suất, trọng số, kích thước cây con để hỗ trợ truy vấn đặc thù.
- Cùng ý tưởng có thể áp dụng cho dãy bit, chữ số, mã phân cấp.

### Nội dung NÓI cần truyền đạt

- Ưu thế lớn nhất không phải “tìm từ nhanh hơn mọi cấu trúc”, mà là tổ chức và truy vấn theo *cấu trúc tiền tố*.
- Việc mở rộng node làm tăng bộ nhớ và chi phí cập nhật; nêu rõ đây là đánh đổi.

## Slide 17 — Điểm yếu và chi phí bị che khuất

### Nội dung HIỂN THỊ trên slide

- Mảng 26 nhánh/node lãng phí khi cây thưa; bảng chữ cái lớn làm vấn đề nặng hơn.
- Bộ nhớ tối đa trong code mảng tĩnh phụ thuộc `MAXN`, không chỉ node thực dùng.
- Truy cập nhiều node rời rạc; chi phí cache/cấp phát có thể kém so với mảng liên tiếp.
- Trie thông thường chỉ khớp **tiền tố từ gốc**; không tự giải tìm *substring* bất kỳ.
- Với tìm từ chính xác đơn thuần, hash table có thể đơn giản và hiệu quả hơn.

### Nội dung NÓI cần truyền đạt

- Phân biệt “không áp dụng được trực tiếp” và “có thể nhưng không đáng dùng”.
- Tìm `ple` trong `apple` là truy vấn chuỗi con, không phải duyệt `a→p→...` từ root; cần thuật toán/chỉ mục khác hoặc biến thể (suffix trie/tree, suffix automaton...).
- Nếu dữ liệu là Unicode lớn, không thể bê nguyên `child[26]` vào.

## Slide 18 — Checklist nhận diện bài toán phù hợp

### Nội dung HIỂN THỊ trên slide

**Nên cân nhắc Trie khi:**
- Dữ liệu có thể xem như chuỗi ký hiệu hoặc chuỗi bit.
- Có nhiều truy vấn theo tiền tố / từ điển / nhánh tiền tố.
- Cần mở rộng thông tin theo các node trên đường đi.
- Bộ nhớ cho cấu trúc node còn trong giới hạn.

**Không nên mặc định chọn Trie khi:**
- Chỉ tìm khóa chính xác hoặc chỉ có rất ít truy vấn.
- Truy vấn chính là chuỗi con bất kỳ, khoảng số không theo tiền tố, hoặc điều kiện không có cấu trúc prefix rõ ràng.
- Bảng chữ cái quá lớn và cài đặt nhánh cố định gây lãng phí.

### Nội dung NÓI cần truyền đạt

- Đây là **bộ câu hỏi ra quyết định**, không phải điều kiện toán học cứng tuyệt đối.
- Với bài toán không theo tiền tố, đôi khi đổi cách biểu diễn dữ liệu vẫn đưa về Trie được (ví dụ bit số nguyên); nhưng phải chứng minh việc chuyển đổi hữu ích.

---

# PHẦN VI — CÁC DẠNG BÀI TOÁN ỨNG DỤNG VÀ MỞ RỘNG (8 phút)


> Phần này giới thiệu bức tranh tổng quan của các **dạng bài toán**, không triển khai đầy đủ code. Các thông tin mở rộng như `passCount`, kích thước cây con... chỉ được đưa vào tại đây.

## Slide 19 — Truy vấn tiền tố và đếm số từ có cùng tiền tố (1,5 phút)

### Nội dung HIỂN THỊ trên slide

- Bài toán: Với tập `app`, `apple`, `ape`, `bat`, `bath`, có bao nhiêu từ bắt đầu bằng `ap`?
- Kết quả: `3` (tính theo số lần từ xuất hiện).
- Tư tưởng: thêm bộ đếm `passCount[u]` = số lần các từ hiện tại đi qua node `u`.
- Truy vấn: duyệt đến node biểu diễn `ap`, đọc bộ đếm; mất `O(|p|)`.

### Nội dung NÓI cần truyền đạt

- Trie nguyên thủy chỉ cho ta cấu trúc đường đi; muốn đếm nhanh số từ theo tiền tố, ta **bổ sung thông tin phù hợp bài toán**.
- Khi chèn/xóa, cập nhật bộ đếm tại các node trên đường đi để luôn phản ánh các từ đang lưu.
- Phân biệt rõ `passCount` (tổng số từ có tiền tố này) với `endCount` (số từ kết thúc đúng ở đây).

## Slide 20 — Thứ tự từ điển và từ thứ k (1,5 phút)

### Nội dung HIỂN THỊ trên slide

- Dãy theo thứ tự từ điển: `ape`, `app`, `apple`, `bat`, `bath`.
- Yêu cầu: tìm từ ở vị trí `k` (ví dụ `k = 3` ⇒ `apple`).
- Ý tưởng: duyệt các cạnh `a → z`; một từ kết thúc tại node được xét **trước** các từ dài hơn bắt đầu bằng từ đó.
- Lưu **số từ trong từng cây con** để bỏ qua cả nhánh không chứa vị trí `k`.
- Một đường cây minh họa nhánh `a` có 3 từ, nhánh `b` có 2 từ.

### Nội dung NÓI cần truyền đạt

- Nếu chỉ muốn liệt kê từ theo thứ tự từ điển: DFS các cạnh theo thứ tự chữ cái; ghi nhận từ ở node hiện tại trước khi đi xuống con.
- Với từ thứ `k`, dùng số lượng từ trong từng nhánh để quyết định đi vào hay bỏ qua cả nhánh, thay vì liệt kê `k` từ đầu tiên.
- Đây là mẫu tư duy **gắn thống kê lên cây để tăng tốc truy vấn**. Nếu cho phép từ lặp, cần quy ước chúng có chiếm nhiều vị trí hay không; trong ví dụ này mỗi từ xuất hiện một lần.

## Slide 21 — Tiền tố chung dài nhất (LCP) (1,5 phút)

### Nội dung HIỂN THỊ trên slide

- Bài toán: Tìm tiền tố chung dài nhất của các từ `flower`, `flow`, `flight` ⇒ `fl`.
- Hình Trie nhỏ: đường chung `f → l`, sau đó phân nhánh.
- Tư tưởng: từ gốc đi tiếp khi **mọi từ còn cùng đi theo một cạnh**, dừng khi phân nhánh hoặc có từ kết thúc.
- Gợi ý ứng dụng: gom nhóm từ có tiền tố chung, truy vấn tiền tố.

### Nội dung NÓI cần truyền đạt

- Độ sâu đoạn đường chung từ root cho ta độ dài LCP; Trie khiến đặc điểm này rất trực quan.
- Đối với LCP của **toàn bộ tập**, chỉ đi tiếp khi có một cạnh chung cho tất cả các từ và chưa có từ nào kết thúc; không đơn giản là cứ đi theo cạnh duy nhất trong một Trie sau khi đã xóa logic mà chưa dọn node.
- Nhắc rằng bài toán LCP cũng có những giải pháp đơn giản khác; Trie đáng dùng hơn khi cần nhiều truy vấn/ứng dụng liên quan.

## Slide 22 — Binary Trie và tối đa hóa XOR (1,5 phút)

### Nội dung HIỂN THỊ trên slide

- Binary Trie: thay ký tự `a`–`z` bằng bit `0` và `1`; biểu diễn số nguyên với **cùng số bit** (ví dụ 4 bit).
- Bài toán: cho tập `{3, 5, 10}`, tìm `x` tối đa hóa `x XOR 6`.
- Ví dụ: `3 XOR 6 = 5`, `5 XOR 6 = 3`, `10 XOR 6 = 12` ⇒ chọn `10`.
- Quy tắc tham lam: xét từ bit cao xuống thấp; **ưu tiên nhánh bit đối nghịch**, nếu không tồn tại thì theo nhánh còn lại.
- Hình nhánh 0/1 với bit của `6 = 0110` và ứng viên `10 = 1010`.
- Chi phí truy vấn: `O(B)` với `B` là số bit cố định.

### Nội dung NÓI cần truyền đạt

- Trie là cây của **dãy ký hiệu**; xâu chữ chỉ là trường hợp quen thuộc, còn số nguyên có thể xem như chuỗi bit.
- XOR nhận giá trị 1 ở vị trí bit khi hai bit khác nhau. Bit cao có trọng số lớn hơn tổng các bit thấp, nên ưu tiên làm bit XOR cao bằng 1 nếu khả thi.
- Vì thế quy tắc chọn nhánh đối nghịch từ cao xuống thấp là hợp lý; sau đó mới tối ưu ở bit thấp.
- Không cần code ở slide này: mục tiêu là giới thiệu một dạng bài khác hẳn truy vấn xâu và mở rộng khả năng nhận diện Trie.

## Slide 23 — Mở rộng: Aho–Corasick và failure link (khoảng 2 phút)

### Nội dung HIỂN THỊ trên slide

- **Bài toán mới:** Cho nhiều mẫu, ví dụ `he`, `she`, `hers`, `his`. Tìm mọi vị trí các mẫu xuất hiện trong một văn bản dài.
- **Ý tưởng:** Đặt các mẫu vào cùng một Trie, bổ sung **failure link** để không phải khởi động lại quá trình khớp từ đầu mỗi khi không đi tiếp được.
- **Failure link** từ node biểu diễn xâu `s` trỏ đến node biểu diễn **hậu tố thực sự dài nhất của `s` đồng thời là tiền tố của ít nhất một mẫu** (không có thì về gốc).
- **Ví dụ trực quan:** `fail("she") = "he"`. Cạnh Trie vẽ nét liền, failure link vẽ nét đứt từ node `she` sang node `he`.
- Kết luận trên slide: **Trie + failure link + thông tin mẫu kết thúc → Aho–Corasick**, tìm nhiều mẫu trong một lượt quét văn bản.

### Nội dung NÓI cần truyền đạt

- Trie cơ bản rất tốt để kiểm tra các từ từ **đầu xâu**; nhưng khi cần tìm đồng thời nhiều từ ở **mọi vị trí** trong văn bản, việc khởi động phép tìm kiếm từ từng vị trí sẽ bị lặp lại nhiều lần.
- Failure link giúp giữ lại phần hậu tố đã đọc mà vẫn có ích cho một mẫu khác. Với `she`, hậu tố `he` cũng là tiền tố (thực tế là toàn bộ) của mẫu `he`, nên có liên kết `she → he`.
- **Phân biệt:** Failure link không đơn giản là “quay về node cha” hay “quay lại gốc”; nó dẫn tới hậu tố *dài nhất còn hữu ích*. Khi chuyển qua failure link, thuật toán có thể cần tiếp tục theo các link hoặc cạnh thích hợp.
- Bởi vậy, ngoài tìm được `she`, hệ thống cũng có thể nhận ra `he` kết thúc tại cùng vị trí trong văn bản. Việc báo đầy đủ các mẫu cần thêm thông tin đầu ra, không chỉ riêng failure link.
- Không trình bày code, BFS xây failure link hay chứng minh độ phức tạp tại đây; đây là **slide giới thiệu hướng học tiếp**, không phải phần dạy Aho–Corasick hoàn chỉnh.

### Gợi ý hình minh họa

- Vẽ Trie của `he`, `she`, `hers`, `his` với node kết thúc từ được tô nổi bật.
- Vẽ riêng **một mũi tên nét đứt** từ node `she` sang node `he`, nhãn `fail`, tránh làm hình quá rối.
- Tham khảo: [Aho–Corasick (Tufts)](https://www.cs.tufts.edu/comp/150GEN/classpages/AhoCorasick.html).

---

# PHẦN VII — ỨNG DỤNG TRONG HỆ THỐNG THỰC TẾ (6 phút)

> Phải phân biệt **một tính năng có thể được cài bằng Trie** với **một sản phẩm cụ thể đã xác nhận sử dụng Trie**. Không khẳng định mọi ứng dụng gợi ý tìm kiếm đều dùng Trie.

## Slide 24 — Gợi ý tìm kiếm và autocomplete

### Nội dung HIỂN THỊ trên slide

- Tình huống quen thuộc: gõ `app` vào ô tìm kiếm → xuất hiện `apple`, `application`, ...
- Ý tưởng: đến node tiền tố `app`, duyệt các kết quả trong cây con; có thể lưu thêm độ phổ biến để xếp hạng.
- Ví dụ xác minh được: **Redis Search autocomplete dùng compact trie** để mã hóa các từ và tìm theo tiền tố. [Tài liệu Redis](https://redis.io/docs/latest/develop/ai/search-and-query/administration/overview/).
- Lưu ý: tính năng gợi ý của các ứng dụng khác **không nhất thiết** dùng cùng một cấu trúc.

### Nội dung NÓI cần truyền đạt

- Mô phỏng việc nhập từng chữ và tái sử dụng tiền tố đã đi qua, sau đó mới nói đến thứ hạng và mức độ phổ biến.
- Trie thường là *một thành phần* của hệ thống autocomplete, chứ không phải giải pháp đầy đủ cho gợi ý theo ngữ cảnh, lỗi chính tả và cá nhân hóa.

## Slide 25 — Router Internet: Longest Prefix Match

### Nội dung HIỂN THỊ trên slide

- Router nhận IP đích, chọn tuyến có **tiền tố mạng khớp dài nhất**.
- Ví dụ: `192.168.0.0/16 → A`; `192.168.1.0/24 → B`.
- Với `192.168.1.42`, tuyến `/24` được ưu tiên.
- Dùng **trie theo bit/biến thể trie nén** để lưu tiền tố địa chỉ; độ dài địa chỉ cố định 32 bit (IPv4) hoặc 128 bit (IPv6).
- Có nghiên cứu thực nghiệm về cấu trúc trie cho tra cứu IP: [Lin & Hsieh, 2023](https://www.sciencedirect.com/science/article/pii/S0022000022000733).

### Nội dung NÓI cần truyền đạt

- Đây là ứng dụng tiền tố không liên quan đến từ điển: “chữ cái” bây giờ là bit 0 hoặc 1.
- Làm rõ longest-prefix-match khác với tìm khóa IP giống hệt; không cần gán một triển khai cụ thể cho mọi loại router.

## Slide 26 — Gõ sai, tìm nhiều mẫu và những hệ thống nâng cao

### Nội dung HIỂN THỊ trên slide

- **Kiểm tra chính tả / fuzzy search:** Trie kết hợp cơ chế đánh giá khoảng cách sửa (edit distance) để tìm từ gần đúng.
- **Tìm đồng thời nhiều mẫu:** Aho–Corasick mở rộng Trie bằng failure link (đã giới thiệu ở Slide 23).
- **Chỉ mục và từ điển lớn:** Compressed Trie / Radix Tree / Patricia Tree giảm chuỗi node một con.
- Bài học: Trie thường là **nền tảng của thuật toán lớn hơn**, không phải toàn bộ hệ thống.

### Nội dung NÓI cần truyền đạt

- Không nói Trie đơn thuần có thể tự sửa chính tả; cần thêm thuật toán phụ trợ.
- Có thể đối chiếu với Redis hỗ trợ gợi ý gần đúng bằng Levenshtein automaton, khác với prefix search thuần túy.
- Nhắc lại Aho–Corasick ở Slide 23 như một ví dụ tiêu biểu; không giải thích lại failure link. Đây là phần tổng quan ứng dụng, không dạy trọn Aho–Corasick hoặc Patricia.

---

# PHẦN VIII — TỔNG KẾT (2 phút)

## Slide 27 — Kết luận: Khi nào Trie là lựa chọn đúng?

### Nội dung HIỂN THỊ trên slide

1. Trie tận dụng **tiền tố chung** để tổ chức khóa dạng dãy.
2. Thời gian thao tác theo chiều dài khóa; bộ nhớ phụ thuộc bảng chữ cái và số node.
3. `N ≤ 1+nL` là cận an toàn; `1+Σ min(n,σ^d)` là cận chặt theo giới hạn đầu vào.
4. So sánh với hashing, binary search và BST trước khi chọn.
5. Ứng dụng: autocomplete, tra cứu tuyến mạng, truy vấn từ điển và Aho–Corasick (tìm nhiều mẫu).

**Câu kết:** “Trie mạnh khi tiền tố là cấu trúc quan trọng của bài toán, không phải vì nó luôn nhanh nhất.”

### Nội dung NÓI cần truyền đạt

- Nhắc lại câu hỏi đầu bài: khi người dùng tìm từ theo những ký tự đầu tiên, ta muốn tổ chức dữ liệu theo tiền tố hay chỉ lưu các chuỗi rời rạc?
- Đề nghị người nghe tự trả lời: trong một hệ thống chỉ cần kiểm tra khóa chính xác, liệu Trie có còn là lựa chọn hợp lý nhất?
- Tài liệu tham khảo: VNOI Wiki; Redis Search documentation; nghiên cứu IP lookup (Lin & Hsieh, 2023).
