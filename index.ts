// NodeJS Library for Riot Games
// Project: https://developer.riotgames.com/
// Library by : Luca Laissue <https://github.com/zafixlrp>

import request = require("request");

export const BASE_URL = "https://{region}.api.pvp.net/api/lol/{region}/";
// ClassicURLS
export const URL_1_2: string = `${BASE_URL}v1.2/`;
export const URL_1_3: string = `${BASE_URL}v1.3/`;
export const URL_1_4: string = `${BASE_URL}v1.4/`;
export const URL_2_2: string = `${BASE_URL}v2.2/`;
export const URL_2_4: string = `${BASE_URL}v2.4/`;
export const URL_2_5: string = `${BASE_URL}v2.5/`;

// ChampionMasteryURL
const CHAMPIONMASTERY_URL: string = "https://{region}.api.pvp.net/championmastery/location/{endpoint}/";

// Statics Global URLS
const GLOBAL_URL_1_2: string = "https://global.api.pvp.net/api/lol/static-data/{region}/v1.2/";

// Spectator
const URL_SPECTATOR_1_0: string = "https://{region}.api.pvp.net/observer-mode/rest/";

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

interface ErrorCode{
    code: number;
    message: string;
}

const ERROR_CODES = {
    400: "Bad request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not found",
    415: "Unsupported media type",
    429: "Rate limit exceeded",
    500: "Internal server error",
    503: "Service unavailable"
};

/**
 * Base API
 */
export class API {
    private apiKeys: string[];
    private apiKey: string;

    public constructor(apiKeys: string[]){
        this.apiKeys = apiKeys;
        this.apiKey = apiKeys[0];
    }

    /**
     * Change the Api Key for the next requests
     */
    private switchApiKey(): void {
        this.apiKey = this.apiKeys[(this.apiKeys.indexOf(this.apiKey) + 1) % this.apiKeys.length];
    }

    /**
     * Send a request to the Riot Games Api and return a formatted json via a callback
     * @param     {string}    url         request url
     * @param     {string}    method      method(post / put / get)
     * @param     {[type]}    data        body parameters
     * @param     {(JSON}     callback    callback function with formatted JSON
     */
    public getJSON(url: string, method: string, data: any): Promise<any>{
        this.switchApiKey();
        return new Promise((success, fail) => {
            request(
                {
                url: url,
                method: method,
                headers: {
                    "User-Agent": "Nodejs Server Request",
                    "Accept-Charset": "ISO-8859-1, utf-8",
                    "X-Riot-Token": this.apiKey
                },
                json: true,
                body: data
            }, (err: any, res: any, body: string) => {
                if (res.statusCode == 200 || res.statusCode == 204) {
                    try{
                        success(JSON.parse(body));
                    } catch (E){
                        success(body);
                    }
                } else if (res.statusCode == 429){
                    setTimeout(() => {this.getJSON(url, method, data).then(success); }, res["Retry-After"] * 1000);
                } else {
                    fail({code: res.statusCode, message: ERROR_CODES[res.statusCode]});
                }
            });
        });
    }

    public request(url: string, method: string, data: any, prop?: string): Promise<any> {
        return new Promise((success, fail) => {
            this.getJSON(url, method, data).then((data) => {
                if(prop === null) {
                    success();
                } else if(prop === undefined) {
                    success(data);
                } else {
                    success(data[prop]);
                }
            }).catch((err) => {
                fail(err);
            });
        });
    }

    /**
     * get the API Key that is used for the requests
     * @return    {string}    the current API Key
     */
    public getCurrentApiKey(): string {
        return this.apiKey;
    }


    /**
     * set the API Keys
     * @param    {string[]}    ApiKeys    the API Keys
     */
    public setApikeys(apiKeys: string[]): void {
        this.apiKeys = apiKeys;
    }
}


/**
 * Tournament API
 */
export class TournamentAPI extends API{


