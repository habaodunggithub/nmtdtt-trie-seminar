import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createStudentLookupTrace, students } from './student-trie.ts'
import { buildTrie, countNodes } from './trie-demo.ts'

test('student registry preserves the supplied IDs and names; the numeric trie shares prefixes', () => {
  assert.deepEqual(students, [
    { id: '24120093', name: 'Lê Quang Minh' },
    { id: '24120022', name: 'Hà Văn Thiên Bảo' },
    { id: '24120225', name: 'Trịnh Văn Thành' },
    { id: '24120214', name: 'Nguyễn Ngọc Phúc' },
  ])
  assert.equal(countNodes(buildTrie(students.map(student => student.id))), 16)
})
test('every ID is walked digit by digit; a name appears only after successful terminal validation', () => {
  const frames = createStudentLookupTrace()
  assert.deepEqual(frames.filter(frame => frame.matched).map(frame => frame.matched), students)
  for (const student of students) {
    const search = frames.filter(frame => frame.query === student.id)
    assert.deepEqual(search.slice(0, -1).map(frame => frame.active), Array.from({ length: 9 }, (_, i) => student.id.slice(0, i)))
    assert.ok(search.slice(0, -1).every(frame => !frame.matched))
    assert.equal(search.at(-1)!.matched!.name, student.name)
    assert.ok(search.at(-1)!.complete)
  }
})
test('a shared prefix or an unknown ID never reveals a student name', () => {
  for (const query of ['24120', '241200', '24129999', '241200930']) {
    assert.ok(createStudentLookupTrace([query]).every(frame => !frame.matched))
  }
})
