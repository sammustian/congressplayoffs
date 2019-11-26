<template>
  <div id="app">
    <div id="body">
      <div class="container-fluid">
        <div id="alerts-container"></div>
        <div class="row">
          <div id="body-main" class="col-md-12">
            <div id="main-container">
              <div id="body-center-main">
                <div class="row">
                  <div class="col-12">
                    <Toolbar></Toolbar>
                  </div>
                </div>
                <div class="row" v-if="playoffMatchOne && playoffMatchTwo && battleRoyaleContenders">
                  <div class="col-sm-6 playoff matchup">
                    <h1>Playoffs</h1>
                    <Matchup
                      matchupType="playoff"
                      
                      :contenders="[15, 16].includes(currentWeek) ? nextWeekMatchup.championshipMatch : playoffMatchOne"
                      matchTitle="Championship"
                      :currentWeek="currentWeek"
                    ></Matchup>
                    <Matchup
                      matchupType="playoff"
                      
                      :contenders="[15, 16].includes(currentWeek) ? nextWeekMatchup.runnerUpMatch : playoffMatchTwo"
                      matchTitle="Runner Up"
                      :currentWeek="currentWeek"
                    ></Matchup>
                  </div>
                  <div class="col-sm-6 loserbowl matchup">
                    <h1>Battle Royale</h1>
                    <Matchup
                      matchTitle="Battle for Congress"
                      matchupType="battleroyale"
                      
                      :contenders="battleRoyaleContenders"
                      :currentWeek="currentWeek"
                    ></Matchup>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- <Scoreboard></Scoreboard> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FleaFlickerScapper from "./services/FleaFlickerScapper.js";
import Matchup from "./components/Matchup.vue";
import Scoreboard from "./components/Scoreboard.vue";
import Toolbar from "./components/Toolbar.vue";

export default {
  name: "app",
  data() {
    return {
      teams: [],
      currentWeek: 13,
      weeks: [13, 14, 15, 16]
    };
  },
  components: {
    Matchup,
    Toolbar
    // Scoreboard
  },
  mounted() {
    this.fetch();

    if (parseInt(this.$route.params.weeknum) != this.currentWeek) {
      this.$set(this, "currentWeek", parseInt(this.$route.params.weeknum));
    }
  },
  methods: {
    async fetch() {
      console.time("App-getTeams():");
      try {
      this.teams = await FleaFlickerScapper.getTeams();
      } catch(err) {
        console.log(err);
        return err;
      }
      console.log(this.teams)
      console.timeEnd("App-getTeams():");
      // console.log(this.teams);
    }
  },
  watch: {
    $route(to, from) {
      this.currentWeek = parseInt(to.params.weeknum);
      // this.show = false;
    }
  },
  computed: {
    rankingOrder: function() {
      return this.teams
        .slice(0)
        .sort((a, b) =>
          a.record < b.record
            ? 1
            : a.record == b.record
            ? a.points < b.points
              ? 1
              : -1
            : -1
        );
    },
    playoffContenders: function() {
      return this.rankingOrder.slice(0, 4);
    },
    battleRoyaleContenders: function() {
      let index = this.weeks.findIndex(x => x == this.currentWeek);
      return this.rankingOrder
        .slice(4, this.rankingOrder.length)
        .sort(
          (a, b) => a.scores.battleroyale[index] < b.scores.battleroyale[index]
        );
    },
    playoffMatchOne: function() {
      let index = this.weeks.findIndex(x => x == this.currentWeek);
      return [this.playoffContenders[0], this.playoffContenders[3]].sort(
        (a, b) => a.scores.battleroyale[index] < b.scores.battleroyale[index]
      );
    },
    playoffMatchTwo: function() {
      let index = this.weeks.findIndex(x => x == this.currentWeek);
      return [this.playoffContenders[1], this.playoffContenders[2]].sort(
        (a, b) =>
          a.scores.playoff_match_1[index] < b.scores.playoff_match_1[index]
      );
    },
    nextWeekMatchup: function() {
      let index = this.weeks.findIndex(x => x == this.currentWeek);
      let playoffTeam = this.rankingOrder.slice(0, 4);
      let winner1;
      let winner2;

      let loser1;
      let loser2;

      if (
        playoffTeam[0].scores.playoff_match_1[1] >
        playoffTeam[3].scores.playoff_match_1[1]
      ) {
        winner1 = playoffTeam[0];
        loser1 = playoffTeam[3];
      } else {
        winner1 = playoffTeam[3];
        loser1 = playoffTeam[0];
      }

      

      if (
        playoffTeam[1].scores.playoff_match_1[1] >
        playoffTeam[2].scores.playoff_match_1[1]
      ) {
        winner2 = playoffTeam[1];
        loser2 = playoffTeam[2];
      } else {
        winner2 = playoffTeam[2];
        loser2 = playoffTeam[1];
      }

      let obj = {};
      obj['championshipMatch'] = [winner1, winner2];
      obj['runnerUpMatch'] = [loser1, loser2];

      obj['championshipMatch'].sort(
        (a, b) =>
          a.scores.playoff_match_2[index] < b.scores.playoff_match_2[index]
      );

      obj['runnerUpMatch'].sort(
        (a, b) =>
          a.scores.playoff_match_2[index] < b.scores.playoff_match_2[index]
      );
      console.log(obj);
      return obj;
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1 {
  color: white;
  padding-bottom: 1.5rem;
}
</style>
