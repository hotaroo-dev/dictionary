<template>
  <div class="container min-h-screen" :class="[getFont(font)]">
    <header class="flex items-center py-4">
      <div class="text-4xl text-zinc-500">
        <IconsBook />
      </div>
      <div
        class="relative flex-1 border-r border-zinc-200 py-1 pr-4 duration-300 dark:border-zinc-600"
      >
        <button class="ml-auto flex items-center gap-3" @click="toggleDropDown">
          <p class="font-semibold">
            {{ font }}
          </p>
          <IconsChevronDown
            class="text-primary dark:text-primary-500 text-xl duration-300"
          />
        </button>
        <Transition name="slide-fade">
          <div
            v-show="isOpenDropDown"
            class="absolute right-0 top-10 z-10 w-44 border border-black bg-white p-4 duration-300 dark:border-zinc-400 dark:bg-zinc-900"
          >
            <ul @click="changeFont">
              <li
                class="cursor-pointer border-b border-black pb-2 duration-300 dark:border-zinc-400"
              >
                Serif
              </li>
              <li
                class="cursor-pointer border-b border-black py-2 duration-300 dark:border-zinc-400"
              >
                Sans serif
              </li>
              <li
                class="mb-1 cursor-pointer border-b border-black py-2 duration-300 dark:border-zinc-400"
              >
                Monospace
              </li>
            </ul>
          </div>
        </Transition>
      </div>
      <div class="ml-4 flex items-center gap-4">
        <div class="relative h-6 w-12">
          <label
            class="dark:bg-primary absolute h-full w-full cursor-pointer rounded-full bg-zinc-500 px-1"
          >
            <input v-model="isDark" class="peer hidden" type="checkbox" />
            <span
              class="absolute top-1 h-4 w-4 rounded-full bg-white duration-300 peer-checked:translate-x-6 dark:translate-x-6"
            ></span>
          </label>
        </div>
        <IconsMoon class="dark:text-primary-500 text-3xl text-zinc-500" />
      </div>
    </header>

    <main class="space-y-6 py-4">
      <form class="relative flex" @submit="handleSubmit">
        <input
          v-model="inputText"
          class="w-full rounded-2xl bg-zinc-100 px-6 py-4 font-semibold transition-[background-color] duration-300 focus-within:outline-none dark:bg-zinc-800"
          type="text"
        />
        <button class="absolute right-6 top-1/2 -translate-y-1/2 text-xl">
          <IconsSearch class="text-primary dark:text-primary-500" />
        </button>
      </form>

      <Transition name="fade" mode="out-in">
        <div v-if="searching" class="flex justify-center pt-10">
          <IconsSpinner />
        </div>
        <div v-else>
          <template v-if="searchedResult">
            <div class="flex items-center">
              <div class="flex-1 space-y-[6px]">
                <h1 class="text-3xl font-semibold">
                  {{ searchedResult.word }}
                </h1>
                <p class="text-primary dark:text-primary-500 text-xl">
                  {{ searchedResult.phonetic }}
                </p>
              </div>
              <button
                class="bg-primary-200 dark:bg-primary-900 flex h-12 w-12 items-center justify-center rounded-full duration-300 active:translate-y-[2px]"
                @click="playAudio(searchedResult.audio)"
              >
                <IconsPlay class="text-primary dark:text-primary-500 text-lg" />
              </button>
            </div>

            <div
              v-for="meaning in searchedResult.meanings"
              :key="meaning.partOfSpeech"
              class="my-6 space-y-6"
            >
              <div class="flex items-center gap-6">
                <p class="text-xl font-semibold">{{ meaning.partOfSpeech }}</p>
                <div class="h-[1px] flex-1 bg-gray-200 dark:bg-zinc-700"></div>
              </div>

              <div class="space-y-3 text-lg">
                <p class="text-zinc-500">Meaning</p>
                <ul class="space-y-4 text-zinc-800 dark:text-zinc-200">
                  <li
                    v-for="(definition, idx) in meaning.definitions"
                    :key="idx"
                    class="flex gap-6"
                  >
                    <div
                      class="bg-primary mt-3 h-[6px] w-[6px] flex-shrink-0 rounded-full"
                    ></div>
                    <div class="grid gap-4">
                      <p>{{ definition.definition }}</p>
                      <p v-if="definition.example" class="text-zinc-500">
                        &ldquo;{{ definition.example }}&rdquo;
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <template v-if="meaning.synonyms.length > 0">
                <div class="flex gap-8 text-lg">
                  <p class="text-zinc-500">Synonyms</p>
                  <p class="text-primary flex flex-wrap gap-x-2 font-semibold">
                    <span v-for="synonyms in meaning.synonyms" :key="synonyms">
                      {{ synonyms }}
                    </span>
                  </p>
                </div>
              </template>
            </div>

            <div
              class="mb-6 border-t border-gray-200 pt-6 duration-300 dark:border-zinc-700"
            >
              <p class="mb-2 text-zinc-500">Source</p>
              <div class="space-y-2">
                <a
                  v-for="(url, idx) in searchedResult.sourceUrls"
                  :key="idx"
                  :href="url"
                  class="flex items-center gap-3 text-zinc-800 underline underline-offset-2 dark:text-zinc-200"
                >
                  <span>{{ url }}</span>
                  <IconsLink />
                </a>
              </div>
            </div>
          </template>
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup lang="ts">
import { IWord } from '#imports'

useHead({
  script: [
    {
      children: `document.documentElement.classList.toggle(
      'dark',
      localStorage.theme === 'dark' ||
        (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )`
    }
  ]
})
const font = ref('Serif')
const inputText = ref('')
const searchedResult = ref<IWord | null>(null)
const searching = ref(false)
const isOpenDropDown = ref(false)

const { isDark } = useTheme()

const toggleDropDown = () => {
  isOpenDropDown.value = !isOpenDropDown.value
}

const changeFont = (event: Event) => {
  const currentEl = event.currentTarget as HTMLUListElement
  const fontEl = event.target as HTMLLIElement
  if (currentEl === event.target) {
    return
  }

  font.value = fontEl.textContent?.trim() as string
  toggleDropDown()
}

const playAudio = (url: string) => {
  const audio = new Audio(url)
  audio.play()
}

const handleSubmit = async (event: Event) => {
  event.preventDefault()

  if (inputText.value === '') {
    alert('Please Enter a word!!!')
    return
  }

  searching.value = true
  const { data: word, pending } = await useAsyncData(
    'word',
    () =>
      $fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${inputText.value}`
      ),
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
  searching.value = pending.value
  searchedResult.value = word.value
}
</script>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
