import t from"camelcase-keys";import e,{fetch as n}from"cross-fetch";import r from"util";import i from"os";import o,{createWriteStream as a,existsSync as u,mkdirSync as s,rmdirSync as c}from"fs";import{v4 as d}from"uuid";import f from"form-data";import{compile as l}from"path-to-regexp";import{Mixin as p}from"ts-mixer";
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */var h=function(t,e){return h=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n])},h(t,e)};function m(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function n(){this.constructor=t}h(t,e),t.prototype=null===e?Object.create(e):(n.prototype=e.prototype,new n)}var g,v,b,y,w,_,x=function(){return x=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},x.apply(this,arguments)};function A(t,e,n,r){return new(n||(n=Promise))((function(i,o){function a(t){try{s(r.next(t))}catch(t){o(t)}}function u(t){try{s(r.throw(t))}catch(t){o(t)}}function s(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(a,u)}s((r=r.apply(t,e||[])).next())}))}function R(t,e){var n,r,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function u(o){return function(u){return function(o){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,r=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=e.call(t,a)}catch(t){o=[6,t],r=0}finally{n=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,u])}}}!function(t){t.accept="Accept",t.authorization="Authorization",t.contentType="Content-Type",t.editframeClientId="Editframe-Client-Id",t.userAgent="User-Agent",t.xRequestedWith="X-Requested-With"}(g||(g={})),function(t){t.bearer="Bearer ",t.editframeJs="editframe.js/",t.xRequestedWithXML="XMLHttpRequest"}(v||(v={})),function(t){t.delete="delete",t.get="get",t.post="post",t.put="put"}(b||(b={})),function(t){t.description="description",t.lastUsedAt="lastUsedAt",t.name="name",t.webhook="webhook"}(y||(y={})),function(t){t.black="#000000",t.transparent="transparent",t.white="#ffffff"}(w||(w={})),function(t){t.backgroundColor="backgroundColor",t.color="color",t.data="data",t.end="end",t.filter="filter",t.fontFamily="fontFamily",t.fontSize="fontSize",t.fontWeight="fontWeight",t.format="format",t.height="height",t.horizontalAlignment="horizontalAlignment",t.id="id",t.length="length",t.lineHeight="lineHeight",t.maxFontSize="maxFontSize",t.maxHeight="maxHeight",t.maxWidth="maxWidth",t.start="start",t.style="style",t.text="text",t.textAlign="textAlign",t.trim="trim",t.type="type",t.verticalAlignment="verticalAlignment",t.volume="volume",t.width="width",t.x="x",t.y="y"}(_||(_={}));var E,k,F,O={center:"center",left:"left",right:"right"},j={bottom:"bottom",middle:"middle",top:"top"},T={center:"center",justify:"justify",left:"left",right:"right"},C={bars:"bars",bricks:"bricks",curve:"curve",equalizer:"equalizer",line:"line",pixel:"pixel",roundBars:"roundBars",wave:"wave"},M={brightness:"brightness",contrast:"contrast",fadeIn:"fadein",fadeOut:"fadeout",grayscale:"grayscale",lighten:"lighten",negative:"negative",saturation:"saturation",sobel:"sobel",vintage:"vintage"};!function(t){t.brightness="brightness",t.color="color",t.contrast="contrast",t.duration="duration",t.saturation="saturation"}(E||(E={})),function(t){t.number="number",t.object="object",t.string="string",t[void 0]="undefined"}(k||(k={})),function(t){t.json="application/json"}(F||(F={}));var z,L,I,W,S,q,B,H,D,P={all:"/applications",get:"/applications/:id"},N="/metadata",G={all:"/videos",create:"/videos",get:"/video/:id"};!function(t){t.setMuted="setMuted",t.setVolume="setVolume"}(z||(z={})),function(t){t.addAudio="addAudio",t.addFilter="addFilter",t.addImage="addImage",t.addLottie="addLottie",t.addText="addText",t.addVideo="addVideo",t.addWaveform="addWaveform",t.backgroundColor="backgroundColor",t.dimensions="dimensions",t.duration="duration",t.encode="encode",t.layer="layer",t.layers="layers",t.metadata="metadata",t.setLayer="setLayer",t.updateLayerAttribute="updateLayerAttribute"}(L||(L={})),function(t){t.backgroundColor="backgroundColor",t.dimensions="dimensions",t.duration="duration",t.metadata="metadata"}(I||(I={})),function(t){t.id="id",t.status="status",t.timestamp="timestamp"}(W||(W={}));var V,Y,U,X,J,$,K,Q,Z,tt,et,nt,rt,it,ot,at=((S={})[M.brightness]=((q={})[E.brightness]=k.number,q),S[M.contrast]=((B={})[E.contrast]=k.number,B),S[M.fadeIn]=((H={})[E.color]=k.string,H[E.duration]=k.number,H),S[M.saturation]=((D={})[E.saturation]=k.number,D),S);!function(t){t.filterName="filterName",t.options="options"}(V||(V={})),function(t){t.setFilter="setFilter"}(Y||(Y={})),function(t){t.setLength="setLength",t.setStart="setStart"}(U||(U={})),function(t){t.audio="audio",t.filter="filter",t.image="image",t.lottie="lottie",t.text="text",t.video="video",t.waveform="waveform"}(X||(X={})),function(t){t.fill="fill",t.fit="fit",t.stretch="stretch"}(J||(J={})),function(t){t.setAnimationData="setAnimationData"}($||($={})),function(t){t.setTrim="setTrim"}(K||(K={})),function(t){t.setFontFamily="setFontFamily",t.setFontSize="setFontSize",t.setFontWeight="setFontWeight",t.setLineHeight="setLineHeight",t.setMaxFontSize="setMaxFontSize",t.setMaxHeight="setMaxHeight",t.setMaxWidth="setMaxWidth",t.setText="setText",t.setTextAlignment="setTextAlignment"}(Q||(Q={})),function(t){t.setDimensions="setDimensions",t.setFilter="setFilter"}(Z||(Z={})),function(t){t.setBackgroundColor="setBackgroundColor",t.setColor="setColor",t.setFormat="setFormat",t.setHeight="setHeight",t.setWidth="setWidth",t.setX="setX",t.setY="setY"}(tt||(tt={})),function(t){t.downloadUrl="downloadUrl",t.duration="duration",t.isReady="isReady",t.metadata="metadata",t.streamUrl="streamUrl",t.thumbnailUrl="thumbnailUrl",t.timestamp="timestamp"}(et||(et={})),function(t){t.all="all",t.get="get",t.getMetadata="_getMetadata",t.new="new"}(nt||(nt={})),function(t){t.bitrate="bitrate",t.codec="codec",t.duration="duration",t.fps="fps",t.height="height",t.size="size",t.width="width"}(rt||(rt={})),function(t){t.type="type"}(it||(it={})),function(t){t.audio="audio",t.image="image",t.video="video"}(ot||(ot={}));var ut=function(t,e){return"".concat(t," - ").concat(e)},st=function(t){return"Error getting applications: ".concat(t)},ct="malformed `applications` response";function dt(t,e){return t(e={exports:{}},e.exports),e.exports}var ft=dt((function(t){var e={};t.exports=e;var n={reset:[0,0],bold:[1,22],dim:[2,22],italic:[3,23],underline:[4,24],inverse:[7,27],hidden:[8,28],strikethrough:[9,29],black:[30,39],red:[31,39],green:[32,39],yellow:[33,39],blue:[34,39],magenta:[35,39],cyan:[36,39],white:[37,39],gray:[90,39],grey:[90,39],brightRed:[91,39],brightGreen:[92,39],brightYellow:[93,39],brightBlue:[94,39],brightMagenta:[95,39],brightCyan:[96,39],brightWhite:[97,39],bgBlack:[40,49],bgRed:[41,49],bgGreen:[42,49],bgYellow:[43,49],bgBlue:[44,49],bgMagenta:[45,49],bgCyan:[46,49],bgWhite:[47,49],bgGray:[100,49],bgGrey:[100,49],bgBrightRed:[101,49],bgBrightGreen:[102,49],bgBrightYellow:[103,49],bgBrightBlue:[104,49],bgBrightMagenta:[105,49],bgBrightCyan:[106,49],bgBrightWhite:[107,49],blackBG:[40,49],redBG:[41,49],greenBG:[42,49],yellowBG:[43,49],blueBG:[44,49],magentaBG:[45,49],cyanBG:[46,49],whiteBG:[47,49]};Object.keys(n).forEach((function(t){var r=n[t],i=e[t]=[];i.open="["+r[0]+"m",i.close="["+r[1]+"m"}))})),lt=function(t,e){var n=(e=e||process.argv).indexOf("--"),r=/^-{1,2}/.test(t)?"":"--",i=e.indexOf(r+t);return-1!==i&&(-1===n||i<n)},pt=process.env,ht=void 0;function mt(t){var e=function(t){if(!1===ht)return 0;if(lt("color=16m")||lt("color=full")||lt("color=truecolor"))return 3;if(lt("color=256"))return 2;if(t&&!t.isTTY&&!0!==ht)return 0;var e=ht?1:0;if("win32"===process.platform){var n=i.release().split(".");return Number(process.versions.node.split(".")[0])>=8&&Number(n[0])>=10&&Number(n[2])>=10586?Number(n[2])>=14931?3:2:1}if("CI"in pt)return["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI"].some((function(t){return t in pt}))||"codeship"===pt.CI_NAME?1:e;if("TEAMCITY_VERSION"in pt)return/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(pt.TEAMCITY_VERSION)?1:0;if("TERM_PROGRAM"in pt){var r=parseInt((pt.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(pt.TERM_PROGRAM){case"iTerm.app":return r>=3?3:2;case"Hyper":return 3;case"Apple_Terminal":return 2}}return/-256(color)?$/i.test(pt.TERM)?2:/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(pt.TERM)||"COLORTERM"in pt?1:(pt.TERM,e)}(t);return function(t){return 0!==t&&{level:t,hasBasic:!0,has256:t>=2,has16m:t>=3}}(e)}lt("no-color")||lt("no-colors")||lt("color=false")?ht=!1:(lt("color")||lt("colors")||lt("color=true")||lt("color=always"))&&(ht=!0),"FORCE_COLOR"in pt&&(ht=0===pt.FORCE_COLOR.length||0!==parseInt(pt.FORCE_COLOR,10));var gt,vt=mt,bt=(mt(process.stdout),mt(process.stderr),dt((function(t){t.exports=function(t,e){var n="";t=(t=t||"Run the trap, drop the bass").split("");var r={a:["@","Ą","Ⱥ","Ʌ","Δ","Λ","Д"],b:["ß","Ɓ","Ƀ","ɮ","β","฿"],c:["©","Ȼ","Ͼ"],d:["Ð","Ɗ","Ԁ","ԁ","Ԃ","ԃ"],e:["Ë","ĕ","Ǝ","ɘ","Σ","ξ","Ҽ","੬"],f:["Ӻ"],g:["ɢ"],h:["Ħ","ƕ","Ң","Һ","Ӈ","Ԋ"],i:["༏"],j:["Ĵ"],k:["ĸ","Ҡ","Ӄ","Ԟ"],l:["Ĺ"],m:["ʍ","Ӎ","ӎ","Ԡ","ԡ","൩"],n:["Ñ","ŋ","Ɲ","Ͷ","Π","Ҋ"],o:["Ø","õ","ø","Ǿ","ʘ","Ѻ","ם","۝","๏"],p:["Ƿ","Ҏ"],q:["্"],r:["®","Ʀ","Ȑ","Ɍ","ʀ","Я"],s:["§","Ϟ","ϟ","Ϩ"],t:["Ł","Ŧ","ͳ"],u:["Ʊ","Ս"],v:["ט"],w:["Ш","Ѡ","Ѽ","൰"],x:["Ҳ","Ӿ","Ӽ","ӽ"],y:["¥","Ұ","Ӌ"],z:["Ƶ","ɀ"]};return t.forEach((function(t){t=t.toLowerCase();var e=r[t]||[" "],i=Math.floor(Math.random()*e.length);n+=void 0!==r[t]?r[t][i]:t})),n}}))),yt=dt((function(t){t.exports=function(t,e){t=t||"   he is here   ";var n={up:["̍","̎","̄","̅","̿","̑","̆","̐","͒","͗","͑","̇","̈","̊","͂","̓","̈","͊","͋","͌","̃","̂","̌","͐","̀","́","̋","̏","̒","̓","̔","̽","̉","ͣ","ͤ","ͥ","ͦ","ͧ","ͨ","ͩ","ͪ","ͫ","ͬ","ͭ","ͮ","ͯ","̾","͛","͆","̚"],down:["̖","̗","̘","̙","̜","̝","̞","̟","̠","̤","̥","̦","̩","̪","̫","̬","̭","̮","̯","̰","̱","̲","̳","̹","̺","̻","̼","ͅ","͇","͈","͉","͍","͎","͓","͔","͕","͖","͙","͚","̣"],mid:["̕","̛","̀","́","͘","̡","̢","̧","̨","̴","̵","̶","͜","͝","͞","͟","͠","͢","̸","̷","͡"," ҉"]},r=[].concat(n.up,n.down,n.mid);function i(t){return Math.floor(Math.random()*t)}function o(t){var e=!1;return r.filter((function(n){e=n===t})),e}return function(t,e){var r,a,u="";for(a in(e=e||{}).up=void 0===e.up||e.up,e.mid=void 0===e.mid||e.mid,e.down=void 0===e.down||e.down,e.size=void 0!==e.size?e.size:"maxi",t=t.split(""))if(!o(a)){switch(u+=t[a],r={up:0,down:0,mid:0},e.size){case"mini":r.up=i(8),r.mid=i(2),r.down=i(8);break;case"maxi":r.up=i(16)+3,r.mid=i(4)+1,r.down=i(64)+3;break;default:r.up=i(8)+1,r.mid=i(6)/2,r.down=i(8)+1}var s=["up","mid","down"];for(var c in s)for(var d=s[c],f=0;f<=r[d];f++)e[d]&&(u+=n[d][i(n[d].length)])}return u}(t,e)}})),wt=dt((function(t){t.exports=function(t){return function(e,n,r){if(" "===e)return e;switch(n%3){case 0:return t.red(e);case 1:return t.white(e);case 2:return t.blue(e)}}}})),_t=dt((function(t){t.exports=function(t){return function(e,n,r){return n%2==0?e:t.inverse(e)}}})),xt=dt((function(t){t.exports=function(t){var e=["red","yellow","green","blue","magenta"];return function(n,r,i){return" "===n?n:t[e[r++%e.length]](n)}}})),At=dt((function(t){t.exports=function(t){var e=["underline","inverse","grey","yellow","red","green","blue","white","cyan","magenta","brightYellow","brightRed","brightGreen","brightBlue","brightWhite","brightCyan","brightMagenta"];return function(n,r,i){return" "===n?n:t[e[Math.round(Math.random()*(e.length-2))]](n)}}})),Rt=dt((function(t){var e={};t.exports=e,e.themes={};var n=e.styles=ft,i=Object.defineProperties,o=new RegExp(/[\r\n]+/g);e.supportsColor=vt,void 0===e.enabled&&(e.enabled=!1!==e.supportsColor()),e.enable=function(){e.enabled=!0},e.disable=function(){e.enabled=!1},e.stripColors=e.strip=function(t){return(""+t).replace(/\x1B\[\d+m/g,"")},e.stylize=function(t,r){if(!e.enabled)return t+"";var i=n[r];return!i&&r in e?e[r](t):i.open+t+i.close};var a=/[|\\{}()[\]^$+*?.]/g;function u(t){var e=function t(){return f.apply(t,arguments)};return e._styles=t,e.__proto__=d,e}var s,c=(s={},n.grey=n.gray,Object.keys(n).forEach((function(t){n[t].closeRe=new RegExp(function(t){if("string"!=typeof t)throw new TypeError("Expected a string");return t.replace(a,"\\$&")}(n[t].close),"g"),s[t]={get:function(){return u(this._styles.concat(t))}}})),s),d=i((function(){}),c);function f(){var t=Array.prototype.slice.call(arguments),i=t.map((function(t){return null!=t&&t.constructor===String?t:r.inspect(t)})).join(" ");if(!e.enabled||!i)return i;for(var a=-1!=i.indexOf("\n"),u=this._styles,s=u.length;s--;){var c=n[u[s]];i=c.open+i.replace(c.closeRe,c.open)+c.close,a&&(i=i.replace(o,(function(t){return c.close+t+c.open})))}return i}e.setTheme=function(t){if("string"!=typeof t)for(var n in t)!function(n){e[n]=function(r){if("object"==typeof t[n]){var i=r;for(var o in t[n])i=e[t[n][o]](i);return i}return e[t[n]](r)}}(n);else console.log("colors.setTheme now only accepts an object, not a string.  If you are trying to set a theme from a file, it is now your (the caller's) responsibility to require the file.  The old syntax looked like colors.setTheme(__dirname + '/../themes/generic-logging.js'); The new syntax looks like colors.setTheme(require(__dirname + '/../themes/generic-logging.js'));")};var l=function(t,e){var n=e.split("");return(n=n.map(t)).join("")};for(var p in e.trap=bt,e.zalgo=yt,e.maps={},e.maps.america=wt(e),e.maps.zebra=_t(e),e.maps.rainbow=xt(e),e.maps.random=At(e),e.maps)!function(t){e[t]=function(n){return l(e.maps[t],n)}}(p);i(e,function(){var t={};return Object.keys(c).forEach((function(e){t[e]={get:function(){return u([e])}}})),t}())})),Et=dt((function(t){t.exports=Rt})),kt={clientIdAndTokenRequired:"\\".concat(Et.white("clientId"),"\\ and \\").concat(Et.white("token"),"\\ must be provided to constructor")},Ft=function(t){return"\\".concat(Et.white(t),"\\ is not valid url")},Ot=function(t,e,n,r){return"\n  \\".concat(Et.white(e),"\\ attribute in \\").concat(Et.white(t),"\\ must be of type \\").concat(Et.white(r),"\\. Got: \\").concat(Et.white(JSON.stringify(n)),"\\")},jt=function(t){return t.join(" | ")},Tt=function(t){return"\\".concat(Et.white(t),"\\ field is required")},Ct=function(t,e){return"".concat(t,": { ").concat(e," }")},Mt={dataRequired:"\\".concat(Et.white("data"),"\\ must be provided"),dimensionsRequired:"\\".concat(Et.white("dimensions"),"\\ must be provided unless a \\").concat(Et.white("videoFile"),"\\ is provided"),durationRequired:"\\".concat(Et.white("duration"),"\\ must be provided unless a \\").concat(Et.white("videoFile"),"\\ is provided"),errorEncoding:function(t){return"Error encoding video: ".concat(t)},filterRequired:"\\".concat(Et.white("filter"),"\\ must be provided"),malformedEncodingResponse:"malformed ".concat(Et.white("encoding"),"\\ response"),optionsRequired:"\\".concat(Et.white("options"),"\\ must be provided"),textRequired:"\\".concat(Et.white("text"),"\\ field required"),validationOptionsError:function(t){return"Error: ".concat(t)}},zt="Invalid file source provided",Lt=function(t){return"Invalid layer format: ".concat(t)},It=function(t){return"Error getting videos: ".concat(t)},Wt=function(t){return"Error getting video: ".concat(t)},St="malformed `videos` response",qt=function(t){return"Error creating new video: ".concat(t)},Bt=function(t,e){return"".concat(t,"/v").concat(e)},Ht=function(t){return function(n){return n.url.startsWith("/")?e("".concat(t).concat(n.url),n):e(n.url,n)}},Dt=function(e){return function(n){var r=n.data,i=n.headers,o=n.method,a=n.url;return A(void 0,void 0,void 0,(function(){var n,u,s;return R(this,(function(c){switch(c.label){case 0:return[4,e({body:r,headers:i,method:o,url:a})];case 1:if(!(n=c.sent()).ok)throw new Error(ut(n.url,n.statusText));return[4,n.json()];case 2:return u=c.sent(),(s=t(u,{deep:!0})).data?[2,s.data]:[2,s]}}))}))}},Pt=function(t){var e,n=t.clientId,r=t.isForm,i=void 0!==r&&r,o=t.token,a=((e={})[g.userAgent]="".concat(v.editframeJs).concat("0.2.4"),e[g.editframeClientId]=n,e[g.authorization]="".concat(v.bearer).concat(o),e);return i?(a[g.accept]=F.json,a[g.xRequestedWith]=v.xRequestedWithXML):a[g.contentType]=F.json,a},Nt=function(t,e){if(t&&e.validate(t))return t;throw new Error(e.invalidDataError)},Gt=function(t){return y.description in t&&y.lastUsedAt in t&&y.name in t&&y.webhook in t},Vt=function(t){return Gt(t[0])},Yt=function(t){return console.error(Et.yellow(t))},Ut=function(){return d().slice(0,6)},Xt=function(t){return o.createReadStream(t)},Jt=function(t){return A(void 0,void 0,void 0,(function(){var e,r,i,o;return R(this,(function(c){switch(c.label){case 0:return e="./tmp/".concat(Ut()),r="".concat(e,"/").concat(Ut()),u(d=e)||s(d,{recursive:!0}),[4,n(t)];case 1:return i=c.sent(),o=a(r),[4,new Promise((function(t,e){i.body.pipe(o),i.body.on("error",e),o.on("finish",t)}))];case 2:return c.sent(),[2,{temporaryFileDirectory:e,temporaryFilePath:r}]}var d}))}))},$t=function(t){return typeof t===k.string?"url":"file"},Kt=function(t,e){return void 0===t&&(t="/"),void 0===e&&(e={}),"/"===t?t:function(t){return l(t)}(t)(e,{pretty:!0})},Qt=function(t){try{new URL(t)}catch(e){throw new TypeError(Ft(t))}},Zt=function(t,e){if(!t)throw new Error(e)},te=function(t,e,n,r,i){if(void 0===i&&(i=!1),n&&typeof n!==r){var o=Ot(t,e,n,r);if(i)throw new TypeError(o);return o}},ee=function(t,e){try{return t(),e?e():void 0}catch(t){t.name;var n=t.stack;Yt(n),process.exit(1)}},ne=((gt={})[M.brightness]=function(t){return t&&1===Object.keys(t).length&&E.brightness in t},gt[M.contrast]=function(t){return t&&1===Object.keys(t).length&&E.contrast in t},gt[M.fadeIn]=function(t){return t&&2===Object.keys(t).length&&E.color in t&&E.duration in t},gt[M.saturation]=function(t){return t&&1===Object.keys(t).length&&E.saturation in t},gt),re=function(t,e,n,r){var i=n.filterName,o=n.options;void 0===r&&(r=!1);var a=[],u=Object.values(M).includes(i);if(!u){var s=Ot(t,Ct(e,V.filterName),i,"".concat(Object.values(M).join(", ")));if(r)throw new TypeError(s);a.push(s)}if(u&&i in at&&!ne[i](o)){s=Ot(t,Ct(e,V.options),o,JSON.stringify(at[i]));if(r)throw new TypeError(s);a.push(s)}return a},ie=function(t){return void 0!==t},oe=function(t,e){var n=e.horizontalAlignment,r=e.verticalAlignment,i=[],o=Object.values(j);return i.push(ce(t,_.horizontalAlignment,n)),r&&!o.includes(r)&&i.push(Ot(t,_.verticalAlignment,r,o.join(", "))),i.filter(ie)},ae=function(t,e){var n=[];return n.push(te(t,_.volume,e.volume,k.number)),n.filter(ie)},ue=function(t,e){var n=e.length,r=e.start,i=[];return i.push(te(t,_.start,r,k.number)),i.push(te(t,_.length,n,k.number)),i.filter(ie)},se=function(t,e){var n=e.filter,r=[];return re(t,_.filter,n).forEach((function(t){return r.push(t)})),r.filter(ie)},ce=function(t,e,n){var r=Object.values(O);if(n&&!r.includes(n))return Ot(t,e,n,r.join(", "))},de=function(t,e){var n=Object.values(T);if(e&&!n.includes(e))return Ot(t,_.textAlign,e,n.join(", "))},fe=function(t,e){var n=e.data,r=[];return r.push(te(t,_.data,n,k.object)),r.filter(ie)},le=function(t,e){var n=e.fontFamily,r=e.fontSize,i=e.maxFontSize,o=e.maxHeight,a=e.maxWidth,u=e.text,s=e.textAlign,c=[];return c.push(te(t,_.fontFamily,n,k.string)),c.push(te(t,_.fontSize,r,k.number)),c.push(te(t,_.maxFontSize,i,k.number)),c.push(te(t,_.maxHeight,o,k.number)),c.push(te(t,_.maxWidth,a,k.number)),c.push(te(t,_.text,u,k.string)),c.push(de(t,s)),c.filter(ie)},pe=function(t,e){var n=e.trim,r=[];return r.push(te(t,Ct(_.trim,_.start),null==n?void 0:n.start,k.number)),r.push(te(t,Ct(_.trim,_.end),null==n?void 0:n.end,k.number)),r.filter(ie)},he=function(t,e){var n=e.backgroundColor,r=e.color,i=e.x,o=e.y,a=[];return a.push(te(t,_.backgroundColor,n,k.string)),a.push(te(t,_.color,r,k.string)),a.push(te(t,_.x,i,k.number)),a.push(te(t,_.y,o,k.number)),a.filter(ie)},me=function(t,e){var n=e.style,r=[];r.push(te(t,_.style,n,k.string));var i=Object.values(C);return n&&!i.includes(n)&&r.push(Ot(t,_.style,n,i.join(", "))),r.filter(ie)},ge=function(t,e,n){var r=t.map((function(t){return t(e,n)})).flat().filter((function(t){return void 0!==t}));if(r.length)throw new TypeError("Validation Errors: ".concat(r.join("\n")))},ve=function(t){return W.id in t&&W.status in t&&W.timestamp in t},be=function(t){return et.isReady in t&&et.metadata in t&&et.timestamp in t},ye=function(t){return be(t[0])},we=function(t){return rt.bitrate in t&&rt.codec in t&&rt.duration in t&&rt.fps in t&&rt.height in t&&rt.size in t&&rt.width in t},_e=function(){function t(t){this._options=x({},t),this._fetch=t.fetch}return t.prototype.get=function(t){var e=t.url;return A(this,void 0,void 0,(function(){return R(this,(function(t){switch(t.label){case 0:return[4,this._fetch({headers:Pt(this._options),url:e})];case 1:return[2,t.sent()]}}))}))},t.prototype.post=function(t){var e=t.data,n=t.isForm,r=void 0!==n&&n,i=t.url;return A(this,void 0,void 0,(function(){return R(this,(function(t){switch(t.label){case 0:return[4,this._fetch({data:e,headers:Pt(x(x({},this._options),{isForm:r})),method:b.post,url:i})];case 1:return[2,t.sent()]}}))}))},t.prototype.put=function(t){var e=t.data,n=t.isForm,r=void 0!==n&&n,i=t.url;return A(this,void 0,void 0,(function(){return R(this,(function(t){switch(t.label){case 0:return[4,this._fetch({data:e,headers:Pt(x(x({},this._options),{isForm:r})),method:b.put,url:i})];case 1:return[2,t.sent()]}}))}))},t}(),xe=function(){function t(t){this._api=t}return t.prototype.all=function(){return A(this,void 0,void 0,(function(){var t,e;return R(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),[4,this._api.get({url:P.all})];case 1:return t=n.sent(),[2,Nt(t,{invalidDataError:ct,validate:Vt})];case 2:return e=n.sent(),console.error(st(e.message)),[3,3];case 3:return[2,[]]}}))}))},t.prototype.get=function(t){return A(this,void 0,void 0,(function(){var e,n;return R(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,this._api.get({url:Kt(P.get,{id:t})})];case 1:return e=r.sent(),[2,Nt(e,{invalidDataError:ct,validate:Gt})];case 2:return n=r.sent(),console.error(st(n.message)),[3,3];case 3:return[2,void 0]}}))}))},t}(),Ae=function(){function t(t){var e=t.composition,n=t.id;this._composition=e,this._id=n}return Object.defineProperty(t.prototype,"id",{get:function(){return this._id},enumerable:!1,configurable:!0}),t.prototype[U.setStart]=function(t){var e=this;return ee((function(){return te(U.setStart,_.start,t,k.number,!0)}),(function(){return e._updateAttribute(_.start,t)}))},t.prototype[U.setLength]=function(t){var e=this;return ee((function(){return te(U.setLength,_.length,t,k.number,!0)}),(function(){return e._updateAttribute(_.length,t)}))},t.prototype._updateAttribute=function(t,e){return this._composition.updateLayerAttribute(this._id,t,e),this},t}(),Re=function(t){function e(e){var n=e.composition,r=e.id;return t.call(this,{composition:n,id:r})||this}return m(e,t),e.prototype[K.setTrim]=function(t){var e=this,n=t.end,r=t.start;ee((function(){Zt(r,Tt(_.start)),te(K.setTrim,_.start,r,k.number,!0),te(K.setTrim,_.end,n,k.number,!0)}),(function(){return e._updateAttribute(_.start,r<0?0:r),n&&e._updateAttribute(_.end,n),e}))},e}(Ae),Ee=function(t){function e(e){var n=e.composition,r=e.id;return t.call(this,{composition:n,id:r})||this}return m(e,t),e.prototype[z.setVolume]=function(t){var e=this;return ee((function(){Zt(t,Tt(_.volume)),te(z.setVolume,_.volume,t,k.number,!0)}),(function(){var n=t;return t>1?n=1:t<0&&(n=0),e._updateAttribute(_.volume,n)}))},e.prototype[z.setMuted]=function(){return this._updateAttribute(_.volume,0)},e}(Re),ke=function(t){function e(e){var n=e.composition,r=e.id;return t.call(this,{composition:n,id:r})||this}return m(e,t),e.prototype[Y.setFilter]=function(t){var e=this,n=t.filterName,r=t.options;return ee((function(){return re(Y.setFilter,_.filter,{filterName:n,options:r},!0)}),(function(){return e._updateAttribute(_.filter,{filterName:n,options:r})}))},e}(Ae),Fe=function(t){function e(e){var n=e.composition,r=e.id;return t.call(this,{composition:n,id:r})||this}return m(e,t),e.prototype[tt.setBackgroundColor]=function(t){var e=this;ee((function(){return te(tt.setBackgroundColor,_.backgroundColor,t,k.string,!0)}),(function(){return e._updateAttribute(_.backgroundColor,t)}))},e.prototype[tt.setColor]=function(t){var e=this;ee((function(){return te(tt.setColor,_.color,t,k.string,!0)}),(function(){return e._updateAttribute(_.color,t)}))},e.prototype[tt.setFormat]=function(t){var e=this;ee((function(){return function(t){if(!Object.values(J).includes(t))throw new TypeError(Lt(t))}(t)}),(function(){return e._updateAttribute(_.format,t)}))},e.prototype[tt.setHeight]=function(t){var e=this;ee((function(){return te(tt.setHeight,_.height,t,k.number,!0)}),(function(){return e._updateAttribute(_.height,t)}))},e.prototype[tt.setWidth]=function(t){var e=this;ee((function(){return te(tt.setWidth,_.width,t,k.number,!0)}),(function(){return e._updateAttribute(_.width,t)}))},e.prototype[tt.setX]=function(t){var e=this;ee((function(){return te(tt.setX,_.x,t,k.number,!0)}),(function(){return e._updateAttribute(_.x,t)}))},e.prototype[tt.setY]=function(t){var e=this;ee((function(){return te(tt.setY,_.y,t,k.number,!0)}),(function(){return e._updateAttribute(_.y,t)}))},e}(Re),Oe=function(t){function e(e){var n=e.composition,r=e.id;return t.call(this,{composition:n,id:r})||this}return m(e,t),e.prototype[$.setAnimationData]=function(t){try{return Zt(t,Tt(_.data)),te($.setAnimationData,_.data,t,k.object),this._updateAttribute(_.data,t)}catch(t){var e=t.stack;Yt(e)}},e}(Fe),je=function(t){function e(e){var n=e.composition,r=e.id;return t.call(this,{composition:n,id:r})||this}return m(e,t),e.prototype[Q.setFontFamily]=function(t){var e=this;return ee((function(){return te(Q.setFontFamily,_.fontFamily,t,k.string,!0)}),(function(){return e._updateAttribute(_.fontFamily,t)}))},e.prototype[Q.setFontSize]=function(t){var e=this;return ee((function(){return te(Q.setFontSize,_.fontSize,t,k.number,!0)}),(function(){return e._updateAttribute(_.fontSize,t)}))},e.prototype[Q.setFontWeight]=function(t){var e=this;return ee((function(){return function(t,e,n,r,i){if(void 0===i&&(i=!1),n&&!r.includes(typeof n)){var o=Ot(t,e,n,jt(r));if(i)throw new TypeError(o);return o}}(Q.setFontWeight,_.fontWeight,t,[k.number,k.string],!0)}),(function(){return e._updateAttribute(_.fontWeight,t)}))},e.prototype[Q.setLineHeight]=function(t){var e=this;return ee((function(){return te(Q.setLineHeight,_.lineHeight,t,k.number,!0)}),(function(){return e._updateAttribute(_.lineHeight,t)}))},e.prototype[Q.setMaxFontSize]=function(t){var e=this;ee((function(){return te(Q.setMaxFontSize,_.maxFontSize,t,k.number,!0)}),(function(){return e._updateAttribute(_.maxFontSize,t)}))},e.prototype[Q.setMaxHeight]=function(t){var e=this;ee((function(){return te(Q.setMaxHeight,_.maxHeight,t,k.number,!0)}),(function(){return e._updateAttribute(_.maxHeight,t)}))},e.prototype[Q.setMaxWidth]=function(t){var e=this;ee((function(){return te(Q.setMaxWidth,_.maxWidth,t,k.number,!0)}),(function(){return e._updateAttribute(_.maxWidth,t)}))},e.prototype[Q.setText]=function(t){var e=this;ee((function(){Zt(t,Mt.textRequired),te(Q.setText,_.text,t,k.string,!0)}),(function(){return e._updateAttribute(_.text,t)}))},e.prototype[Q.setTextAlignment]=function(t){var e=this;ee((function(){return de(Q.setTextAlignment,t)}),(function(){return e._updateAttribute(_.textAlign,t)}))},e}(Fe),Te=function(t){function e(e){var n=e.composition,r=e.id;return t.call(this,{composition:n,id:r})||this}return m(e,t),e.prototype[Z.setDimensions]=function(t){var e=this,n=t.height,r=t.width;ee((function(){Zt(n,Tt(_.height)),Zt(r,Tt(_.width))}),(function(){return e._updateAttribute(_.height,n),e._updateAttribute(_.width,r)}))},e.prototype[Z.setFilter]=function(t){var e=this,n=t.filterName,r=t.options;ee((function(){return re(Z.setFilter,_.filter,{filterName:n,options:r},!0)}),(function(){return e._updateAttribute(_.filter,{filterName:n,options:r})}))},e}(p(Ee,Fe)),Ce=function(){function t(t){var e=this,n=t.api,r=t.formData,i=t.options;this._layers=[],this._api=n,this._files=[],this._formData=r,this._options=i,ee((function(){return function(t){var e=t.backgroundColor,n=t.dimensions,r=t.duration,i=[];Zt(r,Mt.durationRequired),Zt(n,Mt.dimensionsRequired),i.push(te(nt.new,Ct(I.dimensions,_.height),n.height,k.number)),i.push(te(nt.new,Ct(I.dimensions,_.width),n.width,k.number)),i.push(te(nt.new,I.backgroundColor,e,k.string));var o=i.filter((function(t){return void 0!==t}));if(o.length)throw new TypeError(o.join("\n"))}(e._options)}))}return Object.defineProperty(t.prototype,L.backgroundColor,{get:function(){return this._options.backgroundColor},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,L.dimensions,{get:function(){return this._options.dimensions},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,L.duration,{get:function(){return this._options.duration},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,L.metadata,{get:function(){return this._options.metadata},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,L.layers,{get:function(){return this._layers},enumerable:!1,configurable:!0}),t.prototype[L.layer]=function(t){return this._layers.find((function(e){return e.id&&e.id===t}))},t.prototype[L.addAudio]=function(t,e){var n=this;return void 0===e&&(e={}),ee((function(){Zt(t,zt),Zt(e,Mt.optionsRequired),function(t){ge([ue,pe,ae],L.addAudio,t)}(e)}),(function(){var r=n._addLayer(x({type:X.audio},e)).id;return n._files.push({file:t,id:r}),new Ee({composition:n,id:r})}))},t.prototype[L.addFilter]=function(t){var e=this;return ee((function(){Zt(t,Mt.optionsRequired),Zt(t.filter,Mt.filterRequired),function(t){ge([ue,se],L.addFilter,t)}(t)}),(function(){var n=e._addLayer(x(x({},t),{type:X.filter})).id;return new ke({composition:e,id:n})}))},t.prototype[L.addImage]=function(t,e){var n=this;return void 0===e&&(e={}),ee((function(){Zt(t,zt),Zt(e,Mt.optionsRequired),function(t){ge([ue,he],L.addImage,t)}(e)}),(function(){var r=n._addLayer(x({type:X.image},e)).id;return n._files.push({file:t,id:r}),new Te({composition:n,id:r})}))},t.prototype[L.addLottie]=function(t){var e=this;return ee((function(){Zt(t,Mt.optionsRequired),Zt(t.data,Mt.dataRequired),function(t){ge([ue,he,fe],L.addLottie,t)}(t)}),(function(){var n=e._addLayer(x({type:X.lottie},t)).id;return new Oe({composition:e,id:n})}))},t.prototype[L.addText]=function(t){var e=this;return ee((function(){Zt(t,Mt.optionsRequired),Zt(t.text,Mt.textRequired),function(t){ge([ue,he,oe,le],L.addText,t)}(t)}),(function(){var n=e._addLayer(x({type:X.text},t)).id;return new je({composition:e,id:n})}))},t.prototype[L.addVideo]=function(t,e){var n=this;return void 0===e&&(e={}),ee((function(){Zt(t,zt),Zt(e,Mt.optionsRequired),function(t){ge([ue,pe,ae,he],L.addVideo,t)}(e)}),(function(){var r=n._addLayer(x({type:X.video},e)).id;return n._files.push({file:t,id:r}),new Te({composition:n,id:r})}))},t.prototype[L.addWaveform]=function(t,e){var n=this;return void 0===t&&(t={}),ee((function(){Zt(t,Mt.optionsRequired),function(t){ge([ue,he,me],L.addWaveform,t);var e=te(L.addWaveform,_.style,t.style,k.string);if(e)throw new Error(e)}(t)}),(function(){var r=n._addLayer(x({type:X.waveform},t)).id;return e&&n._files.push({file:e,id:r}),new Fe({composition:n,id:r})}))},t.prototype[L.encode]=function(){return A(this,void 0,void 0,(function(){var t,e;return R(this,(function(n){switch(n.label){case 0:this._generateConfig(),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,this._api.post({data:this._formData,isForm:!0,url:G.create})];case 2:return t=n.sent(),[2,Nt(t,{invalidDataError:Mt.malformedEncodingResponse,validate:ve})];case 3:return e=n.sent(),console.error(Mt.errorEncoding(e.message)),[2,void 0];case 4:return[2]}}))}))},t.prototype._generateConfig=function(){var t=this;this._files.forEach((function(e){var n=e.file,r=e.id;return t._formData.append(function(t,e){return"".concat($t(t)).concat(e)}(n,r),n)})),this._formData.append("config",JSON.stringify(x(x({},this._options),{layers:this._layers})))},t.prototype._addLayer=function(t){var e=x({id:Ut()},t);return this._layers.push(e),e},t.prototype[L.updateLayerAttribute]=function(t,e,n){var r=x({},this.layer(t));r[e]=n,this.setLayer(t,r)},t.prototype[L.setLayer]=function(t,e){var n=function(t,e,n){if(n||2===arguments.length)for(var r,i=0,o=e.length;i<o;i++)!r&&i in e||(r||(r=Array.prototype.slice.call(e,0,i)),r[i]=e[i]);return t.concat(r||Array.prototype.slice.call(e))}([],this.layers,!0),r=n.findIndex((function(e){return e.id===t}));n[r]=e,this._layers=n},t}(),Me=function(){function t(t){this._api=t}return t.prototype[nt.all]=function(){return A(this,void 0,void 0,(function(){var t,e;return R(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),[4,this._api.get({url:G.all})];case 1:return t=n.sent(),[2,Nt(t,{invalidDataError:St,validate:ye})];case 2:return e=n.sent(),console.error(It(e.message)),[3,3];case 3:return[2,[]]}}))}))},t.prototype[nt.get]=function(t){return A(this,void 0,void 0,(function(){var e,n;return R(this,(function(r){switch(r.label){case 0:return r.trys.push([0,2,,3]),[4,this._api.get({url:Kt(G.get,{id:t})})];case 1:return e=r.sent(),[2,Nt(e,{invalidDataError:St,validate:be})];case 2:return n=r.sent(),console.error(Wt(n.message)),[3,3];case 3:return[2,void 0]}}))}))},t.prototype[nt.new]=function(t,e){return void 0===t&&(t={backgroundColor:w.black}),A(this,void 0,void 0,(function(){var n,r,i,o,a,s,d,l,p,h,m,g,v,b,y;return R(this,(function(w){switch(w.label){case 0:return w.trys.push([0,7,,8]),n=void 0,e?(r=void 0,i=void 0,o=void 0,function(t){try{return Qt(t),!0}catch(t){return!1}}(e)?[4,Jt(e)]:[3,2]):[3,5];case 1:return a=w.sent(),s=a.temporaryFileDirectory,d=a.temporaryFilePath,o=s,r=Xt(d),i=Xt(d),[3,3];case 2:r=Xt(e),i=Xt(e),w.label=3;case 3:return[4,this._getMetadata(r)];case 4:return l=w.sent(),v=l.duration,p=l.height,h=l.width,(n=new Ce({api:this._api,formData:new f,options:x(x({},t),{dimensions:{height:p,width:h},duration:v})})).addVideo(i),u(_=o)&&c(_,{recursive:!0}),[3,6];case 5:m=t.backgroundColor,g=t.dimensions,v=t.duration,b=t.metadata,n=new Ce({api:this._api,formData:new f,options:{backgroundColor:m,dimensions:g,duration:v,metadata:b}}),w.label=6;case 6:return[2,n];case 7:return y=w.sent(),console.error(qt(y.message)),[3,8];case 8:return[2,void 0]}var _}))}))},t.prototype[nt.getMetadata]=function(t){return A(this,void 0,void 0,(function(){var e,n;return R(this,(function(r){switch(r.label){case 0:return e=function(t){var e=new f;return t.forEach((function(t){e.append(t[0],t[1])})),e}([[$t(t),t],[it.type,ot.video]]),[4,this._api.post({data:e,isForm:!0,url:N})];case 1:return n=r.sent(),[2,Nt(n,{invalidDataError:St,validate:we})]}}))}))},t}(),ze=function(){function t(t){var e,n=t.clientId,r=t.host,i=void 0===r?"https://api.editframe.com":r,o=t.token,a=t.version,u=void 0===a?2:a;if(!n||!o)throw new Error(kt.clientIdAndTokenRequired);this._api=new _e({clientId:n,fetch:(e=Bt(i,u),Dt(Ht(e))),host:i,token:o,version:u}),this._clientId=n,this._host=i,this._token=o,this._version=u,this.applications=new xe(this._api),this.videos=new Me(this._api)}return Object.defineProperty(t.prototype,"clientId",{get:function(){return this._clientId},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"host",{get:function(){return this._host},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"token",{get:function(){return this._token},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"version",{get:function(){return this._version},enumerable:!1,configurable:!0}),t}(),Le={_1080p:{height:1080,width:1920},_1080pVertical:{height:1920,width:1080},_1080x1080:{height:1080,width:1080},_720p:{height:720,width:1080},_720pVertical:{height:1080,width:720},_720x720:{height:720,width:720}};export{Le as CommonResolutions,ze as Editframe};
//# sourceMappingURL=index.es.js.map
