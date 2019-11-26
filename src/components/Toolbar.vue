<template>
    <div class="button-bar">
        <div class="btn-toolbar">
            <div class="btn-group">
                <div class="btn-group">
                    <a class="btn btn-primary" v-if="prev" v-on:click.stop.prevent="updateIndex(-1)" :href="'/week/'+prev"><i class="fa fa-chevron-left"></i></a>
                    <div class="btn btn-primary" v-on:click.stop.prevent="navigateHome()" :href="'/week/13'">Week {{weeks[currentIndex]}}</div>
                    <a class="btn btn-primary" v-if="next" v-on:click.stop.prevent="updateIndex(1)" :href="'/week/'+next"><i class="fa fa-chevron-right"></i></a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Toolbar',
    data() {
        return {
            weeks:[13, 14, 15, 16],
            currentIndex: 0
        }
    },
    mounted() {
        this.updateCurrentIndexOnLoad();
        // console.log(this.weeks[this.currentIndex - 1]);
    },
    methods: {
        updateIndex(num) {
            this.currentIndex = this.currentIndex + num;
            this.$router.push({ path: '/week/' + this.weeks[this.currentIndex]});
        },
        navigateHome() {
            //TODO: update this to current week throughout season
            this.$router.push({ path: '/week/13'});
            this.currentIndex = 0;
        },
        updateCurrentIndexOnLoad() {
            let index = this.weeks.findIndex(num => num == this.$route.params.weeknum );
            this.currentIndex = index;
        }
    },
    computed: {
        next: function() {            
             if (this.weeks[this.currentIndex + 1] == null) {
                 return false;
             } else {
                 return this.weeks[this.currentIndex + 1];
             };
        },
        prev: function() {            
             if (this.weeks[this.currentIndex - 1] == null) {
                 return false;
             } else {
                 return this.weeks[this.currentIndex - 1];
             };
        }
    }
}
</script>