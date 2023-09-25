interface IWord {
  word: string
  phonetic: string
  audio: string
  meanings: {
    definitions: {
      definition: string
      example: string
    }[]
    partOfSpeech: string
    synonyms: string[]
    example?: string
  }[]
  sourceUrls: string[]
}

export default async function getWord(text: Ref<string>) {
  const {
    data: word,
    pending,
    error
  } = await useFetch(
    () => `https://api.dictionaryapi.dev/api/v2/entries/en/${text.value}`,
    {
      transform: (word: any): IWord => {
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

  return { word, pending, error }
}
