import Lock from './'
import LockClass from './lock'

test('exports Lock class', () => {
  expect(Lock).toBe(LockClass)
})
