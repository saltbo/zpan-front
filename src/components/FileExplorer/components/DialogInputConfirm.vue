<template>
    <v-dialog v-model="visible" width="500">
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>
                <label>{{ description }}</label>
                <v-text-field v-model="value" label="新名称*" required></v-text-field>
            </v-card-text>

            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="finish(value)">确认</v-btn>
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
        value: String,
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