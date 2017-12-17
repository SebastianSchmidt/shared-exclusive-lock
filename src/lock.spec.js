import Lock from './lock'

let lock
beforeEach(() => {
  lock = new Lock()
})

test('is not locked after creation', () => {
  expect(lock.locked).toBe(false)
})

describe('after read lock has been received', () => {
  test('is locked', async () => {
    await lock.readLock()
    expect(lock.locked).toBe(true)
  })

  test('another read lock can be received at the same time', async () => {
    const release1 = await lock.readLock()
    const release2 = await lock.readLock()
    expect(lock.locked).toBe(true)
    expect(release1).not.toBe(release2)
  })

  test('no write lock can be received at the same time', async (done) => {
    await lock.readLock()
    lock.writeLock().then(() => done.fail())
    await wait(1000)
    done()
  })

  test('a single read lock can only be released once', async () => {
    await lock.readLock()
    const release = await lock.readLock()
    release()
    expect(lock.locked).toBe(true)
    release()
    expect(lock.locked).toBe(true)
  })

  describe('after read lock has been released', () => {
    test('is no longer locked when all read locks have been released', async () => {
      const release1 = await lock.readLock()
      const release2 = await lock.readLock()
      expect(lock.locked).toBe(true)
      release1()
      expect(lock.locked).toBe(true)
      release2()
      expect(lock.locked).toBe(false)
    })

    test('a write lock can be received when all read locks have been released', async (done) => {
      const release = await lock.readLock()
      lock.writeLock().then(() => done())
      release()
    })
  })

  describe('after a write lock has been queued', () => {
    test('no further read locks can be received at the same time', async (done) => {
      await lock.readLock()
      lock.writeLock()
      lock.readLock().then(() => done.fail())
      await wait(1000)
      done()
    })

    describe('after queued write lock has been received and released', () => {
      test('a read lock can be received', async (done) => {
        const release = await lock.readLock()
        lock.writeLock().then((release) => release())
        lock.readLock().then(() => done())
        release()
      })
    })
  })
})

describe('after write lock has been received', () => {
  test('is locked', async () => {
    await lock.writeLock()
    expect(lock.locked).toBe(true)
  })

  test('no other write lock can be received at the same time', async (done) => {
    await lock.writeLock()
    lock.writeLock().then(() => done.fail())
    await wait(1000)
    done()
  })

  test('no read lock can be received at the same time', async (done) => {
    await lock.writeLock()
    lock.readLock().then(() => done.fail())
    await wait(1000)
    done()
  })

  describe('after write lock has been released', () => {
    test('is no longer locked', async () => {
      const release = await lock.writeLock()
      expect(lock.locked).toBe(true)
      release()
      expect(lock.locked).toBe(false)
    })

    test('a read lock can be received', async (done) => {
      const release = await lock.writeLock()
      lock.readLock().then(() => done())
      release()
    })

    test('a write lock can be received', async (done) => {
      const release = await lock.writeLock()
      lock.writeLock().then(() => done())
      release()
    })
  })
})

const wait = (milliseconds) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, milliseconds)
  })
}
