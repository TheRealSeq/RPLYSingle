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
    let functionNames=[]; // fuck you puppy
    let H={}; //deobf names. Fuck you puppy.
    let C = {}; //commcodes
    let ss = {}; // fuck you puppy
    LM();
    function LM(){ //so I can collapse this shit. Fuck you puppy!!!!!!1111
    let originalReplace = String.prototype.replace;
    let originalReplaceAll = String.prototype.replaceAll;

    String.prototype.originalReplace = function() {
      return originalReplace.apply(this, arguments);
    };

    String.prototype.originalReplaceAll = function() {
      return originalReplaceAll.apply(this, arguments);
    };


    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
    let shellshockjs
    XMLHttpRequest.prototype.open = function(...args) {
      const url = args[1];
      if (url && url.includes("js/shellshock.js")) {
        shellshockjs = this;
      };
      originalXHROpen.apply(this, args);
    };
    Object.defineProperty(XMLHttpRequest.prototype, 'response', {
      get: function() {
        if (this===shellshockjs) {
          return inject(originalXHRGetResponse.get.call(this));
        };
        return originalXHRGetResponse.get.call(this);
      }
    });
    //VAR STUFF
    let F=[];

    
    const getScrambled=function(){return Array.from({length: 10}, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('')}
    const createAnonFunction=function(name,func){
      const funcName=getScrambled();
      window[funcName]=func;
      F[name]=window[funcName];
      functionNames[name]=funcName
    };
    const findKeyWithProperty = function(obj, propertyToFind) {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key === propertyToFind) {
            return [key];
          } else if (
            typeof obj[key] === 'object' &&
                  obj[key] !== null &&
                  obj[key].hasOwnProperty(propertyToFind)
            ) {
              return key;
            };
          };
        };
        // Property not found
        return null;
    };
    const fetchTextContent = function(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false); // Make the request synchronous
      xhr.send();
      if (xhr.status === 200) {
        return xhr.responseText;
      } else {
        console.error("Error fetching text content. Status:", xhr.status);
        return null;
      };
    };

    const inject = function(js) {

      let clientKeys;
      onlineClientKeys = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/statefarm_latest.json"); //credit: me :D //shut up puppy
      let onlineConstants = fetchTextContent("https://raw.githubusercontent.com/StateFarmNetwork/client-keys/main/constants_latest.json"); //credit: me :D //shut up puppy


      if (onlineClientKeys == "value_undefined" || onlineClientKeys == null) {
        let userInput = prompt('Valid keys could not be retrieved online. Enter keys if you have them.', '');
        if (userInput !== null && userInput !== '') {
          alert('Aight, let\'s try this. If it is invalid, it will just crash.');
          clientKeys = JSON.parse(userInput);
        } else {
          alert('You did not enter anything, this is gonna crash lmao.');
        };
      } else {
        clientKeys = JSON.parse(onlineClientKeys);
      };

      let constants = JSON.parse(onlineConstants);
      console.log(constants.vars.CommCode);
      const formattedStr = constants.vars.CommCode.replace(/(\w+):/g, '"$1":');
      C = JSON.parse(formattedStr);

      //FUCK YOU PUPPY
      var ig = JSON.parse(constants.vars.CommCodeStart);
      Object.keys(C).forEach((k) => {
        C[k] = ig++;
      });

      console.log(C);

      H = clientKeys.vars;

      let injectionString="";
        
      const modifyJS = function(find,replace) {
        let oldJS = js;
        js = js.originalReplace(find,replace);
        if (oldJS !== js) {
          console.log("%cReplacement successful! Injected code: "+replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
        } else {
          console.log("%cReplacement failed! Attempted to replace "+find+" with: "+replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
        };
      };

      injPreGrab(js, modifyJS);
      //neeed to do here so changes are in the internal version too, unless I only modify that.......


      //console.log(js.match(gameSocketVar+"\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{.+?(?=\\},"+ gameSocketVar + "))"));
      const onMessageMatch = js.match(H.ws+"\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{.+?(?=,"+ H.ws + "))");
      const onMessageMatch2 = js.match(H.ws+"\\.onmessage=(function\\([a-zA-Z$_,]+\\)\\{).+?(?=,"+ H.ws + ")");

      //FUCK YOU PUPPY
      //I love you puppy

      const onMessage2Match = js.match(H.ws+"\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{switch.+?(?=requestGameOptions)requestGameOptions:([a-zA-Z$_,]+)\\(\\)\\}\\})");


      console.log(onMessageMatch[1]);
      console.log(onMessage2Match[1]);

      let onMessage2Mod  = onMessage2Match[1];

      let onMessage1Mod = onMessageMatch[1].originalReplaceAll("syncMe","replacedValueSyncMe");
      onMessage1Mod = onMessage1Mod.originalReplaceAll("hitMe","replacedValueHitMe");
      onMessage1Mod = onMessage1Mod.originalReplaceAll("hitMeHardBoiled","nononono");
      //onMessage1Mod = onMessage1Mod.originalReplace()
      console.log("meid: " + H.meid);
      onMessage1Mod = onMessage1Mod.originalReplaceAll(H.meid, "-1");
      H.addPlayerID = js.match(/addPlayer:var ([a-zA-Z$_,]+)=/)[1];
      const endOfAddPlayerUnpackingMatch = js.match(/\.gameType=[a-zA-Z$_,]+\.unPackInt8U\(\),/);
      console.log(endOfAddPlayerUnpackingMatch);
      //onMessage1Mod = onMessage1Mod.originalReplace(endOfAddPlayerUnpackingMatch[0], endOfAddPlayerUnpackingMatch[0] +"(("+H.meid+ "=="+H.addPlayerID+ ")?(console.log('me'),continue):console.log('notME')),")
      //onMessage1Mod = onMessage1Mod.originalReplace(endOfAddPlayerUnpackingMatch[0], endOfAddPlayerUnpackingMatch[0] +"console.log('fuck you')){}if("+H.meid+ "=="+H.addPlayerID+ "){console.log('me');continue;}if(");

      //onMessage1Mod = onMessage1Mod.originalReplace(onMessageMatch2[1], onMessageMatch2[1]+H.meid+"=-1;");//logCommCodeExternal
     // onMessage1Mod = onMessage1Mod.originalReplace("var t=Iy.unPackInt8U();", "var t=Iy.unPackInt8U();window." + functionNames.logCommCodeExternal + "(t);"); //fuck dynamic!!!
      //modifyJS("cmd=Iy.unPackInt8U(),", "cmd=Iy.unPackInt8U(),window." + functionNames.logCommCodeExternal + "(cmd),");

      

      const respawnValidityCheckMatch = js.match(/(\.unPackInt8U\(\);\()([a-zA-Z$_,]+=[a-zA-Z$_,]+\[([a-zA-Z$_,]+)\])(\)&&\([a-zA-Z$_,]+\.[a-zA-Z$_,]+\.removeFromPlay)/);
      console.log(respawnValidityCheckMatch);
      //onMessage1Mod= onMessage1Mod.originalReplaceAll(respawnValidityCheckMatch[2], "("+respawnValidityCheckMatch[2]+"&&"+respawnValidityCheckMatch[3]+"!="+H.meid+")");
      //onMessage1Mod

      console.log(onMessage1Mod);



      H.onMessage = onMessage1Mod;
      H.onMessage2 = onMessage2Match[1];


        const variableNameRegex = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;
        for (let name in H) {
            deobf = H[name];
            if (variableNameRegex.test(deobf) || name==="onMessage" || name==="onMessage2") {
                injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
            } else {
                const crashplease = "balls";
                crashplease = "balls2";
            };
        };
        console.log(injectionString);
        modifyJS(H.SCENE+'.render',`window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`);
        // console.log(js);

        injExternal(js, modifyJS);//fuck you puppy

        console.log(H); //why here? Fuck you puppy
        return js;
    };
    createAnonFunction("retrieveFunctions",function(vars) { ss=vars;});
    createFuncsExternal(createAnonFunction);
    }; //I love you puppy <3 

    let packets = []; // array of recorded packets. Fuck you puppy
    let recordStartTime = -1;

    function createFuncsExternal(cf){ //cf is the createAnonFunction method. Fuck you puppy
      cf("recordPacket", function(d, t){
        if(recordStartTime<0){
          recordStartTime = Date.now();
        }
        const data = new Uint8Array(d);
        const pTime = Date.now()-recordStartTime;
        const crP = new Packet3(d, pTime, t);
        //packets.push(crP);
        PacketStreamer.addPacket(crP);
        return;
        if(packets.length>=1000){
          console.log("releasing packets to chunk compressor...");
          MemoryManager.releaseToChunk();
        }
      });
      cf("logCommCodeExternal", function(cc){
        console.log("c");
        console.log(cc);
        console.log(C[cc]);
      });
    }

    function injPreGrab(js, inj){
      //block myplayer respawn
      const beforeMeCheckRespawnMatch = js.match(/(\.respawn\([a-zA-Z$_,]+,[a-zA-Z$_,]+,[a-zA-Z$_,]+\),)([a-zA-Z$_,]+==([a-zA-Z$_,]+))\?\(/);
      H.meid = beforeMeCheckRespawnMatch[3];
      console.log(beforeMeCheckRespawnMatch);
      inj(beforeMeCheckRespawnMatch[0], beforeMeCheckRespawnMatch[1] + "(" + beforeMeCheckRespawnMatch[2] + "&&!window.bReplaying)?(console.log('fuck you hh '+window.bReplaying),");
    }


    function injExternal(js, inj){
      const onMessage1Match = js.match(H.ws+"\\.onmessage=function\\(([a-zA-Z$_,]+)\\)\\{");
      const onMessage2Match = js.match("("+H.ws+"\\.onmessage=function\\(([a-zA-Z$_,]+)\\)\\{)switch");
    
      inj(onMessage1Match[0], onMessage1Match[0] + "window."+functionNames.recordPacket+"("+onMessage1Match[1]+", 1);");
      inj(onMessage2Match[1], onMessage2Match[1] + "window."+functionNames.recordPacket+"("+onMessage2Match[2]+", 2);");

      const aidsMatch = js.match(/([a-zA-Z$_,]+)=([a-zA-Z$_,]+)\.playType===vueApp\.playTypes\.createPrivate\?"createPrivate".+?(?=,)/);
      console.log(aidsMatch);
      inj(aidsMatch[0], "console.log('google anal')");

      const sendMatch = js.match(/(new Uint8Array\(this\.arrayBuffer,0,this\.idx\);)([a-zA-Z$_,]+)/);
      console.log(sendMatch);
      inj(sendMatch[1], sendMatch[1]+"if(" +sendMatch[2]+")");

      //not trap the player in the replay
      const leaveMatch = js.match(H.ws+"\\.close\\([a-zA-Z$_,]+\\.mainMenu\\)");
      console.log(leaveMatch);
      inj(leaveMatch[0],  H.ws + "?" + leaveMatch[0] + ":console.log('no ws! prob in replay so bye bye!!!')");

      //make respawn not set view to myplayer if in replay
      const setViewToMeIDAfterMePlayerRespawnMatch = js.match("(this\\.id==" + H.meid + ")(&&\\([a-zA-Z$_,]+="+H.meid+"\\))");
      console.log(setViewToMeIDAfterMePlayerRespawnMatch);
      //inj(setViewToMeIDAfterMePlayerRespawnMatch[0], "("+setViewToMeIDAfterMePlayerRespawnMatch[1]+ "&&!window.bReplaying)" + setViewToMeIDAfterMePlayerRespawnMatch[2]);

      //update_ 
      const playerUpdate_Match = js.match(H._playerThing+ ".prototype.move");

      //temp
      //, console.log('me'+"+H.meid+"),console.log(kb.id)
      //inj("if(Nb===AL.firstPerson)kb", "if(false)kb");
      //inj("iO.PS=WN.position.x,iO.oS=WN.position.y,iO.mS=WN.position.z,", "");

      //inj(";Tb&&rb.update(t)", ";(Tb||window.bReplaying)&&rb.update(t)");
      //inj("EL.prototype.update=function(e){", "EL.prototype.update=function(e){console.log('cam loc: ' + WN.position);");
      //inj("iO&&(Cb.update(t)", "(iO&&!window.bReplaying)&&(Cb.update(t)");
      const meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTF = js.match(/\)\}([a-zA-Z$_,]+)&&\([a-zA-Z$_,]+\.update\([a-zA-Z$_,]+\)/);
      //console.log("BULLSHIT DUMBASS : "+meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTF);
      H.me = meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTF[1];
      inj(meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTF[0], meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTF[0].originalReplace(H.me, "("+H.me+"&&!window.bReplaying)"));
    }

    //class declarations
    class Packet3{
      //data; //FUCK YOU PUPPY
      //time4; //FUCK YOU PUPPY 2
      //type; //FUCK YOU PUPPY 3
 
      constructor(data, time, type){   //time is relative time passed somce rec start
        //this.data = data; //(Uint8Array of the ws' input) JETZT: volles Websocketonmessageantwortobjekt, somit liegt die originale data in data.data (dann halt mit new Uint8Array aber jetzt nd)
        this.time = time; //time since record start in millis
        this.type = type; //what func was it recorded form? (1 for onMessage1, 2 for onMessage2)
        this.data = SaveSystem.fakeWSResponseStructureFromBuffer(data.data);
      }

      peekByte(){
        return new Uint8Array(this.data.data)[0];
      }

      getDataAsByteArray(){
        return new Uint8Array(this.data.data);
      }
    }

    //https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  let bIsObserving = false;
  function toggleObserverMode(bIsObserving2){
    bIsObserving = bIsObserving2;
  }

  const bannedCommCodes = [
    C.socketReady,
    //C.respawn,
    C.syncMe,
    C.hitMe,
    C.hitMeHardBoiled,
    //C.die
  ]



  const SaveSystem = {
    //----------------------------------------------------------------------------------------------------------------------------------
    SAVE_VERSION: 1,
    bIsInit: false,
    //----------------------------------------------------------------------------------------------------------------------------------
    /*
    file ver: Uint8 (1 byte)
    num of packets: Uint32 (4 bytes) 
    [packetarray elem]
      type: Uint8 (1 byte)
      rel time received: Uint32 (4 bytes)
      data length: Uint16 (2 bytes)
      [data]: Uint8s (x bytes)
    */


    init: function(){
      this.inputElem = document.createElement('input');
      this.inputElem.type = 'file';
      this.inputElem.style.display = 'none'; // Unsichtbar machen
      document.body.appendChild(this.inputElem);
      this.inputElem.addEventListener('change', this.handleFileUpload, false);
      console.log("elem should now exist..");
      this.bIsInit = true;
    },

    triggerFileUpload: function() {
      if(!this.bIsInit) this.init();
      this.inputElem.click(); 
    },

    handleFileUpload: function(event) {
      console.log("ghabdle");
      const file = event.target.files[0];
      if (!file) {
        console.log("no file");
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
          const arrayBuffer = e.target.result;
          PacketStreamer.clear();
          SaveSystem.parseFromData(arrayBuffer).forEach(pack => {
              PacketStreamer.addPacket(pack);
          });
      };

      reader.readAsArrayBuffer(file);
  },

  parseFromData: function(data){
    const v = new DataView(data);
    let offs = 0;
    const ver = v.getUint8(offs);
    console.log("loaded file version: " + ver);
    offs++;
    const numPacks = v.getUint32(offs);
    offs+=4;
    const newPacks = [];
    for(let i = 0; i<numPacks; i++){
      const type = v.getUint8(offs);
      offs++;
      const rTR = v.getUint32(offs);
      offs+=4;
      const dLen = v.getUint16(offs);
      offs+=2;
      const arr = new Uint8Array(dLen);
      for(let j = 0; j<dLen; j++){
        arr[j] = v.getUint8(offs);
        offs++;
      }
      const pack = new Packet3(this.fakeWSResponseStructure(arr), rTR, type);
      newPacks.push(pack);
    }
    return newPacks;
  },

  fakeWSResponseStructure: function(uint8arr){
    return{
      data: uint8arr.buffer 
    }
  },

  fakeWSResponseStructureFromBuffer: function(buff){
    return{
      data: buff 
    }
  },

    savePacketsToFile: function(){
      packets = [];
      for(let i = 0; i<PacketStreamer.length; i++){
        packets.push(PacketStreamer.getPacket(i));
      }
      const uint8Array = this.compressPacketsToByteArray(packets);

      function downloadBlob(data, fileName, mimeType) {
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
      downloadBlob(uint8Array, 'Replay.SRPLY', 'application/octet-stream');
    },

    compressPacketsToByteArray: function(packs){
      const buffer = new ArrayBuffer(this.calcSaveLength(packs));
      const v = new DataView(buffer);
      let offs = 0;

      v.setUint8(offs,this.SAVE_VERSION);
      offs++;
      v.setUint32(offs, packs.length);
      offs+=4;
      packs.forEach(pack => {
        v.setUint8(offs, pack.type);
        offs++;
        v.setUint32(offs, pack.time);
        offs+=4;  
        v.setUint16(offs, pack.getDataAsByteArray().length);
        offs+=2;
        pack.getDataAsByteArray().forEach(byTe => {
          v.setUint8(offs, byTe);
          offs++;
        });
      });

      return new Uint8Array(buffer);
    },



    calcSaveLength: function(packs){ //return the save length in bytes
      let num = 1; //file ver
      num+=4; //num packs
      for(let i = 0; i<packs.length; i++){
        num++; //type
        num+=4; //time received
        num+=2; //data length
        num+=packs[i].getDataAsByteArray().length; //data slots
      }

      return num;
    }

  };


  function releasePackets(packs){
    packs.splice(0, packs.length);
    console.log("packets released.");
  }


//-----------------------------------------------------------------------------------------------------------------------------------------

  const MemoryManager={
    chunks: [],

    getAndReleaseCompressed: function(packs){
      const uint8arr = SaveSystem.compressPacketsToByteArray(packs);
      const buff = uint8arr.buffer;
      releasePackets(packs);
      console.log("compressor: " + uint8arr.length + " bytes pre-compress");
      const compressed = pako.deflate(buff);
      console.log("compressor: " + compressed.length + " bytes post-compress");
      return compressed;
    },

    releaseToChunk: function(packs){
      this.chunks.push(this.getAndReleaseCompressed(packs));
    },

    //aka crashChromeTab()
    loadAllChunksToMemory: function(){
      //comeplete chunking
      if(packets.length>0) this.releaseToChunk();
      this.chunks.forEach(cChunkData => {
        //decompress chunk
        const uint8arr =  pako.inflate(cChunkData);
        SaveSystem.parseFromData(uint8arr.buffer); //if this fails then the compress fucked and I fuck me fuck you puppy
      });
      this.chunks = [];
    },

  loadChunk: function(index){
    console.log("trying to load chunk " + index + ", max length " + (this.chunks.length-1));
    const uint8arr =  pako.inflate(this.chunks[index]);
    return SaveSystem.parseFromData(uint8arr.buffer);
  }

  };

  const PacketStreamer = {
    chunkSize: 1000,
    tempPacketStream: [],
    length: 0,
    currentChunkIdx: 0,

    addPacket: function (pack) {
      if(this.currentChunkIdx!= Math.floor(this.length/this.chunkSize)) this.loadChunk(Math.floor(this.length/this.chunkSize));
      this.tempPacketStream.push(pack);
      this.length++;
      this.releaseAll();
    },

    clear: function(){
      this.currentChunkIdx = 0;
      this.length = 0;
      MemoryManager.chunks = [];
      this.tempPacketStream= [];
    },

    loadChunk: function(indx){
      if(Math.floor(this.length/this.chunkSize)>=MemoryManager.chunks.length) this.release();
      this.tempPacketStream = MemoryManager.loadChunk(indx);
      this.currentChunkIdx = indx;
    },

    releaseAll: function(){
       while(this.tempPacketStream.length>=this.chunkSize){
        this.release();
      }
    },

    release: function(){
      MemoryManager.releaseToChunk(this.tempPacketStream.splice(0, this.tempPacketStream.length>this.chunkSize? this.chunkSize : this.tempPacketStream.length));
      this.currentChunkIdx= Math.floor(this.length/this.chunkSize);
    },

    getPacket: function(index){
      if(index>=this.length){
        index%=this.length; //troll
      }
      const location = Math.floor(index/this.chunkSize);
      if(this.currentChunkIdx!=location){
        this.loadChunk(location);
        console.log("moving playback to chunk " + location );
      } 
      return this.tempPacketStream[index%this.chunkSize];
    }

  }


  
  //-----------------------------------------------------------------------------------------------------------------------------------------
  window.bReplaying = false;
  let iReplayPacketIdx = 0;
  let iReplayRelativeTime = 0; //do NOT expose this to the user, we will sync this at the start of rePlayPackets.
  //------------------------------------------------------------------------------------------------------------------------------------------

      async function rePlayPackets() {
        toggleObserverMode(true);
        Object.defineProperty(extern, 'observingGame', {
          get: function() {
            return bIsObserving;
          }
        });
        console.log("replay func called at iReplayPacketIdx " + iReplayPacketIdx + " and iReplayRelativeTime "+ iReplayRelativeTime +", bReplaying is " + bReplaying + ".");
        window.bReplaying = true;
        console.log(PacketStreamer.length+ " packets.");
        iReplayRelativeTime = PacketStreamer.getPacket(iReplayPacketIdx).time; 
        console.log("updated iReplayRelativeTime from iReplayPacketIdx: " + iReplayRelativeTime);

        while(PacketStreamer.length>iReplayPacketIdx && window.bReplaying){
          const packet = //packets.shift(); //grab first packet);
          PacketStreamer.getPacket(iReplayPacketIdx++);
          const delayDur = packet.time - iReplayRelativeTime;
          //console.log("sleep for: " + delayDur);
          if(delayDur>0) await sleep(delayDur);
          if(packet.data &&packet.peekByte()!=C.syncMe &&packet.peekByte()!=C.hitMe  && !bannedCommCodes.includes(packet.peekByte())){ //I want to kill myself :(
            //yes I know that that check up there ^^^^^^^^^^^^ doesn't account for any packet after the first one, but eh...
            switch(packet.type){
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
        console.log("replay finished: finished!");
        toggleObserverMode(false);
      }


    async function rePlayPackets2(){ //OHhohoho WE NEED THIS TO BE ASYNC BECAUZSE FUCK YOU SHIT ASS LANUGAGE YOU FUCKING SHITHOLE OF NOTHE FUCKING KILL YOURSELF END IT ALREADY NMOONE WANTS YOU ANYMORE FUCK YOU PUPPY!
      let replayIndex = 0;
      toggleObserverMode(true);
      Object.defineProperty(extern, 'observingGame', {
        get: function() {
          return bIsObserving;
        }
      });
      console.log(packets[0].time);
      const replayStartTime = Date.now();
      console.log("replay, " + packets.length);
      while(packets.length>replayIndex){
        const packet = //packets.shift(); //grab first packet);
        packets[replayIndex++];
        const delayDur = packet.time - (Date.now()-replayStartTime);
        console.log("sleep for: " + delayDur);
        if(delayDur>0) await sleep(delayDur);
        if(packet.data && packet.peekByte()!=C.socketReady && packet.peekByte()!=C.respawn && !bannedCommCodes.includes(packet.peekByte())){ //I want to kill myself :(
          //yes I know that that check up there ^^^^^^^^^^^^ doesn't account for any packet after the first one, but eh...
          switch(packet.type){
            case 1:
              console.log("on1");
              ss.onMessage(packet.data); 
            break;
            case 2: 
              console.log("on2");
              ss.onMessage2(packet.data); 
            break;
          }
        }
      }
      toggleObserverMode(false);
    }

    document.addEventListener('keydown', function(event) {
      if (event.key === "l") {
        rePlayPackets();
      }
    });


    //create CLI
    window.Replay = {
      setPacketIndex: function(val){
        iReplayPacketIdx = val;
      }
      ,saveReplay: function(){
        SaveSystem.savePacketsToFile();
      }
      ,loadReplay: function(){
        SaveSystem.triggerFileUpload();
      }
      ,memngr:MemoryManager
      ,pckStrmr: PacketStreamer
      ,svsys: SaveSystem
    };


  })();