export type DemoMode = 'walk' | 'prefix' | 'search' | 'insert' | 'delete' | 'count' | 'update' | 'enumerate' | 'kth' | 'lcp' | 'xor' | 'aho' | 'build' | 'route' | 'compress'
export type TrieNode = { key: string; children: Map<string, TrieNode>; end: number; pass: number }
export type DemoFrame = {
  words: string[]; topology: string[]; active: string | null; highlight: string; text: string
  output: string[]; passValues?: Record<string, number>; failureActive?: boolean; segments?: string[]
}
export type DemoOptions = { mode: DemoMode; words?: string[]; query?: string; k?: number }
export const dictionary = ['app', 'apple', 'ape', 'bat', 'bath']
export const routingTable = [
  { prefix: '0.0.0.0', length: 0, port: 'A' },
  { prefix: '10.0.0.0', length: 8, port: 'B' },
  { prefix: '172.16.0.0', length: 12, port: 'C' },
  { prefix: '192.168.0.0', length: 16, port: 'D' },
  { prefix: '192.168.1.0', length: 24, port: 'E' },
  { prefix: '192.168.2.0', length: 24, port: 'F' },
  { prefix: '192.168.1.32', length: 27, port: 'G' },
  { prefix: '192.168.1.64', length: 26, port: 'H' },
  { prefix: '10.1.0.0', length: 16, port: 'I' },
  { prefix: '10.1.2.0', length: 24, port: 'J' },
  { prefix: '172.16.1.0', length: 24, port: 'K' },
  { prefix: '172.20.0.0', length: 16, port: 'L' },
  { prefix: '192.168.0.0', length: 17, port: 'M' },
  { prefix: '192.168.0.0', length: 20, port: 'N' },
  { prefix: '192.168.0.0', length: 22, port: 'O' },
  { prefix: '192.168.1.0', length: 25, port: 'P' },
  { prefix: '192.168.1.32', length: 28, port: 'Q' },
  { prefix: '192.168.1.40', length: 29, port: 'R' },
  { prefix: '192.168.1.40', length: 30, port: 'S' },
  { prefix: '192.168.1.40', length: 31, port: 'T' },
  { prefix: '192.168.1.42', length: 32, port: 'U' },
  { prefix: '192.168.3.0', length: 24, port: 'V' },
  { prefix: '192.168.128.0', length: 17, port: 'W' },
  { prefix: '192.168.64.0', length: 18, port: 'X' },
]
export type Route = typeof routingTable[number]
export type RoutingNode = { key: string; children: Map<string, RoutingNode>; route?: Route }
export type RoutingFrame = {
  key: string; bitsRead: number; examined: number; bit?: string; best?: Route
  status: string; missing?: string; done: boolean
}
export function buildRoutingTrie(routes: Route[] = routingTable): RoutingNode {
  const root: RoutingNode = { key: '', children: new Map() }
  for (const route of routes) {
    let node = root
    for (const bit of ipBits(route.prefix).slice(0, route.length)) {
      if (!node.children.has(bit)) node.children.set(bit, { key: node.key + bit, children: new Map() })
      node = node.children.get(bit)!
    }
    node.route = route
  }
  return root
}
export function traceRouting(target: string, routes: Route[] = routingTable): RoutingFrame[] {
  const bits = ipBits(target)
  let node = buildRoutingTrie(routes)
  let best = node.route
  let examined = 0
  let missing: string | undefined
  const frames: RoutingFrame[] = []
  function emit(status: string, bit?: string, done = false) {
    frames.push({ key: node.key, bitsRead: node.key.length, examined, bit, best, status, missing, done })
  }
  emit(best ? `Bắt đầu ở gốc: tuyến mặc định → ${best.port}.` : 'Bắt đầu ở gốc.')
  for (const bit of bits) {
    examined++
    const next = node.children.get(bit)
    if (!next) {
      missing = node.key + bit
      emit(`Bit ${examined} = ${bit}: thiếu cạnh → dừng, giữ tuyến tốt nhất.`, bit)
      break
    }
    node = next
    if (node.route) best = node.route
    emit(`Bit ${examined} = ${bit}: đi cạnh ${bit}${node.route ? ` → cập nhật /${node.route.length}, cổng ${node.route.port}` : '; giữ tuyến tốt nhất'}.`, bit)
  }
  emit(best ? `Kết quả: ${best.prefix}/${best.length} → cổng ${best.port}.` : 'Không có tuyến khớp.', undefined, true)
  return frames
}
export function buildTrie(words: string[]) {
  const root: TrieNode = { key: '', children: new Map(), end: 0, pass: 0 }
  for (const word of words) {
    let node = root
    node.pass++
    for (const char of word) {
      if (!node.children.has(char)) node.children.set(char, { key: node.key + char, children: new Map(), end: 0, pass: 0 })
      node = node.children.get(char)!
      node.pass++
    }
    node.end++
  }
  return root
}
function childNodes(node: TrieNode) {
  return [...node.children.values()].sort((a, b) => a.key.localeCompare(b.key, 'en'))
}
export function defaultWords(mode: DemoMode) {
  if (mode === 'insert') return ['app', 'ape']
  if (mode === 'search' || mode === 'prefix') return ['apple', 'ape']
  if (mode === 'delete') return ['app', 'app', 'apple']
  if (mode === 'lcp') return ['flower', 'flow', 'flight']
  if (mode === 'xor') return ['0011', '0101', '1010']
  if (mode === 'aho') return ['he', 'she', 'hers', 'his']
  if (mode === 'compress') return ['apple']
  return [...dictionary]
}
/** Compute the algorithm first; frames are snapshots, not a list of prewritten outcomes. */
export function createTrace({ mode, words: supplied, query: suppliedQuery, k: rank = 3 }: DemoOptions): DemoFrame[] {
  let words = [...(supplied ?? defaultWords(mode))]
  let topology = [...words]
  const queries: Partial<Record<DemoMode, string>> = { insert: 'apple', update: 'app', count: 'ap', enumerate: '', xor: '0110', aho: 'ushers' }
  const query = suppliedQuery ?? queries[mode] ?? 'app'
  let root = buildTrie(words)
  const frames: DemoFrame[] = []
  const output: string[] = []
  let failureActive = false
  let passValues: Record<string, number> | undefined
  function emit(active: string | null, text: string, highlight = active ?? '', segments?: string[]) {
    frames.push({ words: [...words], topology: [...topology], active, text, highlight, output: [...output], passValues: passValues ? { ...passValues } : undefined, failureActive, segments })
  }
  function walk(target: string) {
    let node = root
    emit('', 'Bắt đầu ở gốc ε.')
    for (const char of target) {
      const next = node.children.get(char)
      if (!next) { emit(node.key, `Thiếu cạnh ${char} → không tìm thấy ${target}.`); return null }
      node = next
      emit(node.key, `Đọc ${char} → node ${node.key}.`)
    }
    return node
  }
  if (mode === 'build' || mode === 'insert' || mode === 'update') {
    const additions = mode === 'build' ? [...words] : [query]
    if (mode === 'build') { words = []; topology = []; root = buildTrie([]) }
    for (const word of additions) {
      let key = ''
      emit('', `Chèn ${word}: bắt đầu ở gốc.`)
      for (const char of word) {
        const node = find(root, key)
        const exists = node?.children.has(char)
        key += char
        if (!exists) topology.push(key)
        emit(key, `${exists ? 'Dùng lại' : 'Tạo'} node ${key}.`)
      }
      const beforeCounts = Object.fromEntries(allNodes(root).map(n => [n.key, n.pass]))
      words.push(word)
      root = buildTrie(words)
      if (mode === 'update') {
        passValues = Object.fromEntries(allNodes(root).map(n => [n.key, beforeCounts[n.key] ?? 0]))
        for (let i = 0; i <= word.length; i++) {
          const prefix = word.slice(0, i)
          passValues[prefix] = find(root, prefix)!.pass
          emit(prefix, `passCount[${prefix || 'gốc'}] = ${find(root, prefix)!.pass}.`)
        }
      }
      passValues = undefined
      emit(word, `endCount[${word}] = ${find(root, word)!.end}.`)
    }
    const count = countNodes(root)
    emit(additions.at(-1) ?? '', mode === 'build' ? `Đã lưu ${words.length} từ · ${count} node, kể cả gốc.` : `Đã chèn ${query} · endCount = ${find(root, query)!.end}.`)
  }
  else if (mode === 'delete') {
    // Each deletion removes one occurrence. Keep old paths to illustrate logical deletion.
    const times = Math.min(2, find(root, query)?.end ?? 0)
    if (!times) { walk(query); emit(find(root, query)?.key ?? '', `${query} không tồn tại; không giảm bộ đếm.`) }
    for (let i = 0; i < times; i++) {
      walk(query)
      words.splice(words.indexOf(query), 1)
      root = buildTrie(words)
      emit(query, `Xóa lần ${i + 1}: endCount[${query}] = ${find(root, query)?.end ?? 0}.`)
    }
    if (times) emit(query, `endCount[${query}] = ${find(root, query)?.end ?? 0} · ${words.includes('apple') ? 'apple vẫn còn.' : 'Đường cũ vẫn còn.'}`)
  }
  else if (mode === 'walk' || mode === 'prefix' || mode === 'search' || mode === 'count') {
    const node = walk(query)
    if (node) {
      if (mode === 'count') emit(node.key, `passCount[${query}] = ${node.pass} → ${node.pass} từ.`)
      else if (mode === 'search') emit(node.key, `endCount[${query}] = ${node.end} → ${node.end ? 'có từ.' : 'chưa có từ hoàn chỉnh.'}`)
      else emit(node.key, mode === 'prefix' ? `Có đường ${query} → có tiền tố.` : `Đến node ${query}; đã đọc ${query.length} ký tự.`)
    }
  }
  else if (mode === 'enumerate') {
    const start = walk(query)
    if (start) {
      function dfs(node: TrieNode) {
        emit(node.key, `Xét node ${node.key || 'gốc'}.`)
        for (let i = 0; i < node.end; i++) {
          output.push(node.key)
          emit(node.key, `Xuất: ${output.join(' → ')}.`)
        }
        for (const next of childNodes(node)) dfs(next)
      }
      dfs(start)
      emit(start.key, `Kết quả: ${output.join(' → ') || 'không có từ'}.`)
    }
  }
  else if (mode === 'kth') {
    let k = rank
    let node = root
    emit('', `Tìm từ thứ k = ${k}.`)
    if (k < 1 || k > root.pass || !Number.isInteger(k)) emit('', 'k nằm ngoài số từ đang lưu.')
    else {
      while (true) {
        if (k <= node.end) { output.push(node.key); emit(node.key, `Từ thứ ${rank}: ${node.key}.`); break }
        if (node.end) { k -= node.end; emit(node.key, `Bỏ qua ${node.end} lần kết thúc ${node.key} → k = ${k}.`) }
        for (const next of childNodes(node)) {
          if (k > next.pass) { k -= next.pass; emit(next.key, `Bỏ qua nhánh ${next.key} (${next.pass} từ) → k = ${k}.`) }
          else { node = next; emit(node.key, `Vào nhánh ${node.key} (${node.pass} từ), k = ${k}.`); break }
        }
      }
    }
  }
  else if (mode === 'lcp') {
    let node = root
    emit('', 'Bắt đầu ở gốc.')
    while (!node.end && node.children.size === 1) {
      node = [...node.children.values()][0]
      emit(node.key, `Mọi từ còn chung tiền tố ${node.key}.`)
    }
    output.push(node.key)
    emit(node.key, `LCP = ${node.key || 'xâu rỗng'} · dừng vì ${node.end ? 'có từ kết thúc' : 'phân nhánh'}.`)
  }
  else if (mode === 'xor') {
    if (!words.length || !words.every(w => /^[01]+$/.test(w) && w.length === query.length) || !/^[01]+$/.test(query)) throw new Error('XOR demo requires nonempty equal-width binary words and query')
    let node = root
    emit('', `Tìm XOR lớn nhất với ${parseInt(query, 2)} = ${query}.`)
    for (const bit of query) {
      const opposite = bit === '0' ? '1' : '0'
      const chosen = node.children.get(opposite) ?? node.children.get(bit)!
      emit(chosen.key, `Bit ${bit}: ${node.children.has(opposite) ? `chọn ${opposite} đối nghịch` : `thiếu ${opposite}, chọn ${bit}`}.`)
      node = chosen
    }
    const value = parseInt(node.key, 2)
    output.push(String(value))
    emit(node.key, `${value} XOR ${parseInt(query, 2)} = ${value ^ parseInt(query, 2)} (lớn nhất).`)
  }
  else if (mode === 'aho') {
    const nodes = allNodes(root)
    const failure = new Map<string, TrieNode>([['', root]])
    // Shorter nodes first ensures the target's failure chain is available.
    for (const node of nodes.filter(n => n.key).sort((a, b) => a.key.length - b.key.length)) {
      let suffix = node.key.slice(1)
      while (suffix && !nodes.some(n => n.key === suffix)) suffix = suffix.slice(1)
      failure.set(node.key, find(root, suffix)!)
    }
    let node = root
    emit('', `Quét văn bản “${query}”.`)
    for (let i = 0; i < query.length; i++) {
      const char = query[i]
      while (node !== root && !node.children.has(char)) {
        const from = node.key
        node = failure.get(node.key)!
        failureActive = from === 'she' && node.key === 'he'
        emit(node.key, `Đọc ${char}: fail(${from}) → ${node.key || 'gốc'}.`, node.key)
        failureActive = false
      }
      node = node.children.get(char) ?? root
      emit(node.key, `Đọc ${query.slice(0, i + 1)} → ${node.key || 'gốc'}.`)
      let matched = node
      const matches: string[] = []
      while (matched !== root) {
        if (matched.end) { matches.push(matched.key); output.push(`${matched.key}@${i + 1}`) }
        matched = failure.get(matched.key)!
      }
      if (matches.length) {
        failureActive = matches.includes('she') && matches.includes('he')
        emit(node.key, `Báo ${matches.join(' và ')} tại vị trí ${i + 1}.`)
        failureActive = false
      }
    }
    emit(node.key, `Tìm được: ${output.map(m => m.split('@')[0]).join(', ') || 'không có mẫu'}.`)
  }
  else if (mode === 'route') {
    for (const frame of traceRouting(suppliedQuery ?? '192.168.1.42')) {
      if (frame.done && frame.best) output.push(frame.best.port)
      emit(frame.key, frame.status)
    }
  }
  else if (mode === 'compress') {
    // This slide demonstrates one chain; reject branching rather than discard it.
    if (words.length !== 1 || !words[0]) throw new Error('Compression example expects one nonempty word')
    let segments = [...words[0]]
    emit('', 'Mỗi cạnh ban đầu mang một ký tự.', '', segments)
    while (segments.length > 1) {
      segments = [segments[0] + segments[1], ...segments.slice(2)]
      emit(null, `Gộp đoạn không có nhánh: “${segments[0]}”.`, '', segments)
    }
    output.push(segments[0])
    emit(null, `Còn một cạnh “${segments[0]}”; giữ node kết thúc.`, '', segments)
  }
  return frames
}
export function find(root: TrieNode, key: string): TrieNode | null {
  let node = root
  for (const char of key) { const next = node.children.get(char); if (!next) return null; node = next }
  return node
}
function allNodes(root: TrieNode): TrieNode[] { return [root, ...[...root.children.values()].flatMap(allNodes)] }
export function countNodes(root: TrieNode) { return allNodes(root).length }
export function ipBits(ip: string) {
  const octets = ip.split('.').map(Number)
  if (octets.length !== 4 || octets.some(n => !Number.isInteger(n) || n < 0 || n > 255)) throw new Error('Invalid IPv4 address')
  return octets.map(n => n.toString(2).padStart(8, '0')).join('')
}
