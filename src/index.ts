// NodeJS Library for Riot Games
// Project: https://developer.riotgames.com/
// Library by : Luca Laissue <https://github.com/zafixlrp>

import * as request from "request";
import {Promise} from "es6-promise";

// ClassicURLS
const URL_1_0: string = "https://{region}.api.pvp.net/api/lol/{region}/v1.0/";
const URL_1_2: string = "https://{region}.api.pvp.net/api/lol/{region}/v1.2/";
const URL_1_3: string = "https://{region}.api.pvp.net/api/lol/{region}/v1.3/";
const URL_1_4: string = "https://{region}.api.pvp.net/api/lol/{region}/v1.4/";
const URL_2_2: string = "https://{region}.api.pvp.net/api/lol/{region}/v2.2/";
const URL_2_4: string = "https://{region}.api.pvp.net/api/lol/{region}/v2.4/";
const URL_2_5: string = "https://{region}.api.pvp.net/api/lol/{region}/v2.5/";

// ChampionMasteryURL
const CHAMPIONMASTERY_URL: string = "https://{region}.api.pvp.net/championmastery/location/{endpoint}/";

// Statics Global URLS
const GLOBAL_URL_1_2: string = "https://global.api.pvp.net/api/lol/static-data/{region}/v1.2/";

// Spectator
const URL_SPECTATOR_1_0: string = "https://{region}.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/{endpoint}/";

// Tournament ULRS
const TOURNAMENT_URL_1: string = "https://global.api.pvp.net/tournament/public/v1/";

function region_e_TO_endpointString(param: region_e){
    switch (param){
        case region_e.BR:
            return "BR1";
        case region_e.EUNE:
            return "EUNE1";
        case region_e.EUW:
            return "EUW1";
        case region_e.KR:
            return "KR";
        case region_e.LAN:
            return "LA1";
        case region_e.LAS:
            return "LA2";
        case region_e.NA:
            return "NA1";
        case region_e.OCE:
            return "OCE1";
        case region_e.TR:
            return "TR1";
        case region_e.RU:
            return "RU";
        case region_e.PBE:
            return "PBE1";
    }
}

function region_e_TO_string(param: region_e){
    switch (param){
        case region_e.BR:
            return "br";
        case region_e.EUNE:
            return "eune";
        case region_e.EUW:
            return "euw";
        case region_e.KR:
            return "kr";
        case region_e.LAN:
            return "lan";
        case region_e.LAS:
            return "las";
        case region_e.NA:
            return "na";
        case region_e.OCE:
            return "oce";
        case region_e.TR:
            return "tr";
        case region_e.RU:
            return "ru";
        case region_e.PBE:
            return "pbe";
    }
}


// Regions List
export enum region_e{
    BR,
    EUNE,
    EUW,
    KR,
    LAN,
    LAS,
    NA,
    OCE,
    TR,
    RU,
    PBE
}

/**
    * Tournament API
    */
export class TournamentAPI {
    private ApiKeys: string[];
    private ApiKey: string;

    /**
        * TournamentAPI Constructor
        */
    public constructor(...ApiKeys: string[]){
        this.ApiKeys = ApiKeys;
        this.ApiKey = ApiKeys[0];
    }

    /**
        * Change the Api Key for the next requests
        */
    private switchApiKey(): void {
        this.ApiKey = this.ApiKeys[(this.ApiKeys.indexOf(this.ApiKey) + 1) % this.ApiKeys.length];
    }

