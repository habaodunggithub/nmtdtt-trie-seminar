---
theme: default
layout: default
title: Trie — Cây tiền tố
info: |
  Seminar Nhập môn tư duy thuật toán.
  Dựa trên NMTDTT-Nội-Dung-Slide-Trie.md.
colorSchema: light
htmlAttrs:
  lang: vi
fonts:
  sans: 'Nunito'
  mono: 'Noto Sans Mono'
  local: 'Nunito, Baloo 2, Noto Sans Mono'
  provider: none
aspectRatio: 16/9
canvasWidth: 980
duration: 55min
transition: fade
highlighter: shiki
mdc: false
drawings:
  enabled: false
---

<StudentTrieCover />

<!--
Giới thiệu chủ đề Trie (Prefix Tree) trong học phần Nhập môn tư duy thuật toán.
Dẫn vào câu hỏi: làm sao tìm từ và trả lời truy vấn tiền tố hiệu quả?
Trang bìa dùng Trie của 4 MSSV: 24120093 — Lê Quang Minh; 24120022 — Hà Văn Thiên Bảo; 24120225 — Trịnh Văn Thành; 24120214 — Nguyễn Ngọc Phúc.
Bấm Chạy thử để lần lượt tìm từng mã. Chỉ khi đi hết mã và node kết thúc tồn tại mới hiện MSSV cùng tên; các thành viên đã tìm được giữ trên trang bìa.
-->

---
section: SƯỜN BÀI THUYẾT TRÌNH
---

# Nội dung trình bày

<div class="agenda-grid">
<div class="agenda-item"><span>01</span><h2>Đặt vấn đề và ý tưởng Trie</h2></div>
<div class="agenda-item"><span>02</span><h2>Cài đặt và thao tác cơ bản</h2></div>
<div class="agenda-item"><span>03</span><h2>Độ phức tạp và bộ nhớ</h2></div>
<div class="agenda-item"><span>04</span><h2>So sánh trên cùng bài toán</h2></div>
<div class="agenda-item"><span>05</span><h2>Điểm mạnh, hạn chế và lựa chọn</h2></div>
<div class="agenda-item"><span>06</span><h2>Bài toán ứng dụng và mở rộng</h2></div>
<div class="agenda-item"><span>07</span><h2>Ứng dụng trong hệ thống thực tế</h2></div>
<div class="agenda-item"><span>08</span><h2>Tổng kết</h2></div>
</div>

<!--
Giới thiệu lộ trình gồm tám phần: từ ý tưởng, thao tác và chi phí đến so sánh, lựa chọn, mở rộng và ứng dụng thực tế; cuối cùng tổng kết.
-->

---
section: 01 / Ý TƯỞNG
---

<div class="section-divider">
<div class="eyebrow">PHẦN I</div>
<div class="section-heading"><span class="section-number">01</span><h1>Đặt vấn đề và ý tưởng Trie</h1></div>
<p class="section-subtitle">Từ bài toán tìm từ đến cách tổ chức dữ liệu theo tiền tố.</p>
</div>

<!--
Chuyển sang phần I: Đặt vấn đề và ý tưởng Trie.
-->

---
sourceSlide: 1
---

# Tìm từ trong một danh sách lớn

<div class="focus-content">

<div class="word-strip"><code>app</code><code>apple</code><code>ape</code><code>bat</code><code>bath</code></div>

- Có từ `apple` không?
- Bao nhiêu từ bắt đầu bằng `ap`?

</div>

<!--
Chỉ đặt bài toán; cho người nghe đề xuất cách làm trước khi chuyển trang. Hai câu hỏi lần lượt là tìm chính xác và đếm theo tiền tố.
-->

---
sourceSlide: 1
---

# Duyệt tuyến tính

<div class="focus-content">

Duyệt từng từ → so sánh → tìm / đếm.

| Truy vấn | Chi phí xấu nhất |
|---|---|
| Tìm từ | $O(nL)$ |
| Đếm tiền tố | $O(n\lvert p\rvert)$ |

<div class="small">n: số từ · L: độ dài tối đa · |p|: độ dài tiền tố (≤ L).</div>

</div>

<!--
Một lần so sánh có thể đọc đến L ký tự. Đếm tiền tố cần kiểm tra tất cả n từ, mỗi lần tối đa |p| ký tự. Nhiều từ chung phần đầu nhưng mỗi truy vấn lại kiểm tra lặp lại. Các lựa chọn sắp xếp, set/map cũng hợp lý; không khẳng định Trie luôn thắng. Chuyển ý: con người tra từ điển có đọc từ đầu đến cuối không?
-->

---
sourceSlide: 2
---

# Tra từ điển bằng cách thu hẹp tiền tố

<div class="focus-content">

<div class="sequence"><span>A</span>→<span>AP</span>→<span>APP</span>→<span>APPLE</span></div>

Mỗi ký tự thu hẹp nhóm từ cần xét.

**Các từ chung phần đầu có thể được gom lại.**

</div>

<!--
Đây là phép so sánh trực giác với từ điển giấy đã sắp xếp, không khẳng định người tra thực hiện thuật toán Trie hay có thời gian O(L). Mục tiêu là dẫn đến việc chia sẻ tiền tố.
-->

---
sourceSlide: 2
---

# Trie biểu diễn tiền tố như thế nào?

<div class="cols">
<div>

- Mỗi cạnh mang **một ký tự**.
- Đường đi từ gốc tạo thành **một tiền tố**.
- Gốc là xâu rỗng.
- Từ chung phần đầu dùng chung đường đi.

</div>
<div class="sketch-panel"><TrieDiagram :words="['app','apple','ape']" highlight="ap" :height="310" /></div>
</div>

<!--
app, apple và ape cùng dùng đường a → p. Khác với quét từng từ, ta chỉ chọn nhánh ứng với ký tự đang xét. Với truy cập cạnh O(1), đi theo xâu s cần tối đa |s| bước.
-->

---
sourceSlide: 3
---

# Có đường đi chưa chắc có từ

<div class="cols">
<div>

Chỉ chèn `apple` và `ape`.

| Xâu | Có đường | Đã chèn |
|---|---|---|
| apple | ✓ | ✓ |
| ape | ✓ | ✓ |
| app | ✓ | **Không** |

</div>
<div class="sketch-panel"><TrieDiagram :words="['apple','ape']" highlight="app" :height="310" /></div>
</div>

