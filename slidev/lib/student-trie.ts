import { buildTrie, createTrace, find } from './trie-demo.ts'

export type Student = { id: string; name: string }
export const students: readonly Student[] = [
  { id: '24120093', name: 'Lê Quang Minh' },
  { id: '24120022', name: 'Hà Văn Thiên Bảo' },
  { id: '24120225', name: 'Trịnh Văn Thành' },
  { id: '24120214', name: 'Nguyễn Ngọc Phúc' },
]
export type StudentLookupFrame = {
  query: string; active: string | null; highlight: string; complete: boolean; matched?: Student
}
export function createStudentLookupTrace(queries: readonly string[] = students.map(student => student.id)): StudentLookupFrame[] {
  const ids = students.map(student => student.id)
  const trie = buildTrie(ids)
  return queries.flatMap(query => {
    const frames = createTrace({ mode: 'search', words: ids, query })
    const terminal = find(trie, query)
    const matched = terminal && terminal.end > 0 ? students.find(student => student.id === query) : undefined
    return frames.map((frame, i) => ({
      query, active: frame.active, highlight: frame.highlight, complete: i === frames.length - 1,
      matched: i === frames.length - 1 ? matched : undefined,
    }))
  })
}
