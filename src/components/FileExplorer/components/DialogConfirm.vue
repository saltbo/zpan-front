<template>
    <v-dialog v-model="visible" width="500">
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>{{ description }}</v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="finish">确认</v-btn>
                <v-btn text @click="close">取消</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { CSMixin, DialogMixin } from "@/libs/mixin";
export default {
    mixins: [CSMixin, DialogMixin],
    props: {
        title: String,
        description: String,
    },
    data() {
        return {
        }
    }

}
</script>

<style>
</style>