<!--
app có đường đi vì là tiền tố của apple. Chưa thể dùng riêng sự tồn tại của cạnh để kết luận từ đã được thêm. Đặt câu hỏi: cần đánh dấu điều gì ở cuối từ?
-->

---
sourceSlide: 3
---

# Đánh dấu từ bằng endCount

<div class="cols">
<div>

`endCount[u]`: số lần một từ kết thúc tại node u.

- Có từ hoàn chỉnh khi **endCount[u] > 0**.
- Chèn `app` hai lần → **endCount[app] = 2**.
- Node kết thúc từ vẫn có thể có con.

</div>
<div class="sketch-panel"><TrieDiagram :words="['app','app','apple']" highlight="app" :height="310" /></div>
</div>

<!--
Dùng bộ đếm thay boolean để hỗ trợ từ trùng. endCount chỉ tính những từ kết thúc đúng tại node, không tính tất cả từ trong cây con. Vòng kép biểu diễn kết thúc từ; apple vẫn tiếp tục sau app.
-->

---
section: 02 / THAO TÁC
---

<div class="section-divider">
<div class="eyebrow">PHẦN II</div>
<div class="section-heading"><span class="section-number">02</span><h1>Cài đặt và thao tác cơ bản</h1></div>
<p class="section-subtitle">Biểu diễn Trie · Chèn · Tìm · Xóa</p>
</div>

<!--
Chuyển sang phần II: Cài đặt và thao tác cơ bản.
-->

---
sourceSlide: 4
---

# Lưu Trie bằng mảng hai chiều

<div class="cols">
<div>

```cpp
int trie[MAXN][26];
int endCount[MAXN];
int nodeCount = 1; // root = 1
```

`trie[u][c]`: chỉ số node con.

**0 = thiếu cạnh.**

</div>
<div class="sketch-panel"><ConceptSketch type="memory" :height="310" /></div>
</div>

<!--
Các mảng đặt toàn cục/static để được khởi tạo 0. MAXN phải đủ lớn. Có 26 liên kết/node cho a–z. Bộ nhớ được cấp theo MAXN, kể cả hàng chưa dùng. Các đoạn code chính sau đây dùng cách lưu này.
-->

---
sourceSlide: 4
---

# Lưu Trie bằng node và con trỏ

<div class="cols">
<div>

```cpp
struct Node {
    Node* child[26]{};
    int endCount = 0;
};
```

`child[c]`: con trỏ đến node con.

**nullptr = thiếu cạnh**.

</div>
<div class="sketch-panel"><ConceptSketch type="memory" :height="310" /></div>
</div>

<!--
Cùng một cấu trúc Trie, liên kết bằng địa chỉ thay vì chỉ số. Cấp phát node khi cần; có chi phí cấp phát và mỗi con trỏ có thể lớn hơn int. Vẫn có 26 ô liên kết/node, nên không tự động tiết kiệm bộ nhớ. Từ trang sau trở lại cách lưu bằng mảng.
-->

---
sourceSlide: 5
---

# Chèn từ

<div class="cols code-demo">
<div>

```cpp
void insert(const string& s) {
    int u = 1;
    for (char ch : s) {
        int c = ch - 'a';
        if (!trie[u][c])
            trie[u][c] = ++nodeCount;
        u = trie[u][c];
    }
    ++endCount[u];
}
```


</div>
<div class="sketch-panel"><TrieDemo mode="insert" /></div>
</div>

<!--
- Chỉ tạo node khi không có cạnh; các tiền tố đã xuất hiện được dùng lại.
- Vì vậy mỗi ký tự được xử lý một lần; với xâu dài `L`, thời gian `O(L)`.
- Cuối cùng đánh dấu từ bằng cách tăng `endCount` ở **node cuối cùng**, không phải mọi node trên đường đi.
- Giả định mảng đã khởi tạo bằng 0 và `MAXN` đủ lớn để tránh vượt giới hạn.

- Từ gốc → tạo cạnh thiếu → tăng endCount ở cuối · O(|s|).
-->

---
sourceSlide: 6
---

# Tìm node theo một xâu

<div class="cols">
<div>

```cpp
int findNode(const string& s) {
    int u = 1;
    for (char ch : s) {
        u = trie[u][ch - 'a'];
        if (u == 0) return 0;
    }
    return u;
}
```


</div>
<div class="sketch-panel"><TrieDiagram :words="['apple','ape']" highlight="app" :height="310" /></div>
</div>

<!--
Đây là hàm duyệt chung, chưa kết luận từ hoàn chỉnh có tồn tại. Bắt đầu ở root=1, đi theo từng ký tự, dừng ngay nếu thiếu cạnh. Tối đa |s| bước.
-->

---
sourceSlide: 6
---

# Kiểm tra tiền tố: có đường đi không?

<div class="cols">
<div>

Với `u = findNode(p)`:

<div class="callout"><b>StartsWith: u != 0</b></div>

Đã chèn `apple`, `ape`.

`app` là tiền tố → **đúng**.


</div>
<div class="sketch-panel"><TrieRun mode="prefix" query="app" :words="['apple','ape']" /></div>
</div>

<!--
Ở đây cây chưa xóa từ. Tiền tố chỉ yêu cầu đi hết đường p, không cần endCount>0. Cảnh báo về nhánh cũ sau xóa sẽ được giải thích riêng ở phần xóa.
-->

---
sourceSlide: 6
---

# Tìm từ: có điểm kết thúc không?

<div class="cols">
<div>

Với `u = findNode(s)`:

<div class="callout"><b>Search: u && endCount[u] > 0</b></div>

Đã chèn `apple`, `ape`.

`app` có đường đi nhưng **chưa phải từ đã lưu**.

</div>
<div class="sketch-panel"><TrieDemo mode="search" /></div>
</div>

<!--
Demo kiểm tra app trong cây chỉ lưu apple và ape. Cùng đường đi với StartsWith nhưng khác điều kiện kết luận. endCount cần thiết để phân biệt từ và tiền tố. Cả hai kiểm tra đều O(|s|).
-->

---
sourceSlide: 7
---

# Xóa một lần xuất hiện

<div class="cols">
<div>

```cpp
void eraseOne(const string& s) {
    int u = findNode(s);
    if (u && endCount[u] > 0)
        --endCount[u];
}
```