    constructor(...apiKeys: string[]) {
        super(apiKeys);
    }

    // **************************** tournament-provider-v1 *************************** //

    /**
     * create tournament Codes for a given tournament
     * @param     {number}                                                      tournamentId    the ID of the tournament
     * @param     {number}                                                      count           Number of codes you want
     * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeParameters}    params          Tournament Code parameters
     * @param     {number[]}                                                    callback        Tournaments Codes                                                                    [description]
     */
    public createTournamentCodes(tournamentId: number, count: number, params: RiotGamesAPI.TournamentProvider.TournamentCodeParameters): Promise<number[]> {
        return this.request(TOURNAMENT_URL_1 + "code?tournamentId=" + tournamentId + "&count=" + count, "post", params);
    }

    /**
     * get tournament infos for a given tournament code
     * @param     {string}                                               tournamentCode    Tournament Code
     * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeDto}    callback          Tournament Infos
     */
    public getTournamentByCode(tournamentCode: string): Promise<RiotGamesAPI.TournamentProvider.TournamentCodeDto>{
        return this.request(TOURNAMENT_URL_1 + "code?tournamentCode=" + tournamentCode, "get", null);
    }

    /**
     * edit the tournament Code parameters for a given tournament Code
     * @param     {string}                                                            tournamentCode    Tournament Code to update
     * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeUpdateParameters}    params            parameters to edit
     * @param     {(}                                                                 callback          callback if succes
     */
    public editTournamentByCode(tournamentCode: string, params: RiotGamesAPI.TournamentProvider.TournamentCodeUpdateParameters): Promise<() => void>{
        return this.request(TOURNAMENT_URL_1 + "code/" + tournamentCode, "put", params, null);
    }

    /**
     * get the lobby envents for a given tournament Code
     * @param     {string}                                           tournamentCode    the tournament code to get the lobby events
     * @param     {RiotGamesAPI.TournamentProvider.LobbyEventDto}    callback          lobby events
     */
    public getLobbyEventByCode(tournamentCode: string): Promise<RiotGamesAPI.TournamentProvider.LobbyEventDto>{
        return this.request(TOURNAMENT_URL_1 + "lobby/events/by-code/" + tournamentCode, "get", null);
    }

    /**
     * Register a new tournament provider
     * @param     {region_e}    region      region where you want to register the provider
     * @param     {string}      url         url of callback for the POST notifications
     * @param     {number}      callback    returns  the tounament provider ID
     */
    public registerProvider(region: region_e, url: string): Promise<number> {
        return this.request(TOURNAMENT_URL_1 + "provider", "post", {"region": region_e_TO_string(region), "url": url});
    }

    /**
     * Register a new tournament
     * @param     {string}    name          Name of tournament
     * @param     {number}    providerId    Provider ID
     * @param     {number}    callback      returns the tournament ID
     */
    public registerTournament(name: string, providerId: number): Promise<number> {
        return this.request(TOURNAMENT_URL_1 + "tournament", "post", {"name": name, "providerId": providerId});
    }
    // ******************************************************************************* //
}

export class ClassicAPI extends API{
    private region: region_e;

    /**
     * ClassicAPI Constructor
     * @param     {string[]}    ApiKeys    API Keys for the requests
     * @param     {region_e}    region     region where you want to send requests
     */
    public constructor(apiKeys: string[], region: region_e){
        super(apiKeys);
        this.region = region;
    }

    /**
     * Edit the consts for a valid url for the riot games api
     * @param     {string}    unparsedURL    the URL to parse
     * @return    {string}                   the Parsed URL
     */
    public parseURL(unparsedURL: string): string{
        let parsedURL = unparsedURL.replace(/{region}/g, region_e_TO_string(this.region));
        parsedURL = parsedURL.replace(/{endpoint}/g, region_e_TO_endpointString(this.region));

        // if there are other params in the url :
        return parsedURL + (parsedURL.indexOf("?") > -1 ? "&" : "?") + "api_key=" + this.getCurrentApiKey();
    }

