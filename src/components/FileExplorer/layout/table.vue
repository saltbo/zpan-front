<template>
    <v-simple-table height="calc(90vh - 70px)">
        <template v-slot:default>
            <thead>
                <tr>
                    <th class="text-left">
                        <v-simple-checkbox style="width: 2px" v-model="selectedAll" :ripple="false" :indeterminate="selectedSome"></v-simple-checkbox>
                    </th>
                    <th class="text-left">{{ $t('fth.name') }}</th>
                    <th class="col-size text-left">{{ $t('fth.size') }}</th>
                    <th class="col-time text-left">{{ $t('fth.updated') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(item, idx) in data"
                    :key="item.alias"
                    @click="onRowClick(idx, item)"
                    :class="{ rowHighlight: highlightIdx == idx }"
                    v-intersect="(entries, observer, isIntersecting) => { infiniteScrolling(idx, entries, observer, isIntersecting) }"
                    @contextmenu.prevent="(e) => { $parent.openCtxMenu(e, item) }"
                >
                    <td class="col-select">
                        <v-simple-checkbox style="width: 2px" v-model="item.selected" :ripple="false"></v-simple-checkbox>
                    </td>
                    <td class="col-first">
                        <v-icon :color="item.icon.color" large>mdi-{{ item.icon.name }}</v-icon>
                        <div class="col-name">
                            <v-hover v-slot="{ hover }">
                                <span :class="{ 'name-on-hover': hover }" @click="$parent.onNameClick(item)">{{ item.name }}</span>
                            </v-hover>
                            <span class="col-time-mobile">{{ item.updated | moment }}</span>
                        </div>
                    </td>
                    <td class="col-size">{{ item.size }}</td>
                    <td class="col-time">{{ item.updated | moment }}</td>
                </tr>
            </tbody>
        </template>
    </v-simple-table>
</template>

<script>
import mixin from "./mixin";
export default {
    mixins: [mixin],
    data() {
        return {
            selectedAll: false,
            highlightIdx: -1
        };
    },
    watch: {
        selected(nv) {
            this.selectedAll = this.selected.length == this.data.length
        },
        selectedAll(nv) {
            this.data.map(el => { this.$set(el, 'selected', nv) })
        },
    },
    computed: {
        selected() {
            if (!this.data.length) {
                return []
            }

            return this.data.filter(el => el.selected == true).map(el => el.selected)
        },
        selectedSome() {
            return this.selected.length > 0 && this.selected.length != this.data.length
        },
    },
    methods: {
        select(idx) {
            this.highlightIdx = idx
        },
        onRowClick(idx, selection) {
            this.select(idx);

        },
        infiniteScrolling(idx, entries, observer, isIntersecting) {
            if (isIntersecting && idx == this.data.length - 1) {
                this.$emit("scroll-end");
            }
        }
    }
}
</script>

<style>
.rowHighlight {
    background-color: #eeeded;
}
.name-on-hover {
    cursor: pointer;
    color: #409eff;
}
.col-select {
    width: 2px;
    margin: 0;
}
.col-first .col-name {
    display: initial;
    font-weight: bold;
    margin-left: 6px;
    padding-top: 5px;
}
.col-first .col-time-mobile {
    display: none;
    font-weight: initial;
}

.col-size {
    width: 150px;
    font-size: 12px !important;
}
.col-time {
    width: 180px;
    font-size: 12px !important;
}

@media (max-width: 480px) {
    .col-first {
        display: flex;
    }
    .col-first .col-name {
        display: flex;
        flex-direction: column;
    }
    .col-first .col-time-mobile {
        display: initial;
        font-size: 10px;
        color: #757474;
    }

    .col-size,
    .col-time {
        display: none !important;
    }
}
</style>