Giảm `endCount`. 

Giữ các node.

</div>
<div class="sketch-panel"><TrieDemo mode="delete" /></div>
</div>

<!--
Chạy demo app có bộ đếm 2 → 1 → 0; apple vẫn còn. Không giảm khi từ không tồn tại để tránh âm. Đây là xóa logic, không thu hồi node. Tìm node rồi giảm nên chi phí O(|s|).
-->

---
sourceSlide: 7
---

# Sau xóa, đường cũ có thể vẫn còn

<div class="cols">
<div>

Chèn `app`, rồi xóa lần xuất hiện duy nhất.

- `endCount[app] = 0` → Search trả **sai**.
- Đường `a → p → p` vẫn còn.
- StartsWith cần **bộ đếm đi qua** hoặc **dọn nhánh**.

</div>
<div class="sketch-panel"><TrieDiagram :words="[]" :topology-words="['app']" :height="310" /></div>
</div>

<!--
Ví dụ trên trang này chỉ có app, khác demo xóa trước đó còn apple. Không dùng sự tồn tại cạnh để suy ra còn từ sống mang tiền tố. Cần passCount cập nhật khi chèn/xóa hoặc xóa vật lý nhánh không dùng. Bài này không triển khai xóa vật lý.
-->

---
sourceSlide: 8
---

# Điểm chung: duyệt một đường theo ký tự

<div class="cols">
<div>

<div class="sequence"><span>Gốc</span>→<span>a</span>→<span>p</span>→<span>p</span></div>

Mỗi ký tự chọn một cạnh.

**Không cần xét từng từ riêng lẻ.**

</div>
<div class="sketch-panel"><TrieDiagram highlight="app" :height="310" /></div>
</div>

<!--
Tổng hợp bằng một nguyên lý chung thay vì lặp lại cả bốn thao tác. Insert tạo cạnh thiếu; Search kiểm tra kết thúc; StartsWith kiểm tra tiền tố còn sống; Delete giảm bộ đếm. Chuyển sang chi phí của một lượt duyệt.
-->

---
section: 03 / CHI PHÍ
---

<div class="section-divider">
<div class="eyebrow">PHẦN III</div>
<div class="section-heading"><span class="section-number">03</span><h1>Độ phức tạp và bộ nhớ</h1></div>
<p class="section-subtitle">Thời gian truy vấn · Số node · Chi phí lưu trữ</p>
</div>

<!--
Chuyển sang phần III: Độ phức tạp và bộ nhớ.
-->

---
sourceSlide: 9
---

# Thời gian phụ thuộc độ dài xâu

<div class="focus-content">

| Thao tác | Thời gian |
|---|---|
| Chèn / tìm / kiểm tra tiền tố / xóa logic | $O(L)$ |
| Xây Trie từ toàn bộ dữ liệu | $O(S)$ |

$$S=\sum_i |s_i|\le nL$$

</div>

<!--
Mỗi thao tác theo một đường, nên không nhân với số từ n. L là độ dài tối đa; một xâu cụ thể dài |s| mất O(|s|). Xây toàn bộ là O(S), khác với chi phí khởi tạo mảng cấp sẵn.
-->

---
sourceSlide: 9
---

# Từ số node đến bộ nhớ cấp phát

<div class="cols">
<div>

N node, gồm gốc. Gốc đánh số 1.

**MAXN ≥ N + 1** vì chỉ số 0 dành cho thiếu cạnh.

Mảng `trie` và `endCount` chiếm:

<div class="memory-size-detail"><strong>MAXN × 27 × sizeof(int) byte</strong></div>

</div>
<div class="sketch-panel"><ConceptSketch type="memory" :height="310" /></div>
</div>

<!--
Phân biệt số node N, số hàng MAXN và số byte. Với int 4 byte, bộ nhớ hai mảng là MAXN × 27 × 4 byte, chưa gồm bộ nhớ khác. Mảng quá nhỏ gây vượt biên; quá lớn dễ vượt giới hạn. Con trỏ cấp node khi cần nhưng còn chi phí địa chỉ và cấp phát.
-->

---
sourceSlide: 10
---

# Cần tối đa bao nhiêu node?

<div class="cols node-bound-layout">
<div>

Mỗi ký tự thêm tối đa **1 node**.

<div class="bound-formula">

$$N\le 1+nL$$

</div>

<div class="small">n từ · dài tối đa L ký tự · N gồm gốc</div>
<p class="bound-simple-example">Ví dụ: 1.000 từ, tối đa 20 ký tự/từ → <strong>N ≤ 20.001</strong>.</p>
</div>
<div class="sketch-panel bound-diagram"><TrieRun mode="build" :words="['app','apple','ape']" :height="210" :step-ms="450" show-node-count /></div>
</div>

<!--
- Một node gốc, mỗi ký tự thêm tối đa một node. Cận đầy đủ: N ≤ 1 + Σ|s_i| ≤ 1 + nL.
- Với 1.000 từ dài tối đa 20 ký tự, cận đơn giản là 20.001 node; không phải số node thực tế hay cận chặt nhất.
- Demo chèn app, apple, ape: n=3, L=5 nên cận đơn giản 1+nL=16 node; bộ đếm trên cây tăng theo các node thực sự được tạo và kết thúc ở 7 node, kể cả gốc.
- Tổng độ dài là 11 nên cận theo tổng độ dài là 12 node, nhỏ hơn cận đơn giản 16. Không nhầm cả hai cận này với số node thực tế 7.
- Đây là cách ước lượng nhanh để cấp phát mảng trie[MAXN][26]. Theo quy ước gốc=1, cần MAXN ≥ N+1 để chừa chỉ số 0.
- Cận này có thể còn dư. Chuyển sang đếm theo độ sâu để siết cận ở trang tiếp theo.
-->

---
sourceSlide: 11
---

# Đếm node theo từng tầng

<div class="cols">
<div>

Tầng d có tối đa **min(n, σᵈ)** node.

$$N_{\max}=1+\sum_{d=1}^{L}\min(n,\sigma^d)$$

<div class="small">σ: số ký tự · n: số từ · L: độ dài tối đa.</div>

</div>
<div class="sketch-panel"><DepthCountDemo /></div>
</div>

