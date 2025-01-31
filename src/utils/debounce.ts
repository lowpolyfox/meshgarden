export const debounce = (func: () => void, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return () => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(func, wait)
  }
}
