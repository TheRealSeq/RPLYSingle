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
  } //I love you puppy <3

  function createFuncsExternal(cf) {
    //cf is the createAnonFunction method. Fuck you puppy
    cf("recordPacket", function (d, t) {
      if (recordStartTime < 0) {
        recordStartTime = Date.now();
      }
      const pTime = Date.now() - recordStartTime;
      const crP = new Packet3(d, pTime, t);
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
        "&&!window.bReplaying)?(console.log('fuck you hh '+window.bReplaying),",
    );
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

    const aidsMatch = js.match(
      /([a-zA-Z$_,]+)=([a-zA-Z$_,]+)\.playType===vueApp\.playTypes\.createPrivate\?"createPrivate".+?(?=,)/,
    );
    console.log(aidsMatch);
    inj(aidsMatch[0], "console.log('google anal')");

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
      const location = Math.floor(packetIdx / this.chunkSize);
      if (location != this.loadedChunk) {
        this.releaseCurrent();
        this.loadChunk(location);
      }
    }

    releaseCurrent() {
      chunks[this.loadedChunk] = MemoryTool.compressToByteArray(
        this.packetStream,
      );
    }

    loadChunk(chunkIdx) {
      this.packetStream = MemoryTool.decompressToPacket(chunks[chunkIdx]);
    }
  }

  class MemoryTool {
    static decompressToPacket(arr) {
      return this.arrayToPackets(this.decompress(arr));
    }

    static decompress(arr) {
      pako.inflate(arr);
    }

    static arrayToPackets(arr) {
      const v = new DataView(data);
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
        const pack = new Packet3(this.fakeWSResponseStructure(arr), rTR, type);
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
      const buffer = new ArrayBuffer(this.calcSaveLength(packets));
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

  const rePlaytemp = new RePlay(); //TODO: make this not be here

  class RePlayer {
    constructor() {
      this.activeReplay = rePlaytemp;
      this.iReplayIndex = 0;
    }

    async resume() {
      bReplaying = true;
      while (
        this.activeReplay &&
        this.iReplayIndex < this.activeReplay.streamer.length &&
        bReplaying
      ) {
        const packet = //packets.shift(); //grab first packet);
          PacketStreamer.getPacket(iReplayPacketIdx++);
        const delayDur = packet.time - iReplayRelativeTime;
        //console.log("sleep for: " + delayDur);
        if (delayDur > 0) await sleep(delayDur);
        if (
          packet.data &&
          packet.peekByte() != C.syncMe &&
          packet.peekByte() != C.hitMe &&
          packet.peekByte() != C.socketReady &&
          !bannedCommCodes.includes(packet.peekByte())
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

        iReplayRelativeTime = packet.time; //set relative time location to match packet.
      }
      bReplaying = false;
    }
  }

  //https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //-----------------------------------------------------------------------------------------------------------------------------------------
  window.bReplaying = false;
  window.replayer = new RePlayer();
  //------------------------------------------------------------------------------------------------------------------------------------------
})();