<!--
Tầng d bị chặn đồng thời bởi số từ n và số tiền tố độ dài d là σ^d. Với σ≥2, chọn n xâu dài L có tiền tố phân bố đủ đều để đạt cận. Đây là số node, không phải byte; mảng cần ít nhất N_max+1 hàng. Nếu biết n_d là số từ dài ít nhất d, siết tiếp N ≤ 1 + Σ min(n_d,σ^d).

Liên hệ nâng cao: N thực tế = 1 + số tiền tố không rỗng phân biệt. Với các từ đã sắp xếp: N = 1 + |s_1| + Σ(i=2..n)(|s_i| − LCP(s_{i−1},s_i)). Công thức LCP tính bộ từ cụ thể, không phải cận tối ưu chỉ từ n,L,σ.
-->

---
sourceSlide: 11
---

# Ví dụ: 1.000 từ dài tối đa 20 ký tự

<div class="focus-content">

Bảng chữ cái có **26** ký tự.

| Tầng | Số node tối đa |
|---|---|
| 1 | 26 |
| 2 | 676 |
| 3–20 | 18 × 1.000 |
| **Tổng, gồm gốc** | **18.703** |

Cận đơn giản **20.001** → cận theo tầng **18.703**.

</div>

<!--
Áp dụng công thức vừa giới thiệu thay vì giới thiệu công thức và tính số cùng lúc. Vì 26^2=676<1000 còn 26^3>1000, từ tầng 3 mỗi tầng tối đa 1000 node. MAXN tối thiểu cho cận này là 18704 theo root=1.
-->

---
section: 04 / SO SÁNH
---

<div class="section-divider">
<div class="eyebrow">PHẦN IV</div>
<div class="section-heading"><span class="section-number">04</span><h1>So sánh trên cùng bài toán</h1></div>
<p class="section-subtitle">Đối chiếu Trie với duyệt tuyến tính, mảng, set và bảng băm.</p>
</div>

<!--
Chuyển sang phần IV: So sánh trên cùng bài toán.
-->

---
sourceSlide: 12
---

# Bốn kiểu truy vấn

<div class="query-grid">
<div class="paper-card"><span class="number">A</span><h2>Tìm từ</h2><p>Có <code>apple</code> không?</p></div>
<div class="paper-card"><span class="number">B</span><h2>Kiểm tra tiền tố</h2><p>Có từ bắt đầu bằng <code>app</code>?</p></div>
<div class="paper-card"><span class="number">C</span><h2>Đếm</h2><p>Bao nhiêu từ bắt đầu bằng <code>app</code>?</p></div>
<div class="paper-card"><span class="number">D</span><h2>Liệt kê</h2><p>Lấy k từ đầu theo thứ tự từ điển.</p></div>
</div>

<!--
- Một cấu trúc xuất sắc ở truy vấn A chưa chắc xuất sắc ở B–D. Trường hợp có nhiều truy vấn (`q` lớn) cũng khác bài toán chỉ hỏi một lần.
- Với truy vấn xuất ra `k` từ, không thể nói `O(p)` cho *toàn bộ* công việc: còn chi phí liệt kê và xuất kết quả.
- Tạo một khung so sánh công bằng trước khi đi vào bảng.
-->

---
sourceSlide: 13
---

# So sánh truy vấn tìm từ chính xác

<div class="focus-content">

| Cách lưu | Tìm từ dài L |
|---|---|
| Mảng chưa sắp xếp | $O(nL)$ |
| Mảng sắp xếp + binary search | $O(L\log n)$ |
| `std::set<string>` | $O(L\log n)$ |
| `std::unordered_set<string>` | $O(L)$ kỳ vọng |
| **Trie 26 nhánh** | **$O(L)$** |

<div class="small">n: số từ · L: độ dài từ · Các cận xấu nhất, riêng hash là kỳ vọng.</div>

</div>

<!--
Băm đọc toàn bộ từ; O(L) là kỳ vọng, không bảo đảm xấu nhất. Binary search và cây cân bằng cần so sánh chuỗi, không chỉ O(log n). Trie giả định truy cập cạnh O(1). Chỉ tìm khóa chính xác thì hash thường là lựa chọn đơn giản; không kết luận Trie luôn nhanh hơn.
-->

---
sourceSlide: 13
---

# So sánh truy vấn kiểm tra tiền tố

<div class="focus-content">

| Cách lưu | Tiền tố dài p |
|---|---|
| Mảng chưa sắp xếp | $O(np)$ |
| Mảng sắp xếp + binary search | $O(p\log n)$ |
| `std::set<string>` | $O(p\log n)$ |
| `std::unordered_set<string>` | Không trực tiếp. Quét $O(np)$ |
| **Trie 26 nhánh** | **$O(p)$** |

<div class="small">n: số từ · p: độ dài tiền tố · Trie cần bộ nhớ node.</div>

</div>

<!--
Mảng sắp xếp và set có thể tìm lower_bound rồi kiểm tra tiền tố; không bắt buộc quét tất cả. Dùng set::lower_bound thành viên, tránh std::lower_bound trên iterator set vì có thể tăng chi phí duyệt iterator. Cận O(p log n) đòi hỏi cách tìm biên/so sánh theo p ký tự thích hợp. Trie sau xóa cần passCount hoặc dọn nhánh để trả lời về từ đang lưu.
-->

---
sourceSlide: 14
---

# So sánh truy vấn đếm tiền tố

<div class="cols">
<div>

Tiền tố dài p:

- Trie + `passCount`: **O(p)**.
- Mảng sắp xếp: tìm hai biên, **O(p log n)**.

<div class="small">passCount là thống kê bổ sung cho bài toán đếm.</div>

</div>
<div class="sketch-panel"><ConceptSketch type="prefix" :height="310" /></div>
</div>

<!--
Trie nguyên thủy không tự có số từ cây con; phải lưu và duy trì passCount. Mảng sắp xếp dùng hai biên với so sánh tiền tố phù hợp. Xét tổng chi phí xây dựng + q × chi phí truy vấn, nhất là khi q lớn; không tự gán thời gian mili giây khi chưa benchmark.
-->

---
sourceSlide: 14
---

# Liệt kê gợi ý còn có chi phí đầu ra

<div class="cols">
<div>

Đến node tiền tố → duyệt cây con → xuất từ.

**O(p) chỉ là chi phí tìm node tiền tố.**

Còn thời gian duyệt các node và xuất k kết quả.

