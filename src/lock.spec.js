import Lock from './lock'

let lock
beforeEach(() => {
  lock = new Lock()
})

test('is not locked after creation', () => {
  expect(lock.locked).toBe(false)
})

test('is locked when a read lock has been received', async () => {
  await lock.readLock()
  expect(lock.locked).toBe(true)
})

test('is no longer locked when a read lock has been released', async () => {
  const release = await lock.readLock()
  expect(lock.locked).toBe(true)
  release()
  expect(lock.locked).toBe(false)
})

test('several read locks can be received at the same time', async () => {
  await lock.readLock()
  await lock.readLock()
  expect(lock.locked).toBe(true)
})

test('is no longer locked when all read locks have been released', async () => {
  const release1 = await lock.readLock()
  const release2 = await lock.readLock()
  expect(lock.locked).toBe(true)
  release1()
  expect(lock.locked).toBe(true)
  release2()
  expect(lock.locked).toBe(false)
})

test('a single read lock can only be released once', async () => {
  await lock.readLock()
  const release = await lock.readLock()
  release()
  expect(lock.locked).toBe(true)
  release()
  expect(lock.locked).toBe(true)
})