    /**
        * Send a request to the Riot Games Api and return a formatted json via a callback
        * @param     {string}    url         request url
        * @param     {string}    method      method(post / put / get)
        * @param     {[type]}    data        body parameters
        * @param     {(JSON}     callback    callback function with formatted JSON
        */
    private getJSON(url:string, method: string, data, callback: (JSON) => void): any{
        this.switchApiKey;
        return new Promise((success, fail) => {
            request(
                {
                url: url,
                method: method,
                headers: {
                    "User-Agent": "request",
                    "Accept-Charset": "ISO-8859-1, utf-8",
                    "X-Riot-Token": this.ApiKey
                },
                json: true,
                body: data
            }, (err: any, res: any, body: string) => {
                if (res.statusCode == 200 || res.statusCode == 204) {
                    try{
                        callback(JSON.parse(body));
                    } catch (E){
                        callback(body);
                    }
                } else if (res.statusCode == 429){
                    setTimeout(() => {this.getJSON(url, method, data, callback)}, res.headers["retry-after"] * 1000);
                } else {
                    fail(res.statusCode);
                }
            });
        });
    }

    // **************************** tournament-provider-v1 *************************** //
    /**
        * get tournament Codes for a given tournament
        * @param     {number}                                                      tournamentId    the ID of the tournament
        * @param     {number}                                                      count           Number of codes you want
        * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeParameters}    params          Tournament Code parameters
        * @param     {number[]}                                                    callback        Tournaments Codes                                                                    [description]
        */
    public getTournamentCodes(tournamentId: number, count: number, params: RiotGamesAPI.TournamentProvider.TournamentCodeParameters, callback: (tournamentCodes: number[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(TOURNAMENT_URL_1 + "code?tournamentId=" + tournamentId + "&count=" + count, "post", params, (data: any) => {
                callback(data);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get tournament infos for a given tournament code
        * @param     {string}                                               tournamentCode    Tournament Code
        * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeDto}    callback          Tournament Infos
        */
    public getTournamentByCode(tournamentCode: string, callback: (tournament: RiotGamesAPI.TournamentProvider.TournamentCodeDto) => void): any{
        return new Promise((success, fail) => {
            this.getJSON(TOURNAMENT_URL_1 + "code?tournamentCode=" + tournamentCode, "get", {},(tournamentCodeDto: RiotGamesAPI.TournamentProvider.TournamentCodeDto) => {
                callback(tournamentCodeDto);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * edit the tournament Code parameters for a given tournament Code
        * @param     {string}                                                            tournamentCode    Tournament Code to update
        * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeUpdateParameters}    params            parameters to edit
        * @param     {(}                                                                 callback          callback if succes
        */
    public editTournamentByCode(tournamentCode: string, params: RiotGamesAPI.TournamentProvider.TournamentCodeUpdateParameters, callback: () => void): any{
        return new Promise((success, fail) => {
            this.getJSON(TOURNAMENT_URL_1 + "code/" + tournamentCode, "put", params,() => {
                callback();
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get the lobby envents for a given tournament Code
        * @param     {string}                                           tournamentCode    the tournament code to get the lobby events
        * @param     {RiotGamesAPI.TournamentProvider.LobbyEventDto}    callback          lobby events
        */
    public getLobbyEventByCode(tournamentCode: string, callback: (lobbyEventDto: RiotGamesAPI.TournamentProvider.LobbyEventDto) => void): any{
        return new Promise((success, fail) => {
            this.getJSON(TOURNAMENT_URL_1 + "lobby/events/by-code/" + tournamentCode, "get", {},(lobbyEvent: RiotGamesAPI.TournamentProvider.LobbyEventDto) => {
                callback(lobbyEvent);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * Register a new tournament provider
        * @param     {region_e}    region      region where you want to register the provider
        * @param     {string}      url         url of callback for the POST notifications
        * @param     {number}      callback    returns  the tounament provider ID
        */
    public registerProvider(region: region_e, url: string, callback: (providerId: number) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(TOURNAMENT_URL_1 + "provider", "post", {"region": region_e_TO_string(region), "url": url}, (data: any) => {
                callback(data);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * Register a new tournament
        * @param     {string}    name          Name of tournament
        * @param     {number}    providerId    Provider ID
        * @param     {number}    callback      returns the tournament ID
        */
    public registerTournament(name: string, providerId: number, callback: (tournamentId: number) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(TOURNAMENT_URL_1 + "tournament", "post",{"name": name, "providerId": providerId}, (data: any) => {
                callback(data);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //
}

export class ClassicAPI {
    private ApiKeys: string[];
    private ApiKey: string;
    private region: region_e;

    /**
        * ClassicAPI Constructor
        * @param     {string[]}    ApiKeys    API Keys for the requests
        * @param     {region_e}    region     region where you want to send requests
        */
    public constructor(ApiKeys: string[], region: region_e){
        this.ApiKeys = ApiKeys;
        this.ApiKey = ApiKeys[0];
        this.region = region;
    }

    /**
        * change the API Key for the next requests
        */
    private switchApiKey(): void {
        this.ApiKey = this.ApiKeys[(this.ApiKeys.indexOf(this.ApiKey) + 1) % this.ApiKeys.length];
    }

    /**
        * get the JSON response code for a given URL
        * @param     {string}      url         Request url
        * @param     {Function}    callback    JSON formatted data
        */
    private getJSON(url: string, callback): any{
        this.switchApiKey();
        return new Promise((success, fail) => {
            request({
                url: url,
                headers: {
                    "User-Agent": "request",
                    "Accept-Charset": "ISO-8859-1, utf-8"
                },
                json: true
            }, (err: any, res: any, body: string) => {
                if (res.statusCode == 200) {
                    try{
                        callback(JSON.parse(body));
                    } catch (E){
                        callback(body);
                    }
                } else if (res.statusCode == 429){
                    setTimeout(() => {this.getJSON(url, callback)}, res.headers["retry-after"] * 1000);
                } else {
                    fail(res.statusCode);
                }
            });
        });
    }

    /**
        * Edit the consts for a valid url for the riot games api
        * @param     {string}    unparsedURL    the URL to parse
        * @return    {string}                   the Parsed URL
        */
    private parseURL(unparsedURL: string): string{
        let parsedURL = unparsedURL.replace(/{region}/g, region_e_TO_string(this.region));
        parsedURL = parsedURL.replace(/{endpoint}/g, region_e_TO_endpointString(this.region));
        console.log(parsedURL);

        //if there are other params in the url :
        return parsedURL + (parsedURL.indexOf("?") > -1 ? "&" : "?") + "api_key=" + this.ApiKey;
    }

    /**
        * get the API Key that is used for the requests
        * @return    {string}    the current API Key
        */
    public getCurrentApiKey(): string {
        return this.ApiKey;
    }

    /**
        * get the region where send send request
        * @return    {region_e}    the current region
        */
    public getRegion(): region_e {
        return this.region;
    }

    /**
        * set the API Keys
        * @param    {string[]}    ApiKeys    the API Keys
        */
    public setApikeys(ApiKeys: string[]): void {
        this.ApiKeys = ApiKeys;
    }

    /**
        * set the region where you want to send requests
        * @param    {region_e}    region    the region
        */
    public setRegion(region: region_e): void {
        this.region = region;
    }

    // **************************** champion-v1.2 ************************************ //
    /**
        * get all champions of league of legends
        * @param     {RiotGamesAPI.Champion.ChampionListDto}    callback    data callback
        */
    public getChampions(callback: (championListDto: RiotGamesAPI.Champion.ChampionListDto) => void): any{
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_2 + "champion"), (champions: JSON) => {
                callback(champions["champions"]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get the champion for a given id
        * @param     {number}                               id          the champion id
        * @param     {RiotGamesAPI.Champion.ChampionDto}    callback    data callback
        */
    public getChampionById(id: number, callback: (ChampionDto: RiotGamesAPI.Champion.ChampionDto) => void):any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_2 + "champion/" + id), (champion: RiotGamesAPI.Champion.ChampionDto) => {
                callback(champion);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get the free to play champions
        * @param     {RiotGamesAPI.Champion.ChampionListDto}    callback    data callback
        */
    public getFreeToPlayChampions(callback: (championsListDto: RiotGamesAPI.Champion.ChampionListDto) => void): any{
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_2 + "champion?freeToPlay=true"), (champions: JSON) => {
                callback(champions["champions"]);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // **************************** championmastery ********************************** //
    /**
        * get Champion mastery of a player for a given champion ID
        * @param     {number}                                             summonerId    summoner ID
        * @param     {number}                                             championId    Champion ID
        * @param     {RiotGamesAPI.ChampionMastery.ChampionMasteryDto}    callback      data callback
        */
    public getChampionMastery(summonerId: number, championId: number, callback: (championMastery: RiotGamesAPI.ChampionMastery.ChampionMasteryDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/champion/" + championId), (championMasteryDto: RiotGamesAPI.ChampionMastery.ChampionMasteryDto) => {
                callback(championMasteryDto);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get all champion masteries for a given summoner
        * @param     {number}                                               summonerId    Summoner ID
        * @param     {[RiotGamesAPI.ChampionMastery.ChampionMasteryDto]}    callback      data callback
        */
    public getChampionMasteryBySummoner(summonerId: number, callback: (championsMastery: [RiotGamesAPI.ChampionMastery.ChampionMasteryDto]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/champions"), (championsMasteryDto: [RiotGamesAPI.ChampionMastery.ChampionMasteryDto]) => {
                callback(championsMasteryDto);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get the mastery score of a summoner
        * @param     {number}    summonerId    Summoner ID
        * @param     {number}    callback      Mastery Score
        */
    public getChampionMasteryScore(summonerId: number, callback: (score: number) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/score"), (score: number) => {
                callback(score);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get The 3 best champion masteries
        * @param     {[type]}                                               summonerId    Summoner ID
        * @param     {[RiotGamesAPI.ChampionMastery.ChampionMasteryDto]}    callback      data callback
        */
    public getTopChampionMastery(summonerId, callback: (championsMastery: [RiotGamesAPI.ChampionMastery.ChampionMasteryDto]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/topchampions"), (championsMasteryDto: [RiotGamesAPI.ChampionMastery.ChampionMasteryDto]) => {
                callback(championsMasteryDto);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ***************************** current-game-v1.0 ******************************* //
    /**
        * get the current game infos for a given summoner ID
        * @param     {number}                                      summonerId    Summoner ID
        * @param     {RiotGamesAPI.CurrentGame.CurrentGameInfo}    callback      data callback
        */
    public getCurrentGame(summonerId: number, callback: (gameInfoDto: RiotGamesAPI.CurrentGame.CurrentGameInfo) => void): any{
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_SPECTATOR_1_0 + summonerId), (gameInfo: RiotGamesAPI.CurrentGame.CurrentGameInfo) => {
                callback(gameInfo);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ***************************** featured-games-v1.0 ***************************** //
    /**
        * get the featured games
        * @param     {RiotGamesAPI.FeaturedGames.FeaturedGames}    callback    data callback
        */
    public getFeaturedGame(callback: (featuredGamesInfos: RiotGamesAPI.FeaturedGames.FeaturedGames) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_SPECTATOR_1_0 + "featured"), (featuredGames: RiotGamesAPI.FeaturedGames.FeaturedGames) => {
                callback(featuredGames);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ********************************** game-v1.3 ********************************** //
    /**
        * get the recents games for a given Summoner ID
        * @param     {number}                              summonerId    Summoner ID
        * @param     {RiotGamesAPI.Game.RecentGamesDto}    callback      data callback
        */
    public getRecentGames(summonerId: number, callback: (RecentGamesDto: RiotGamesAPI.Game.RecentGamesDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_3 + "game/by-summoner/" + summonerId + "/recent"), (RecentGames: RiotGamesAPI.Game.RecentGamesDto) => {
                callback(RecentGames);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ********************************** league-v2.5********************************* //
    /**
        * Get League infos of a summoner
        * @param     {number}                             summonerId    Summoner ID
        * @param     {RiotGamesAPI.League.LeagueDto[]}    callback      data callback
        */
    public getLeagueBySummonerId(summonerId: number, callback: (LeagueDto: RiotGamesAPI.League.LeagueDto[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/by-summoner/" + summonerId), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League[summonerId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get League infos of a summoner
        * @param     {number}                             summonerId    Summoner ID
        * @param     {RiotGamesAPI.League.LeagueDto[]}    callback      data callback
        */
    public getLeagueBySummonerIdEntry(summonerId: number, callback: (LeagueDto: RiotGamesAPI.League.LeagueDto[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/by-summoner/" + summonerId + "/entry"), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League[summonerId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get league infos by team
        * @param     {string}                             teamId      Team ID
        * @param     {RiotGamesAPI.League.LeagueDto[]}    callback    data callback
        */
    public getLeagueByTeamId(teamId: string, callback: (LeagueDto: RiotGamesAPI.League.LeagueDto[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/by-team/" + teamId), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League[teamId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get league infos by team
        * @param     {string}                             teamId      Team ID
        * @param     {RiotGamesAPI.League.LeagueDto[]}    callback    data callback
        */
    public getLeagueByTeamIdEntry(teamId: string, callback: (LeagueDto: RiotGamesAPI.League.LeagueDto[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/by-team/" + teamId + "/entry"), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League[teamId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get Challengers in SOLO Queue
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    public getChallengers_SOLO(callback: (League: RiotGamesAPI.League.LeagueDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/challenger?type=RANKED_SOLO_5x5"), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get Challengers Teams in 3x3
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    public getChallengers_3x3(callback: (League: RiotGamesAPI.League.LeagueDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/challenger?type=RANKED_TEAM_3x3"), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get Challengers Teams in 5x5
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    public getChallengers_5x5(callback: (League: RiotGamesAPI.League.LeagueDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/challenger?type=RANKED_TEAM_5x5"), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get Masters in Solo Queue
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    public getMasters_SOLO(callback: (League: RiotGamesAPI.League.LeagueDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/master?type=RANKED_SOLO_5x5"), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get Master Teams in 3x3
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    public getMasters_3x3(callback: (League: RiotGamesAPI.League.LeagueDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/master?type=RANKED_TEAM_3x3"), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get Master Teams in 5x5
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    public getMasters_5x5(callback: (League: RiotGamesAPI.League.LeagueDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_5 + "league/master?type=RANKED_TEAM_5x5"), (League: RiotGamesAPI.League.LeagueDto) => {
                callback(League);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ***************************** lol-static-data-v1.2 **************************** //
    /**
        * get Champions (static data)
        * @param     {RiotGamesAPI.LolStaticData.ChampionListDto}    callback    data callback
        */
    public staticDataChampions(callback: (championListDto: RiotGamesAPI.LolStaticData.ChampionListDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "champion"), (championList: RiotGamesAPI.LolStaticData.ChampionListDto) => {
                callback(championList);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get data by champion ID
        * @param     {number}                                    championsId    Champion ID
        * @param     {RiotGamesAPI.LolStaticData.ChampionDto}    callback       data callback
        */
    public staticDataChampionById(championsId: number, callback: (championDto: RiotGamesAPI.LolStaticData.ChampionDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "champion/" + championsId), (champion: RiotGamesAPI.LolStaticData.ChampionDto) => {
                callback(champion);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get League of Legends Items
        * @param     {RiotGamesAPI.LolStaticData.ItemListDto}    callback    data callback
        */
    public staticDataItems(callback: (itemsDto: RiotGamesAPI.LolStaticData.ItemListDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "item"), (items: RiotGamesAPI.LolStaticData.ItemListDto) => {
                callback(items);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * Get item infos by ID
        * @param     {number}                                itemId      item ID
        * @param     {RiotGamesAPI.LolStaticData.ItemDto}    callback    data callback
        */
    public staticDataItemById(itemId: number, callback: (itemDto: RiotGamesAPI.LolStaticData.ItemDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "item/" + itemId), (item: RiotGamesAPI.LolStaticData.ItemDto) => {
                callback(item);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get league of legends languages
        * @param     {RiotGamesAPI.LolStaticData.LanguageStringsDto}    callback    data callback
        */
    public staticDataLanguagesStrings(callback: (languageStringsDto: RiotGamesAPI.LolStaticData.LanguageStringsDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "language-strings"), (languages: RiotGamesAPI.LolStaticData.LanguageStringsDto) => {
                callback(languages);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get league of legends languages
        * @param     {string[]}    callback    data callback
        */
    public staticDataLanguages(callback: (languages: string[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "languages"), (languages: string[]) => {
                callback(languages);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get Map data
        * @param     {RiotGamesAPI.LolStaticData.MapDataDto}    callback    data callback
        */
    public staticDataMap(callback: (mapDataDto: RiotGamesAPI.LolStaticData.MapDataDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "map"), (maps: RiotGamesAPI.LolStaticData.MapDataDto) => {
                callback(maps);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get all masteries
        * @param     {RiotGamesAPI.LolStaticData.MasteryListDto}    callback    data callback
        */
    public staticDataMastery(callback: (masteryListDto: RiotGamesAPI.LolStaticData.MasteryListDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "mastery"), (masteryList: RiotGamesAPI.LolStaticData.MasteryListDto) => {
                callback(masteryList);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get data by mastery ID
        * @param     {number}                                   masteryId    Mastery ID
        * @param     {RiotGamesAPI.LolStaticData.MasteryDto}    callback     data callback
        */
    public staticDataMasteryById(masteryId: number, callback: (masteryDto: RiotGamesAPI.LolStaticData.MasteryDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "mastery/" + masteryId), (mastery: RiotGamesAPI.LolStaticData.MasteryDto) => {
                callback(mastery);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    public staticDataRealm(callback: (realmDto: RiotGamesAPI.LolStaticData.RealmDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "realm"), (realm: RiotGamesAPI.LolStaticData.RealmDto) => {
                callback(realm);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get all runes
        * @param     {RiotGamesAPI.LolStaticData.RuneListDto}    callback    data callback
        */
    public staticDataRunes(callback: (runeListDto: RiotGamesAPI.LolStaticData.RuneListDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "rune"), (runeList: RiotGamesAPI.LolStaticData.RuneListDto) => {
                callback(runeList);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get rune by Rune ID
        * @param     {number}                                runeId      Rune ID
        * @param     {RiotGamesAPI.LolStaticData.RuneDto}    callback    data callback
        */
    public staticDataRuneById(runeId: number, callback: (runeDto: RiotGamesAPI.LolStaticData.RuneDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "rune/" + runeId), (rune: RiotGamesAPI.LolStaticData.RuneDto) => {
                callback(rune);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get all summoner spells
        * @param     {RiotGamesAPI.LolStaticData.SummonerSpellListDto}    callback    data callback
        */
    public staticDataSummonerSpells(callback: (summonerSpellListDto: RiotGamesAPI.LolStaticData.SummonerSpellListDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "summoner-spell"), (summonerSpellList: RiotGamesAPI.LolStaticData.SummonerSpellListDto) => {
                callback(summonerSpellList);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get summoner spell by summoner spell ID
        * @param     {number}                                         summonerSpellId    Summoner spell ID
        * @param     {RiotGamesAPI.LolStaticData.SummonerSpellDto}    callback           data callback
        */
    public staticDataSummonSpellById(summonerSpellId: number, callback: (runeDto: RiotGamesAPI.LolStaticData.SummonerSpellDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "summoner-spell/" + summonerSpellId), (summonerSpell: RiotGamesAPI.LolStaticData.SummonerSpellDto) => {
                callback(summonerSpell);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get league of legends  versions
        * @param     {string[]}    callback    data callback
        */
    public staticDataVersion(callback: (versions: string[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(GLOBAL_URL_1_2 + "versions"), (versions: string[]) => {
                callback(versions);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ******************************** lol-status-v1.0 ****************************** //
    /**
        * get league of legends status
        * @param     {RiotGamesAPI.LolStatus.Shard[]}    callback    data callback
        */
    public getSatus(callback: (shardList: RiotGamesAPI.LolStatus.Shard[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON("http://status.leagueoflegends.com/shards", (shards: RiotGamesAPI.LolStatus.Shard[]) => {
                callback(shards);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get status for a given region
        * @param     {region_e}                        region      region
        * @param     {RiotGamesAPI.LolStatus.Shard}    callback    data callback
        */
    public getSatusByRegion(region: region_e, callback: (shard: RiotGamesAPI.LolStatus.Shard) => void): any {
        return new Promise((success, fail) => {
            this.getJSON("http://status.leagueoflegends.com/shards/" + region_e_TO_string(region), (shard: RiotGamesAPI.LolStatus.Shard) => {
                callback(shard);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ********************************* match-v2.2 ********************************** //
    /**
        * get match infos for a given match ID
        * @param     {number}                            matchId     Match ID
        * @param     {RiotGamesAPI.Match.MatchDetail}    callback    data callback
        */
    public getMatch(matchId: number, callback: (matchDetails: RiotGamesAPI.Match.MatchDetail) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_2 + "match/" + matchId), (matchDetail: RiotGamesAPI.Match.MatchDetail) => {
                callback(matchDetail);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get all matches for a given tournament code
        * @param     {string}      tournamentCode    Tournament Code
        * @param     {number[]}    callback          data callback
        */
    public getMatchIdsByTournamentCode(tournamentCode: string, callback: (matchIds: number[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_2 + "match/by-tournament/" + tournamentCode + "/ids"), (matchIds: number[]) => {
                callback(matchIds);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get match by ID in a tournament
        * @param     {number}                            matchId     Match ID
        * @param     {RiotGamesAPI.Match.MatchDetail}    callback    data callback
        */
    public getMatchForTournament(matchId: number, callback: (matchDetails: RiotGamesAPI.Match.MatchDetail) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_2 + "match/for-tournament/" + matchId), (matchDetails: RiotGamesAPI.Match.MatchDetail) => {
                callback(matchDetails);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ******************************** matchlist-v2.2 ******************************* //
    /**
        * get match list of a summoner
        * @param     {number}                              summonerId    Summoner ID
        * @param     {RiotGamesAPI.MatchList.MatchList}    callback      data callback
        */
    public getMatchList(summonerId: number, callback: (matchList: RiotGamesAPI.MatchList.MatchList) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_2 + "matchlist/by-summoner/" + summonerId), (matchList: RiotGamesAPI.MatchList.MatchList) => {
                callback(matchList);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ********************************** stats-v1.3 ********************************* //
    /**
        * get ranked stats of summoner
        * @param     {number}                               summonerId    Summoner ID
        * @param     {RiotGamesAPI.Stats.RankedStatsDto}    callback      data callback
        */
    public getStatsRanked(summonerId: number, callback: (rankedStatsDto: RiotGamesAPI.Stats.RankedStatsDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_3 + "stats/by-summoner/" + summonerId + "/ranked"), (rankedStats: RiotGamesAPI.Stats.RankedStatsDto) => {
                callback(rankedStats);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get summary ranked stats of summoner
        * @param     {number}                                          summonerId    Summoner ID
        * @param     {RiotGamesAPI.Stats.PlayerStatsSummaryListDto}    callback      data callback
        */
    public getStatsSummary(summonerId: number, callback: (playerStatsSummaryListDto: RiotGamesAPI.Stats.PlayerStatsSummaryListDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_3 + "stats/by-summoner/" + summonerId + "/summary"), (playerStatsSummaryList: RiotGamesAPI.Stats.PlayerStatsSummaryListDto) => {
                callback(playerStatsSummaryList);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ******************************** summoner-v1.4 ******************************** //
    /**
        * get summoner infos by Summoner Name
        * @param     {string}                               summonerName    Summoner Name
        * @param     {RiotGamesAPI.Summoner.SummonerDto}    callback        data callback
        */
    public getSummonerByName(summonerName: string, callback: (summonerDto: RiotGamesAPI.Summoner.SummonerDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_4 + "summoner/by-name/" + summonerName), (summoner: RiotGamesAPI.Summoner.SummonerDto) => {
                callback(summoner[summonerName]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get summoner infos by summoner ID
        * @param     {number}                               summonerId    Summoner ID
        * @param     {RiotGamesAPI.Summoner.SummonerDto}    callback      data callback
        */
    public getSummonerById(summonerId: number, callback: (summonerDto: RiotGamesAPI.Summoner.SummonerDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_4 + "summoner/" + summonerId), (summoner: RiotGamesAPI.Summoner.SummonerDto) => {
                callback(summoner[summonerId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get masteries of a summoner
        * @param     {number}                                   summonerId    Summoner ID
        * @param     {RiotGamesAPI.Summoner.MasteryPagesDto}    callback      data callback
        */
    public getSummonerMasteries(summonerId: number, callback: (masteryPagesDto: RiotGamesAPI.Summoner.MasteryPagesDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_4 + "summoner/" + summonerId + "/masteries"), (masteryPages: RiotGamesAPI.Summoner.MasteryPagesDto) => {
                callback(masteryPages[summonerId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get the Summoner Name of a summoner ID
        * @param     {number}    summonerId    Summoner ID
        * @param     {string}    callback      data callback
        */
    public getSummonerName(summonerId: number, callback: (summonerName: string) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_4 + "summoner/" + summonerId + "/name"), (summonerName: JSON) => {
                callback(summonerName[summonerId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get the runes of a summoner
        * @param     {number}                                summonerId    Summoner ID
        * @param     {RiotGamesAPI.Summoner.RunePagesDto}    callback      data callback
        */
    public getSummonerRunes(summonerId: number, callback: (runePagesDto: RiotGamesAPI.Summoner.RunePagesDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_1_4 + "summoner/" + summonerId + "/runes"), (runePages: RiotGamesAPI.Summoner.RunePagesDto) => {
                callback(runePages[summonerId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //

    // ********************************* team-v2.4 *********************************** //
    /**
        * get teams of a summoner
        * @param     {number}                         summonerId    Summoner ID
        * @param     {RiotGamesAPI.Team.TeamDto[]}    callback      data callback
        */
    public getTeamsBySummoner(summonerId: number, callback: (teamsList: RiotGamesAPI.Team.TeamDto[]) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_4 + "team/by-summoner/" + summonerId), (teamList: RiotGamesAPI.Team.TeamDto) => {
                callback(teamList[summonerId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
        * get Team infos by Team ID
        * @param     {string}                       teamId      Team ID
        * @param     {RiotGamesAPI.Team.TeamDto}    callback    data callback
        */
    public getTeamById(teamId: string, callback: (teamDto: RiotGamesAPI.Team.TeamDto) => void): any {
        return new Promise((success, fail) => {
            this.getJSON(this.parseURL(URL_2_4 + "team/" + teamId), (team: RiotGamesAPI.Team.TeamDto) => {
                callback(team[teamId]);
            }).catch((err) => {
                fail(err);
            });
        });
    }
    // ******************************************************************************* //
}
