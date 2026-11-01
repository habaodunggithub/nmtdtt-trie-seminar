import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildTrie, countNodes, createTrace, dictionary, find, routingTable, buildRoutingTrie, traceRouting, ipBits } from './trie-demo.ts'

test('insertion reuses prefixes and retains duplicate end counts', () => {
  const end = createTrace({ mode: 'build', words: ['app', 'apple', 'ape'] }).at(-1)!
  assert.equal(countNodes(buildTrie(end.words)), 7)
  const insert = createTrace({ mode: 'insert', words: ['app', 'apple'], query: 'app' }).at(-1)!
  assert.equal(find(buildTrie(insert.words), 'app')!.end, 2)
  assert.equal(find(buildTrie(insert.words), 'apple')!.end, 1)
})
test('path existence differs from a stored word; missing edges stop traversal', () => {
  assert.match(createTrace({ mode: 'prefix', words: ['apple'], query: 'app' }).at(-1)!.text, /có tiền tố/)
  assert.match(createTrace({ mode: 'search', words: ['apple'], query: 'app' }).at(-1)!.text, /chưa có từ hoàn chỉnh/)
  assert.match(createTrace({ mode: 'search', words: ['apple'], query: 'bat' }).at(-1)!.text, /không tìm thấy/)
})
test('logical deletion removes one occurrence at a time and keeps old paths', () => {
  const frames = createTrace({ mode: 'delete' })
  const first = frames.find(f => f.text.startsWith('Xóa lần 1'))!
  assert.equal(find(buildTrie(first.words), 'app')!.end, 1)
  const end = frames.at(-1)!
  assert.equal(find(buildTrie(end.words), 'app')!.end, 0)
  assert.deepEqual(end.words, ['apple'])
  const empty = createTrace({ mode: 'delete', words: ['app'] }).at(-1)!
  assert.deepEqual(empty.words, [])
  assert.ok(empty.topology.includes('app'))
  assert.deepEqual(createTrace({ mode: 'delete', words: ['apple'], query: 'bat' }).at(-1)!.words, ['apple'])
})
test('prefix counts include duplicates; updates change nodes along the path', () => {
  const words = [...dictionary, 'app']
  assert.match(createTrace({ mode: 'count', words, query: 'ap' }).at(-1)!.text, /4 từ/)
  const frames = createTrace({ mode: 'update', words: dictionary, query: 'app' })
  const rootUpdate = frames.find(f => f.text.startsWith('passCount[gốc]'))!
  assert.equal(rootUpdate.passValues![''], 6)
  assert.equal(rootUpdate.passValues!['ap'], 3)
  const appUpdate = frames.find(f => f.text.startsWith('passCount[app]'))!
  assert.equal(appUpdate.passValues!['app'], 3) // app twice and apple
  assert.equal(appUpdate.passValues!['b'], 2)
})
test('DFS outputs the same lexicographic multiset as sorting, including prefix words', () => {
  const words = ['apple', 'app', 'bat', 'ape', 'app', 'bath']
  const frames = createTrace({ mode: 'enumerate', words })
  assert.deepEqual(frames.at(-1)!.output, [...words].sort())
  const sub = createTrace({ mode: 'enumerate', words, query: 'app' }).at(-1)!
  assert.deepEqual(sub.output, words.filter(w => w.startsWith('app')).sort())
})
test('kth selection agrees with sorted words, including duplicates and invalid k', () => {
  const words = ['apple', 'app', 'bat', 'ape', 'app', 'bath']
  for (let k = 1; k <= words.length; k++) assert.equal(createTrace({ mode: 'kth', words, k }).at(-1)!.output[0], [...words].sort()[k - 1])
  assert.match(createTrace({ mode: 'kth', words, k: 0 }).at(-1)!.text, /ngoài/)
  assert.match(createTrace({ mode: 'kth', words, k: 7 }).at(-1)!.text, /ngoài/)
})
test('LCP stops at branching and at a shorter terminal word', () => {
  for (const [words, expected] of [[['flower', 'flow', 'flight'], 'fl'], [['app', 'apple'], 'app'], [['a', 'b'], ''], [[], '']] as [string[], string][]) {
    assert.equal(createTrace({ mode: 'lcp', words }).at(-1)!.output[0], expected)
  }
})
test('greedy XOR matches exhaustive search for every 4-bit query', () => {
  const values = [0, 3, 5, 10, 15]
  const words = values.map(n => n.toString(2).padStart(4, '0'))
  for (let q = 0; q < 16; q++) {
    const best = Number(createTrace({ mode: 'xor', words, query: q.toString(2).padStart(4, '0') }).at(-1)!.output[0])
    assert.equal(best ^ q, Math.max(...values.map(v => v ^ q)))
  }
  assert.throws(() => createTrace({ mode: 'xor', words: ['1', '0011'], query: '0101' }))
})
test('Aho output agrees with naive matching and emits the she→he failure transition', () => {
  const words = ['he', 'she', 'hers', 'his']
  const text = 'ushers'
  const frames = createTrace({ mode: 'aho', words, query: text })
  const expected = words.flatMap(w => Array.from({ length: text.length }, (_, i) => text.slice(0, i + 1).endsWith(w) ? `${w}@${i + 1}` : '').filter(Boolean))
  assert.deepEqual([...frames.at(-1)!.output].sort(), expected.sort())
  assert.ok(frames.some(f => f.failureActive && f.text.includes('fail(she) → he')))
  for (const query of ['shehe', 'hishers', 'xxxx', 'he']) {
    const naive = words.flatMap(w => Array.from({ length: query.length }, (_, i) => query.slice(0, i + 1).endsWith(w) ? `${w}@${i + 1}` : '').filter(Boolean)).sort()
    assert.deepEqual(createTrace({ mode: 'aho', words, query }).at(-1)!.output.sort(), naive)
  }
})
test('routing chooses the longest prefix across all 24 routes, including host and fallback', () => {
  const examples = [
    ['192.168.1.42', 'U'], ['192.168.1.43', 'S'], ['192.168.1.40', 'T'],
    ['192.168.1.32', 'Q'], ['192.168.1.63', 'G'], ['192.168.1.64', 'H'],
    ['192.168.1.127', 'H'], ['192.168.1.128', 'E'], ['192.168.2.42', 'F'],
    ['192.168.3.42', 'V'], ['192.168.65.1', 'X'], ['192.168.129.1', 'W'],
    ['10.20.30.40', 'B'], ['10.1.2.7', 'J'], ['172.16.1.1', 'K'],
    ['172.31.255.255', 'C'], ['172.32.0.1', 'A'], ['8.8.8.8', 'A'],
  ]
  for (const [query, port] of examples) assert.deepEqual(createTrace({ mode: 'route', query }).at(-1)!.output, [port])
  const number = (ip: string) => ip.split('.').reduce((value, part) => value * 256 + Number(part), 0)
  for (const subnet of ['192.168.1', '192.168.2', '10.1.2', '172.16.1']) {
    for (let host = 0; host < 256; host++) {
      const query = `${subnet}.${host}`
      const longest = routingTable.filter(route => {
        const block = 2 ** (32 - route.length)
        return Math.floor(number(query) / block) === Math.floor(number(route.prefix) / block)
      }).sort((a, b) => b.length - a.length)[0]
      assert.deepEqual(traceRouting(query).at(-1)!.best, longest)
    }
  }
})
test('binary routing trie retains every bit node and at most two children', () => {
  const root = buildRoutingTrie()
  let nodes = 0, routes = 0
  function visit(node: ReturnType<typeof buildRoutingTrie>) {
    nodes++
    assert.ok(node.children.size <= 2)
    if (node.route) { routes++; assert.equal(node.key, ipBits(node.route.prefix).slice(0, node.route.length)) }
    for (const [bit, child] of node.children) {
      assert.match(bit, /^[01]$/)
      assert.equal(child.key, node.key + bit)
      visit(child)
    }
  }
  visit(root)
  assert.equal(routes, 24)
  assert.equal(nodes, 90)
})
test('routing emits each bit, remembers intermediate routes and stops at a missing edge', () => {
  const frames = traceRouting('192.168.1.42')
  const steps = frames.slice(1, -1)
  assert.equal(steps.length, 32)
  for (const [i, step] of steps.entries()) {
    assert.equal(step.bitsRead, i + 1)
    assert.equal(step.examined, i + 1)
    assert.equal(step.key, ipBits('192.168.1.42').slice(0, i + 1))
  }
  assert.deepEqual([...new Set(frames.map(frame => frame.best?.port))], ['A', 'D', 'M', 'N', 'O', 'E', 'P', 'G', 'Q', 'R', 'S', 'U'])
  const fallback = traceRouting('192.168.1.43')
  assert.equal(fallback.at(-1)!.bitsRead, 31)
  assert.equal(fallback.at(-1)!.examined, 32)
  assert.equal(fallback.at(-1)!.best!.port, 'S')
  assert.equal(fallback.at(-2)!.missing, ipBits('192.168.1.43'))
  assert.match(fallback.at(-2)!.status, /thiếu cạnh/)
  assert.equal(traceRouting('8.8.8.8', []).at(-1)!.best, undefined)
})
test('compression preserves the whole key at every frame', () => {
  const frames = createTrace({ mode: 'compress', words: ['apple'] })
  for (const frame of frames) assert.equal(frame.segments!.join(''), 'apple')
  assert.deepEqual(frames.at(-1)!.segments, ['apple'])
  assert.throws(() => createTrace({ mode: 'compress', words: ['app', 'apple'] }))
})