    /**
     * get the region where send send request
     * @return    {region_e}    the current region
     */
    public getRegion(): region_e {
        return this.region;
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
    public getChampions(): Promise<RiotGamesAPI.Champion.ChampionListDto> {
        return this.request(this.parseURL(URL_1_2 + "champion"), "get", null, "champions");
    }

    /**
     * get the champion for a given id
     * @param     {number}                               id          the champion id
     * @param     {RiotGamesAPI.Champion.ChampionDto}    callback    data callback
     */
    public getChampionById(id: number): Promise<RiotGamesAPI.Champion.ChampionDto> {
        return this.request(this.parseURL(URL_1_2 + "champion/" + id), "get", null);
    }

    /**
     * get the free to play champions
     * @param     {RiotGamesAPI.Champion.ChampionListDto}    callback    data callback
     */
    public getFreeToPlayChampions(): Promise<RiotGamesAPI.Champion.ChampionListDto> {
        return this.request(this.parseURL(URL_1_2 + "champion?freeToPlay=true"), "get", null, "champions");
    }
    // ******************************************************************************* //

    // **************************** championmastery ********************************** //
    /**
     * get Champion mastery of a player for a given champion ID
     * @param     {number}                                             summonerId    summoner ID
     * @param     {number}                                             championId    Champion ID
     * @param     {RiotGamesAPI.ChampionMastery.ChampionMasteryDto}    callback      data callback
     */
    public getChampionMastery(summonerId: number, championId: number): Promise<RiotGamesAPI.ChampionMastery.ChampionMasteryDto> {
        return this.request(this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/champion/" + championId), "get", null);
    }

    /**
     * get all champion masteries for a given summoner
     * @param     {number}                                               summonerId    Summoner ID
     * @param     {[RiotGamesAPI.ChampionMastery.ChampionMasteryDto]}    callback      data callback
     */
    public getChampionMasteryBySummoner(summonerId: number): Promise<[RiotGamesAPI.ChampionMastery.ChampionMasteryDto]> {
        return this.request(this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/champions"), "get", null);
    }

    /**
     * get the mastery score of a summoner
     * @param     {number}    summonerId    Summoner ID
     * @param     {number}    callback      Mastery Score
     */
    public getChampionMasteryScore(summonerId: number): Promise<number> {
        return this.request(this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/score"), "get", null);
    }

    /**
     * get The 3 best champion masteries
     * @param     {[type]}                                               summonerId    Summoner ID
     * @param     {[RiotGamesAPI.ChampionMastery.ChampionMasteryDto]}    callback      data callback
     */
    public getTopChampionMastery(summonerId): Promise<[RiotGamesAPI.ChampionMastery.ChampionMasteryDto]> {
        return this.request(this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/topchampions"), "get", null);
    }
    // ******************************************************************************* //

    // ***************************** current-game-v1.0 ******************************* //
    /**
     * get the current game infos for a given summoner ID
     * @param     {number}                                      summonerId    Summoner ID
     * @param     {RiotGamesAPI.CurrentGame.CurrentGameInfo}    callback      data callback
     */
    public getCurrentGame(summonerId: number): Promise<RiotGamesAPI.CurrentGame.CurrentGameInfo> {
        return this.request(this.parseURL(URL_SPECTATOR_1_0 + "consumer/getSpectatorGameInfo/{endpoint}/" + summonerId), "get", null);
    }
    // ******************************************************************************* //

    // ***************************** featured-games-v1.0 ***************************** //
    /**
     * get the featured games
     * @param     {RiotGamesAPI.FeaturedGames.FeaturedGames}    callback    data callback
     */
    public getFeaturedGame(): Promise<RiotGamesAPI.FeaturedGames.FeaturedGames> {
        return this.request(this.parseURL(URL_SPECTATOR_1_0 + "featured"), "get", null);
    }
    // ******************************************************************************* //

    // ********************************** game-v1.3 ********************************** //
    /**
     * get the recents games for a given Summoner ID
     * @param     {number}                              summonerId    Summoner ID
     * @param     {RiotGamesAPI.Game.RecentGamesDto}    callback      data callback
     */
    public getRecentGames(summonerId: number): Promise<RiotGamesAPI.Game.RecentGamesDto> {
        return this.request(this.parseURL(URL_1_3 + "game/by-summoner/" + summonerId + "/recent"), "get", null);
    }
    // ******************************************************************************* //

    // ********************************** league-v2.5********************************* //
    /**
     * Get League infos of a summoner
     * @param     {number}                             summonerId    Summoner ID
     * @param     {RiotGamesAPI.League.LeagueDto[]}    callback      data callback
     */
    public getLeagueBySummonerId(summonerId: number): Promise<RiotGamesAPI.League.LeagueDto[]> {
        return this.request(this.parseURL(URL_2_5 + "league/by-summoner/" + summonerId), "get", null, summonerId.toString());
    }

    /**
     * get League infos of a summoner
     * @param     {number}                             summonerId    Summoner ID
     * @param     {RiotGamesAPI.League.LeagueDto[]}    callback      data callback
     */
    public getLeagueBySummonerIdEntry(summonerId: number): Promise<RiotGamesAPI.League.LeagueDto[]> {
        return this.request(this.parseURL(URL_2_5 + "league/by-summoner/" + summonerId + "/entry"), "get", null, summonerId.toString());
    }

    /**
     * get league infos by team
     * @param     {string}                             teamId      Team ID
     * @param     {RiotGamesAPI.League.LeagueDto[]}    callback    data callback
     */
    public getLeagueByTeamId(teamId: string): Promise<RiotGamesAPI.League.LeagueDto[]> {
        return this.request(this.parseURL(URL_2_5 + "league/by-team/" + teamId), "get", null, teamId.toString());
    }

    /**
     * get league infos by team
     * @param     {string}                             teamId      Team ID
     * @param     {RiotGamesAPI.League.LeagueDto[]}    callback    data callback
     */
    public getLeagueByTeamIdEntry(teamId: string): Promise<RiotGamesAPI.League.LeagueDto[]> {
        return this.request(this.parseURL(URL_2_5 + "league/by-team/" + teamId + "/entry"), "get", null, teamId.toString());
    }

    /**
     * get Challengers in SOLO Queue
     * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
     */
    public getChallengers_SOLO(): Promise<RiotGamesAPI.League.LeagueDto> {
        return this.request(this.parseURL(URL_2_5 + "league/challenger?type=RANKED_SOLO_5x5"), "get", null);
    }

    /**
     * get Challengers Teams in 3x3
     * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
     */
    public getChallengers_3x3(): Promise<RiotGamesAPI.League.LeagueDto> {
        return this.request(this.parseURL(URL_2_5 + "league/challenger?type=RANKED_TEAM_3x3"), "get", null);
    }

    /**
     * get Challengers Teams in 5x5
     * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
     */
    public getChallengers_5x5(): Promise<RiotGamesAPI.League.LeagueDto> {
        return this.request(this.parseURL(URL_2_5 + "league/challenger?type=RANKED_TEAM_5x5"), "get", null);
    }

    /**
     * get Masters in Solo Queue
     * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
     */
    public getMasters_SOLO(): Promise<RiotGamesAPI.League.LeagueDto> {
        return this.request(this.parseURL(URL_2_5 + "league/master?type=RANKED_SOLO_5x5"), "get", null);
    }

    /**
     * get Master Teams in 3x3
     * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
     */
    public getMasters_3x3(): Promise<RiotGamesAPI.League.LeagueDto> {
        return this.request(this.parseURL(URL_2_5 + "league/master?type=RANKED_TEAM_3x3"), "get", null);
    }

    /**
     * get Master Teams in 5x5
     * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
     */
    public getMasters_5x5(): Promise<RiotGamesAPI.League.LeagueDto> {
        return this.request(this.parseURL(URL_2_5 + "league/master?type=RANKED_TEAM_5x5"), "get", null);
    }
    // ******************************************************************************* //

    // ***************************** lol-static-data-v1.2 **************************** //
    /**
     * get Champions (static data)
     * @param     {RiotGamesAPI.LolStaticData.ChampionListDto}    callback    data callback
     */
    public staticDataChampions(): Promise<RiotGamesAPI.LolStaticData.ChampionListDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "champion"), "get", null);
    }

    /**
     * get data by champion ID
     * @param     {number}                                    championsId    Champion ID
     * @param     {RiotGamesAPI.LolStaticData.ChampionDto}    callback       data callback
     */
    public staticDataChampionById(championsId: number): Promise<RiotGamesAPI.LolStaticData.ChampionDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "champion/" + championsId), "get", null);
    }

    /**
     * get League of Legends Items
     * @param     {RiotGamesAPI.LolStaticData.ItemListDto}    callback    data callback
     */
    public staticDataItems(): Promise<RiotGamesAPI.LolStaticData.ItemListDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "item"), "get", null);
    }

    /**
     * Get item infos by ID
     * @param     {number}                                itemId      item ID
     * @param     {RiotGamesAPI.LolStaticData.ItemDto}    callback    data callback
     */
    public staticDataItemById(itemId: number): Promise<RiotGamesAPI.LolStaticData.ItemDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "item/" + itemId), "get", null);
    }

    /**
     * get league of legends languages
     * @param     {RiotGamesAPI.LolStaticData.LanguageStringsDto}    callback    data callback
     */
    public staticDataLanguagesStrings(): Promise<RiotGamesAPI.LolStaticData.LanguageStringsDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "language-strings"), "get", null);
    }

    /**
     * get league of legends languages
     * @param     {string[]}    callback    data callback
     */
    public staticDataLanguages(): Promise<string[]> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "languages"), "get", null);
    }

    /**
     * get Map data
     * @param     {RiotGamesAPI.LolStaticData.MapDataDto}    callback    data callback
     */
    public staticDataMap(): Promise<RiotGamesAPI.LolStaticData.MapDataDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "map"), "get", null);
    }

    /**
     * get all masteries
     * @param     {RiotGamesAPI.LolStaticData.MasteryListDto}    callback    data callback
     */
    public staticDataMastery(): Promise<RiotGamesAPI.LolStaticData.MasteryListDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "mastery"), "get", null);
    }

    /**
     * get data by mastery ID
     * @param     {number}                                   masteryId    Mastery ID
     * @param     {RiotGamesAPI.LolStaticData.MasteryDto}    callback     data callback
     */
    public staticDataMasteryById(masteryId: number): Promise<RiotGamesAPI.LolStaticData.MasteryDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "mastery/" + masteryId), "get", null);
    }

    public staticDataRealm(): Promise<RiotGamesAPI.LolStaticData.RealmDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "realm"), "get", null);
    }

    /**
     * get all runes
     * @param     {RiotGamesAPI.LolStaticData.RuneListDto}    callback    data callback
     */
    public staticDataRunes(): Promise<RiotGamesAPI.LolStaticData.RuneListDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "rune"), "get", null);
    }

    /**
     * get rune by Rune ID
     * @param     {number}                                runeId      Rune ID
     * @param     {RiotGamesAPI.LolStaticData.RuneDto}    callback    data callback
     */
    public staticDataRuneById(runeId: number): Promise<RiotGamesAPI.LolStaticData.RuneDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "rune/" + runeId), "get", null);
    }

    /**
     * get all summoner spells
     * @param     {RiotGamesAPI.LolStaticData.SummonerSpellListDto}    callback    data callback
     */
    public staticDataSummonerSpells(): Promise<RiotGamesAPI.LolStaticData.SummonerSpellListDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "summoner-spell"), "get", null);
    }

    /**
     * get summoner spell by summoner spell ID
     * @param     {number}                                         summonerSpellId    Summoner spell ID
     * @param     {RiotGamesAPI.LolStaticData.SummonerSpellDto}    callback           data callback
     */
    public staticDataSummonSpellById(summonerSpellId: number): Promise<RiotGamesAPI.LolStaticData.SummonerSpellDto> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "summoner-spell/" + summonerSpellId), "get", null);
    }

    /**
     * get league of legends  versions
     * @param     {string[]}    callback    data callback
     */
    public staticDataVersion(): Promise<string[]> {
        return this.request(this.parseURL(GLOBAL_URL_1_2 + "versions"), "get", null);
    }
    // ******************************************************************************* //

    // ******************************** lol-status-v1.0 ****************************** //
    /**
     * get league of legends status
     * @param     {RiotGamesAPI.LolStatus.Shard[]}    callback    data callback
     */
    public getStatus(): Promise<RiotGamesAPI.LolStatus.Shard[]> {
        return this.request("http://status.leagueoflegends.com/shards", "get", null);
    }

    /**
     * get status for a given region
     * @param     {region_e}                        region      region
     * @param     {RiotGamesAPI.LolStatus.Shard}    callback    data callback
     */
    public getStatusByRegion(region: region_e): Promise<RiotGamesAPI.LolStatus.Shard> {
        return this.request("http://status.leagueoflegends.com/shards/" + region_e_TO_string(region), "get", null);
    }
    // ******************************************************************************* //

    // ********************************* match-v2.2 ********************************** //
    /**
     * get match infos for a given match ID
     * @param     {number}                            matchId     Match ID
     * @param     {RiotGamesAPI.Match.MatchDetail}    callback    data callback
     */
    public getMatch(matchId: number): Promise<RiotGamesAPI.Match.MatchDetail> {
        return this.request(this.parseURL(URL_2_2 + "match/" + matchId), "get", null);
    }

    /**
     * get all matches for a given tournament code
     * @param     {string}      tournamentCode    Tournament Code
     * @param     {number[]}    callback          data callback
     */
    public getMatchIdsByTournamentCode(tournamentCode: string): Promise<number[]> {
        return this.request(this.parseURL(URL_2_2 + "match/by-tournament/" + tournamentCode + "/ids"), "get", null);
    }

    /**
     * get match by ID in a tournament
     * @param     {number}                            matchId     Match ID
     * @param     {RiotGamesAPI.Match.MatchDetail}    callback    data callback
     */
    public getMatchForTournament(matchId: number): Promise<RiotGamesAPI.Match.MatchDetail> {
        return this.request(this.parseURL(URL_2_2 + "match/for-tournament/" + matchId), "get", null);
    }
    // ******************************************************************************* //

    // ******************************** matchlist-v2.2 ******************************* //
    /**
     * get match list of a summoner
     * @param     {number}                              summonerId    Summoner ID
     * @param     {RiotGamesAPI.MatchList.MatchList}    callback      data callback
     */
    public getMatchList(summonerId: number): Promise<RiotGamesAPI.MatchList.MatchList> {
        return this.request(this.parseURL(URL_2_2 + "matchlist/by-summoner/" + summonerId), "get", null);
    }
    // ******************************************************************************* //

    // ********************************** stats-v1.3 ********************************* //
    /**
     * get ranked stats of summoner
     * @param     {number}                               summonerId    Summoner ID
     * @param     {RiotGamesAPI.Stats.RankedStatsDto}    callback      data callback
     */
    public getStatsRanked(summonerId: number): Promise<RiotGamesAPI.Stats.RankedStatsDto> {
        return this.request(this.parseURL(URL_1_3 + "stats/by-summoner/" + summonerId + "/ranked"), "get", null);
    }

    /**
     * get summary ranked stats of summoner
     * @param     {number}                                          summonerId    Summoner ID
     * @param     {RiotGamesAPI.Stats.PlayerStatsSummaryListDto}    callback      data callback
     */
    public getStatsSummary(summonerId: number): Promise<RiotGamesAPI.Stats.PlayerStatsSummaryListDto> {
        return this.request(this.parseURL(URL_1_3 + "stats/by-summoner/" + summonerId + "/summary"), "get", null);
    }
    // ******************************************************************************* //

    // ******************************** summoner-v1.4 ******************************** //
    /**
     * get summoner infos by Summoner Name
     * @param     {string}                               summonerName    Summoner Name
     * @param     {RiotGamesAPI.Summoner.SummonerDto}    callback        data callback
     */
    public getSummonerByName(summonerName: string): Promise<RiotGamesAPI.Summoner.SummonerDto> {
        return this.request(this.parseURL(URL_1_4 + "summoner/by-name/" + summonerName), "get", null, summonerName);
    }

    /**
     * get summoner infos by summoner ID
     * @param     {number}                               summonerId    Summoner ID
     * @param     {RiotGamesAPI.Summoner.SummonerDto}    callback      data callback
     */
    public getSummonerById(summonerId: number): Promise<RiotGamesAPI.Summoner.SummonerDto> {
        return this.request(this.parseURL(URL_1_4 + "summoner/" + summonerId), "get", null, summonerId.toString());
    }

    /**
     * get masteries of a summoner
     * @param     {number}                                   summonerId    Summoner ID
     * @param     {RiotGamesAPI.Summoner.MasteryPagesDto}    callback      data callback
     */
    public getSummonerMasteries(summonerId: number): Promise<RiotGamesAPI.Summoner.MasteryPagesDto> {
        return this.request(this.parseURL(URL_1_4 + "summoner/" + summonerId + "/masteries"), "get", null, summonerId.toString());
    }

    /**
     * get the Summoner Name of a summoner ID
     * @param     {number}    summonerId    Summoner ID
     * @param     {string}    callback      data callback
     */
    public getSummonerName(summonerId: number): Promise<string> {
        return this.request(this.parseURL(URL_1_4 + "summoner/" + summonerId + "/name"), "get", null, summonerId.toString());
    }

    /**
     * get the runes of a summoner
     * @param     {number}                                summonerId    Summoner ID
     * @param     {RiotGamesAPI.Summoner.RunePagesDto}    callback      data callback
     */
    public getSummonerRunes(summonerId: number): Promise<RiotGamesAPI.Summoner.RunePagesDto> {
        return this.request(this.parseURL(URL_1_4 + "summoner/" + summonerId + "/runes"), "get", null, summonerId.toString());
    }
    // ******************************************************************************* //

    // ********************************* team-v2.4 *********************************** //
    /**
     * get teams of a summoner
     * @param     {number}                         summonerId    Summoner ID
     * @param     {RiotGamesAPI.Team.TeamDto[]}    callback      data callback
     */
    public getTeamsBySummoner(summonerId: number): Promise<RiotGamesAPI.Team.TeamDto[]> {
        return this.request(this.parseURL(URL_2_4 + "team/by-summoner/" + summonerId), "get", null, summonerId.toString());
    }

    /**
     * get Team infos by Team ID
     * @param     {string}                       teamId      Team ID
     * @param     {RiotGamesAPI.Team.TeamDto}    callback    data callback
     */
    public getTeamById(teamId: string): Promise<RiotGamesAPI.Team.TeamDto> {
        return this.request(this.parseURL(URL_2_4 + "team/" + teamId), "get", null, teamId.toString());
    }
    // ******************************************************************************* //
}
