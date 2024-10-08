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
// @require      https://cdn.jsdelivr.net/npm/babylonjs@7.15.0/babylon.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pako/2.0.4/pako.min.js
// ==/UserScript==

(function () {
  let functionNames = []; // fuck you puppy
  let H = {}; //deobf names. Fuck you puppy.
  let C = {}; //commcodes
  let ss = {}; // fuck you puppy
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

        const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
        for (let name in H) {
          deobf = H[name];
          if (
            variableNameRegex.test(deobf) ||
            name === "onMessage" ||
            name === "onMessage2"
          ) {
            injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
          } else {
            const crashplease = "balls";
            crashplease = "balls2";
          }
        }
        console.log(injectionString);
        modifyJS(
          H.SCENE + ".render",
          `window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`,
        );
        
        //this one might be risky...
        const beforeNotPlayingInIFramMatch = js.match(/subtree:!0\}\);var [a-zA-Z$_,]+=\(\)=>\{/)
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
          //createGUI();
        }
      });
      createFuncsExternal(createAnonFunction);
    }
  } //I love you puppy <3

  function createFuncsExternal(cf) {
    //cf is the createAnonFunction method. Fuck you puppy
    cf("recordPacket", function (d, t) {
      //packets.push(crP);
      //PacketStreamer.addPacket(crP);
      rePlaytemp.recordPacket(d, t);
      return;
    });
    cf("logCommCodeExternal", function (cc) {
      console.log("c");
      console.log(cc);
      console.log(C[cc]);
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
        ":console.log('no ws! prob in replay so bye bye!!!')",
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

    getDataAsByteArray() {
      return new Uint8Array(this.data.data);
    }
  }

  class RePlay {
    constructor() {
      this.streamer = new PacketStreamer();
      this.recordStartTime = Date.now();
    }

    recordPacket(data, type) {
      this.streamer.addPacket(
        new Packet3(data, Date.now() - this.recordStartTime, type),
      );
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
      console.log(location);
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

  let rePlaytemp = new RePlay(); //TODO: make this not be here

  class RePlayer {
    constructor() {
      this.activeReplay = rePlaytemp;
      this.iReplayPacketIdx = 0;
      this.iReplayRelativeTime = 0;
    }

    async resume() {
      bReplaying = true;
      while (
        this.activeReplay &&
        this.iReplayPacketIdx < this.activeReplay.streamer.length &&
        bReplaying
      ) {
        const packet = //packets.shift(); //grab first packet);
          this.activeReplay.streamer.getPacket(this.iReplayPacketIdx++);
        //console.log(packet);
        const delayDur = packet.time - this.iReplayRelativeTime;
        //console.log("sleep for: " + delayDur);
        if (delayDur > 0) await sleep(delayDur);
        if (
          packet.data &&
          packet.peekByte() != C.syncMe &&
          packet.peekByte() != C.hitMe &&
          packet.peekByte() != C.socketReady //&&
          //!bannedCommCodes.includes(packet.peekByte())
        ) {
          //I want to kill myself :(
          //yes I know that that check up there ^^^^^^^^^^^^ doesn't account for any packet after the first one, but eh...
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
        }

        this.iReplayRelativeTime = packet.time; //set relative time location to match packet.
      }
      bReplaying = false;
    }
  }

  class FileManager {
    static SAVE_VERSION = 2;

    static createFileBytes(replay) {
      //ye imma give up on this for now
      //for some reason it just isn't writing like correct at all?
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
          const arrayBuffer = e.target.result;
          //console.log(arrayBuffer);
          rePlaytemp = FileManager.computeSaveFile(arrayBuffer);
          window.replayer.activeReplay = rePlaytemp;
          window.rply = rePlaytemp;
      };

      reader.readAsArrayBuffer(file);
  }

    static triggerFileUpload() {
      if(!this.bIsInit) this.initUploadElem();
      this.inputElem.click(); 
    }

    static computeSaveFile(data){
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
    }

  }

  //https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------
  window.bReplaying = false;
  window.replayer = new RePlayer();
  window.save = FileManager;
  window.rply = rePlaytemp;
  window.createGUI = createGUI;
  //------------------------------------------------------------------------------------------------------------------------------------------

  //GUI
  function createGUI(){
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
    homeScreen.appendChild(replayButton);
    }
    createReplayPopup();

  }

  function createReplayPopup(){
    const homeScreen = document.getElementById("home_screen");
    //create base popup container
    const popup = document.createElement("div");
    popup.className = "popup_window popup_lg centered roundme_md";
    {//close button
      const popupClose = document.createElement("button");
      popupClose.className = "popup_close clickme roundme_sm";
      //button image
      const buttonImage = document.createElement("i");
      buttonImage.className = "fas fa-times text_white fa-2x";
      popupClose.appendChild(buttonImage);
      popup.appendChild(popupClose);
    }{//title
      const titleText = document.createElement("h1");
      titleText.className = "roundme_sm text-center";
      titleText.textContent = "Replays";
      popup.appendChild(titleText);
    }
    //scroll bg
    const bg = document.createElement("div");
    bg.className = "media-tabs-content f_col";
    popup.appendChild(bg);
    //scroll
    const scroll = document.createElement("div");
    scroll.className = "news-container f_row v_scroll";
    bg.appendChild(scroll);
    //idk if this is neccesary
    const section = document.createElement("section");
    section.className = "media-panel news-panel media-tab-scroll";
    //const testElem = document.createElement("h1"); 
    //testElem.textContent = "test very wide string content WOWOOWOWSSSS SSSSSSS SSSSSSSSSSSSSSS SSSSS SSSSSSSSSSS SSSSS SSSSSSSSS SSS this wis wrapping";
    //section.appendChild(testElem);

    section.appendChild(createReplayChild());

    scroll.appendChild(section);

    homeScreen.appendChild(popup);
  }

  function createReplayChild(){
    const mainDiv = document.createElement("div");
    mainDiv.className= "player-challenges-container overflow-hidden"; //shamelessly stolen from challenges...

    //create header
    {
    const header = document.createElement("h4");
    header.textContent= "Replay";
    header.style.color="#0C576F"; //have to hardcode bc not in class. Too bad!
    header.style.lineHeight = "0em";//align to top
    header.style.margin = ".6em";//prob not the way to do this but eh
    header.style.fontSize = "1.3em"
    mainDiv.appendChild(header);

    const bottomText = document.createElement("p");
    bottomText.textContent = "BOfffffff______ffffffTTOM TexT!";
    bottomText.style.fontSize= ".7em;";
    mainDiv.appendChild(bottomText);
    }

    //TODO: ADD BUTTÓNS

    const testElem = document.createElement("h1"); 
    testElem.textContent = "test very wide string content WOWOOWOWSSSS SSSSSSS SSSSSSSSSSSSSSS SSSSS SSSSSSSSSSS SSSSS SSSSSSSSS SSS this wis wrapping";
    //mainDiv.appendChild(testElem);

    return mainDiv;
  }
})();