</div>
<div class="sketch-panel"><ConceptSketch type="prefix" :height="310" /></div>
</div>

<!--
Không gọi toàn bộ liệt kê là O(p). Chi phí phụ thuộc phần cây con duyệt, số kết quả và tổng độ dài từ xuất ra. Nếu chỉ lấy k gợi ý, dừng sau k kết quả; thứ tự và xếp hạng quyết định cách duyệt.
-->

---
sourceSlide: 15
---

# Chỉ tìm khóa hoặc cần thứ tự?

<div class="focus-content">

| Nhu cầu | Cấu trúc nên cân nhắc |
|---|---|
| Chỉ tìm từ chính xác | `std::unordered_set<string>` |
| Cần phần tử trước / sau | `std::set<string>` / cây cân bằng |

**Chọn theo thao tác thực sự cần hỗ trợ.**

</div>

<!--
Đây là lựa chọn cho dữ liệu không đặt truy vấn tiền tố làm trọng tâm. unordered_set có thời gian tìm kỳ vọng; set giữ thứ tự và hỗ trợ lower_bound. Không cấu trúc nào tối ưu mọi truy vấn.
-->

---
sourceSlide: 15
---

# Dữ liệu tĩnh: mảng sắp xếp là một lựa chọn

<div class="focus-content">

Sắp xếp một lần → tìm / đếm tiền tố nhiều lần.

**Mảng sắp xếp + binary search**.

- Không cần cấp node cho từng tiền tố.
- Cập nhật chèn / xóa thường tốn hơn.

</div>

<!--
Đối thủ thực sự của Trie là dữ liệu tĩnh đã sắp xếp. Đếm bằng hai biên; còn chi phí đọc ký tự trong so sánh. Đánh đổi giữa tiền xử lý, cập nhật, thời gian truy vấn và bộ nhớ.
-->

---
sourceSlide: 15
---

# Nhiều truy vấn tiền tố kèm cập nhật

<div class="cols">
<div>

**Cân nhắc Trie** khi cần:

- Chèn / xóa thường xuyên.
- Tìm hoặc đếm theo tiền tố.
- Cập nhật thống kê theo đường đi.

<div class="small">Vẫn phải kiểm tra giới hạn bộ nhớ và bảng chữ cái.</div>

</div>
<div class="sketch-panel"><ConceptSketch type="prefix" :height="310" /></div>
</div>

<!--
Không khẳng định mọi dữ liệu động đều nên dùng Trie. Nếu cần đếm hay xóa và truy vấn tiền tố còn sống, các thống kê đi qua phải cập nhật đúng. Tần suất truy vấn, bộ ký tự và giới hạn bộ nhớ quyết định lựa chọn.
-->

---
section: 05 / LỰA CHỌN
---

<div class="section-divider">
<div class="eyebrow">PHẦN V</div>
<div class="section-heading"><span class="section-number">05</span><h1>Điểm mạnh, hạn chế và lựa chọn</h1></div>
<p class="section-subtitle">Nhận diện bài toán phù hợp và các chi phí cần cân nhắc.</p>
</div>

<!--
Chuyển sang phần V: Điểm mạnh, hạn chế và lựa chọn.
-->

---
sourceSlide: 16
---

# Điểm mạnh: gom từ theo tiền tố

<div class="cols">
<div>

Các từ cùng tiền tố nằm trong **một cây con**.

Đến tiền tố dài p chỉ cần **O(p)**.

Từ đó có thể xử lý cả nhóm từ liên quan.

</div>
<div class="sketch-panel"><ConceptSketch type="prefix" :height="310" /></div>
</div>

<!--
Ưu thế chính là cấu trúc tiền tố, không phải tìm chính xác nhanh hơn mọi cấu trúc. O(p) là đi đến node, chưa gồm duyệt hay xuất cả cây con.
-->

---
sourceSlide: 16
---

# Gắn thêm thống kê lên node

<div class="cols">
<div>

Mỗi node có thể lưu:

- Tần suất xuất hiện.
- Trọng số.
- Số từ trong cây con.

**Thêm thống kê → thêm bộ nhớ và công cập nhật.**

</div>
<div class="sketch-panel"><ConceptSketch type="prefix" :height="310" /></div>
</div>

<!--
Đây là một hướng mở rộng thống nhất: gắn thông tin phù hợp truy vấn. Trie áp dụng cho dãy ký hiệu nói chung: chữ, bit, chữ số, mã phân cấp. Phần Binary Trie sẽ minh họa việc đổi bảng ký hiệu; không chỉ dùng cho chữ a–z.
-->

---
sourceSlide: 17
---

# Hạn chế: nhiều ô liên kết không dùng

<div class="cols">
<div>

Một node có **26 ô**, dù chỉ có một con.

Mảng tĩnh chiếm bộ nhớ theo **MAXN**.

Cần tính cả chi phí **cache / cấp phát**.

</div>
<div class="sketch-panel"><ConceptSketch type="memory" :height="310" /></div>
</div>

<!--
Nhánh thưa làm nhiều liên kết bỏ trống. Mảng có lợi thế lưu liên tục nhưng cấp sẵn theo MAXN; con trỏ cấp theo node nhưng có chi phí cấp phát và truy cập. Không suy ra hiệu năng chỉ từ số phép duyệt.
-->

---
sourceSlide: 17
---

# Bảng chữ cái lớn cần cách lưu khác

<div class="focus-content">

`child[26]` chỉ phù hợp với **a–z**.

Unicode hoặc tập ký hiệu lớn:

**Cần cách ánh xạ và lưu nhánh phù hợp.**

</div>

<!--
Không bê nguyên child[26] vào Unicode. Có thể dùng ánh xạ ký hiệu và cấu trúc lưu nhánh thưa phù hợp; chi phí truy cập cạnh sẽ phụ thuộc cách lưu, nên O(1) không còn là giả định tự động. Không giới thiệu một triển khai mới ở trang này.
-->

---
sourceSlide: 17
---

# Tiền tố khác chuỗi con

<div class="focus-content">

<div class="word-strip"><code>apple</code></div>

- `app`: bắt đầu từ gốc → **tiền tố**.
- `ple`: nằm giữa từ → **chuỗi con**.

**Trie cơ bản không tự giải tìm chuỗi con bất kỳ.**

