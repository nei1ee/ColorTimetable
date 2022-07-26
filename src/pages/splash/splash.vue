<script setup lang="ts">
const pageStore = usePageStore()

onShow(() => {
  pageStore.setPageConfig({
    showNavBar: false,
  })
})

setTimeout(() => {
  uni.navigateTo({
    url: '/pages/index/index',
  })
}, 500)
</script>

<template>
  <BasePage>
    <div class="loader dark:bg-#121212" />
  </BasePage>
</template>

<style>
  .loader {
    position: absolute;
  }

  .loader {
    top: 72vh;
    left: 50vw;
    transform: rotate(165deg);
  }

  .loader:after,
  .loader:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0.5em;
    height: 0.5em;
    border-radius: 0.25em;
    transform: translate(-50%, -50%);
  }

  .loader:before {
    animation: before 2s infinite;
  }

  .loader:after {
    animation: after 2s infinite;
  }

  @-webkit-keyframes before {
    0% {
      width: 0.5em;
      box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
        -1em 0.5em rgba(111, 202, 220, 0.75);
    }

    35% {
      width: 2.5em;
      box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75),
        0 0.5em rgba(111, 202, 220, 0.75);
    }

    70% {
      width: 0.5em;
      box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75),
        1em 0.5em rgba(111, 202, 220, 0.75);
    }

    to {
      box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
        -1em 0.5em rgba(111, 202, 220, 0.75);
    }
  }

  @keyframes before {
    0% {
      width: 0.5em;
      box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
        -1em 0.5em rgba(111, 202, 220, 0.75);
    }

    35% {
      width: 2.5em;
      box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75),
        0 0.5em rgba(111, 202, 220, 0.75);
    }

    70% {
      width: 0.5em;
      box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75),
        1em 0.5em rgba(111, 202, 220, 0.75);
    }

    to {
      box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75),
        -1em 0.5em rgba(111, 202, 220, 0.75);
    }
  }

  @-webkit-keyframes after {
    0% {
      height: 0.5em;
      box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
        -0.5em -1em rgba(233, 169, 32, 0.75);
    }

    35% {
      height: 2.5em;
      box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75),
        -0.5em 0 rgba(233, 169, 32, 0.75);
    }

    70% {
      height: 0.5em;
      box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75),
        -0.5em 1em rgba(233, 169, 32, 0.75);
    }

    to {
      box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
        -0.5em -1em rgba(233, 169, 32, 0.75);
    }
  }

  @keyframes after {
    0% {
      height: 0.5em;
      box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
        -0.5em -1em rgba(233, 169, 32, 0.75);
    }

    35% {
      height: 2.5em;
      box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75),
        -0.5em 0 rgba(233, 169, 32, 0.75);
    }

    70% {
      height: 0.5em;
      box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75),
        -0.5em 1em rgba(233, 169, 32, 0.75);
    }

    to {
      box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75),
        -0.5em -1em rgba(233, 169, 32, 0.75);
    }
  }
</style>
