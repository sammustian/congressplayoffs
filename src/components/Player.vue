<template>
  <tr class="scoreboard">
    <td class="left">
      <div class="league-name no-logo">
        <a href="/nfl/leagues/199769/teams/1346341">{{team.name}}</a>
      </div>
      <small class="text-muted">
        (
        <span class="nowrap text-success">{{team.win}}-{{team.loss}}</span>)
      </small>
    </td>
    <td></td>
    <td class="right text-right">
      <span>{{playerScore}}</span>
    </td>
  </tr>
</template>

<script>
export default {
  name: "Player",
  props: {
    team: {},
    currentWeek: Number,
    matchupType: String

  },
  data() {
    return {
      weeks: [13, 14, 15, 16]
    }
  },
  computed: {
    playerScore: function() {
      let index = this.weeks.findIndex(x => x == this.currentWeek);
      if (this.matchupType == "battleroyale"){ 
        
        return this.team.scores.battleroyale[index];
      } else {
        if ([13, 14].includes(this.currentWeek)) {
          return this.team.scores.playoff_match_1[index];
        } else {
          return this.team.scores.playoff_match_2[index - 2];
        }
      }
      
    },
    // battleRoyaleScore: function() {
    //   let score = 0;
    //   this.team.weeks.forEach((item) => {
    //     if (item.week <= this.currentWeek) {
    //       score += item.score;
    //     }
    //   }) 
    //   return parseFloat(score).toFixed(2);
    // }

  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.scoreboard {
  .left {
    text-align: left;
  }
  .right {
    span {
      color: white;
    }
  }
}
</style>
