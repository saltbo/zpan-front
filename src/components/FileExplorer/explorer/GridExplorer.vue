<template>
  <div class="explorer">
    <div
      class="explorer-item"
      v-for="item in data"
      :key="item.alias"
      @click="onNameClick(item)"
      @contextmenu.prevent="(e) => { openCtxMenu(e, item) }"
    >
      <v-icon :color="item.icon.color" large>mdi-{{ item.icon.name }}</v-icon>
      <p>{{ item.name }}</p>
    </div>
  </div>
</template>

<script>
import mixin from "../explorer_mixin";
export default {
  mixins: [mixin],
  data() {
    return {};
  },
  methods: {
    onSelectionChange(selection) {
      this.$emit("selection-change", selection);
    },
    onSelectable(row, index) {
      if (!row.dirtype) return true;
    },
    onScrollEnd() {
      this.$emit("scroll-end")
    },
  },
};
</script>

<style scoped>
.explorer {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.explorer-item {
  width: 80px;
  padding: 5px 10px;
  text-align: center;
  cursor: pointer;
}

.explorer-item:hover {
  background: #f0f6fd;
  border-radius: 5px;
}

.explorer-item i {
  font-size: 55px;
}

.explorer-item p {
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>s