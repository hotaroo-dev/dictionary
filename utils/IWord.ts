export default interface IWord {
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
