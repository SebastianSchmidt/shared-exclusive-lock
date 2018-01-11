# Shared exclusive lock

[![NPM package](https://img.shields.io/npm/v/shared-exclusive-lock.svg)](https://www.npmjs.com/package/shared-exclusive-lock)
[![License](https://img.shields.io/github/license/SebastianSchmidt/shared-exclusive-lock.svg)](https://github.com/SebastianSchmidt/shared-exclusive-lock/blob/master/LICENSE)
[![Build status: Linux and macOS](https://img.shields.io/travis/SebastianSchmidt/shared-exclusive-lock/master.svg)](https://travis-ci.org/SebastianSchmidt/shared-exclusive-lock)
[![Build status: Windows](https://ci.appveyor.com/api/projects/status/mrepbha26vh5kn5c?svg=true)](https://ci.appveyor.com/project/SebastianSchmidt/shared-exclusive-lock)
[![Coverage status](https://img.shields.io/coveralls/github/SebastianSchmidt/shared-exclusive-lock/master.svg)](https://coveralls.io/github/SebastianSchmidt/shared-exclusive-lock?branch=master)

Shared read locks and exclusive write locks: Concurrent access for read-only operations, exclusive access for write operations.

```javascript
import Lock from 'shared-exclusive-lock'

const lock = new Lock()

// Multiple read locks at the same time:
const releaseReadLock1 = await lock.readLock()
const releaseReadLock2 = await lock.readLock()

// Write lock is granted as soon as all existing read locks have been released:
lock.writeLock().then((releaseWriteLock) => releaseWriteLock())

// As soon as a write lock is queued, no further read locks are granted in parallel:
lock.readLock().then((releaseReadLock3) => releaseReadLock3())

releaseReadLock1()
releaseReadLock2()

// Sequence:
// 1. Receive first read lock.
// 2. Receive second read lock.
// 3. Release first read lock.
// 4. Release second read lock.
// 5. Receive write lock.
// 6. Release write lock.
// 7. Receive third read lock.
// 8. Release third read lock.
```


## Installation

This is a [Node.js](https://nodejs.org/) module available through the [npm registry](https://www.npmjs.com/).
You can install the module via the [`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```
$ npm install shared-exclusive-lock --save
```


## License

Copyright (c) 2017-2018 Sebastian Schmidt

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
