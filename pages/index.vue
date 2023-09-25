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
            class="text-xl text-primary duration-300 dark:text-primary-500"
          />
        </button>
        <Transition name="slide-fade">
          <div
            v-show="isOpenDropDown"
            class="absolute right-0 top-10 z-10 w-44 border border-black bg-white p-4 duration-300 dark:border-zinc-400 dark:bg-zinc-900"
          >
            <ul @click="changeFont">
              <li
                class="cursor-pointer border-b border-black pb-2 dark:border-zinc-400"
              >
                Serif
              </li>
              <li
                class="cursor-pointer border-b border-black py-2 dark:border-zinc-400"
              >
                Sans serif
              </li>
              <li
                class="mb-1 cursor-pointer border-b border-black py-2 dark:border-zinc-400"
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
            class="absolute h-full w-full cursor-pointer rounded-full bg-zinc-500 px-1 dark:bg-primary"
          >
            <input v-model="isDark" class="peer hidden" type="checkbox" />
            <span
              class="absolute top-1 h-4 w-4 rounded-full bg-white duration-300 peer-checked:translate-x-6 dark:translate-x-6"
            ></span>
          </label>
        </div>
        <IconsMoon class="text-3xl text-zinc-500 dark:text-primary-500" />
      </div>
    </header>

    <main class="space-y-6 py-4">
      <form class="relative flex" @submit="onSubmit">
        <input
          ref="inputRef"
          v-model="inputText"
          placeholder="keyboard"
          class="w-full rounded-2xl bg-zinc-100 px-6 py-4 font-semibold focus-within:outline-none dark:bg-zinc-800"
          type="text"
        />
        <button class="absolute right-6 top-1/2 -translate-y-1/2 text-xl">
          <IconsSearch class="text-primary dark:text-primary-500" />
        </button>
      </form>

      <Transition name="fade" mode="out-in">
        <div v-if="pending" class="flex justify-center pt-10">
          <IconsSpinner />
        </div>
        <div v-else-if="error" class="flex">
          <p class="text-red-500">Could not find word: {{ text }}</p>
        </div>
        <div v-else>
          <template v-if="word">
            <div class="flex items-center">
              <div class="flex-1 space-y-[6px]">
                <h1 class="text-3xl font-semibold">
                  {{ word.word }}
                </h1>
                <p class="text-xl text-primary dark:text-primary-500">
                  {{ word.phonetic }}
                </p>
              </div>
              <div>
                <button
                  class="flex h-12 w-12 items-center justify-center rounded-full bg-primary-200 duration-300 active:translate-y-[2px] dark:bg-primary-900"
                  @click="playAudio"
                >
                  <IconsPlay
                    class="text-lg text-primary dark:text-primary-400"
                  />
                </button>
                <audio ref="audioRef">
                  <source :src="word.audio" type="audio/mpeg" />
                </audio>
              </div>
            </div>

            <div
              v-for="meaning in word.meanings"
              :key="meaning.partOfSpeech"
              class="my-6 space-y-6 pb-2"
            >
              <div class="flex items-center gap-6">
                <p class="text-xl font-semibold">{{ meaning.partOfSpeech }}</p>
                <div class="h-[1px] flex-1 bg-gray-200 dark:bg-zinc-700"></div>
              </div>

              <div class="space-y-3 text-lg">
                <p class="text-zinc-500">Meaning</p>
                <ul class="space-y-2 text-zinc-800 dark:text-zinc-200">
                  <li
                    v-for="(definition, idx) in meaning.definitions"
                    :key="idx"
                    class="flex gap-6"
                  >
                    <div
                      class="mt-3 h-[6px] w-[6px] flex-shrink-0 rounded-full bg-primary dark:bg-primary-500"
                    ></div>
                    <div class="grid gap-2">
                      <p>{{ definition.definition }}</p>
                      <p v-if="definition.example" class="text-zinc-500">
                        &ldquo;{{ definition.example }}&rdquo;
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <template v-if="meaning.synonyms.length > 0">
                <div class="flex gap-8 pt-4 text-lg">
                  <p class="text-zinc-500">Synonyms</p>
                  <p
                    class="flex flex-wrap gap-x-4 font-semibold text-primary dark:text-primary-500"
                  >
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
                  v-for="(url, idx) in word.sourceUrls"
                  :key="idx"
                  :href="url"
                  target="_blank"
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

const { isDark } = useTheme()
const font = ref('Serif')
const text = ref('keyboard')
const inputText = ref('')
const inputRef = ref()
const audioRef = ref()
const isOpenDropDown = ref(false)

const { word, pending, error } = await getWord(text)

onMounted(() => {
  inputRef.value.focus()
})

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

const playAudio = () => {
  audioRef.value.play()
}

const onSubmit = (e: Event) => {
  e.preventDefault()
  if (!inputText.value) {
    alert('No input text!!!')
    return
  }

  text.value = inputText.value
  inputText.value = ''
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
