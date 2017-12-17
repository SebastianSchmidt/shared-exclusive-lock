const once = (fn) => {
  return () => {
    if (fn) {
      fn()
      fn = null
    }
  }
}

export default once
