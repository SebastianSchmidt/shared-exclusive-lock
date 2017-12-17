import once from './once'

export default class Lock {
  constructor () {
    this._status = NO_LOCK
    this._readLocks = 0
  }

  get locked () {
    return this._status !== NO_LOCK
  }

  readLock () {
    return new Promise((resolve, reject) => {
      this._status = READ_LOCK
      this._readLocks++
      resolve(once(() => releaseLock(this)))
    })
  }
}

const NO_LOCK = 0
const READ_LOCK = 1

const releaseLock = (lock) => {
  if (lock._status === READ_LOCK) {
    lock._readLocks--
    if (lock._readLocks === 0) {
      lock._status = NO_LOCK
    }
  } else {
    throw new Error('Invalid status: ' + lock._status)
  }
}
