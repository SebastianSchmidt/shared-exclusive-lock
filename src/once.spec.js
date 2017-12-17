import once from './once'

test('calls original function without arguments', () => {
  const fn = jest.fn()
  once(fn)('Hello world!')
  expect(fn.mock.calls.length).toBe(1)
  expect(fn.mock.calls[0].length).toBe(0)
})

test('calls orginal function only once', () => {
  const fn = jest.fn()
  const onceFn = once(fn)
  onceFn()
  onceFn()
  expect(fn.mock.calls.length).toBe(1)
})