-> Giải quyết bằng thuật toán Aho-corasick.

</div>

<!--
Truy vấn ple trong apple không theo đường từ root. Cần thuật toán/chỉ mục khác hoặc biến thể như suffix trie/tree, suffix automaton; phân biệt không áp dụng trực tiếp với không đáng dùng. Chỉ tìm chính xác thì hash cũng có thể đơn giản hơn.
-->

---
sourceSlide: 18
---

# Khi nào dùng Trie?

<div class="decision-grid">
<div class="paper-card"><h2>Nên cân nhắc</h2><ul><li>Dữ liệu là dãy ký hiệu / bit.</li><li>Nhiều truy vấn tiền tố.</li><li>Cần đếm theo nhánh.</li><li>Đủ bộ nhớ.</li></ul></div>
<div class="paper-card"><h2>Cân nhắc cách khác</h2><ul><li>Chỉ tìm khóa chính xác.</li><li>Có ít truy vấn.</li><li>Chuỗi con / khoảng không theo tiền tố.</li><li>Bảng nhánh quá lớn.</li></ul></div>
</div>

<!--
- Đây là **bộ câu hỏi ra quyết định**, không phải điều kiện toán học cứng tuyệt đối.
- Với bài toán không theo tiền tố, đôi khi đổi cách biểu diễn dữ liệu vẫn đưa về Trie được (ví dụ bit số nguyên); nhưng phải chứng minh việc chuyển đổi hữu ích.
-->

---
section: 06 / MỞ RỘNG
---

<div class="section-divider">
<div class="eyebrow">PHẦN VI</div>
<div class="section-heading"><span class="section-number">06</span><h1>Bài toán ứng dụng và mở rộng</h1></div>
<p class="section-subtitle">Đếm tiền tố · Từ thứ k · LCP · Binary Trie · Aho–Corasick</p>
</div>

<!--
Chuyển sang phần VI: Bài toán ứng dụng và mở rộng.
-->

---
sourceSlide: 19
---

# Đếm tiền tố bằng passCount

<div class="cols">
<div>

<div class="word-strip"><code>app</code><code>apple</code><code>ape</code><code>bat</code><code>bath</code></div>

<div class="stat-line"><b>ap → 3 từ</b></div>

Đến node `ap`, đọc **passCount**.

<div class="small">passCount: số lần xuất hiện của các từ có tiền tố này.</div>

</div>
<div class="sketch-panel"><TrieRun mode="count" /></div>
</div>

<!--
app, apple và ape có tiền tố ap. Có tính từ trùng: chèn app hai lần thì cả hai lần góp vào passCount. endCount khác passCount: chỉ đếm từ kết thúc đúng tại node. Truy vấn tiền tố p mất O(|p|) khi thống kê đã được duy trì.
-->

---
sourceSlide: 19
---

# Duy trì passCount khi dữ liệu thay đổi

<div class="cols">
<div>

- **Chèn:** tăng bộ đếm trên đường đi.
- **Xóa một từ đang có:** giảm trên đường đi.
- `endCount` chỉ thay đổi ở **node cuối**.

Bộ đếm phản ánh những từ **hiện còn lưu**.

</div>
<div class="sketch-panel"><TrieRun mode="update" /></div>
</div>

<!--
Kiểm tra từ tồn tại trước khi giảm để không đếm âm. Nếu lưu passCount cả root thì root biểu diễn tổng số lần xuất hiện. Bộ đếm đi qua giải quyết truy vấn tiền tố sau xóa logic; node có thể còn vật lý nhưng passCount=0 nghĩa là không còn từ sống trong nhánh.
-->

---
sourceSlide: 20
---

# Liệt kê theo thứ tự từ điển

<div class="cols">
<div>

- Xét từ kết thúc **trước khi xuống con**.
- Duyệt nhánh theo **a → z**.

<div class="content-example">ape → app → apple → bat → bath</div>

</div>
<div class="sketch-panel"><TrieRun mode="enumerate" /></div>
</div>

<!--
DFS cạnh theo thứ tự chữ cái. Một từ là tiền tố của từ khác đứng trước từ dài hơn, nên app trước apple. Nhánh e của ap đứng trước nhánh p, nên ape trước app. Ví dụ mỗi từ xuất hiện một lần.
-->

---
sourceSlide: 20
---

# Tìm từ thứ k bằng cách bỏ qua nhánh

<div class="cols">
<div>

Dùng **số từ trong cây con** để quyết định đi vào hay bỏ qua.

<div class="content-example"><b>k = 3 → apple</b><br>Cây con a: 3 từ · Cây con b: 2 từ.</div>

Không cần liệt kê mọi từ trước đó.

</div>
<div class="sketch-panel"><TrieRun mode="kth" :k="3" /></div>
</div>

<!--
Từ root đi nhánh a vì có 3 từ. Trong ap, nhánh e có 1 từ: bỏ qua ape, k còn 2. Ở app, từ app chiếm 1 vị trí; k còn 1 nên xuống l → e và được apple. Với từ trùng cần quy ước chiếm nhiều vị trí hay không; ví dụ mỗi từ xuất hiện một lần.
-->

---
sourceSlide: 21
---

# Tiền tố chung dài nhất

<div class="cols">
<div>
<div class="word-strip"><code>flower</code><code>flow</code><code>flight</code></div>
<div class="stat-line"><b>LCP = fl</b></div>

Đi tiếp khi mọi từ còn chung cạnh.<br>Dừng khi **phân nhánh** hoặc **có từ kết thúc**.

</div>
<div class="sketch-panel"><TrieRun mode="lcp" /></div>
</div>

<!--
- Độ sâu đoạn đường chung từ root cho ta độ dài LCP; Trie khiến đặc điểm này rất trực quan.
- Đối với LCP của **toàn bộ tập**, chỉ đi tiếp khi có một cạnh chung cho tất cả các từ và chưa có từ nào kết thúc; không đơn giản là cứ đi theo cạnh duy nhất trong một Trie sau khi đã xóa logic mà chưa dọn node.
- Nhắc rằng bài toán LCP cũng có những giải pháp đơn giản khác; Trie đáng dùng hơn khi cần nhiều truy vấn/ứng dụng liên quan.

- Ứng dụng: gom nhóm theo tiền tố chung.
-->

---
sourceSlide: 22
---

# Binary Trie: xem số như một dãy bit

