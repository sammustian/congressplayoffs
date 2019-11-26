<template>
  <table :v-if="contenders" class="table-group table table-striped table-bordered table-hover">
    <thead>
      <tr class="first">
        <th class="leaf top left">Team</th>
        <th class="leaf top">{{[15, 16].includes(currentWeek) ? matchTitle : ''}}</th>
        <th class="leaf top right text-right">Points</th>
      </tr>
    </thead>
    <tbody class="matchup">
      <Player :matchupType="matchupType" :currentWeek="currentWeek" :key="item.id" v-for="item in contenders" :team="item"></Player>
    </tbody>
  </table>
</template>

<script>
import Player from "./Player";

export default {
  name: "Matchup",
  props: {
    contenders: Array,
    currentWeek: Number,
    matchupType: String,
    matchTitle: String
  },
  data() {
    return {
      scoreWeeksToCount: []
    };
  },
  components: {
    Player
  },
  computed: {},

  watch: {}
};
</script>

<style lang="scss">
.table-group {
  margin-bottom: 1rem;
}
</style>
