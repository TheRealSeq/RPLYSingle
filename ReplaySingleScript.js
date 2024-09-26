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
  // ==/UserScript==


  (function () {
    let functionNames=[]; // fuck you puppy
    let H={}; //deobf names. Fuck you puppy.
    let C = {}; //commcodes
    let ss = {}; // fuck you puppy
    LM();
    function LM(){ //so I can collapse this shit. Fuck you puppy!!!!!!1111
    let originalReplace = String.prototype.replace;

    String.prototype.originalReplace = function() {
      return originalReplace.apply(this, arguments);
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

      //console.log(js.match(gameSocketVar+"\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{.+?(?=\\},"+ gameSocketVar + "))"));
      const onMessageMatch = js.match(H.ws+"\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{.+?(?=,"+ H.ws + "))");
      //FUCK YOU PUPPY
      //I love you puppy

      const onMessage2Match = js.match(H.ws+"\\.onmessage=(function\\(([a-zA-Z$_,]+)\\)\\{switch.+?(?=requestGameOptions)requestGameOptions:FO\\(\\)\\}\\})");


      console.log(onMessageMatch[1]);
      console.log(onMessage2Match[1]);

      H.onMessage = onMessageMatch[1];
      H.onMessage2 = onMessage2Match[1]


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
        const crP = new Packet(d, Date.now()-recordStartTime, t);
        packets.push(crP);
      })
    }

    function injExternal(js, inj){
      const onMessage1Match = js.match(H.ws+"\\.onmessage=function\\(([a-zA-Z$_,]+)\\)\\{");
      const onMessage2Match = js.match("("+H.ws+"\\.onmessage=function\\(([a-zA-Z$_,]+)\\)\\{)switch");
    
      inj(onMessage1Match[0], onMessage1Match[0] + "window."+functionNames.recordPacket+"("+onMessage1Match[1]+", 1);");
      inj(onMessage2Match[1], onMessage2Match[1] + "window."+functionNames.recordPacket+"("+onMessage2Match[2]+", 2);");

    }

    //class declarations
    class Packet{
      data;
      time4;
      type;

      constructor(data, time2, type){   //time is relative time passed somce rec start
        this.data = data; //Uint8Array of the ws' input
        this.time4 = time2; //time since record start in millis
        this.type = type; //what func was it recorded form? (1 for onMessage1, 2 for onMessage2)
      }

      peekByte(){
        return new Uint8Array(this.data.data)[0];
      }
      getTime(){
        return this.time4;
      }
      getData(){
        return this.data;
      }
    }

    //https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }
  

    async function rePlayPackets(){ //OHhohoho WE NEED THIS TO BE ASYNC BECAUZSE FUCK YOU SHIT ASS LANUGAGE YOU FUCKING SHITHOLE OF NOTHE FUCKING KILL YOURSELF END IT ALREADY NMOONE WANTS YOU ANYMORE FUCK YOU PUPPY!
      const replayStartTime = Date.now();
      console.log("replay, " + packets.length);
      while(packets.length>0){
        const packet = packets[0]; //grab first packet
        const delayDur = packet.getTime() - (Date.now()-replayStartTime);
        console.log(packet.getTime());
        console.log("sleep for: " + delayDur);
        if(delayDur>0) await sleep(delayDur);
        
        if(packet.data && packet.peekByte()!=C.socketReady){
          switch(packet.type){
            case 1:
              console.log("on1");
              ss.onMessage(packet.getData()); 
            break;
            case 2: 
              console.log("on2");
              ss.onMessage2(packet.getData()); 
            break;
          }
          packets.shift();
        }
      }
    }

    document.addEventListener('keydown', function(event) {
      if (event.key === "l") {
        rePlayPackets();
      }
  });

    
  })();