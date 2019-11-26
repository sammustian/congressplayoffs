import {
    randomBytes
} from 'crypto';

const cheerio = require('cheerio');
const request = require('request-promise');
export default class FleaFlickerScapper {
    constructor() {
        this.leagueID = 199769;
        this.leagueMembers = {};
        this.baseURL = 'https://www.fleaflicker.com/nfl/leagues/';
    }
    static async getHTML(url) {
        // const options = {
        //     method: 'GET',
        //     url: url,
        //     header: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Content-Type': 'text/html'
        //     },
        //     transform: function (body) {
        //         // console.log(body);
        //         return cheerio.load(body);
        //     },

        // };
        // let response = request(options)
        //     .then(function (body) {
        //         console.log(body);
        //         return body;
        //     })
        //     .catch(function (err) {
        //         console.log(err);
        //         return err;
        //     });
        //     console.log(response);
        const rand = Math.random()
        console.time('FleaFlickerScapperRequest_' + rand)
        console.log(url);
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
        });
        console.log(response);

        // const response = await fetch(url, {
        //         method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //         mode: 'no-cors', // no-cors, *cors, same-origin
        //         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //         // credentials: 'same-origin', // include, *same-origin, omit
        //         headers: {
        //             'Content-Type': 'text/html',
        //             'Access-Control-Allow-Origin': '*',
        //         },
        //     }).then((resp) => console.log('myrespons' + resp))
        //     .then(function (data) {
        //         console.log(data);
        //     });
        console.timeEnd('FleaFlickerScapperRequest_' + rand);
        console.log(response);
        return response;
    }

    static async getTeams() {
        try {
            let teamStanding = await this.createTeams();
            let scores = await this.getPlayoffWeekScores(teamStanding);
            let teams = this.getPlayoffScores(teamStanding, scores);
            // console.log(teams);
            // scores.forEach((week) => {

            //     week.forEach((matchup) => {
            //         let team_index = teams.findIndex((player) => matchup.id == player.id);
            //         let team = teams[team_index];

            //         team.weeks.push(matchup);
            //     });
            // });
            return teams;
        } catch (err) {
            console.log(err);
            return err;

        }
    }
    static async createTeams() {
        try {
            let players = [];
            let $ = await this.getHTML('https://www.fleaflicker.com/nfl/leagues/199769');
            let tbody = $('tbody')[0];
            let teams = tbody.children;
            teams.splice(4, 2);
            teams.forEach((item, key) => {
                let length = $($(item.children[2])[0].children[0])[0].children.length;
                let href;
                if (length > 1) {
                    href = $($(item.children[2])[0].children[0])[0].children[1].attribs.href;
                } else {
                    href = $($(item.children[2])[0].children[0])[0].children[0].attribs.href
                }
                href = href.replace('/nfl/leagues/199769/teams/', '');
                let team_name = $($(item.children[2])[0].children[0]).text();
                let win = $(item.children[5]).text();
                let loss = $(item.children[6]).text();
                let points = $(item.children[13]).text();
                points = points.replace(',', '');

                let team = {
                    id: parseInt(href),
                    name: team_name,
                    win: parseInt(win),
                    loss: parseInt(loss),
                    points: parseFloat(points),
                    record: win - loss,
                    weeks: [],
                    scores: {
                        battleroyale: [],
                        playoff_match_1: [],
                        playoff_match_2: [],
                    }
                }
                players.push(team);
            });
            return players;
        } catch (err) {
            console.log(err);
        }
    }
    static async asyncForEach(array, callback) {
        let _return = [];
        for (let index = 0; index < array.length; index++) {
            let weeks_obj = await callback(array[index], index, array);
            array_push(_return, weeks_obj);
        }
        return _return;
    }

    static async getPlayoffWeekScores() {
        let weekNumbers = [13, 14, 15, 16];
        let return_array = [];
        try {


            for (const week in weekNumbers) {
                // console.log(weekNumbers[week]);
                let url = 'https://www.fleaflicker.com/nfl/leagues/199769/scores?season=2018&week=' + weekNumbers[week];
                let $ = await this.getHTML(url);
                let scoreboard = $('.scoreboard');
                let weeks_array = [];

                for (let i = 0; i < scoreboard.length; i++) {

                    const sb = scoreboard[i];
                    let href;
                    let name;
                    // console.log(week);
                    if (week == 2 || week == 3) {

                        let length = $(sb.children[0].children[2])[0].children.length;
                        if (length > 1) {

                            href = $(sb.children[0].children[2])[0].children[1].attribs.href;
                            name = $(sb.children[0].children[2].children[1].children).text();
                        } else {
                            href = $(sb.children[0].children[2])[0].children[0].attribs.href;
                            name = $(sb.children[0].children[2].children[0].children).text();
                        }
                        // console.log(name);
                    } else {
                        let length = $(sb.children[0].children[0])[0].children.length;
                        if (length > 1) {
                            href = $(sb.children[0].children[0])[0].children[1].attribs.href;
                            name = $(sb.children[0].children[0].children[1].children).text();
                        } else {
                            href = $(sb.children[0].children[0])[0].children[0].attribs.href;
                            name = $(sb.children[0].children[0].children[0].children).text();
                        }
                    }
                    // console.log(week, name);
                    // console.log(href);
                    let id = href.replace('/nfl/leagues/199769/teams/', '').replace('?season=2018', '');
                    let score = $(sb.children[1].children[0].children).text();
                    let weeks_obj = {
                        name: name,
                        id: parseInt(id),
                        score: parseFloat(score),
                        week: weekNumbers[week]
                    };

                    weeks_array.push(weeks_obj);
                }
                return_array.push(weeks_array);
            }
            // console.log(return_array);
            return return_array;
            // this.getPlayoffScores(return_array);
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    static getPlayoffScores(teams, weeks) {
        //add playoff scoring brackets to each team teams
        // console.log(teams);
        try {
            weeks.forEach((week) => {
                week.forEach((matchup) => {
                    let team_index = teams.findIndex((player) => matchup.id == player.id);
                    let team = teams[team_index];
                    team.weeks.push(matchup);
                });
            });
            // console.log(teams);
            teams.forEach((team) => {
                // console.log(team);
                let br_score = 0;
                let pm1_score = 0;
                let pm2_score = 0;
                team.weeks.forEach((week, key) => {
                    br_score += week.score;
                    team.scores.battleroyale.push(parseFloat(br_score.toFixed(2)));
                    switch (key) {
                        case 0:
                            pm1_score += week.score;
                            team.scores.playoff_match_1.push(parseFloat(pm1_score.toFixed(2)));
                            break;
                        case 1:
                            pm1_score += week.score;
                            team.scores.playoff_match_1.push(parseFloat(pm1_score.toFixed(2)));
                            break;
                        case 2:
                            pm2_score += week.score;
                            team.scores.playoff_match_2.push(parseFloat(pm2_score.toFixed(2)));
                            break;
                        case 3:
                            pm2_score += week.score;
                            team.scores.playoff_match_2.push(parseFloat(pm2_score.toFixed(2)));
                            break;
                    }
                });
            });
            return teams;
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}