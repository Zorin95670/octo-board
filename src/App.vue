<template>
  <div class="app">
    <vue-snotify></vue-snotify>
    <div class="app-content">
      <router-view/>
    </div>
    <div class="footer">
      <p>
        <b>Hot</b> version is a version that has been deployed less than one hour ago.
        <b>New</b> version is a version that has been deployed less than one day ago.
      </p>
      <p>Version of API: {{ version.api }}, version of GUI: {{ version.gui }}.
        You can see changelog <a href="changelog.html">here</a>.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted() {
    this.$http.get('/octo-spy/api/info').then((response) => {
      this.version.api = response.data.version;
    });
  },
  data() {
    return {
      version: {
        gui: this.$root.version,
        api: '-',
      },
    };
  },
};
</script>

<style lang="scss">
  $font-primary:   'Open Sans', Helvetica, Arial, sans-serif;
  $font-secondary:  'Montserrat', Helvetica, Arial, sans-serif;
  $base-text-color: #2c3e50;
  $secondary-text-color: grey;

  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }
  html {
    font-size: 12px;
    font-family: $font-primary;
    font-weight: normal;
    color: $base-text-color;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  H1, H2 , H3 , thead, th {
    font-family: $font-secondary;
    font-weight: 300;
  }

  input, select, option {
    font-family: $font-primary;
    font-weight: normal;
    border: .2rem solid #CCC;
    font-size: .9rem;
  }
  td {
    height: 2.5rem;
    text-align: left;
  }
  .app {;
    text-align: center;

    .logo {
      max-height: 2.5rem
    }

    .app-title {
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-start;
      align-items: center;
    }

    .app-content, .app-title {
      margin: 1.6rem;
    }
  }
</style>
