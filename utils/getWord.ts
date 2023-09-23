export default async function getWord(text: string) {
  const { data: word, pending } = await useAsyncData(
    'word',
    () => $fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`),
    {
      transform: (word: any) => {
        return {
          word: word[0].word,
          phonetic: word[0].phonetics[0].text,
          audio: word[0].phonetics
            .map((phonetic: any) => phonetic.audio)
            .find((audio: string) => audio),
          meanings: word[0].meanings,
          sourceUrls: word[0].sourceUrls
        }
      }
    }
  )

  return { word, pending }
}
