# **riot-api-nodejs**
<hr>

## Description
*v1.0.3 - riot-api-nodejs*<br>
A NodeJS Library for nodeJS

## Install

    $ npm install riot-api-nodejs

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
getChampions(callback : Function);

getChampionById(id: number, callback : Function);

getFreeToPlayChampions(callback : Function);

getFreeToPlayChampions(callback : Function);
```
##### championmastery
```javascript
getChampionMastery(summonerId: number, championId: number, callback: Function);

getChampionMasteryBySummoner(summonerId: number, callback: Function);

getChampionMasteryScore(summonerId: number, callback: Function);

getTopChampionMastery(summonerId, callback: Function);
```
##### current-game-v1.0
```javascript
getCurrentGame(summonerId: number, callback : Function);
```
##### featured-games-v1.0
```javascript
getFeaturedGame(callback : Function);
```
##### game-v1.3
```javascript
getRecentGames(summonerId: number, callback : Function);
```
##### league-v2.5
```javascript
getLeagueBySummonerId(summonerId: number, callback : Function);

getLeagueBySummonerIdEntry(summonerId: number, callback : Function);

getLeagueByTeamId(teamId: string, callback : Function);

getLeagueByTeamIdEntry(teamId: string, callback : Function);

getChallengers_SOLO(callback : Function);

getChallengers_3x3(callback : Function);

getChallengers_5x5(callback : Function);

getMasters_SOLO(callback : Function);

getMasters_3x3(callback : Function);

getMasters_5x5(callback : Function);
```
##### lol-static-data-v1.2
```javascript
staticDataChampions(callback : Function);

staticDataChampionById(championsId: number, callback : Function);

staticDataItems(callback : Function);

staticDataItemById(itemId: number, callback : Function);

staticDataLanguagesStrings(callback : Function);

staticDataLanguages(callback : Function);

staticDataMap(callback : Function);

staticDataMastery(callback : Function);

staticDataMasteryById(masteryId: number, callback : Function);

staticDataRealm(callback : Function);

staticDataRunes(callback : Function);

staticDataRuneById(runeId: number, callback : Function);

staticDataSummonerSpells(callback : Function);

staticDataSummonSpellById(summonerSpellId: number, callback : Function);

staticDataVersion(callback : Function);
```
##### lol-status-v1.0
```javascript
getSatus(callback : Function);

getSatusByRegion(region: region_e, callback : Function);
```
##### match-v2.2
```javascript
getMatch(matchId: number, callback : Function);

getMatchIdsByTournamentCode(tournamentCode: string, callback: Function);

getMatchForTournament(matchId: number, callback: Function);
```
##### matchlist-v2.2
```javascript
getMatchList(summonerId: number, callback : Function);
```
##### stats-v1.3
```javascript
getStatsRanked(summonerId: number, callback : Function);

getStatsSummary(summonerId: number, callback : Function);
```
##### summoner-v1.4
```javascript
getSummonerByName(summonerName: string, callback : Function);

getSummonerById(summonerId: number, callback : Function);

getSummonerMasteries(summonerId: number, callback : Function);

getSummonerName(summonerId: number, callback : Function);

getSummonerRunes(summonerId: number,callback : Function);
```
###### team-v2.4
```javascript
getTeamsBySummoner(summonerId: number, callback : Function);

getTeamById(teamId: string, callback : Function);
```
<hr>

## TournamentAPI

#### tournament-provider-v1

```javascript

getTournamentCodes(tournamentId: number, count: number, params: TournamentCodeParameters, callback: Fuction);

getTournamentByCode(tournamentCode: string, callback: Fuction);

editTournamentByCode(tournamentCode: string, params: TournamentCodeUpdateParameters, callback: Fuction);

getLobbyEventByCode(tournamentCode: string, callback: Fuction);

registerProvider(region: region_e, url: string, callback: Fuction);

registerTournament(name: string, providerId: number, callback: Fuction);

```

## TO DO List

* better error management

## Contributor(s)
- [Zafix - https://github.com/zafixLRP](https://github.com/zafixLRP)
- [CoreyTrombley - https://github.com/coreytrombley](https://github.com/coreytrombley)

<hr>

##### Made with ♥ by [Zafix](https://github.com/zafixLRP)
