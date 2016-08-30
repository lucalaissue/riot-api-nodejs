# riot-api-nodejs

## V1.1.0

## description

A nodeJS library for the Riot Games Api

## install
```
$ npm install riot-api-nodejs
```

## definitions
```
$ typings install riot-api-nodejs
```

## Dev install
```
$ npm run dev

$ npm run build
```

## Usage
```javascript
var riotApi = require("riot-api-nodejs");

var classicApi = new riotApi.ClassicApi(["API-KEY1", "API-KEY2"], riotApi.region_e.EUW);

var tournamentAPI = new riotApi.TournamentAPI("API_KEY1", "API_KEY2");

classicApi.getSummonerByName("zafix", function(summoner){
    //Succes
}).catch(funtion(err){
    //error
});
```
<hr>

## Classic API

##### champion-v1.2
```javascript
getChampions();

getChampionById(id: number);

getFreeToPlayChampions();

getFreeToPlayChampions();
```
##### championmastery
```javascript
getChampionMastery(summonerId: number, championId: number);

getChampionMasteryBySummoner(summonerId: number);

getChampionMasteryScore(summonerId: number);

getTopChampionMastery(summonerId);
```
##### current-game-v1.0
```javascript
getCurrentGame(summonerId: number);
```
##### featured-games-v1.0
```javascript
getFeaturedGame();
```
##### game-v1.3
```javascript
getRecentGames(summonerId: number);
```
##### league-v2.5
```javascript
getLeagueBySummonerId(summonerId: number);

getLeagueBySummonerIdEntry(summonerId: number);

getLeagueByTeamId(teamId: string);

getLeagueByTeamIdEntry(teamId: string);

getChallengers_SOLO();

getChallengers_3x3();

getChallengers_5x5();

getMasters_SOLO();

getMasters_3x3();

getMasters_5x5();
```
##### lol-static-data-v1.2
```javascript
staticDataChampions();

staticDataChampionById(championsId: number);

staticDataItems();

staticDataItemById(itemId: number);

staticDataLanguagesStrings();

staticDataLanguages();

staticDataMap();

staticDataMastery();

staticDataMasteryById(masteryId: number);

staticDataRealm();

staticDataRunes();

staticDataRuneById(runeId: number);

staticDataSummonerSpells();

staticDataSummonSpellById(summonerSpellId: number);

staticDataVersion();
```
##### lol-status-v1.0
```javascript
getSatus();

getSatusByRegion(region: region_e);
```
##### match-v2.2
```javascript
getMatch(matchId: number);

getMatchIdsByTournamentCode(tournamentCode: string);

getMatchForTournament(matchId: number);
```
##### matchlist-v2.2
```javascript
getMatchList(summonerId: number);
```
##### stats-v1.3
```javascript
getStatsRanked(summonerId: number);

getStatsSummary(summonerId: number);
```
##### summoner-v1.4
```javascript
getSummonerByName(summonerName: string);

getSummonerById(summonerId: number);

getSummonerMasteries(summonerId: number);

getSummonerName(summonerId: number);

getSummonerRunes(summonerId: number);
```
###### team-v2.4
```javascript
getTeamsBySummoner(summonerId: number);

getTeamById(teamId: string);
```
<hr>

## TournamentAPI

#### tournament-provider-v1

```javascript

createTournamentCodes(tournamentId: number, count: number, params: TournamentCodeParameters);

getTournamentByCode(tournamentCode: string);

editTournamentByCode(tournamentCode: string, params: TournamentCodeUpdateParameters);

getLobbyEventByCode(tournamentCode: string);

registerProvider(region: region_e, url: string);

registerTournament(name: string, providerId: number);

```

## Contributor(s)
- [Zafix - https://github.com/zafixLRP](https://github.com/zafixLRP)

<hr>

##### Made with ♥ by [Zafix](https://github.com/zafixLRP)
