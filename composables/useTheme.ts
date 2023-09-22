export default function useTheme() {
  const isDark = useState<boolean>('theme', () => false)

  watch(isDark, () => {
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    setTheme()
  })

  function setTheme() {
    const theme = localStorage.getItem('theme')
    document.documentElement.classList.toggle(
      'dark',
      theme === 'dark' ||
        (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  }

  return { isDark }
}