<div class="cols">
<div>

Lưu các số `{3, 5, 10}` bằng **cùng 4 bit**:

| Số | Dãy bit |
|---|---|
| 3 | 0011 |
| 5 | 0101 |
| 10 | 1010 |

Mỗi cạnh mang **0** hoặc **1**.

</div>
<div class="sketch-panel"><TrieDiagram :words="['0011','0101','1010']" :height="310" :caption="false" /></div>
</div>

<!--
Trie là cây của dãy ký hiệu. Với số nguyên, thay chữ a–z bằng bit 0/1 và cố định cùng B bit. Đây là ví dụ đổi cách biểu diễn để đưa bài toán số về Trie; chưa trình bày quy tắc XOR trên trang này.
-->

---
sourceSlide: 22
---

# XOR lớn nhất: ưu tiên bit đối nghịch

<div class="cols">
<div>

Với **6 = 0110**, tìm x để x XOR 6 lớn nhất.

Từ bit cao xuống thấp: **chọn bit đối nghịch**; thiếu thì theo nhánh còn lại.

| x | x XOR 6 |
|---|---|
| 3 | 5 |
| 5 | 3 |
| **10** | **12** |

<div class="small">Cùng B bit · O(B) / truy vấn.</div>

</div>
<div class="sketch-panel"><TrieRun mode="xor" /></div>
</div>

<!--
XOR bằng 1 khi hai bit khác nhau. Bit cao có trọng số lớn hơn tổng các bit thấp, nên ưu tiên tạo 1 ở bit cao là tối ưu nếu có nhánh. Với 0110, chọn 1010 được 1100=12. Không dạy code ở đây, chỉ nguyên lý greedy theo bit.
-->

---
sourceSlide: 23
---

# Bài toán: tìm nhiều mẫu trong văn bản

<div class="cols">
<div>

Các mẫu: `he`, `she`, `hers`, `his`.

Tìm mọi vị trí xuất hiện của các mẫu.

<div class="content-example"><code>she</code> chứa cả <code>she</code> và <code>he</code>.</div>

Làm sao giữ lại phần đã đọc còn hữu ích?

</div>
<div class="sketch-panel"><TrieDiagram :words="['he','she','hers','his']" highlight="she" :height="310"  /></div>
</div>

<!--
Trie từ điển thường duyệt từ đầu xâu. Khởi động lại từ mỗi vị trí văn bản để tìm nhiều mẫu gây lặp. Chỉ nêu vấn đề và hình Trie chưa có failure link; trang sau giải thích cơ chế giữ hậu tố.
-->

---
sourceSlide: 23
---

# Aho–Corasick: giữ hậu tố bằng failure link

<div class="cols">
<div>

**Failure link:** hậu tố thực sự dài nhất còn là tiền tố của một mẫu; không có thì về gốc.

<div class="content-example"><code>fail("she") = "he"</code></div>

Trie + failure link + **thông tin đầu ra** → quét văn bản một lượt, báo cả `she` và `he`.

</div>
<div class="sketch-panel"><TrieRun mode="aho" /></div>
</div>

<!--
Failure link không nhất thiết về cha hay gốc; nó giữ hậu tố dài nhất còn hữu ích. he là hậu tố của she đồng thời là toàn bộ một mẫu. Có thể cần theo tiếp link/cạnh; báo đầy đủ mọi mẫu cần thông tin đầu ra. Đây là giới thiệu hướng học tiếp, không dạy BFS xây link, code hay chứng minh độ phức tạp.
-->

---
section: 07 / ỨNG DỤNG
---

<div class="section-divider">
<div class="eyebrow">PHẦN VII</div>
<div class="section-heading"><span class="section-number">07</span><h1>Ứng dụng trong hệ thống thực tế</h1></div>
<p class="section-subtitle">Autocomplete · Định tuyến mạng · Các hướng mở rộng</p>
</div>

<!--
Chuyển sang phần VII: Ứng dụng trong hệ thống thực tế.
-->

---
sourceSlide: 24
---

# Autocomplete: lấy từ trong cây con

<div class="cols">
<div>

<div class="search-mock"><div class="search-input">app<span class="cursor">│</span></div><div class="suggestion">app</div><div class="suggestion">apple</div><div class="suggestion muted">…</div></div>

Đến node `app` → duyệt cây con.

</div>
<div class="sketch-panel"><TrieDiagram :words="['app','apple']" highlight="app" :height="310" /></div>
</div>

<!--
Mô phỏng nhập ký tự và tái sử dụng tiền tố đã đi qua. Cây chứa app và apple khớp các gợi ý hiển thị. Chưa bàn độ phổ biến trên trang này; cơ chế cốt lõi là tìm nhóm từ mang tiền tố.
-->

---
sourceSlide: 24
---

# Xếp hạng các gợi ý

<div class="focus-content">

Thêm **độ phổ biến** để xếp hạng kết quả.

Ngữ cảnh và cá nhân hóa cần thêm cơ chế.

<p><a href="https://redis.io/docs/latest/develop/ai/search-and-query/administration/overview/">Redis Search</a> dùng compact trie cho gợi ý.</p>

</div>

<!--
Trie là một thành phần của hệ thống autocomplete, không tự giải đầy đủ xếp hạng, ngữ cảnh, lỗi chính tả và cá nhân hóa. Giữ dẫn chứng Redis từ tài liệu nguồn; không khẳng định mọi ứng dụng đều dùng cùng cấu trúc hoặc đây là lần xác minh nguồn trực tuyến mới.
-->

---
sourceSlide: 25
---

# Chọn tuyến mạng: 24 tuyến mẫu

<RoutingDataset />

<!--
- Bộ tuyến là dữ liệu minh họa, tăng từ 8 lên 24 tuyến. A là tuyến mặc định ở gốc; mỗi cổng B–X gắn tại node ứng với đủ số bit của tiền tố.
- Dãy bit trong bảng là đúng tiền tố được chèn vào Binary Trie, không phải tên mạng được dùng thay cho cạnh.
- Ví dụ chính 192.168.1.42 có dạng 11000000 10101000 00000001 00101010; khi có tuyến /32 U thì tuyến này thắng các tiền tố ngắn hơn.
- Chuyển sang trang tiếp theo để chạy từng bit. Không dùng sơ đồ phân cấp mạng con đã lược bỏ node bit.
-->

