<template>
  <div class="page-not-found">
    <span class="error-code">404</span>
    <span class="description">Oops, this page not found!</span>
    <div>
      <router-link
        :to="`/`"
        v-slot="{ href, navigate, isActive }">
        <a
          class="link-effect"
          :active="isActive"
          :href="href"
          title="Go back home"
          @click="navigate">Go back home</a>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page404.vue',
};
</script>

<style lang="scss" scoped>
.page-not-found {
  display: inline-flex;
  flex-direction: column;

  .error-code {
    font-weight: bold;
    font-size: 10rem;
  }

  .description, .link-effect {
    margin: 1rem;
    font-size: 2rem;
  }
}
</style>
