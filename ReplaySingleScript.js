// ==UserScript==
// @name         SRPLYSingle
// @namespace    https://github.com/onlypuppy7/LibertyMutualShellShockers/
// @license      GPL-3.0
// @version      1.3.0
// @author       onlypuppy7
// @description  Replay shell games
// @match        https://shellshock.io/*
// @grant        none
// @run-at       document-start
// @icon         https://github.com/onlypuppy7/LibertyMutualShellShockers/blob/main/scripticon.jpg?raw=true
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.4/pako.min.js
// ==/UserScript==

(function () {
  let functionNames = []; // fuck you puppy
  let H = {}; //deobf names. Fuck you puppy.
  let C = {}; //commcodes
  let ss = {}; // fuck you puppy
  let deleteImage, downloadImage, piperImage, playImage; //GUI Stuff. Need to do here bc JS stupid. GRRRR. fuck you puppy
  let timeProgressText;
  {
    LM();
    function LM() {
      //so I can collapse this shit. Fuck you puppy!!!!!!1111
      let originalReplace = String.prototype.replace;
      let originalReplaceAll = String.prototype.replaceAll;

      String.prototype.originalReplace = function () {
        return originalReplace.apply(this, arguments);
      };

      String.prototype.originalReplaceAll = function () {
        return originalReplaceAll.apply(this, arguments);
      };

      const originalXHROpen = XMLHttpRequest.prototype.open;
      const originalXHRGetResponse = Object.getOwnPropertyDescriptor(
        XMLHttpRequest.prototype,
        "response",
      );
      let shellshockjs;
      XMLHttpRequest.prototype.open = function (...args) {
        const url = args[1];
        if (url && url.includes("js/shellshock.js")) {
          shellshockjs = this;
        }
        originalXHROpen.apply(this, args);
      };
      Object.defineProperty(XMLHttpRequest.prototype, "response", {
        get: function () {
          if (this === shellshockjs) {
            return inject(originalXHRGetResponse.get.call(this));
          }
          return originalXHRGetResponse.get.call(this);
        },
      });
      //VAR STUFF
      let F = [];

      const getScrambled = function () {
        return Array.from({ length: 10 }, () =>
          String.fromCharCode(97 + Math.floor(Math.random() * 26)),
        ).join("");
      };
      const createAnonFunction = function (name, func) {
        const funcName = getScrambled();
        window[funcName] = func;
        F[name] = window[funcName];
        functionNames[name] = funcName;
      };
      const findKeyWithProperty = function (obj, propertyToFind) {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            if (key === propertyToFind) {
              return [key];
            } else if (
              typeof obj[key] === "object" &&
              obj[key] !== null &&
              obj[key].hasOwnProperty(propertyToFind)
            ) {
              return key;
            }
          }
        }
        // Property not found
        return null;
      };
      const fetchTextContent = function (url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false); // Make the request synchronous
        xhr.send();
        if (xhr.status === 200) {
          return xhr.responseText;
        } else {
          console.error("Error fetching text content. Status:", xhr.status);
          return null;
        }
      };

      const inject = function (js) {
        let clientKeys;
        onlineClientKeys = fetchTextContent(
          "https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/statefarm_latest.json",
        ); //credit: me :D //shut up puppy
        let onlineConstants = fetchTextContent(
          "https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/constants_latest.json",
        ); //credit: me :D //shut up puppy

        if (onlineClientKeys == "value_undefined" || onlineClientKeys == null) {
          let userInput = prompt(
            "Valid keys could not be retrieved online. Enter keys if you have them.",
            "",
          );
          if (userInput !== null && userInput !== "") {
            alert(
              "Aight, let's try this. If it is invalid, it will just crash.",
            );
            clientKeys = JSON.parse(userInput);
          } else {
            alert("You did not enter anything, this is gonna crash lmao.");
          }
        } else {
          clientKeys = JSON.parse(onlineClientKeys);
        }

        let constants = JSON.parse(onlineConstants);
        console.log(constants.vars.CommCode);
        const formattedStr = constants.vars.CommCode.replace(
          /(\w+):/g,
          '"$1":',
        );
        C = JSON.parse(formattedStr);

        //FUCK YOU PUPPY
        var ig = JSON.parse(constants.vars.CommCodeStart);
        Object.keys(C).forEach((k) => {
          C[k] = ig++;
        });

        console.log(C);

        H = clientKeys.vars;

        let injectionString = "";

        const modifyJS = function (find, replace) {
          let oldJS = js;
          js = js.originalReplace(find, replace);
          if (oldJS !== js) {
            console.log(
              "%cReplacement successful! Injected code: " + replace,
              "color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;",
            );
          } else {
            console.log(
              "%cReplacement failed! Attempted to replace " +
                find +
                " with: " +
                replace,
              "color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;",
            );
          }
        };

        injPreGrab(js, modifyJS);
        //neeed to do here so changes are in the internal version too, unless I only modify that.......

        //console.log(js.match(gameSocketVar+"\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{.+?(?=\\},"+ gameSocketVar + "))"));
        const onMessageMatch = js.match(
          H.ws +
            "\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{.+?(?=," +
            H.ws +
            "))",
        );
        const onMessageMatch2 = js.match(
          H.ws +
            "\\.onmessage=(function\\([a-zA-Z$_,]+\\)\\{).+?(?=," +
            H.ws +
            ")",
        );

        //FUCK YOU PUPPY
        //I love you puppy

        const onMessage2Match = js.match(
          H.ws +
            "\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{switch.+?(?=requestGameOptions)requestGameOptions:([a-zA-Z$_,]+)\\(\\)\\}\\})",
        );

        console.log(onMessageMatch[1]);
        console.log(onMessage2Match[1]);

        let onMessage2Mod = onMessage2Match[1];

        let onMessage1Mod = onMessageMatch[1].originalReplaceAll(
          "syncMe",
          "replacedValueSyncMe",
        );
        onMessage1Mod = onMessage1Mod.originalReplaceAll(
          "hitMe",
          "replacedValueHitMe",
        );
        onMessage1Mod = onMessage1Mod.originalReplaceAll(
          "hitMeHardBoiled",
          "nononono",
        );
        //onMessage1Mod = onMessage1Mod.originalReplace()
        console.log("meid: " + H.meid);
        onMessage1Mod = onMessage1Mod.originalReplaceAll(H.meid, "-1");
        H.addPlayerID = js.match(/addPlayer:var ([a-zA-Z$_,]+)=/)[1];
        const endOfAddPlayerUnpackingMatch = js.match(
          /\.gameType=[a-zA-Z$_,]+\.unPackInt8U\(\),/,
        );
        console.log(endOfAddPlayerUnpackingMatch);
        //onMessage1Mod = onMessage1Mod.originalReplace(endOfAddPlayerUnpackingMatch[0], endOfAddPlayerUnpackingMatch[0] +"(("+H.meid+ "=="+H.addPlayerID+ ")?(console.log('me'),continue):console.log('notME')),")
        //onMessage1Mod = onMessage1Mod.originalReplace(endOfAddPlayerUnpackingMatch[0], endOfAddPlayerUnpackingMatch[0] +"console.log('fuck you')){}if("+H.meid+ "=="+H.addPlayerID+ "){console.log('me');continue;}if(");

        //onMessage1Mod = onMessage1Mod.originalReplace(onMessageMatch2[1], onMessageMatch2[1]+H.meid+"=-1;");//logCommCodeExternal
        // onMessage1Mod = onMessage1Mod.originalReplace("var t=Iy.unPackInt8U();", "var t=Iy.unPackInt8U();window." + functionNames.logCommCodeExternal + "(t);"); //fuck dynamic!!!
        //modifyJS("cmd=Iy.unPackInt8U(),", "cmd=Iy.unPackInt8U(),window." + functionNames.logCommCodeExternal + "(cmd),");

        const respawnValidityCheckMatch = js.match(
          /(\.unPackInt8U\(\);\()([a-zA-Z$_,]+=[a-zA-Z$_,]+\[([a-zA-Z$_,]+)\])(\)&&\([a-zA-Z$_,]+\.[a-zA-Z$_,]+\.removeFromPlay)/,
        );
        console.log(respawnValidityCheckMatch);
        //onMessage1Mod= onMessage1Mod.originalReplaceAll(respawnValidityCheckMatch[2], "("+respawnValidityCheckMatch[2]+"&&"+respawnValidityCheckMatch[3]+"!="+H.meid+")");
        //onMessage1Mod

        console.log(onMessage1Mod);

        H.onMessage = onMessage1Mod;
        H.onMessage2 = onMessage2Match[1];

        //this was causing issues
        delete H.BabylonVersion;

        const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
        for (let name in H) {
          const deobf = H[name];
          if (
            variableNameRegex.test(deobf) ||
            name === "onMessage" ||
            name === "onMessage2"
          ) {
            injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
          } else {
            console.log(name + ": "+deobf);
            console.log(variableNameRegex.test(deobf));
            const crashplease = "balls";
            crashplease = "balls2";
          }
        }
        console.log(injectionString);
       // modifyJS(
       //   H.SCENE + ".render",
       //   `window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`,
       // );

        //this one might be risky...
        //const beforeNotPlayingInIFramMatch = js.match(/subtree:!0\}\);var [a-zA-Z$_,]+=\(\)=>\{/)
        const beforeNotPlayingInIFramMatch = js.match(/console\.log\("loadResources\(\)"\),[a-zA-Z$_,]+\([a-zA-Z$_,]+\),function\([a-zA-Z$_,]+,[a-zA-Z$_,]+\)\{/); //heh no iframe anymore. eh still gonna keep title bc doesnt matter fuck you
        modifyJS(beforeNotPlayingInIFramMatch[0], beforeNotPlayingInIFramMatch[0] + `window["${functionNames.retrieveFunctions}"]({${injectionString}},true);`);
        // console.log(js);

        injExternal(js, modifyJS); //fuck you puppy

        console.log(H); //why here? Fuck you puppy
        return js;
      };
      didBootSetup = false;
      createAnonFunction("retrieveFunctions", function (vars) {
        ss = vars;
        if(!didBootSetup){
          didBootSetup = true;
          Object.defineProperty(extern, 'observingGame', {
            get: function() {
              return bReplaying;
            }
          });
          createGUI();
        }
      });
      createFuncsExternal(createAnonFunction);
    }
  } //I love you puppy <3

  const replays = []; //all loaded replays

  function createFuncsExternal(cf) {
    //cf is the createAnonFunction method. Fuck you puppy
    cf("recordPacket", function (d, t) {
      //packets.push(crP);
      //PacketStreamer.addPacket(crP);
      //rePlaytemp.recordPacket(d, t);
      ReCorder.handlePacketInput(d, t);
      return;
    });
    cf("logCommCodeExternal", function (cc) {
      console.log("c");
      console.log(cc);
      console.log(C[cc]);
    });
    cf("endReplay", function(){
      bReplaying = false;
      setReplayUIVis(false);
    });
  }

  function injPreGrab(js, inj) {
    //block myplayer respawn
    const beforeMeCheckRespawnMatch = js.match(
      /(\.respawn\([a-zA-Z$_,]+,[a-zA-Z$_,]+,[a-zA-Z$_,]+\),)([a-zA-Z$_,]+==([a-zA-Z$_,]+))\?\(/,
    );
    H.meid = beforeMeCheckRespawnMatch[3];
    console.log(beforeMeCheckRespawnMatch);
    inj(
      beforeMeCheckRespawnMatch[0],
      beforeMeCheckRespawnMatch[1] +
        "(" +
        beforeMeCheckRespawnMatch[2] +
        "&&!window.bReplaying)?(console.log('fuck you hah '+window.bReplaying),",
    );

    const aidsMatch = js.match(
      /([a-zA-Z$_,]+)=([a-zA-Z$_,]+)\.playType===vueApp\.playTypes\.createPrivate\?"createPrivate".+?(?=,)/,
    );
    console.log(aidsMatch);
    inj(aidsMatch[0], "console.log('google anal')");
  }

  function injExternal(js, inj) {



    const onMessage1Match = js.match(
      H.ws + "\\.onmessage=function\\(([a-zA-Z$_,]+)\\)\\{",
    );
    const onMessage2Match = js.match(
      "(" + H.ws + "\\.onmessage=function\\(([a-zA-Z$_,]+)\\)\\{)switch",
    );

    inj(
      onMessage1Match[0],
      onMessage1Match[0] +
        "window." +
        functionNames.recordPacket +
        "(" +
        onMessage1Match[1] +
        ", 1);",
    );
    inj(
      onMessage2Match[1],
      onMessage2Match[1] +
        "window." +
        functionNames.recordPacket +
        "(" +
        onMessage2Match[2] +
        ", 2);",
    );

    inj("e=window}", "let e2=window}");



    const sendMatch = js.match(
      /(new Uint8Array\(this\.arrayBuffer,0,this\.idx\);)([a-zA-Z$_,]+)/,
    );
    console.log(sendMatch);
    inj(sendMatch[1], sendMatch[1] + "if(" + sendMatch[2] + ")");

    //not trap the player in the replay
    const leaveMatch = js.match(H.ws + "\\.close\\([a-zA-Z$_,]+\\.mainMenu\\)");
    console.log(leaveMatch);
    inj(
      leaveMatch[0],
      H.ws +
        "?" +
        leaveMatch[0] +
        `:window["${functionNames.endReplay}"]()`,
    );

    //make respawn not set view to myplayer if in replay
    const setViewToMeIDAfterMePlayerRespawnMatch = js.match(
      "(this\\.id==" + H.meid + ")(&&\\([a-zA-Z$_,]+=" + H.meid + "\\))",
    );
    console.log(setViewToMeIDAfterMePlayerRespawnMatch);
    //inj(setViewToMeIDAfterMePlayerRespawnMatch[0], "("+setViewToMeIDAfterMePlayerRespawnMatch[1]+ "&&!window.bReplaying)" + setViewToMeIDAfterMePlayerRespawnMatch[2]);

    //update_
    const playerUpdate_Match = js.match(H._playerThing + ".prototype.move");

    //temp
    //, console.log('me'+"+H.meid+"),console.log(kb.id)
    //inj("if(Nb===AL.firstPerson)kb", "if(false)kb");
    //inj("iO.PS=WN.position.x,iO.oS=WN.position.y,iO.mS=WN.position.z,", "");

    //inj(";Tb&&rb.update(t)", ";(Tb||window.bReplaying)&&rb.update(t)");
    //inj("EL.prototype.update=function(e){", "EL.prototype.update=function(e){console.log('cam loc: ' + WN.position);");
    //inj("iO&&(Cb.update(t)", "(iO&&!window.bReplaying)&&(Cb.update(t)");
    const meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch =
      js.match(/\)\}([a-zA-Z$_,]+)&&\([a-zA-Z$_,]+\.update\([a-zA-Z$_,]+\)/);
    //console.log("BULLSHIT DUMBASS : "+meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch);
    H.me =
      meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch[1];
    inj(
      meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch[0],
      meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch[0].originalReplace(
        H.me,
        "(" + H.me + "&&!window.bReplaying)",
      ),
    );

    //inj("iO.PS=WN.position.x,iO.oS=WN.position.y,iO.mS=WN.position.z,", "");
    const makePlayerPositionEqualCameraPositionForSomeFUCKINGReasonMatch =
      js.match(
        H.me +
          "\\." +
          H.x +
          "=" +
          H.CAMERA +
          "\\.position\\.x," +
          H.me +
          "\\." +
          H.y +
          "=" +
          H.CAMERA +
          "\\.position\\.y," +
          H.me +
          "\\." +
          H.z +
          "=" +
          H.CAMERA +
          "\\.position\\.z,",
      );
    inj(
      makePlayerPositionEqualCameraPositionForSomeFUCKINGReasonMatch[0],
      "!window.bReplaying?(" +
        makePlayerPositionEqualCameraPositionForSomeFUCKINGReasonMatch[0] +
        "1==1):1==1,",
    );

    const respawnTimerBypassMatch = js.match(/(vueApp\.game\.respawnTime=Math\.min\([a-zA-Z$_,]+,[a-zA-Z$_,]+\),)([a-zA-Z$_,]+<=0&&[a-zA-Z$_,]+)/);
    //inj(respawnTimerBypassMatch[0], respawnTimerBypassMatch[1] + "window.bReplaying||("+ respawnTimerBypassMatch[2] + ")");

    //inj("enterSpectatorMode:function(){", "enterSpectatorMode:function(){window.bReplaying||");

    H.actorClass = js.match(/,([a-zA-Z$_,]+)\.prototype\.updateTeam=fun/)[1];
    console.log(H.actorClass);
    const actorUpdateCodeMatch = js.match("\\"+H.actorClass+"\\.prototype\\.update=function\\(e\\)\\{");
    console.log(actorUpdateCodeMatch);
    inj(actorUpdateCodeMatch[0], actorUpdateCodeMatch[0] + "if(window.bReplaying && window.replayer.bIsPaused)return;");

    //const updateGameUIForWhenMeIsValidMatch = js.match(/(\)\}[a-zA-Z$_,]+)(&&\([a-zA-Z$_,]+\.update\([a-zA-Z$_,]+\),[a-zA-Z$_,]+\.update)/);
    //inj(updateGameUIForWhenMeIsValidMatch[0], updateGameUIForWhenMeIsValidMatch[1] +"&&!window.bReplaying"+updateGameUIForWhenMeIsValidMatch[2]);
    //inj('document.getElementById("reticleContainer").className=""', 'document.getElementById("reticleContainer").className=true?"hideme":""');

    //make various UI elements invisible during replay
    const hm1Match = js.match(/(\.hideDot\(\),)([a-zA-Z$_,]+\.hitMarkers)/);
    const hm2Match = js.match(/(=new [a-zA-Z$_,]+\([a-zA-Z$_,]+\),)([a-zA-Z$_,]+\.hitMarkers)/);
    inj(hm1Match[0], hm1Match[1] + "(!window.bReplaying&&" +hm1Match[2] + ")");
    inj(hm2Match[0], hm2Match[1] + "(!window.bReplaying&&" +hm2Match[2] + ")");

    inj('.prototype.show=function(){if(document.getElementById("reticleContainer")', '.prototype.show=function(){if(window.bReplaying)return;if(document.getElementById("reticleContainer")');

    inj(".prototype.showDot=function(){", ".prototype.showDot=function(){if(window.bReplaying)return;");

    //myplayer update.
    const setControlkeysToMeMatch= js.match("(\\|\\|this\\.id!=" + H.meid + ")(\\|\\|)");
    inj(setControlkeysToMeMatch[0], setControlkeysToMeMatch[1] + "||window.bReplaying" + setControlkeysToMeMatch[2]);

    H.controlkeysPlayerVar = js.match("this\\.([a-zA-Z$_,]+)="+H.CONTROLKEYS)[1];

    const playerUpdateMatch = js.match(H._playerThing + "\\.prototype\\."+H._update+"=function\\([a-zA-Z$_,]+\\)\\{");
    //inj(playerUpdateMatch[0], playerUpdateMatch[0]+"if(this.id==" + H.meid+"&&!window.bReplaying){this." + H.controlkeysPlayerVar + "=" + H.CONTROLKEYS+";window.recordMyplayer(this);}");


  }
  //doing this here because where else?
  window.recordMyplayer = function(player){
    const buffer = new ArrayBuffer(this.calcByteArrayLength(packets));
    const v = new DataView(buffer);
    let offs = 0;
    v.setUint8(offs, player[H.controlkeysPlayerVar]);
    offs += 1;
    v.setFloat32(offs, player[H.yaw]);
    offs+=4;
    v.setFloat32(offs, player[H.pitch]);
    offs+=4;

  }

  class ReCorder{

    static handlePacketInput(d, t){
      if(Packet3.peekByteStatic(d) ===C.socketReady &&t<3){
        console.log("SRPLY: detected socketReady commcode, automatically creating new replay!");
        this.releaseReplay();
        this.currentReplay = new RePlay();
        //not gonna return bc socketReady is filtered in playback anyway, also maybe for later stuff it might be interesting to keep it..
      }
      this.currentReplay.recordPacket(d, t);
    }

    static releaseReplay(){
      if(this.currentReplay) replays.push(this.currentReplay);
    }
  }

  //class declarations
  class Packet3 {
    //data; //FUCK YOU PUPPY
    //time4; //FUCK YOU PUPPY 2
    //type; //FUCK YOU PUPPY 3

    constructor(data, time, type) {
      //time is relative time passed somce rec start
      //this.data = data; //(Uint8Array of the ws' input) JETZT: volles Websocketonmessageantwortobjekt, somit liegt die originale data in data.data (dann halt mit new Uint8Array aber jetzt nd)
      this.time = time; //time since record start in millis
      this.type = type; //what func was it recorded form? (1 for onMessage1, 2 for onMessage2)
      this.data = {
        data: data.data, //heh
      };
    }

    peekByte() {
      return new Uint8Array(this.data.data)[0];
    }

    static peekByteStatic(dat){
      return new Uint8Array(dat.data)[0];
    }

    getDataAsByteArray() {
      return new Uint8Array(this.data.data);
    }
  }

  class RePlay {
    constructor() {
      this.streamer = new PacketStreamer();
      this.recordStartTime = Date.now();
      this.saveVersion = FileManager.SAVE_VERSION;
      this.lastPacketCache = null;
    }

    recordPacket(data, type) {
      this.streamer.addPacket(
        new Packet3(data, Date.now() - this.recordStartTime, type),
      );
    }

    getLengthString(){
      const highestTime = this.getTimeLength();
      return getTimeString(highestTime);
    }

    getTimeLength(){
      if(!this.lastPacketCache) this.lastPacketCache = this.streamer.getPacket(this.streamer.length-1);
      return this.lastPacketCache.time;
    }
  }

  class PacketStreamer {
    constructor() {
      this.length = 0;
      this.chunkSize = 1000;
      this.chunks = [];
      this.loadedChunk = 0; //index
      this.packetStream = [];
    }

    addPacket(packet) {
      this.setPacket(this.length, packet);
      this.length++;
    }

    setPacket(idx, packet) {
      this.loadOnDemand(idx);
      this.packetStream[idx % this.chunkSize] = packet;
    }

    getPacket(idx) {
      this.loadOnDemand(idx);
      return this.packetStream[idx % this.chunkSize];
    }

    loadOnDemand(packetIdx) {
      const location = Math.floor(packetIdx / this.chunkSize) || 0;
      //console.log(location);
      if (location != this.loadedChunk) {
        this.releaseCurrent();
        this.loadChunk(location);
      }
    }

    releaseCurrent() {
      console.log("released " + this.loadedChunk);
      this.chunks[this.loadedChunk] = MemoryTool.compressToByteArray(
        this.packetStream,
      );
    }

    loadChunk(chunkIdx) {
      console.log("load " + chunkIdx);
      if (chunkIdx < this.chunks.length) {
        this.packetStream = MemoryTool.decompressToPacket(
          this.chunks[chunkIdx],
        );
      } else {
        console.log(
          "chunk idx empty. Clearing arr. (" +
            chunkIdx +
            "/" +
            this.chunks.length +
            ")",
        );
        this.packetStream = [];
      }
      this.loadedChunk = chunkIdx;
    }

    loadAll(){
      const packets = [];
      for(let i = 0; i<this.length; i++){
        packets[i] = this.getPacket(i);
      }
      return packets;
    }

    loadAllCompressed(){
      return MemoryTool.compressToByteArray(this.loadAll());
    }
  }

  class MemoryTool {
    static decompressToPacket(arr) {
      //console.log("arr: " + arr);
      const dec = this.decompress(arr);
      //console.log(dec);
      return this.arrayToPackets(dec.buffer);
    }

    static decompress(arr) {
      return pako.inflate(arr);
    }

    static arrayToPackets(arr) {
      const v = new DataView(arr);
      let offs = 0;
      const numPacks = v.getUint32(offs);
      offs += 4;
      const newPacks = [];
      for (let i = 0; i < numPacks; i++) {
        const type = v.getUint8(offs);
        offs++;
        const rTR = v.getUint32(offs);
        offs += 4;
        const dLen = v.getUint16(offs);
        offs += 2;
        const arr = new Uint8Array(dLen);
        for (let j = 0; j < dLen; j++) {
          arr[j] = v.getUint8(offs);
          offs++;
        }
        const pack = new Packet3({ data: arr }, rTR, type);
        newPacks.push(pack);
      }
      return newPacks;
    }

    static compressToByteArray(packets) {
      return this.compress(this.packetsToByteArray(packets));
    }

    /**
     * writes the given Packet3 array into an Uint8 array.
     * @argument packets : Packet3[] the array of packets
     */
    static packetsToByteArray(packets) {
      const buffer = new ArrayBuffer(this.calcByteArrayLength(packets));
      const v = new DataView(buffer);
      let offs = 0;
      /*
        num of packets: Uint32 (4 bytes)
          [packetarray elem]
            type: Uint8 (1 byte)
            rel time received: Uint32 (4 bytes)
            data length: Uint16 (2 bytes)
            [data]: Uint8s (x bytes)
        */
      v.setUint32(offs, packets.length);
      offs += 4;
      packets.forEach((pack) => {
        v.setUint8(offs, pack.type);
        offs++;
        v.setUint32(offs, pack.time);
        offs += 4;
        v.setUint16(offs, pack.getDataAsByteArray().length);
        offs += 2;
        pack.getDataAsByteArray().forEach((byTe) => {
          v.setUint8(offs, byTe);
          offs++;
        });
      });

      return new Uint8Array(buffer);
    }

    static calcByteArrayLength(packets) {
      //in bytes
      let num = 4; //num oacks
      for (let i = 0; i < packets.length; i++) {
        num++; //type
        num += 4; //time received
        num += 2; //data length
        num += packets[i].getDataAsByteArray().length; //data slots
      }

      return num;
    }

    static compress(arr) {
      return pako.deflate(arr);
    }
  }

  //let rePlaytemp = new RePlay(); //TODO: make this not be here

  class RePlayer {
    static insertReplay(replay) {
      this.activeReplay = replay;
      this.iReplayPacketIdx = 0;
      this.iReplayRelativeTime = 0;
      this.bIsPaused = true;
      this.bSkipDesired = false;
      this.iSkipAmount = 0;
    }

    static pause(){
      this.bIsPaused = true;
    }

    static skip(amount){
      console.log("skip desired for " + amount);
      this.iSkipAmount = amount;
      this.bSkipDesired = true;
    }

    static async resume() {
      this.bIsPaused = false;
      bReplaying = true;
      setReplayUIVis(true);
      while (
        this.activeReplay &&
        this.iReplayPacketIdx < this.activeReplay.streamer.length &&
        bReplaying &&
        !this.bIsPaused
      ) {
        const packet = //packets.shift(); //grab first packet);
          this.activeReplay.streamer.getPacket(this.iReplayPacketIdx++);
        //console.log(packet);
        const delayDur = packet.time - this.iReplayRelativeTime;
        //console.log("sleep for: " + delayDur);
        if(delayDur < 0){
          this.rePlayPacket(packet);
          continue;
        }
        if (delayDur > 0) await sleep(delayDur);

        this.rePlayPacket(packet);

        this.iReplayRelativeTime = packet.time; //set relative time location to match packet.
        //update ui progress
        setUIProgress(this.iReplayRelativeTime, this.activeReplay.getTimeLength(), this.iReplayPacketIdx, this.activeReplay.streamer.length);

        if(this.bSkipDesired){
          this.bSkipDesired = false;
          this.iReplayRelativeTime+=this.iSkipAmount;
          if(this.iSkipAmount<0) this.iReplayPacketIdx = this.findPacketIdxForTime(this.iReplayRelativeTime);
        }
      }
    }

    static rePlayPacket(packet){
      if (
        packet.data &&
        packet.peekByte() != C.syncMe &&
        packet.peekByte() != C.hitMe &&
        packet.peekByte() != C.socketReady //&&
        //!bannedCommCodes.includes(packet.peekByte())
      ) {
        //I want to kill myself :(
        //yes I know that that check up there ^^^^^^^^^^^^ doesn't account for any packet after the first one, but eh...
        try{
        switch (packet.type) {
          case 1:
            //console.log("on1");
            ss.onMessage(packet.data);
            break;
          case 2:
            //console.log("on2");
            ss.onMessage2(packet.data);
            break;
        }
      }catch(e){
          console.warn("playback errored. " + e);
          console.error(e);
          console.log("this is error should not be the end of the world. Report to creator if playback breaks!");
        }
      }
    }

    static findPacketIdxForTime(time){
      const streamer = this.activeReplay.streamer;
      let num = streamer.getPacket(this.iReplayPacketIdx).time;
      let idx = this.iReplayPacketIdx;
      if(num>time){
        while(num>time){
          num = streamer.getPacket(--idx).time;
        }
      } else{
        while(num<time){
          num = streamer.getPacket(++idx).time;
        }
      }
      return idx;
    }
  }

  class FileManager {
    static SAVE_VERSION = 2;

    static createFileBytes(replay) {
      replay.streamer.releaseCurrent();
      const bodyComp = replay.streamer.loadAllCompressed();

      const content2 = new ArrayBuffer(this.getHeadLength(replay) + bodyComp.length);
      const v = new DataView(content2);
      let offs = 0;
      v.setUint8(offs, this.SAVE_VERSION); //save ver
      //test
      //v.setUint8(offs, 55);
      offs++;
      v.setBigUint64(offs, BigInt(replay.recordStartTime)); //record start time
      offs += 8;
      //write body
      //there has to be a better way to do this but cba
      for (let i = 0; i < bodyComp.length; i++) {
        v.setUint8(offs+i, bodyComp[i]) //= bodyComp[i];
      }
      //console.log(content2);
      return content2;
    }

    static download(replay){
      this.downloadBlob(this.createFileBytes(replay), 'replay.SRPLY', 'application/octet-stream');
    }

    static downloadBlob(data, fileName, mimeType) {
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    //in bytes
    static getHeadLength(replay) {
      let val = 1; //version
      val += 8; //replayStartTime: biguint64
      return val;
    }

    static initUploadElem(){
      this.inputElem = document.createElement('input');
      this.inputElem.type = 'file';
      this.inputElem.style.display = 'block';
      this.inputElem.accept = ".srply,.bin";
      document.body.appendChild(this.inputElem);
      this.inputElem.addEventListener('change', this.handleFileUpload, false);
      this.bIsInit = true;
    }

    static handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) {
        console.error("no file");
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const load = createUploadLoadingScreen();
          const arrayBuffer = e.target.result;
          //console.log(arrayBuffer);
          replays.push(FileManager.computeSaveFile(arrayBuffer));
          //window.replayer.activeReplay = rePlaytemp;
          //window.rply = rePlaytemp;
          rebuildReplayPopupList();
          load.parnet.removeChild(load.pop);
      };

      reader.readAsArrayBuffer(file);
  }

    static triggerFileUpload() {
      if(!this.bIsInit) this.initUploadElem();
      this.inputElem.click();
    }

    static  computeSaveFile(data){
      try{
      //assuming data is a bytebuffer
      const v = new DataView(data);
      let offs = 0;
      while(v.getInt8(offs)==0){
        ++offs; //I hate this
      }
      const ver = v.getUint8(offs);
      offs++;
      if(ver!=this.SAVE_VERSION){
        console.warn("SRPLY: WARNING: the loaded save version number is different than the FM's ver. Stuff might not load correctly! (f: " + ver +", FM: " + this.SAVE_VERSION+")");
      }
      let parsedReplay = new RePlay();
      parsedReplay.saveVersion = ver;
      parsedReplay.recordStartTime = Number(v.getBigUint64(offs));
      offs+=8;
      //done with head. from now on, it will only be the packets.
      const packDatArray = new Uint8Array(v.byteLength-offs);
      for(let i = 0; i<packDatArray.length; i++){
        packDatArray[i] = v.getUint8(i+offs);
      }
      const allPacks = MemoryTool.decompressToPacket(packDatArray);
      for(let i = 0;i<allPacks.length; i++){
        parsedReplay.streamer.addPacket(allPacks[i]);
      }
      return parsedReplay;

    }catch(e){
      console.error("error in file parsing. " + e);
      console.error(e);
    }

  }

  }

  document.addEventListener("keydown", function (event) {
    //console.log(event.key);
    const key = event.key.toLowerCase();
    if(key=="p"){
      if(bReplaying && RePlayer){
        if(RePlayer.bIsPaused){
          RePlayer.resume();
        } else{
          RePlayer.pause();
        }
      }
    }
    if(key=="arrowright"){
      if(bReplaying && RePlayer){
        RePlayer.skip(5000);
      }
    }
    if(key=="arrowleft"){
      if(bReplaying && RePlayer){
        RePlayer.skip(-5000);
      }
    }
});

  //https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------
  window.bReplaying = false;
  window.replayer = RePlayer;
  window.save = FileManager;
  //window.rply = rePlaytemp;
  window.rplys = replays;
  window.createGUI = createGUI;
  window.record = ReCorder;
  window.setReplayUIVis = setReplayUIVis;
  //------------------------------------------------------------------------------------------------------------------------------------------

  //GUI
  function createGUI(){
    //preload images
    piperImage = document.createElement("img");
    piperImage.src = "https://github.com/TheRealSeq/Media/blob/main/IffermoonPiperBattle.png?raw=true";
    piperImage.style.width = "calc(calc(var(--ss-space-lg)* 3)*0.90)";
    piperImage.style.height = "calc(calc(var(--ss-space-lg)* 3)*0.90)";
    piperImage.style.top = "0";
    piperImage.style.left = "0";
    piperImage.style.position = "absolute";

    deleteImage = document.createElement("img");
    deleteImage.src = "https://github.com/TheRealSeq/Media/blob/main/SRPLY/delMiniIconII.png?raw=true";
    deleteImage.style.width = "calc(calc(var(--ss-space-lg)* 3)*0.90)";
    deleteImage.style.height = "calc(calc(var(--ss-space-lg)* 3)*0.90)";
    deleteImage.style.top = "0";
    deleteImage.style.left = "0";
    deleteImage.style.position = "absolute";

    downloadImage = document.createElement("img");
    downloadImage.src = "https://github.com/TheRealSeq/Media/blob/main/SRPLY/downMiniIcon.png?raw=true";
    downloadImage.style.width = "calc(calc(var(--ss-space-lg)* 3)*0.90)";
    downloadImage.style.height = "calc(calc(var(--ss-space-lg)* 3)*0.90)";
    downloadImage.style.top = "0";
    downloadImage.style.left = "0";
    downloadImage.style.position = "absolute";

    playImage = document.createElement("img");
    playImage.src = "https://github.com/TheRealSeq/Media/blob/main/SRPLY/playMiniIcon.png?raw=true";
    playImage.style.width = "calc(calc(var(--ss-space-lg)* 3)*0.90)";
    playImage.style.height = "calc(calc(var(--ss-space-lg)* 3)*0.90)";
    playImage.style.top = "0";
    playImage.style.left = "0";
    playImage.style.position = "absolute";

    //IK I should probably append to a child but eh doesn't matter, does it?
    const homeScreen = document.getElementById("home_screen");
    { //button
    const replayButton = document.createElement("button");
    replayButton.className = "ss_button btn_blue bevel_blue btn_sm pause-screen-btn-spectate";
    replayButton.title = "Replays";
     {
    //button eye image
    const buttonImage = document.createElement("i");
    buttonImage.className = "fas fa-eye fa-2x";
    replayButton.appendChild(buttonImage);
     }
    //position button
    const rplyButtonStyle = {
      position: "absolute",
      bottom: "var(--ss-space-lg);",
      right: "var(--ss-space-lg);",
      'box-shadow': "var(--ss-btn-dark-shadow), var(--ss-btn-dark-bevel) #086e8d, var(--ss-btn-light-bevel) #00ade6 !important"
    }
    replayButton.style = rplyButtonStyle;

    replayButton.onclick = createReplayPopup;

    homeScreen.appendChild(replayButton);
    }
    createIngameUI();
  }

  function createReplayPopup(){
    if(document.getElementById("MOD_REPLAY_LISTPOPUP")) return;
    ReCorder.releaseReplay();
    ReCorder.currentReplay = false;

    const homeScreen = document.getElementById("home_screen");
    //create base popup container
    const popup = document.createElement("div");
    popup.id= "MOD_REPLAY_LISTPOPUP";
    popup.className = "popup_window popup_lg centered roundme_md";
    {//close button
      const popupClose = document.createElement("button");
      popupClose.className = "popup_close clickme roundme_sm";
      //button image
      const buttonImage = document.createElement("i");
      buttonImage.className = "fas fa-times text_white fa-2x";
      popupClose.appendChild(buttonImage);

      popupClose.onclick = function(){
        //onclick func
        homeScreen.removeChild(popup);
      }

      popup.appendChild(popupClose);
    }{//title
      const titleText = document.createElement("h1");
      titleText.className = "roundme_sm text-center";
      titleText.textContent = "Replays";
      popup.appendChild(titleText);
    }
    if(replays.length>0){
    //scroll bg
    const bg = document.createElement("div");
    bg.className = "media-tabs-content f_col";
    popup.appendChild(bg);
    //scroll
    const scroll = document.createElement("div");
    scroll.className = "f_row v_scroll border-blue5 roundme_sm common-box-shadow";
    scroll.id = "MOD_REPLAY_LISTSCROLL";
    bg.appendChild(scroll);

    scroll.appendChild(createListSection());

    const warnElem = document.createElement("p");
    warnElem.textContent = "WARNING! Every replay is lost after page exit, unless downloaded as a file!";
    popup.appendChild(warnElem);
    } else{
      const warnElem = document.createElement("p");
      warnElem.textContent = "no replays avialable! Join a game to record it, or upload your replay file via the button in the menu!";
      warnElem.id = "MOD_REPLAY_WARNELEM_NOREPLAY";
      popup.appendChild(warnElem);
    }

    //upload button
    const uploadButton = document.createElement("button");
    uploadButton.textContent = "upload replay...";
    uploadButton.title = "upload replay";
    uploadButton.onclick = function(){
      FileManager.triggerFileUpload();
    };
    popup.appendChild(uploadButton);

    homeScreen.appendChild(popup);

  }

  function createListSection(){
    //idk if this is neccesary
    const section = document.createElement("section");
    section.className = "media-panel news-panel";
    section.id = "MOD_REPLAY_LISTSECTION";
    //const testElem = document.createElement("h1");
    //testElem.textContent = "test very wide string content WOWOOWOWSSSS SSSSSSS SSSSSSSSSSSSSSS SSSSS SSSSSSSSSSS SSSSS SSSSSSSSS SSS this wis wrapping";
    //section.appendChild(testElem);

    //section.appendChild(createReplayChild());
    //section.appendChild(createReplayChild());
    replays.forEach(r => {
      section.appendChild(createReplayChild(r));
    });

    return section;
  }

  /**
   * will do nothing if no popup, but also not error :D
   */
  function rebuildReplayPopupList(){
    const scroll = document.getElementById("MOD_REPLAY_LISTSCROLL");
    const sec = document.getElementById("MOD_REPLAY_LISTSECTION");
    const warn = document.getElementById("MOD_REPLAY_WARNELEM_NOREPLAY");
    if(warn){closeReplayPop(); createReplayPopup()} //this is kinda a hack (?) but rewriting that entire part would be worse!
    if(!scroll) return;
    if(sec) scroll.removeChild(sec);
    scroll.appendChild(createListSection());
  }

  function closeReplayPop(){
    const home = document.getElementById("home_screen");
    const pop =document.getElementById("MOD_REPLAY_LISTPOPUP");
    home.removeChild(pop);
  }

  function createReplayChild(replay){
    const mainDiv = document.createElement("div");
    mainDiv.className= "player-challenges-container overflow-hidden";

    mainDiv.style["border-bottom"]= "var(--ss-common-border-width) solid var(--ss-blue3)";

    const splitDiv = document.createElement("div");
    splitDiv.className = "display-grid grid-auto-flow-column justify-content-around gap-sm";

    const textDiv = document.createElement("div");

    //create header
    {
    const header = document.createElement("h4");
    header.textContent= "Unknown replay";
    header.style.color="#0C576F"; //have to hardcode bc not in class. Too bad!
    header.style.lineHeight = "0em";//align to top
    header.style.margin = ".6em";//prob not the way to do this but eh
    header.style.fontSize = "1.3em"
    mainDiv.appendChild(header);

      const metadataString = replay.streamer.length + " packets"
      + " | " + timeConverter(replay.recordStartTime)
      + " | " + replay.getLengthString()
      + " | " + "sv " + replay.saveVersion;

      const l1Text ="duration: "+replay.getLengthString() +", " + truncateNum(replay.streamer.length) +" packets";
      const l2Text ="recorded at: "+timeConverter(replay.recordStartTime) +", sv " + replay.saveVersion;



    const bottomText = document.createElement("p");
    bottomText.textContent = metadataString;
    bottomText.style.fontSize= ".7em;";
    //textDiv.appendChild(bottomText);
    const l1 = document.createElement("p");
    l1.textContent = l1Text;
    l1.style.margin = "10px"
    textDiv.appendChild(l1);

    const l2 = document.createElement("p");
    l2.textContent = l2Text;
    l2.style.margin = "10px"
    textDiv.appendChild(l2);
    }

    //TODO: ADD BUTTÓNS

    //delete
    const deleteButton = document.createElement("button");
    deleteButton.className = "ss_button btn_red bevel_red box_relative pause-screen-ui text-shadow-none text_blue1";
    deleteButton.style.top = "50%";
    deleteButton.style.transform = "translateY(-50%)";
    deleteButton.style.height = "calc(var(--ss-space-lg)* 3)";
    deleteButton.style.width = "calc(var(--ss-space-lg)* 3)";
    deleteButton.title = "delete replay";
    deleteButton.onclick = function(){
      replays.splice(replays.indexOf(replay), 1);
      rebuildReplayPopupList();
    };
    deleteButton.appendChild(deleteImage.cloneNode());

    //download
    const downloadButton = document.createElement("button");
    downloadButton.className = "ss_button btn_blue bevel_blue box_relative pause-screen-ui text-shadow-none text_blue1";
    downloadButton.style.top = "50%";
    downloadButton.style.transform = "translateY(-50%)";
    downloadButton.style.height = "calc(var(--ss-space-lg)* 3)";
    downloadButton.style.width = "calc(var(--ss-space-lg)* 3)";
    downloadButton.title = "download replay";
    downloadButton.onclick = function(){
      FileManager.download(replay);
    };
    downloadButton.appendChild(downloadImage.cloneNode());

     //download
    const playButton = document.createElement("button");
    playButton.className = "ss_button btn_green bevel_green box_relative pause-screen-ui text-shadow-none text_blue1";
    playButton.style.top = "50%";
    playButton.style.transform = "translateY(-50%)";
    playButton.style.height = "calc(var(--ss-space-lg)* 3)";
    playButton.style.width = "calc(var(--ss-space-lg)* 3)";
    playButton.title = "play replay";
    playButton.onclick = function(){
      RePlayer.insertReplay(replay);
      RePlayer.resume();
      closeReplayPop();
    };
    if(Math.random()<0.05){playButton.appendChild(piperImage.cloneNode()); }else{ playButton.appendChild(playImage.cloneNode());}


    const testElem = document.createElement("h1");
    testElem.textContent = "test very wide string content WOWOOWOWSSSS SSSSSSS SSSSSSSSSSSSSSS SSSSS SSSSSSSSSSS SSSSS SSSSSSSSS SSS this wis wrapping";
    //mainDiv.appendChild(testElem);

    splitDiv.appendChild(playButton);
    splitDiv.appendChild(textDiv);

    splitDiv.appendChild(downloadButton);
    splitDiv.appendChild(deleteButton);


    mainDiv.appendChild(splitDiv);

    return mainDiv;
  }

  function createUploadLoadingScreen(){
    const mainDiv = document.createElement("div");
    mainDiv.id ="MOD_REPLAY_UPLOAD_LOADSCREEN";
    mainDiv.className = "popup_window popup_lg centered roundme_md";
    const header = document.createElement("h1");
    header.textContent = "uploading...";
    const l1 = document.createElement("p");
    l1.textContent = "parsing replay";
    const l2 = document.createElement("p");
    l2.textContent = "please wait.";
    mainDiv.appendChild(header);
    mainDiv.appendChild(l1);
    mainDiv.appendChild(l2);
    const app = document.getElementById("app");
    app.appendChild(mainDiv);
    return {pop: mainDiv, parnet: app};
  }

  function createIngameUI(){
    const app = //document.getElementById("account_panel");
    document.getElementsByClassName("paused-game-ui z-index-1 centered_x fullwidth")[0];
    const rePlayIngameContainer = document.createElement("div");
    {//progress
      const progressContainer = document.createElement("div");
      progressContainer.style.position = "flex";
      progressContainer.style.bottom = "var(--ss-space-lg)";
      progressContainer.className = "centered_x";
      progressContainer.id = "MOD_REPLAY_UI_CONTAINER";
      progressContainer.style.display = "none";
      //const progressText = document.createTextNode("xx/yy");
      //const progressText = document.createElement("h5");
      const timeContainer = document.createElement("span");
      timeContainer.style.color = "#ffffff";
      //timeContainer.className = "centered_x";
      timeContainer.style.textAlign = "center";
      timeProgressText = document.createTextNode("xx/yy");
      timeProgressText.id = "MOD_REPLAY_PROGRESSTEXT";
      const bar = document.createElement("progress");
      bar.className = "centered_x";
      bar.id = "MOD_REPLAY_PROGRESS";
      bar.style.bottom = "var(--ss-space-lg)";

      timeContainer.appendChild(timeProgressText);
      progressContainer.appendChild(timeContainer);
      progressContainer.appendChild(bar);
      rePlayIngameContainer.appendChild(progressContainer);
    }


    app.appendChild(rePlayIngameContainer);
  }

  function setUIProgress(current, max, pIdx, maxPIdx){
    const progress = document.getElementById("MOD_REPLAY_PROGRESS");
    //const text = document.getElementById("MOD_REPLAY_PROGRESSTEXT");
    progress.max = max;
    progress.value = current;
    //text.nodeValue = current + "/" + max;
    //text.textContent = current + "/" + max;
    let newString = getTimeString(current) + "/" + getTimeString(max);
    if(pIdx && maxPIdx) newString+= " (packets: " + truncateNum(pIdx) + "/" + truncateNum(maxPIdx) + ")";
    timeProgressText.nodeValue =// getTimeString(current) + "/" + getTimeString(max)// + " (" + ;
    newString;
  }

  function setReplayUIVis(visible){
    const container = document.getElementById("MOD_REPLAY_UI_CONTAINER");
    container.style.display = visible ? "block" : "none";
    //assuming we can hide the game UI elements here too
  }


//https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript (modified)
function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

//this returns a string!
function truncateNum(num){
  if(num>=1000&&num<1000000)return (Math.round(num*0.01)*0.1).toFixed(1)+"k";
  if(num>=1000000)return (Math.round(num*0.00001)*0.1).toFixed(1);+"m";
  return num;
}

function getTimeString(millis){
  let minutes = millis/1000/60;
  minutes = Math.floor(minutes);
  let t =millis-(minutes*1000*60);
  let seconds = t/1000;
  seconds = Math.floor(seconds);
  const msFraction = millis%1000;
  //if(minutes<1) return seconds+"s";
  return `${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}.${String(msFraction).padStart(3,'0')}`;
}
})();
