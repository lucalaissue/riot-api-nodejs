// NodeJS Library for Riot Games
// Project: https://developer.riotgames.com/
// Library by : Luca Laissue <https://github.com/zafixlrp>
var request = require("request");
var es6_promise_1 = require("es6-promise");
//ClassicURLS
var URL_1_0 = "https://{region}.api.pvp.net/api/lol/{region}/v1.0/";
var URL_1_2 = "https://{region}.api.pvp.net/api/lol/{region}/v1.2/";
var URL_1_3 = "https://{region}.api.pvp.net/api/lol/{region}/v1.3/";
var URL_1_4 = "https://{region}.api.pvp.net/api/lol/{region}/v1.4/";
var URL_2_2 = "https://{region}.api.pvp.net/api/lol/{region}/v2.2/";
var URL_2_4 = "https://{region}.api.pvp.net/api/lol/{region}/v2.4/";
var URL_2_5 = "https://{region}.api.pvp.net/api/lol/{region}/v2.5/";
//ChampionMasteryURL
var CHAMPIONMASTERY_URL = "https://{region}.api.pvp.net/championmastery/location/{endpoint}/";
//Statics Global URLS
var GLOBAL_URL_1_2 = "https://global.api.pvp.net/api/lol/static-data/{region}/v1.2/";
//Spectator
var URL_SPECTATOR_1_0 = "https://{region}.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/{endpoint}/";
//Tournament ULRS
var TOURNAMENT_URL_1 = "https://global.api.pvp.net/tournament/public/v1/";
function region_e_TO_endpointString(param) {
    switch (param) {
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
function region_e_TO_string(param) {
    switch (param) {
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
//Regions List
(function (region_e) {
    region_e[region_e["BR"] = 0] = "BR";
    region_e[region_e["EUNE"] = 1] = "EUNE";
    region_e[region_e["EUW"] = 2] = "EUW";
    region_e[region_e["KR"] = 3] = "KR";
    region_e[region_e["LAN"] = 4] = "LAN";
    region_e[region_e["LAS"] = 5] = "LAS";
    region_e[region_e["NA"] = 6] = "NA";
    region_e[region_e["OCE"] = 7] = "OCE";
    region_e[region_e["TR"] = 8] = "TR";
    region_e[region_e["RU"] = 9] = "RU";
    region_e[region_e["PBE"] = 10] = "PBE";
})(exports.region_e || (exports.region_e = {}));
var region_e = exports.region_e;
/**
    * Tournament API
    */
var TournamentAPI = (function () {
    /**
        * TournamentAPI Constructor
        */
    function TournamentAPI() {
        var ApiKeys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ApiKeys[_i - 0] = arguments[_i];
        }
        this.ApiKeys = ApiKeys;
        this.ApiKey = ApiKeys[0];
    }
    /**
        * Change the Api Key for the next requests
        */
    TournamentAPI.prototype.switchApiKey = function () {
        this.ApiKey = this.ApiKeys[(this.ApiKeys.indexOf(this.ApiKey) + 1) % this.ApiKeys.length];
    };
    /**
        * Send a request to the Riot Games Api and return a formatted json via a callback
        * @param     {string}    url         request url
        * @param     {string}    method      method(post / put / get)
        * @param     {[type]}    data        body parameters
        * @param     {(JSON}     callback    callback function with formatted JSON
        */
    TournamentAPI.prototype.getJSON = function (url, method, data, callback) {
        var _this = this;
        this.switchApiKey;
        return new es6_promise_1.Promise(function (success, fail) {
            request({
                url: url,
                method: method,
                headers: {
                    "User-Agent": "request",
                    "Accept-Charset": "utf-8",
                    "X-Riot-Token": _this.ApiKey
                },
                json: true,
                body: data
            }, function (err, res, body) {
                if (res.statusCode == 200 || res.statusCode == 204) {
                    try {
                        callback(JSON.parse(body));
                    }
                    catch (E) {
                        callback(body);
                    }
                }
                else if (res.statusCode == 429) {
                    setTimeout(function () { _this.getJSON(url, method, data, callback); }, res.headers["retry-after"] * 1000);
                }
                else {
                    fail(res.statusCode);
                }
            });
        });
    };
    // **************************** tournament-provider-v1 *************************** //
    /**
        * get tournament Codes for a given tournament
        * @param     {number}                                                      tournamentId    the ID of the tournament
        * @param     {number}                                                      count           Number of codes you want
        * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeParameters}    params          Tournament Code parameters
        * @param     {number[]}                                                    callback        Tournaments Codes                                                                    [description]
        */
    TournamentAPI.prototype.getTournamentCodes = function (tournamentId, count, params, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(TOURNAMENT_URL_1 + "code?tournamentId=" + tournamentId + "&count=" + count, "post", params, function (data) {
                callback(data);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get tournament infos for a given tournament code
        * @param     {string}                                               tournamentCode    Tournament Code
        * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeDto}    callback          Tournament Infos
        */
    TournamentAPI.prototype.getTournamentByCode = function (tournamentCode, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(TOURNAMENT_URL_1 + "code?tournamentCode=" + tournamentCode, "get", {}, function (tournamentCodeDto) {
                callback(tournamentCodeDto);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * edit the tournament Code parameters for a given tournament Code
        * @param     {string}                                                            tournamentCode    Tournament Code to update
        * @param     {RiotGamesAPI.TournamentProvider.TournamentCodeUpdateParameters}    params            parameters to edit
        * @param     {(}                                                                 callback          callback if succes
        */
    TournamentAPI.prototype.editTournamentByCode = function (tournamentCode, params, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(TOURNAMENT_URL_1 + "code/" + tournamentCode, "put", params, function () {
                callback();
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get the lobby envents for a given tournament Code
        * @param     {string}                                           tournamentCode    the tournament code to get the lobby events
        * @param     {RiotGamesAPI.TournamentProvider.LobbyEventDto}    callback          lobby events
        */
    TournamentAPI.prototype.getLobbyEventByCode = function (tournamentCode, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(TOURNAMENT_URL_1 + "lobby/events/by-code/" + tournamentCode, "get", {}, function (lobbyEvent) {
                callback(lobbyEvent);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * Register a new tournament provider
        * @param     {region_e}    region      region where you want to register the provider
        * @param     {string}      url         url of callback for the POST notifications
        * @param     {number}      callback    returns  the tounament provider ID
        */
    TournamentAPI.prototype.registerProvider = function (region, url, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(TOURNAMENT_URL_1 + "provider", "post", { "region": region_e_TO_string(region), "url": url }, function (data) {
                callback(data);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * Register a new tournament
        * @param     {string}    name          Name of tournament
        * @param     {number}    providerId    Provider ID
        * @param     {number}    callback      returns the tournament ID
        */
    TournamentAPI.prototype.registerTournament = function (name, providerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(TOURNAMENT_URL_1 + "tournament", "post", { "name": name, "providerId": providerId }, function (data) {
                callback(data);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    return TournamentAPI;
})();
exports.TournamentAPI = TournamentAPI;
var ClassicAPI = (function () {
    /**
        * ClassicAPI Constructor
        * @param     {string[]}    ApiKeys    API Keys for the requests
        * @param     {region_e}    region     region where you want to send requests
        */
    function ClassicAPI(ApiKeys, region) {
        this.ApiKeys = ApiKeys;
        this.ApiKey = ApiKeys[0];
        this.region = region;
    }
    /**
        * change the API Key for the next requests
        */
    ClassicAPI.prototype.switchApiKey = function () {
        this.ApiKey = this.ApiKeys[(this.ApiKeys.indexOf(this.ApiKey) + 1) % this.ApiKeys.length];
    };
    /**
        * get the JSON response code for a given URL
        * @param     {string}      url         Request url
        * @param     {Function}    callback    JSON formatted data
        */
    ClassicAPI.prototype.getJSON = function (url, callback) {
        var _this = this;
        this.switchApiKey();
        return new es6_promise_1.Promise(function (success, fail) {
            request(url, function (err, res, body) {
                if (res.statusCode == 200) {
                    try {
                        callback(JSON.parse(body));
                    }
                    catch (E) {
                        callback(body);
                    }
                }
                else if (res.statusCode == 429) {
                    setTimeout(function () { _this.getJSON(url, callback); }, res.headers["retry-after"] * 1000);
                }
                else {
                    fail(res.statusCode);
                }
            });
        });
    };
    /**
        * Edit the consts for a valid url for the riot games api
        * @param     {string}    unparsedURL    the URL to parse
        * @return    {string}                   the Parsed URL
        */
    ClassicAPI.prototype.parseURL = function (unparsedURL) {
        var parsedURL = unparsedURL.replace(/{region}/g, region_e_TO_string(this.region));
        parsedURL = parsedURL.replace(/{endpoint}/g, region_e_TO_endpointString(this.region));
        //if there are other params in the url :
        return parsedURL + (parsedURL.indexOf("?") > -1 ? "&" : "?") + "api_key=" + this.ApiKey;
    };
    /**
        * get the API Key that is used for the requests
        * @return    {string}    the current API Key
        */
    ClassicAPI.prototype.getCurrentApiKey = function () {
        return this.ApiKey;
    };
    /**
        * get the region where send send request
        * @return    {region_e}    the current region
        */
    ClassicAPI.prototype.getRegion = function () {
        return this.region;
    };
    /**
        * set the API Keys
        * @param    {string[]}    ApiKeys    the API Keys
        */
    ClassicAPI.prototype.setApikeys = function (ApiKeys) {
        this.ApiKeys = ApiKeys;
    };
    /**
        * set the region where you want to send requests
        * @param    {region_e}    region    the region
        */
    ClassicAPI.prototype.setRegion = function (region) {
        this.region = region;
    };
    // **************************** champion-v1.2 ************************************ //
    /**
        * get all champions of league of legends
        * @param     {RiotGamesAPI.Champion.ChampionListDto}    callback    data callback
        */
    ClassicAPI.prototype.getChampions = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_2 + "champion"), function (champions) {
                callback(champions["champions"]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get the champion for a given id
        * @param     {number}                               id          the champion id
        * @param     {RiotGamesAPI.Champion.ChampionDto}    callback    data callback
        */
    ClassicAPI.prototype.getChampionById = function (id, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_2 + "champion/" + id), function (champion) {
                callback(champion);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get the free to play champions
        * @param     {RiotGamesAPI.Champion.ChampionListDto}    callback    data callback
        */
    ClassicAPI.prototype.getFreeToPlayChampions = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_2 + "champion?freeToPlay=true"), function (champions) {
                callback(champions["champions"]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // **************************** championmastery ********************************** //
    /**
        * get Champion mastery of a player for a given champion ID
        * @param     {number}                                             summonerId    summoner ID
        * @param     {number}                                             championId    Champion ID
        * @param     {RiotGamesAPI.ChampionMastery.ChampionMasteryDto}    callback      data callback
        */
    ClassicAPI.prototype.getChampionMastery = function (summonerId, championId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/champion/" + championId), function (championMasteryDto) {
                callback(championMasteryDto);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get all champion masteries for a given summoner
        * @param     {number}                                               summonerId    Summoner ID
        * @param     {[RiotGamesAPI.ChampionMastery.ChampionMasteryDto]}    callback      data callback
        */
    ClassicAPI.prototype.getChampionMasteryBySummoner = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/champions"), function (championsMasteryDto) {
                callback(championsMasteryDto);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get the mastery score of a summoner
        * @param     {number}    summonerId    Summoner ID
        * @param     {number}    callback      Mastery Score
        */
    ClassicAPI.prototype.getChampionMasteryScore = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/score"), function (score) {
                callback(score);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get The 3 best champion masteries
        * @param     {[type]}                                               summonerId    Summoner ID
        * @param     {[RiotGamesAPI.ChampionMastery.ChampionMasteryDto]}    callback      data callback
        */
    ClassicAPI.prototype.getTopChampionMastery = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(CHAMPIONMASTERY_URL + "player/" + summonerId + "/topchampions"), function (championsMasteryDto) {
                callback(championsMasteryDto);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ***************************** current-game-v1.0 ******************************* //
    /**
        * get the current game infos for a given summoner ID
        * @param     {number}                                      summonerId    Summoner ID
        * @param     {RiotGamesAPI.CurrentGame.CurrentGameInfo}    callback      data callback
        */
    ClassicAPI.prototype.getCurrentGame = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_SPECTATOR_1_0 + summonerId), function (gameInfo) {
                callback(gameInfo);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ***************************** featured-games-v1.0 ***************************** //
    /**
        * get the featured games
        * @param     {RiotGamesAPI.FeaturedGames.FeaturedGames}    callback    data callback
        */
    ClassicAPI.prototype.getFeaturedGame = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_SPECTATOR_1_0 + "featured"), function (featuredGames) {
                callback(featuredGames);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ********************************** game-v1.3 ********************************** //
    /**
        * get the recents games for a given Summoner ID
        * @param     {number}                              summonerId    Summoner ID
        * @param     {RiotGamesAPI.Game.RecentGamesDto}    callback      data callback
        */
    ClassicAPI.prototype.getRecentGames = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_3 + "game/by-summoner/" + summonerId + "/recent"), function (RecentGames) {
                callback(RecentGames);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ********************************** league-v2.5********************************* //
    /**
        * Get League infos of a summoner
        * @param     {number}                             summonerId    Summoner ID
        * @param     {RiotGamesAPI.League.LeagueDto[]}    callback      data callback
        */
    ClassicAPI.prototype.getLeagueBySummonerId = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/by-summoner/" + summonerId), function (League) {
                callback(League[summonerId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get League infos of a summoner
        * @param     {number}                             summonerId    Summoner ID
        * @param     {RiotGamesAPI.League.LeagueDto[]}    callback      data callback
        */
    ClassicAPI.prototype.getLeagueBySummonerIdEntry = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/by-summoner/" + summonerId + "/entry"), function (League) {
                callback(League[summonerId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get league infos by team
        * @param     {string}                             teamId      Team ID
        * @param     {RiotGamesAPI.League.LeagueDto[]}    callback    data callback
        */
    ClassicAPI.prototype.getLeagueByTeamId = function (teamId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/by-team/" + teamId), function (League) {
                callback(League[teamId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get league infos by team
        * @param     {string}                             teamId      Team ID
        * @param     {RiotGamesAPI.League.LeagueDto[]}    callback    data callback
        */
    ClassicAPI.prototype.getLeagueByTeamIdEntry = function (teamId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/by-team/" + teamId + "/entry"), function (League) {
                callback(League[teamId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get Challengers in SOLO Queue
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    ClassicAPI.prototype.getChallengers_SOLO = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/challenger?type=RANKED_SOLO_5x5"), function (League) {
                callback(League);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get Challengers Teams in 3x3
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    ClassicAPI.prototype.getChallengers_3x3 = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/challenger?type=RANKED_TEAM_3x3"), function (League) {
                callback(League);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get Challengers Teams in 5x5
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    ClassicAPI.prototype.getChallengers_5x5 = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/challenger?type=RANKED_TEAM_5x5"), function (League) {
                callback(League);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get Masters in Solo Queue
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    ClassicAPI.prototype.getMasters_SOLO = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/master?type=RANKED_SOLO_5x5"), function (League) {
                callback(League);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get Master Teams in 3x3
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    ClassicAPI.prototype.getMasters_3x3 = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/master?type=RANKED_TEAM_3x3"), function (League) {
                callback(League);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get Master Teams in 5x5
        * @param     {RiotGamesAPI.League.LeagueDto}    callback    data callback
        */
    ClassicAPI.prototype.getMasters_5x5 = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_5 + "league/master?type=RANKED_TEAM_5x5"), function (League) {
                callback(League);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ***************************** lol-static-data-v1.2 **************************** //
    /**
        * get Champions (static data)
        * @param     {RiotGamesAPI.LolStaticData.ChampionListDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataChampions = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "champion"), function (championList) {
                callback(championList);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get data by champion ID
        * @param     {number}                                    championsId    Champion ID
        * @param     {RiotGamesAPI.LolStaticData.ChampionDto}    callback       data callback
        */
    ClassicAPI.prototype.staticDataChampionById = function (championsId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "champion/" + championsId), function (champion) {
                callback(champion);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get League of Legends Items
        * @param     {RiotGamesAPI.LolStaticData.ItemListDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataItems = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "item"), function (items) {
                callback(items);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * Get item infos by ID
        * @param     {number}                                itemId      item ID
        * @param     {RiotGamesAPI.LolStaticData.ItemDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataItemById = function (itemId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "item/" + itemId), function (item) {
                callback(item);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get league of legends languages
        * @param     {RiotGamesAPI.LolStaticData.LanguageStringsDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataLanguagesStrings = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "language-strings"), function (languages) {
                callback(languages);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get league of legends languages
        * @param     {string[]}    callback    data callback
        */
    ClassicAPI.prototype.staticDataLanguages = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "languages"), function (languages) {
                callback(languages);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get Map data
        * @param     {RiotGamesAPI.LolStaticData.MapDataDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataMap = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "map"), function (maps) {
                callback(maps);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get all masteries
        * @param     {RiotGamesAPI.LolStaticData.MasteryListDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataMastery = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "mastery"), function (masteryList) {
                callback(masteryList);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get data by mastery ID
        * @param     {number}                                   masteryId    Mastery ID
        * @param     {RiotGamesAPI.LolStaticData.MasteryDto}    callback     data callback
        */
    ClassicAPI.prototype.staticDataMasteryById = function (masteryId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "mastery/" + masteryId), function (mastery) {
                callback(mastery);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    ClassicAPI.prototype.staticDataRealm = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "realm"), function (realm) {
                callback(realm);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get all runes
        * @param     {RiotGamesAPI.LolStaticData.RuneListDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataRunes = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "rune"), function (runeList) {
                callback(runeList);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get rune by Rune ID
        * @param     {number}                                runeId      Rune ID
        * @param     {RiotGamesAPI.LolStaticData.RuneDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataRuneById = function (runeId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "rune/" + runeId), function (rune) {
                callback(rune);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get all summoner spells
        * @param     {RiotGamesAPI.LolStaticData.SummonerSpellListDto}    callback    data callback
        */
    ClassicAPI.prototype.staticDataSummonerSpells = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "summoner-spell"), function (summonerSpellList) {
                callback(summonerSpellList);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get summoner spell by summoner spell ID
        * @param     {number}                                         summonerSpellId    Summoner spell ID
        * @param     {RiotGamesAPI.LolStaticData.SummonerSpellDto}    callback           data callback
        */
    ClassicAPI.prototype.staticDataSummonSpellById = function (summonerSpellId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "summoner-spell/" + summonerSpellId), function (summonerSpell) {
                callback(summonerSpell);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get league of legends  versions
        * @param     {string[]}    callback    data callback
        */
    ClassicAPI.prototype.staticDataVersion = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(GLOBAL_URL_1_2 + "versions"), function (versions) {
                callback(versions);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ******************************** lol-status-v1.0 ****************************** //
    /**
        * get league of legends status
        * @param     {RiotGamesAPI.LolStatus.Shard[]}    callback    data callback
        */
    ClassicAPI.prototype.getSatus = function (callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON("http://status.leagueoflegends.com/shards", function (shards) {
                callback(shards);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get status for a given region
        * @param     {region_e}                        region      region
        * @param     {RiotGamesAPI.LolStatus.Shard}    callback    data callback
        */
    ClassicAPI.prototype.getSatusByRegion = function (region, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON("http://status.leagueoflegends.com/shards/" + region_e_TO_string(region), function (shard) {
                callback(shard);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ********************************* match-v2.2 ********************************** //
    /**
        * get match infos for a given match ID
        * @param     {number}                            matchId     Match ID
        * @param     {RiotGamesAPI.Match.MatchDetail}    callback    data callback
        */
    ClassicAPI.prototype.getMatch = function (matchId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_2 + "match/" + matchId), function (matchDetail) {
                callback(matchDetail);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get all matches for a given tournament code
        * @param     {string}      tournamentCode    Tournament Code
        * @param     {number[]}    callback          data callback
        */
    ClassicAPI.prototype.getMatchIdsByTournamentCode = function (tournamentCode, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_2 + "match/by-tournament/" + tournamentCode + "/ids"), function (matchIds) {
                callback(matchIds);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get match by ID in a tournament
        * @param     {number}                            matchId     Match ID
        * @param     {RiotGamesAPI.Match.MatchDetail}    callback    data callback
        */
    ClassicAPI.prototype.getMatchForTournament = function (matchId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_2 + "match/for-tournament/" + matchId), function (matchDetails) {
                callback(matchDetails);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ******************************** matchlist-v2.2 ******************************* //
    /**
        * get match list of a summoner
        * @param     {number}                              summonerId    Summoner ID
        * @param     {RiotGamesAPI.MatchList.MatchList}    callback      data callback
        */
    ClassicAPI.prototype.getMatchList = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_2 + "matchlist/by-summoner/" + summonerId), function (matchList) {
                callback(matchList);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ********************************** stats-v1.3 ********************************* //
    /**
        * get ranked stats of summoner
        * @param     {number}                               summonerId    Summoner ID
        * @param     {RiotGamesAPI.Stats.RankedStatsDto}    callback      data callback
        */
    ClassicAPI.prototype.getStatsRanked = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_3 + "stats/by-summoner/" + summonerId + "/ranked"), function (rankedStats) {
                callback(rankedStats);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get summary ranked stats of summoner
        * @param     {number}                                          summonerId    Summoner ID
        * @param     {RiotGamesAPI.Stats.PlayerStatsSummaryListDto}    callback      data callback
        */
    ClassicAPI.prototype.getStatsSummary = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_3 + "stats/by-summoner/" + summonerId + "/summary"), function (playerStatsSummaryList) {
                callback(playerStatsSummaryList);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ******************************** summoner-v1.4 ******************************** //
    /**
        * get summoner infos by Summoner Name
        * @param     {string}                               summonerName    Summoner Name
        * @param     {RiotGamesAPI.Summoner.SummonerDto}    callback        data callback
        */
    ClassicAPI.prototype.getSummonerByName = function (summonerName, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_4 + "summoner/by-name/" + summonerName), function (summoner) {
                callback(summoner[summonerName]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get summoner infos by summoner ID
        * @param     {number}                               summonerId    Summoner ID
        * @param     {RiotGamesAPI.Summoner.SummonerDto}    callback      data callback
        */
    ClassicAPI.prototype.getSummonerById = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_4 + "summoner/" + summonerId), function (summoner) {
                callback(summoner[summonerId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get masteries of a summoner
        * @param     {number}                                   summonerId    Summoner ID
        * @param     {RiotGamesAPI.Summoner.MasteryPagesDto}    callback      data callback
        */
    ClassicAPI.prototype.getSummonerMasteries = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_4 + "summoner/" + summonerId + "/masteries"), function (masteryPages) {
                callback(masteryPages[summonerId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get the Summoner Name of a summoner ID
        * @param     {number}    summonerId    Summoner ID
        * @param     {string}    callback      data callback
        */
    ClassicAPI.prototype.getSummonerName = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_4 + "summoner/" + summonerId + "/name"), function (summonerName) {
                callback(summonerName[summonerId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get the runes of a summoner
        * @param     {number}                                summonerId    Summoner ID
        * @param     {RiotGamesAPI.Summoner.RunePagesDto}    callback      data callback
        */
    ClassicAPI.prototype.getSummonerRunes = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_1_4 + "summoner/" + summonerId + "/runes"), function (runePages) {
                callback(runePages[summonerId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    // ******************************************************************************* //
    // ********************************* team-v2.4 *********************************** //
    /**
        * get teams of a summoner
        * @param     {number}                         summonerId    Summoner ID
        * @param     {RiotGamesAPI.Team.TeamDto[]}    callback      data callback
        */
    ClassicAPI.prototype.getTeamsBySummoner = function (summonerId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_4 + "team/by-summoner/" + summonerId), function (teamList) {
                callback(teamList[summonerId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    /**
        * get Team infos by Team ID
        * @param     {string}                       teamId      Team ID
        * @param     {RiotGamesAPI.Team.TeamDto}    callback    data callback
        */
    ClassicAPI.prototype.getTeamById = function (teamId, callback) {
        var _this = this;
        return new es6_promise_1.Promise(function (success, fail) {
            _this.getJSON(_this.parseURL(URL_2_4 + "team/" + teamId), function (team) {
                callback(team[teamId]);
            }).catch(function (err) {
                fail(err);
            });
        });
    };
    return ClassicAPI;
})();
exports.ClassicAPI = ClassicAPI;
