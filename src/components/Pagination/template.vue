<template>
  <div
    :class="props.theme.wrapper"
    class="d-flex justify-content-end align-items-center"
  >
    <nav :class="props.theme.nav">
      <div v-show="props.showPagination" :class="props.theme.list">
        <li
          v-if="props.hasEdgeNav"
          :class="props.theme.firstPage"
          @click="props.setFirstPage"
        >
          <a
            v-bind="{ ...props.aProps, ...props.firstPageProps }"
            role="button"
            >{{ props.texts.first }}</a
          >
        </li>

        <li
          v-if="props.hasChunksNav"
          :class="props.theme.prevChunk"
          @click="props.setPrevChunk"
        >
          <a v-bind="{ ...props.aProps, ...props.prevChunkProps }" role="button"
            ><i class="bi bi-chevron-double-left"></i
          ></a>
        </li>

        <li :class="props.theme.prev" @click="props.setPrevPage">
          <a v-bind="{ ...props.aProps, ...props.prevProps }" role="button"
            ><i class="bi bi-chevron-left"></i
          ></a>
        </li>

        <li
          v-for="page in props.pages"
          :key="page"
          :class="props.pageClasses(page)"
          v-on="props.pageEvents(page)"
        >
          <a v-bind="props.aProps" :class="props.theme.link" role="button">{{
            page
          }}</a>
        </li>

        <li :class="props.theme.next" @click="props.setNextPage">
          <a v-bind="{ ...props.aProps, ...props.nextProps }" role="button"
            ><i class="bi bi-chevron-right"></i
          ></a>
        </li>

        <li
          v-if="props.hasChunksNav"
          :class="props.theme.nextChunk"
          @click="props.setNextChunk"
        >
          <a v-bind="{ ...props.aProps, ...props.nextChunkProps }" role="button"
            ><i class="bi bi-chevron-double-right"></i
          ></a>
        </li>

        <li
          v-if="props.hasEdgeNav"
          :class="props.theme.lastPage"
          @click="props.setLastPage"
        >
          <a
            v-bind="{ ...props.aProps, ...props.lastPageProps }"
            role="button"
            >{{ props.texts.last }}</a
          >
        </li>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "MyPagination",
  props: ["props"],
};
</script>
