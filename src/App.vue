<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import API, { type ShortenLinkRequest, type ShortenLinkResponse } from '@/assets/chrredAPI'
import { setLinkDomain } from '@/assets/configuration'

interface ShortenedLink {
  target_url: string
  short_url: string
  creation_date: Date,
  admin_url: string
}

const useProductionDomain: Ref<boolean> = ref(false)
const links: Ref<ShortenedLink[]> = ref(JSON.parse(localStorage.getItem('links') || '[]'))
const link: Ref<string> = ref('')

const submit = async () => {
  const requestBody: ShortenLinkRequest = {
    target_url: link.value
  }
  const response: ShortenLinkResponse = await API.shortenLink(requestBody, useProductionDomain.value)
  const domain: string = setLinkDomain(useProductionDomain.value)
  const shortenedLink: ShortenedLink = {
    target_url: link.value,
    short_url: `${domain}/${response.url}`,
    creation_date: new Date(),
    admin_url: `${domain}/${response.admin_url}`
  }
  links.value.push(shortenedLink)

  link.value = ''
}

watch(links.value, async (newLinks) => {
  const linksSortedByDate = newLinks.sort((a, b) => {
    return new Date(b.creation_date).getTime() - new Date(a.creation_date).getTime()
  })
  localStorage.setItem('links', JSON.stringify(linksSortedByDate))
})
</script>

<template>
  <section>
    <form @submit.prevent>
      <p>Enter long link</p>
      <div class="checkbox">
        <input type="checkbox" name="useProductionDomain" id="useProductionDomain" v-model="useProductionDomain">
        <label for="useProductionDomain">Use production domain</label>
      </div>
      <textarea name="link" id="link" v-model="link"></textarea>

      <button @click="submit">Shorten link</button>
    </form>

    <div>
      <h2>Shortened links</h2>
      <table>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Target URL</th>
            <th>Admin URL</th>
            <th>Creation date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="link in links" :key="link.short_url">
            <td>{{ link.short_url }}</td>
            <td>{{ link.target_url }}</td>
            <td>{{ link.admin_url }}</td>
            <td>{{ link.creation_date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
section {
  width: 728px;
  height: 360px;
  padding: 2rem;

  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  scroll-behavior: smooth;
  overflow-y: auto;
}

section form {
  width: 100%;
  
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

section form p {
  font-size: 0.8rem;
  color: #000;
}

section form .checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

section form textarea {
  height: 5rem;
  padding: 0.75rem 0.5rem;
  
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  resize: none;
}

section form button {
  width: 100%;
  padding: 0.5rem 1rem;

  border: 1px solid #ccc;
  border-radius: 0.25rem;
  background-color: #eee;
  cursor: pointer;
}
section form button:hover {
  background-color: #ddd;
}

section div table {
  width: 100%;
  border-collapse: collapse;
}

section div table thead tr {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 1rem;
}

section div table thead tr th {
  text-align: left;
  padding: 0.25rem 0;
}

section div table tbody tr {
  padding: 0.25rem 0;

  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  gap: 1rem;

  word-wrap: break-word;
  word-break: break-all;
}

section div table tbody tr td:last-child {
  font-size: 0.8rem;
  color: #999;
}
</style>
