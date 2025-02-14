export const richTextStyles =
  '[&_li>p]:mb-2 [&_p]:leading-[1.4] [&_p]:mb-4.5 [&_hr]:my-6 [&_hr]:opacity-10 [&_a]:underline [&_a]:hover:opacity-80 [&_a]:transition-opacity'

export const formatMonthYear = (input: Date | string): string => {
  const date =
    typeof input === 'string'
      ? new Date(input)
      : input instanceof Date
        ? input
        : null
  return date
    ? date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : ''
}
