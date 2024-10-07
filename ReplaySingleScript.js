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
    {
      LM();
      function LM() { //so I can collapse this shit. Fuck you puppy!!!!!!1111
        let originalReplace = String.prototype.replace;
        let originalReplaceAll = String.prototype.replaceAll;

        String.prototype.originalReplace = function () {
          return originalReplace.apply(this, arguments);
        };

        String.prototype.originalReplaceAll = function () {
          return originalReplaceAll.apply(this, arguments);
        };


        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRGetResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');
        let shellshockjs
        XMLHttpRequest.prototype.open = function (...args) {
          const url = args[1];
          if (url && url.includes("js/shellshock.js")) {
            shellshockjs = this;
          };
          originalXHROpen.apply(this, args);
        };
        Object.defineProperty(XMLHttpRequest.prototype, 'response', {
          get: function () {
            if (this === shellshockjs) {
              return inject(originalXHRGetResponse.get.call(this));
            };
            return originalXHRGetResponse.get.call(this);
          }
        });
        //VAR STUFF
        let F = [];


        const getScrambled = function () { return Array.from({ length: 10 }, () => String.fromCharCode(97 + Math.floor(Math.random() * 26))).join('') }
        const createAnonFunction = function (name, func) {
          const funcName = getScrambled();
          window[funcName] = func;
          F[name] = window[funcName];
          functionNames[name] = funcName
        };
        const findKeyWithProperty = function (obj, propertyToFind) {
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
        const fetchTextContent = function (url) {
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

        const inject = function (js) {

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

          let injectionString = "";

          const modifyJS = function (find, replace) {
            let oldJS = js;
            js = js.originalReplace(find, replace);
            if (oldJS !== js) {
              console.log("%cReplacement successful! Injected code: " + replace, 'color: green; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            } else {
              console.log("%cReplacement failed! Attempted to replace " + find + " with: " + replace, 'color: red; font-weight: bold; font-size: 0.6em; text-decoration: italic;');
            };
          };

          injPreGrab(js, modifyJS);
          //neeed to do here so changes are in the internal version too, unless I only modify that.......


          //console.log(js.match(gameSocketVar+"\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{.+?(?=\\},"+ gameSocketVar + "))"));
          const onMessageMatch = js.match(H.ws + "\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{.+?(?=," + H.ws + "))");
          const onMessageMatch2 = js.match(H.ws + "\\.onmessage=(function\\([a-zA-Z$_,]+\\)\\{).+?(?=," + H.ws + ")");

          //FUCK YOU PUPPY
          //I love you puppy

          const onMessage2Match = js.match(H.ws + "\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{switch.+?(?=requestGameOptions)requestGameOptions:([a-zA-Z$_,]+)\\(\\)\\}\\})");


          console.log(onMessageMatch[1]);
          console.log(onMessage2Match[1]);

          let onMessage2Mod = onMessage2Match[1];

          let onMessage1Mod = onMessageMatch[1].originalReplaceAll("syncMe", "replacedValueSyncMe");
          onMessage1Mod = onMessage1Mod.originalReplaceAll("hitMe", "replacedValueHitMe");
          onMessage1Mod = onMessage1Mod.originalReplaceAll("hitMeHardBoiled", "nononono");
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
            if (variableNameRegex.test(deobf) || name === "onMessage" || name === "onMessage2") {
              injectionString = `${injectionString}${name}: (() => { try { return ${deobf}; } catch (error) { return "value_undefined"; } })(),`;
            } else {
              const crashplease = "balls";
              crashplease = "balls2";
            };
          };
          console.log(injectionString);
          modifyJS(H.SCENE + '.render', `window["${functionNames.retrieveFunctions}"]({${injectionString}},true)||${H.SCENE}.render`);
          // console.log(js);

          injExternal(js, modifyJS);//fuck you puppy

          console.log(H); //why here? Fuck you puppy
          return js;
        };
        createAnonFunction("retrieveFunctions", function (vars) { ss = vars; });
        createFuncsExternal(createAnonFunction);
      };
    } //I love you puppy <3

    function createFuncsExternal(cf){ //cf is the createAnonFunction method. Fuck you puppy
      cf("recordPacket", function(d, t){
        if(recordStartTime<0){
          recordStartTime = Date.now();
        }
        const pTime = Date.now()-recordStartTime;
        const crP = new Packet3(d, pTime, t);
        //packets.push(crP);
        PacketStreamer.addPacket(crP);
        return;
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
      const meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch = js.match(/\)\}([a-zA-Z$_,]+)&&\([a-zA-Z$_,]+\.update\([a-zA-Z$_,]+\)/);
      //console.log("BULLSHIT DUMBASS : "+meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch);
      H.me = meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch[1];
      inj(meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch[0], meCheckInTheUpdateActorsFunctionBullshitDumbassWhyDoesThisEditTheCameraPositionWTFMatch[0].originalReplace(H.me, "("+H.me+"&&!window.bReplaying)"));

            //inj("iO.PS=WN.position.x,iO.oS=WN.position.y,iO.mS=WN.position.z,", "");
      const makePlayerPositionEqualCameraPositionForSomeFUCKINGReasonMatch = js.match(H.me+ "\\."+ H.x+ "="+ H.CAMERA+ "\\.position\\.x,"+
        H.me+ "\\."+ H.y+ "="+ H.CAMERA+ "\\.position\\.y,"+
        H.me+ "\\."+ H.z+ "="+ H.CAMERA+ "\\.position\\.z,"
      );
      inj(makePlayerPositionEqualCameraPositionForSomeFUCKINGReasonMatch[0], "!window.bReplaying?(" + makePlayerPositionEqualCameraPositionForSomeFUCKINGReasonMatch[0]+"1==1):1==1,");
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
        this.data = {
          data: data.data //heh
        };
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


  //-----------------------------------------------------------------------------------------------------------------------------------------
  window.bReplaying = false;
  //------------------------------------------------------------------------------------------------------------------------------------------

  })();
