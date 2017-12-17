import once from './once'

export default class Lock {
  constructor () {
    this._status = NO_LOCK
    this._readLocks = 0
    this._readQueue = []
    this._writeQueue = []
  }

  get locked () {
    return this._status !== NO_LOCK
  }

  readLock () {
    return new Promise((resolve, reject) => {
      const resolveReadLock = () => {
        this._status = READ_LOCK
        this._readLocks++
        resolve(once(() => releaseReadLock(this)))
      }

      if (this._status !== WRITE_LOCK && this._writeQueue.length === 0) {
        resolveReadLock()
      } else {
        this._readQueue.push(resolveReadLock)
      }
    })
  }

  writeLock () {
    return new Promise((resolve, reject) => {
      const resolveWriteLock = () => {
        this._status = WRITE_LOCK
        resolve(once(() => releaseWriteLock(this)))
      }

      if (this._status === NO_LOCK) {
        resolveWriteLock()
      } else {
        this._writeQueue.push(resolveWriteLock)
      }
    })
  }
}

const NO_LOCK = 0
const READ_LOCK = 1
const WRITE_LOCK = 2

const releaseReadLock = (lock) => {
  lock._readLocks--
  if (lock._readLocks === 0) {
    if (lock._writeQueue.length > 0) {
      lock._writeQueue.shift()()
    } else {
      lock._status = NO_LOCK
    }
  }
}

const releaseWriteLock = (lock) => {
  if (lock._readQueue.length > 0) {
    const tasks = lock._readQueue
    lock._readQueue = []
    for (let i = 0, length = tasks.length; i < length; i++) {
      tasks[i]()
    }
  } else if (lock._writeQueue.length > 0) {
    lock._writeQueue.shift()()
  } else {
    lock._status = NO_LOCK
  }
}