---
sourceSlide: 25
---

# Tra IP từng bit bằng Binary Trie

<BinaryRoutingDemo />

<!--
- Binary Trie thật: mỗi cạnh mang một bit 0 hoặc 1, mỗi tầng tăng độ dài tiền tố đúng một. Tất cả node bit đều được giữ; khung nhìn đi theo node hiện tại để đọc được chữ.
- IP mặc định 192.168.1.42: 11000000 10101000 00000001 00101010. Thử tối đa 32 bit; nhớ tuyến khớp dài nhất trong lúc đi, không quay lại quét danh sách tuyến.
- Những node chứa tuyến của .42 lần lượt là /0 A, /16 D, /17 M, /20 N, /22 O, /24 E, /25 P, /27 G, /28 Q, /29 R, /30 S, /32 U. Node ở độ sâu 31 trên đường này không có tuyến.
- Đổi sang 192.168.1.43: đi được 31 cạnh nhưng thiếu cạnh 1 ở bit 32; giữ kết quả /30 S, không chọn /32 U của .42 hay /31 T của .40–.41.
- Các lựa chọn khác: 192.168.2.7 → F, 10.1.2.7 → J, 8.8.8.8 → A. Kéo sơ đồ để xem nhánh khác; nút Theo node trở lại khung nhìn của bước hiện tại.
- Nút Chạy thử tự chạy 450 ms/bước; có Dừng, Tiếp tục, Chạy lại và Bước tiếp để trình bày có kiểm soát. Chuyển slide dừng và đặt lại demo.
- Đây là minh họa longest-prefix-match bằng trie bit, không khẳng định mọi router có cùng triển khai. Nguồn nghiên cứu giữ theo tài liệu seminar.
-->

---
sourceSlide: 26
---

# Tìm gần đúng cần thêm khoảng cách sửa

<div class="focus-content">

Người dùng gõ sai → khớp tiền tố thuần túy có thể bỏ sót từ.

**Trie + khoảng cách sửa** để tìm gần đúng.

Trie cơ bản chưa tự sửa chính tả.

</div>

<!--
Đây là mở rộng kết hợp thuật toán phụ trợ, không phải khả năng sẵn có của Trie. Có thể liên hệ Redis gợi ý gần đúng bằng Levenshtein automaton theo nguồn. Aho–Corasick là hướng tìm nhiều mẫu đã giới thiệu ở phần trước, không giải thích lại failure link.
-->

---
sourceSlide: 26
---

# Nén các đường chỉ có một con

<div class="cols">
<div>

Gộp chuỗi cạnh thành **một nhãn dài hơn**.

Compressed Trie / Radix / Patricia.

</div>
<div class="sketch-panel"><TrieRun mode="compress" /></div>
</div>

<!--
Giới thiệu hướng giảm số node/liên kết; không dạy trọn các biến thể. Điểm kết thúc từ hoặc phân nhánh phải được bảo toàn, không gộp tùy tiện làm mất từ. Trie là nền tảng; các hệ thống có thể bổ sung nén hoặc cơ chế khác.
-->

---
section: 08 / TỔNG KẾT
---

<div class="section-divider">
<div class="eyebrow">PHẦN VIII</div>
<div class="section-heading"><span class="section-number">08</span><h1>Tổng kết</h1></div>
<p class="section-subtitle">Các ý chính cần nhớ và cơ sở lựa chọn Trie.</p>
</div>

<!--
Chuyển sang phần VIII: Tổng kết.
-->

---
sourceSlide: 27
---

# Nhớ về cách tổ chức dữ liệu

<div class="cols">
<div>

**Từ chung tiền tố dùng chung đường đi.**

Node kết thúc phân biệt **từ đã lưu** với **tiền tố**.

</div>
<div class="sketch-panel"><TrieDiagram :words="['app','apple','ape']" highlight="ap" :height="310"  /></div>
</div>

<!--
Nhắc lại câu hỏi đầu bài: khi tìm theo ký tự đầu, dữ liệu nên tổ chức theo tiền tố hay lưu các chuỗi rời rạc? Đây là kết luận về cấu trúc, không lặp bảng chi phí trên cùng trang.
-->

---
sourceSlide: 27
---

# Nhớ về chi phí tài nguyên

<div class="focus-content">

- Thời gian theo **độ dài khóa**.
- Bộ nhớ theo **số node và bảng chữ cái**.

$$N\le 1+nL$$
$$N_{\max}=1+\sum_{d=1}^{L}\min(n,\sigma^d)$$

</div>

<!--
Hai công thức lần lượt là cận an toàn đơn giản và cận chặt theo n,L,σ với các giả định đã nêu. Cấp phát mảng theo MAXN và root=1 phải chừa hàng 0; chi phí xây dựng và khởi tạo khác nhau.
-->

---
sourceSlide: 27
---

# Nhớ chọn cấu trúc theo bài toán

<div class="focus-content">

Tiền tố là trọng tâm → **cân nhắc Trie**.

Đối chiếu **hashing**, **binary search**, **cây cân bằng**.

Ứng dụng: từ điển · autocomplete · router · Aho–Corasick.

</div>

<!--
Yêu cầu người nghe tự giải thích: chỉ cần kiểm tra khóa chính xác thì Trie còn là lựa chọn hợp lý nhất không? Không cấu trúc nào tối ưu mọi bài toán; kiểm tra giới hạn bộ nhớ, bộ ký tự và tần suất cập nhật.
-->

---
sourceSlide: 27
---

# Tài liệu tham khảo

<div class="focus-content">

- [VNOI Wiki — Trie](https://wiki.vnoi.info/algo/string/trie)
- [Redis Search](https://redis.io/docs/latest/develop/ai/search-and-query/administration/overview/)
- [Aho–Corasick — Tufts](https://www.cs.tufts.edu/comp/150GEN/classpages/AhoCorasick.html)
- [Lin & Hsieh, 2023 — Tra cứu IP](https://www.sciencedirect.com/science/article/pii/S0022000022000733)

</div>

<!--
Tài liệu seminar dựa trên NMTDTT-Nội-Dung-Slide-Trie.md. Các liên kết được giữ từ tài liệu nguồn; lần chỉnh này tập trung tách nội dung và kiểm tra bản trình chiếu, không xác minh mới các bài bên ngoài.
-->
