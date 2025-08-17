import{o as e,_ as t}from"./vendor-0d2b1560.js";const n=function(e){const t=[];let n=0;for(let r=0;r<e.length;r++){let s=e.charCodeAt(r);s<128?t[n++]=s:s<2048?(t[n++]=s>>6|192,t[n++]=63&s|128):55296==(64512&s)&&r+1<e.length&&56320==(64512&e.charCodeAt(r+1))?(s=65536+((1023&s)<<10)+(1023&e.charCodeAt(++r)),t[n++]=s>>18|240,t[n++]=s>>12&63|128,t[n++]=s>>6&63|128,t[n++]=63&s|128):(t[n++]=s>>12|224,t[n++]=s>>6&63|128,t[n++]=63&s|128)}return t},r={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<e.length;s+=3){const t=e[s],i=s+1<e.length,o=i?e[s+1]:0,a=s+2<e.length,c=a?e[s+2]:0,u=t>>2,l=(3&t)<<4|o>>4;let h=(15&o)<<2|c>>6,d=63&c;a||(d=64,i||(h=64)),r.push(n[u],n[l],n[h],n[d])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(n(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):function(e){const t=[];let n=0,r=0;for(;n<e.length;){const s=e[n++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=e[n++];t[r++]=String.fromCharCode((31&s)<<6|63&i)}else if(s>239&&s<365){const i=((7&s)<<18|(63&e[n++])<<12|(63&e[n++])<<6|63&e[n++])-65536;t[r++]=String.fromCharCode(55296+(i>>10)),t[r++]=String.fromCharCode(56320+(1023&i))}else{const i=e[n++],o=e[n++];t[r++]=String.fromCharCode((15&s)<<12|(63&i)<<6|63&o)}}return t.join("")}(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();const n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){const t=n[e.charAt(i++)],o=i<e.length?n[e.charAt(i)]:0;++i;const a=i<e.length?n[e.charAt(i)]:64;++i;const c=i<e.length?n[e.charAt(i)]:64;if(++i,null==t||null==o||null==a||null==c)throw new s;const u=t<<2|o>>4;if(r.push(u),64!==a){const e=o<<4&240|a>>2;if(r.push(e),64!==c){const e=a<<6&192|c;r.push(e)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const i=function(e){return function(e){const t=n(e);return r.encodeByteArray(t,!0)}(e).replace(/\./g,"")},o=function(e){try{return r.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function a(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const c=()=>{try{return a().__FIREBASE_DEFAULTS__||(()=>{if("undefined"==typeof process||void 0===process.env)return;const e={}.__FIREBASE_DEFAULTS__;return e?JSON.parse(e):void 0})()||(()=>{if("undefined"==typeof document)return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(n){return}const t=e&&o(e[1]);return t&&JSON.parse(t)})()}catch(e){return void console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`)}},u=e=>{var t,n;return null===(n=null===(t=c())||void 0===t?void 0:t.emulatorHosts)||void 0===n?void 0:n[e]},l=e=>{const t=u(e);if(!t)return;const n=t.lastIndexOf(":");if(n<=0||n+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(n+1),10);return"["===t[0]?[t.substring(1,n-1),r]:[t.substring(0,n),r]},h=()=>{var e;return null===(e=c())||void 0===e?void 0:e.config},d=e=>{var t;return null===(t=c())||void 0===t?void 0:t[`_${e}`]};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class f{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}wrapCallback(e){return(t,n)=>{t?this.reject(t):this.resolve(n),"function"==typeof e&&(this.promise.catch((()=>{})),1===e.length?e(t):e(t,n))}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p(e,t){if(e.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=t||"demo-project",r=e.iat||0,s=e.sub||e.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:r,exp:r+3600,auth_time:r,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},e);return[i(JSON.stringify({alg:"none",type:"JWT"})),i(JSON.stringify(o)),""].join(".")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function g(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function m(){return!function(){var e;const t=null===(e=c())||void 0===e?void 0:e.forceEnvironment;if("node"===t)return!0;if("browser"===t)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(n){return!1}}()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function y(){try{return"object"==typeof indexedDB}catch(e){return!1}}class v extends Error{constructor(e,t,n){super(t),this.code=e,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,v.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,w.prototype.create)}}class w{constructor(e,t,n){this.service=e,this.serviceName=t,this.errors=n}create(e,...t){const n=t[0]||{},r=`${this.service}/${e}`,s=this.errors[e],i=s?function(e,t){return e.replace(_,((e,n)=>{const r=t[n];return null!=r?String(r):`<${n}?>`}))}(s,n):"Error",o=`${this.serviceName}: ${i} (${r}).`;return new v(r,o,n)}}const _=/\{\$([^}]+)}/g;function b(e,t){if(e===t)return!0;const n=Object.keys(e),r=Object.keys(t);for(const s of n){if(!r.includes(s))return!1;const n=e[s],i=t[s];if(I(n)&&I(i)){if(!b(n,i))return!1}else if(n!==i)return!1}for(const s of r)if(!n.includes(s))return!1;return!0}function I(e){return null!==e&&"object"==typeof e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function T(e){const t=[];for(const[n,r]of Object.entries(e))Array.isArray(r)?r.forEach((e=>{t.push(encodeURIComponent(n)+"="+encodeURIComponent(e))})):t.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function E(e){const t={};return e.replace(/^\?/,"").split("&").forEach((e=>{if(e){const[n,r]=e.split("=");t[decodeURIComponent(n)]=decodeURIComponent(r)}})),t}function S(e){const t=e.indexOf("?");if(!t)return"";const n=e.indexOf("#",t);return e.substring(t,n>0?n:void 0)}class C{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then((()=>{e(this)})).catch((e=>{this.error(e)}))}next(e){this.forEachObserver((t=>{t.next(e)}))}error(e){this.forEachObserver((t=>{t.error(e)})),this.close(e)}complete(){this.forEachObserver((e=>{e.complete()})),this.close()}subscribe(e,t,n){let r;if(void 0===e&&void 0===t&&void 0===n)throw new Error("Missing Observer.");r=function(e,t){if("object"!=typeof e||null===e)return!1;for(const n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])?e:{next:e,error:t,complete:n},void 0===r.next&&(r.next=k),void 0===r.error&&(r.error=k),void 0===r.complete&&(r.complete=k);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then((()=>{try{this.finalError?r.error(this.finalError):r.complete()}catch(e){}})),this.observers.push(r),s}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then((()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(n){"undefined"!=typeof console&&console.error&&console.error(n)}}))}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then((()=>{this.observers=void 0,this.onNoObservers=void 0})))}}function k(){}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function A(e){return e&&e._delegate?e._delegate:e}
/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function N(e){return e.endsWith(".cloudworkstations.dev")}async function R(e){return(await fetch(e,{credentials:"include"})).ok}class x{constructor(e,t,n){this.name=e,this.instanceFactory=t,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class O{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const e=new f;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:t});n&&e.resolve(n)}catch(n){}}return this.instancesDeferred.get(t).promise}getImmediate(e){var t;const n=this.normalizeInstanceIdentifier(null==e?void 0:e.identifier),r=null!==(t=null==e?void 0:e.optional)&&void 0!==t&&t;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(r)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(r)return null;throw s}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if(function(e){return"EAGER"===e.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e))try{this.getOrInitializeService({instanceIdentifier:D})}catch(t){}for(const[e,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(e);try{const e=this.getOrInitializeService({instanceIdentifier:r});n.resolve(e)}catch(t){}}}}clearInstance(e=D){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter((e=>"INTERNAL"in e)).map((e=>e.INTERNAL.delete())),...e.filter((e=>"_delete"in e)).map((e=>e._delete()))])}isComponentSet(){return null!=this.component}isInitialized(e=D){return this.instances.has(e)}getOptions(e=D){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,n=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:t});for(const[s,i]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(s)&&i.resolve(r)}return r}onInit(e,t){var n;const r=this.normalizeInstanceIdentifier(t),s=null!==(n=this.onInitCallbacks.get(r))&&void 0!==n?n:new Set;s.add(e),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const n=this.onInitCallbacks.get(t);if(n)for(const s of n)try{s(e,t)}catch(r){}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let n=this.instances.get(e);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=e,r===D?void 0:r),options:t}),this.instances.set(e,n),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(n,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,n)}catch(s){}var r;return n||null}normalizeInstanceIdentifier(e=D){return this.component?this.component.multipleInstances?e:D:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class P{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new O(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var L,M;(M=L||(L={}))[M.DEBUG=0]="DEBUG",M[M.VERBOSE=1]="VERBOSE",M[M.INFO=2]="INFO",M[M.WARN=3]="WARN",M[M.ERROR=4]="ERROR",M[M.SILENT=5]="SILENT";const U={debug:L.DEBUG,verbose:L.VERBOSE,info:L.INFO,warn:L.WARN,error:L.ERROR,silent:L.SILENT},F=L.INFO,V={[L.DEBUG]:"log",[L.VERBOSE]:"log",[L.INFO]:"info",[L.WARN]:"warn",[L.ERROR]:"error"},B=(e,t,...n)=>{if(t<e.logLevel)return;const r=(new Date).toISOString(),s=V[t];if(!s)throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`);console[s](`[${r}]  ${e.name}:`,...n)};class q{constructor(e){this.name=e,this._logLevel=F,this._logHandler=B,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in L))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?U[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,L.DEBUG,...e),this._logHandler(this,L.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,L.VERBOSE,...e),this._logHandler(this,L.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,L.INFO,...e),this._logHandler(this,L.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,L.WARN,...e),this._logHandler(this,L.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,L.ERROR,...e),this._logHandler(this,L.ERROR,...e)}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map((e=>{if(function(e){const t=e.getComponent();return"VERSION"===(null==t?void 0:t.type)}(e)){const t=e.getImmediate();return`${t.library}/${t.version}`}return null})).filter((e=>e)).join(" ")}}const j="@firebase/app",$="0.12.1",G=new q("@firebase/app"),K="@firebase/app-compat",H="@firebase/analytics-compat",W="@firebase/analytics",Q="@firebase/app-check-compat",J="@firebase/app-check",Y="@firebase/auth",X="@firebase/auth-compat",Z="@firebase/database",ee="@firebase/data-connect",te="@firebase/database-compat",ne="@firebase/functions",re="@firebase/functions-compat",se="@firebase/installations",ie="@firebase/installations-compat",oe="@firebase/messaging",ae="@firebase/messaging-compat",ce="@firebase/performance",ue="@firebase/performance-compat",le="@firebase/remote-config",he="@firebase/remote-config-compat",de="@firebase/storage",fe="@firebase/storage-compat",pe="@firebase/firestore",ge="@firebase/vertexai",me="@firebase/firestore-compat",ye="firebase",ve="[DEFAULT]",we={[j]:"fire-core",[K]:"fire-core-compat",[W]:"fire-analytics",[H]:"fire-analytics-compat",[J]:"fire-app-check",[Q]:"fire-app-check-compat",[Y]:"fire-auth",[X]:"fire-auth-compat",[Z]:"fire-rtdb",[ee]:"fire-data-connect",[te]:"fire-rtdb-compat",[ne]:"fire-fn",[re]:"fire-fn-compat",[se]:"fire-iid",[ie]:"fire-iid-compat",[oe]:"fire-fcm",[ae]:"fire-fcm-compat",[ce]:"fire-perf",[ue]:"fire-perf-compat",[le]:"fire-rc",[he]:"fire-rc-compat",[de]:"fire-gcs",[fe]:"fire-gcs-compat",[pe]:"fire-fst",[me]:"fire-fst-compat",[ge]:"fire-vertex","fire-js":"fire-js",[ye]:"fire-js-all"},_e=new Map,be=new Map,Ie=new Map;function Te(e,t){try{e.container.addComponent(t)}catch(n){G.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function Ee(e){const t=e.name;if(Ie.has(t))return G.debug(`There were multiple attempts to register component ${t}.`),!1;Ie.set(t,e);for(const n of _e.values())Te(n,e);for(const n of be.values())Te(n,e);return!0}function Se(e,t){const n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}function Ce(e){return null!=e&&void 0!==e.settings}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ke=new w("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ae{constructor(e,t,n){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},t),this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new x("app",(()=>this),"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw ke.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ne="11.7.1";function Re(e,t={}){let n=e;if("object"!=typeof t){t={name:t}}const r=Object.assign({name:ve,automaticDataCollectionEnabled:!1},t),s=r.name;if("string"!=typeof s||!s)throw ke.create("bad-app-name",{appName:String(s)});if(n||(n=h()),!n)throw ke.create("no-options");const i=_e.get(s);if(i){if(b(n,i.options)&&b(r,i.config))return i;throw ke.create("duplicate-app",{appName:s})}const o=new P(s);for(const c of Ie.values())o.addComponent(c);const a=new Ae(n,r,o);return _e.set(s,a),a}function xe(e=ve){const t=_e.get(e);if(!t&&e===ve&&h())return Re();if(!t)throw ke.create("no-app",{appName:e});return t}function De(e,t,n){var r;let s=null!==(r=we[e])&&void 0!==r?r:e;n&&(s+=`-${n}`);const i=s.match(/\s|\//),o=t.match(/\s|\//);if(i||o){const e=[`Unable to register library "${s}" with version "${t}":`];return i&&e.push(`library name "${s}" contains illegal characters (whitespace or "/")`),i&&o&&e.push("and"),o&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),void G.warn(e.join(" "))}Ee(new x(`${s}-version`,(()=>({library:s,version:t})),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oe="firebase-heartbeat-store";let Pe=null;function Le(){return Pe||(Pe=e("firebase-heartbeat-database",1,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(Oe)}catch(n){console.warn(n)}}}).catch((e=>{throw ke.create("idb-open",{originalErrorMessage:e.message})}))),Pe}async function Me(e,t){try{const n=(await Le()).transaction(Oe,"readwrite"),r=n.objectStore(Oe);await r.put(t,Ue(e)),await n.done}catch(n){if(n instanceof v)G.warn(n.message);else{const e=ke.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});G.warn(e.message)}}}function Ue(e){return`${e.name}!${e.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new Be(t),this._heartbeatsCachePromise=this._storage.read().then((e=>(this._heartbeatsCache=e,e)))}async triggerHeartbeat(){var e,t;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Ve();if(null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some((e=>e.date===r)))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>30){const e=function(e){if(0===e.length)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(n){G.warn(n)}}async getHeartbeatsHeader(){var e;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const t=Ve(),{heartbeatsToSend:n,unsentEntries:r}=function(e,t=1024){const n=[];let r=e.slice();for(const s of e){const e=n.find((e=>e.agent===s.agent));if(e){if(e.dates.push(s.date),qe(n)>t){e.dates.pop();break}}else if(n.push({agent:s.agent,dates:[s.date]}),qe(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),s=i(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(t){return G.warn(t),""}}}function Ve(){return(new Date).toISOString().substring(0,10)}class Be{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!y()&&new Promise(((e,t)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},s.onupgradeneeded=()=>{n=!1},s.onerror=()=>{var e;t((null===(e=s.error)||void 0===e?void 0:e.message)||"")}}catch(n){t(n)}})).then((()=>!0)).catch((()=>!1))}async read(){if(await this._canUseIndexedDBPromise){const e=await async function(e){try{const t=(await Le()).transaction(Oe),n=await t.objectStore(Oe).get(Ue(e));return await t.done,n}catch(t){if(t instanceof v)G.warn(t.message);else{const e=ke.create("idb-get",{originalErrorMessage:null==t?void 0:t.message});G.warn(e.message)}}}(this.app);return(null==e?void 0:e.heartbeats)?e:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return Me(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){var t;if(await this._canUseIndexedDBPromise){const n=await this.read();return Me(this.app,{lastSentHeartbeatDate:null!==(t=e.lastSentHeartbeatDate)&&void 0!==t?t:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}}}function qe(e){return i(JSON.stringify({version:2,heartbeats:e})).length}var ze;function je(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}ze="",Ee(new x("platform-logger",(e=>new z(e)),"PRIVATE")),Ee(new x("heartbeat",(e=>new Fe(e)),"PRIVATE")),De(j,$,ze),De(j,$,"esm2017"),De("fire-js","");const $e=je,Ge=new w("auth","Firebase",{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}),Ke=new q("@firebase/auth");function He(e,...t){Ke.logLevel<=L.ERROR&&Ke.error(`Auth (${Ne}): ${e}`,...t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function We(e,...t){throw Xe(e,...t)}function Qe(e,...t){return Xe(e,...t)}function Je(e,t,n){const r=Object.assign(Object.assign({},$e()),{[t]:n});return new w("auth","Firebase",r).create(t,{appName:e.name})}function Ye(e){return Je(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function Xe(e,...t){if("string"!=typeof e){const n=t[0],r=[...t.slice(1)];return r[0]&&(r[0].appName=e.name),e._errorFactory.create(n,...r)}return Ge.create(e,...t)}function Ze(e,t,...n){if(!e)throw Xe(t,...n)}function et(e){const t="INTERNAL ASSERTION FAILED: "+e;throw He(t),new Error(t)}function tt(e,t){e||et(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nt(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.href)||""}function rt(){var e;return"undefined"!=typeof self&&(null===(e=self.location)||void 0===e?void 0:e.protocol)||null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(){return"undefined"==typeof navigator||!navigator||!("onLine"in navigator)||"boolean"!=typeof navigator.onLine||"http:"!==rt()&&"https:"!==rt()&&!function(){const e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()&&!("connection"in navigator)||navigator.onLine}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class it{constructor(e,t){this.shortDelay=e,this.longDelay=t,tt(t>e,"Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(g())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return st()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ot(e,t){tt(e.emulator,"Emulator should always be set here");const{url:n}=e.emulator;return t?`${n}${t.startsWith("/")?t.slice(1):t}`:n}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class at{static initialize(e,t,n){this.fetchImpl=e,t&&(this.headersImpl=t),n&&(this.responseImpl=n)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void et("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void et("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void et("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ct={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},ut=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],lt=new it(3e4,6e4);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ht(e,t){return e.tenantId&&!t.tenantId?Object.assign(Object.assign({},t),{tenantId:e.tenantId}):t}async function dt(e,t,n,r,s={}){return ft(e,s,(async()=>{let s={},i={};r&&("GET"===t?i=r:s={body:JSON.stringify(r)});const o=T(Object.assign({key:e.config.apiKey},i)).slice(1),a=await e._getAdditionalHeaders();a["Content-Type"]="application/json",e.languageCode&&(a["X-Firebase-Locale"]=e.languageCode);const c=Object.assign({method:t,headers:a},s);return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(c.referrerPolicy="no-referrer"),e.emulatorConfig&&N(e.emulatorConfig.host)&&(c.credentials="include"),at.fetch()(await gt(e,e.config.apiHost,n,o),c)}))}async function ft(e,t,n){e._canInitEmulator=!1;const r=Object.assign(Object.assign({},ct),t);try{const t=new yt(e),s=await Promise.race([n(),t.promise]);t.clearNetworkTimeout();const i=await s.json();if("needConfirmation"in i)throw vt(e,"account-exists-with-different-credential",i);if(s.ok&&!("errorMessage"in i))return i;{const t=s.ok?i.errorMessage:i.error.message,[n,o]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===n)throw vt(e,"credential-already-in-use",i);if("EMAIL_EXISTS"===n)throw vt(e,"email-already-in-use",i);if("USER_DISABLED"===n)throw vt(e,"user-disabled",i);const a=r[n]||n.toLowerCase().replace(/[_\s]+/g,"-");if(o)throw Je(e,a,o);We(e,a)}}catch(s){if(s instanceof v)throw s;We(e,"network-request-failed",{message:String(s)})}}async function pt(e,t,n,r,s={}){const i=await dt(e,t,n,r,s);return"mfaPendingCredential"in i&&We(e,"multi-factor-auth-required",{_serverResponse:i}),i}async function gt(e,t,n,r){const s=`${t}${n}?${r}`,i=e,o=i.config.emulator?ot(e.config,s):`${e.config.apiScheme}://${s}`;if(ut.includes(n)&&(await i._persistenceManagerAvailable,"COOKIE"===i._getPersistenceType())){return i._getPersistence()._getFinalTarget(o).toString()}return o}function mt(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class yt{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise(((e,t)=>{this.timer=setTimeout((()=>t(Qe(this.auth,"network-request-failed"))),lt.get())}))}}function vt(e,t,n){const r={appName:e.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const s=Qe(e,t,r);return s.customData._tokenResponse=n,s}function wt(e){return void 0!==e&&void 0!==e.enterprise}class _t{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return mt(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function bt(e,t){return dt(e,"POST","/v1/accounts:lookup",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function It(e){if(e)try{const t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(t){}}function Tt(e){return 1e3*Number(e)}function Et(e){const[t,n,r]=e.split(".");if(void 0===t||void 0===n||void 0===r)return He("JWT malformed, contained fewer than 3 sections"),null;try{const e=o(n);return e?JSON.parse(e):(He("Failed to decode base64 JWT payload"),null)}catch(s){return He("Caught error parsing JWT payload as JSON",null==s?void 0:s.toString()),null}}function St(e){const t=Et(e);return Ze(t,"internal-error"),Ze(void 0!==t.exp,"internal-error"),Ze(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ct(e,t,n=!1){if(n)return t;try{return await t}catch(r){throw r instanceof v&&function({code:e}){return"auth/user-disabled"===e||"auth/user-token-expired"===e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(r)&&e.auth.currentUser===e&&await e.auth.signOut(),r}}class kt{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){var t;if(e){const e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;const e=(null!==(t=this.user.stsTokenManager.expirationTime)&&void 0!==t?t:0)-Date.now()-3e5;return Math.max(0,e)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout((async()=>{await this.iteration()}),t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){return void("auth/network-request-failed"===(null==e?void 0:e.code)&&this.schedule(!0))}this.schedule()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=It(this.lastLoginAt),this.creationTime=It(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Nt(e){var t;const n=e.auth,r=await e.getIdToken(),s=await Ct(e,bt(n,{idToken:r}));Ze(null==s?void 0:s.users.length,n,"internal-error");const i=s.users[0];e._notifyReloadListener(i);const o=(null===(t=i.providerUserInfo)||void 0===t?void 0:t.length)?Rt(i.providerUserInfo):[],a=(c=e.providerData,u=o,[...c.filter((e=>!u.some((t=>t.providerId===e.providerId)))),...u]);var c,u;const l=e.isAnonymous,h=!(e.email&&i.passwordHash||(null==a?void 0:a.length)),d=!!l&&h,f={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:a,metadata:new At(i.createdAt,i.lastLoginAt),isAnonymous:d};Object.assign(e,f)}function Rt(e){return e.map((e=>{var{providerId:n}=e,r=t(e,["providerId"]);return{providerId:n,uid:r.rawId||"",displayName:r.displayName||null,email:r.email||null,phoneNumber:r.phoneNumber||null,photoURL:r.photoUrl||null}}))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class xt{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){Ze(e.idToken,"internal-error"),Ze(void 0!==e.idToken,"internal-error"),Ze(void 0!==e.refreshToken,"internal-error");const t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):St(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){Ze(0!==e.length,"internal-error");const t=St(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(Ze(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null):this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:n,refreshToken:r,expiresIn:s}=await async function(e,t){const n=await ft(e,{},(async()=>{const n=T({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:r,apiKey:s}=e.config,i=await gt(e,r,"/v1/token",`key=${s}`),o=await e._getAdditionalHeaders();return o["Content-Type"]="application/x-www-form-urlencoded",at.fetch()(i,{method:"POST",headers:o,body:n})}));return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}(e,t);this.updateTokensAndExpiration(n,r,Number(s))}updateTokensAndExpiration(e,t,n){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*n}static fromJSON(e,t){const{refreshToken:n,accessToken:r,expirationTime:s}=t,i=new xt;return n&&(Ze("string"==typeof n,"internal-error",{appName:e}),i.refreshToken=n),r&&(Ze("string"==typeof r,"internal-error",{appName:e}),i.accessToken=r),s&&(Ze("number"==typeof s,"internal-error",{appName:e}),i.expirationTime=s),i}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new xt,this.toJSON())}_performRefresh(){return et("not implemented")}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dt(e,t){Ze("string"==typeof e||void 0===e,"internal-error",{appName:t})}class Ot{constructor(e){var{uid:n,auth:r,stsTokenManager:s}=e,i=t(e,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new kt(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=n,this.auth=r,this.stsTokenManager=s,this.accessToken=s.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new At(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const t=await Ct(this,this.stsTokenManager.getToken(this.auth,e));return Ze(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return async function(e,t=!1){const n=A(e),r=await n.getIdToken(t),s=Et(r);Ze(s&&s.exp&&s.auth_time&&s.iat,n.auth,"internal-error");const i="object"==typeof s.firebase?s.firebase:void 0,o=null==i?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:It(Tt(s.auth_time)),issuedAtTime:It(Tt(s.iat)),expirationTime:It(Tt(s.exp)),signInProvider:o||null,signInSecondFactor:(null==i?void 0:i.sign_in_second_factor)||null}}(this,e)}reload(){return async function(e){const t=A(e);await Nt(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}(this)}_assign(e){this!==e&&(Ze(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map((e=>Object.assign({},e))),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Ot(Object.assign(Object.assign({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return t.metadata._copy(this.metadata),t}_onReload(e){Ze(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let n=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),n=!0),t&&await Nt(this),await this.auth._persistUserIfCurrent(this),n&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(Ce(this.auth.app))return Promise.reject(Ye(this.auth));const e=await this.getIdToken();return await Ct(this,
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t){return dt(e,"POST","/v1/accounts:delete",t)}(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Object.assign(Object.assign({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map((e=>Object.assign({},e))),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){var n,r,s,i,o,a,c,u;const l=null!==(n=t.displayName)&&void 0!==n?n:void 0,h=null!==(r=t.email)&&void 0!==r?r:void 0,d=null!==(s=t.phoneNumber)&&void 0!==s?s:void 0,f=null!==(i=t.photoURL)&&void 0!==i?i:void 0,p=null!==(o=t.tenantId)&&void 0!==o?o:void 0,g=null!==(a=t._redirectEventId)&&void 0!==a?a:void 0,m=null!==(c=t.createdAt)&&void 0!==c?c:void 0,y=null!==(u=t.lastLoginAt)&&void 0!==u?u:void 0,{uid:v,emailVerified:w,isAnonymous:_,providerData:b,stsTokenManager:I}=t;Ze(v&&I,e,"internal-error");const T=xt.fromJSON(this.name,I);Ze("string"==typeof v,e,"internal-error"),Dt(l,e.name),Dt(h,e.name),Ze("boolean"==typeof w,e,"internal-error"),Ze("boolean"==typeof _,e,"internal-error"),Dt(d,e.name),Dt(f,e.name),Dt(p,e.name),Dt(g,e.name),Dt(m,e.name),Dt(y,e.name);const E=new Ot({uid:v,auth:e,email:h,emailVerified:w,displayName:l,isAnonymous:_,photoURL:f,phoneNumber:d,tenantId:p,stsTokenManager:T,createdAt:m,lastLoginAt:y});return b&&Array.isArray(b)&&(E.providerData=b.map((e=>Object.assign({},e)))),g&&(E._redirectEventId=g),E}static async _fromIdTokenResponse(e,t,n=!1){const r=new xt;r.updateFromServerResponse(t);const s=new Ot({uid:t.localId,auth:e,stsTokenManager:r,isAnonymous:n});return await Nt(s),s}static async _fromGetAccountInfoResponse(e,t,n){const r=t.users[0];Ze(void 0!==r.localId,"internal-error");const s=void 0!==r.providerUserInfo?Rt(r.providerUserInfo):[],i=!(r.email&&r.passwordHash||(null==s?void 0:s.length)),o=new xt;o.updateFromIdToken(n);const a=new Ot({uid:r.localId,auth:e,stsTokenManager:o,isAnonymous:i}),c={uid:r.localId,displayName:r.displayName||null,photoURL:r.photoUrl||null,email:r.email||null,emailVerified:r.emailVerified||!1,phoneNumber:r.phoneNumber||null,tenantId:r.tenantId||null,providerData:s,metadata:new At(r.createdAt,r.lastLoginAt),isAnonymous:!(r.email&&r.passwordHash||(null==s?void 0:s.length))};return Object.assign(a,c),a}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pt=new Map;function Lt(e){tt(e instanceof Function,"Expected a class definition");let t=Pt.get(e);return t?(tt(t instanceof e,"Instance stored in cache mismatched with class"),t):(t=new e,Pt.set(e,t),t)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Mt.type="NONE";const Ut=Mt;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(e,t,n){return`firebase:${e}:${t}:${n}`}class Vt{constructor(e,t,n){this.persistence=e,this.auth=t,this.userKey=n;const{config:r,name:s}=this.auth;this.fullUserKey=Ft(this.userKey,r.apiKey,s),this.fullPersistenceKey=Ft("persistence",r.apiKey,s),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if("string"==typeof e){const t=await bt(this.auth,{idToken:e}).catch((()=>{}));return t?Ot._fromGetAccountInfoResponse(this.auth,t,e):null}return Ot._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();return await this.removeCurrentUser(),this.persistence=e,t?this.setCurrentUser(t):void 0}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,n="authUser"){if(!t.length)return new Vt(Lt(Ut),e,n);const r=(await Promise.all(t.map((async e=>{if(await e._isAvailable())return e})))).filter((e=>e));let s=r[0]||Lt(Ut);const i=Ft(n,e.config.apiKey,e.name);let o=null;for(const u of t)try{const t=await u._get(i);if(t){let n;if("string"==typeof t){const r=await bt(e,{idToken:t}).catch((()=>{}));if(!r)break;n=await Ot._fromGetAccountInfoResponse(e,r,t)}else n=Ot._fromJSON(e,t);u!==s&&(o=n),s=u;break}}catch(c){}const a=r.filter((e=>e._shouldAllowMigration));return s._shouldAllowMigration&&a.length?(s=a[0],o&&await s._set(i,o.toJSON()),await Promise.all(t.map((async e=>{if(e!==s)try{await e._remove(i)}catch(c){}}))),new Vt(s,e,n)):new Vt(s,e,n)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Bt(e){const t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if($t(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";if(t.includes("edge/"))return"Edge";if(qt(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(Kt(t))return"Blackberry";if(Ht(t))return"Webos";if(zt(t))return"Safari";if((t.includes("chrome/")||jt(t))&&!t.includes("edge/"))return"Chrome";if(Gt(t))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,n=e.match(t);if(2===(null==n?void 0:n.length))return n[1]}return"Other"}function qt(e=g()){return/firefox\//i.test(e)}function zt(e=g()){const t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function jt(e=g()){return/crios\//i.test(e)}function $t(e=g()){return/iemobile/i.test(e)}function Gt(e=g()){return/android/i.test(e)}function Kt(e=g()){return/blackberry/i.test(e)}function Ht(e=g()){return/webos/i.test(e)}function Wt(e=g()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function Qt(){return function(){const e=g();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0}()&&10===document.documentMode}function Jt(e=g()){return Wt(e)||Gt(e)||Ht(e)||Kt(e)||/windows phone/i.test(e)||$t(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yt(e,t=[]){let n;switch(e){case"Browser":n=Bt(g());break;case"Worker":n=`${Bt(g())}-${e}`;break;default:n=e}const r=t.length?t.join(","):"FirebaseCore-web";return`${n}/JsCore/${Ne}/${r}`}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xt{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const n=t=>new Promise(((n,r)=>{try{n(e(t))}catch(s){r(s)}}));n.onAbort=t,this.queue.push(n);const r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const n of this.queue)await n(e),n.onAbort&&t.push(n.onAbort)}catch(n){t.reverse();for(const e of t)try{e()}catch(r){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:null==n?void 0:n.message})}}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zt{constructor(e){var t,n,r,s;const i=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=null!==(t=i.minPasswordLength)&&void 0!==t?t:6,i.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=i.maxPasswordLength),void 0!==i.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=i.containsLowercaseCharacter),void 0!==i.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=i.containsUppercaseCharacter),void 0!==i.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=i.containsNumericCharacter),void 0!==i.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=i.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=null!==(r=null===(n=e.allowedNonAlphanumericCharacters)||void 0===n?void 0:n.join(""))&&void 0!==r?r:"",this.forceUpgradeOnSignin=null!==(s=e.forceUpgradeOnSignin)&&void 0!==s&&s,this.schemaVersion=e.schemaVersion}validatePassword(e){var t,n,r,s,i,o;const a={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,a),this.validatePasswordCharacterOptions(e,a),a.isValid&&(a.isValid=null===(t=a.meetsMinPasswordLength)||void 0===t||t),a.isValid&&(a.isValid=null===(n=a.meetsMaxPasswordLength)||void 0===n||n),a.isValid&&(a.isValid=null===(r=a.containsLowercaseLetter)||void 0===r||r),a.isValid&&(a.isValid=null===(s=a.containsUppercaseLetter)||void 0===s||s),a.isValid&&(a.isValid=null===(i=a.containsNumericCharacter)||void 0===i||i),a.isValid&&(a.isValid=null===(o=a.containsNonAlphanumericCharacter)||void 0===o||o),a}validatePasswordLengthOptions(e,t){const n=this.customStrengthOptions.minPasswordLength,r=this.customStrengthOptions.maxPasswordLength;n&&(t.meetsMinPasswordLength=e.length>=n),r&&(t.meetsMaxPasswordLength=e.length<=r)}validatePasswordCharacterOptions(e,t){let n;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let r=0;r<e.length;r++)n=e.charAt(r),this.updatePasswordCharacterOptionsStatuses(t,n>="a"&&n<="z",n>="A"&&n<="Z",n>="0"&&n<="9",this.allowedNonAlphanumericCharacters.includes(n))}updatePasswordCharacterOptionsStatuses(e,t,n,r,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=n)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=r)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class en{constructor(e,t,n,r){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=n,this.config=r,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new nn(this),this.idTokenSubscription=new nn(this),this.beforeStateQueue=new Xt(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=Ge,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=r.sdkClientVersion,this._persistenceManagerAvailable=new Promise((e=>this._resolvePersistenceManagerAvailable=e))}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Lt(t)),this._initializationPromise=this.queue((async()=>{var n,r,s;if(!this._deleted&&(this.persistenceManager=await Vt.create(this,e),null===(n=this._resolvePersistenceManagerAvailable)||void 0===n||n.call(this),!this._deleted)){if(null===(r=this._popupRedirectResolver)||void 0===r?void 0:r._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(i){}await this.initializeCurrentUser(t),this.lastNotifiedUid=(null===(s=this.currentUser)||void 0===s?void 0:s.uid)||null,this._deleted||(this._isInitialized=!0)}})),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();return this.currentUser||e?this.currentUser&&e&&this.currentUser.uid===e.uid?(this._currentUser._assign(e),void(await this.currentUser.getIdToken())):void(await this._updateCurrentUser(e,!0)):void 0}async initializeCurrentUserFromIdToken(e){try{const t=await bt(this,{idToken:e}),n=await Ot._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(n)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var t;if(Ce(this.app)){const e=this.app.settings.authIdToken;return e?new Promise((t=>{setTimeout((()=>this.initializeCurrentUserFromIdToken(e).then(t,t)))})):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const n=null===(t=this.redirectUser)||void 0===t?void 0:t._redirectEventId,i=null==r?void 0:r._redirectEventId,o=await this.tryRedirectSignIn(e);n&&n!==i||!(null==o?void 0:o.user)||(r=o.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(i){r=n,this._popupRedirectResolver._overrideRedirectResult(this,(()=>Promise.reject(i)))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return Ze(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(n){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Nt(e)}catch(t){if("auth/network-request-failed"!==(null==t?void 0:t.code))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;const e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(Ce(this.app))return Promise.reject(Ye(this));const t=e?A(e):null;return t&&Ze(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&Ze(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue((async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()}))}async signOut(){return Ce(this.app)?Promise.reject(Ye(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return Ce(this.app)?Promise.reject(Ye(this)):this.queue((async()=>{await this.assertedPersistence.setPersistence(Lt(e))}))}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await async function(e,t={}){return dt(e,"GET","/v2/passwordPolicy",ht(e,t))}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(this),t=new Zt(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new w("auth","Firebase",e())}onAuthStateChanged(e,t,n){return this.registerStateListener(this.authStateSubscription,e,t,n)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,n){return this.registerStateListener(this.idTokenSubscription,e,t,n)}authStateReady(){return new Promise(((e,t)=>{if(this.currentUser)e();else{const n=this.onAuthStateChanged((()=>{n(),e()}),t)}}))}async revokeAccessToken(e){if(this.currentUser){const t={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:await this.currentUser.getIdToken()};null!=this.tenantId&&(t.tenantId=this.tenantId),await async function(e,t){return dt(e,"POST","/v2/accounts:revokeToken",ht(e,t))}(this,t)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:null===(e=this._currentUser)||void 0===e?void 0:e.toJSON()}}async _setRedirectUser(e,t){const n=await this.getOrInitRedirectPersistenceManager(t);return null===e?n.removeCurrentUser():n.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Lt(e)||this._popupRedirectResolver;Ze(t,this,"argument-error"),this.redirectPersistenceManager=await Vt.create(this,[Lt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,n;return this._isInitialized&&await this.queue((async()=>{})),(null===(t=this._currentUser)||void 0===t?void 0:t._redirectEventId)===e?this._currentUser:(null===(n=this.redirectUser)||void 0===n?void 0:n._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue((async()=>this.directlySetCurrentUser(e)))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var e,t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const n=null!==(t=null===(e=this.currentUser)||void 0===e?void 0:e.uid)&&void 0!==t?t:null;this.lastNotifiedUid!==n&&(this.lastNotifiedUid=n,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,n,r){if(this._deleted)return()=>{};const s="function"==typeof t?t:t.next.bind(t);let i=!1;const o=this._isInitialized?Promise.resolve():this._initializationPromise;if(Ze(o,this,"internal-error"),o.then((()=>{i||s(this.currentUser)})),"function"==typeof t){const s=e.addObserver(t,n,r);return()=>{i=!0,s()}}{const n=e.addObserver(t);return()=>{i=!0,n()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return Ze(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){e&&!this.frameworks.includes(e)&&(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Yt(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var e;const t={"X-Client-Version":this.clientVersion};this.app.options.appId&&(t["X-Firebase-gmpid"]=this.app.options.appId);const n=await(null===(e=this.heartbeatServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getHeartbeatsHeader());n&&(t["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(t["X-Firebase-AppCheck"]=r),t}async _getAppCheckToken(){var e;if(Ce(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const t=await(null===(e=this.appCheckServiceProvider.getImmediate({optional:!0}))||void 0===e?void 0:e.getToken());return(null==t?void 0:t.error)&&function(e,...t){Ke.logLevel<=L.WARN&&Ke.warn(`Auth (${Ne}): ${e}`,...t)}(`Error while retrieving App Check token: ${t.error}`),null==t?void 0:t.token}}function tn(e){return A(e)}class nn{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){const n=new C(e,t);return n.subscribe.bind(n)}((e=>this.observer=e))}get next(){return Ze(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rn={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function sn(e){return rn.loadJS(e)}class on{constructor(){this.enterprise=new an}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class an{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}const cn="NO_RECAPTCHA";class un{constructor(e){this.type="recaptcha-enterprise",this.auth=tn(e)}async verify(e="verify",t=!1){async function n(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise((async(t,n)=>{(async function(e,t){return dt(e,"GET","/v2/recaptchaConfig",ht(e,t))})(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then((r=>{if(void 0!==r.recaptchaKey){const n=new _t(r);return null==e.tenantId?e._agentRecaptchaConfig=n:e._tenantRecaptchaConfigs[e.tenantId]=n,t(n.siteKey)}n(new Error("recaptcha Enterprise site key undefined"))})).catch((e=>{n(e)}))}))}function r(t,n,r){const s=window.grecaptcha;wt(s)?s.enterprise.ready((()=>{s.enterprise.execute(t,{action:e}).then((e=>{n(e)})).catch((()=>{n(cn)}))})):r(Error("No reCAPTCHA enterprise script loaded."))}if(this.auth.settings.appVerificationDisabledForTesting){return(new on).execute("siteKey",{action:"verify"})}return new Promise(((e,s)=>{n(this.auth).then((n=>{if(!t&&wt(window.grecaptcha))r(n,e,s);else{if("undefined"==typeof window)return void s(new Error("RecaptchaVerifier is only supported in browser"));let t=rn.recaptchaEnterpriseScript;0!==t.length&&(t+=n),sn(t).then((()=>{r(n,e,s)})).catch((e=>{s(e)}))}})).catch((e=>{s(e)}))}))}}async function ln(e,t,n,r=!1,s=!1){const i=new un(e);let o;if(s)o=cn;else try{o=await i.verify(n)}catch(c){o=await i.verify(n,!0)}const a=Object.assign({},t);if("mfaSmsEnrollment"===n||"mfaSmsSignIn"===n){if("phoneEnrollmentInfo"in a){const e=a.phoneEnrollmentInfo.phoneNumber,t=a.phoneEnrollmentInfo.recaptchaToken;Object.assign(a,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:t,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in a){const e=a.phoneSignInInfo.recaptchaToken;Object.assign(a,{phoneSignInInfo:{recaptchaToken:e,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return a}return r?Object.assign(a,{captchaResp:o}):Object.assign(a,{captchaResponse:o}),Object.assign(a,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(a,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),a}async function hn(e,t,n,r,s){var i,o;if("EMAIL_PASSWORD_PROVIDER"===s){if(null===(i=e._getRecaptchaConfig())||void 0===i?void 0:i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const s=await ln(e,t,n,"getOobCode"===n);return r(e,s)}return r(e,t).catch((async s=>{if("auth/missing-recaptcha-token"===s.code){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const s=await ln(e,t,n,"getOobCode"===n);return r(e,s)}return Promise.reject(s)}))}if("PHONE_PROVIDER"===s){if(null===(o=e._getRecaptchaConfig())||void 0===o?void 0:o.isProviderEnabled("PHONE_PROVIDER")){const s=await ln(e,t,n);return r(e,s).catch((async s=>{var i;if("AUDIT"===(null===(i=e._getRecaptchaConfig())||void 0===i?void 0:i.getProviderEnforcementState("PHONE_PROVIDER"))&&("auth/missing-recaptcha-token"===s.code||"auth/invalid-app-credential"===s.code)){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${n} flow.`);const s=await ln(e,t,n,!1,!0);return r(e,s)}return Promise.reject(s)}))}{const s=await ln(e,t,n,!1,!0);return r(e,s)}}return Promise.reject(s+" provider is not supported.")}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dn(e,t,n){const r=tn(e);Ze(/^https?:\/\//.test(t),r,"invalid-emulator-scheme");const s=!!(null==n?void 0:n.disableWarnings),i=fn(t),{host:o,port:a}=function(e){const t=fn(e),n=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const e=s[1];return{host:e,port:pn(r.substr(e.length+1))}}{const[e,t]=r.split(":");return{host:e,port:pn(t)}}}(t),c=null===a?"":`:${a}`,u={url:`${i}//${o}${c}/`},l=Object.freeze({host:o,port:a,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator)return Ze(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),void Ze(b(u,r.config.emulator)&&b(l,r.emulatorConfig),r,"emulator-config-failed");r.config.emulator=u,r.emulatorConfig=l,r.settings.appVerificationDisabledForTesting=!0,s||function(){function e(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials.");"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",e):e())}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(),N(o)&&R(`${i}//${o}${c}`)}function fn(e){const t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function pn(e){if(!e)return null;const t=Number(e);return isNaN(t)?null:t}class gn{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return et("not implemented")}_getIdTokenResponse(e){return et("not implemented")}_linkToIdToken(e,t){return et("not implemented")}_getReauthenticationResolver(e){return et("not implemented")}}async function mn(e,t){return dt(e,"POST","/v1/accounts:signUp",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yn(e,t){return pt(e,"POST","/v1/accounts:signInWithPassword",ht(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class vn extends gn{constructor(e,t,n,r=null){super("password",n),this._email=e,this._password=t,this._tenantId=r}static _fromEmailAndPassword(e,t){return new vn(e,t,"password")}static _fromEmailAndCode(e,t,n=null){return new vn(e,t,"emailLink",n)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t="string"==typeof e?JSON.parse(e):e;if((null==t?void 0:t.email)&&(null==t?void 0:t.password)){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":return hn(e,{returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signInWithPassword",yn,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return async function(e,t){return pt(e,"POST","/v1/accounts:signInWithEmailLink",ht(e,t))}(e,{email:this._email,oobCode:this._password});default:We(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":return hn(e,{idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",mn,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return async function(e,t){return pt(e,"POST","/v1/accounts:signInWithEmailLink",ht(e,t))}(e,{idToken:t,email:this._email,oobCode:this._password});default:We(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function wn(e,t){return pt(e,"POST","/v1/accounts:signInWithIdp",ht(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _n extends gn{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new _n(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):We("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const n="string"==typeof e?JSON.parse(e):e,{providerId:r,signInMethod:s}=n,i=t(n,["providerId","signInMethod"]);if(!r||!s)return null;const o=new _n(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){return wn(e,this.buildRequest())}_linkToIdToken(e,t){const n=this.buildRequest();return n.idToken=t,wn(e,n)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,wn(e,t)}buildRequest(){const e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=T(t)}return e}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn{constructor(e){var t,n,r,s,i,o;const a=E(S(e)),c=null!==(t=a.apiKey)&&void 0!==t?t:null,u=null!==(n=a.oobCode)&&void 0!==n?n:null,l=function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(null!==(r=a.mode)&&void 0!==r?r:null);Ze(c&&u&&l,"argument-error"),this.apiKey=c,this.operation=l,this.code=u,this.continueUrl=null!==(s=a.continueUrl)&&void 0!==s?s:null,this.languageCode=null!==(i=a.lang)&&void 0!==i?i:null,this.tenantId=null!==(o=a.tenantId)&&void 0!==o?o:null}static parseLink(e){const t=function(e){const t=E(S(e)).link,n=t?E(S(t)).deep_link_id:null,r=E(S(e)).deep_link_id;return(r?E(S(r)).link:null)||r||n||t||e}(e);try{return new bn(t)}catch(n){return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class In{constructor(){this.providerId=In.PROVIDER_ID}static credential(e,t){return vn._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const n=bn.parseLink(t);return Ze(n,"argument-error"),vn._fromEmailAndCode(e,n.code,n.tenantId)}}In.PROVIDER_ID="password",In.EMAIL_PASSWORD_SIGN_IN_METHOD="password",In.EMAIL_LINK_SIGN_IN_METHOD="emailLink";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Tn{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class En extends Tn{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn extends En{constructor(){super("facebook.com")}static credential(e){return _n._fromParams({providerId:Sn.PROVIDER_ID,signInMethod:Sn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Sn.credentialFromTaggedObject(e)}static credentialFromError(e){return Sn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return Sn.credential(e.oauthAccessToken)}catch(t){return null}}}Sn.FACEBOOK_SIGN_IN_METHOD="facebook.com",Sn.PROVIDER_ID="facebook.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Cn extends En{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return _n._fromParams({providerId:Cn.PROVIDER_ID,signInMethod:Cn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Cn.credentialFromTaggedObject(e)}static credentialFromError(e){return Cn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:n}=e;if(!t&&!n)return null;try{return Cn.credential(t,n)}catch(r){return null}}}Cn.GOOGLE_SIGN_IN_METHOD="google.com",Cn.PROVIDER_ID="google.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class kn extends En{constructor(){super("github.com")}static credential(e){return _n._fromParams({providerId:kn.PROVIDER_ID,signInMethod:kn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return kn.credentialFromTaggedObject(e)}static credentialFromError(e){return kn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e))return null;if(!e.oauthAccessToken)return null;try{return kn.credential(e.oauthAccessToken)}catch(t){return null}}}kn.GITHUB_SIGN_IN_METHOD="github.com",kn.PROVIDER_ID="github.com";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class An extends En{constructor(){super("twitter.com")}static credential(e,t){return _n._fromParams({providerId:An.PROVIDER_ID,signInMethod:An.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return An.credentialFromTaggedObject(e)}static credentialFromError(e){return An.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:n}=e;if(!t||!n)return null;try{return An.credential(t,n)}catch(r){return null}}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Nn(e,t){return pt(e,"POST","/v1/accounts:signUp",ht(e,t))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */An.TWITTER_SIGN_IN_METHOD="twitter.com",An.PROVIDER_ID="twitter.com";class Rn{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,n,r=!1){const s=await Ot._fromIdTokenResponse(e,n,r),i=xn(n);return new Rn({user:s,providerId:i,_tokenResponse:n,operationType:t})}static async _forOperation(e,t,n){await e._updateTokensIfNecessary(n,!0);const r=xn(n);return new Rn({user:e,providerId:r,_tokenResponse:n,operationType:t})}}function xn(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dn extends v{constructor(e,t,n,r){var s;super(t.code,t.message),this.operationType=n,this.user=r,Object.setPrototypeOf(this,Dn.prototype),this.customData={appName:e.name,tenantId:null!==(s=e.tenantId)&&void 0!==s?s:void 0,_serverResponse:t.customData._serverResponse,operationType:n}}static _fromErrorAndOperation(e,t,n,r){return new Dn(e,t,n,r)}}function On(e,t,n,r){return("reauthenticate"===t?n._getReauthenticationResolver(e):n._getIdTokenResponse(e)).catch((n=>{if("auth/multi-factor-auth-required"===n.code)throw Dn._fromErrorAndOperation(e,n,t,r);throw n}))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Pn(e,t,n=!1){if(Ce(e.app))return Promise.reject(Ye(e));const r="signIn",s=await On(e,r,t),i=await Rn._fromIdTokenResponse(e,r,s);return n||await e._updateCurrentUser(i.user),i}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Ln(e){const t=tn(e);t._getPasswordPolicyInternal()&&await t._updatePasswordPolicy()}async function Mn(e,t,n){if(Ce(e.app))return Promise.reject(Ye(e));const r=tn(e),s=hn(r,{returnSecureToken:!0,email:t,password:n,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",Nn,"EMAIL_PASSWORD_PROVIDER"),i=await s.catch((t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Ln(e),t})),o=await Rn._fromIdTokenResponse(r,"signIn",i);return await r._updateCurrentUser(o.user),o}function Un(e,t,n){return Ce(e.app)?Promise.reject(Ye(e)):async function(e,t){return Pn(tn(e),t)}(A(e),In.credential(t,n)).catch((async t=>{throw"auth/password-does-not-meet-requirements"===t.code&&Ln(e),t}))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function Fn(e,{displayName:t,photoURL:n}){if(void 0===t&&void 0===n)return;const r=A(e),s={idToken:await r.getIdToken(),displayName:t,photoUrl:n,returnSecureToken:!0},i=await Ct(r,async function(e,t){return dt(e,"POST","/v1/accounts:update",t)}(r.auth,s));r.displayName=i.displayName||null,r.photoURL=i.photoUrl||null;const o=r.providerData.find((({providerId:e})=>"password"===e));o&&(o.displayName=r.displayName,o.photoURL=r.photoURL),await r._updateTokensIfNecessary(i)}function Vn(e,t,n,r){return A(e).onAuthStateChanged(t,n,r)}function Bn(e){return A(e).signOut()}const qn="__sak";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zn{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(qn,"1"),this.storage.removeItem(qn),Promise.resolve(!0)):Promise.resolve(!1)}catch(e){return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn extends zn{constructor(){super((()=>window.localStorage),"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Jt(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const n=this.storage.getItem(t),r=this.localCache[t];n!==r&&e(t,r,n)}}onStorageEvent(e,t=!1){if(!e.key)return void this.forAllChangedKeys(((e,t,n)=>{this.notifyListeners(e,n)}));const n=e.key;t?this.detachListener():this.stopPolling();const r=()=>{const e=this.storage.getItem(n);(t||this.localCache[n]!==e)&&this.notifyListeners(n,e)},s=this.storage.getItem(n);Qt()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(r,10):r()}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval((()=>{this.forAllChangedKeys(((e,t,n)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:n}),!0)}))}),1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}jn.type="LOCAL";const $n=jn;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn extends zn{constructor(){super((()=>window.sessionStorage),"SESSION")}_addListener(e,t){}_removeListener(e,t){}}Gn.type="SESSION";const Kn=Gn;
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Hn{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find((t=>t.isListeningto(e)));if(t)return t;const n=new Hn(e);return this.receivers.push(n),n}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:n,eventType:r,data:s}=t.data,i=this.handlersMap[r];if(!(null==i?void 0:i.size))return;t.ports[0].postMessage({status:"ack",eventId:n,eventType:r});const o=Array.from(i).map((async e=>e(t.origin,s))),a=await function(e){return Promise.all(e.map((async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}})))}(o);t.ports[0].postMessage({status:"done",eventId:n,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Wn(e="",t=10){let n="";for(let r=0;r<t;r++)n+=Math.floor(10*Math.random());return e+n}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Hn.receivers=[];class Qn{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,n=50){const r="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!r)throw new Error("connection_unavailable");let s,i;return new Promise(((o,a)=>{const c=Wn("",20);r.port1.start();const u=setTimeout((()=>{a(new Error("unsupported_event"))}),n);i={messageChannel:r,onMessage(e){const t=e;if(t.data.eventId===c)switch(t.data.status){case"ack":clearTimeout(u),s=setTimeout((()=>{a(new Error("timeout"))}),3e3);break;case"done":clearTimeout(s),o(t.data.response);break;default:clearTimeout(u),clearTimeout(s),a(new Error("invalid_response"))}}},this.handlers.add(i),r.port1.addEventListener("message",i.onMessage),this.target.postMessage({eventType:e,eventId:c,data:t},[r.port2])})).finally((()=>{i&&this.removeMessageHandler(i)}))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jn(){return window}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Yn(){return void 0!==Jn().WorkerGlobalScope&&"function"==typeof Jn().importScripts}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Xn="firebaseLocalStorageDb",Zn="firebaseLocalStorage",er="fbase_key";class tr{constructor(e){this.request=e}toPromise(){return new Promise(((e,t)=>{this.request.addEventListener("success",(()=>{e(this.request.result)})),this.request.addEventListener("error",(()=>{t(this.request.error)}))}))}}function nr(e,t){return e.transaction([Zn],t?"readwrite":"readonly").objectStore(Zn)}function rr(){const e=indexedDB.open(Xn,1);return new Promise(((t,n)=>{e.addEventListener("error",(()=>{n(e.error)})),e.addEventListener("upgradeneeded",(()=>{const t=e.result;try{t.createObjectStore(Zn,{keyPath:er})}catch(r){n(r)}})),e.addEventListener("success",(async()=>{const n=e.result;n.objectStoreNames.contains(Zn)?t(n):(n.close(),await function(){const e=indexedDB.deleteDatabase(Xn);return new tr(e).toPromise()}(),t(await rr()))}))}))}async function sr(e,t,n){const r=nr(e,!0).put({[er]:t,value:n});return new tr(r).toPromise()}function ir(e,t){const n=nr(e,!0).delete(t);return new tr(n).toPromise()}class or{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then((()=>{}),(()=>{}))}async _openDb(){return this.db||(this.db=await rr()),this.db}async _withRetries(e){let t=0;for(;;)try{const t=await this._openDb();return await e(t)}catch(n){if(t++>3)throw n;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return Yn()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Hn._getInstance(Yn()?self:null),this.receiver._subscribe("keyChanged",(async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)}))),this.receiver._subscribe("ping",(async(e,t)=>["keyChanged"]))}async initializeSender(){var e,t;if(this.activeServiceWorker=await async function(){if(!(null===navigator||void 0===navigator?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch(e){return null}}(),!this.activeServiceWorker)return;this.sender=new Qn(this.activeServiceWorker);const n=await this.sender._send("ping",{},800);n&&(null===(e=n[0])||void 0===e?void 0:e.fulfilled)&&(null===(t=n[0])||void 0===t?void 0:t.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){var t;if(this.sender&&this.activeServiceWorker&&((null===(t=null===navigator||void 0===navigator?void 0:navigator.serviceWorker)||void 0===t?void 0:t.controller)||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch(t){}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await rr();return await sr(e,qn,"1"),await ir(e,qn),!0}catch(e){}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite((async()=>(await this._withRetries((n=>sr(n,e,t))),this.localCache[e]=t,this.notifyServiceWorker(e))))}async _get(e){const t=await this._withRetries((t=>async function(e,t){const n=nr(e,!1).get(t),r=await new tr(n).toPromise();return void 0===r?null:r.value}(t,e)));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite((async()=>(await this._withRetries((t=>ir(t,e))),delete this.localCache[e],this.notifyServiceWorker(e))))}async _poll(){const e=await this._withRetries((e=>{const t=nr(e,!1).getAll();return new tr(t).toPromise()}));if(!e)return[];if(0!==this.pendingWrites)return[];const t=[],n=new Set;if(0!==e.length)for(const{fbase_key:r,value:s}of e)n.add(r),JSON.stringify(this.localCache[r])!==JSON.stringify(s)&&(this.notifyListeners(r,s),t.push(r));for(const r of Object.keys(this.localCache))this.localCache[r]&&!n.has(r)&&(this.notifyListeners(r,null),t.push(r));return t}notifyListeners(e,t){this.localCache[e]=t;const n=this.listeners[e];if(n)for(const r of Array.from(n))r(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval((async()=>this._poll()),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&this.stopPolling()}}or.type="LOCAL";const ar=or;
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function cr(e,t){return t?Lt(t):(Ze(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */new it(3e4,6e4);class ur extends gn{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return wn(e,this._buildIdpRequest())}_linkToIdToken(e,t){return wn(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return wn(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function lr(e){return Pn(e.auth,new ur(e),e.bypassAuthState)}function hr(e){const{auth:t,user:n}=e;return Ze(n,t,"internal-error"),
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function(e,t,n=!1){const{auth:r}=e;if(Ce(r.app))return Promise.reject(Ye(r));const s="reauthenticate";try{const i=await Ct(e,On(r,s,t,e),n);Ze(i.idToken,r,"internal-error");const o=Et(i.idToken);Ze(o,r,"internal-error");const{sub:a}=o;return Ze(e.uid===a,r,"user-mismatch"),Rn._forOperation(e,s,i)}catch(i){throw"auth/user-not-found"===(null==i?void 0:i.code)&&We(r,"user-mismatch"),i}}(n,new ur(e),e.bypassAuthState)}async function dr(e){const{auth:t,user:n}=e;return Ze(n,t,"internal-error"),async function(e,t,n=!1){const r=await Ct(e,t._linkToIdToken(e.auth,await e.getIdToken()),n);return Rn._forOperation(e,"link",r)}(n,new ur(e),e.bypassAuthState)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr{constructor(e,t,n,r,s=!1){this.auth=e,this.resolver=n,this.user=r,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise((async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(n){this.reject(n)}}))}async onAuthEvent(e){const{urlResponse:t,sessionId:n,postBody:r,tenantId:s,error:i,type:o}=e;if(i)return void this.reject(i);const a={auth:this.auth,requestUri:t,sessionId:n,tenantId:s||void 0,postBody:r||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(o)(a))}catch(c){this.reject(c)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return lr;case"linkViaPopup":case"linkViaRedirect":return dr;case"reauthViaPopup":case"reauthViaRedirect":return hr;default:We(this.auth,"internal-error")}}resolve(e){tt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){tt(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pr=new it(2e3,1e4);async function gr(e,t,n){if(Ce(e.app))return Promise.reject(Qe(e,"operation-not-supported-in-this-environment"));const r=tn(e);!function(e,t,n){if(!(t instanceof n))throw n.name!==t.constructor.name&&We(e,"argument-error"),Je(e,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}(e,t,Tn);const s=cr(r,n);return new mr(r,"signInViaPopup",t,s).executeNotNull()}class mr extends fr{constructor(e,t,n,r,s){super(e,t,r,s),this.provider=n,this.authWindow=null,this.pollId=null,mr.currentPopupAction&&mr.currentPopupAction.cancel(),mr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return Ze(e,this.auth,"internal-error"),e}async onExecution(){tt(1===this.filter.length,"Popup operations only handle one event");const e=Wn();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch((e=>{this.reject(e)})),this.resolver._isIframeWebStorageSupported(this.auth,(e=>{e||this.reject(Qe(this.auth,"web-storage-unsupported"))})),this.pollUserCancellation()}get eventId(){var e;return(null===(e=this.authWindow)||void 0===e?void 0:e.associatedEvent)||null}cancel(){this.reject(Qe(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,mr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,n;(null===(n=null===(t=this.authWindow)||void 0===t?void 0:t.window)||void 0===n?void 0:n.closed)?this.pollId=window.setTimeout((()=>{this.pollId=null,this.reject(Qe(this.auth,"popup-closed-by-user"))}),8e3):this.pollId=window.setTimeout(e,pr.get())};e()}}mr.currentPopupAction=null;
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const yr="pendingRedirect",vr=new Map;class wr extends fr{constructor(e,t,n=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,n),this.eventId=null}async execute(){let e=vr.get(this.auth._key());if(!e){try{const t=await async function(e,t){const n=function(e){return Ft(yr,e.config.apiKey,e.name)}(t),r=function(e){return Lt(e._redirectPersistence)}(e);if(!(await r._isAvailable()))return!1;const s="true"===await r._get(n);return await r._remove(n),s}(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(t)}catch(t){e=()=>Promise.reject(t)}vr.set(this.auth._key(),e)}return this.bypassAuthState||vr.set(this.auth._key(),(()=>Promise.resolve(null))),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"!==e.type){if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}else this.resolve(null)}async onExecution(){}cleanUp(){}}function _r(e,t){vr.set(e._key(),t)}async function br(e,t,n=!1){if(Ce(e.app))return Promise.reject(Ye(e));const r=tn(e),s=cr(r,t),i=new wr(r,s,n),o=await i.execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,t)),o}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ir{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach((n=>{this.isEventForConsumer(e,n)&&(t=!0,this.sendToConsumer(e,n),this.saveEventToCache(e))})),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Er(e);default:return!1}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var n;if(e.error&&!Er(e)){const r=(null===(n=e.error.code)||void 0===n?void 0:n.split("auth/")[1])||"internal-error";t.onError(Qe(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const n=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&n}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(Tr(e))}saveEventToCache(e){this.cachedEventUids.add(Tr(e)),this.lastProcessedEventTime=Date.now()}}function Tr(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter((e=>e)).join("-")}function Er({type:e,error:t}){return"unknown"===e&&"auth/no-auth-event"===(null==t?void 0:t.code)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Sr=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,Cr=/^https?/;async function kr(e){if(e.config.emulator)return;const{authorizedDomains:t}=await async function(e,t={}){return dt(e,"GET","/v1/projects",t)}(e);for(const r of t)try{if(Ar(r))return}catch(n){}We(e,"unauthorized-domain")}function Ar(e){const t=nt(),{protocol:n,hostname:r}=new URL(t);if(e.startsWith("chrome-extension://")){const s=new URL(e);return""===s.hostname&&""===r?"chrome-extension:"===n&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===n&&s.hostname===r}if(!Cr.test(n))return!1;if(Sr.test(e))return r===e;const s=e.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nr=new it(3e4,6e4);function Rr(){const e=Jn().___jsl;if(null==e?void 0:e.H)for(const t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let n=0;n<e.CP.length;n++)e.CP[n]=null}function xr(e){return new Promise(((t,n)=>{var r,s,i;function o(){Rr(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{Rr(),n(Qe(e,"network-request-failed"))},timeout:Nr.get()})}if(null===(s=null===(r=Jn().gapi)||void 0===r?void 0:r.iframes)||void 0===s?void 0:s.Iframe)t(gapi.iframes.getContext());else{if(!(null===(i=Jn().gapi)||void 0===i?void 0:i.load)){const t=`__${"iframefcb"}${Math.floor(1e6*Math.random())}`;return Jn()[t]=()=>{gapi.load?o():n(Qe(e,"network-request-failed"))},sn(`${rn.gapiScript}?onload=${t}`).catch((e=>n(e)))}o()}})).catch((e=>{throw Dr=null,e}))}let Dr=null;
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Or=new it(5e3,15e3),Pr={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Lr=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function Mr(e){const t=e.config;Ze(t.authDomain,e,"auth-domain-config-required");const n=t.emulator?ot(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,r={apiKey:t.apiKey,appName:e.name,v:Ne},s=Lr.get(e.config.apiHost);s&&(r.eid=s);const i=e._getFrameworks();return i.length&&(r.fw=i.join(",")),`${n}?${T(r).slice(1)}`}async function Ur(e){const t=await function(e){return Dr=Dr||xr(e),Dr}(e),n=Jn().gapi;return Ze(n,e,"internal-error"),t.open({where:document.body,url:Mr(e),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Pr,dontclear:!0},(t=>new Promise((async(n,r)=>{await t.restyle({setHideOnLeave:!1});const s=Qe(e,"network-request-failed"),i=Jn().setTimeout((()=>{r(s)}),Or.get());function o(){Jn().clearTimeout(i),n(t)}t.ping(o).then(o,(()=>{r(s)}))}))))}
/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fr={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};class Vr{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}}function Br(e,t,n,r=500,s=600){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let a="";const c=Object.assign(Object.assign({},Fr),{width:r.toString(),height:s.toString(),top:i,left:o}),u=g().toLowerCase();n&&(a=jt(u)?"_blank":n),qt(u)&&(t=t||"http://localhost",c.scrollbars="yes");const l=Object.entries(c).reduce(((e,[t,n])=>`${e}${t}=${n},`),"");if(function(e=g()){var t;return Wt(e)&&!!(null===(t=window.navigator)||void 0===t?void 0:t.standalone)}(u)&&"_self"!==a)return function(e,t){const n=document.createElement("a");n.href=e,n.target=t;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t||"",a),new Vr(null);const h=window.open(t||"",a,l);Ze(h,e,"popup-blocked");try{h.focus()}catch(d){}return new Vr(h)}const qr="__/auth/handler",zr="emulator/auth/handler",jr=encodeURIComponent("fac");async function $r(e,t,n,r,s,i){Ze(e.config.authDomain,e,"auth-domain-config-required"),Ze(e.config.apiKey,e,"invalid-api-key");const o={apiKey:e.config.apiKey,appName:e.name,authType:n,redirectUrl:r,v:Ne,eventId:s};if(t instanceof Tn){t.setDefaultLanguage(e.languageCode),o.providerId=t.providerId||"",function(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())||(o.customParameters=JSON.stringify(t.getCustomParameters()));for(const[e,t]of Object.entries(i||{}))o[e]=t}if(t instanceof En){const e=t.getScopes().filter((e=>""!==e));e.length>0&&(o.scopes=e.join(","))}e.tenantId&&(o.tid=e.tenantId);const a=o;for(const l of Object.keys(a))void 0===a[l]&&delete a[l];const c=await e._getAppCheckToken(),u=c?`#${jr}=${encodeURIComponent(c)}`:"";return`${function({config:e}){if(!e.emulator)return`https://${e.authDomain}/${qr}`;return ot(e,zr)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e)}?${T(a).slice(1)}${u}`}const Gr="webStorageSupport";const Kr=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Kn,this._completeRedirectFn=br,this._overrideRedirectResult=_r}async _openPopup(e,t,n,r){var s;tt(null===(s=this.eventManagers[e._key()])||void 0===s?void 0:s.manager,"_initialize() not called before _openPopup()");return Br(e,await $r(e,t,n,nt(),r),Wn())}async _openRedirect(e,t,n,r){await this._originValidation(e);return function(e){Jn().location.href=e}(await $r(e,t,n,nt(),r)),new Promise((()=>{}))}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:e,promise:n}=this.eventManagers[t];return e?Promise.resolve(e):(tt(n,"If manager is not set, promise should be"),n)}const n=this.initAndGetManager(e);return this.eventManagers[t]={promise:n},n.catch((()=>{delete this.eventManagers[t]})),n}async initAndGetManager(e){const t=await Ur(e),n=new Ir(e);return t.register("authEvent",(t=>{Ze(null==t?void 0:t.authEvent,e,"invalid-auth-event");return{status:n.onEvent(t.authEvent)?"ACK":"ERROR"}}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:n},this.iframes[e._key()]=t,n}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(Gr,{type:Gr},(n=>{var r;const s=null===(r=null==n?void 0:n[0])||void 0===r?void 0:r[Gr];void 0!==s&&t(!!s),We(e,"internal-error")}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=kr(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Jt()||zt()||Wt()}};var Hr="@firebase/auth",Wr="1.10.2";
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Qr{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),(null===(e=this.auth.currentUser)||void 0===e?void 0:e.uid)||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;return{accessToken:await this.auth.currentUser.getIdToken(e)}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged((t=>{e((null==t?void 0:t.stsTokenManager.accessToken)||null)}));this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){Ze(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Jr=d("authIdTokenMaxAge")||300;let Yr=null;function Xr(e=xe()){const t=Se(e,"auth");if(t.isInitialized())return t.getImmediate();const n=function(e,t){const n=Se(e,"auth");if(n.isInitialized()){const e=n.getImmediate();if(b(n.getOptions(),null!=t?t:{}))return e;We(e,"already-initialized")}return n.initialize({options:t})}(e,{popupRedirectResolver:Kr,persistence:[ar,$n,Kn]}),r=d("authTokenSyncURL");if(r&&"boolean"==typeof isSecureContext&&isSecureContext){const e=new URL(r,location.origin);if(location.origin===e.origin){const t=(s=e.toString(),async e=>{const t=e&&await e.getIdTokenResult(),n=t&&((new Date).getTime()-Date.parse(t.issuedAtTime))/1e3;if(n&&n>Jr)return;const r=null==t?void 0:t.token;Yr!==r&&(Yr=r,await fetch(s,{method:r?"POST":"DELETE",headers:r?{Authorization:`Bearer ${r}`}:{}}))});!function(e,t,n){A(e).beforeAuthStateChanged(t,n)}(n,t,(()=>t(n.currentUser))),function(e,t,n,r){A(e).onIdTokenChanged(t,n,r)}(n,(e=>t(e)))}}var s;const i=u("auth");return i&&dn(n,`http://${i}`),n}var Zr;rn={loadJS:e=>new Promise(((t,n)=>{const r=document.createElement("script");var s,i;r.setAttribute("src",e),r.onload=t,r.onerror=e=>{const t=Qe("internal-error");t.customData=e,n(t)},r.type="text/javascript",r.charset="UTF-8",(null!==(i=null===(s=document.getElementsByTagName("head"))||void 0===s?void 0:s[0])&&void 0!==i?i:document).appendChild(r)})),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},Zr="Browser",Ee(new x("auth",((e,{options:t})=>{const n=e.getProvider("app").getImmediate(),r=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:i,authDomain:o}=n.options;Ze(i&&!i.includes(":"),"invalid-api-key",{appName:n.name});const a={apiKey:i,authDomain:o,clientPlatform:Zr,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Yt(Zr)},c=new en(n,r,s,a);return function(e,t){const n=(null==t?void 0:t.persistence)||[],r=(Array.isArray(n)?n:[n]).map(Lt);(null==t?void 0:t.errorMap)&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(r,null==t?void 0:t.popupRedirectResolver)}(c,t),c}),"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback(((e,t,n)=>{e.getProvider("auth-internal").initialize()}))),Ee(new x("auth-internal",(e=>{const t=tn(e.getProvider("auth").getImmediate());return new Qr(t)}),"PRIVATE").setInstantiationMode("EXPLICIT")),De(Hr,Wr,function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(Zr)),De(Hr,Wr,"esm2017");var es,ts,ns="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e;
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function t(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}function n(e,t,n){n||(n=0);var r=Array(16);if("string"==typeof t)for(var s=0;16>s;++s)r[s]=t.charCodeAt(n++)|t.charCodeAt(n++)<<8|t.charCodeAt(n++)<<16|t.charCodeAt(n++)<<24;else for(s=0;16>s;++s)r[s]=t[n++]|t[n++]<<8|t[n++]<<16|t[n++]<<24;t=e.g[0],n=e.g[1],s=e.g[2];var i=e.g[3],o=t+(i^n&(s^i))+r[0]+3614090360&4294967295;o=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=(n=(s=(i=(t=n+(o<<7&4294967295|o>>>25))+((o=i+(s^t&(n^s))+r[1]+3905402710&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(t^n))+r[2]+606105819&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^s&(i^t))+r[3]+3250441966&4294967295)<<22&4294967295|o>>>10))+((o=t+(i^n&(s^i))+r[4]+4118548399&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^t&(n^s))+r[5]+1200080426&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(t^n))+r[6]+2821735955&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^s&(i^t))+r[7]+4249261313&4294967295)<<22&4294967295|o>>>10))+((o=t+(i^n&(s^i))+r[8]+1770035416&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^t&(n^s))+r[9]+2336552879&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(t^n))+r[10]+4294925233&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^s&(i^t))+r[11]+2304563134&4294967295)<<22&4294967295|o>>>10))+((o=t+(i^n&(s^i))+r[12]+1804603682&4294967295)<<7&4294967295|o>>>25))+((o=i+(s^t&(n^s))+r[13]+4254626195&4294967295)<<12&4294967295|o>>>20))+((o=s+(n^i&(t^n))+r[14]+2792965006&4294967295)<<17&4294967295|o>>>15))+((o=n+(t^s&(i^t))+r[15]+1236535329&4294967295)<<22&4294967295|o>>>10))+((o=t+(s^i&(n^s))+r[1]+4129170786&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(t^n))+r[6]+3225465664&4294967295)<<9&4294967295|o>>>23))+((o=s+(t^n&(i^t))+r[11]+643717713&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^t&(s^i))+r[0]+3921069994&4294967295)<<20&4294967295|o>>>12))+((o=t+(s^i&(n^s))+r[5]+3593408605&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(t^n))+r[10]+38016083&4294967295)<<9&4294967295|o>>>23))+((o=s+(t^n&(i^t))+r[15]+3634488961&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^t&(s^i))+r[4]+3889429448&4294967295)<<20&4294967295|o>>>12))+((o=t+(s^i&(n^s))+r[9]+568446438&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(t^n))+r[14]+3275163606&4294967295)<<9&4294967295|o>>>23))+((o=s+(t^n&(i^t))+r[3]+4107603335&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^t&(s^i))+r[8]+1163531501&4294967295)<<20&4294967295|o>>>12))+((o=t+(s^i&(n^s))+r[13]+2850285829&4294967295)<<5&4294967295|o>>>27))+((o=i+(n^s&(t^n))+r[2]+4243563512&4294967295)<<9&4294967295|o>>>23))+((o=s+(t^n&(i^t))+r[7]+1735328473&4294967295)<<14&4294967295|o>>>18))+((o=n+(i^t&(s^i))+r[12]+2368359562&4294967295)<<20&4294967295|o>>>12))+((o=t+(n^s^i)+r[5]+4294588738&4294967295)<<4&4294967295|o>>>28))+((o=i+(t^n^s)+r[8]+2272392833&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^t^n)+r[11]+1839030562&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^t)+r[14]+4259657740&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^s^i)+r[1]+2763975236&4294967295)<<4&4294967295|o>>>28))+((o=i+(t^n^s)+r[4]+1272893353&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^t^n)+r[7]+4139469664&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^t)+r[10]+3200236656&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^s^i)+r[13]+681279174&4294967295)<<4&4294967295|o>>>28))+((o=i+(t^n^s)+r[0]+3936430074&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^t^n)+r[3]+3572445317&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^t)+r[6]+76029189&4294967295)<<23&4294967295|o>>>9))+((o=t+(n^s^i)+r[9]+3654602809&4294967295)<<4&4294967295|o>>>28))+((o=i+(t^n^s)+r[12]+3873151461&4294967295)<<11&4294967295|o>>>21))+((o=s+(i^t^n)+r[15]+530742520&4294967295)<<16&4294967295|o>>>16))+((o=n+(s^i^t)+r[2]+3299628645&4294967295)<<23&4294967295|o>>>9))+((o=t+(s^(n|~i))+r[0]+4096336452&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(t|~s))+r[7]+1126891415&4294967295)<<10&4294967295|o>>>22))+((o=s+(t^(i|~n))+r[14]+2878612391&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~t))+r[5]+4237533241&4294967295)<<21&4294967295|o>>>11))+((o=t+(s^(n|~i))+r[12]+1700485571&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(t|~s))+r[3]+2399980690&4294967295)<<10&4294967295|o>>>22))+((o=s+(t^(i|~n))+r[10]+4293915773&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~t))+r[1]+2240044497&4294967295)<<21&4294967295|o>>>11))+((o=t+(s^(n|~i))+r[8]+1873313359&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(t|~s))+r[15]+4264355552&4294967295)<<10&4294967295|o>>>22))+((o=s+(t^(i|~n))+r[6]+2734768916&4294967295)<<15&4294967295|o>>>17))+((o=n+(i^(s|~t))+r[13]+1309151649&4294967295)<<21&4294967295|o>>>11))+((i=(t=n+((o=t+(s^(n|~i))+r[4]+4149444226&4294967295)<<6&4294967295|o>>>26))+((o=i+(n^(t|~s))+r[11]+3174756917&4294967295)<<10&4294967295|o>>>22))^((s=i+((o=s+(t^(i|~n))+r[2]+718787259&4294967295)<<15&4294967295|o>>>17))|~t))+r[9]+3951481745&4294967295,e.g[0]=e.g[0]+t&4294967295,e.g[1]=e.g[1]+(s+(o<<21&4294967295|o>>>11))&4294967295,e.g[2]=e.g[2]+s&4294967295,e.g[3]=e.g[3]+i&4294967295}function r(e,t){this.h=t;for(var n=[],r=!0,s=e.length-1;0<=s;s--){var i=0|e[s];r&&i==t||(n[s]=i,r=!1)}this.g=n}!function(e,t){function n(){}n.prototype=t.prototype,e.D=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.C=function(e,n,r){for(var s=Array(arguments.length-2),i=2;i<arguments.length;i++)s[i-2]=arguments[i];return t.prototype[n].apply(e,s)}}(t,(function(){this.blockSize=-1})),t.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},t.prototype.u=function(e,t){void 0===t&&(t=e.length);for(var r=t-this.blockSize,s=this.B,i=this.h,o=0;o<t;){if(0==i)for(;o<=r;)n(this,e,o),o+=this.blockSize;if("string"==typeof e){for(;o<t;)if(s[i++]=e.charCodeAt(o++),i==this.blockSize){n(this,s),i=0;break}}else for(;o<t;)if(s[i++]=e[o++],i==this.blockSize){n(this,s),i=0;break}}this.h=i,this.o+=t},t.prototype.v=function(){var e=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);e[0]=128;for(var t=1;t<e.length-8;++t)e[t]=0;var n=8*this.o;for(t=e.length-8;t<e.length;++t)e[t]=255&n,n/=256;for(this.u(e),e=Array(16),t=n=0;4>t;++t)for(var r=0;32>r;r+=8)e[n++]=this.g[t]>>>r&255;return e};var s={};function i(e){return-128<=e&&128>e?function(e,t){var n=s;return Object.prototype.hasOwnProperty.call(n,e)?n[e]:n[e]=t(e)}(e,(function(e){return new r([0|e],0>e?-1:0)})):new r([0|e],0>e?-1:0)}function o(e){if(isNaN(e)||!isFinite(e))return a;if(0>e)return d(o(-e));for(var t=[],n=1,s=0;e>=n;s++)t[s]=e/n|0,n*=4294967296;return new r(t,0)}var a=i(0),c=i(1),u=i(16777216);function l(e){if(0!=e.h)return!1;for(var t=0;t<e.g.length;t++)if(0!=e.g[t])return!1;return!0}function h(e){return-1==e.h}function d(e){for(var t=e.g.length,n=[],s=0;s<t;s++)n[s]=~e.g[s];return new r(n,~e.h).add(c)}function f(e,t){return e.add(d(t))}function p(e,t){for(;(65535&e[t])!=e[t];)e[t+1]+=e[t]>>>16,e[t]&=65535,t++}function g(e,t){this.g=e,this.h=t}function m(e,t){if(l(t))throw Error("division by zero");if(l(e))return new g(a,a);if(h(e))return t=m(d(e),t),new g(d(t.g),d(t.h));if(h(t))return t=m(e,d(t)),new g(d(t.g),t.h);if(30<e.g.length){if(h(e)||h(t))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=t;0>=r.l(e);)n=y(n),r=y(r);var s=v(n,1),i=v(r,1);for(r=v(r,2),n=v(n,2);!l(r);){var u=i.add(r);0>=u.l(e)&&(s=s.add(n),i=u),r=v(r,1),n=v(n,1)}return t=f(e,s.j(t)),new g(s,t)}for(s=a;0<=e.l(t);){for(n=Math.max(1,Math.floor(e.m()/t.m())),r=48>=(r=Math.ceil(Math.log(n)/Math.LN2))?1:Math.pow(2,r-48),u=(i=o(n)).j(t);h(u)||0<u.l(e);)u=(i=o(n-=r)).j(t);l(i)&&(i=c),s=s.add(i),e=f(e,u)}return new g(s,e)}function y(e){for(var t=e.g.length+1,n=[],s=0;s<t;s++)n[s]=e.i(s)<<1|e.i(s-1)>>>31;return new r(n,e.h)}function v(e,t){var n=t>>5;t%=32;for(var s=e.g.length-n,i=[],o=0;o<s;o++)i[o]=0<t?e.i(o+n)>>>t|e.i(o+n+1)<<32-t:e.i(o+n);return new r(i,e.h)}(e=r.prototype).m=function(){if(h(this))return-d(this).m();for(var e=0,t=1,n=0;n<this.g.length;n++){var r=this.i(n);e+=(0<=r?r:4294967296+r)*t,t*=4294967296}return e},e.toString=function(e){if(2>(e=e||10)||36<e)throw Error("radix out of range: "+e);if(l(this))return"0";if(h(this))return"-"+d(this).toString(e);for(var t=o(Math.pow(e,6)),n=this,r="";;){var s=m(n,t).g,i=((0<(n=f(n,s.j(t))).g.length?n.g[0]:n.h)>>>0).toString(e);if(l(n=s))return i+r;for(;6>i.length;)i="0"+i;r=i+r}},e.i=function(e){return 0>e?0:e<this.g.length?this.g[e]:this.h},e.l=function(e){return h(e=f(this,e))?-1:l(e)?0:1},e.abs=function(){return h(this)?d(this):this},e.add=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],s=0,i=0;i<=t;i++){var o=s+(65535&this.i(i))+(65535&e.i(i)),a=(o>>>16)+(this.i(i)>>>16)+(e.i(i)>>>16);s=a>>>16,o&=65535,a&=65535,n[i]=a<<16|o}return new r(n,-2147483648&n[n.length-1]?-1:0)},e.j=function(e){if(l(this)||l(e))return a;if(h(this))return h(e)?d(this).j(d(e)):d(d(this).j(e));if(h(e))return d(this.j(d(e)));if(0>this.l(u)&&0>e.l(u))return o(this.m()*e.m());for(var t=this.g.length+e.g.length,n=[],s=0;s<2*t;s++)n[s]=0;for(s=0;s<this.g.length;s++)for(var i=0;i<e.g.length;i++){var c=this.i(s)>>>16,f=65535&this.i(s),g=e.i(i)>>>16,m=65535&e.i(i);n[2*s+2*i]+=f*m,p(n,2*s+2*i),n[2*s+2*i+1]+=c*m,p(n,2*s+2*i+1),n[2*s+2*i+1]+=f*g,p(n,2*s+2*i+1),n[2*s+2*i+2]+=c*g,p(n,2*s+2*i+2)}for(s=0;s<t;s++)n[s]=n[2*s+1]<<16|n[2*s];for(s=t;s<2*t;s++)n[s]=0;return new r(n,0)},e.A=function(e){return m(this,e).h},e.and=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],s=0;s<t;s++)n[s]=this.i(s)&e.i(s);return new r(n,this.h&e.h)},e.or=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],s=0;s<t;s++)n[s]=this.i(s)|e.i(s);return new r(n,this.h|e.h)},e.xor=function(e){for(var t=Math.max(this.g.length,e.g.length),n=[],s=0;s<t;s++)n[s]=this.i(s)^e.i(s);return new r(n,this.h^e.h)},t.prototype.digest=t.prototype.v,t.prototype.reset=t.prototype.s,t.prototype.update=t.prototype.u,ts=t,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.A,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function e(t,n){if(0==t.length)throw Error("number format error: empty string");if(2>(n=n||10)||36<n)throw Error("radix out of range: "+n);if("-"==t.charAt(0))return d(e(t.substring(1),n));if(0<=t.indexOf("-"))throw Error('number format error: interior "-" character');for(var r=o(Math.pow(n,8)),s=a,i=0;i<t.length;i+=8){var c=Math.min(8,t.length-i),u=parseInt(t.substring(i,i+c),n);8>c?(c=o(Math.pow(n,c)),s=s.j(c).add(o(u))):s=(s=s.j(r)).add(o(u))}return s},es=r}).apply(void 0!==ns?ns:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var rs,ss,is,os,as,cs,us,ls,hs="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var e,t="function"==typeof Object.defineProperties?Object.defineProperty:function(e,t,n){return e==Array.prototype||e==Object.prototype||(e[t]=n.value),e};var n=function(e){e=["object"==typeof globalThis&&globalThis,e,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof hs&&hs];for(var t=0;t<e.length;++t){var n=e[t];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);!function(e,r){if(r)e:{var s=n;e=e.split(".");for(var i=0;i<e.length-1;i++){var o=e[i];if(!(o in s))break e;s=s[o]}(r=r(i=s[e=e[e.length-1]]))!=i&&null!=r&&t(s,e,{configurable:!0,writable:!0,value:r})}}("Array.prototype.values",(function(e){return e||function(){return function(e,t){e instanceof String&&(e+="");var n=0,r=!1,s={next:function(){if(!r&&n<e.length){var s=n++;return{value:t(s,e[s]),done:!1}}return r=!0,{done:!0,value:void 0}}};return s[Symbol.iterator]=function(){return s},s}(this,(function(e,t){return t}))}}));
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
var r=r||{},s=this||self;function i(e){var t=typeof e;return"array"==(t="object"!=t?t:e?Array.isArray(e)?"array":t:"null")||"object"==t&&"number"==typeof e.length}function o(e){var t=typeof e;return"object"==t&&null!=e||"function"==t}function a(e,t,n){return e.call.apply(e.bind,arguments)}function c(e,t,n){if(!e)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),e.apply(t,n)}}return function(){return e.apply(t,arguments)}}function u(e,t,n){return(u=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?a:c).apply(null,arguments)}function l(e,t){var n=Array.prototype.slice.call(arguments,1);return function(){var t=n.slice();return t.push.apply(t,arguments),e.apply(this,t)}}function h(e,t){function n(){}n.prototype=t.prototype,e.aa=t.prototype,e.prototype=new n,e.prototype.constructor=e,e.Qb=function(e,n,r){for(var s=Array(arguments.length-2),i=2;i<arguments.length;i++)s[i-2]=arguments[i];return t.prototype[n].apply(e,s)}}function d(e){const t=e.length;if(0<t){const n=Array(t);for(let r=0;r<t;r++)n[r]=e[r];return n}return[]}function f(e,t){for(let n=1;n<arguments.length;n++){const t=arguments[n];if(i(t)){const n=e.length||0,r=t.length||0;e.length=n+r;for(let s=0;s<r;s++)e[n+s]=t[s]}else e.push(t)}}function p(e){return/^[\s\xa0]*$/.test(e)}function g(){var e=s.navigator;return e&&(e=e.userAgent)?e:""}function m(e){return m[" "](e),e}m[" "]=function(){};var y=!(-1==g().indexOf("Gecko")||-1!=g().toLowerCase().indexOf("webkit")&&-1==g().indexOf("Edge")||-1!=g().indexOf("Trident")||-1!=g().indexOf("MSIE")||-1!=g().indexOf("Edge"));function v(e,t,n){for(const r in e)t.call(n,e[r],r,e)}function w(e){const t={};for(const n in e)t[n]=e[n];return t}const _="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function b(e,t){let n,r;for(let s=1;s<arguments.length;s++){for(n in r=arguments[s],r)e[n]=r[n];for(let t=0;t<_.length;t++)n=_[t],Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}}function I(e){var t=1;e=e.split(":");const n=[];for(;0<t&&e.length;)n.push(e.shift()),t--;return e.length&&n.push(e.join(":")),n}function T(e){s.setTimeout((()=>{throw e}),0)}function E(){var e=N;let t=null;return e.g&&(t=e.g,e.g=e.g.next,e.g||(e.h=null),t.next=null),t}var S=new class{constructor(e,t){this.i=e,this.j=t,this.h=0,this.g=null}get(){let e;return 0<this.h?(this.h--,e=this.g,this.g=e.next,e.next=null):e=this.i(),e}}((()=>new C),(e=>e.reset()));class C{constructor(){this.next=this.g=this.h=null}set(e,t){this.h=e,this.g=t,this.next=null}reset(){this.next=this.g=this.h=null}}let k,A=!1,N=new class{constructor(){this.h=this.g=null}add(e,t){const n=S.get();n.set(e,t),this.h?this.h.next=n:this.g=n,this.h=n}},R=()=>{const e=s.Promise.resolve(void 0);k=()=>{e.then(x)}};var x=()=>{for(var e;e=E();){try{e.h.call(e.g)}catch(n){T(n)}var t=S;t.j(e),100>t.h&&(t.h++,e.next=t.g,t.g=e)}A=!1};function D(){this.s=this.s,this.C=this.C}function O(e,t){this.type=e,this.g=this.target=t,this.defaultPrevented=!1}D.prototype.s=!1,D.prototype.ma=function(){this.s||(this.s=!0,this.N())},D.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},O.prototype.h=function(){this.defaultPrevented=!0};var P=function(){if(!s.addEventListener||!Object.defineProperty)return!1;var e=!1,t=Object.defineProperty({},"passive",{get:function(){e=!0}});try{const e=()=>{};s.addEventListener("test",e,t),s.removeEventListener("test",e,t)}catch(n){}return e}();function L(e,t){if(O.call(this,e?e.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,e){var n=this.type=e.type,r=e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:null;if(this.target=e.target||e.srcElement,this.g=t,t=e.relatedTarget){if(y){e:{try{m(t.nodeName);var s=!0;break e}catch(i){}s=!1}s||(t=null)}}else"mouseover"==n?t=e.fromElement:"mouseout"==n&&(t=e.toElement);this.relatedTarget=t,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==e.clientX?e.clientX:e.pageX,this.clientY=void 0!==e.clientY?e.clientY:e.pageY,this.screenX=e.screenX||0,this.screenY=e.screenY||0),this.button=e.button,this.key=e.key||"",this.ctrlKey=e.ctrlKey,this.altKey=e.altKey,this.shiftKey=e.shiftKey,this.metaKey=e.metaKey,this.pointerId=e.pointerId||0,this.pointerType="string"==typeof e.pointerType?e.pointerType:M[e.pointerType]||"",this.state=e.state,this.i=e,e.defaultPrevented&&L.aa.h.call(this)}}h(L,O);var M={2:"touch",3:"pen",4:"mouse"};L.prototype.h=function(){L.aa.h.call(this);var e=this.i;e.preventDefault?e.preventDefault():e.returnValue=!1};var U="closure_listenable_"+(1e6*Math.random()|0),F=0;function V(e,t,n,r,s){this.listener=e,this.proxy=null,this.src=t,this.type=n,this.capture=!!r,this.ha=s,this.key=++F,this.da=this.fa=!1}function B(e){e.da=!0,e.listener=null,e.proxy=null,e.src=null,e.ha=null}function q(e){this.src=e,this.g={},this.h=0}function z(e,t){var n=t.type;if(n in e.g){var r,s=e.g[n],i=Array.prototype.indexOf.call(s,t,void 0);(r=0<=i)&&Array.prototype.splice.call(s,i,1),r&&(B(t),0==e.g[n].length&&(delete e.g[n],e.h--))}}function j(e,t,n,r){for(var s=0;s<e.length;++s){var i=e[s];if(!i.da&&i.listener==t&&i.capture==!!n&&i.ha==r)return s}return-1}q.prototype.add=function(e,t,n,r,s){var i=e.toString();(e=this.g[i])||(e=this.g[i]=[],this.h++);var o=j(e,t,r,s);return-1<o?(t=e[o],n||(t.fa=!1)):((t=new V(t,this.src,i,!!r,s)).fa=n,e.push(t)),t};var $="closure_lm_"+(1e6*Math.random()|0),G={};function K(e,t,n,r,s){if(r&&r.once)return W(e,t,n,r,s);if(Array.isArray(t)){for(var i=0;i<t.length;i++)K(e,t[i],n,r,s);return null}return n=te(n),e&&e[U]?e.K(t,n,o(r)?!!r.capture:!!r,s):H(e,t,n,!1,r,s)}function H(e,t,n,r,s,i){if(!t)throw Error("Invalid event type");var a=o(s)?!!s.capture:!!s,c=Z(e);if(c||(e[$]=c=new q(e)),(n=c.add(t,n,r,a,i)).proxy)return n;if(r=function(){function e(n){return t.call(e.src,e.listener,n)}const t=X;return e}(),n.proxy=r,r.src=e,r.listener=n,e.addEventListener)P||(s=a),void 0===s&&(s=!1),e.addEventListener(t.toString(),r,s);else if(e.attachEvent)e.attachEvent(Y(t.toString()),r);else{if(!e.addListener||!e.removeListener)throw Error("addEventListener and attachEvent are unavailable.");e.addListener(r)}return n}function W(e,t,n,r,s){if(Array.isArray(t)){for(var i=0;i<t.length;i++)W(e,t[i],n,r,s);return null}return n=te(n),e&&e[U]?e.L(t,n,o(r)?!!r.capture:!!r,s):H(e,t,n,!0,r,s)}function Q(e,t,n,r,s){if(Array.isArray(t))for(var i=0;i<t.length;i++)Q(e,t[i],n,r,s);else r=o(r)?!!r.capture:!!r,n=te(n),e&&e[U]?(e=e.i,(t=String(t).toString())in e.g&&(-1<(n=j(i=e.g[t],n,r,s))&&(B(i[n]),Array.prototype.splice.call(i,n,1),0==i.length&&(delete e.g[t],e.h--)))):e&&(e=Z(e))&&(t=e.g[t.toString()],e=-1,t&&(e=j(t,n,r,s)),(n=-1<e?t[e]:null)&&J(n))}function J(e){if("number"!=typeof e&&e&&!e.da){var t=e.src;if(t&&t[U])z(t.i,e);else{var n=e.type,r=e.proxy;t.removeEventListener?t.removeEventListener(n,r,e.capture):t.detachEvent?t.detachEvent(Y(n),r):t.addListener&&t.removeListener&&t.removeListener(r),(n=Z(t))?(z(n,e),0==n.h&&(n.src=null,t[$]=null)):B(e)}}}function Y(e){return e in G?G[e]:G[e]="on"+e}function X(e,t){if(e.da)e=!0;else{t=new L(t,this);var n=e.listener,r=e.ha||e.src;e.fa&&J(e),e=n.call(r,t)}return e}function Z(e){return(e=e[$])instanceof q?e:null}var ee="__closure_events_fn_"+(1e9*Math.random()>>>0);function te(e){return"function"==typeof e?e:(e[ee]||(e[ee]=function(t){return e.handleEvent(t)}),e[ee])}function ne(){D.call(this),this.i=new q(this),this.M=this,this.F=null}function re(e,t){var n,r=e.F;if(r)for(n=[];r;r=r.F)n.push(r);if(e=e.M,r=t.type||t,"string"==typeof t)t=new O(t,e);else if(t instanceof O)t.target=t.target||e;else{var s=t;b(t=new O(r,e),s)}if(s=!0,n)for(var i=n.length-1;0<=i;i--){var o=t.g=n[i];s=se(o,r,!0,t)&&s}if(s=se(o=t.g=e,r,!0,t)&&s,s=se(o,r,!1,t)&&s,n)for(i=0;i<n.length;i++)s=se(o=t.g=n[i],r,!1,t)&&s}function se(e,t,n,r){if(!(t=e.i.g[String(t)]))return!0;t=t.concat();for(var s=!0,i=0;i<t.length;++i){var o=t[i];if(o&&!o.da&&o.capture==n){var a=o.listener,c=o.ha||o.src;o.fa&&z(e.i,o),s=!1!==a.call(c,r)&&s}}return s&&!r.defaultPrevented}function ie(e,t,n){if("function"==typeof e)n&&(e=u(e,n));else{if(!e||"function"!=typeof e.handleEvent)throw Error("Invalid listener argument");e=u(e.handleEvent,e)}return 2147483647<Number(t)?-1:s.setTimeout(e,t||0)}function oe(e){e.g=ie((()=>{e.g=null,e.i&&(e.i=!1,oe(e))}),e.l);const t=e.h;e.h=null,e.m.apply(null,t)}h(ne,D),ne.prototype[U]=!0,ne.prototype.removeEventListener=function(e,t,n,r){Q(this,e,t,n,r)},ne.prototype.N=function(){if(ne.aa.N.call(this),this.i){var e,t=this.i;for(e in t.g){for(var n=t.g[e],r=0;r<n.length;r++)B(n[r]);delete t.g[e],t.h--}}this.F=null},ne.prototype.K=function(e,t,n,r){return this.i.add(String(e),t,!1,n,r)},ne.prototype.L=function(e,t,n,r){return this.i.add(String(e),t,!0,n,r)};class ae extends D{constructor(e,t){super(),this.m=e,this.l=t,this.h=null,this.i=!1,this.g=null}j(e){this.h=arguments,this.g?this.i=!0:oe(this)}N(){super.N(),this.g&&(s.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ce(e){D.call(this),this.h=e,this.g={}}h(ce,D);var ue=[];function le(e){v(e.g,(function(e,t){this.g.hasOwnProperty(t)&&J(e)}),e),e.g={}}ce.prototype.N=function(){ce.aa.N.call(this),le(this)},ce.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var he=s.JSON.stringify,de=s.JSON.parse,fe=class{stringify(e){return s.JSON.stringify(e,void 0)}parse(e){return s.JSON.parse(e,void 0)}};function pe(){}function ge(e){return e.h||(e.h=e.i())}function me(){}pe.prototype.h=null;var ye={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function ve(){O.call(this,"d")}function we(){O.call(this,"c")}h(ve,O),h(we,O);var _e={},be=null;function Ie(){return be=be||new ne}function Te(e){O.call(this,_e.La,e)}function Ee(e){const t=Ie();re(t,new Te(t))}function Se(e,t){O.call(this,_e.STAT_EVENT,e),this.stat=t}function Ce(e){const t=Ie();re(t,new Se(t,e))}function ke(e,t){O.call(this,_e.Ma,e),this.size=t}function Ae(e,t){if("function"!=typeof e)throw Error("Fn must not be null and must be a function");return s.setTimeout((function(){e()}),t)}function Ne(){this.g=!0}function Re(e,t,n,r){e.info((function(){return"XMLHTTP TEXT ("+t+"): "+function(e,t){if(!e.g)return t;if(!t)return null;try{var n=JSON.parse(t);if(n)for(e=0;e<n.length;e++)if(Array.isArray(n[e])){var r=n[e];if(!(2>r.length)){var s=r[1];if(Array.isArray(s)&&!(1>s.length)){var i=s[0];if("noop"!=i&&"stop"!=i&&"close"!=i)for(var o=1;o<s.length;o++)s[o]=""}}}return he(n)}catch(a){return t}}(e,n)+(r?" "+r:"")}))}_e.La="serverreachability",h(Te,O),_e.STAT_EVENT="statevent",h(Se,O),_e.Ma="timingevent",h(ke,O),Ne.prototype.xa=function(){this.g=!1},Ne.prototype.info=function(){};var xe,De={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Oe={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"};function Pe(){}function Le(e,t,n,r){this.j=e,this.i=t,this.l=n,this.R=r||1,this.U=new ce(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Me}function Me(){this.i=null,this.g="",this.h=!1}h(Pe,pe),Pe.prototype.g=function(){return new XMLHttpRequest},Pe.prototype.i=function(){return{}},xe=new Pe;var Ue={},Fe={};function Ve(e,t,n){e.L=1,e.v=ht(ot(t)),e.m=n,e.P=!0,Be(e,null)}function Be(e,t){e.F=Date.now(),je(e),e.A=ot(e.v);var n=e.A,r=e.R;Array.isArray(r)||(r=[String(r)]),St(n.i,"t",r),e.C=0,n=e.j.J,e.h=new Me,e.g=fn(e.j,n?t:null,!e.m),0<e.O&&(e.M=new ae(u(e.Y,e,e.g),e.O)),t=e.U,n=e.g,r=e.ca;var s="readystatechange";Array.isArray(s)||(s&&(ue[0]=s.toString()),s=ue);for(var i=0;i<s.length;i++){var o=K(n,s[i],r||t.handleEvent,!1,t.h||t);if(!o)break;t.g[o.key]=o}t=e.H?w(e.H):{},e.m?(e.u||(e.u="POST"),t["Content-Type"]="application/x-www-form-urlencoded",e.g.ea(e.A,e.u,e.m,t)):(e.u="GET",e.g.ea(e.A,e.u,null,t)),Ee(),function(e,t,n,r,s,i){e.info((function(){if(e.g)if(i)for(var o="",a=i.split("&"),c=0;c<a.length;c++){var u=a[c].split("=");if(1<u.length){var l=u[0];u=u[1];var h=l.split("_");o=2<=h.length&&"type"==h[1]?o+(l+"=")+u+"&":o+(l+"=redacted&")}}else o=null;else o=i;return"XMLHTTP REQ ("+r+") [attempt "+s+"]: "+t+"\n"+n+"\n"+o}))}(e.i,e.u,e.A,e.l,e.R,e.m)}function qe(e){return!!e.g&&("GET"==e.u&&2!=e.L&&e.j.Ca)}function ze(e,t){var n=e.C,r=t.indexOf("\n",n);return-1==r?Fe:(n=Number(t.substring(n,r)),isNaN(n)?Ue:(r+=1)+n>t.length?Fe:(t=t.slice(r,r+n),e.C=r+n,t))}function je(e){e.S=Date.now()+e.I,$e(e,e.I)}function $e(e,t){if(null!=e.B)throw Error("WatchDog timer not null");e.B=Ae(u(e.ba,e),t)}function Ge(e){e.B&&(s.clearTimeout(e.B),e.B=null)}function Ke(e){0==e.j.G||e.J||cn(e.j,e)}function He(e){Ge(e);var t=e.M;t&&"function"==typeof t.ma&&t.ma(),e.M=null,le(e.U),e.g&&(t=e.g,e.g=null,t.abort(),t.ma())}function We(e,t){try{var n=e.j;if(0!=n.G&&(n.g==e||Ze(n.h,e)))if(!e.K&&Ze(n.h,e)&&3==n.G){try{var r=n.Da.g.parse(t)}catch(l){r=null}if(Array.isArray(r)&&3==r.length){var s=r;if(0==s[0]){e:if(!n.u){if(n.g){if(!(n.g.F+3e3<e.F))break e;an(n),Jt(n)}rn(n),Ce(18)}}else n.za=s[1],0<n.za-n.T&&37500>s[2]&&n.F&&0==n.v&&!n.C&&(n.C=Ae(u(n.Za,n),6e3));if(1>=Xe(n.h)&&n.ca){try{n.ca()}catch(l){}n.ca=void 0}}else ln(n,11)}else if((e.K||n.g==e)&&an(n),!p(t))for(s=n.Da.g.parse(t),t=0;t<s.length;t++){let u=s[t];if(n.T=u[0],u=u[1],2==n.G)if("c"==u[0]){n.K=u[1],n.ia=u[2];const t=u[3];null!=t&&(n.la=t,n.j.info("VER="+n.la));const s=u[4];null!=s&&(n.Aa=s,n.j.info("SVER="+n.Aa));const l=u[5];null!=l&&"number"==typeof l&&0<l&&(r=1.5*l,n.L=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const h=e.g;if(h){const e=h.g?h.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(e){var i=r.h;i.g||-1==e.indexOf("spdy")&&-1==e.indexOf("quic")&&-1==e.indexOf("h2")||(i.j=i.l,i.g=new Set,i.h&&(et(i,i.h),i.h=null))}if(r.D){const e=h.g?h.g.getResponseHeader("X-HTTP-Session-Id"):null;e&&(r.ya=e,lt(r.I,r.D,e))}}n.G=3,n.l&&n.l.ua(),n.ba&&(n.R=Date.now()-e.F,n.j.info("Handshake RTT: "+n.R+"ms"));var o=e;if((r=n).qa=dn(r,r.J?r.ia:null,r.W),o.K){tt(r.h,o);var a=o,c=r.L;c&&(a.I=c),a.B&&(Ge(a),je(a)),r.g=o}else nn(r);0<n.i.length&&Xt(n)}else"stop"!=u[0]&&"close"!=u[0]||ln(n,7);else 3==n.G&&("stop"==u[0]||"close"==u[0]?"stop"==u[0]?ln(n,7):Qt(n):"noop"!=u[0]&&n.l&&n.l.ta(u),n.v=0)}Ee()}catch(l){}}Le.prototype.ca=function(e){e=e.target;const t=this.M;t&&3==Gt(e)?t.j():this.Y(e)},Le.prototype.Y=function(e){try{if(e==this.g)e:{const d=Gt(this.g);var t=this.g.Ba();this.g.Z();if(!(3>d)&&(3!=d||this.g&&(this.h.h||this.g.oa()||Kt(this.g)))){this.J||4!=d||7==t||Ee(),Ge(this);var n=this.g.Z();this.X=n;t:if(qe(this)){var r=Kt(this.g);e="";var i=r.length,o=4==Gt(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){He(this),Ke(this);var a="";break t}this.h.i=new s.TextDecoder}for(t=0;t<i;t++)this.h.h=!0,e+=this.h.i.decode(r[t],{stream:!(o&&t==i-1)});r.length=0,this.h.g+=e,this.C=0,a=this.h.g}else a=this.g.oa();if(this.o=200==n,function(e,t,n,r,s,i,o){e.info((function(){return"XMLHTTP RESP ("+r+") [ attempt "+s+"]: "+t+"\n"+n+"\n"+i+" "+o}))}(this.i,this.u,this.A,this.l,this.R,d,n),this.o){if(this.T&&!this.K){t:{if(this.g){var c,u=this.g;if((c=u.g?u.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!p(c)){var l=c;break t}}l=null}if(!(n=l)){this.o=!1,this.s=3,Ce(12),He(this),Ke(this);break e}Re(this.i,this.l,n,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,We(this,n)}if(this.P){let e;for(n=!0;!this.J&&this.C<a.length;){if(e=ze(this,a),e==Fe){4==d&&(this.s=4,Ce(14),n=!1),Re(this.i,this.l,null,"[Incomplete Response]");break}if(e==Ue){this.s=4,Ce(15),Re(this.i,this.l,a,"[Invalid Chunk]"),n=!1;break}Re(this.i,this.l,e,null),We(this,e)}if(qe(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=d||0!=a.length||this.h.h||(this.s=1,Ce(16),n=!1),this.o=this.o&&n,n){if(0<a.length&&!this.W){this.W=!0;var h=this.j;h.g==this&&h.ba&&!h.M&&(h.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),sn(h),h.M=!0,Ce(11))}}else Re(this.i,this.l,a,"[Invalid Chunked Response]"),He(this),Ke(this)}else Re(this.i,this.l,a,null),We(this,a);4==d&&He(this),this.o&&!this.J&&(4==d?cn(this.j,this):(this.o=!1,je(this)))}else(function(e){const t={};e=(e.g&&2<=Gt(e)&&e.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<e.length;r++){if(p(e[r]))continue;var n=I(e[r]);const s=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const i=t[s]||[];t[s]=i,i.push(n)}!function(e,t){for(const n in e)t.call(void 0,e[n],n,e)}(t,(function(e){return e.join(", ")}))})(this.g),400==n&&0<a.indexOf("Unknown SID")?(this.s=3,Ce(12)):(this.s=0,Ce(13)),He(this),Ke(this)}}}catch(d){}},Le.prototype.cancel=function(){this.J=!0,He(this)},Le.prototype.ba=function(){this.B=null;const e=Date.now();0<=e-this.S?(function(e,t){e.info((function(){return"TIMEOUT: "+t}))}(this.i,this.A),2!=this.L&&(Ee(),Ce(17)),He(this),this.s=2,Ke(this)):$e(this,this.S-e)};var Qe=class{constructor(e,t){this.g=e,this.map=t}};function Je(e){this.l=e||10,s.PerformanceNavigationTiming?e=0<(e=s.performance.getEntriesByType("navigation")).length&&("hq"==e[0].nextHopProtocol||"h2"==e[0].nextHopProtocol):e=!!(s.chrome&&s.chrome.loadTimes&&s.chrome.loadTimes()&&s.chrome.loadTimes().wasFetchedViaSpdy),this.j=e?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function Ye(e){return!!e.h||!!e.g&&e.g.size>=e.j}function Xe(e){return e.h?1:e.g?e.g.size:0}function Ze(e,t){return e.h?e.h==t:!!e.g&&e.g.has(t)}function et(e,t){e.g?e.g.add(t):e.h=t}function tt(e,t){e.h&&e.h==t?e.h=null:e.g&&e.g.has(t)&&e.g.delete(t)}function nt(e){if(null!=e.h)return e.i.concat(e.h.D);if(null!=e.g&&0!==e.g.size){let t=e.i;for(const n of e.g.values())t=t.concat(n.D);return t}return d(e.i)}function rt(e,t){if(e.forEach&&"function"==typeof e.forEach)e.forEach(t,void 0);else if(i(e)||"string"==typeof e)Array.prototype.forEach.call(e,t,void 0);else for(var n=function(e){if(e.na&&"function"==typeof e.na)return e.na();if(!e.V||"function"!=typeof e.V){if("undefined"!=typeof Map&&e instanceof Map)return Array.from(e.keys());if(!("undefined"!=typeof Set&&e instanceof Set)){if(i(e)||"string"==typeof e){var t=[];e=e.length;for(var n=0;n<e;n++)t.push(n);return t}t=[],n=0;for(const r in e)t[n++]=r;return t}}}(e),r=function(e){if(e.V&&"function"==typeof e.V)return e.V();if("undefined"!=typeof Map&&e instanceof Map||"undefined"!=typeof Set&&e instanceof Set)return Array.from(e.values());if("string"==typeof e)return e.split("");if(i(e)){for(var t=[],n=e.length,r=0;r<n;r++)t.push(e[r]);return t}for(r in t=[],n=0,e)t[n++]=e[r];return t}(e),s=r.length,o=0;o<s;o++)t.call(void 0,r[o],n&&n[o],e)}Je.prototype.cancel=function(){if(this.i=nt(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const e of this.g.values())e.cancel();this.g.clear()}};var st=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function it(e){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,e instanceof it){this.h=e.h,at(this,e.j),this.o=e.o,this.g=e.g,ct(this,e.s),this.l=e.l;var t=e.i,n=new bt;n.i=t.i,t.g&&(n.g=new Map(t.g),n.h=t.h),ut(this,n),this.m=e.m}else e&&(t=String(e).match(st))?(this.h=!1,at(this,t[1]||"",!0),this.o=dt(t[2]||""),this.g=dt(t[3]||"",!0),ct(this,t[4]),this.l=dt(t[5]||"",!0),ut(this,t[6]||"",!0),this.m=dt(t[7]||"")):(this.h=!1,this.i=new bt(null,this.h))}function ot(e){return new it(e)}function at(e,t,n){e.j=n?dt(t,!0):t,e.j&&(e.j=e.j.replace(/:$/,""))}function ct(e,t){if(t){if(t=Number(t),isNaN(t)||0>t)throw Error("Bad port number "+t);e.s=t}else e.s=null}function ut(e,t,n){t instanceof bt?(e.i=t,function(e,t){t&&!e.j&&(It(e),e.i=null,e.g.forEach((function(e,t){var n=t.toLowerCase();t!=n&&(Tt(this,t),St(this,n,e))}),e)),e.j=t}(e.i,e.h)):(n||(t=ft(t,wt)),e.i=new bt(t,e.h))}function lt(e,t,n){e.i.set(t,n)}function ht(e){return lt(e,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),e}function dt(e,t){return e?t?decodeURI(e.replace(/%25/g,"%2525")):decodeURIComponent(e):""}function ft(e,t,n){return"string"==typeof e?(e=encodeURI(e).replace(t,pt),n&&(e=e.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),e):null}function pt(e){return"%"+((e=e.charCodeAt(0))>>4&15).toString(16)+(15&e).toString(16)}it.prototype.toString=function(){var e=[],t=this.j;t&&e.push(ft(t,mt,!0),":");var n=this.g;return(n||"file"==t)&&(e.push("//"),(t=this.o)&&e.push(ft(t,mt,!0),"@"),e.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.s)&&e.push(":",String(n))),(n=this.l)&&(this.g&&"/"!=n.charAt(0)&&e.push("/"),e.push(ft(n,"/"==n.charAt(0)?vt:yt,!0))),(n=this.i.toString())&&e.push("?",n),(n=this.m)&&e.push("#",ft(n,_t)),e.join("")};var gt,mt=/[#\/\?@]/g,yt=/[#\?:]/g,vt=/[#\?]/g,wt=/[#\?@]/g,_t=/#/g;function bt(e,t){this.h=this.g=null,this.i=e||null,this.j=!!t}function It(e){e.g||(e.g=new Map,e.h=0,e.i&&function(e,t){if(e){e=e.split("&");for(var n=0;n<e.length;n++){var r=e[n].indexOf("="),s=null;if(0<=r){var i=e[n].substring(0,r);s=e[n].substring(r+1)}else i=e[n];t(i,s?decodeURIComponent(s.replace(/\+/g," ")):"")}}}(e.i,(function(t,n){e.add(decodeURIComponent(t.replace(/\+/g," ")),n)})))}function Tt(e,t){It(e),t=Ct(e,t),e.g.has(t)&&(e.i=null,e.h-=e.g.get(t).length,e.g.delete(t))}function Et(e,t){return It(e),t=Ct(e,t),e.g.has(t)}function St(e,t,n){Tt(e,t),0<n.length&&(e.i=null,e.g.set(Ct(e,t),d(n)),e.h+=n.length)}function Ct(e,t){return t=String(t),e.j&&(t=t.toLowerCase()),t}function kt(e,t,n,r,s){try{s&&(s.onload=null,s.onerror=null,s.onabort=null,s.ontimeout=null),r(n)}catch(i){}}function At(){this.g=new fe}function Nt(e,t,n){const r=n||"";try{rt(e,(function(e,n){let s=e;o(e)&&(s=he(e)),t.push(r+n+"="+encodeURIComponent(s))}))}catch(s){throw t.push(r+"type="+encodeURIComponent("_badmap")),s}}function Rt(e){this.l=e.Ub||null,this.j=e.eb||!1}function xt(e,t){ne.call(this),this.D=e,this.o=t,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}function Dt(e){e.j.read().then(e.Pa.bind(e)).catch(e.ga.bind(e))}function Ot(e){e.readyState=4,e.l=null,e.j=null,e.v=null,Pt(e)}function Pt(e){e.onreadystatechange&&e.onreadystatechange.call(e)}function Lt(e){let t="";return v(e,(function(e,n){t+=n,t+=":",t+=e,t+="\r\n"})),t}function Mt(e,t,n){e:{for(r in n){var r=!1;break e}r=!0}r||(n=Lt(n),"string"==typeof e?null!=n&&encodeURIComponent(String(n)):lt(e,t,n))}function Ut(e){ne.call(this),this.headers=new Map,this.o=e||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}(e=bt.prototype).add=function(e,t){It(this),this.i=null,e=Ct(this,e);var n=this.g.get(e);return n||this.g.set(e,n=[]),n.push(t),this.h+=1,this},e.forEach=function(e,t){It(this),this.g.forEach((function(n,r){n.forEach((function(n){e.call(t,n,r,this)}),this)}),this)},e.na=function(){It(this);const e=Array.from(this.g.values()),t=Array.from(this.g.keys()),n=[];for(let r=0;r<t.length;r++){const s=e[r];for(let e=0;e<s.length;e++)n.push(t[r])}return n},e.V=function(e){It(this);let t=[];if("string"==typeof e)Et(this,e)&&(t=t.concat(this.g.get(Ct(this,e))));else{e=Array.from(this.g.values());for(let n=0;n<e.length;n++)t=t.concat(e[n])}return t},e.set=function(e,t){return It(this),this.i=null,Et(this,e=Ct(this,e))&&(this.h-=this.g.get(e).length),this.g.set(e,[t]),this.h+=1,this},e.get=function(e,t){return e&&0<(e=this.V(e)).length?String(e[0]):t},e.toString=function(){if(this.i)return this.i;if(!this.g)return"";const e=[],t=Array.from(this.g.keys());for(var n=0;n<t.length;n++){var r=t[n];const i=encodeURIComponent(String(r)),o=this.V(r);for(r=0;r<o.length;r++){var s=i;""!==o[r]&&(s+="="+encodeURIComponent(String(o[r]))),e.push(s)}}return this.i=e.join("&")},h(Rt,pe),Rt.prototype.g=function(){return new xt(this.l,this.j)},Rt.prototype.i=(gt={},function(){return gt}),h(xt,ne),(e=xt.prototype).open=function(e,t){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.B=e,this.A=t,this.readyState=1,Pt(this)},e.send=function(e){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;const t={headers:this.u,method:this.B,credentials:this.m,cache:void 0};e&&(t.body=e),(this.D||s).fetch(new Request(this.A,t)).then(this.Sa.bind(this),this.ga.bind(this))},e.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch((()=>{})),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,Ot(this)),this.readyState=0},e.Sa=function(e){if(this.g&&(this.l=e,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=e.headers,this.readyState=2,Pt(this)),this.g&&(this.readyState=3,Pt(this),this.g)))if("arraybuffer"===this.responseType)e.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(void 0!==s.ReadableStream&&"body"in e){if(this.j=e.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;Dt(this)}else e.text().then(this.Ra.bind(this),this.ga.bind(this))},e.Pa=function(e){if(this.g){if(this.o&&e.value)this.response.push(e.value);else if(!this.o){var t=e.value?e.value:new Uint8Array(0);(t=this.v.decode(t,{stream:!e.done}))&&(this.response=this.responseText+=t)}e.done?Ot(this):Pt(this),3==this.readyState&&Dt(this)}},e.Ra=function(e){this.g&&(this.response=this.responseText=e,Ot(this))},e.Qa=function(e){this.g&&(this.response=e,Ot(this))},e.ga=function(){this.g&&Ot(this)},e.setRequestHeader=function(e,t){this.u.append(e,t)},e.getResponseHeader=function(e){return this.h&&this.h.get(e.toLowerCase())||""},e.getAllResponseHeaders=function(){if(!this.h)return"";const e=[],t=this.h.entries();for(var n=t.next();!n.done;)n=n.value,e.push(n[0]+": "+n[1]),n=t.next();return e.join("\r\n")},Object.defineProperty(xt.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(e){this.m=e?"include":"same-origin"}}),h(Ut,ne);var Ft=/^https?$/i,Vt=["POST","PUT"];function Bt(e,t){e.h=!1,e.g&&(e.j=!0,e.g.abort(),e.j=!1),e.l=t,e.m=5,qt(e),jt(e)}function qt(e){e.A||(e.A=!0,re(e,"complete"),re(e,"error"))}function zt(e){if(e.h&&void 0!==r&&(!e.v[1]||4!=Gt(e)||2!=e.Z()))if(e.u&&4==Gt(e))ie(e.Ea,0,e);else if(re(e,"readystatechange"),4==Gt(e)){e.h=!1;try{const r=e.Z();e:switch(r){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var t=!0;break e;default:t=!1}var n;if(!(n=t)){var i;if(i=0===r){var o=String(e.D).match(st)[1]||null;!o&&s.self&&s.self.location&&(o=s.self.location.protocol.slice(0,-1)),i=!Ft.test(o?o.toLowerCase():"")}n=i}if(n)re(e,"complete"),re(e,"success");else{e.m=6;try{var a=2<Gt(e)?e.g.statusText:""}catch(c){a=""}e.l=a+" ["+e.Z()+"]",qt(e)}}finally{jt(e)}}}function jt(e,t){if(e.g){$t(e);const r=e.g,s=e.v[0]?()=>{}:null;e.g=null,e.v=null,t||re(e,"ready");try{r.onreadystatechange=s}catch(n){}}}function $t(e){e.I&&(s.clearTimeout(e.I),e.I=null)}function Gt(e){return e.g?e.g.readyState:0}function Kt(e){try{if(!e.g)return null;if("response"in e.g)return e.g.response;switch(e.H){case"":case"text":return e.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in e.g)return e.g.mozResponseArrayBuffer}return null}catch(t){return null}}function Ht(e,t,n){return n&&n.internalChannelParams&&n.internalChannelParams[e]||t}function Wt(e){this.Aa=0,this.i=[],this.j=new Ne,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=Ht("failFast",!1,e),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=Ht("baseRetryDelayMs",5e3,e),this.cb=Ht("retryDelaySeedMs",1e4,e),this.Wa=Ht("forwardChannelMaxRetries",2,e),this.wa=Ht("forwardChannelRequestTimeoutMs",2e4,e),this.pa=e&&e.xmlHttpFactory||void 0,this.Xa=e&&e.Tb||void 0,this.Ca=e&&e.useFetchStreams||!1,this.L=void 0,this.J=e&&e.supportsCrossDomainXhr||!1,this.K="",this.h=new Je(e&&e.concurrentRequestLimit),this.Da=new At,this.P=e&&e.fastHandshake||!1,this.O=e&&e.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=e&&e.Rb||!1,e&&e.xa&&this.j.xa(),e&&e.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&e&&e.detectBufferingProxy||!1,this.ja=void 0,e&&e.longPollingTimeout&&0<e.longPollingTimeout&&(this.ja=e.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}function Qt(e){if(Yt(e),3==e.G){var t=e.U++,n=ot(e.I);if(lt(n,"SID",e.K),lt(n,"RID",t),lt(n,"TYPE","terminate"),en(e,n),(t=new Le(e,e.j,t)).L=2,t.v=ht(ot(n)),n=!1,s.navigator&&s.navigator.sendBeacon)try{n=s.navigator.sendBeacon(t.v.toString(),"")}catch(r){}!n&&s.Image&&((new Image).src=t.v,n=!0),n||(t.g=fn(t.j,null),t.g.ea(t.v)),t.F=Date.now(),je(t)}hn(e)}function Jt(e){e.g&&(sn(e),e.g.cancel(),e.g=null)}function Yt(e){Jt(e),e.u&&(s.clearTimeout(e.u),e.u=null),an(e),e.h.cancel(),e.s&&("number"==typeof e.s&&s.clearTimeout(e.s),e.s=null)}function Xt(e){if(!Ye(e.h)&&!e.s){e.s=!0;var t=e.Ga;k||R(),A||(k(),A=!0),N.add(t,e),e.B=0}}function Zt(e,t){var n;n=t?t.l:e.U++;const r=ot(e.I);lt(r,"SID",e.K),lt(r,"RID",n),lt(r,"AID",e.T),en(e,r),e.m&&e.o&&Mt(r,e.m,e.o),n=new Le(e,e.j,n,e.B+1),null===e.m&&(n.H=e.o),t&&(e.i=t.D.concat(e.i)),t=tn(e,n,1e3),n.I=Math.round(.5*e.wa)+Math.round(.5*e.wa*Math.random()),et(e.h,n),Ve(n,r,t)}function en(e,t){e.H&&v(e.H,(function(e,n){lt(t,n,e)})),e.l&&rt({},(function(e,n){lt(t,n,e)}))}function tn(e,t,n){n=Math.min(e.i.length,n);var r=e.l?u(e.l.Na,e.l,e):null;e:{var s=e.i;let t=-1;for(;;){const e=["count="+n];-1==t?0<n?(t=s[0].g,e.push("ofs="+t)):t=0:e.push("ofs="+t);let o=!0;for(let a=0;a<n;a++){let n=s[a].g;const c=s[a].map;if(n-=t,0>n)t=Math.max(0,s[a].g-100),o=!1;else try{Nt(c,e,"req"+n+"_")}catch(i){r&&r(c)}}if(o){r=e.join("&");break e}}}return e=e.i.splice(0,n),t.D=e,r}function nn(e){if(!e.g&&!e.u){e.Y=1;var t=e.Fa;k||R(),A||(k(),A=!0),N.add(t,e),e.v=0}}function rn(e){return!(e.g||e.u||3<=e.v)&&(e.Y++,e.u=Ae(u(e.Fa,e),un(e,e.v)),e.v++,!0)}function sn(e){null!=e.A&&(s.clearTimeout(e.A),e.A=null)}function on(e){e.g=new Le(e,e.j,"rpc",e.Y),null===e.m&&(e.g.H=e.o),e.g.O=0;var t=ot(e.qa);lt(t,"RID","rpc"),lt(t,"SID",e.K),lt(t,"AID",e.T),lt(t,"CI",e.F?"0":"1"),!e.F&&e.ja&&lt(t,"TO",e.ja),lt(t,"TYPE","xmlhttp"),en(e,t),e.m&&e.o&&Mt(t,e.m,e.o),e.L&&(e.g.I=e.L);var n=e.g;e=e.ia,n.L=1,n.v=ht(ot(t)),n.m=null,n.P=!0,Be(n,e)}function an(e){null!=e.C&&(s.clearTimeout(e.C),e.C=null)}function cn(e,t){var n=null;if(e.g==t){an(e),sn(e),e.g=null;var r=2}else{if(!Ze(e.h,t))return;n=t.D,tt(e.h,t),r=1}if(0!=e.G)if(t.o)if(1==r){n=t.m?t.m.length:0,t=Date.now()-t.F;var s=e.B;re(r=Ie(),new ke(r,n)),Xt(e)}else nn(e);else if(3==(s=t.s)||0==s&&0<t.X||!(1==r&&function(e,t){return!(Xe(e.h)>=e.h.j-(e.s?1:0)||(e.s?(e.i=t.D.concat(e.i),0):1==e.G||2==e.G||e.B>=(e.Va?0:e.Wa)||(e.s=Ae(u(e.Ga,e,t),un(e,e.B)),e.B++,0)))}(e,t)||2==r&&rn(e)))switch(n&&0<n.length&&(t=e.h,t.i=t.i.concat(n)),s){case 1:ln(e,5);break;case 4:ln(e,10);break;case 3:ln(e,6);break;default:ln(e,2)}}function un(e,t){let n=e.Ta+Math.floor(Math.random()*e.cb);return e.isActive()||(n*=2),n*t}function ln(e,t){if(e.j.info("Error code "+t),2==t){var n=u(e.fb,e),r=e.Xa;const t=!r;r=new it(r||"//www.google.com/images/cleardot.gif"),s.location&&"http"==s.location.protocol||at(r,"https"),ht(r),t?function(e,t){const n=new Ne;if(s.Image){const r=new Image;r.onload=l(kt,n,"TestLoadImage: loaded",!0,t,r),r.onerror=l(kt,n,"TestLoadImage: error",!1,t,r),r.onabort=l(kt,n,"TestLoadImage: abort",!1,t,r),r.ontimeout=l(kt,n,"TestLoadImage: timeout",!1,t,r),s.setTimeout((function(){r.ontimeout&&r.ontimeout()}),1e4),r.src=e}else t(!1)}(r.toString(),n):function(e,t){new Ne;const n=new AbortController,r=setTimeout((()=>{n.abort(),kt(0,0,!1,t)}),1e4);fetch(e,{signal:n.signal}).then((e=>{clearTimeout(r),e.ok?kt(0,0,!0,t):kt(0,0,!1,t)})).catch((()=>{clearTimeout(r),kt(0,0,!1,t)}))}(r.toString(),n)}else Ce(2);e.G=0,e.l&&e.l.sa(t),hn(e),Yt(e)}function hn(e){if(e.G=0,e.ka=[],e.l){const t=nt(e.h);0==t.length&&0==e.i.length||(f(e.ka,t),f(e.ka,e.i),e.h.i.length=0,d(e.i),e.i.length=0),e.l.ra()}}function dn(e,t,n){var r=n instanceof it?ot(n):new it(n);if(""!=r.g)t&&(r.g=t+"."+r.g),ct(r,r.s);else{var i=s.location;r=i.protocol,t=t?t+"."+i.hostname:i.hostname,i=+i.port;var o=new it(null);r&&at(o,r),t&&(o.g=t),i&&ct(o,i),n&&(o.l=n),r=o}return n=e.D,t=e.ya,n&&t&&lt(r,n,t),lt(r,"VER",e.la),en(e,r),r}function fn(e,t,n){if(t&&!e.J)throw Error("Can't create secondary domain capable XhrIo object.");return(t=e.Ca&&!e.pa?new Ut(new Rt({eb:n})):new Ut(e.pa)).Ha(e.J),t}function pn(){}function gn(){}function mn(e,t){ne.call(this),this.g=new Wt(t),this.l=e,this.h=t&&t.messageUrlParams||null,e=t&&t.messageHeaders||null,t&&t.clientProtocolHeaderRequired&&(e?e["X-Client-Protocol"]="webchannel":e={"X-Client-Protocol":"webchannel"}),this.g.o=e,e=t&&t.initMessageHeaders||null,t&&t.messageContentType&&(e?e["X-WebChannel-Content-Type"]=t.messageContentType:e={"X-WebChannel-Content-Type":t.messageContentType}),t&&t.va&&(e?e["X-WebChannel-Client-Profile"]=t.va:e={"X-WebChannel-Client-Profile":t.va}),this.g.S=e,(e=t&&t.Sb)&&!p(e)&&(this.g.m=e),this.v=t&&t.supportsCrossDomainXhr||!1,this.u=t&&t.sendRawJson||!1,(t=t&&t.httpSessionIdParam)&&!p(t)&&(this.g.D=t,null!==(e=this.h)&&t in e&&(t in(e=this.h)&&delete e[t])),this.j=new wn(this)}function yn(e){ve.call(this),e.__headers__&&(this.headers=e.__headers__,this.statusCode=e.__status__,delete e.__headers__,delete e.__status__);var t=e.__sm__;if(t){e:{for(const n in t){e=n;break e}e=void 0}(this.i=e)&&(e=this.i,t=null!==t&&e in t?t[e]:void 0),this.data=t}else this.data=e}function vn(){we.call(this),this.status=1}function wn(e){this.g=e}(e=Ut.prototype).Ha=function(e){this.J=e},e.ea=function(e,t,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+e);t=t?t.toUpperCase():"GET",this.D=e,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():xe.g(),this.v=this.o?ge(this.o):ge(xe),this.g.onreadystatechange=u(this.Ea,this);try{this.B=!0,this.g.open(t,String(e),!0),this.B=!1}catch(o){return void Bt(this,o)}if(e=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var i in r)n.set(i,r[i]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const e of r.keys())n.set(e,r.get(e))}r=Array.from(n.keys()).find((e=>"content-type"==e.toLowerCase())),i=s.FormData&&e instanceof s.FormData,!(0<=Array.prototype.indexOf.call(Vt,t,void 0))||r||i||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[s,a]of n)this.g.setRequestHeader(s,a);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{$t(this),this.u=!0,this.g.send(e),this.u=!1}catch(o){Bt(this,o)}},e.abort=function(e){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=e||7,re(this,"complete"),re(this,"abort"),jt(this))},e.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),jt(this,!0)),Ut.aa.N.call(this)},e.Ea=function(){this.s||(this.B||this.u||this.j?zt(this):this.bb())},e.bb=function(){zt(this)},e.isActive=function(){return!!this.g},e.Z=function(){try{return 2<Gt(this)?this.g.status:-1}catch(gt){return-1}},e.oa=function(){try{return this.g?this.g.responseText:""}catch(gt){return""}},e.Oa=function(e){if(this.g){var t=this.g.responseText;return e&&0==t.indexOf(e)&&(t=t.substring(e.length)),de(t)}},e.Ba=function(){return this.m},e.Ka=function(){return"string"==typeof this.l?this.l:String(this.l)},(e=Wt.prototype).la=8,e.G=1,e.connect=function(e,t,n,r){Ce(0),this.W=e,this.H=t||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.I=dn(this,null,this.W),Xt(this)},e.Ga=function(e){if(this.s)if(this.s=null,1==this.G){if(!e){this.U=Math.floor(1e5*Math.random()),e=this.U++;const s=new Le(this,this.j,e);let i=this.o;if(this.S&&(i?(i=w(i),b(i,this.S)):i=this.S),null!==this.m||this.O||(s.H=i,i=null),this.P)e:{for(var t=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if(4096<(t+=r)){t=n;break e}if(4096===t||n===this.i.length-1){t=n+1;break e}}t=1e3}else t=1e3;t=tn(this,s,t),lt(n=ot(this.I),"RID",e),lt(n,"CVER",22),this.D&&lt(n,"X-HTTP-Session-Id",this.D),en(this,n),i&&(this.O?t="headers="+encodeURIComponent(String(Lt(i)))+"&"+t:this.m&&Mt(n,this.m,i)),et(this.h,s),this.Ua&&lt(n,"TYPE","init"),this.P?(lt(n,"$req",t),lt(n,"SID","null"),s.T=!0,Ve(s,n,null)):Ve(s,n,t),this.G=2}}else 3==this.G&&(e?Zt(this,e):0==this.i.length||Ye(this.h)||Zt(this))},e.Fa=function(){if(this.u=null,on(this),this.ba&&!(this.M||null==this.g||0>=this.R)){var e=2*this.R;this.j.info("BP detection timer enabled: "+e),this.A=Ae(u(this.ab,this),e)}},e.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,Ce(10),Jt(this),on(this))},e.Za=function(){null!=this.C&&(this.C=null,Jt(this),rn(this),Ce(19))},e.fb=function(e){e?(this.j.info("Successfully pinged google.com"),Ce(2)):(this.j.info("Failed to ping google.com"),Ce(1))},e.isActive=function(){return!!this.l&&this.l.isActive(this)},(e=pn.prototype).ua=function(){},e.ta=function(){},e.sa=function(){},e.ra=function(){},e.isActive=function(){return!0},e.Na=function(){},gn.prototype.g=function(e,t){return new mn(e,t)},h(mn,ne),mn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},mn.prototype.close=function(){Qt(this.g)},mn.prototype.o=function(e){var t=this.g;if("string"==typeof e){var n={};n.__data__=e,e=n}else this.u&&((n={}).__data__=he(e),e=n);t.i.push(new Qe(t.Ya++,e)),3==t.G&&Xt(t)},mn.prototype.N=function(){this.g.l=null,delete this.j,Qt(this.g),delete this.g,mn.aa.N.call(this)},h(yn,ve),h(vn,we),h(wn,pn),wn.prototype.ua=function(){re(this.g,"a")},wn.prototype.ta=function(e){re(this.g,new yn(e))},wn.prototype.sa=function(e){re(this.g,new vn)},wn.prototype.ra=function(){re(this.g,"b")},gn.prototype.createWebChannel=gn.prototype.g,mn.prototype.send=mn.prototype.o,mn.prototype.open=mn.prototype.m,mn.prototype.close=mn.prototype.close,ls=function(){return new gn},us=function(){return Ie()},cs=_e,as={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},De.NO_ERROR=0,De.TIMEOUT=8,De.HTTP_ERROR=6,os=De,Oe.COMPLETE="complete",is=Oe,me.EventType=ye,ye.OPEN="a",ye.CLOSE="b",ye.ERROR="c",ye.MESSAGE="d",ne.prototype.listen=ne.prototype.K,ss=me,Ut.prototype.listenOnce=Ut.prototype.L,Ut.prototype.getLastError=Ut.prototype.Ka,Ut.prototype.getLastErrorCode=Ut.prototype.Ba,Ut.prototype.getStatus=Ut.prototype.Z,Ut.prototype.getResponseJson=Ut.prototype.Oa,Ut.prototype.getResponseText=Ut.prototype.oa,Ut.prototype.send=Ut.prototype.ea,Ut.prototype.setWithCredentials=Ut.prototype.Ha,rs=Ut}).apply(void 0!==hs?hs:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});const ds="@firebase/firestore",fs="4.7.12";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ps{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}ps.UNAUTHENTICATED=new ps(null),ps.GOOGLE_CREDENTIALS=new ps("google-credentials-uid"),ps.FIRST_PARTY=new ps("first-party-uid"),ps.MOCK_USER=new ps("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let gs="11.7.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ms=new q("@firebase/firestore");function ys(){return ms.logLevel}function vs(e,...t){if(ms.logLevel<=L.DEBUG){const n=t.map(bs);ms.debug(`Firestore (${gs}): ${e}`,...n)}}function ws(e,...t){if(ms.logLevel<=L.ERROR){const n=t.map(bs);ms.error(`Firestore (${gs}): ${e}`,...n)}}function _s(e,...t){if(ms.logLevel<=L.WARN){const n=t.map(bs);ms.warn(`Firestore (${gs}): ${e}`,...n)}}function bs(e){if("string"==typeof e)return e;try{
/**
    * @license
    * Copyright 2020 Google LLC
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */
return t=e,JSON.stringify(t)}catch(n){return e}var t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Is(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,Ts(e,r,n)}function Ts(e,t,n){let r=`FIRESTORE (${gs}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(s){r+=" CONTEXT: "+n}throw ws(r),new Error(r)}function Es(e,t,n,r){let s="Unexpected state";"string"==typeof n?s=n:r=n,e||Ts(t,s,r)}function Ss(e,t){return e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cs={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ks extends v{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class As{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ns{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class Rs{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(ps.UNAUTHENTICATED)))}shutdown(){}}class xs{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class Ds{constructor(e){this.t=e,this.currentUser=ps.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){Es(void 0===this.o,42304);let n=this.i;const r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve();let s=new As;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new As,e.enqueueRetryable((()=>r(this.currentUser)))};const i=()=>{const t=s;e.enqueueRetryable((async()=>{await t.promise,await r(this.currentUser)}))},o=e=>{vs("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),i())};this.t.onInit((e=>o(e))),setTimeout((()=>{if(!this.auth){const e=this.t.getImmediate({optional:!0});e?o(e):(vs("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new As)}}),0),i()}getToken(){const e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((t=>this.i!==e?(vs("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(Es("string"==typeof t.accessToken,31837,{l:t}),new Ns(t.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return Es(null===e||"string"==typeof e,2055,{h:e}),new ps(e)}}class Os{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=ps.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);const e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class Ps{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new Os(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable((()=>t(ps.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Ls{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Ms{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ce(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){Es(void 0===this.o,3512);const n=e=>{null!=e.error&&vs("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);const n=e.token!==this.m;return this.m=e.token,vs("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable((()=>n(t)))};const r=e=>{vs("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((e=>r(e))),setTimeout((()=>{if(!this.appCheck){const e=this.V.getImmediate({optional:!0});e?r(e):vs("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new Ls(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((e=>e?(Es("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new Ls(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Us(e){const t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(e);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let r=0;r<e;r++)n[r]=Math.floor(256*Math.random());return n}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fs(){return new TextEncoder}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vs{static newId(){const e=62*Math.floor(256/62);let t="";for(;t.length<20;){const n=Us(40);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function Bs(e,t){return e<t?-1:e>t?1:0}function qs(e,t){let n=0;for(;n<e.length&&n<t.length;){const r=e.codePointAt(n),s=t.codePointAt(n);if(r!==s){if(r<128&&s<128)return Bs(r,s);{const i=Fs(),o=js(i.encode(zs(e,n)),i.encode(zs(t,n)));return 0!==o?o:Bs(r,s)}}n+=r>65535?2:1}return Bs(e.length,t.length)}function zs(e,t){return e.codePointAt(t)>65535?e.substring(t,t+2):e.substring(t,t+1)}function js(e,t){for(let n=0;n<e.length&&n<t.length;++n)if(e[n]!==t[n])return Bs(e[n],t[n]);return Bs(e.length,t.length)}function $s(e,t,n){return e.length===t.length&&e.every(((e,r)=>n(e,t[r])))}function Gs(e){return e+"\0"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ks=-62135596800,Hs=1e6;class Ws{static now(){return Ws.fromMillis(Date.now())}static fromDate(e){return Ws.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),n=Math.floor((e-1e3*t)*Hs);return new Ws(t,n)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new ks(Cs.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new ks(Cs.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Ks)throw new ks(Cs.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new ks(Cs.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Hs}_compareTo(e){return this.seconds===e.seconds?Bs(this.nanoseconds,e.nanoseconds):Bs(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const e=this.seconds-Ks;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qs{static fromTimestamp(e){return new Qs(e)}static min(){return new Qs(new Ws(0,0))}static max(){return new Qs(new Ws(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Js="__name__";class Ys{constructor(e,t,n){void 0===t?t=0:t>e.length&&Is(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&Is(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===Ys.comparator(this,e)}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof Ys?e.forEach((e=>{t.push(e)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const n=Math.min(e.length,t.length);for(let r=0;r<n;r++){const n=Ys.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return Bs(e.length,t.length)}static compareSegments(e,t){const n=Ys.isNumericId(e),r=Ys.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?Ys.extractNumericId(e).compare(Ys.extractNumericId(t)):qs(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return es.fromString(e.substring(4,e.length-2))}}class Xs extends Ys{construct(e,t,n){return new Xs(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const n of e){if(n.indexOf("//")>=0)throw new ks(Cs.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter((e=>e.length>0)))}return new Xs(t)}static emptyPath(){return new Xs([])}}const Zs=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class ei extends Ys{construct(e,t,n){return new ei(e,t,n)}static isValidIdentifier(e){return Zs.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),ei.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===Js}static keyField(){return new ei([Js])}static fromServerFormat(e){const t=[];let n="",r=0;const s=()=>{if(0===n.length)throw new ks(Cs.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""};let i=!1;for(;r<e.length;){const t=e[r];if("\\"===t){if(r+1===e.length)throw new ks(Cs.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new ks(Cs.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?(i=!i,r++):"."!==t||i?(n+=t,r++):(s(),r++)}if(s(),i)throw new ks(Cs.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new ei(t)}static emptyPath(){return new ei([])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ti{constructor(e){this.path=e}static fromPath(e){return new ti(Xs.fromString(e))}static fromName(e){return new ti(Xs.fromString(e).popFirst(5))}static empty(){return new ti(Xs.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===Xs.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return Xs.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new ti(new Xs(e.slice()))}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ni=-1;class ri{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function si(e){return e.fields.find((e=>2===e.kind))}function ii(e){return e.fields.filter((e=>2!==e.kind))}function oi(e,t){let n=Bs(e.collectionGroup,t.collectionGroup);if(0!==n)return n;for(let r=0;r<Math.min(e.fields.length,t.fields.length);++r)if(n=ci(e.fields[r],t.fields[r]),0!==n)return n;return Bs(e.fields.length,t.fields.length)}ri.UNKNOWN_ID=-1;class ai{constructor(e,t){this.fieldPath=e,this.kind=t}}function ci(e,t){const n=ei.comparator(e.fieldPath,t.fieldPath);return 0!==n?n:Bs(e.kind,t.kind)}class ui{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new ui(0,di.min())}}function li(e,t){const n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1,s=Qs.fromTimestamp(1e9===r?new Ws(n+1,0):new Ws(n,r));return new di(s,ti.empty(),t)}function hi(e){return new di(e.readTime,e.key,ni)}class di{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new di(Qs.min(),ti.empty(),ni)}static max(){return new di(Qs.max(),ti.empty(),ni)}}function fi(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:(n=ti.comparator(e.documentKey,t.documentKey),0!==n?n:Bs(e.largestBatchId,t.largestBatchId)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}const pi="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class gi{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function mi(e){if(e.code!==Cs.FAILED_PRECONDITION||e.message!==pi)throw e;vs("LocalStore","Unexpectedly lost primary lease")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yi{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)}),(e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&Is(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new yi(((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof yi?t:yi.resolve(t)}catch(t){return yi.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):yi.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):yi.reject(t)}static resolve(e){return new yi(((t,n)=>{t(e)}))}static reject(e){return new yi(((t,n)=>{n(e)}))}static waitFor(e){return new yi(((t,n)=>{let r=0,s=0,i=!1;e.forEach((e=>{++r,e.next((()=>{++s,i&&s===r&&t()}),(e=>n(e)))})),i=!0,s===r&&t()}))}static or(e){let t=yi.resolve(!1);for(const n of e)t=t.next((e=>e?yi.resolve(e):n()));return t}static forEach(e,t){const n=[];return e.forEach(((e,r)=>{n.push(t.call(this,e,r))})),this.waitFor(n)}static mapArray(e,t){return new yi(((n,r)=>{const s=e.length,i=new Array(s);let o=0;for(let a=0;a<s;a++){const c=a;t(e[c]).next((e=>{i[c]=e,++o,o===s&&n(i)}),(e=>r(e)))}}))}static doWhile(e,t){return new yi(((n,r)=>{const s=()=>{!0===e()?t().next((()=>{s()}),r):n()};s()}))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vi="SimpleDb";class wi{static open(e,t,n,r){try{return new wi(t,e.transaction(r,n))}catch(s){throw new Ti(t,s)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new As,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new Ti(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{const n=Ai(t.target.error);this.S.reject(new Ti(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(vs(vi,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}v(){const e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){const t=this.transaction.objectStore(e);return new Si(t)}}class _i{static delete(e){return vs(vi,"Removing database:",e),Ci(a().indexedDB.deleteDatabase(e)).toPromise()}static C(){if(!y())return!1;if(_i.F())return!0;const e=g(),t=_i.M(e),n=0<t&&t<10,r=bi(e),s=0<r&&r<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||n||s)}static F(){var e;return"undefined"!=typeof process&&"YES"===(null===(e=process.__PRIVATE_env)||void 0===e?void 0:e.O)}static N(e,t){return e.store(t)}static M(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(n)}constructor(e,t,n){this.name=e,this.version=t,this.B=n,this.L=null,12.2===_i.M(g())&&ws("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async k(e){return this.db||(vs(vi,"Opening database:",this.name),this.db=await new Promise(((t,n)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{const n=e.target.result;t(n)},r.onblocked=()=>{n(new Ti(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{const r=t.target.error;"VersionError"===r.name?n(new ks(Cs.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new ks(Cs.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new Ti(e,r))},r.onupgradeneeded=e=>{vs(vi,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);const t=e.target.result;if(null!==this.L&&this.L!==e.oldVersion)throw new Error(`refusing to open IndexedDB database due to potential corruption of the IndexedDB database data; this corruption could be caused by clicking the "clear site data" button in a web browser; try reloading the web page to re-initialize the IndexedDB database: lastClosedDbVersion=${this.L}, event.oldVersion=${e.oldVersion}, event.newVersion=${e.newVersion}, db.version=${t.version}`);this.B.q(t,r.transaction,e.oldVersion,this.version).next((()=>{vs(vi,"Database upgrade to version "+this.version+" complete")}))}})),this.db.addEventListener("close",(e=>{const t=e.target;this.L=t.version}),{passive:!0})),this.$&&(this.db.onversionchange=e=>this.$(e)),this.db}U(e){this.$=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,r){const s="readonly"===t;let i=0;for(;;){++i;try{this.db=await this.k(e);const t=wi.open(this.db,e,s?"readonly":"readwrite",n),i=r(t).next((e=>(t.v(),e))).catch((e=>(t.abort(e),yi.reject(e)))).toPromise();return i.catch((()=>{})),await t.D,i}catch(o){const e=o,t="FirebaseError"!==e.name&&i<3;if(vs(vi,"Transaction failed with error:",e.message,"Retrying:",t),this.close(),!t)return Promise.reject(e)}}}close(){this.db&&this.db.close(),this.db=void 0}}function bi(e){const t=e.match(/Android ([\d.]+)/i),n=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class Ii{constructor(e){this.K=e,this.W=!1,this.G=null}get isDone(){return this.W}get j(){return this.G}set cursor(e){this.K=e}done(){this.W=!0}H(e){this.G=e}delete(){return Ci(this.K.delete())}}class Ti extends ks{constructor(e,t){super(Cs.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Ei(e){return"IndexedDbTransactionError"===e.name}class Si{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(vs(vi,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(vs(vi,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),Ci(n)}add(e){return vs(vi,"ADD",this.store.name,e,e),Ci(this.store.add(e))}get(e){return Ci(this.store.get(e)).next((t=>(void 0===t&&(t=null),vs(vi,"GET",this.store.name,e,t),t)))}delete(e){return vs(vi,"DELETE",this.store.name,e),Ci(this.store.delete(e))}count(){return vs(vi,"COUNT",this.store.name),Ci(this.store.count())}J(e,t){const n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){const e=r.getAll(n.range);return new yi(((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}}))}{const e=this.cursor(n),t=[];return this.Y(e,((e,n)=>{t.push(n)})).next((()=>t))}}Z(e,t){const n=this.store.getAll(e,null===t?void 0:t);return new yi(((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}}))}X(e,t){vs(vi,"DELETE ALL",this.store.name);const n=this.options(e,t);n.ee=!1;const r=this.cursor(n);return this.Y(r,((e,t,n)=>n.delete()))}te(e,t){let n;t?n=e:(n={},t=e);const r=this.cursor(n);return this.Y(r,t)}ne(e){const t=this.cursor({});return new yi(((n,r)=>{t.onerror=e=>{const t=Ai(e.target.error);r(t)},t.onsuccess=t=>{const r=t.target.result;r?e(r.primaryKey,r.value).next((e=>{e?r.continue():n()})):n()}}))}Y(e,t){const n=[];return new yi(((r,s)=>{e.onerror=e=>{s(e.target.error)},e.onsuccess=e=>{const s=e.target.result;if(!s)return void r();const i=new Ii(s),o=t(s.primaryKey,s.value,i);if(o instanceof yi){const e=o.catch((e=>(i.done(),yi.reject(e))));n.push(e)}i.isDone?r():null===i.j?s.continue():s.continue(i.j)}})).next((()=>yi.waitFor(n)))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const n=this.store.index(e.index);return e.ee?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function Ci(e){return new yi(((t,n)=>{e.onsuccess=e=>{const n=e.target.result;t(n)},e.onerror=e=>{const t=Ai(e.target.error);n(t)}}))}let ki=!1;function Ai(e){const t=_i.M(g());if(t>=12.2&&t<13){const t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){const e=new ks("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return ki||(ki=!0,setTimeout((()=>{throw e}),0)),e}}return e}const Ni="IndexBackfiller";class Ri{constructor(e,t){this.asyncQueue=e,this.re=t,this.task=null}start(){this.ie(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}ie(e){vs(Ni,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const e=await this.re.se();vs(Ni,`Documents written: ${e}`)}catch(e){Ei(e)?vs(Ni,"Ignoring IndexedDB error during index backfill: ",e):await mi(e)}await this.ie(6e4)}))}}class xi{constructor(e,t){this.localStore=e,this.persistence=t}async se(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.oe(t,e)))}oe(e,t){const n=new Set;let r=t,s=!0;return yi.doWhile((()=>!0===s&&r>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((t=>{if(null!==t&&!n.has(t))return vs(Ni,`Processing collection: ${t}`),this._e(e,t,r).next((e=>{r-=e,n.add(t)}));s=!1})))).next((()=>t-r))}_e(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next((n=>{const s=n.changes;return this.localStore.indexManager.updateIndexEntries(e,s).next((()=>this.ae(r,n))).next((n=>(vs(Ni,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n)))).next((()=>s.size))}))))}ae(e,t){let n=e;return t.changes.forEach(((e,t)=>{const r=hi(t);fi(r,n)>0&&(n=r)})),new di(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ue(e),this.ce=e=>t.writeSequenceNumber(e))}ue(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ce&&this.ce(e),e}}Di.le=-1;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const Oi=-1;function Pi(e){return null==e}function Li(e){return 0===e&&1/e==-1/0}function Mi(e){return"number"==typeof e&&Number.isInteger(e)&&!Li(e)&&e<=Number.MAX_SAFE_INTEGER&&e>=Number.MIN_SAFE_INTEGER}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ui="";function Fi(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t=Bi(t)),t=Vi(e.get(n),t);return Bi(t)}function Vi(e,t){let n=t;const r=e.length;for(let s=0;s<r;s++){const t=e.charAt(s);switch(t){case"\0":n+="";break;case Ui:n+="";break;default:n+=t}}return n}function Bi(e){return e+Ui+""}function qi(e){const t=e.length;if(Es(t>=2,64408,{path:e}),2===t)return Es(e.charAt(0)===Ui&&""===e.charAt(1),56145,{path:e}),Xs.emptyPath();const n=t-2,r=[];let s="";for(let i=0;i<t;){const t=e.indexOf(Ui,i);switch((t<0||t>n)&&Is(50515,{path:e}),e.charAt(t+1)){case"":const n=e.substring(i,t);let o;0===s.length?o=n:(s+=n,o=s,s=""),r.push(o);break;case"":s+=e.substring(i,t),s+="\0";break;case"":s+=e.substring(i,t+1);break;default:Is(61167,{path:e})}i=t+2}return new Xs(r)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zi="remoteDocuments",ji="owner",$i="owner",Gi="mutationQueues",Ki="mutations",Hi="batchId",Wi="userMutationsIndex",Qi=["userId","batchId"];
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ji(e,t){return[e,Fi(t)]}function Yi(e,t,n){return[e,Fi(t),n]}const Xi={},Zi="documentMutations",eo="remoteDocumentsV14",to=["prefixPath","collectionGroup","readTime","documentId"],no="documentKeyIndex",ro=["prefixPath","collectionGroup","documentId"],so="collectionGroupIndex",io=["collectionGroup","readTime","prefixPath","documentId"],oo="remoteDocumentGlobal",ao="remoteDocumentGlobalKey",co="targets",uo="queryTargetsIndex",lo=["canonicalId","targetId"],ho="targetDocuments",fo=["targetId","path"],po="documentTargetsIndex",go=["path","targetId"],mo="targetGlobalKey",yo="targetGlobal",vo="collectionParents",wo=["collectionId","parent"],_o="clientMetadata",bo="bundles",Io="namedQueries",To="indexConfiguration",Eo="collectionGroupIndex",So="indexState",Co=["indexId","uid"],ko="sequenceNumberIndex",Ao=["uid","sequenceNumber"],No="indexEntries",Ro=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],xo="documentKeyIndex",Do=["indexId","uid","orderedDocumentKey"],Oo="documentOverlays",Po=["userId","collectionPath","documentId"],Lo="collectionPathOverlayIndex",Mo=["userId","collectionPath","largestBatchId"],Uo="collectionGroupOverlayIndex",Fo=["userId","collectionGroup","largestBatchId"],Vo="globals",Bo=[Gi,Ki,Zi,zi,co,ji,yo,ho,_o,oo,vo,bo,Io],qo=[...Bo,Oo],zo=[Gi,Ki,Zi,eo,co,ji,yo,ho,_o,oo,vo,bo,Io,Oo],jo=zo,$o=[...jo,To,So,No],Go=$o,Ko=[...$o,Vo];
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ho extends gi{constructor(e,t){super(),this.he=e,this.currentSequenceNumber=t}}function Wo(e,t){const n=Ss(e);return _i.N(n.he,t)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qo(e){let t=0;for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function Jo(e,t){for(const n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function Yo(e,t){const n=[];for(const r in e)Object.prototype.hasOwnProperty.call(e,r)&&n.push(t(e[r],r,e));return n}function Xo(e){for(const t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zo{constructor(e,t){this.comparator=e,this.root=t||ta.EMPTY}insert(e,t){return new Zo(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,ta.BLACK,null,null))}remove(e){return new Zo(this.comparator,this.root.remove(e,this.comparator).copy(null,null,ta.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,n)=>(e(t,n),!1)))}toString(){const e=[];return this.inorderTraversal(((t,n)=>(e.push(`${t}:${n}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new ea(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new ea(this.root,e,this.comparator,!1)}getReverseIterator(){return new ea(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new ea(this.root,e,this.comparator,!0)}}class ea{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=t?n(e.key,t):1,t&&r&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(0===s){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class ta{constructor(e,t,n,r,s){this.key=e,this.value=t,this.color=null!=n?n:ta.RED,this.left=null!=r?r:ta.EMPTY,this.right=null!=s?s:ta.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,s){return new ta(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=s?s:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this;const s=n(e,r.key);return r=s<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===s?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return ta.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let n,r=this;if(t(e,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return ta.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,ta.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,ta.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw Is(43730,{key:this.key,value:this.value});if(this.right.isRed())throw Is(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw Is(27949);return e+(this.isRed()?0:1)}}ta.EMPTY=null,ta.RED=!0,ta.BLACK=!1,ta.EMPTY=new class{constructor(){this.size=0}get key(){throw Is(57766)}get value(){throw Is(16141)}get color(){throw Is(16727)}get left(){throw Is(29726)}get right(){throw Is(36894)}copy(e,t,n,r,s){return this}insert(e,t,n){return new ta(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class na{constructor(e){this.comparator=e,this.data=new Zo(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,n)=>(e(t),!1)))}forEachInRange(e,t){const n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new ra(this.data.getIterator())}getIteratorFrom(e){return new ra(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((e=>{t=t.add(e)})),t}isEqual(e){if(!(e instanceof na))return!1;if(this.size!==e.size)return!1;const t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new na(this.comparator);return t.data=e,t}}class ra{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function sa(e){return e.hasNext()?e.getNext():void 0}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ia{constructor(e){this.fields=e,e.sort(ei.comparator)}static empty(){return new ia([])}unionWith(e){let t=new na(ei.comparator);for(const n of this.fields)t=t.add(n);for(const n of e)t=t.add(n);return new ia(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return $s(this.fields,e.fields,((e,t)=>e.isEqual(t)))}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oa extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class aa{constructor(e){this.binaryString=e}static fromBase64String(e){const t=function(e){try{return atob(e)}catch(t){throw"undefined"!=typeof DOMException&&t instanceof DOMException?new oa("Invalid base64 string: "+t):t}}(e);return new aa(t)}static fromUint8Array(e){const t=function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e);return new aa(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return e=this.binaryString,btoa(e);var e}toUint8Array(){return function(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return Bs(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}aa.EMPTY_BYTE_STRING=new aa("");const ca=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ua(e){if(Es(!!e,39018),"string"==typeof e){let t=0;const n=ca.exec(e);if(Es(!!n,46558,{timestamp:e}),n[1]){let e=n[1];e=(e+"000000000").substr(0,9),t=Number(e)}const r=new Date(e);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:la(e.seconds),nanos:la(e.nanos)}}function la(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function ha(e){return"string"==typeof e?aa.fromBase64String(e):aa.fromUint8Array(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const da="server_timestamp",fa="__type__",pa="__previous_value__",ga="__local_write_time__";function ma(e){var t,n;return(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{})[fa])||void 0===n?void 0:n.stringValue)===da}function ya(e){const t=e.mapValue.fields[pa];return ma(t)?ya(t):t}function va(e){const t=ua(e.mapValue.fields[ga].timestampValue);return new Ws(t.seconds,t.nanos)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wa{constructor(e,t,n,r,s,i,o,a,c,u){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=s,this.forceLongPolling=i,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c,this.isUsingEmulator=u}}const _a="(default)";class ba{constructor(e,t){this.projectId=e,this.database=t||_a}static empty(){return new ba("","")}get isDefaultDatabase(){return this.database===_a}isEqual(e){return e instanceof ba&&e.projectId===this.projectId&&e.database===this.database}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ia="__type__",Ta="__max__",Ea={mapValue:{fields:{__type__:{stringValue:Ta}}}},Sa="__vector__",Ca="value",ka={nullValue:"NULL_VALUE"};function Aa(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?ma(e)?4:Ga(e)?9007199254740991:ja(e)?10:11:Is(28295,{value:e})}function Na(e,t){if(e===t)return!0;const n=Aa(e);if(n!==Aa(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return va(e).isEqual(va(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;const n=ua(e.timestampValue),r=ua(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return r=t,ha(e.bytesValue).isEqual(ha(r.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return function(e,t){return la(e.geoPointValue.latitude)===la(t.geoPointValue.latitude)&&la(e.geoPointValue.longitude)===la(t.geoPointValue.longitude)}(e,t);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return la(e.integerValue)===la(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){const n=la(e.doubleValue),r=la(t.doubleValue);return n===r?Li(n)===Li(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return $s(e.arrayValue.values||[],t.arrayValue.values||[],Na);case 10:case 11:return function(e,t){const n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(Qo(n)!==Qo(r))return!1;for(const s in n)if(n.hasOwnProperty(s)&&(void 0===r[s]||!Na(n[s],r[s])))return!1;return!0}(e,t);default:return Is(52216,{left:e})}var r}function Ra(e,t){return void 0!==(e.values||[]).find((e=>Na(e,t)))}function xa(e,t){if(e===t)return 0;const n=Aa(e),r=Aa(t);if(n!==r)return Bs(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return Bs(e.booleanValue,t.booleanValue);case 2:return function(e,t){const n=la(e.integerValue||e.doubleValue),r=la(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return Da(e.timestampValue,t.timestampValue);case 4:return Da(va(e),va(t));case 5:return qs(e.stringValue,t.stringValue);case 6:return function(e,t){const n=ha(e),r=ha(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){const n=e.split("/"),r=t.split("/");for(let s=0;s<n.length&&s<r.length;s++){const e=Bs(n[s],r[s]);if(0!==e)return e}return Bs(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){const n=Bs(la(e.latitude),la(t.latitude));return 0!==n?n:Bs(la(e.longitude),la(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return Oa(e.arrayValue,t.arrayValue);case 10:return function(e,t){var n,r,s,i;const o=e.fields||{},a=t.fields||{},c=null===(n=o[Ca])||void 0===n?void 0:n.arrayValue,u=null===(r=a[Ca])||void 0===r?void 0:r.arrayValue,l=Bs((null===(s=null==c?void 0:c.values)||void 0===s?void 0:s.length)||0,(null===(i=null==u?void 0:u.values)||void 0===i?void 0:i.length)||0);return 0!==l?l:Oa(c,u)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===Ea.mapValue&&t===Ea.mapValue)return 0;if(e===Ea.mapValue)return 1;if(t===Ea.mapValue)return-1;const n=e.fields||{},r=Object.keys(n),s=t.fields||{},i=Object.keys(s);r.sort(),i.sort();for(let o=0;o<r.length&&o<i.length;++o){const e=qs(r[o],i[o]);if(0!==e)return e;const t=xa(n[r[o]],s[i[o]]);if(0!==t)return t}return Bs(r.length,i.length)}(e.mapValue,t.mapValue);default:throw Is(23264,{Pe:n})}}function Da(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return Bs(e,t);const n=ua(e),r=ua(t),s=Bs(n.seconds,r.seconds);return 0!==s?s:Bs(n.nanos,r.nanos)}function Oa(e,t){const n=e.values||[],r=t.values||[];for(let s=0;s<n.length&&s<r.length;++s){const e=xa(n[s],r[s]);if(e)return e}return Bs(n.length,r.length)}function Pa(e){return La(e)}function La(e){return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){const t=ua(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?ha(e.bytesValue).toBase64():"referenceValue"in e?function(e){return ti.fromName(e).toString()}(e.referenceValue):"geoPointValue"in e?function(e){return`geo(${e.latitude},${e.longitude})`}(e.geoPointValue):"arrayValue"in e?function(e){let t="[",n=!0;for(const r of e.values||[])n?n=!1:t+=",",t+=La(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){const t=Object.keys(e.fields||{}).sort();let n="{",r=!0;for(const s of t)r?r=!1:n+=",",n+=`${s}:${La(e.fields[s])}`;return n+"}"}(e.mapValue):Is(61005,{value:e})}function Ma(e){switch(Aa(e)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=ya(e);return t?16+Ma(t):16;case 5:return 2*e.stringValue.length;case 6:return ha(e.bytesValue).approximateByteSize();case 7:return e.referenceValue.length;case 9:return(e.arrayValue.values||[]).reduce(((e,t)=>e+Ma(t)),0);case 10:case 11:return function(e){let t=0;return Jo(e.fields,((e,n)=>{t+=e.length+Ma(n)})),t}(e.mapValue);default:throw Is(13486,{value:e})}}function Ua(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function Fa(e){return!!e&&"integerValue"in e}function Va(e){return!!e&&"arrayValue"in e}function Ba(e){return!!e&&"nullValue"in e}function qa(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function za(e){return!!e&&"mapValue"in e}function ja(e){var t,n;return(null===(n=((null===(t=null==e?void 0:e.mapValue)||void 0===t?void 0:t.fields)||{})[Ia])||void 0===n?void 0:n.stringValue)===Sa}function $a(e){if(e.geoPointValue)return{geoPointValue:Object.assign({},e.geoPointValue)};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:Object.assign({},e.timestampValue)};if(e.mapValue){const t={mapValue:{fields:{}}};return Jo(e.mapValue.fields,((e,n)=>t.mapValue.fields[e]=$a(n))),t}if(e.arrayValue){const t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=$a(e.arrayValue.values[n]);return t}return Object.assign({},e)}function Ga(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===Ta}const Ka={mapValue:{fields:{[Ia]:{stringValue:Sa},[Ca]:{arrayValue:{}}}}};function Ha(e){return"nullValue"in e?ka:"booleanValue"in e?{booleanValue:!1}:"integerValue"in e||"doubleValue"in e?{doubleValue:NaN}:"timestampValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in e?{stringValue:""}:"bytesValue"in e?{bytesValue:""}:"referenceValue"in e?Ua(ba.empty(),ti.empty()):"geoPointValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in e?{arrayValue:{}}:"mapValue"in e?ja(e)?Ka:{mapValue:{}}:Is(35942,{value:e})}function Wa(e){return"nullValue"in e?{booleanValue:!1}:"booleanValue"in e?{doubleValue:NaN}:"integerValue"in e||"doubleValue"in e?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in e?{stringValue:""}:"stringValue"in e?{bytesValue:""}:"bytesValue"in e?Ua(ba.empty(),ti.empty()):"referenceValue"in e?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in e?{arrayValue:{}}:"arrayValue"in e?Ka:"mapValue"in e?ja(e)?{mapValue:{}}:Ea:Is(61959,{value:e})}function Qa(e,t){const n=xa(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function Ja(e,t){const n=xa(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(e){this.value=e}static empty(){return new Ya({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(t=(t.mapValue.fields||{})[e.get(n)],!za(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=$a(t)}setAll(e){let t=ei.emptyPath(),n={},r=[];e.forEach(((e,s)=>{if(!t.isImmediateParentOf(s)){const e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=s.popLast()}e?n[s.lastSegment()]=$a(e):r.push(s.lastSegment())}));const s=this.getFieldsMap(t);this.applyChanges(s,n,r)}delete(e){const t=this.field(e.popLast());za(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return Na(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];za(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){Jo(t,((t,n)=>e[t]=n));for(const r of n)delete e[r]}clone(){return new Ya($a(this.value))}}function Xa(e){const t=[];return Jo(e.fields,((e,n)=>{const r=new ei([e]);if(za(n)){const e=Xa(n.mapValue).fields;if(0===e.length)t.push(r);else for(const n of e)t.push(r.child(n))}else t.push(r)})),new ia(t)
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Za{constructor(e,t,n,r,s,i,o){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=s,this.data=i,this.documentState=o}static newInvalidDocument(e){return new Za(e,0,Qs.min(),Qs.min(),Qs.min(),Ya.empty(),0)}static newFoundDocument(e,t,n,r){return new Za(e,1,t,Qs.min(),n,r,0)}static newNoDocument(e,t){return new Za(e,2,t,Qs.min(),Qs.min(),Ya.empty(),0)}static newUnknownDocument(e,t){return new Za(e,3,t,Qs.min(),Qs.min(),Ya.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(Qs.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ya.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ya.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Qs.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof Za&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Za(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec{constructor(e,t){this.position=e,this.inclusive=t}}function tc(e,t,n){let r=0;for(let s=0;s<e.position.length;s++){const i=t[s],o=e.position[s];if(r=i.field.isKeyField()?ti.comparator(ti.fromName(o.referenceValue),n.key):xa(o,n.data.field(i.field)),"desc"===i.dir&&(r*=-1),0!==r)break}return r}function nc(e,t){if(null===e)return null===t;if(null===t)return!1;if(e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!Na(e.position[n],t.position[n]))return!1;return!0}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rc{constructor(e,t="asc"){this.field=e,this.dir=t}}function sc(e,t){return e.dir===t.dir&&e.field.isEqual(t.field)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ic{}class oc extends ic{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new mc(e,t,n):"array-contains"===t?new _c(e,n):"in"===t?new bc(e,n):"not-in"===t?new Ic(e,n):"array-contains-any"===t?new Tc(e,n):new oc(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new yc(e,n):new vc(e,n)}matches(e){const t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(xa(t,this.value)):null!==t&&Aa(this.value)===Aa(t)&&this.matchesComparison(xa(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return Is(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ac extends ic{constructor(e,t){super(),this.filters=e,this.op=t,this.Te=null}static create(e,t){return new ac(e,t)}matches(e){return cc(this)?void 0===this.filters.find((t=>!t.matches(e))):void 0!==this.filters.find((t=>t.matches(e)))}getFlattenedFilters(){return null!==this.Te||(this.Te=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.Te}getFilters(){return Object.assign([],this.filters)}}function cc(e){return"and"===e.op}function uc(e){return"or"===e.op}function lc(e){return hc(e)&&cc(e)}function hc(e){for(const t of e.filters)if(t instanceof ac)return!1;return!0}function dc(e){if(e instanceof oc)return e.field.canonicalString()+e.op.toString()+Pa(e.value);if(lc(e))return e.filters.map((e=>dc(e))).join(",");{const t=e.filters.map((e=>dc(e))).join(",");return`${e.op}(${t})`}}function fc(e,t){return e instanceof oc?(n=e,(r=t)instanceof oc&&n.op===r.op&&n.field.isEqual(r.field)&&Na(n.value,r.value)):e instanceof ac?function(e,t){return t instanceof ac&&e.op===t.op&&e.filters.length===t.filters.length&&e.filters.reduce(((e,n,r)=>e&&fc(n,t.filters[r])),!0)}(e,t):void Is(19439);var n,r}function pc(e,t){const n=e.filters.concat(t);return ac.create(n,e.op)}function gc(e){return e instanceof oc?`${(t=e).field.canonicalString()} ${t.op} ${Pa(t.value)}`:e instanceof ac?function(e){return e.op.toString()+" {"+e.getFilters().map(gc).join(" ,")+"}"}(e):"Filter";var t}class mc extends oc{constructor(e,t,n){super(e,t,n),this.key=ti.fromName(n.referenceValue)}matches(e){const t=ti.comparator(e.key,this.key);return this.matchesComparison(t)}}class yc extends oc{constructor(e,t){super(e,"in",t),this.keys=wc("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class vc extends oc{constructor(e,t){super(e,"not-in",t),this.keys=wc("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function wc(e,t){var n;return((null===(n=t.arrayValue)||void 0===n?void 0:n.values)||[]).map((e=>ti.fromName(e.referenceValue)))}class _c extends oc{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return Va(t)&&Ra(t.arrayValue,this.value)}}class bc extends oc{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return null!==t&&Ra(this.value.arrayValue,t)}}class Ic extends oc{constructor(e,t){super(e,"not-in",t)}matches(e){if(Ra(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!Ra(this.value.arrayValue,t)}}class Tc extends oc{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!Va(t)||!t.arrayValue.values)&&t.arrayValue.values.some((e=>Ra(this.value.arrayValue,e)))}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{constructor(e,t=null,n=[],r=[],s=null,i=null,o=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=s,this.startAt=i,this.endAt=o,this.Ie=null}}function Sc(e,t=null,n=[],r=[],s=null,i=null,o=null){return new Ec(e,t,n,r,s,i,o)}function Cc(e){const t=Ss(e);if(null===t.Ie){let e=t.path.canonicalString();null!==t.collectionGroup&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map((e=>dc(e))).join(","),e+="|ob:",e+=t.orderBy.map((e=>{return(t=e).field.canonicalString()+t.dir;var t})).join(","),Pi(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map((e=>Pa(e))).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map((e=>Pa(e))).join(",")),t.Ie=e}return t.Ie}function kc(e,t){if(e.limit!==t.limit)return!1;if(e.orderBy.length!==t.orderBy.length)return!1;for(let n=0;n<e.orderBy.length;n++)if(!sc(e.orderBy[n],t.orderBy[n]))return!1;if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!fc(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!nc(e.startAt,t.startAt)&&nc(e.endAt,t.endAt)}function Ac(e){return ti.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function Nc(e,t){return e.filters.filter((e=>e instanceof oc&&e.field.isEqual(t)))}function Rc(e,t,n){let r=ka,s=!0;for(const i of Nc(e,t)){let e=ka,t=!0;switch(i.op){case"<":case"<=":e=Ha(i.value);break;case"==":case"in":case">=":e=i.value;break;case">":e=i.value,t=!1;break;case"!=":case"not-in":e=ka}Qa({value:r,inclusive:s},{value:e,inclusive:t})<0&&(r=e,s=t)}if(null!==n)for(let i=0;i<e.orderBy.length;++i)if(e.orderBy[i].field.isEqual(t)){const e=n.position[i];Qa({value:r,inclusive:s},{value:e,inclusive:n.inclusive})<0&&(r=e,s=n.inclusive);break}return{value:r,inclusive:s}}function xc(e,t,n){let r=Ea,s=!0;for(const i of Nc(e,t)){let e=Ea,t=!0;switch(i.op){case">=":case">":e=Wa(i.value),t=!1;break;case"==":case"in":case"<=":e=i.value;break;case"<":e=i.value,t=!1;break;case"!=":case"not-in":e=Ea}Ja({value:r,inclusive:s},{value:e,inclusive:t})>0&&(r=e,s=t)}if(null!==n)for(let i=0;i<e.orderBy.length;++i)if(e.orderBy[i].field.isEqual(t)){const e=n.position[i];Ja({value:r,inclusive:s},{value:e,inclusive:n.inclusive})>0&&(r=e,s=n.inclusive);break}return{value:r,inclusive:s}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dc{constructor(e,t=null,n=[],r=[],s=null,i="F",o=null,a=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=s,this.limitType=i,this.startAt=o,this.endAt=a,this.Ee=null,this.de=null,this.Ae=null,this.startAt,this.endAt}}function Oc(e,t,n,r,s,i,o,a){return new Dc(e,t,n,r,s,i,o,a)}function Pc(e){return new Dc(e)}function Lc(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function Mc(e){return null!==e.collectionGroup}function Uc(e){const t=Ss(e);if(null===t.Ee){t.Ee=[];const e=new Set;for(const r of t.explicitOrderBy)t.Ee.push(r),e.add(r.field.canonicalString());const n=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(e){let t=new na(ei.comparator);return e.filters.forEach((e=>{e.getFlattenedFilters().forEach((e=>{e.isInequality()&&(t=t.add(e.field))}))})),t})(t).forEach((r=>{e.has(r.canonicalString())||r.isKeyField()||t.Ee.push(new rc(r,n))})),e.has(ei.keyField().canonicalString())||t.Ee.push(new rc(ei.keyField(),n))}return t.Ee}function Fc(e){const t=Ss(e);return t.de||(t.de=Bc(t,Uc(e))),t.de}function Vc(e){const t=Ss(e);return t.Ae||(t.Ae=Bc(t,e.explicitOrderBy)),t.Ae}function Bc(e,t){if("F"===e.limitType)return Sc(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map((e=>{const t="desc"===e.dir?"asc":"desc";return new rc(e.field,t)}));const n=e.endAt?new ec(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new ec(e.startAt.position,e.startAt.inclusive):null;return Sc(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}function qc(e,t){const n=e.filters.concat([t]);return new Dc(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function zc(e,t,n){return new Dc(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function jc(e,t){return kc(Fc(e),Fc(t))&&e.limitType===t.limitType}function $c(e){return`${Cc(Fc(e))}|lt:${e.limitType}`}function Gc(e){return`Query(target=${function(e){let t=e.path.canonicalString();return null!==e.collectionGroup&&(t+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(t+=`, filters: [${e.filters.map((e=>gc(e))).join(", ")}]`),Pi(e.limit)||(t+=", limit: "+e.limit),e.orderBy.length>0&&(t+=`, orderBy: [${e.orderBy.map((e=>{return`${(t=e).field.canonicalString()} (${t.dir})`;var t})).join(", ")}]`),e.startAt&&(t+=", startAt: ",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((e=>Pa(e))).join(",")),e.endAt&&(t+=", endAt: ",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((e=>Pa(e))).join(",")),`Target(${t})`}(Fc(e))}; limitType=${e.limitType})`}function Kc(e,t){return t.isFoundDocument()&&function(e,t){const n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):ti.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(const n of Uc(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(const n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(r=t,!((n=e).startAt&&!function(e,t,n){const r=tc(e,t,n);return e.inclusive?r<=0:r<0}(n.startAt,Uc(n),r)||n.endAt&&!function(e,t,n){const r=tc(e,t,n);return e.inclusive?r>=0:r>0}(n.endAt,Uc(n),r)));var n,r}function Hc(e){return e.collectionGroup||(e.path.length%2==1?e.path.lastSegment():e.path.get(e.path.length-2))}function Wc(e){return(t,n)=>{let r=!1;for(const s of Uc(e)){const e=Qc(s,t,n);if(0!==e)return e;r=r||s.field.isKeyField()}return 0}}function Qc(e,t,n){const r=e.field.isKeyField()?ti.comparator(t.key,n.key):function(e,t,n){const r=t.data.field(e),s=n.data.field(e);return null!==r&&null!==s?xa(r,s):Is(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return-1*r;default:return Is(19790,{direction:e.dir})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jc{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n)for(const[r,s]of n)if(this.equalsFn(r,e))return s}has(e){return void 0!==this.get(e)}set(e,t){const n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return void(r[s]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){Jo(this.inner,((t,n)=>{for(const[r,s]of n)e(r,s)}))}isEmpty(){return Xo(this.inner)}size(){return this.innerSize}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yc=new Zo(ti.comparator);function Xc(){return Yc}const Zc=new Zo(ti.comparator);function eu(...e){let t=Zc;for(const n of e)t=t.insert(n.key,n);return t}function tu(e){let t=Zc;return e.forEach(((e,n)=>t=t.insert(e,n.overlayedDocument))),t}function nu(){return su()}function ru(){return su()}function su(){return new Jc((e=>e.toString()),((e,t)=>e.isEqual(t)))}const iu=new Zo(ti.comparator),ou=new na(ti.comparator);function au(...e){let t=ou;for(const n of e)t=t.add(n);return t}const cu=new na(Bs);function uu(){return cu}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lu(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Li(t)?"-0":t}}function hu(e){return{integerValue:""+e}}function du(e,t){return Mi(t)?hu(t):lu(e,t)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fu{constructor(){this._=void 0}}function pu(e,t,n){return e instanceof yu?function(e,t){const n={fields:{[fa]:{stringValue:da},[ga]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&ma(t)&&(t=ya(t)),t&&(n.fields[pa]=t),{mapValue:n}}(n,t):e instanceof vu?wu(e,t):e instanceof _u?bu(e,t):function(e,t){const n=mu(e,t),r=Tu(n)+Tu(e.Re);return Fa(n)&&Fa(e.Re)?hu(r):lu(e.serializer,r)}(e,t)}function gu(e,t,n){return e instanceof vu?wu(e,t):e instanceof _u?bu(e,t):n}function mu(e,t){return e instanceof Iu?Fa(n=t)||(r=n)&&"doubleValue"in r?t:{integerValue:0}:null;var n,r}class yu extends fu{}class vu extends fu{constructor(e){super(),this.elements=e}}function wu(e,t){const n=Eu(t);for(const r of e.elements)n.some((e=>Na(e,r)))||n.push(r);return{arrayValue:{values:n}}}class _u extends fu{constructor(e){super(),this.elements=e}}function bu(e,t){let n=Eu(t);for(const r of e.elements)n=n.filter((e=>!Na(e,r)));return{arrayValue:{values:n}}}class Iu extends fu{constructor(e,t){super(),this.serializer=e,this.Re=t}}function Tu(e){return la(e.integerValue||e.doubleValue)}function Eu(e){return Va(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Su{constructor(e,t){this.field=e,this.transform=t}}class Cu{constructor(e,t){this.version=e,this.transformResults=t}}class ku{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new ku}static exists(e){return new ku(void 0,e)}static updateTime(e){return new ku(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function Au(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class Nu{}function Ru(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new Bu(e.key,ku.none()):new Lu(e.key,e.data,ku.none());{const n=e.data,r=Ya.empty();let s=new na(ei.comparator);for(let e of t.fields)if(!s.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),s=s.add(e)}return new Mu(e.key,r,new ia(s.toArray()),ku.none())}}function xu(e,t,n){var r;e instanceof Lu?function(e,t,n){const r=e.value.clone(),s=Fu(e.fieldTransforms,t,n.transformResults);r.setAll(s),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(e,t,n):e instanceof Mu?function(e,t,n){if(!Au(e.precondition,t))return void t.convertToUnknownDocument(n.version);const r=Fu(e.fieldTransforms,t,n.transformResults),s=t.data;s.setAll(Uu(e)),s.setAll(r),t.convertToFoundDocument(n.version,s).setHasCommittedMutations()}(e,t,n):(r=n,t.convertToNoDocument(r.version).setHasCommittedMutations())}function Du(e,t,n,r){return e instanceof Lu?function(e,t,n,r){if(!Au(e.precondition,t))return n;const s=e.value.clone(),i=Vu(e.fieldTransforms,r,t);return s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null}(e,t,n,r):e instanceof Mu?function(e,t,n,r){if(!Au(e.precondition,t))return n;const s=Vu(e.fieldTransforms,r,t),i=t.data;return i.setAll(Uu(e)),i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null===n?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map((e=>e.field)))}(e,t,n,r):(s=t,i=n,Au(e.precondition,s)?(s.convertToNoDocument(s.version).setHasLocalMutations(),null):i);var s,i}function Ou(e,t){let n=null;for(const r of e.fieldTransforms){const e=t.data.field(r.field),s=mu(r.transform,e||null);null!=s&&(null===n&&(n=Ya.empty()),n.set(r.field,s))}return n||null}function Pu(e,t){return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||n&&r&&$s(n,r,((e,t)=>function(e,t){return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof vu&&r instanceof vu||n instanceof _u&&r instanceof _u?$s(n.elements,r.elements,Na):n instanceof Iu&&r instanceof Iu?Na(n.Re,r.Re):n instanceof yu&&r instanceof yu);var n,r}(e,t))))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask)));var n,r}class Lu extends Nu{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class Mu extends Nu{constructor(e,t,n,r,s=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function Uu(e){const t=new Map;return e.fieldMask.fields.forEach((n=>{if(!n.isEmpty()){const r=e.data.field(n);t.set(n,r)}})),t}function Fu(e,t,n){const r=new Map;Es(e.length===n.length,32656,{Ve:n.length,me:e.length});for(let s=0;s<n.length;s++){const i=e[s],o=i.transform,a=t.data.field(i.field);r.set(i.field,gu(o,a,n[s]))}return r}function Vu(e,t,n){const r=new Map;for(const s of e){const e=s.transform,i=n.data.field(s.field);r.set(s.field,pu(e,i,t))}return r}class Bu extends Nu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class qu extends Nu{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zu{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){const n=t.mutationResults;for(let r=0;r<this.mutations.length;r++){const t=this.mutations[r];t.key.isEqual(e.key)&&xu(t,e,n[r])}}applyToLocalView(e,t){for(const n of this.baseMutations)n.key.isEqual(e.key)&&(t=Du(n,e,t,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(e.key)&&(t=Du(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const n=ru();return this.mutations.forEach((r=>{const s=e.get(r.key),i=s.overlayedDocument;let o=this.applyToLocalView(i,s.mutatedFields);o=t.has(r.key)?null:o;const a=Ru(i,o);null!==a&&n.set(r.key,a),i.isValidDocument()||i.convertToNoDocument(Qs.min())})),n}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),au())}isEqual(e){return this.batchId===e.batchId&&$s(this.mutations,e.mutations,((e,t)=>Pu(e,t)))&&$s(this.baseMutations,e.baseMutations,((e,t)=>Pu(e,t)))}}class ju{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){Es(e.mutations.length===n.length,58842,{fe:e.mutations.length,ge:n.length});let r=iu;const s=e.mutations;for(let i=0;i<s.length;i++)r=r.insert(s[i].key,n[i].version);return new ju(e,t,n,r)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gu{constructor(e,t,n){this.alias=e,this.aggregateType=t,this.fieldPath=n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ku{constructor(e,t){this.count=e,this.unchangedNames=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Hu,Wu;function Qu(e){switch(e){case Cs.OK:return Is(64938);case Cs.CANCELLED:case Cs.UNKNOWN:case Cs.DEADLINE_EXCEEDED:case Cs.RESOURCE_EXHAUSTED:case Cs.INTERNAL:case Cs.UNAVAILABLE:case Cs.UNAUTHENTICATED:return!1;case Cs.INVALID_ARGUMENT:case Cs.NOT_FOUND:case Cs.ALREADY_EXISTS:case Cs.PERMISSION_DENIED:case Cs.FAILED_PRECONDITION:case Cs.ABORTED:case Cs.OUT_OF_RANGE:case Cs.UNIMPLEMENTED:case Cs.DATA_LOSS:return!0;default:return Is(15467,{code:e})}}function Ju(e){if(void 0===e)return ws("GRPC error has no .code"),Cs.UNKNOWN;switch(e){case Hu.OK:return Cs.OK;case Hu.CANCELLED:return Cs.CANCELLED;case Hu.UNKNOWN:return Cs.UNKNOWN;case Hu.DEADLINE_EXCEEDED:return Cs.DEADLINE_EXCEEDED;case Hu.RESOURCE_EXHAUSTED:return Cs.RESOURCE_EXHAUSTED;case Hu.INTERNAL:return Cs.INTERNAL;case Hu.UNAVAILABLE:return Cs.UNAVAILABLE;case Hu.UNAUTHENTICATED:return Cs.UNAUTHENTICATED;case Hu.INVALID_ARGUMENT:return Cs.INVALID_ARGUMENT;case Hu.NOT_FOUND:return Cs.NOT_FOUND;case Hu.ALREADY_EXISTS:return Cs.ALREADY_EXISTS;case Hu.PERMISSION_DENIED:return Cs.PERMISSION_DENIED;case Hu.FAILED_PRECONDITION:return Cs.FAILED_PRECONDITION;case Hu.ABORTED:return Cs.ABORTED;case Hu.OUT_OF_RANGE:return Cs.OUT_OF_RANGE;case Hu.UNIMPLEMENTED:return Cs.UNIMPLEMENTED;case Hu.DATA_LOSS:return Cs.DATA_LOSS;default:return Is(39323,{code:e})}}(Wu=Hu||(Hu={}))[Wu.OK=0]="OK",Wu[Wu.CANCELLED=1]="CANCELLED",Wu[Wu.UNKNOWN=2]="UNKNOWN",Wu[Wu.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Wu[Wu.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Wu[Wu.NOT_FOUND=5]="NOT_FOUND",Wu[Wu.ALREADY_EXISTS=6]="ALREADY_EXISTS",Wu[Wu.PERMISSION_DENIED=7]="PERMISSION_DENIED",Wu[Wu.UNAUTHENTICATED=16]="UNAUTHENTICATED",Wu[Wu.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Wu[Wu.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Wu[Wu.ABORTED=10]="ABORTED",Wu[Wu.OUT_OF_RANGE=11]="OUT_OF_RANGE",Wu[Wu.UNIMPLEMENTED=12]="UNIMPLEMENTED",Wu[Wu.INTERNAL=13]="INTERNAL",Wu[Wu.UNAVAILABLE=14]="UNAVAILABLE",Wu[Wu.DATA_LOSS=15]="DATA_LOSS";
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let Yu=null;
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xu=new es([4294967295,4294967295],0);function Zu(e){const t=Fs().encode(e),n=new ts;return n.update(t),new Uint8Array(n.digest())}function el(e){const t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),i=t.getUint32(12,!0);return[new es([n,r],0),new es([s,i],0)]}class tl{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new nl(`Invalid padding: ${t}`);if(n<0)throw new nl(`Invalid hash count: ${n}`);if(e.length>0&&0===this.hashCount)throw new nl(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new nl(`Invalid padding when bitmap length is 0: ${t}`);this.pe=8*e.length-t,this.ye=es.fromNumber(this.pe)}we(e,t,n){let r=e.add(t.multiply(es.fromNumber(n)));return 1===r.compare(Xu)&&(r=new es([r.getBits(0),r.getBits(1)],0)),r.modulo(this.ye).toNumber()}be(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.pe)return!1;const t=Zu(e),[n,r]=el(t);for(let s=0;s<this.hashCount;s++){const e=this.we(n,r,s);if(!this.be(e))return!1}return!0}static create(e,t,n){const r=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),i=new tl(s,r,t);return n.forEach((e=>i.insert(e))),i}insert(e){if(0===this.pe)return;const t=Zu(e),[n,r]=el(t);for(let s=0;s<this.hashCount;s++){const e=this.we(n,r,s);this.Se(e)}}Se(e){const t=Math.floor(e/8),n=e%8;this.bitmap[t]|=1<<n}}class nl extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rl{constructor(e,t,n,r,s){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,t,n){const r=new Map;return r.set(e,sl.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new rl(Qs.min(),r,new Zo(Bs),Xc(),au())}}class sl{constructor(e,t,n,r,s){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new sl(n,t,au(),au(),au())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class il{constructor(e,t,n,r){this.De=e,this.removedTargetIds=t,this.key=n,this.ve=r}}class ol{constructor(e,t){this.targetId=e,this.Ce=t}}class al{constructor(e,t,n=aa.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class cl{constructor(){this.Fe=0,this.Me=hl(),this.xe=aa.EMPTY_BYTE_STRING,this.Oe=!1,this.Ne=!0}get current(){return this.Oe}get resumeToken(){return this.xe}get Be(){return 0!==this.Fe}get Le(){return this.Ne}ke(e){e.approximateByteSize()>0&&(this.Ne=!0,this.xe=e)}qe(){let e=au(),t=au(),n=au();return this.Me.forEach(((r,s)=>{switch(s){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:Is(38017,{changeType:s})}})),new sl(this.xe,this.Oe,e,t,n)}Qe(){this.Ne=!1,this.Me=hl()}$e(e,t){this.Ne=!0,this.Me=this.Me.insert(e,t)}Ue(e){this.Ne=!0,this.Me=this.Me.remove(e)}Ke(){this.Fe+=1}We(){this.Fe-=1,Es(this.Fe>=0,3241,{Fe:this.Fe})}Ge(){this.Ne=!0,this.Oe=!0}}class ul{constructor(e){this.ze=e,this.je=new Map,this.He=Xc(),this.Je=ll(),this.Ye=ll(),this.Ze=new Zo(Bs)}Xe(e){for(const t of e.De)e.ve&&e.ve.isFoundDocument()?this.et(t,e.ve):this.tt(t,e.key,e.ve);for(const t of e.removedTargetIds)this.tt(t,e.key,e.ve)}nt(e){this.forEachTarget(e,(t=>{const n=this.rt(t);switch(e.state){case 0:this.it(t)&&n.ke(e.resumeToken);break;case 1:n.We(),n.Be||n.Qe(),n.ke(e.resumeToken);break;case 2:n.We(),n.Be||this.removeTarget(t);break;case 3:this.it(t)&&(n.Ge(),n.ke(e.resumeToken));break;case 4:this.it(t)&&(this.st(t),n.ke(e.resumeToken));break;default:Is(56790,{state:e.state})}}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.je.forEach(((e,n)=>{this.it(n)&&t(n)}))}ot(e){const t=e.targetId,n=e.Ce.count,r=this._t(t);if(r){const s=r.target;if(Ac(s))if(0===n){const e=new ti(s.path);this.tt(t,e,Za.newNoDocument(e,Qs.min()))}else Es(1===n,20013,{expectedCount:n});else{const r=this.ut(t);if(r!==n){const n=this.ct(e),s=n?this.lt(n,e,r):1;if(0!==s){this.st(t);const e=2===s?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(t,e)}null==Yu||Yu.ht(function(e,t,n,r,s){var i,o,a,c,u,l;const h={localCacheCount:e,existenceFilterCount:t.count,databaseId:n.database,projectId:n.projectId},d=t.unchangedNames;return d&&(h.bloomFilter={applied:0===s,hashCount:null!==(i=null==d?void 0:d.hashCount)&&void 0!==i?i:0,bitmapLength:null!==(c=null===(a=null===(o=null==d?void 0:d.bits)||void 0===o?void 0:o.bitmap)||void 0===a?void 0:a.length)&&void 0!==c?c:0,padding:null!==(l=null===(u=null==d?void 0:d.bits)||void 0===u?void 0:u.padding)&&void 0!==l?l:0,mightContain:e=>{var t;return null!==(t=null==r?void 0:r.mightContain(e))&&void 0!==t&&t}}),h}(r,e.Ce,this.ze.Pt(),n,s))}}}}ct(e){const t=e.Ce.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:s=0}=t;let i,o;try{i=ha(n).toUint8Array()}catch(a){if(a instanceof oa)return _s("Decoding the base64 bloom filter in existence filter failed ("+a.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw a}try{o=new tl(i,r,s)}catch(a){return _s(a instanceof nl?"BloomFilter error: ":"Applying bloom filter failed: ",a),null}return 0===o.pe?null:o}lt(e,t,n){return t.Ce.count===n-this.Tt(e,t.targetId)?0:2}Tt(e,t){const n=this.ze.getRemoteKeysForTarget(t);let r=0;return n.forEach((n=>{const s=this.ze.Pt(),i=`projects/${s.projectId}/databases/${s.database}/documents/${n.path.canonicalString()}`;e.mightContain(i)||(this.tt(t,n,null),r++)})),r}It(e){const t=new Map;this.je.forEach(((n,r)=>{const s=this._t(r);if(s){if(n.current&&Ac(s.target)){const t=new ti(s.target.path);this.Et(t).has(r)||this.dt(r,t)||this.tt(r,t,Za.newNoDocument(t,e))}n.Le&&(t.set(r,n.qe()),n.Qe())}}));let n=au();this.Ye.forEach(((e,t)=>{let r=!0;t.forEachWhile((e=>{const t=this._t(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)})),r&&(n=n.add(e))})),this.He.forEach(((t,n)=>n.setReadTime(e)));const r=new rl(e,t,this.Ze,this.He,n);return this.He=Xc(),this.Je=ll(),this.Ye=ll(),this.Ze=new Zo(Bs),r}et(e,t){if(!this.it(e))return;const n=this.dt(e,t.key)?2:0;this.rt(e).$e(t.key,n),this.He=this.He.insert(t.key,t),this.Je=this.Je.insert(t.key,this.Et(t.key).add(e)),this.Ye=this.Ye.insert(t.key,this.At(t.key).add(e))}tt(e,t,n){if(!this.it(e))return;const r=this.rt(e);this.dt(e,t)?r.$e(t,1):r.Ue(t),this.Ye=this.Ye.insert(t,this.At(t).delete(e)),this.Ye=this.Ye.insert(t,this.At(t).add(e)),n&&(this.He=this.He.insert(t,n))}removeTarget(e){this.je.delete(e)}ut(e){const t=this.rt(e).qe();return this.ze.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ke(e){this.rt(e).Ke()}rt(e){let t=this.je.get(e);return t||(t=new cl,this.je.set(e,t)),t}At(e){let t=this.Ye.get(e);return t||(t=new na(Bs),this.Ye=this.Ye.insert(e,t)),t}Et(e){let t=this.Je.get(e);return t||(t=new na(Bs),this.Je=this.Je.insert(e,t)),t}it(e){const t=null!==this._t(e);return t||vs("WatchChangeAggregator","Detected inactive target",e),t}_t(e){const t=this.je.get(e);return t&&t.Be?null:this.ze.Rt(e)}st(e){this.je.set(e,new cl),this.ze.getRemoteKeysForTarget(e).forEach((t=>{this.tt(e,t,null)}))}dt(e,t){return this.ze.getRemoteKeysForTarget(e).has(t)}}function ll(){return new Zo(ti.comparator)}function hl(){return new Zo(ti.comparator)}const dl={asc:"ASCENDING",desc:"DESCENDING"},fl={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},pl={and:"AND",or:"OR"};class gl{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function ml(e,t){return e.useProto3Json||Pi(t)?t:{value:t}}function yl(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function vl(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function wl(e,t){return yl(e,t.toTimestamp())}function _l(e){return Es(!!e,49232),Qs.fromTimestamp(function(e){const t=ua(e);return new Ws(t.seconds,t.nanos)}(e))}function bl(e,t){return Il(e,t).canonicalString()}function Il(e,t){const n=(r=e,new Xs(["projects",r.projectId,"databases",r.database])).child("documents");var r;return void 0===t?n:n.child(t)}function Tl(e){const t=Xs.fromString(e);return Es(Kl(t),10190,{key:t.toString()}),t}function El(e,t){return bl(e.databaseId,t.path)}function Sl(e,t){const n=Tl(t);if(n.get(1)!==e.databaseId.projectId)throw new ks(Cs.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new ks(Cs.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new ti(Nl(n))}function Cl(e,t){return bl(e.databaseId,t)}function kl(e){const t=Tl(e);return 4===t.length?Xs.emptyPath():Nl(t)}function Al(e){return new Xs(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function Nl(e){return Es(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function Rl(e,t,n){return{name:El(e,t),fields:n.value.mapValue.fields}}function xl(e,t,n){const r=Sl(e,t.name),s=_l(t.updateTime),i=t.createTime?_l(t.createTime):Qs.min(),o=new Ya({mapValue:{fields:t.fields}}),a=Za.newFoundDocument(r,s,i,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}function Dl(e,t){let n;if(t instanceof Lu)n={update:Rl(e,t.key,t.value)};else if(t instanceof Bu)n={delete:El(e,t.key)};else if(t instanceof Mu)n={update:Rl(e,t.key,t.data),updateMask:Gl(t.fieldMask)};else{if(!(t instanceof qu))return Is(16599,{ft:t.type});n={verify:El(e,t.key)}}return t.fieldTransforms.length>0&&(n.updateTransforms=t.fieldTransforms.map((e=>function(e,t){const n=t.transform;if(n instanceof yu)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof vu)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof _u)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof Iu)return{fieldPath:t.field.canonicalString(),increment:n.Re};throw Is(20930,{transform:t.transform})}(0,e)))),t.precondition.isNone||(n.currentDocument=(r=e,void 0!==(s=t.precondition).updateTime?{updateTime:wl(r,s.updateTime)}:void 0!==s.exists?{exists:s.exists}:Is(27497))),n;var r,s}function Ol(e,t){const n=t.currentDocument?void 0!==(s=t.currentDocument).updateTime?ku.updateTime(_l(s.updateTime)):void 0!==s.exists?ku.exists(s.exists):ku.none():ku.none(),r=t.updateTransforms?t.updateTransforms.map((t=>function(e,t){let n=null;if("setToServerValue"in t)Es("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new yu;else if("appendMissingElements"in t){const e=t.appendMissingElements.values||[];n=new vu(e)}else if("removeAllFromArray"in t){const e=t.removeAllFromArray.values||[];n=new _u(e)}else"increment"in t?n=new Iu(e,t.increment):Is(16584,{proto:t});const r=ei.fromServerFormat(t.fieldPath);return new Su(r,n)}(e,t))):[];var s;if(t.update){t.update.name;const s=Sl(e,t.update.name),i=new Ya({mapValue:{fields:t.update.fields}});if(t.updateMask){const e=function(e){const t=e.fieldPaths||[];return new ia(t.map((e=>ei.fromServerFormat(e))))}(t.updateMask);return new Mu(s,i,e,n,r)}return new Lu(s,i,n,r)}if(t.delete){const r=Sl(e,t.delete);return new Bu(r,n)}if(t.verify){const r=Sl(e,t.verify);return new qu(r,n)}return Is(1463,{proto:t})}function Pl(e,t){return{documents:[Cl(e,t.path)]}}function Ll(e,t){const n={structuredQuery:{}},r=t.path;let s;null!==t.collectionGroup?(s=r,n.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=Cl(e,s);const i=function(e){if(0!==e.length)return $l(ac.create(e,"and"))}(t.filters);i&&(n.structuredQuery.where=i);const o=function(e){if(0!==e.length)return e.map((e=>{return{field:zl((t=e).field),direction:Vl(t.dir)};var t}))}(t.orderBy);o&&(n.structuredQuery.orderBy=o);const a=ml(e,t.limit);return null!==a&&(n.structuredQuery.limit=a),t.startAt&&(n.structuredQuery.startAt={before:(c=t.startAt).inclusive,values:c.position}),t.endAt&&(n.structuredQuery.endAt=function(e){return{before:!e.inclusive,values:e.position}}(t.endAt)),{gt:n,parent:s};var c}function Ml(e,t,n,r){const{gt:s,parent:i}=Ll(e,t),o={},a=[];let c=0;return n.forEach((e=>{const t=r?e.alias:"aggregate_"+c++;o[t]=e.alias,"count"===e.aggregateType?a.push({alias:t,count:{}}):"avg"===e.aggregateType?a.push({alias:t,avg:{field:zl(e.fieldPath)}}):"sum"===e.aggregateType&&a.push({alias:t,sum:{field:zl(e.fieldPath)}})})),{request:{structuredAggregationQuery:{aggregations:a,structuredQuery:s.structuredQuery},parent:s.parent},yt:o,parent:i}}function Ul(e){let t=kl(e.parent);const n=e.structuredQuery,r=n.from?n.from.length:0;let s=null;if(r>0){Es(1===r,65062);const e=n.from[0];e.allDescendants?s=e.collectionId:t=t.child(e.collectionId)}let i=[];n.where&&(i=function(e){const t=Fl(e);return t instanceof ac&&lc(t)?t.getFilters():[t]}(n.where));let o=[];n.orderBy&&(o=n.orderBy.map((e=>{return new rc(jl((t=e).field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(t.direction));var t})));let a=null;n.limit&&(a=function(e){let t;return t="object"==typeof e?e.value:e,Pi(t)?null:t}(n.limit));let c=null;n.startAt&&(c=function(e){const t=!!e.before,n=e.values||[];return new ec(n,t)}(n.startAt));let u=null;return n.endAt&&(u=function(e){const t=!e.before,n=e.values||[];return new ec(n,t)}(n.endAt)),Oc(t,s,o,i,a,"F",c,u)}function Fl(e){return void 0!==e.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":const t=jl(e.unaryFilter.field);return oc.create(t,"==",{doubleValue:NaN});case"IS_NULL":const n=jl(e.unaryFilter.field);return oc.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=jl(e.unaryFilter.field);return oc.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const s=jl(e.unaryFilter.field);return oc.create(s,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return Is(61313);default:return Is(60726)}}(e):void 0!==e.fieldFilter?(t=e,oc.create(jl(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return Is(58110);default:return Is(50506)}}(t.fieldFilter.op),t.fieldFilter.value)):void 0!==e.compositeFilter?function(e){return ac.create(e.compositeFilter.filters.map((e=>Fl(e))),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return Is(1026)}}(e.compositeFilter.op))}(e):Is(30097,{filter:e});var t}function Vl(e){return dl[e]}function Bl(e){return fl[e]}function ql(e){return pl[e]}function zl(e){return{fieldPath:e.canonicalString()}}function jl(e){return ei.fromServerFormat(e.fieldPath)}function $l(e){return e instanceof oc?function(e){if("=="===e.op){if(qa(e.value))return{unaryFilter:{field:zl(e.field),op:"IS_NAN"}};if(Ba(e.value))return{unaryFilter:{field:zl(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(qa(e.value))return{unaryFilter:{field:zl(e.field),op:"IS_NOT_NAN"}};if(Ba(e.value))return{unaryFilter:{field:zl(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:zl(e.field),op:Bl(e.op),value:e.value}}}(e):e instanceof ac?function(e){const t=e.getFilters().map((e=>$l(e)));return 1===t.length?t[0]:{compositeFilter:{op:ql(e.op),filters:t}}}(e):Is(54877,{filter:e})}function Gl(e){const t=[];return e.fields.forEach((e=>t.push(e.canonicalString()))),{fieldPaths:t}}function Kl(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hl{constructor(e,t,n,r,s=Qs.min(),i=Qs.min(),o=aa.EMPTY_BYTE_STRING,a=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=i,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(e){return new Hl(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Hl(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Hl(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Hl(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wl{constructor(e){this.wt=e}}function Ql(e,t){const n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:Jl(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument())r.document={name:El(s=e.wt,(i=t).key),fields:i.data.value.mapValue.fields,updateTime:yl(s,i.version.toTimestamp()),createTime:yl(s,i.createTime.toTimestamp())};else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:Yl(t.version)};else{if(!t.isUnknownDocument())return Is(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:Yl(t.version)}}var s,i;return r}function Jl(e){const t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function Yl(e){const t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function Xl(e){const t=new Ws(e.seconds,e.nanoseconds);return Qs.fromTimestamp(t)}function Zl(e,t){const n=(t.baseMutations||[]).map((t=>Ol(e.wt,t)));for(let i=0;i<t.mutations.length-1;++i){const e=t.mutations[i];if(i+1<t.mutations.length&&void 0!==t.mutations[i+1].transform){const n=t.mutations[i+1];e.updateTransforms=n.transform.fieldTransforms,t.mutations.splice(i+1,1),++i}}const r=t.mutations.map((t=>Ol(e.wt,t))),s=Ws.fromMillis(t.localWriteTimeMs);return new zu(t.batchId,s,n,r)}function eh(e){const t=Xl(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?Xl(e.lastLimboFreeSnapshotVersion):Qs.min();let r;return r=void 0!==e.query.documents?function(e){const t=e.documents.length;return Es(1===t,1966,{count:t}),Fc(Pc(kl(e.documents[0])))}(e.query):function(e){return Fc(Ul(e))}(e.query),new Hl(r,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,aa.fromBase64String(e.resumeToken))}function th(e,t){const n=Yl(t.snapshotVersion),r=Yl(t.lastLimboFreeSnapshotVersion);let s;s=Ac(t.target)?Pl(e.wt,t.target):Ll(e.wt,t.target).gt;const i=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:Cc(t.target),readTime:n,resumeToken:i,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:s}}function nh(e){const t=Ul({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?zc(t,t.limit,"L"):t}function rh(e,t){return new $u(t.largestBatchId,Ol(e.wt,t.overlayMutation))}function sh(e,t){const n=t.path.lastSegment();return[e,Fi(t.path.popLast()),n]}function ih(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:Yl(r.readTime),documentKey:Fi(r.documentKey.path),largestBatchId:r.largestBatchId}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oh{getBundleMetadata(e,t){return ah(e).get(t).next((e=>{if(e)return{id:(t=e).bundleId,createTime:Xl(t.createTime),version:t.version};var t}))}saveBundleMetadata(e,t){return ah(e).put({bundleId:(n=t).id,createTime:Yl(_l(n.createTime)),version:n.version});var n}getNamedQuery(e,t){return ch(e).get(t).next((e=>{if(e)return{name:(t=e).name,query:nh(t.bundledQuery),readTime:Xl(t.readTime)};var t}))}saveNamedQuery(e,t){return ch(e).put({name:(n=t).name,readTime:Yl(_l(n.readTime)),bundledQuery:n.bundledQuery});var n}}function ah(e){return Wo(e,bo)}function ch(e){return Wo(e,Io)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uh{constructor(e,t){this.serializer=e,this.userId=t}static bt(e,t){const n=t.uid||"";return new uh(e,n)}getOverlay(e,t){return lh(e).get(sh(this.userId,t)).next((e=>e?rh(this.serializer,e):null))}getOverlays(e,t){const n=nu();return yi.forEach(t,(t=>this.getOverlay(e,t).next((e=>{null!==e&&n.set(t,e)})))).next((()=>n))}saveOverlays(e,t,n){const r=[];return n.forEach(((n,s)=>{const i=new $u(t,s);r.push(this.St(e,i))})),yi.waitFor(r)}removeOverlaysForBatchId(e,t,n){const r=new Set;t.forEach((e=>r.add(Fi(e.getCollectionPath()))));const s=[];return r.forEach((t=>{const r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);s.push(lh(e).X(Lo,r))})),yi.waitFor(s)}getOverlaysForCollection(e,t,n){const r=nu(),s=Fi(t),i=IDBKeyRange.bound([this.userId,s,n],[this.userId,s,Number.POSITIVE_INFINITY],!0);return lh(e).J(Lo,i).next((e=>{for(const t of e){const e=rh(this.serializer,t);r.set(e.getKey(),e)}return r}))}getOverlaysForCollectionGroup(e,t,n,r){const s=nu();let i;const o=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return lh(e).te({index:Uo,range:o},((e,t,n)=>{const o=rh(this.serializer,t);s.size()<r||o.largestBatchId===i?(s.set(o.getKey(),o),i=o.largestBatchId):n.done()})).next((()=>s))}St(e,t){return lh(e).put(function(e,t,n){const[r,s,i]=sh(t,n.mutation.key);return{userId:t,collectionPath:s,documentId:i,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:Dl(e.wt,n.mutation)}}(this.serializer,this.userId,t))}}function lh(e){return Wo(e,Oo)}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hh{Dt(e){return Wo(e,Vo)}getSessionToken(e){return this.Dt(e).get("sessionToken").next((e=>{const t=null==e?void 0:e.value;return t?aa.fromUint8Array(t):aa.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.Dt(e).put({name:"sessionToken",value:t.toUint8Array()})}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dh{constructor(){}vt(e,t){this.Ct(e,t),t.Ft()}Ct(e,t){if("nullValue"in e)this.Mt(t,5);else if("booleanValue"in e)this.Mt(t,10),t.xt(e.booleanValue?1:0);else if("integerValue"in e)this.Mt(t,15),t.xt(la(e.integerValue));else if("doubleValue"in e){const n=la(e.doubleValue);isNaN(n)?this.Mt(t,13):(this.Mt(t,15),Li(n)?t.xt(0):t.xt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Mt(t,20),"string"==typeof n&&(n=ua(n)),t.Ot(`${n.seconds||""}`),t.xt(n.nanos||0)}else if("stringValue"in e)this.Nt(e.stringValue,t),this.Bt(t);else if("bytesValue"in e)this.Mt(t,30),t.Lt(ha(e.bytesValue)),this.Bt(t);else if("referenceValue"in e)this.kt(e.referenceValue,t);else if("geoPointValue"in e){const n=e.geoPointValue;this.Mt(t,45),t.xt(n.latitude||0),t.xt(n.longitude||0)}else"mapValue"in e?Ga(e)?this.Mt(t,Number.MAX_SAFE_INTEGER):ja(e)?this.qt(e.mapValue,t):(this.Qt(e.mapValue,t),this.Bt(t)):"arrayValue"in e?(this.$t(e.arrayValue,t),this.Bt(t)):Is(19022,{Ut:e})}Nt(e,t){this.Mt(t,25),this.Kt(e,t)}Kt(e,t){t.Ot(e)}Qt(e,t){const n=e.fields||{};this.Mt(t,55);for(const r of Object.keys(n))this.Nt(r,t),this.Ct(n[r],t)}qt(e,t){var n,r;const s=e.fields||{};this.Mt(t,53);const i=Ca,o=(null===(r=null===(n=s[i].arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.length)||0;this.Mt(t,15),t.xt(la(o)),this.Nt(i,t),this.Ct(s[i],t)}$t(e,t){const n=e.values||[];this.Mt(t,50);for(const r of n)this.Ct(r,t)}kt(e,t){this.Mt(t,37),ti.fromName(e).path.forEach((e=>{this.Mt(t,60),this.Kt(e,t)}))}Mt(e,t){e.xt(t)}Bt(e){e.xt(2)}}dh.Wt=new dh;
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fh=255;function ph(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}function gh(e){const t=64-function(e){let t=0;for(let n=0;n<8;++n){const r=ph(255&e[n]);if(t+=r,8!==r)break}return t}(e);return Math.ceil(t/8)}class mh{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Gt(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.zt(n.value),n=t.next();this.jt()}Ht(e){const t=e[Symbol.iterator]();let n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Yt()}Zt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.zt(e);else if(e<2048)this.zt(960|e>>>6),this.zt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.zt(480|e>>>12),this.zt(128|63&e>>>6),this.zt(128|63&e);else{const e=t.codePointAt(0);this.zt(240|e>>>18),this.zt(128|63&e>>>12),this.zt(128|63&e>>>6),this.zt(128|63&e)}}this.jt()}Xt(e){for(const t of e){const e=t.charCodeAt(0);if(e<128)this.Jt(e);else if(e<2048)this.Jt(960|e>>>6),this.Jt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Jt(480|e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e);else{const e=t.codePointAt(0);this.Jt(240|e>>>18),this.Jt(128|63&e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e)}}this.Yt()}en(e){const t=this.tn(e),n=gh(t);this.nn(1+n),this.buffer[this.position++]=255&n;for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=255&t[r]}rn(e){const t=this.tn(e),n=gh(t);this.nn(1+n),this.buffer[this.position++]=~(255&n);for(let r=t.length-n;r<t.length;++r)this.buffer[this.position++]=~(255&t[r])}sn(){this._n(fh),this._n(255)}an(){this.un(fh),this.un(255)}reset(){this.position=0}seed(e){this.nn(e.length),this.buffer.set(e,this.position),this.position+=e.length}cn(){return this.buffer.slice(0,this.position)}tn(e){const t=function(e){const t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let r=1;r<t.length;++r)t[r]^=n?255:0;return t}zt(e){const t=255&e;0===t?(this._n(0),this._n(255)):t===fh?(this._n(fh),this._n(0)):this._n(t)}Jt(e){const t=255&e;0===t?(this.un(0),this.un(255)):t===fh?(this.un(fh),this.un(0)):this.un(e)}jt(){this._n(0),this._n(1)}Yt(){this.un(0),this.un(1)}_n(e){this.nn(1),this.buffer[this.position++]=e}un(e){this.nn(1),this.buffer[this.position++]=~e}nn(e){const t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);const r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class yh{constructor(e){this.ln=e}Lt(e){this.ln.Gt(e)}Ot(e){this.ln.Zt(e)}xt(e){this.ln.en(e)}Ft(){this.ln.sn()}}class vh{constructor(e){this.ln=e}Lt(e){this.ln.Ht(e)}Ot(e){this.ln.Xt(e)}xt(e){this.ln.rn(e)}Ft(){this.ln.an()}}class wh{constructor(){this.ln=new mh,this.hn=new yh(this.ln),this.Pn=new vh(this.ln)}seed(e){this.ln.seed(e)}Tn(e){return 0===e?this.hn:this.Pn}cn(){return this.ln.cn()}reset(){this.ln.reset()}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{constructor(e,t,n,r){this.indexId=e,this.documentKey=t,this.arrayValue=n,this.directionalValue=r}In(){const e=this.directionalValue.length,t=0===e||255===this.directionalValue[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.directionalValue,0),t!==e?n.set([0],this.directionalValue.length):++n[n.length-1],new _h(this.indexId,this.documentKey,this.arrayValue,n)}}function bh(e,t){let n=e.indexId-t.indexId;return 0!==n?n:(n=Ih(e.arrayValue,t.arrayValue),0!==n?n:(n=Ih(e.directionalValue,t.directionalValue),0!==n?n:ti.comparator(e.documentKey,t.documentKey)))}function Ih(e,t){for(let n=0;n<e.length&&n<t.length;++n){const r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Th{constructor(e){this.En=new na(((e,t)=>ei.comparator(e.field,t.field))),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.dn=e.orderBy,this.An=[];for(const t of e.filters){const e=t;e.isInequality()?this.En=this.En.add(e):this.An.push(e)}}get Rn(){return this.En.size>1}Vn(e){if(Es(e.collectionGroup===this.collectionId,49279),this.Rn)return!1;const t=si(e);if(void 0!==t&&!this.mn(t))return!1;const n=ii(e);let r=new Set,s=0,i=0;for(;s<n.length&&this.mn(n[s]);++s)r=r.add(n[s].fieldPath.canonicalString());if(s===n.length)return!0;if(this.En.size>0){const e=this.En.getIterator().getNext();if(!r.has(e.field.canonicalString())){const t=n[s];if(!this.fn(e,t)||!this.gn(this.dn[i++],t))return!1}++s}for(;s<n.length;++s){const e=n[s];if(i>=this.dn.length||!this.gn(this.dn[i++],e))return!1}return!0}pn(){if(this.Rn)return null;let e=new na(ei.comparator);const t=[];for(const n of this.An)if(!n.field.isKeyField())if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new ai(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new ai(n.field,0))}for(const n of this.dn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new ai(n.field,"asc"===n.dir?0:1)));return new ri(ri.UNKNOWN_ID,this.collectionId,t,ui.empty())}mn(e){for(const t of this.An)if(this.fn(t,e))return!0;return!1}fn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;const n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}gn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eh(e){var t,n;if(Es(e instanceof oc||e instanceof ac,20012),e instanceof oc){if(e instanceof bc){const r=(null===(n=null===(t=e.value.arrayValue)||void 0===t?void 0:t.values)||void 0===n?void 0:n.map((t=>oc.create(e.field,"==",t))))||[];return ac.create(r,"or")}return e}const r=e.filters.map((e=>Eh(e)));return ac.create(r,e.op)}function Sh(e){if(0===e.getFilters().length)return[];const t=Nh(Eh(e));return Es(Ah(t),7391),Ch(t)||kh(t)?[t]:t.getFilters()}function Ch(e){return e instanceof oc}function kh(e){return e instanceof ac&&lc(e)}function Ah(e){return Ch(e)||kh(e)||function(e){if(e instanceof ac&&uc(e)){for(const t of e.getFilters())if(!Ch(t)&&!kh(t))return!1;return!0}return!1}(e)}function Nh(e){if(Es(e instanceof oc||e instanceof ac,34018),e instanceof oc)return e;if(1===e.filters.length)return Nh(e.filters[0]);const t=e.filters.map((e=>Nh(e)));let n=ac.create(t,e.op);return n=Dh(n),Ah(n)?n:(Es(n instanceof ac,64498),Es(cc(n),40251),Es(n.filters.length>1,57927),n.filters.reduce(((e,t)=>Rh(e,t))))}function Rh(e,t){let n;return Es(e instanceof oc||e instanceof ac,38388),Es(t instanceof oc||t instanceof ac,25473),n=e instanceof oc?t instanceof oc?(r=e,s=t,ac.create([r,s],"and")):xh(e,t):t instanceof oc?xh(t,e):function(e,t){if(Es(e.filters.length>0&&t.filters.length>0,48005),cc(e)&&cc(t))return pc(e,t.getFilters());const n=uc(e)?e:t,r=uc(e)?t:e,s=n.filters.map((e=>Rh(e,r)));return ac.create(s,"or")}(e,t),Dh(n);var r,s}function xh(e,t){if(cc(t))return pc(t,e.getFilters());{const n=t.filters.map((t=>Rh(e,t)));return ac.create(n,"or")}}function Dh(e){if(Es(e instanceof oc||e instanceof ac,11850),e instanceof oc)return e;const t=e.getFilters();if(1===t.length)return Dh(t[0]);if(hc(e))return e;const n=t.map((e=>Dh(e))),r=[];return n.forEach((t=>{t instanceof oc?r.push(t):t instanceof ac&&(t.op===e.op?r.push(...t.filters):r.push(t))})),1===r.length?r[0]:ac.create(r,e.op)
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Oh{constructor(){this.yn=new Ph}addToCollectionParentIndex(e,t){return this.yn.add(t),yi.resolve()}getCollectionParents(e,t){return yi.resolve(this.yn.getEntries(t))}addFieldIndex(e,t){return yi.resolve()}deleteFieldIndex(e,t){return yi.resolve()}deleteAllFieldIndexes(e){return yi.resolve()}createTargetIndexes(e,t){return yi.resolve()}getDocumentsMatchingTarget(e,t){return yi.resolve(null)}getIndexType(e,t){return yi.resolve(0)}getFieldIndexes(e,t){return yi.resolve([])}getNextCollectionGroupToUpdate(e){return yi.resolve(null)}getMinOffset(e,t){return yi.resolve(di.min())}getMinOffsetFromCollectionGroup(e,t){return yi.resolve(di.min())}updateCollectionGroup(e,t,n){return yi.resolve()}updateIndexEntries(e,t){return yi.resolve()}}class Ph{constructor(){this.index={}}add(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new na(Xs.comparator),s=!r.has(n);return this.index[t]=r.add(n),s}has(e){const t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new na(Xs.comparator)).toArray()}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lh="IndexedDbIndexManager",Mh=new Uint8Array(0);class Uh{constructor(e,t){this.databaseId=t,this.wn=new Ph,this.bn=new Jc((e=>Cc(e)),((e,t)=>kc(e,t))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.wn.has(t)){const n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener((()=>{this.wn.add(t)}));const s={collectionId:n,parent:Fi(r)};return Fh(e).put(s)}return yi.resolve()}getCollectionParents(e,t){const n=[],r=IDBKeyRange.bound([t,""],[Gs(t),""],!1,!0);return Fh(e).J(r).next((e=>{for(const r of e){if(r.collectionId!==t)break;n.push(qi(r.parent))}return n}))}addFieldIndex(e,t){const n=Bh(e),r={indexId:(s=t).indexId,collectionGroup:s.collectionGroup,fields:s.fields.map((e=>[e.fieldPath.canonicalString(),e.kind]))};var s;delete r.indexId;const i=n.add(r);if(t.indexState){const n=qh(e);return i.next((e=>{n.put(ih(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const n=Bh(e),r=qh(e),s=Vh(e);return n.delete(t.indexId).next((()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=Bh(e),n=Vh(e),r=qh(e);return t.X().next((()=>n.X())).next((()=>r.X()))}createTargetIndexes(e,t){return yi.forEach(this.Sn(t),(t=>this.getIndexType(e,t).next((n=>{if(0===n||1===n){const n=new Th(t).pn();if(null!=n)return this.addFieldIndex(e,n)}}))))}getDocumentsMatchingTarget(e,t){const n=Vh(e);let r=!0;const s=new Map;return yi.forEach(this.Sn(t),(t=>this.Dn(e,t).next((e=>{r&&(r=!!e),s.set(t,e)})))).next((()=>{if(r){let e=au();const r=[];return yi.forEach(s,((s,i)=>{var o;vs(Lh,`Using index ${o=s,`id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map((e=>`${e.fieldPath}:${e.kind}`)).join(",")}`} to execute ${Cc(t)}`);const a=function(e,t){const n=si(t);if(void 0===n)return null;for(const r of Nc(e,n.fieldPath))switch(r.op){case"array-contains-any":return r.value.arrayValue.values||[];case"array-contains":return[r.value]}return null}(i,s),c=function(e,t){const n=new Map;for(const r of ii(t))for(const t of Nc(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(i,s),u=function(e,t){const n=[];let r=!0;for(const s of ii(t)){const t=0===s.kind?Rc(e,s.fieldPath,e.startAt):xc(e,s.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new ec(n,r)}(i,s),l=function(e,t){const n=[];let r=!0;for(const s of ii(t)){const t=0===s.kind?xc(e,s.fieldPath,e.endAt):Rc(e,s.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new ec(n,r)}(i,s),h=this.vn(s,i,u),d=this.vn(s,i,l),f=this.Cn(s,i,c),p=this.Fn(s.indexId,a,h,u.inclusive,d,l.inclusive,f);return yi.forEach(p,(s=>n.Z(s,t.limit).next((t=>{t.forEach((t=>{const n=ti.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))}))}))))})).next((()=>r))}return yi.resolve(null)}))}Sn(e){let t=this.bn.get(e);return t||(t=0===e.filters.length?[e]:Sh(ac.create(e.filters,"and")).map((t=>Sc(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt))),this.bn.set(e,t),t)}Fn(e,t,n,r,s,i,o){const a=(null!=t?t.length:1)*Math.max(n.length,s.length),c=a/(null!=t?t.length:1),u=[];for(let l=0;l<a;++l){const a=t?this.Mn(t[l/c]):Mh,h=this.xn(e,a,n[l%c],r),d=this.On(e,a,s[l%c],i),f=o.map((t=>this.xn(e,a,t,!0)));u.push(...this.createRange(h,d,f))}return u}xn(e,t,n,r){const s=new _h(e,ti.empty(),t,n);return r?s:s.In()}On(e,t,n,r){const s=new _h(e,ti.empty(),t,n);return r?s.In():s}Dn(e,t){const n=new Th(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next((e=>{let t=null;for(const r of e)n.Vn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t}))}getIndexType(e,t){let n=2;const r=this.Sn(t);return yi.forEach(r,(t=>this.Dn(e,t).next((e=>{e?0!==n&&e.fields.length<function(e){let t=new na(ei.comparator),n=!1;for(const r of e.filters)for(const e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(const r of e.orderBy)r.field.isKeyField()||(t=t.add(r.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})))).next((()=>null!==t.limit&&r.length>1&&2===n?1:n))}Nn(e,t){const n=new wh;for(const r of ii(e)){const e=t.data.field(r.fieldPath);if(null==e)return null;const s=n.Tn(r.kind);dh.Wt.vt(e,s)}return n.cn()}Mn(e){const t=new wh;return dh.Wt.vt(e,t.Tn(0)),t.cn()}Bn(e,t){const n=new wh;return dh.Wt.vt(Ua(this.databaseId,t),n.Tn(function(e){const t=ii(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.cn()}Cn(e,t,n){if(null===n)return[];let r=[];r.push(new wh);let s=0;for(const i of ii(e)){const e=n[s++];for(const n of r)if(this.Ln(t,i.fieldPath)&&Va(e))r=this.kn(r,i,e);else{const t=n.Tn(i.kind);dh.Wt.vt(e,t)}}return this.qn(r)}vn(e,t,n){return this.Cn(e,t,n.position)}qn(e){const t=[];for(let n=0;n<e.length;++n)t[n]=e[n].cn();return t}kn(e,t,n){const r=[...e],s=[];for(const i of n.arrayValue.values||[])for(const e of r){const n=new wh;n.seed(e.cn()),dh.Wt.vt(i,n.Tn(t.kind)),s.push(n)}return s}Ln(e,t){return!!e.filters.find((e=>e instanceof oc&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op)))}getFieldIndexes(e,t){const n=Bh(e),r=qh(e);return(t?n.J(Eo,IDBKeyRange.bound(t,t)):n.J()).next((e=>{const t=[];return yi.forEach(e,(e=>r.get([e.indexId,this.uid]).next((n=>{t.push(function(e,t){const n=t?new ui(t.sequenceNumber,new di(Xl(t.readTime),new ti(qi(t.documentKey)),t.largestBatchId)):ui.empty(),r=e.fields.map((([e,t])=>new ai(ei.fromServerFormat(e),t)));return new ri(e.indexId,e.collectionGroup,r,n)}(e,n))})))).next((()=>t))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((e=>0===e.length?null:(e.sort(((e,t)=>{const n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:Bs(e.collectionGroup,t.collectionGroup)})),e[0].collectionGroup)))}updateCollectionGroup(e,t,n){const r=Bh(e),s=qh(e);return this.Qn(e).next((e=>r.J(Eo,IDBKeyRange.bound(t,t)).next((t=>yi.forEach(t,(t=>s.put(ih(t.indexId,this.uid,e,n))))))))}updateIndexEntries(e,t){const n=new Map;return yi.forEach(t,((t,r)=>{const s=n.get(t.collectionGroup);return(s?yi.resolve(s):this.getFieldIndexes(e,t.collectionGroup)).next((s=>(n.set(t.collectionGroup,s),yi.forEach(s,(n=>this.$n(e,t,n).next((t=>{const s=this.Un(r,n);return t.isEqual(s)?yi.resolve():this.Kn(e,r,n,t,s)})))))))}))}Wn(e,t,n,r){return Vh(e).put({indexId:r.indexId,uid:this.uid,arrayValue:r.arrayValue,directionalValue:r.directionalValue,orderedDocumentKey:this.Bn(n,t.key),documentKey:t.key.path.toArray()})}Gn(e,t,n,r){return Vh(e).delete([r.indexId,this.uid,r.arrayValue,r.directionalValue,this.Bn(n,t.key),t.key.path.toArray()])}$n(e,t,n){const r=Vh(e);let s=new na(bh);return r.te({index:xo,range:IDBKeyRange.only([n.indexId,this.uid,this.Bn(n,t)])},((e,r)=>{s=s.add(new _h(n.indexId,t,r.arrayValue,r.directionalValue))})).next((()=>s))}Un(e,t){let n=new na(bh);const r=this.Nn(t,e);if(null==r)return n;const s=si(t);if(null!=s){const i=e.data.field(s.fieldPath);if(Va(i))for(const s of i.arrayValue.values||[])n=n.add(new _h(t.indexId,e.key,this.Mn(s),r))}else n=n.add(new _h(t.indexId,e.key,Mh,r));return n}Kn(e,t,n,r,s){vs(Lh,"Updating index entries for document '%s'",t.key);const i=[];return function(e,t,n,r,s){const i=e.getIterator(),o=t.getIterator();let a=sa(i),c=sa(o);for(;a||c;){let e=!1,t=!1;if(a&&c){const r=n(a,c);r<0?t=!0:r>0&&(e=!0)}else null!=a?t=!0:e=!0;e?(r(c),c=sa(o)):t?(s(a),a=sa(i)):(a=sa(i),c=sa(o))}}(r,s,bh,(r=>{i.push(this.Wn(e,t,n,r))}),(r=>{i.push(this.Gn(e,t,n,r))})),yi.waitFor(i)}Qn(e){let t=1;return qh(e).te({index:ko,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((e,n,r)=>{r.done(),t=n.sequenceNumber+1})).next((()=>t))}createRange(e,t,n){n=n.sort(((e,t)=>bh(e,t))).filter(((e,t,n)=>!t||0!==bh(e,n[t-1])));const r=[];r.push(e);for(const i of n){const n=bh(i,e),s=bh(i,t);if(0===n)r[0]=e.In();else if(n>0&&s<0)r.push(i),r.push(i.In());else if(s>0)break}r.push(t);const s=[];for(let i=0;i<r.length;i+=2){if(this.zn(r[i],r[i+1]))return[];const e=[r[i].indexId,this.uid,r[i].arrayValue,r[i].directionalValue,Mh,[]],t=[r[i+1].indexId,this.uid,r[i+1].arrayValue,r[i+1].directionalValue,Mh,[]];s.push(IDBKeyRange.bound(e,t))}return s}zn(e,t){return bh(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(zh)}getMinOffset(e,t){return yi.mapArray(this.Sn(t),(t=>this.Dn(e,t).next((e=>e||Is(44426))))).next(zh)}}function Fh(e){return Wo(e,vo)}function Vh(e){return Wo(e,No)}function Bh(e){return Wo(e,To)}function qh(e){return Wo(e,So)}function zh(e){Es(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){const s=e[r].indexState.offset;fi(s,t)<0&&(t=s),n<s.largestBatchId&&(n=s.largestBatchId)}return new di(t.readTime,t.documentKey,n)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jh={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},$h=41943040;class Gh{static withCacheSize(e){return new Gh(e,Gh.DEFAULT_COLLECTION_PERCENTILE,Gh.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kh(e,t,n){const r=e.store(Ki),s=e.store(Zi),i=[],o=IDBKeyRange.only(n.batchId);let a=0;const c=r.te({range:o},((e,t,n)=>(a++,n.delete())));i.push(c.next((()=>{Es(1===a,47070,{batchId:n.batchId})})));const u=[];for(const l of n.mutations){const e=Yi(t,l.key.path,n.batchId);i.push(s.delete(e)),u.push(l.key)}return yi.waitFor(i).next((()=>u))}function Hh(e){if(!e)return 0;let t;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw Is(14731);t=e.noDocument}return JSON.stringify(t).length}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Gh.DEFAULT_COLLECTION_PERCENTILE=10,Gh.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,Gh.DEFAULT=new Gh($h,Gh.DEFAULT_COLLECTION_PERCENTILE,Gh.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),Gh.DISABLED=new Gh(-1,0,0);class Wh{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.jn={}}static bt(e,t,n,r){Es(""!==e.uid,64387);const s=e.isAuthenticated()?e.uid:"";return new Wh(s,t,n,r)}checkEmpty(e){let t=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Jh(e).te({index:Wi,range:n},((e,n,r)=>{t=!1,r.done()})).next((()=>t))}addMutationBatch(e,t,n,r){const s=Yh(e),i=Jh(e);return i.add({}).next((o=>{Es("number"==typeof o,49019);const a=new zu(o,t,n,r),c=function(e,t,n){const r=n.baseMutations.map((t=>Dl(e.wt,t))),s=n.mutations.map((t=>Dl(e.wt,t)));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:s}}(this.serializer,this.userId,a),u=[];let l=new na(((e,t)=>Bs(e.canonicalString(),t.canonicalString())));for(const e of r){const t=Yi(this.userId,e.key.path,o);l=l.add(e.key.path.popLast()),u.push(i.put(c)),u.push(s.put(t,Xi))}return l.forEach((t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))})),e.addOnCommittedListener((()=>{this.jn[o]=a.keys()})),yi.waitFor(u).next((()=>a))}))}lookupMutationBatch(e,t){return Jh(e).get(t).next((e=>e?(Es(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),Zl(this.serializer,e)):null))}Hn(e,t){return this.jn[t]?yi.resolve(this.jn[t]):this.lookupMutationBatch(e,t).next((e=>{if(e){const n=e.keys();return this.jn[t]=n,n}return null}))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]);let s=null;return Jh(e).te({index:Wi,range:r},((e,t,r)=>{t.userId===this.userId&&(Es(t.batchId>=n,47524,{Jn:n}),s=Zl(this.serializer,t)),r.done()})).next((()=>s))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=Oi;return Jh(e).te({index:Wi,range:t,reverse:!0},((e,t,r)=>{n=t.batchId,r.done()})).next((()=>n))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,Oi],[this.userId,Number.POSITIVE_INFINITY]);return Jh(e).J(Wi,t).next((e=>e.map((e=>Zl(this.serializer,e)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const n=Ji(this.userId,t.path),r=IDBKeyRange.lowerBound(n),s=[];return Yh(e).te({range:r},((n,r,i)=>{const[o,a,c]=n,u=qi(a);if(o===this.userId&&t.path.isEqual(u))return Jh(e).get(c).next((e=>{if(!e)throw Is(61480,{Yn:n,batchId:c});Es(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:c}),s.push(Zl(this.serializer,e))}));i.done()})).next((()=>s))}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new na(Bs);const r=[];return t.forEach((t=>{const s=Ji(this.userId,t.path),i=IDBKeyRange.lowerBound(s),o=Yh(e).te({range:i},((e,r,s)=>{const[i,o,a]=e,c=qi(o);i===this.userId&&t.path.isEqual(c)?n=n.add(a):s.done()}));r.push(o)})),yi.waitFor(r).next((()=>this.Zn(e,n)))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1,s=Ji(this.userId,n),i=IDBKeyRange.lowerBound(s);let o=new na(Bs);return Yh(e).te({range:i},((e,t,s)=>{const[i,a,c]=e,u=qi(a);i===this.userId&&n.isPrefixOf(u)?u.length===r&&(o=o.add(c)):s.done()})).next((()=>this.Zn(e,o)))}Zn(e,t){const n=[],r=[];return t.forEach((t=>{r.push(Jh(e).get(t).next((e=>{if(null===e)throw Is(35274,{batchId:t});Es(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(Zl(this.serializer,e))})))})),yi.waitFor(r).next((()=>n))}removeMutationBatch(e,t){return Kh(e.he,this.userId,t).next((n=>(e.addOnCommittedListener((()=>{this.Xn(t.batchId)})),yi.forEach(n,(t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))))}Xn(e){delete this.jn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return yi.resolve();const n=IDBKeyRange.lowerBound([this.userId]),r=[];return Yh(e).te({range:n},((e,t,n)=>{if(e[0]===this.userId){const t=qi(e[1]);r.push(t)}else n.done()})).next((()=>{Es(0===r.length,56720,{er:r.map((e=>e.canonicalString()))})}))}))}containsKey(e,t){return Qh(e,this.userId,t)}tr(e){return Xh(e).get(this.userId).next((e=>e||{userId:this.userId,lastAcknowledgedBatchId:Oi,lastStreamToken:""}))}}function Qh(e,t,n){const r=Ji(t,n.path),s=r[1],i=IDBKeyRange.lowerBound(r);let o=!1;return Yh(e).te({range:i,ee:!0},((e,n,r)=>{const[i,a,c]=e;i===t&&a===s&&(o=!0),r.done()})).next((()=>o))}function Jh(e){return Wo(e,Ki)}function Yh(e){return Wo(e,Zi)}function Xh(e){return Wo(e,Gi)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zh{constructor(e){this.nr=e}next(){return this.nr+=2,this.nr}static rr(){return new Zh(0)}static ir(){return new Zh(-1)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ed{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.sr(e).next((t=>{const n=new Zh(t.highestTargetId);return t.highestTargetId=n.next(),this._r(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.sr(e).next((e=>Qs.fromTimestamp(new Ws(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.sr(e).next((e=>e.highestListenSequenceNumber))}setTargetsMetadata(e,t,n){return this.sr(e).next((r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this._r(e,r))))}addTargetData(e,t){return this.ar(e,t).next((()=>this.sr(e).next((n=>(n.targetCount+=1,this.ur(t,n),this._r(e,n))))))}updateTargetData(e,t){return this.ar(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>td(e).delete(t.targetId))).next((()=>this.sr(e))).next((t=>(Es(t.targetCount>0,8065),t.targetCount-=1,this._r(e,t))))}removeTargets(e,t,n){let r=0;const s=[];return td(e).te(((i,o)=>{const a=eh(o);a.sequenceNumber<=t&&null===n.get(a.targetId)&&(r++,s.push(this.removeTargetData(e,a)))})).next((()=>yi.waitFor(s))).next((()=>r))}forEachTarget(e,t){return td(e).te(((e,n)=>{const r=eh(n);t(r)}))}sr(e){return nd(e).get(mo).next((e=>(Es(null!==e,2888),e)))}_r(e,t){return nd(e).put(mo,t)}ar(e,t){return td(e).put(th(this.serializer,t))}ur(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.sr(e).next((e=>e.targetCount))}getTargetData(e,t){const n=Cc(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let s=null;return td(e).te({range:r,index:uo},((e,n,r)=>{const i=eh(n);kc(t,i.target)&&(s=i,r.done())})).next((()=>s))}addMatchingKeys(e,t,n){const r=[],s=rd(e);return t.forEach((t=>{const i=Fi(t.path);r.push(s.put({targetId:n,path:i})),r.push(this.referenceDelegate.addReference(e,n,t))})),yi.waitFor(r)}removeMatchingKeys(e,t,n){const r=rd(e);return yi.forEach(t,(t=>{const s=Fi(t.path);return yi.waitFor([r.delete([n,s]),this.referenceDelegate.removeReference(e,n,t)])}))}removeMatchingKeysForTargetId(e,t){const n=rd(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){const n=IDBKeyRange.bound([t],[t+1],!1,!0),r=rd(e);let s=au();return r.te({range:n,ee:!0},((e,t,n)=>{const r=qi(e[1]),i=new ti(r);s=s.add(i)})).next((()=>s))}containsKey(e,t){const n=Fi(t.path),r=IDBKeyRange.bound([n],[Gs(n)],!1,!0);let s=0;return rd(e).te({index:po,ee:!0,range:r},(([e,t],n,r)=>{0!==e&&(s++,r.done())})).next((()=>s>0))}Rt(e,t){return td(e).get(t).next((e=>e?eh(e):null))}}function td(e){return Wo(e,co)}function nd(e){return Wo(e,yo)}function rd(e){return Wo(e,ho)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const sd="LruGarbageCollector",id=1048576;function od([e,t],[n,r]){const s=Bs(e,n);return 0===s?Bs(t,r):s}class ad{constructor(e){this.cr=e,this.buffer=new na(od),this.lr=0}hr(){return++this.lr}Pr(e){const t=[e,this.hr()];if(this.buffer.size<this.cr)this.buffer=this.buffer.add(t);else{const e=this.buffer.last();od(t,e)<0&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class cd{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Tr=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Ir(6e4)}stop(){this.Tr&&(this.Tr.cancel(),this.Tr=null)}get started(){return null!==this.Tr}Ir(e){vs(sd,`Garbage collection scheduled in ${e}ms`),this.Tr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.Tr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Ei(e)?vs(sd,"Ignoring IndexedDB error during garbage collection: ",e):await mi(e)}await this.Ir(3e5)}))}}class ud{constructor(e,t){this.Er=e,this.params=t}calculateTargetCount(e,t){return this.Er.dr(e).next((e=>Math.floor(t/100*e)))}nthSequenceNumber(e,t){if(0===t)return yi.resolve(Di.le);const n=new ad(t);return this.Er.forEachTarget(e,(e=>n.Pr(e.sequenceNumber))).next((()=>this.Er.Ar(e,(e=>n.Pr(e))))).next((()=>n.maxValue))}removeTargets(e,t,n){return this.Er.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.Er.removeOrphanedDocuments(e,t)}collect(e,t){return-1===this.params.cacheSizeCollectionThreshold?(vs("LruGarbageCollector","Garbage collection skipped; disabled"),yi.resolve(jh)):this.getCacheSize(e).next((n=>n<this.params.cacheSizeCollectionThreshold?(vs("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),jh):this.Rr(e,t)))}getCacheSize(e){return this.Er.getCacheSize(e)}Rr(e,t){let n,r,s,i,o,a,c;const u=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((t=>(t>this.params.maximumSequenceNumbersToCollect?(vs("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,i=Date.now(),this.nthSequenceNumber(e,r)))).next((r=>(n=r,o=Date.now(),this.removeTargets(e,n,t)))).next((t=>(s=t,a=Date.now(),this.removeOrphanedDocuments(e,n)))).next((e=>(c=Date.now(),ys()<=L.DEBUG&&vs("LruGarbageCollector",`LRU Garbage Collection\n\tCounted targets in ${i-u}ms\n\tDetermined least recently used ${r} in `+(o-i)+`ms\n\tRemoved ${s} targets in `+(a-o)+`ms\n\tRemoved ${e} documents in `+(c-a)+`ms\nTotal Duration: ${c-u}ms`),yi.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:s,documentsRemoved:e}))))}}function ld(e,t){return new ud(e,t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hd{constructor(e,t){this.db=e,this.garbageCollector=ld(this,t)}dr(e){const t=this.Vr(e);return this.db.getTargetCache().getTargetCount(e).next((e=>t.next((t=>e+t))))}Vr(e){let t=0;return this.Ar(e,(e=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}Ar(e,t){return this.mr(e,((e,n)=>t(n)))}addReference(e,t,n){return dd(e,n)}removeReference(e,t,n){return dd(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return dd(e,t)}gr(e,t){return function(e,t){let n=!1;return Xh(e).ne((r=>Qh(e,r,t).next((e=>(e&&(n=!0),yi.resolve(!e)))))).next((()=>n))}(e,t)}removeOrphanedDocuments(e,t){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let s=0;return this.mr(e,((i,o)=>{if(o<=t){const t=this.gr(e,i).next((t=>{if(!t)return s++,n.getEntry(e,i).next((()=>(n.removeEntry(i,Qs.min()),rd(e).delete([0,Fi(i.path)]))))}));r.push(t)}})).next((()=>yi.waitFor(r))).next((()=>n.apply(e))).next((()=>s))}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return dd(e,t)}mr(e,t){const n=rd(e);let r,s=Di.le;return n.te({index:po},(([e,n],{path:i,sequenceNumber:o})=>{0===e?(s!==Di.le&&t(new ti(qi(r)),s),s=o,r=i):s=Di.le})).next((()=>{s!==Di.le&&t(new ti(qi(r)),s)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function dd(e,t){return rd(e).put((n=t,r=e.currentSequenceNumber,{targetId:0,path:Fi(n.path),sequenceNumber:r}));var n,r}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fd{constructor(){this.changes=new Jc((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,Za.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const n=this.changes.get(t);return void 0!==n?yi.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pd{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return vd(e).put(n)}removeEntry(e,t,n){return vd(e).delete(function(e,t){const n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],Jl(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next((n=>(n.byteSize+=t,this.pr(e,n))))}getEntry(e,t){let n=Za.newInvalidDocument(t);return vd(e).te({index:no,range:IDBKeyRange.only(wd(t))},((e,r)=>{n=this.yr(t,r)})).next((()=>n))}wr(e,t){let n={size:0,document:Za.newInvalidDocument(t)};return vd(e).te({index:no,range:IDBKeyRange.only(wd(t))},((e,r)=>{n={document:this.yr(t,r),size:Hh(r)}})).next((()=>n))}getEntries(e,t){let n=Xc();return this.br(e,t,((e,t)=>{const r=this.yr(e,t);n=n.insert(e,r)})).next((()=>n))}Sr(e,t){let n=Xc(),r=new Zo(ti.comparator);return this.br(e,t,((e,t)=>{const s=this.yr(e,t);n=n.insert(e,s),r=r.insert(e,Hh(t))})).next((()=>({documents:n,Dr:r})))}br(e,t,n){if(t.isEmpty())return yi.resolve();let r=new na(bd);t.forEach((e=>r=r.add(e)));const s=IDBKeyRange.bound(wd(r.first()),wd(r.last())),i=r.getIterator();let o=i.getNext();return vd(e).te({index:no,range:s},((e,t,r)=>{const s=ti.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;o&&bd(o,s)<0;)n(o,null),o=i.getNext();o&&o.isEqual(s)&&(n(o,t),o=i.hasNext()?i.getNext():null),o?r.H(wd(o)):r.done()})).next((()=>{for(;o;)n(o,null),o=i.hasNext()?i.getNext():null}))}getDocumentsMatchingQuery(e,t,n,r,s){const i=t.path,o=[i.popLast().toArray(),i.lastSegment(),Jl(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],a=[i.popLast().toArray(),i.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return vd(e).J(IDBKeyRange.bound(o,a,!0)).next((e=>{null==s||s.incrementDocumentReadCount(e.length);let n=Xc();for(const s of e){const e=this.yr(ti.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);e.isFoundDocument()&&(Kc(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n}))}getAllFromCollectionGroup(e,t,n,r){let s=Xc();const i=_d(t,n),o=_d(t,di.max());return vd(e).te({index:so,range:IDBKeyRange.bound(i,o,!0)},((e,t,n)=>{const i=this.yr(ti.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);s=s.insert(i.key,i),s.size===r&&n.done()})).next((()=>s))}newChangeBuffer(e){return new md(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((e=>e.byteSize))}getMetadata(e){return yd(e).get(ao).next((e=>(Es(!!e,20021),e)))}pr(e,t){return yd(e).put(ao,t)}yr(e,t){if(t){const e=function(e,t){let n;if(t.document)n=xl(e.wt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){const e=ti.fromSegments(t.noDocument.path),r=Xl(t.noDocument.readTime);n=Za.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return Is(56709);{const e=ti.fromSegments(t.unknownDocument.path),r=Xl(t.unknownDocument.version);n=Za.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){const t=new Ws(e[0],e[1]);return Qs.fromTimestamp(t)}(t.readTime)),n}(this.serializer,t);if(!e.isNoDocument()||!e.version.isEqual(Qs.min()))return e}return Za.newInvalidDocument(e)}}function gd(e){return new pd(e)}class md extends fd{constructor(e,t){super(),this.vr=e,this.trackRemovals=t,this.Cr=new Jc((e=>e.toString()),((e,t)=>e.isEqual(t)))}applyChanges(e){const t=[];let n=0,r=new na(((e,t)=>Bs(e.canonicalString(),t.canonicalString())));return this.changes.forEach(((s,i)=>{const o=this.Cr.get(s);if(t.push(this.vr.removeEntry(e,s,o.readTime)),i.isValidDocument()){const a=Ql(this.vr.serializer,i);r=r.add(s.path.popLast());const c=Hh(a);n+=c-o.size,t.push(this.vr.addEntry(e,s,a))}else if(n-=o.size,this.trackRemovals){const n=Ql(this.vr.serializer,i.convertToNoDocument(Qs.min()));t.push(this.vr.addEntry(e,s,n))}})),r.forEach((n=>{t.push(this.vr.indexManager.addToCollectionParentIndex(e,n))})),t.push(this.vr.updateMetadata(e,n)),yi.waitFor(t)}getFromCache(e,t){return this.vr.wr(e,t).next((e=>(this.Cr.set(t,{size:e.size,readTime:e.document.readTime}),e.document)))}getAllFromCache(e,t){return this.vr.Sr(e,t).next((({documents:e,Dr:t})=>(t.forEach(((t,n)=>{this.Cr.set(t,{size:n,readTime:e.get(t).readTime})})),e)))}}function yd(e){return Wo(e,oo)}function vd(e){return Wo(e,eo)}function wd(e){const t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function _d(e,t){const n=t.documentKey.path.toArray();return[e,Jl(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function bd(e,t){const n=e.path.toArray(),r=t.path.toArray();let s=0;for(let i=0;i<n.length-2&&i<r.length-2;++i)if(s=Bs(n[i],r[i]),s)return s;return s=Bs(n.length,r.length),s||(s=Bs(n[n.length-2],r[r.length-2]),s||Bs(n[n.length-1],r[r.length-1])
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}class Id{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Td{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next((r=>(n=r,this.remoteDocumentCache.getEntry(e,t)))).next((e=>(null!==n&&Du(n.mutation,e,ia.empty(),Ws.now()),e)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((t=>this.getLocalViewOfDocuments(e,t,au()).next((()=>t))))}getLocalViewOfDocuments(e,t,n=au()){const r=nu();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,n).next((e=>{let t=eu();return e.forEach(((e,n)=>{t=t.insert(e,n.overlayedDocument)})),t}))))}getOverlayedDocuments(e,t){const n=nu();return this.populateOverlays(e,n,t).next((()=>this.computeViews(e,t,n,au())))}populateOverlays(e,t,n){const r=[];return n.forEach((e=>{t.has(e)||r.push(e)})),this.documentOverlayCache.getOverlays(e,r).next((e=>{e.forEach(((e,n)=>{t.set(e,n)}))}))}computeViews(e,t,n,r){let s=Xc();const i=su(),o=su();return t.forEach(((e,t)=>{const o=n.get(t.key);r.has(t.key)&&(void 0===o||o.mutation instanceof Mu)?s=s.insert(t.key,t):void 0!==o?(i.set(t.key,o.mutation.getFieldMask()),Du(o.mutation,t,o.mutation.getFieldMask(),Ws.now())):i.set(t.key,ia.empty())})),this.recalculateAndSaveOverlays(e,s).next((e=>(e.forEach(((e,t)=>i.set(e,t))),t.forEach(((e,t)=>{var n;return o.set(e,new Id(t,null!==(n=i.get(e))&&void 0!==n?n:null))})),o)))}recalculateAndSaveOverlays(e,t){const n=su();let r=new Zo(((e,t)=>e-t)),s=au();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((e=>{for(const s of e)s.keys().forEach((e=>{const i=t.get(e);if(null===i)return;let o=n.get(e)||ia.empty();o=s.applyToLocalView(i,o),n.set(e,o);const a=(r.get(s.batchId)||au()).add(e);r=r.insert(s.batchId,a)}))})).next((()=>{const i=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,u=ru();c.forEach((e=>{if(!s.has(e)){const r=Ru(t.get(e),n.get(e));null!==r&&u.set(e,r),s=s.add(e)}})),i.push(this.documentOverlayCache.saveOverlays(e,a,u))}return yi.waitFor(i)})).next((()=>n))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((t=>this.recalculateAndSaveOverlays(e,t)))}getDocumentsMatchingQuery(e,t,n,r){return s=t,ti.isDocumentKey(s.path)&&null===s.collectionGroup&&0===s.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):Mc(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r);var s}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next((s=>{const i=r-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-s.size):yi.resolve(nu());let o=ni,a=s;return i.next((t=>yi.forEach(t,((t,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),s.get(t)?yi.resolve():this.remoteDocumentCache.getEntry(e,t).next((e=>{a=a.insert(t,e)}))))).next((()=>this.populateOverlays(e,t,s))).next((()=>this.computeViews(e,a,t,au()))).next((e=>({batchId:o,changes:tu(e)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new ti(t)).next((e=>{let t=eu();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t}))}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){const s=t.collectionGroup;let i=eu();return this.indexManager.getCollectionParents(e,s).next((o=>yi.forEach(o,(o=>{const a=(c=t,u=o.child(s),new Dc(u,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt));var c,u;return this.getDocumentsMatchingCollectionQuery(e,a,n,r).next((e=>{e.forEach(((e,t)=>{i=i.insert(e,t)}))}))})).next((()=>i))))}getDocumentsMatchingCollectionQuery(e,t,n,r){let s;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next((i=>(s=i,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,s,r)))).next((e=>{s.forEach(((t,n)=>{const r=n.getKey();null===e.get(r)&&(e=e.insert(r,Za.newInvalidDocument(r)))}));let n=eu();return e.forEach(((e,r)=>{const i=s.get(e);void 0!==i&&Du(i.mutation,r,ia.empty(),Ws.now()),Kc(t,r)&&(n=n.insert(e,r))})),n}))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ed{constructor(e){this.serializer=e,this.Fr=new Map,this.Mr=new Map}getBundleMetadata(e,t){return yi.resolve(this.Fr.get(t))}saveBundleMetadata(e,t){return this.Fr.set(t.id,{id:(n=t).id,version:n.version,createTime:_l(n.createTime)}),yi.resolve();var n}getNamedQuery(e,t){return yi.resolve(this.Mr.get(t))}saveNamedQuery(e,t){return this.Mr.set(t.name,{name:(n=t).name,query:nh(n.bundledQuery),readTime:_l(n.readTime)}),yi.resolve();var n}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sd{constructor(){this.overlays=new Zo(ti.comparator),this.Or=new Map}getOverlay(e,t){return yi.resolve(this.overlays.get(t))}getOverlays(e,t){const n=nu();return yi.forEach(t,(t=>this.getOverlay(e,t).next((e=>{null!==e&&n.set(t,e)})))).next((()=>n))}saveOverlays(e,t,n){return n.forEach(((n,r)=>{this.St(e,t,r)})),yi.resolve()}removeOverlaysForBatchId(e,t,n){const r=this.Or.get(n);return void 0!==r&&(r.forEach((e=>this.overlays=this.overlays.remove(e))),this.Or.delete(n)),yi.resolve()}getOverlaysForCollection(e,t,n){const r=nu(),s=t.length+1,i=new ti(t.child("")),o=this.overlays.getIteratorFrom(i);for(;o.hasNext();){const e=o.getNext().value,i=e.getKey();if(!t.isPrefixOf(i.path))break;i.path.length===s&&e.largestBatchId>n&&r.set(e.getKey(),e)}return yi.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let s=new Zo(((e,t)=>e-t));const i=this.overlays.getIterator();for(;i.hasNext();){const e=i.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=s.get(e.largestBatchId);null===t&&(t=nu(),s=s.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}const o=nu(),a=s.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach(((e,t)=>o.set(e,t))),!(o.size()>=r)););return yi.resolve(o)}St(e,t,n){const r=this.overlays.get(n.key);if(null!==r){const e=this.Or.get(r.largestBatchId).delete(n.key);this.Or.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new $u(t,n));let s=this.Or.get(t);void 0===s&&(s=au(),this.Or.set(t,s)),this.Or.set(t,s.add(n.key))}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cd{constructor(){this.sessionToken=aa.EMPTY_BYTE_STRING}getSessionToken(e){return yi.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,yi.resolve()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kd{constructor(){this.Nr=new na(Ad.Br),this.Lr=new na(Ad.kr)}isEmpty(){return this.Nr.isEmpty()}addReference(e,t){const n=new Ad(e,t);this.Nr=this.Nr.add(n),this.Lr=this.Lr.add(n)}qr(e,t){e.forEach((e=>this.addReference(e,t)))}removeReference(e,t){this.Qr(new Ad(e,t))}$r(e,t){e.forEach((e=>this.removeReference(e,t)))}Ur(e){const t=new ti(new Xs([])),n=new Ad(t,e),r=new Ad(t,e+1),s=[];return this.Lr.forEachInRange([n,r],(e=>{this.Qr(e),s.push(e.key)})),s}Kr(){this.Nr.forEach((e=>this.Qr(e)))}Qr(e){this.Nr=this.Nr.delete(e),this.Lr=this.Lr.delete(e)}Wr(e){const t=new ti(new Xs([])),n=new Ad(t,e),r=new Ad(t,e+1);let s=au();return this.Lr.forEachInRange([n,r],(e=>{s=s.add(e.key)})),s}containsKey(e){const t=new Ad(e,0),n=this.Nr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class Ad{constructor(e,t){this.key=e,this.Gr=t}static Br(e,t){return ti.comparator(e.key,t.key)||Bs(e.Gr,t.Gr)}static kr(e,t){return Bs(e.Gr,t.Gr)||ti.comparator(e.key,t.key)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nd{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Jn=1,this.zr=new na(Ad.Br)}checkEmpty(e){return yi.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){const s=this.Jn;this.Jn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const i=new zu(s,t,n,r);this.mutationQueue.push(i);for(const o of r)this.zr=this.zr.add(new Ad(o.key,s)),this.indexManager.addToCollectionParentIndex(e,o.key.path.popLast());return yi.resolve(i)}lookupMutationBatch(e,t){return yi.resolve(this.jr(t))}getNextMutationBatchAfterBatchId(e,t){const n=t+1,r=this.Hr(n),s=r<0?0:r;return yi.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return yi.resolve(0===this.mutationQueue.length?Oi:this.Jn-1)}getAllMutationBatches(e){return yi.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const n=new Ad(t,0),r=new Ad(t,Number.POSITIVE_INFINITY),s=[];return this.zr.forEachInRange([n,r],(e=>{const t=this.jr(e.Gr);s.push(t)})),yi.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new na(Bs);return t.forEach((e=>{const t=new Ad(e,0),r=new Ad(e,Number.POSITIVE_INFINITY);this.zr.forEachInRange([t,r],(e=>{n=n.add(e.Gr)}))})),yi.resolve(this.Jr(n))}getAllMutationBatchesAffectingQuery(e,t){const n=t.path,r=n.length+1;let s=n;ti.isDocumentKey(s)||(s=s.child(""));const i=new Ad(new ti(s),0);let o=new na(Bs);return this.zr.forEachWhile((e=>{const t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(o=o.add(e.Gr)),!0)}),i),yi.resolve(this.Jr(o))}Jr(e){const t=[];return e.forEach((e=>{const n=this.jr(e);null!==n&&t.push(n)})),t}removeMutationBatch(e,t){Es(0===this.Yr(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.zr;return yi.forEach(t.mutations,(r=>{const s=new Ad(r.key,t.batchId);return n=n.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)})).next((()=>{this.zr=n}))}Xn(e){}containsKey(e,t){const n=new Ad(t,0),r=this.zr.firstAfterOrEqual(n);return yi.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,yi.resolve()}Yr(e,t){return this.Hr(e)}Hr(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}jr(e){const t=this.Hr(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rd{constructor(e){this.Zr=e,this.docs=new Zo(ti.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const n=t.key,r=this.docs.get(n),s=r?r.size:0,i=this.Zr(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:i}),this.size+=i-s,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const n=this.docs.get(t);return yi.resolve(n?n.document.mutableCopy():Za.newInvalidDocument(t))}getEntries(e,t){let n=Xc();return t.forEach((e=>{const t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():Za.newInvalidDocument(e))})),yi.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let s=Xc();const i=t.path,o=new ti(i.child("__id-9223372036854775808__")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:e,value:{document:o}}=a.getNext();if(!i.isPrefixOf(e.path))break;e.path.length>i.length+1||fi(hi(o),n)<=0||(r.has(o.key)||Kc(t,o))&&(s=s.insert(o.key,o.mutableCopy()))}return yi.resolve(s)}getAllFromCollectionGroup(e,t,n,r){Is(9500)}Xr(e,t){return yi.forEach(this.docs,(e=>t(e)))}newChangeBuffer(e){return new xd(this)}getSize(e){return yi.resolve(this.size)}}class xd extends fd{constructor(e){super(),this.vr=e}applyChanges(e){const t=[];return this.changes.forEach(((n,r)=>{r.isValidDocument()?t.push(this.vr.addEntry(e,r)):this.vr.removeEntry(n)})),yi.waitFor(t)}getFromCache(e,t){return this.vr.getEntry(e,t)}getAllFromCache(e,t){return this.vr.getEntries(e,t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dd{constructor(e){this.persistence=e,this.ei=new Jc((e=>Cc(e)),kc),this.lastRemoteSnapshotVersion=Qs.min(),this.highestTargetId=0,this.ti=0,this.ni=new kd,this.targetCount=0,this.ri=Zh.rr()}forEachTarget(e,t){return this.ei.forEach(((e,n)=>t(n))),yi.resolve()}getLastRemoteSnapshotVersion(e){return yi.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return yi.resolve(this.ti)}allocateTargetId(e){return this.highestTargetId=this.ri.next(),yi.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.ti&&(this.ti=t),yi.resolve()}ar(e){this.ei.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.ri=new Zh(t),this.highestTargetId=t),e.sequenceNumber>this.ti&&(this.ti=e.sequenceNumber)}addTargetData(e,t){return this.ar(t),this.targetCount+=1,yi.resolve()}updateTargetData(e,t){return this.ar(t),yi.resolve()}removeTargetData(e,t){return this.ei.delete(t.target),this.ni.Ur(t.targetId),this.targetCount-=1,yi.resolve()}removeTargets(e,t,n){let r=0;const s=[];return this.ei.forEach(((i,o)=>{o.sequenceNumber<=t&&null===n.get(o.targetId)&&(this.ei.delete(i),s.push(this.removeMatchingKeysForTargetId(e,o.targetId)),r++)})),yi.waitFor(s).next((()=>r))}getTargetCount(e){return yi.resolve(this.targetCount)}getTargetData(e,t){const n=this.ei.get(t)||null;return yi.resolve(n)}addMatchingKeys(e,t,n){return this.ni.qr(t,n),yi.resolve()}removeMatchingKeys(e,t,n){this.ni.$r(t,n);const r=this.persistence.referenceDelegate,s=[];return r&&t.forEach((t=>{s.push(r.markPotentiallyOrphaned(e,t))})),yi.waitFor(s)}removeMatchingKeysForTargetId(e,t){return this.ni.Ur(t),yi.resolve()}getMatchingKeysForTargetId(e,t){const n=this.ni.Wr(t);return yi.resolve(n)}containsKey(e,t){return yi.resolve(this.ni.containsKey(t))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Od{constructor(e,t){this.ii={},this.overlays={},this.si=new Di(0),this.oi=!1,this.oi=!0,this._i=new Cd,this.referenceDelegate=e(this),this.ai=new Dd(this),this.indexManager=new Oh,this.remoteDocumentCache=new Rd((e=>this.referenceDelegate.ui(e))),this.serializer=new Wl(t),this.ci=new Ed(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.oi=!1,Promise.resolve()}get started(){return this.oi}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new Sd,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ii[e.toKey()];return n||(n=new Nd(t,this.referenceDelegate),this.ii[e.toKey()]=n),n}getGlobalsCache(){return this._i}getTargetCache(){return this.ai}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.ci}runTransaction(e,t,n){vs("MemoryPersistence","Starting transaction:",e);const r=new Pd(this.si.next());return this.referenceDelegate.li(),n(r).next((e=>this.referenceDelegate.hi(r).next((()=>e)))).toPromise().then((e=>(r.raiseOnCommittedEvent(),e)))}Pi(e,t){return yi.or(Object.values(this.ii).map((n=>()=>n.containsKey(e,t))))}}class Pd extends gi{constructor(e){super(),this.currentSequenceNumber=e}}class Ld{constructor(e){this.persistence=e,this.Ti=new kd,this.Ii=null}static Ei(e){return new Ld(e)}get di(){if(this.Ii)return this.Ii;throw Is(60996)}addReference(e,t,n){return this.Ti.addReference(n,t),this.di.delete(n.toString()),yi.resolve()}removeReference(e,t,n){return this.Ti.removeReference(n,t),this.di.add(n.toString()),yi.resolve()}markPotentiallyOrphaned(e,t){return this.di.add(t.toString()),yi.resolve()}removeTarget(e,t){this.Ti.Ur(t.targetId).forEach((e=>this.di.add(e.toString())));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next((e=>{e.forEach((e=>this.di.add(e.toString())))})).next((()=>n.removeTargetData(e,t)))}li(){this.Ii=new Set}hi(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return yi.forEach(this.di,(n=>{const r=ti.fromPath(n);return this.Ai(e,r).next((e=>{e||t.removeEntry(r,Qs.min())}))})).next((()=>(this.Ii=null,t.apply(e))))}updateLimboDocument(e,t){return this.Ai(e,t).next((e=>{e?this.di.delete(t.toString()):this.di.add(t.toString())}))}ui(e){return 0}Ai(e,t){return yi.or([()=>yi.resolve(this.Ti.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Pi(e,t)])}}class Md{constructor(e,t){this.persistence=e,this.Ri=new Jc((e=>Fi(e.path)),((e,t)=>e.isEqual(t))),this.garbageCollector=ld(this,t)}static Ei(e,t){return new Md(e,t)}li(){}hi(e){return yi.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}dr(e){const t=this.Vr(e);return this.persistence.getTargetCache().getTargetCount(e).next((e=>t.next((t=>e+t))))}Vr(e){let t=0;return this.Ar(e,(e=>{t++})).next((()=>t))}Ar(e,t){return yi.forEach(this.Ri,((n,r)=>this.gr(e,n,r).next((e=>e?yi.resolve():t(r)))))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0;const r=this.persistence.getRemoteDocumentCache(),s=r.newChangeBuffer();return r.Xr(e,(r=>this.gr(e,r,t).next((e=>{e||(n++,s.removeEntry(r,Qs.min()))})))).next((()=>s.apply(e))).next((()=>n))}markPotentiallyOrphaned(e,t){return this.Ri.set(t,e.currentSequenceNumber),yi.resolve()}removeTarget(e,t){const n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.Ri.set(n,e.currentSequenceNumber),yi.resolve()}removeReference(e,t,n){return this.Ri.set(n,e.currentSequenceNumber),yi.resolve()}updateLimboDocument(e,t){return this.Ri.set(t,e.currentSequenceNumber),yi.resolve()}ui(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=Ma(e.data.value)),t}gr(e,t,n){return yi.or([()=>this.persistence.Pi(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const e=this.Ri.get(t);return yi.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ud{constructor(e){this.serializer=e}q(e,t,n,r){const s=new wi("createOrUpgrade",t);n<1&&r>=1&&(e.createObjectStore(ji),function(e){e.createObjectStore(Gi,{keyPath:"userId"});e.createObjectStore(Ki,{keyPath:Hi,autoIncrement:!0}).createIndex(Wi,Qi,{unique:!0}),e.createObjectStore(Zi)}(e),Fd(e),function(e){e.createObjectStore(zi)}(e));let i=yi.resolve();return n<3&&r>=3&&(0!==n&&(function(e){e.deleteObjectStore(ho),e.deleteObjectStore(co),e.deleteObjectStore(yo)}(e),Fd(e)),i=i.next((()=>function(e){const t=e.store(yo),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:Qs.min().toTimestamp(),targetCount:0};return t.put(mo,n)}(s)))),n<4&&r>=4&&(0!==n&&(i=i.next((()=>function(e,t){return t.store(Ki).J().next((n=>{e.deleteObjectStore(Ki),e.createObjectStore(Ki,{keyPath:Hi,autoIncrement:!0}).createIndex(Wi,Qi,{unique:!0});const r=t.store(Ki),s=n.map((e=>r.put(e)));return yi.waitFor(s)}))}(e,s)))),i=i.next((()=>{!function(e){e.createObjectStore(_o,{keyPath:"clientId"})}(e)}))),n<5&&r>=5&&(i=i.next((()=>this.Vi(s)))),n<6&&r>=6&&(i=i.next((()=>(function(e){e.createObjectStore(oo)}(e),this.mi(s))))),n<7&&r>=7&&(i=i.next((()=>this.fi(s)))),n<8&&r>=8&&(i=i.next((()=>this.gi(e,s)))),n<9&&r>=9&&(i=i.next((()=>{!function(e){e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")}(e)}))),n<10&&r>=10&&(i=i.next((()=>this.pi(s)))),n<11&&r>=11&&(i=i.next((()=>{!function(e){e.createObjectStore(bo,{keyPath:"bundleId"})}(e),function(e){e.createObjectStore(Io,{keyPath:"name"})}(e)}))),n<12&&r>=12&&(i=i.next((()=>{!function(e){const t=e.createObjectStore(Oo,{keyPath:Po});t.createIndex(Lo,Mo,{unique:!1}),t.createIndex(Uo,Fo,{unique:!1})}(e)}))),n<13&&r>=13&&(i=i.next((()=>function(e){const t=e.createObjectStore(eo,{keyPath:to});t.createIndex(no,ro),t.createIndex(so,io)}(e))).next((()=>this.yi(e,s))).next((()=>e.deleteObjectStore(zi)))),n<14&&r>=14&&(i=i.next((()=>this.wi(e,s)))),n<15&&r>=15&&(i=i.next((()=>function(e){e.createObjectStore(To,{keyPath:"indexId",autoIncrement:!0}).createIndex(Eo,"collectionGroup",{unique:!1});e.createObjectStore(So,{keyPath:Co}).createIndex(ko,Ao,{unique:!1});e.createObjectStore(No,{keyPath:Ro}).createIndex(xo,Do,{unique:!1})}(e)))),n<16&&r>=16&&(i=i.next((()=>{t.objectStore(So).clear()})).next((()=>{t.objectStore(No).clear()}))),n<17&&r>=17&&(i=i.next((()=>{!function(e){e.createObjectStore(Vo,{keyPath:"name"})}(e)}))),i}mi(e){let t=0;return e.store(zi).te(((e,n)=>{t+=Hh(n)})).next((()=>{const n={byteSize:t};return e.store(oo).put(ao,n)}))}Vi(e){const t=e.store(Gi),n=e.store(Ki);return t.J().next((t=>yi.forEach(t,(t=>{const r=IDBKeyRange.bound([t.userId,Oi],[t.userId,t.lastAcknowledgedBatchId]);return n.J(Wi,r).next((n=>yi.forEach(n,(n=>{Es(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});const r=Zl(this.serializer,n);return Kh(e,t.userId,r).next((()=>{}))}))))}))))}fi(e){const t=e.store(ho),n=e.store(zi);return e.store(yo).get(mo).next((e=>{const r=[];return n.te(((n,s)=>{const i=new Xs(n),o=[0,Fi(i)];r.push(t.get(o).next((n=>{return n?yi.resolve():(r=i,t.put({targetId:0,path:Fi(r),sequenceNumber:e.highestListenSequenceNumber}));var r})))})).next((()=>yi.waitFor(r)))}))}gi(e,t){e.createObjectStore(vo,{keyPath:wo});const n=t.store(vo),r=new Ph,s=e=>{if(r.add(e)){const t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:Fi(r)})}};return t.store(zi).te({ee:!0},((e,t)=>{const n=new Xs(e);return s(n.popLast())})).next((()=>t.store(Zi).te({ee:!0},(([e,t,n],r)=>{const i=qi(t);return s(i.popLast())}))))}pi(e){const t=e.store(co);return t.te(((e,n)=>{const r=eh(n),s=th(this.serializer,r);return t.put(s)}))}yi(e,t){const n=t.store(zi),r=[];return n.te(((e,n)=>{const s=t.store(eo),i=(a=n,a.document?new ti(Xs.fromString(a.document.name).popFirst(5)):a.noDocument?ti.fromSegments(a.noDocument.path):a.unknownDocument?ti.fromSegments(a.unknownDocument.path):Is(36783)).path.toArray(),o={prefixPath:i.slice(0,i.length-2),collectionGroup:i[i.length-2],documentId:i[i.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};var a;r.push(s.put(o))})).next((()=>yi.waitFor(r)))}wi(e,t){const n=t.store(Ki),r=gd(this.serializer),s=new Od(Ld.Ei,this.serializer.wt);return n.J().next((e=>{const n=new Map;return e.forEach((e=>{var t;let r=null!==(t=n.get(e.userId))&&void 0!==t?t:au();Zl(this.serializer,e).keys().forEach((e=>r=r.add(e))),n.set(e.userId,r)})),yi.forEach(n,((e,n)=>{const i=new ps(n),o=uh.bt(this.serializer,i),a=s.getIndexManager(i),c=Wh.bt(i,this.serializer,a,s.referenceDelegate);return new Td(r,c,o,a).recalculateAndSaveOverlaysForDocumentKeys(new Ho(t,Di.le),e).next()}))}))}}function Fd(e){e.createObjectStore(ho,{keyPath:fo}).createIndex(po,go,{unique:!0}),e.createObjectStore(co,{keyPath:"targetId"}).createIndex(uo,lo,{unique:!0}),e.createObjectStore(yo)}const Vd="IndexedDbPersistence",Bd=18e5,qd=5e3,zd="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",jd="main";class $d{constructor(e,t,n,r,s,i,o,a,c,u,l=17){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.bi=s,this.window=i,this.document=o,this.Si=c,this.Di=u,this.Ci=l,this.si=null,this.oi=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Fi=null,this.inForeground=!1,this.Mi=null,this.xi=null,this.Oi=Number.NEGATIVE_INFINITY,this.Ni=e=>Promise.resolve(),!$d.C())throw new ks(Cs.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new hd(this,r),this.Bi=t+jd,this.serializer=new Wl(a),this.Li=new _i(this.Bi,this.Ci,new Ud(this.serializer)),this._i=new hh,this.ai=new ed(this.referenceDelegate,this.serializer),this.remoteDocumentCache=gd(this.serializer),this.ci=new oh,this.window&&this.window.localStorage?this.ki=this.window.localStorage:(this.ki=null,!1===u&&ws(Vd,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.qi().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new ks(Cs.FAILED_PRECONDITION,zd);return this.Qi(),this.$i(),this.Ui(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.ai.getHighestSequenceNumber(e)))})).then((e=>{this.si=new Di(e,this.Si)})).then((()=>{this.oi=!0})).catch((e=>(this.Li&&this.Li.close(),Promise.reject(e))))}Ki(e){return this.Ni=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Li.U((async t=>{null===t.newVersion&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.bi.enqueueAndForget((async()=>{this.started&&await this.qi()})))}qi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>Kd(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.Wi(e).next((e=>{e||(this.isPrimary=!1,this.bi.enqueueRetryable((()=>this.Ni(!1))))}))})).next((()=>this.Gi(e))).next((t=>this.isPrimary&&!t?this.zi(e).next((()=>!1)):!!t&&this.ji(e).next((()=>!0)))))).catch((e=>{if(Ei(e))return vs(Vd,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return vs(Vd,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.bi.enqueueRetryable((()=>this.Ni(e))),this.isPrimary=e}))}Wi(e){return Gd(e).get($i).next((e=>yi.resolve(this.Hi(e))))}Ji(e){return Kd(e).delete(this.clientId)}async Yi(){if(this.isPrimary&&!this.Zi(this.Oi,Bd)){this.Oi=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(e=>{const t=Wo(e,_o);return t.J().next((e=>{const n=this.Xi(e,Bd),r=e.filter((e=>-1===n.indexOf(e)));return yi.forEach(r,(e=>t.delete(e.clientId))).next((()=>r))}))})).catch((()=>[]));if(this.ki)for(const t of e)this.ki.removeItem(this.es(t.clientId))}}Ui(){this.xi=this.bi.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.qi().then((()=>this.Yi())).then((()=>this.Ui()))))}Hi(e){return!!e&&e.ownerId===this.clientId}Gi(e){return this.Di?yi.resolve(!0):Gd(e).get($i).next((t=>{if(null!==t&&this.Zi(t.leaseTimestampMs,qd)&&!this.ts(t.ownerId)){if(this.Hi(t)&&this.networkEnabled)return!0;if(!this.Hi(t)){if(!t.allowTabSynchronization)throw new ks(Cs.FAILED_PRECONDITION,zd);return!1}}return!(!this.networkEnabled||!this.inForeground)||Kd(e).J().next((e=>void 0===this.Xi(e,qd).find((e=>{if(this.clientId!==e.clientId){const t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))))})).next((e=>(this.isPrimary!==e&&vs(Vd,`Client ${e?"is":"is not"} eligible for a primary lease.`),e)))}async shutdown(){this.oi=!1,this.ns(),this.xi&&(this.xi.cancel(),this.xi=null),this.rs(),this.ss(),await this.Li.runTransaction("shutdown","readwrite",[ji,_o],(e=>{const t=new Ho(e,Di.le);return this.zi(t).next((()=>this.Ji(t)))})),this.Li.close(),this._s()}Xi(e,t){return e.filter((e=>this.Zi(e.updateTimeMs,t)&&!this.ts(e.clientId)))}us(){return this.runTransaction("getActiveClients","readonly",(e=>Kd(e).J().next((e=>this.Xi(e,Bd).map((e=>e.clientId))))))}get started(){return this.oi}getGlobalsCache(){return this._i}getMutationQueue(e,t){return Wh.bt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.ai}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new Uh(e,this.serializer.wt.databaseId)}getDocumentOverlayCache(e){return uh.bt(this.serializer,e)}getBundleCache(){return this.ci}runTransaction(e,t,n){vs(Vd,"Starting transaction:",e);const r="readonly"===t?"readonly":"readwrite",s=17===(i=this.Ci)?Ko:16===i?Go:15===i?$o:14===i?jo:13===i?zo:12===i?qo:11===i?Bo:void Is(60245);var i;let o;return this.Li.runTransaction(e,r,s,(r=>(o=new Ho(r,this.si?this.si.next():Di.le),"readwrite-primary"===t?this.Wi(o).next((e=>!!e||this.Gi(o))).next((t=>{if(!t)throw ws(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.bi.enqueueRetryable((()=>this.Ni(!1))),new ks(Cs.FAILED_PRECONDITION,pi);return n(o)})).next((e=>this.ji(o).next((()=>e)))):this.cs(o).next((()=>n(o)))))).then((e=>(o.raiseOnCommittedEvent(),e)))}cs(e){return Gd(e).get($i).next((e=>{if(null!==e&&this.Zi(e.leaseTimestampMs,qd)&&!this.ts(e.ownerId)&&!this.Hi(e)&&!(this.Di||this.allowTabSynchronization&&e.allowTabSynchronization))throw new ks(Cs.FAILED_PRECONDITION,zd)}))}ji(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Gd(e).put($i,t)}static C(){return _i.C()}zi(e){const t=Gd(e);return t.get($i).next((e=>this.Hi(e)?(vs(Vd,"Releasing primary lease."),t.delete($i)):yi.resolve()))}Zi(e,t){const n=Date.now();return!(e<n-t||e>n&&(ws(`Detected an update time that is in the future: ${e} > ${n}`),1))}Qi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Mi=()=>{this.bi.enqueueAndForget((()=>(this.inForeground="visible"===this.document.visibilityState,this.qi())))},this.document.addEventListener("visibilitychange",this.Mi),this.inForeground="visible"===this.document.visibilityState)}rs(){this.Mi&&(this.document.removeEventListener("visibilitychange",this.Mi),this.Mi=null)}$i(){var e;"function"==typeof(null===(e=this.window)||void 0===e?void 0:e.addEventListener)&&(this.Fi=()=>{this.ns();const e=/(?:Version|Mobile)\/1[456]/;m()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.bi.enterRestrictedMode(!0),this.bi.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.Fi))}ss(){this.Fi&&(this.window.removeEventListener("pagehide",this.Fi),this.Fi=null)}ts(e){var t;try{const n=null!==(null===(t=this.ki)||void 0===t?void 0:t.getItem(this.es(e)));return vs(Vd,`Client '${e}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return ws(Vd,"Failed to get zombied client id.",n),!1}}ns(){if(this.ki)try{this.ki.setItem(this.es(this.clientId),String(Date.now()))}catch(e){ws("Failed to set zombie client id.",e)}}_s(){if(this.ki)try{this.ki.removeItem(this.es(this.clientId))}catch(e){}}es(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Gd(e){return Wo(e,ji)}function Kd(e){return Wo(e,_o)}function Hd(e,t){let n=e.projectId;return e.isDefaultDatabase||(n+="."+e.database),"firestore/"+t+"/"+n+"/"
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Wd{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.ls=n,this.hs=r}static Ps(e,t){let n=au(),r=au();for(const s of t.docChanges)switch(s.type){case 0:n=n.add(s.doc.key);break;case 1:r=r.add(s.doc.key)}return new Wd(e,t.fromCache,n,r)}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qd{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jd{constructor(){this.Ts=!1,this.Is=!1,this.Es=100,this.ds=m()?8:bi(g())>0?6:4}initialize(e,t){this.As=e,this.indexManager=t,this.Ts=!0}getDocumentsMatchingQuery(e,t,n,r){const s={result:null};return this.Rs(e,t).next((e=>{s.result=e})).next((()=>{if(!s.result)return this.Vs(e,t,r,n).next((e=>{s.result=e}))})).next((()=>{if(s.result)return;const n=new Qd;return this.fs(e,t,n).next((r=>{if(s.result=r,this.Is)return this.gs(e,t,n,r.size)}))})).next((()=>s.result))}gs(e,t,n,r){return n.documentReadCount<this.Es?(ys()<=L.DEBUG&&vs("QueryEngine","SDK will not create cache indexes for query:",Gc(t),"since it only creates cache indexes for collection contains","more than or equal to",this.Es,"documents"),yi.resolve()):(ys()<=L.DEBUG&&vs("QueryEngine","Query:",Gc(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.ds*r?(ys()<=L.DEBUG&&vs("QueryEngine","The SDK decides to create cache indexes for query:",Gc(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Fc(t))):yi.resolve())}Rs(e,t){if(Lc(t))return yi.resolve(null);let n=Fc(t);return this.indexManager.getIndexType(e,n).next((r=>0===r?null:(null!==t.limit&&1===r&&(t=zc(t,null,"F"),n=Fc(t)),this.indexManager.getDocumentsMatchingTarget(e,n).next((r=>{const s=au(...r);return this.As.getDocuments(e,s).next((r=>this.indexManager.getMinOffset(e,n).next((n=>{const i=this.ps(t,r);return this.ys(t,i,s,n.readTime)?this.Rs(e,zc(t,null,"F")):this.ws(e,i,t,n)}))))})))))}Vs(e,t,n,r){return Lc(t)||r.isEqual(Qs.min())?yi.resolve(null):this.As.getDocuments(e,n).next((s=>{const i=this.ps(t,s);return this.ys(t,i,n,r)?yi.resolve(null):(ys()<=L.DEBUG&&vs("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Gc(t)),this.ws(e,i,t,li(r,ni)).next((e=>e)))}))}ps(e,t){let n=new na(Wc(e));return t.forEach(((t,r)=>{Kc(e,r)&&(n=n.add(r))})),n}ys(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;const s="F"===e.limitType?t.last():t.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(r)>0)}fs(e,t,n){return ys()<=L.DEBUG&&vs("QueryEngine","Using full collection scan to execute query:",Gc(t)),this.As.getDocumentsMatchingQuery(e,t,di.min(),n)}ws(e,t,n,r){return this.As.getDocumentsMatchingQuery(e,n,r).next((e=>(t.forEach((t=>{e=e.insert(t.key,t)})),e)))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yd="LocalStore";class Xd{constructor(e,t,n,r){this.persistence=e,this.bs=t,this.serializer=r,this.Ss=new Zo(Bs),this.Ds=new Jc((e=>Cc(e)),kc),this.vs=new Map,this.Cs=e.getRemoteDocumentCache(),this.ai=e.getTargetCache(),this.ci=e.getBundleCache(),this.Fs(n)}Fs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Td(this.Cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Cs.setIndexManager(this.indexManager),this.bs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.Ss)))}}function Zd(e,t,n,r){return new Xd(e,t,n,r)}async function ef(e,t){const n=Ss(e);return await n.persistence.runTransaction("Handle user change","readonly",(e=>{let r;return n.mutationQueue.getAllMutationBatches(e).next((s=>(r=s,n.Fs(t),n.mutationQueue.getAllMutationBatches(e)))).next((t=>{const s=[],i=[];let o=au();for(const e of r){s.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}for(const e of t){i.push(e.batchId);for(const t of e.mutations)o=o.add(t.key)}return n.localDocuments.getDocuments(e,o).next((e=>({Ms:e,removedBatchIds:s,addedBatchIds:i})))}))}))}function tf(e){const t=Ss(e);return t.persistence.runTransaction("Get last remote snapshot version","readonly",(e=>t.ai.getLastRemoteSnapshotVersion(e)))}function nf(e,t,n){let r=au(),s=au();return n.forEach((e=>r=r.add(e))),t.getEntries(e,r).next((e=>{let r=Xc();return n.forEach(((n,i)=>{const o=e.get(n);i.isFoundDocument()!==o.isFoundDocument()&&(s=s.add(n)),i.isNoDocument()&&i.version.isEqual(Qs.min())?(t.removeEntry(n,i.readTime),r=r.insert(n,i)):!o.isValidDocument()||i.version.compareTo(o.version)>0||0===i.version.compareTo(o.version)&&o.hasPendingWrites?(t.addEntry(i),r=r.insert(n,i)):vs(Yd,"Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",i.version)})),{xs:r,Os:s}}))}function rf(e,t){const n=Ss(e);return n.persistence.runTransaction("Get next mutation batch","readonly",(e=>(void 0===t&&(t=Oi),n.mutationQueue.getNextMutationBatchAfterBatchId(e,t))))}function sf(e,t){const n=Ss(e);return n.persistence.runTransaction("Allocate target","readwrite",(e=>{let r;return n.ai.getTargetData(e,t).next((s=>s?(r=s,yi.resolve(r)):n.ai.allocateTargetId(e).next((s=>(r=new Hl(t,s,"TargetPurposeListen",e.currentSequenceNumber),n.ai.addTargetData(e,r).next((()=>r)))))))})).then((e=>{const r=n.Ss.get(e.targetId);return(null===r||e.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.Ss=n.Ss.insert(e.targetId,e),n.Ds.set(t,e.targetId)),e}))}async function of(e,t,n){const r=Ss(e),s=r.Ss.get(t),i=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",i,(e=>r.persistence.referenceDelegate.removeTarget(e,s)))}catch(o){if(!Ei(o))throw o;vs(Yd,`Failed to update sequence numbers for target ${t}: ${o}`)}r.Ss=r.Ss.remove(t),r.Ds.delete(s.target)}function af(e,t,n){const r=Ss(e);let s=Qs.min(),i=au();return r.persistence.runTransaction("Execute query","readwrite",(e=>function(e,t,n){const r=Ss(e),s=r.Ds.get(n);return void 0!==s?yi.resolve(r.Ss.get(s)):r.ai.getTargetData(t,n)}(r,e,Fc(t)).next((t=>{if(t)return s=t.lastLimboFreeSnapshotVersion,r.ai.getMatchingKeysForTargetId(e,t.targetId).next((e=>{i=e}))})).next((()=>r.bs.getDocumentsMatchingQuery(e,t,n?s:Qs.min(),n?i:au()))).next((e=>(lf(r,Hc(t),e),{documents:e,Ns:i})))))}function cf(e,t){const n=Ss(e),r=Ss(n.ai),s=n.Ss.get(t);return s?Promise.resolve(s.target):n.persistence.runTransaction("Get target data","readonly",(e=>r.Rt(e,t).next((e=>e?e.target:null))))}function uf(e,t){const n=Ss(e),r=n.vs.get(t)||Qs.min();return n.persistence.runTransaction("Get new document changes","readonly",(e=>n.Cs.getAllFromCollectionGroup(e,t,li(r,ni),Number.MAX_SAFE_INTEGER))).then((e=>(lf(n,t,e),e)))}function lf(e,t,n){let r=e.vs.get(t)||Qs.min();n.forEach(((e,t)=>{t.readTime.compareTo(r)>0&&(r=t.readTime)})),e.vs.set(t,r)}async function hf(e,t,n=au()){const r=await sf(e,Fc(nh(t.bundledQuery))),s=Ss(e);return s.persistence.runTransaction("Save named query","readwrite",(e=>{const i=_l(t.readTime);if(r.snapshotVersion.compareTo(i)>=0)return s.ci.saveNamedQuery(e,t);const o=r.withResumeToken(aa.EMPTY_BYTE_STRING,i);return s.Ss=s.Ss.insert(o.targetId,o),s.ai.updateTargetData(e,o).next((()=>s.ai.removeMatchingKeysForTargetId(e,r.targetId))).next((()=>s.ai.addMatchingKeys(e,n,r.targetId))).next((()=>s.ci.saveNamedQuery(e,t)))}))}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const df="firestore_clients";function ff(e,t){return`${df}_${e}_${t}`}const pf="firestore_mutations";function gf(e,t,n){let r=`${pf}_${e}_${n}`;return t.isAuthenticated()&&(r+=`_${t.uid}`),r}const mf="firestore_targets";function yf(e,t){return`${mf}_${e}_${t}`}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vf="SharedClientState";class wf{constructor(e,t,n,r){this.user=e,this.batchId=t,this.state=n,this.error=r}static qs(e,t,n){const r=JSON.parse(n);let s,i="object"==typeof r&&-1!==["pending","acknowledged","rejected"].indexOf(r.state)&&(void 0===r.error||"object"==typeof r.error);return i&&r.error&&(i="string"==typeof r.error.message&&"string"==typeof r.error.code,i&&(s=new ks(r.error.code,r.error.message))),i?new wf(e,t,r.state,s):(ws(vf,`Failed to parse mutation state for ID '${t}': ${n}`),null)}Qs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class _f{constructor(e,t,n){this.targetId=e,this.state=t,this.error=n}static qs(e,t){const n=JSON.parse(t);let r,s="object"==typeof n&&-1!==["not-current","current","rejected"].indexOf(n.state)&&(void 0===n.error||"object"==typeof n.error);return s&&n.error&&(s="string"==typeof n.error.message&&"string"==typeof n.error.code,s&&(r=new ks(n.error.code,n.error.message))),s?new _f(e,n.state,r):(ws(vf,`Failed to parse target state for ID '${e}': ${t}`),null)}Qs(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class bf{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static qs(e,t){const n=JSON.parse(t);let r="object"==typeof n&&n.activeTargetIds instanceof Array,s=uu();for(let i=0;r&&i<n.activeTargetIds.length;++i)r=Mi(n.activeTargetIds[i]),s=s.add(n.activeTargetIds[i]);return r?new bf(e,s):(ws(vf,`Failed to parse client data for instance '${e}': ${t}`),null)}}class If{constructor(e,t){this.clientId=e,this.onlineState=t}static qs(e){const t=JSON.parse(e);return"object"==typeof t&&-1!==["Unknown","Online","Offline"].indexOf(t.onlineState)&&"string"==typeof t.clientId?new If(t.clientId,t.onlineState):(ws(vf,`Failed to parse online state: ${e}`),null)}}class Tf{constructor(){this.activeTargetIds=uu()}$s(e){this.activeTargetIds=this.activeTargetIds.add(e)}Us(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Qs(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class Ef{constructor(e,t,n,r,s){this.window=e,this.bi=t,this.persistenceKey=n,this.Ks=r,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.Ws=this.Gs.bind(this),this.zs=new Zo(Bs),this.started=!1,this.js=[];const i=n.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=s,this.Hs=ff(this.persistenceKey,this.Ks),this.Js=`firestore_sequence_number_${this.persistenceKey}`,this.zs=this.zs.insert(this.Ks,new Tf),this.Ys=new RegExp(`^${df}_${i}_([^_]*)$`),this.Zs=new RegExp(`^${pf}_${i}_(\\d+)(?:_(.*))?$`),this.Xs=new RegExp(`^${mf}_${i}_(\\d+)$`),this.eo=function(e){return`firestore_online_state_${e}`}(this.persistenceKey),this.no=function(e){return`firestore_bundle_loaded_v2_${e}`}(this.persistenceKey),this.window.addEventListener("storage",this.Ws)}static C(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.us();for(const n of e){if(n===this.Ks)continue;const e=this.getItem(ff(this.persistenceKey,n));if(e){const t=bf.qs(n,e);t&&(this.zs=this.zs.insert(t.clientId,t))}}this.ro();const t=this.storage.getItem(this.eo);if(t){const e=this.io(t);e&&this.so(e)}for(const n of this.js)this.Gs(n);this.js=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.Js,JSON.stringify(e))}getAllActiveQueryTargets(){return this.oo(this.zs)}isActiveQueryTarget(e){let t=!1;return this.zs.forEach(((n,r)=>{r.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this._o(e,"pending")}updateMutationState(e,t,n){this._o(e,t,n),this.ao(e)}addLocalQueryTarget(e,t=!0){let n="not-current";if(this.isActiveQueryTarget(e)){const t=this.storage.getItem(yf(this.persistenceKey,e));if(t){const r=_f.qs(e,t);r&&(n=r.state)}}return t&&this.uo.$s(e),this.ro(),n}removeLocalQueryTarget(e){this.uo.Us(e),this.ro()}isLocalQueryTarget(e){return this.uo.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(yf(this.persistenceKey,e))}updateQueryState(e,t,n){this.co(e,t,n)}handleUserChange(e,t,n){t.forEach((e=>{this.ao(e)})),this.currentUser=e,n.forEach((e=>{this.addPendingMutation(e)}))}setOnlineState(e){this.lo(e)}notifyBundleLoaded(e){this.ho(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.Ws),this.removeItem(this.Hs),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return vs(vf,"READ",e,t),t}setItem(e,t){vs(vf,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){vs(vf,"REMOVE",e),this.storage.removeItem(e)}Gs(e){const t=e;if(t.storageArea===this.storage){if(vs(vf,"EVENT",t.key,t.newValue),t.key===this.Hs)return void ws("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.bi.enqueueRetryable((async()=>{if(this.started){if(null!==t.key)if(this.Ys.test(t.key)){if(null==t.newValue){const e=this.Po(t.key);return this.To(e,null)}{const e=this.Io(t.key,t.newValue);if(e)return this.To(e.clientId,e)}}else if(this.Zs.test(t.key)){if(null!==t.newValue){const e=this.Eo(t.key,t.newValue);if(e)return this.Ao(e)}}else if(this.Xs.test(t.key)){if(null!==t.newValue){const e=this.Ro(t.key,t.newValue);if(e)return this.Vo(e)}}else if(t.key===this.eo){if(null!==t.newValue){const e=this.io(t.newValue);if(e)return this.so(e)}}else if(t.key===this.Js){const e=function(e){let t=Di.le;if(null!=e)try{const n=JSON.parse(e);Es("number"==typeof n,30636,{mo:e}),t=n}catch(n){ws(vf,"Failed to read sequence number from WebStorage",n)}return t}(t.newValue);e!==Di.le&&this.sequenceNumberHandler(e)}else if(t.key===this.no){const e=this.fo(t.newValue);await Promise.all(e.map((e=>this.syncEngine.po(e))))}}else this.js.push(t)}))}}get uo(){return this.zs.get(this.Ks)}ro(){this.setItem(this.Hs,this.uo.Qs())}_o(e,t,n){const r=new wf(this.currentUser,e,t,n),s=gf(this.persistenceKey,this.currentUser,e);this.setItem(s,r.Qs())}ao(e){const t=gf(this.persistenceKey,this.currentUser,e);this.removeItem(t)}lo(e){const t={clientId:this.Ks,onlineState:e};this.storage.setItem(this.eo,JSON.stringify(t))}co(e,t,n){const r=yf(this.persistenceKey,e),s=new _f(e,t,n);this.setItem(r,s.Qs())}ho(e){const t=JSON.stringify(Array.from(e));this.setItem(this.no,t)}Po(e){const t=this.Ys.exec(e);return t?t[1]:null}Io(e,t){const n=this.Po(e);return bf.qs(n,t)}Eo(e,t){const n=this.Zs.exec(e),r=Number(n[1]),s=void 0!==n[2]?n[2]:null;return wf.qs(new ps(s),r,t)}Ro(e,t){const n=this.Xs.exec(e),r=Number(n[1]);return _f.qs(r,t)}io(e){return If.qs(e)}fo(e){return JSON.parse(e)}async Ao(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.yo(e.batchId,e.state,e.error);vs(vf,`Ignoring mutation for non-active user ${e.user.uid}`)}Vo(e){return this.syncEngine.wo(e.targetId,e.state,e.error)}To(e,t){const n=t?this.zs.insert(e,t):this.zs.remove(e),r=this.oo(this.zs),s=this.oo(n),i=[],o=[];return s.forEach((e=>{r.has(e)||i.push(e)})),r.forEach((e=>{s.has(e)||o.push(e)})),this.syncEngine.bo(i,o).then((()=>{this.zs=n}))}so(e){this.zs.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}oo(e){let t=uu();return e.forEach(((e,n)=>{t=t.unionWith(n.activeTargetIds)})),t}}class Sf{constructor(){this.So=new Tf,this.Do={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.So.$s(e),this.Do[e]||"not-current"}updateQueryState(e,t,n){this.Do[e]=t}removeLocalQueryTarget(e){this.So.Us(e)}isLocalQueryTarget(e){return this.So.activeTargetIds.has(e)}clearQueryState(e){delete this.Do[e]}getAllActiveQueryTargets(){return this.So.activeTargetIds}isActiveQueryTarget(e){return this.So.activeTargetIds.has(e)}start(){return this.So=new Tf,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cf{vo(e){}shutdown(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kf="ConnectivityMonitor";class Af{constructor(){this.Co=()=>this.Fo(),this.Mo=()=>this.xo(),this.Oo=[],this.No()}vo(e){this.Oo.push(e)}shutdown(){window.removeEventListener("online",this.Co),window.removeEventListener("offline",this.Mo)}No(){window.addEventListener("online",this.Co),window.addEventListener("offline",this.Mo)}Fo(){vs(kf,"Network connectivity changed: AVAILABLE");for(const e of this.Oo)e(0)}xo(){vs(kf,"Network connectivity changed: UNAVAILABLE");for(const e of this.Oo)e(1)}static C(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Nf=null;function Rf(){return null===Nf?Nf=268435456+Math.round(2147483648*Math.random()):Nf++,"0x"+Nf.toString(16)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const xf="RestConnection",Df={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class Of{get Bo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Lo=t+"://"+e.host,this.ko=`projects/${n}/databases/${r}`,this.qo=this.databaseId.database===_a?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Qo(e,t,n,r,s){const i=Rf(),o=this.$o(e,t.toUriEncodedString());vs(xf,`Sending RPC '${e}' ${i}:`,o,n);const a={"google-cloud-resource-prefix":this.ko,"x-goog-request-params":this.qo};this.Uo(a,r,s);const{host:c}=new URL(o),u=N(c);return this.Ko(e,o,a,n,u).then((t=>(vs(xf,`Received RPC '${e}' ${i}: `,t),t)),(t=>{throw _s(xf,`RPC '${e}' ${i} failed with error: `,t,"url: ",o,"request:",n),t}))}Wo(e,t,n,r,s,i){return this.Qo(e,t,n,r,s)}Uo(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+gs,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((t,n)=>e[n]=t)),n&&n.headers.forEach(((t,n)=>e[n]=t))}$o(e,t){const n=Df[e];return`${this.Lo}/v1/${t}:${n}`}terminate(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pf{constructor(e){this.Go=e.Go,this.zo=e.zo}jo(e){this.Ho=e}Jo(e){this.Yo=e}Zo(e){this.Xo=e}onMessage(e){this.e_=e}close(){this.zo()}send(e){this.Go(e)}t_(){this.Ho()}n_(){this.Yo()}r_(e){this.Xo(e)}i_(e){this.e_(e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lf="WebChannelConnection";class Mf extends Of{constructor(e){super(e),this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Ko(e,t,n,r,s){const i=Rf();return new Promise(((s,o)=>{const a=new rs;a.setWithCredentials(!0),a.listenOnce(is.COMPLETE,(()=>{try{switch(a.getLastErrorCode()){case os.NO_ERROR:const t=a.getResponseJson();vs(Lf,`XHR for RPC '${e}' ${i} received:`,JSON.stringify(t)),s(t);break;case os.TIMEOUT:vs(Lf,`RPC '${e}' ${i} timed out`),o(new ks(Cs.DEADLINE_EXCEEDED,"Request time out"));break;case os.HTTP_ERROR:const n=a.getStatus();if(vs(Lf,`RPC '${e}' ${i} failed with status:`,n,"response text:",a.getResponseText()),n>0){let e=a.getResponseJson();Array.isArray(e)&&(e=e[0]);const t=null==e?void 0:e.error;if(t&&t.status&&t.message){const e=function(e){const t=e.toLowerCase().replace(/_/g,"-");return Object.values(Cs).indexOf(t)>=0?t:Cs.UNKNOWN}(t.status);o(new ks(e,t.message))}else o(new ks(Cs.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new ks(Cs.UNAVAILABLE,"Connection failed."));break;default:Is(9055,{s_:e,streamId:i,o_:a.getLastErrorCode(),__:a.getLastError()})}}finally{vs(Lf,`RPC '${e}' ${i} completed.`)}}));const c=JSON.stringify(r);vs(Lf,`RPC '${e}' ${i} sending request:`,r),a.send(t,"POST",c,n,15)}))}a_(e,t,n){const r=Rf(),s=[this.Lo,"/","google.firestore.v1.Firestore","/",e,"/channel"],i=ls(),o=us(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;void 0!==c&&(a.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(a.useFetchStreams=!0),this.Uo(a.initMessageHeaders,t,n),a.encodeInitMessageHeaders=!0;const u=s.join("");vs(Lf,`Creating RPC '${e}' stream ${r}: ${u}`,a);const l=i.createWebChannel(u,a);let h=!1,d=!1;const f=new Pf({Go:t=>{d?vs(Lf,`Not sending because RPC '${e}' stream ${r} is closed:`,t):(h||(vs(Lf,`Opening RPC '${e}' stream ${r} transport.`),l.open(),h=!0),vs(Lf,`RPC '${e}' stream ${r} sending:`,t),l.send(t))},zo:()=>l.close()}),p=(e,t,n)=>{e.listen(t,(e=>{try{n(e)}catch(t){setTimeout((()=>{throw t}),0)}}))};return p(l,ss.EventType.OPEN,(()=>{d||(vs(Lf,`RPC '${e}' stream ${r} transport opened.`),f.t_())})),p(l,ss.EventType.CLOSE,(()=>{d||(d=!0,vs(Lf,`RPC '${e}' stream ${r} transport closed`),f.r_())})),p(l,ss.EventType.ERROR,(t=>{d||(d=!0,_s(Lf,`RPC '${e}' stream ${r} transport errored. Name:`,t.name,"Message:",t.message),f.r_(new ks(Cs.UNAVAILABLE,"The operation could not be completed")))})),p(l,ss.EventType.MESSAGE,(t=>{var n;if(!d){const s=t.data[0];Es(!!s,16349);const i=s,o=(null==i?void 0:i.error)||(null===(n=i[0])||void 0===n?void 0:n.error);if(o){vs(Lf,`RPC '${e}' stream ${r} received error:`,o);const t=o.status;let n=function(e){const t=Hu[e];if(void 0!==t)return Ju(t)}(t),s=o.message;void 0===n&&(n=Cs.INTERNAL,s="Unknown error status: "+t+" with message "+o.message),d=!0,f.r_(new ks(n,s)),l.close()}else vs(Lf,`RPC '${e}' stream ${r} received:`,s),f.i_(s)}})),p(o,cs.STAT_EVENT,(t=>{t.stat===as.PROXY?vs(Lf,`RPC '${e}' stream ${r} detected buffering proxy`):t.stat===as.NOPROXY&&vs(Lf,`RPC '${e}' stream ${r} detected no buffering proxy`)})),setTimeout((()=>{f.n_()}),0),f}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uf(){return"undefined"!=typeof window?window:null}function Ff(){return"undefined"!=typeof document?document:null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Vf(e){return new gl(e,!0)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bf{constructor(e,t,n=1e3,r=1.5,s=6e4){this.bi=e,this.timerId=t,this.u_=n,this.c_=r,this.l_=s,this.h_=0,this.P_=null,this.T_=Date.now(),this.reset()}reset(){this.h_=0}I_(){this.h_=this.l_}E_(e){this.cancel();const t=Math.floor(this.h_+this.d_()),n=Math.max(0,Date.now()-this.T_),r=Math.max(0,t-n);r>0&&vs("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.h_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.P_=this.bi.enqueueAfterDelay(this.timerId,r,(()=>(this.T_=Date.now(),e()))),this.h_*=this.c_,this.h_<this.u_&&(this.h_=this.u_),this.h_>this.l_&&(this.h_=this.l_)}A_(){null!==this.P_&&(this.P_.skipDelay(),this.P_=null)}cancel(){null!==this.P_&&(this.P_.cancel(),this.P_=null)}d_(){return(Math.random()-.5)*this.h_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qf="PersistentStream";class zf{constructor(e,t,n,r,s,i,o,a){this.bi=e,this.R_=n,this.V_=r,this.connection=s,this.authCredentialsProvider=i,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.m_=0,this.f_=null,this.g_=null,this.stream=null,this.p_=0,this.y_=new Bf(e,t)}w_(){return 1===this.state||5===this.state||this.b_()}b_(){return 2===this.state||3===this.state}start(){this.p_=0,4!==this.state?this.auth():this.S_()}async stop(){this.w_()&&await this.close(0)}D_(){this.state=0,this.y_.reset()}v_(){this.b_()&&null===this.f_&&(this.f_=this.bi.enqueueAfterDelay(this.R_,6e4,(()=>this.C_())))}F_(e){this.M_(),this.stream.send(e)}async C_(){if(this.b_())return this.close(0)}M_(){this.f_&&(this.f_.cancel(),this.f_=null)}x_(){this.g_&&(this.g_.cancel(),this.g_=null)}async close(e,t){this.M_(),this.x_(),this.y_.cancel(),this.m_++,4!==e?this.y_.reset():t&&t.code===Cs.RESOURCE_EXHAUSTED?(ws(t.toString()),ws("Using maximum backoff delay to prevent overloading the backend."),this.y_.I_()):t&&t.code===Cs.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.O_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.Zo(t)}O_(){}auth(){this.state=1;const e=this.N_(this.m_),t=this.m_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([e,n])=>{this.m_===t&&this.B_(e,n)}),(t=>{e((()=>{const e=new ks(Cs.UNKNOWN,"Fetching auth token failed: "+t.message);return this.L_(e)}))}))}B_(e,t){const n=this.N_(this.m_);this.stream=this.k_(e,t),this.stream.jo((()=>{n((()=>this.listener.jo()))})),this.stream.Jo((()=>{n((()=>(this.state=2,this.g_=this.bi.enqueueAfterDelay(this.V_,1e4,(()=>(this.b_()&&(this.state=3),Promise.resolve()))),this.listener.Jo())))})),this.stream.Zo((e=>{n((()=>this.L_(e)))})),this.stream.onMessage((e=>{n((()=>1==++this.p_?this.q_(e):this.onNext(e)))}))}S_(){this.state=5,this.y_.E_((async()=>{this.state=0,this.start()}))}L_(e){return vs(qf,`close with error: ${e}`),this.stream=null,this.close(4,e)}N_(e){return t=>{this.bi.enqueueAndForget((()=>this.m_===e?t():(vs(qf,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class jf extends zf{constructor(e,t,n,r,s,i){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,i),this.serializer=s}k_(e,t){return this.connection.a_("Listen",e,t)}q_(e){return this.onNext(e)}onNext(e){this.y_.reset();const t=function(e,t){let n;if("targetChange"in t){t.targetChange;const s="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:Is(39313,{state:r}),i=t.targetChange.targetIds||[],o=function(e,t){return e.useProto3Json?(Es(void 0===t||"string"==typeof t,58123),aa.fromBase64String(t||"")):(Es(void 0===t||t instanceof Buffer||t instanceof Uint8Array,16193),aa.fromUint8Array(t||new Uint8Array))}(e,t.targetChange.resumeToken),a=t.targetChange.cause,c=a&&function(e){const t=void 0===e.code?Cs.UNKNOWN:Ju(e.code);return new ks(t,e.message||"")}(a);n=new al(s,i,o,c||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=Sl(e,r.document.name),i=_l(r.document.updateTime),o=r.document.createTime?_l(r.document.createTime):Qs.min(),a=new Ya({mapValue:{fields:r.document.fields}}),c=Za.newFoundDocument(s,i,o,a),u=r.targetIds||[],l=r.removedTargetIds||[];n=new il(u,l,c.key,c)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=Sl(e,r.document),i=r.readTime?_l(r.readTime):Qs.min(),o=Za.newNoDocument(s,i),a=r.removedTargetIds||[];n=new il([],a,o.key,o)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=Sl(e,r.document),i=r.removedTargetIds||[];n=new il([],i,s,null)}else{if(!("filter"in t))return Is(11601,{Vt:t});{t.filter;const e=t.filter;e.targetId;const{count:r=0,unchangedNames:s}=e,i=new Ku(r,s),o=e.targetId;n=new ol(o,i)}}var r;return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return Qs.min();const t=e.targetChange;return t.targetIds&&t.targetIds.length?Qs.min():t.readTime?_l(t.readTime):Qs.min()}(e);return this.listener.Q_(t,n)}U_(e){const t={};t.database=Al(this.serializer),t.addTarget=function(e,t){let n;const r=t.target;if(n=Ac(r)?{documents:Pl(e,r)}:{query:Ll(e,r).gt},n.targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=vl(e,t.resumeToken);const r=ml(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(Qs.min())>0){n.readTime=yl(e,t.snapshotVersion.toTimestamp());const r=ml(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);const n=function(e,t){const n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return Is(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.F_(t)}K_(e){const t={};t.database=Al(this.serializer),t.removeTarget=e,this.F_(t)}}class $f extends zf{constructor(e,t,n,r,s,i){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,i),this.serializer=s}get W_(){return this.p_>0}start(){this.lastStreamToken=void 0,super.start()}O_(){this.W_&&this.G_([])}k_(e,t){return this.connection.a_("Write",e,t)}q_(e){return Es(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,Es(!e.writeResults||0===e.writeResults.length,55816),this.listener.z_()}onNext(e){Es(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.y_.reset();const t=function(e,t){return e&&e.length>0?(Es(void 0!==t,14353),e.map((e=>function(e,t){let n=e.updateTime?_l(e.updateTime):_l(t);return n.isEqual(Qs.min())&&(n=_l(t)),new Cu(n,e.transformResults||[])}(e,t)))):[]}(e.writeResults,e.commitTime),n=_l(e.commitTime);return this.listener.j_(n,t)}H_(){const e={};e.database=Al(this.serializer),this.F_(e)}G_(e){const t={streamToken:this.lastStreamToken,writes:e.map((e=>Dl(this.serializer,e)))};this.F_(t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gf{}class Kf extends Gf{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.J_=!1}Y_(){if(this.J_)throw new ks(Cs.FAILED_PRECONDITION,"The client has already been terminated.")}Qo(e,t,n,r){return this.Y_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([s,i])=>this.connection.Qo(e,Il(t,n),r,s,i))).catch((e=>{throw"FirebaseError"===e.name?(e.code===Cs.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new ks(Cs.UNKNOWN,e.toString())}))}Wo(e,t,n,r,s){return this.Y_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.Wo(e,Il(t,n),r,i,o,s))).catch((e=>{throw"FirebaseError"===e.name?(e.code===Cs.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new ks(Cs.UNKNOWN,e.toString())}))}terminate(){this.J_=!0,this.connection.terminate()}}class Hf{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Z_=0,this.X_=null,this.ea=!0}ta(){0===this.Z_&&(this.na("Unknown"),this.X_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.X_=null,this.ra("Backend didn't respond within 10 seconds."),this.na("Offline"),Promise.resolve()))))}ia(e){"Online"===this.state?this.na("Unknown"):(this.Z_++,this.Z_>=1&&(this.sa(),this.ra(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.na("Offline")))}set(e){this.sa(),this.Z_=0,"Online"===e&&(this.ea=!1),this.na(e)}na(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ra(e){const t=`Could not reach Cloud Firestore backend. ${e}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.ea?(ws(t),this.ea=!1):vs("OnlineStateTracker",t)}sa(){null!==this.X_&&(this.X_.cancel(),this.X_=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wf="RemoteStore";class Qf{constructor(e,t,n,r,s){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.oa=[],this._a=new Map,this.aa=new Set,this.ua=[],this.ca=s,this.ca.vo((e=>{n.enqueueAndForget((async()=>{sp(this)&&(vs(Wf,"Restarting streams for network reachability change."),await async function(e){const t=Ss(e);t.aa.add(4),await Yf(t),t.la.set("Unknown"),t.aa.delete(4),await Jf(t)}(this))}))})),this.la=new Hf(n,r)}}async function Jf(e){if(sp(e))for(const t of e.ua)await t(!0)}async function Yf(e){for(const t of e.ua)await t(!1)}function Xf(e,t){const n=Ss(e);n._a.has(t.targetId)||(n._a.set(t.targetId,t),rp(n)?np(n):Tp(n).b_()&&ep(n,t))}function Zf(e,t){const n=Ss(e),r=Tp(n);n._a.delete(t),r.b_()&&tp(n,t),0===n._a.size&&(r.b_()?r.v_():sp(n)&&n.la.set("Unknown"))}function ep(e,t){if(e.ha.Ke(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(Qs.min())>0){const n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}Tp(e).U_(t)}function tp(e,t){e.ha.Ke(t),Tp(e).K_(t)}function np(e){e.ha=new ul({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),Rt:t=>e._a.get(t)||null,Pt:()=>e.datastore.serializer.databaseId}),Tp(e).start(),e.la.ta()}function rp(e){return sp(e)&&!Tp(e).w_()&&e._a.size>0}function sp(e){return 0===Ss(e).aa.size}function ip(e){e.ha=void 0}async function op(e){e.la.set("Online")}async function ap(e){e._a.forEach(((t,n)=>{ep(e,t)}))}async function cp(e,t){ip(e),rp(e)?(e.la.ia(t),np(e)):e.la.set("Unknown")}async function up(e,t,n){if(e.la.set("Online"),t instanceof al&&2===t.state&&t.cause)try{await async function(e,t){const n=t.cause;for(const r of t.targetIds)e._a.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e._a.delete(r),e.ha.removeTarget(r))}(e,t)}catch(r){vs(Wf,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await lp(e,r)}else if(t instanceof il?e.ha.Xe(t):t instanceof ol?e.ha.ot(t):e.ha.nt(t),!n.isEqual(Qs.min()))try{const t=await tf(e.localStore);n.compareTo(t)>=0&&await function(e,t){const n=e.ha.It(t);return n.targetChanges.forEach(((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const s=e._a.get(r);s&&e._a.set(r,s.withResumeToken(n.resumeToken,t))}})),n.targetMismatches.forEach(((t,n)=>{const r=e._a.get(t);if(!r)return;e._a.set(t,r.withResumeToken(aa.EMPTY_BYTE_STRING,r.snapshotVersion)),tp(e,t);const s=new Hl(r.target,t,n,r.sequenceNumber);ep(e,s)})),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(s){vs(Wf,"Failed to raise snapshot:",s),await lp(e,s)}}async function lp(e,t,n){if(!Ei(t))throw t;e.aa.add(1),await Yf(e),e.la.set("Offline"),n||(n=()=>tf(e.localStore)),e.asyncQueue.enqueueRetryable((async()=>{vs(Wf,"Retrying IndexedDB access"),await n(),e.aa.delete(1),await Jf(e)}))}function hp(e,t){return t().catch((n=>lp(e,n,t)))}async function dp(e){const t=Ss(e),n=Ep(t);let r=t.oa.length>0?t.oa[t.oa.length-1].batchId:Oi;for(;fp(t);)try{const e=await rf(t.localStore,r);if(null===e){0===t.oa.length&&n.v_();break}r=e.batchId,pp(t,e)}catch(s){await lp(t,s)}gp(t)&&mp(t)}function fp(e){return sp(e)&&e.oa.length<10}function pp(e,t){e.oa.push(t);const n=Ep(e);n.b_()&&n.W_&&n.G_(t.mutations)}function gp(e){return sp(e)&&!Ep(e).w_()&&e.oa.length>0}function mp(e){Ep(e).start()}async function yp(e){Ep(e).H_()}async function vp(e){const t=Ep(e);for(const n of e.oa)t.G_(n.mutations)}async function wp(e,t,n){const r=e.oa.shift(),s=ju.from(r,t,n);await hp(e,(()=>e.remoteSyncer.applySuccessfulWrite(s))),await dp(e)}async function _p(e,t){t&&Ep(e).W_&&await async function(e,t){if(Qu(n=t.code)&&n!==Cs.ABORTED){const n=e.oa.shift();Ep(e).D_(),await hp(e,(()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t))),await dp(e)}var n}(e,t),gp(e)&&mp(e)}async function bp(e,t){const n=Ss(e);n.asyncQueue.verifyOperationInProgress(),vs(Wf,"RemoteStore received new credentials");const r=sp(n);n.aa.add(3),await Yf(n),r&&n.la.set("Unknown"),await n.remoteSyncer.handleCredentialChange(t),n.aa.delete(3),await Jf(n)}async function Ip(e,t){const n=Ss(e);t?(n.aa.delete(2),await Jf(n)):t||(n.aa.add(2),await Yf(n),n.la.set("Unknown"))}function Tp(e){return e.Pa||(e.Pa=function(e,t,n){const r=Ss(e);return r.Y_(),new jf(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{jo:op.bind(null,e),Jo:ap.bind(null,e),Zo:cp.bind(null,e),Q_:up.bind(null,e)}),e.ua.push((async t=>{t?(e.Pa.D_(),rp(e)?np(e):e.la.set("Unknown")):(await e.Pa.stop(),ip(e))}))),e.Pa}function Ep(e){return e.Ta||(e.Ta=function(e,t,n){const r=Ss(e);return r.Y_(),new $f(t,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(e.datastore,e.asyncQueue,{jo:()=>Promise.resolve(),Jo:yp.bind(null,e),Zo:_p.bind(null,e),z_:vp.bind(null,e),j_:wp.bind(null,e)}),e.ua.push((async t=>{t?(e.Ta.D_(),await dp(e)):(await e.Ta.stop(),e.oa.length>0&&(vs(Wf,`Stopping write stream with ${e.oa.length} pending writes`),e.oa=[]))}))),e.Ta
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Sp{constructor(e,t,n,r,s){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=s,this.deferred=new As,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((e=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,s){const i=Date.now()+n,o=new Sp(e,t,i,r,s);return o.start(n),o}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new ks(Cs.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Cp(e,t){if(ws("AsyncQueue",`${t}: ${e}`),Ei(e))return new ks(Cs.UNAVAILABLE,`${t}: ${e}`);throw e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kp{static emptySet(e){return new kp(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||ti.comparator(t.key,n.key):(e,t)=>ti.comparator(e.key,t.key),this.keyedMap=eu(),this.sortedSet=new Zo(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,n)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof kp))return!1;if(this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){const e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){const n=new kp;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ap{constructor(){this.Ia=new Zo(ti.comparator)}track(e){const t=e.doc.key,n=this.Ia.get(t);n?0!==e.type&&3===n.type?this.Ia=this.Ia.insert(t,e):3===e.type&&1!==n.type?this.Ia=this.Ia.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.Ia=this.Ia.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.Ia=this.Ia.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.Ia=this.Ia.remove(t):1===e.type&&2===n.type?this.Ia=this.Ia.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.Ia=this.Ia.insert(t,{type:2,doc:e.doc}):Is(63341,{Vt:e,Ea:n}):this.Ia=this.Ia.insert(t,e)}da(){const e=[];return this.Ia.inorderTraversal(((t,n)=>{e.push(n)})),e}}class Np{constructor(e,t,n,r,s,i,o,a,c){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=s,this.fromCache=i,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(e,t,n,r,s){const i=[];return t.forEach((e=>{i.push({type:0,doc:e})})),new Np(e,t,kp.emptySet(t),i,n,r,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&jc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let r=0;r<t.length;r++)if(t[r].type!==n[r].type||!t[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rp{constructor(){this.Aa=void 0,this.Ra=[]}Va(){return this.Ra.some((e=>e.ma()))}}class xp{constructor(){this.queries=Dp(),this.onlineState="Unknown",this.fa=new Set}terminate(){!function(e,t){const n=Ss(e),r=n.queries;n.queries=Dp(),r.forEach(((e,n)=>{for(const r of n.Ra)r.onError(t)}))}(this,new ks(Cs.ABORTED,"Firestore shutting down"))}}function Dp(){return new Jc((e=>$c(e)),jc)}async function Op(e,t){const n=Ss(e);let r=3;const s=t.query;let i=n.queries.get(s);i?!i.Va()&&t.ma()&&(r=2):(i=new Rp,r=t.ma()?0:1);try{switch(r){case 0:i.Aa=await n.onListen(s,!0);break;case 1:i.Aa=await n.onListen(s,!1);break;case 2:await n.onFirstRemoteStoreListen(s)}}catch(o){const e=Cp(o,`Initialization of query '${Gc(t.query)}' failed`);return void t.onError(e)}n.queries.set(s,i),i.Ra.push(t),t.ga(n.onlineState),i.Aa&&t.pa(i.Aa)&&Up(n)}async function Pp(e,t){const n=Ss(e),r=t.query;let s=3;const i=n.queries.get(r);if(i){const e=i.Ra.indexOf(t);e>=0&&(i.Ra.splice(e,1),0===i.Ra.length?s=t.ma()?0:1:!i.Va()&&t.ma()&&(s=2))}switch(s){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function Lp(e,t){const n=Ss(e);let r=!1;for(const s of t){const e=s.query,t=n.queries.get(e);if(t){for(const e of t.Ra)e.pa(s)&&(r=!0);t.Aa=s}}r&&Up(n)}function Mp(e,t,n){const r=Ss(e),s=r.queries.get(t);if(s)for(const i of s.Ra)i.onError(n);r.queries.delete(t)}function Up(e){e.fa.forEach((e=>{e.next()}))}var Fp,Vp;(Vp=Fp||(Fp={})).ya="default",Vp.Cache="cache";class Bp{constructor(e,t,n){this.query=e,this.wa=t,this.ba=!1,this.Sa=null,this.onlineState="Unknown",this.options=n||{}}pa(e){if(!this.options.includeMetadataChanges){const t=[];for(const n of e.docChanges)3!==n.type&&t.push(n);e=new Np(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.ba?this.Da(e)&&(this.wa.next(e),t=!0):this.va(e,this.onlineState)&&(this.Ca(e),t=!0),this.Sa=e,t}onError(e){this.wa.error(e)}ga(e){this.onlineState=e;let t=!1;return this.Sa&&!this.ba&&this.va(this.Sa,e)&&(this.Ca(this.Sa),t=!0),t}va(e,t){if(!e.fromCache)return!0;if(!this.ma())return!0;const n="Offline"!==t;return(!this.options.Fa||!n)&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Da(e){if(e.docChanges.length>0)return!0;const t=this.Sa&&this.Sa.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}Ca(e){e=Np.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.ba=!0,this.wa.next(e)}ma(){return this.options.source!==Fp.Cache}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qp{constructor(e,t){this.Ma=e,this.byteLength=t}xa(){return"metadata"in this.Ma}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zp{constructor(e){this.serializer=e}Bs(e){return Sl(this.serializer,e)}Ls(e){return e.metadata.exists?xl(this.serializer,e.document,!1):Za.newNoDocument(this.Bs(e.metadata.name),this.ks(e.metadata.readTime))}ks(e){return _l(e)}}class jp{constructor(e,t,n){this.Oa=e,this.localStore=t,this.serializer=n,this.queries=[],this.documents=[],this.collectionGroups=new Set,this.progress=$p(e)}Na(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.Ma.namedQuery)this.queries.push(e.Ma.namedQuery);else if(e.Ma.documentMetadata){this.documents.push({metadata:e.Ma.documentMetadata}),e.Ma.documentMetadata.exists||++t;const n=Xs.fromString(e.Ma.documentMetadata.name);this.collectionGroups.add(n.get(n.length-2))}else e.Ma.document&&(this.documents[this.documents.length-1].document=e.Ma.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,Object.assign({},this.progress)):null}Ba(e){const t=new Map,n=new zp(this.serializer);for(const r of e)if(r.metadata.queries){const e=n.Bs(r.metadata.name);for(const n of r.metadata.queries){const r=(t.get(n)||au()).add(e);t.set(n,r)}}return t}async complete(){const e=await async function(e,t,n,r){const s=Ss(e);let i=au(),o=Xc();for(const l of n){const e=t.Bs(l.metadata.name);l.document&&(i=i.add(e));const n=t.Ls(l);n.setReadTime(t.ks(l.metadata.readTime)),o=o.insert(e,n)}const a=s.Cs.newChangeBuffer({trackRemovals:!0}),c=await sf(s,(u=r,Fc(Pc(Xs.fromString(`__bundle__/docs/${u}`)))));var u;return s.persistence.runTransaction("Apply bundle documents","readwrite",(e=>nf(e,a,o).next((t=>(a.apply(e),t))).next((t=>s.ai.removeMatchingKeysForTargetId(e,c.targetId).next((()=>s.ai.addMatchingKeys(e,i,c.targetId))).next((()=>s.localDocuments.getLocalViewOfDocuments(e,t.xs,t.Os))).next((()=>t.xs))))))}(this.localStore,new zp(this.serializer),this.documents,this.Oa.id),t=this.Ba(this.documents);for(const n of this.queries)await hf(this.localStore,n,t.get(n.name));return this.progress.taskState="Success",{progress:this.progress,La:this.collectionGroups,ka:e}}}function $p(e){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:e.totalDocuments,totalBytes:e.totalBytes}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gp{constructor(e){this.key=e}}class Kp{constructor(e){this.key=e}}class Hp{constructor(e,t){this.query=e,this.qa=t,this.Qa=null,this.hasCachedResults=!1,this.current=!1,this.$a=au(),this.mutatedKeys=au(),this.Ua=Wc(e),this.Ka=new kp(this.Ua)}get Wa(){return this.qa}Ga(e,t){const n=t?t.za:new Ap,r=t?t.Ka:this.Ka;let s=t?t.mutatedKeys:this.mutatedKeys,i=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal(((e,t)=>{const u=r.get(e),l=Kc(this.query,t)?t:null,h=!!u&&this.mutatedKeys.has(u.key),d=!!l&&(l.hasLocalMutations||this.mutatedKeys.has(l.key)&&l.hasCommittedMutations);let f=!1;u&&l?u.data.isEqual(l.data)?h!==d&&(n.track({type:3,doc:l}),f=!0):this.ja(u,l)||(n.track({type:2,doc:l}),f=!0,(a&&this.Ua(l,a)>0||c&&this.Ua(l,c)<0)&&(o=!0)):!u&&l?(n.track({type:0,doc:l}),f=!0):u&&!l&&(n.track({type:1,doc:u}),f=!0,(a||c)&&(o=!0)),f&&(l?(i=i.add(l),s=d?s.add(e):s.delete(e)):(i=i.delete(e),s=s.delete(e)))})),null!==this.query.limit)for(;i.size>this.query.limit;){const e="F"===this.query.limitType?i.last():i.first();i=i.delete(e.key),s=s.delete(e.key),n.track({type:1,doc:e})}return{Ka:i,za:n,ys:o,mutatedKeys:s}}ja(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){const s=this.Ka;this.Ka=e.Ka,this.mutatedKeys=e.mutatedKeys;const i=e.za.da();i.sort(((e,t)=>function(e,t){const n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return Is(20277,{Vt:e})}};return n(e)-n(t)}(e.type,t.type)||this.Ua(e.doc,t.doc))),this.Ha(n),r=null!=r&&r;const o=t&&!r?this.Ja():[],a=0===this.$a.size&&this.current&&!r?1:0,c=a!==this.Qa;return this.Qa=a,0!==i.length||c?{snapshot:new Np(this.query,e.Ka,s,i,e.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),Ya:o}:{Ya:o}}ga(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({Ka:this.Ka,za:new Ap,mutatedKeys:this.mutatedKeys,ys:!1},!1)):{Ya:[]}}Za(e){return!this.qa.has(e)&&!!this.Ka.has(e)&&!this.Ka.get(e).hasLocalMutations}Ha(e){e&&(e.addedDocuments.forEach((e=>this.qa=this.qa.add(e))),e.modifiedDocuments.forEach((e=>{})),e.removedDocuments.forEach((e=>this.qa=this.qa.delete(e))),this.current=e.current)}Ja(){if(!this.current)return[];const e=this.$a;this.$a=au(),this.Ka.forEach((e=>{this.Za(e.key)&&(this.$a=this.$a.add(e.key))}));const t=[];return e.forEach((e=>{this.$a.has(e)||t.push(new Kp(e))})),this.$a.forEach((n=>{e.has(n)||t.push(new Gp(n))})),t}Xa(e){this.qa=e.Ns,this.$a=au();const t=this.Ga(e.documents);return this.applyChanges(t,!0)}eu(){return Np.fromInitialDocuments(this.query,this.Ka,this.mutatedKeys,0===this.Qa,this.hasCachedResults)}}const Wp="SyncEngine";class Qp{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class Jp{constructor(e){this.key=e,this.tu=!1}}class Yp{constructor(e,t,n,r,s,i){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=s,this.maxConcurrentLimboResolutions=i,this.nu={},this.ru=new Jc((e=>$c(e)),jc),this.iu=new Map,this.su=new Set,this.ou=new Zo(ti.comparator),this._u=new Map,this.au=new kd,this.uu={},this.cu=new Map,this.lu=Zh.ir(),this.onlineState="Unknown",this.hu=void 0}get isPrimaryClient(){return!0===this.hu}}async function Xp(e,t,n=!0){const r=kg(e);let s;const i=r.ru.get(t);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.eu()):s=await eg(r,t,n,!0),s}async function Zp(e,t){const n=kg(e);await eg(n,t,!0,!1)}async function eg(e,t,n,r){const s=await sf(e.localStore,Fc(t)),i=s.targetId,o=e.sharedClientState.addLocalQueryTarget(i,n);let a;return r&&(a=await tg(e,t,i,"current"===o,s.resumeToken)),e.isPrimaryClient&&n&&Xf(e.remoteStore,s),a}async function tg(e,t,n,r,s){e.Pu=(t,n,r)=>async function(e,t,n,r){let s=t.view.Ga(n);s.ys&&(s=await af(e.localStore,t.query,!1).then((({documents:e})=>t.view.Ga(e,s))));const i=r&&r.targetChanges.get(t.targetId),o=r&&null!=r.targetMismatches.get(t.targetId),a=t.view.applyChanges(s,e.isPrimaryClient,i,o);return fg(e,t.targetId,a.Ya),a.snapshot}(e,t,n,r);const i=await af(e.localStore,t,!0),o=new Hp(t,i.Ns),a=o.Ga(i.documents),c=sl.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,s),u=o.applyChanges(a,e.isPrimaryClient,c);fg(e,n,u.Ya);const l=new Qp(t,n,o);return e.ru.set(t,l),e.iu.has(n)?e.iu.get(n).push(t):e.iu.set(n,[t]),u.snapshot}async function ng(e,t,n){const r=Ss(e),s=r.ru.get(t),i=r.iu.get(s.targetId);if(i.length>1)return r.iu.set(s.targetId,i.filter((e=>!jc(e,t)))),void r.ru.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await of(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),n&&Zf(r.remoteStore,s.targetId),hg(r,s.targetId)})).catch(mi)):(hg(r,s.targetId),await of(r.localStore,s.targetId,!0))}async function rg(e,t){const n=Ss(e),r=n.ru.get(t),s=n.iu.get(r.targetId);n.isPrimaryClient&&1===s.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Zf(n.remoteStore,r.targetId))}async function sg(e,t){const n=Ss(e);try{const e=await function(e,t){const n=Ss(e),r=t.snapshotVersion;let s=n.Ss;return n.persistence.runTransaction("Apply remote event","readwrite-primary",(e=>{const i=n.Cs.newChangeBuffer({trackRemovals:!0});s=n.Ss;const o=[];t.targetChanges.forEach(((i,a)=>{const c=s.get(a);if(!c)return;o.push(n.ai.removeMatchingKeys(e,i.removedDocuments,a).next((()=>n.ai.addMatchingKeys(e,i.addedDocuments,a))));let u=c.withSequenceNumber(e.currentSequenceNumber);var l,h,d;null!==t.targetMismatches.get(a)?u=u.withResumeToken(aa.EMPTY_BYTE_STRING,Qs.min()).withLastLimboFreeSnapshotVersion(Qs.min()):i.resumeToken.approximateByteSize()>0&&(u=u.withResumeToken(i.resumeToken,r)),s=s.insert(a,u),h=u,d=i,(0===(l=c).resumeToken.approximateByteSize()||h.snapshotVersion.toMicroseconds()-l.snapshotVersion.toMicroseconds()>=3e8||d.addedDocuments.size+d.modifiedDocuments.size+d.removedDocuments.size>0)&&o.push(n.ai.updateTargetData(e,u))}));let a=Xc(),c=au();if(t.documentUpdates.forEach((r=>{t.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(e,r))})),o.push(nf(e,i,t.documentUpdates).next((e=>{a=e.xs,c=e.Os}))),!r.isEqual(Qs.min())){const t=n.ai.getLastRemoteSnapshotVersion(e).next((t=>n.ai.setTargetsMetadata(e,e.currentSequenceNumber,r)));o.push(t)}return yi.waitFor(o).next((()=>i.apply(e))).next((()=>n.localDocuments.getLocalViewOfDocuments(e,a,c))).next((()=>a))})).then((e=>(n.Ss=s,e)))}(n.localStore,t);t.targetChanges.forEach(((e,t)=>{const r=n._u.get(t);r&&(Es(e.addedDocuments.size+e.modifiedDocuments.size+e.removedDocuments.size<=1,22616),e.addedDocuments.size>0?r.tu=!0:e.modifiedDocuments.size>0?Es(r.tu,14607):e.removedDocuments.size>0&&(Es(r.tu,42227),r.tu=!1))})),await mg(n,e,t)}catch(r){await mi(r)}}function ig(e,t,n){const r=Ss(e);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const e=[];r.ru.forEach(((n,r)=>{const s=r.view.ga(t);s.snapshot&&e.push(s.snapshot)})),function(e,t){const n=Ss(e);n.onlineState=t;let r=!1;n.queries.forEach(((e,n)=>{for(const s of n.Ra)s.ga(t)&&(r=!0)})),r&&Up(n)}(r.eventManager,t),e.length&&r.nu.Q_(e),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function og(e,t,n){const r=Ss(e);r.sharedClientState.updateQueryState(t,"rejected",n);const s=r._u.get(t),i=s&&s.key;if(i){let e=new Zo(ti.comparator);e=e.insert(i,Za.newNoDocument(i,Qs.min()));const n=au().add(i),s=new rl(Qs.min(),new Map,new Zo(Bs),e,n);await sg(r,s),r.ou=r.ou.remove(i),r._u.delete(t),gg(r)}else await of(r.localStore,t,!1).then((()=>hg(r,t,n))).catch(mi)}async function ag(e,t){const n=Ss(e),r=t.batch.batchId;try{const e=await function(e,t){const n=Ss(e);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",(e=>{const r=t.batch.keys(),s=n.Cs.newChangeBuffer({trackRemovals:!0});return function(e,t,n,r){const s=n.batch,i=s.keys();let o=yi.resolve();return i.forEach((e=>{o=o.next((()=>r.getEntry(t,e))).next((t=>{const i=n.docVersions.get(e);Es(null!==i,48541),t.version.compareTo(i)<0&&(s.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))}))})),o.next((()=>e.mutationQueue.removeMutationBatch(t,s)))}(n,e,t,s).next((()=>s.apply(e))).next((()=>n.mutationQueue.performConsistencyCheck(e))).next((()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId))).next((()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=au();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t)))).next((()=>n.localDocuments.getDocuments(e,r)))}))}(n.localStore,t);lg(n,r,null),ug(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await mg(n,e)}catch(s){await mi(s)}}async function cg(e,t,n){const r=Ss(e);try{const e=await function(e,t){const n=Ss(e);return n.persistence.runTransaction("Reject batch","readwrite-primary",(e=>{let r;return n.mutationQueue.lookupMutationBatch(e,t).next((t=>(Es(null!==t,37113),r=t.keys(),n.mutationQueue.removeMutationBatch(e,t)))).next((()=>n.mutationQueue.performConsistencyCheck(e))).next((()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t))).next((()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,r))).next((()=>n.localDocuments.getDocuments(e,r)))}))}(r.localStore,t);lg(r,t,n),ug(r,t),r.sharedClientState.updateMutationState(t,"rejected",n),await mg(r,e)}catch(s){await mi(s)}}function ug(e,t){(e.cu.get(t)||[]).forEach((e=>{e.resolve()})),e.cu.delete(t)}function lg(e,t,n){const r=Ss(e);let s=r.uu[r.currentUser.toKey()];if(s){const e=s.get(t);e&&(n?e.reject(n):e.resolve(),s=s.remove(t)),r.uu[r.currentUser.toKey()]=s}}function hg(e,t,n=null){e.sharedClientState.removeLocalQueryTarget(t);for(const r of e.iu.get(t))e.ru.delete(r),n&&e.nu.Tu(r,n);e.iu.delete(t),e.isPrimaryClient&&e.au.Ur(t).forEach((t=>{e.au.containsKey(t)||dg(e,t)}))}function dg(e,t){e.su.delete(t.path.canonicalString());const n=e.ou.get(t);null!==n&&(Zf(e.remoteStore,n),e.ou=e.ou.remove(t),e._u.delete(n),gg(e))}function fg(e,t,n){for(const r of n)r instanceof Gp?(e.au.addReference(r.key,t),pg(e,r)):r instanceof Kp?(vs(Wp,"Document no longer in limbo: "+r.key),e.au.removeReference(r.key,t),e.au.containsKey(r.key)||dg(e,r.key)):Is(19791,{Iu:r})}function pg(e,t){const n=t.key,r=n.path.canonicalString();e.ou.get(n)||e.su.has(r)||(vs(Wp,"New document in limbo: "+n),e.su.add(r),gg(e))}function gg(e){for(;e.su.size>0&&e.ou.size<e.maxConcurrentLimboResolutions;){const t=e.su.values().next().value;e.su.delete(t);const n=new ti(Xs.fromString(t)),r=e.lu.next();e._u.set(r,new Jp(n)),e.ou=e.ou.insert(n,r),Xf(e.remoteStore,new Hl(Fc(Pc(n.path)),r,"TargetPurposeLimboResolution",Di.le))}}async function mg(e,t,n){const r=Ss(e),s=[],i=[],o=[];r.ru.isEmpty()||(r.ru.forEach(((e,a)=>{o.push(r.Pu(a,t,n).then((e=>{var t;if((e||n)&&r.isPrimaryClient){const s=e?!e.fromCache:null===(t=null==n?void 0:n.targetChanges.get(a.targetId))||void 0===t?void 0:t.current;r.sharedClientState.updateQueryState(a.targetId,s?"current":"not-current")}if(e){s.push(e);const t=Wd.Ps(a.targetId,e);i.push(t)}})))})),await Promise.all(o),r.nu.Q_(s),await async function(e,t){const n=Ss(e);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",(e=>yi.forEach(t,(t=>yi.forEach(t.ls,(r=>n.persistence.referenceDelegate.addReference(e,t.targetId,r))).next((()=>yi.forEach(t.hs,(r=>n.persistence.referenceDelegate.removeReference(e,t.targetId,r)))))))))}catch(r){if(!Ei(r))throw r;vs(Yd,"Failed to update sequence numbers: "+r)}for(const s of t){const e=s.targetId;if(!s.fromCache){const t=n.Ss.get(e),r=t.snapshotVersion,s=t.withLastLimboFreeSnapshotVersion(r);n.Ss=n.Ss.insert(e,s)}}}(r.localStore,i))}async function yg(e,t){const n=Ss(e);if(!n.currentUser.isEqual(t)){vs(Wp,"User change. New user:",t.toKey());const e=await ef(n.localStore,t);n.currentUser=t,s="'waitForPendingWrites' promise is rejected due to a user change.",(r=n).cu.forEach((e=>{e.forEach((e=>{e.reject(new ks(Cs.CANCELLED,s))}))})),r.cu.clear(),n.sharedClientState.handleUserChange(t,e.removedBatchIds,e.addedBatchIds),await mg(n,e.Ms)}var r,s}function vg(e,t){const n=Ss(e),r=n._u.get(t);if(r&&r.tu)return au().add(r.key);{let e=au();const r=n.iu.get(t);if(!r)return e;for(const t of r){const r=n.ru.get(t);e=e.unionWith(r.view.Wa)}return e}}async function wg(e,t){const n=Ss(e),r=await af(n.localStore,t.query,!0),s=t.view.Xa(r);return n.isPrimaryClient&&fg(n,t.targetId,s.Ya),s}async function _g(e,t){const n=Ss(e);return uf(n.localStore,t).then((e=>mg(n,e)))}async function bg(e,t,n,r){const s=Ss(e),i=await function(e,t){const n=Ss(e),r=Ss(n.mutationQueue);return n.persistence.runTransaction("Lookup mutation documents","readonly",(e=>r.Hn(e,t).next((t=>t?n.localDocuments.getDocuments(e,t):yi.resolve(null)))))}(s.localStore,t);var o,a;null!==i?("pending"===n?await dp(s.remoteStore):"acknowledged"===n||"rejected"===n?(lg(s,t,r||null),ug(s,t),o=s.localStore,a=t,Ss(Ss(o).mutationQueue).Xn(a)):Is(6720,"Unknown batchState",{Eu:n}),await mg(s,i)):vs(Wp,"Cannot apply mutation batch with id: "+t)}async function Ig(e,t,n){const r=Ss(e),s=[],i=[];for(const o of t){let e;const t=r.iu.get(o);if(t&&0!==t.length){e=await sf(r.localStore,Fc(t[0]));for(const e of t){const t=r.ru.get(e),n=await wg(r,t);n.snapshot&&i.push(n.snapshot)}}else{const t=await cf(r.localStore,o);e=await sf(r.localStore,t),await tg(r,Tg(t),o,!1,e.resumeToken)}s.push(e)}return r.nu.Q_(i),s}function Tg(e){return Oc(e.path,e.collectionGroup,e.orderBy,e.filters,e.limit,"F",e.startAt,e.endAt)}function Eg(e){return t=Ss(e).localStore,Ss(Ss(t).persistence).us();var t}async function Sg(e,t,n,r){const s=Ss(e);if(s.hu)return void vs(Wp,"Ignoring unexpected query state notification.");const i=s.iu.get(t);if(i&&i.length>0)switch(n){case"current":case"not-current":{const e=await uf(s.localStore,Hc(i[0])),r=rl.createSynthesizedRemoteEventForCurrentChange(t,"current"===n,aa.EMPTY_BYTE_STRING);await mg(s,e,r);break}case"rejected":await of(s.localStore,t,!0),hg(s,t,r);break;default:Is(64155,n)}}async function Cg(e,t,n){const r=kg(e);if(r.hu){for(const e of t){if(r.iu.has(e)&&r.sharedClientState.isActiveQueryTarget(e)){vs(Wp,"Adding an already active target "+e);continue}const t=await cf(r.localStore,e),n=await sf(r.localStore,t);await tg(r,Tg(t),n.targetId,!1,n.resumeToken),Xf(r.remoteStore,n)}for(const e of n)r.iu.has(e)&&await of(r.localStore,e,!1).then((()=>{Zf(r.remoteStore,e),hg(r,e)})).catch(mi)}}function kg(e){const t=Ss(e);return t.remoteStore.remoteSyncer.applyRemoteEvent=sg.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=vg.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=og.bind(null,t),t.nu.Q_=Lp.bind(null,t.eventManager),t.nu.Tu=Mp.bind(null,t.eventManager),t}function Ag(e){const t=Ss(e);return t.remoteStore.remoteSyncer.applySuccessfulWrite=ag.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=cg.bind(null,t),t}class Ng{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Vf(e.databaseInfo.databaseId),this.sharedClientState=this.Au(e),this.persistence=this.Ru(e),await this.persistence.start(),this.localStore=this.Vu(e),this.gcScheduler=this.mu(e,this.localStore),this.indexBackfillerScheduler=this.fu(e,this.localStore)}mu(e,t){return null}fu(e,t){return null}Vu(e){return Zd(this.persistence,new Jd,e.initialUser,this.serializer)}Ru(e){return new Od(Ld.Ei,this.serializer)}Au(e){return new Sf}async terminate(){var e,t;null===(e=this.gcScheduler)||void 0===e||e.stop(),null===(t=this.indexBackfillerScheduler)||void 0===t||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Ng.provider={build:()=>new Ng};class Rg extends Ng{constructor(e){super(),this.cacheSizeBytes=e}mu(e,t){Es(this.persistence.referenceDelegate instanceof Md,46915);const n=this.persistence.referenceDelegate.garbageCollector;return new cd(n,e.asyncQueue,t)}Ru(e){const t=void 0!==this.cacheSizeBytes?Gh.withCacheSize(this.cacheSizeBytes):Gh.DEFAULT;return new Od((e=>Md.Ei(e,t)),this.serializer)}}class xg extends Ng{constructor(e,t,n){super(),this.gu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.gu.initialize(this,e),await Ag(this.gu.syncEngine),await dp(this.gu.remoteStore),await this.persistence.Ki((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}Vu(e){return Zd(this.persistence,new Jd,e.initialUser,this.serializer)}mu(e,t){const n=this.persistence.referenceDelegate.garbageCollector;return new cd(n,e.asyncQueue,t)}fu(e,t){const n=new xi(t,this.persistence);return new Ri(e.asyncQueue,n)}Ru(e){const t=Hd(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?Gh.withCacheSize(this.cacheSizeBytes):Gh.DEFAULT;return new $d(this.synchronizeTabs,t,e.clientId,n,e.asyncQueue,Uf(),Ff(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Au(e){return new Sf}}class Dg extends xg{constructor(e,t){super(e,t,!1),this.gu=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.gu.syncEngine;this.sharedClientState instanceof Ef&&(this.sharedClientState.syncEngine={yo:bg.bind(null,t),wo:Sg.bind(null,t),bo:Cg.bind(null,t),us:Eg.bind(null,t),po:_g.bind(null,t)},await this.sharedClientState.start()),await this.persistence.Ki((async e=>{await async function(e,t){const n=Ss(e);if(kg(n),Ag(n),!0===t&&!0!==n.hu){const e=n.sharedClientState.getAllActiveQueryTargets(),t=await Ig(n,e.toArray());n.hu=!0,await Ip(n.remoteStore,!0);for(const r of t)Xf(n.remoteStore,r)}else if(!1===t&&!1!==n.hu){const e=[];let t=Promise.resolve();n.iu.forEach(((r,s)=>{n.sharedClientState.isLocalQueryTarget(s)?e.push(s):t=t.then((()=>(hg(n,s),of(n.localStore,s,!0)))),Zf(n.remoteStore,s)})),await t,await Ig(n,e),function(e){const t=Ss(e);t._u.forEach(((e,n)=>{Zf(t.remoteStore,n)})),t.au.Kr(),t._u=new Map,t.ou=new Zo(ti.comparator)}(n),n.hu=!1,await Ip(n.remoteStore,!1)}}(this.gu.syncEngine,e),this.gcScheduler&&(e&&!this.gcScheduler.started?this.gcScheduler.start():e||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(e&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():e||this.indexBackfillerScheduler.stop())}))}Au(e){const t=Uf();if(!Ef.C(t))throw new ks(Cs.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const n=Hd(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new Ef(t,e.asyncQueue,n,e.clientId,e.initialUser)}}class Og{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>ig(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=yg.bind(null,this.syncEngine),await Ip(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new xp}createDatastore(e){const t=Vf(e.databaseInfo.databaseId),n=(r=e.databaseInfo,new Mf(r));var r;return function(e,t,n,r){return new Kf(e,t,n,r)}(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){return t=this.localStore,n=this.datastore,r=e.asyncQueue,s=e=>ig(this.syncEngine,e,0),i=Af.C()?new Af:new Cf,new Qf(t,n,r,s,i);var t,n,r,s,i}createSyncEngine(e,t){return function(e,t,n,r,s,i,o){const a=new Yp(e,t,n,r,s,i);return o&&(a.hu=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await async function(e){const t=Ss(e);vs(Wf,"RemoteStore shutting down."),t.aa.add(5),await Yf(t),t.ca.shutdown(),t.la.set("Unknown")}(this.remoteStore),null===(e=this.datastore)||void 0===e||e.terminate(),null===(t=this.eventManager)||void 0===t||t.terminate()}}function Pg(e,t=10240){let n=0;return{async read(){if(n<e.byteLength){const r={value:e.slice(n,n+t),done:!1};return n+=t,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Og.provider={build:()=>new Og};class Lg{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.pu(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.pu(this.observer.error,e):ws("Uncaught Error in snapshot listener:",e.toString()))}yu(){this.muted=!0}pu(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mg{constructor(e,t){this.wu=e,this.serializer=t,this.metadata=new As,this.buffer=new Uint8Array,this.bu=new TextDecoder("utf-8"),this.Su().then((e=>{e&&e.xa()?this.metadata.resolve(e.Ma.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is\n             ${JSON.stringify(null==e?void 0:e.Ma)}`))}),(e=>this.metadata.reject(e)))}close(){return this.wu.cancel()}async getMetadata(){return this.metadata.promise}async du(){return await this.getMetadata(),this.Su()}async Su(){const e=await this.Du();if(null===e)return null;const t=this.bu.decode(e),n=Number(t);isNaN(n)&&this.vu(`length string (${t}) is not valid number`);const r=await this.Cu(n);return new qp(JSON.parse(r),e.length+n)}Fu(){return this.buffer.findIndex((e=>e==="{".charCodeAt(0)))}async Du(){for(;this.Fu()<0&&!(await this.Mu()););if(0===this.buffer.length)return null;const e=this.Fu();e<0&&this.vu("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async Cu(e){for(;this.buffer.length<e;)await this.Mu()&&this.vu("Reached the end of bundle when more is expected.");const t=this.bu.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}vu(e){throw this.wu.cancel(),new Error(`Invalid bundle format: ${e}`)}async Mu(){const e=await this.wu.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ug{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new ks(Cs.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await async function(e,t){const n=Ss(e),r={documents:t.map((e=>El(n.serializer,e)))},s=await n.Wo("BatchGetDocuments",n.serializer.databaseId,Xs.emptyPath(),r,t.length),i=new Map;s.forEach((e=>{const t=function(e,t){return"found"in t?function(e,t){Es(!!t.found,43571),t.found.name,t.found.updateTime;const n=Sl(e,t.found.name),r=_l(t.found.updateTime),s=t.found.createTime?_l(t.found.createTime):Qs.min(),i=new Ya({mapValue:{fields:t.found.fields}});return Za.newFoundDocument(n,r,s,i)}(e,t):"missing"in t?function(e,t){Es(!!t.missing,3894),Es(!!t.readTime,22933);const n=Sl(e,t.missing),r=_l(t.readTime);return Za.newNoDocument(n,r)}(e,t):Is(7234,{result:t})}(n.serializer,e);i.set(t.key.toString(),t)}));const o=[];return t.forEach((e=>{const t=i.get(e.toString());Es(!!t,55234,{key:e}),o.push(t)})),o}(this.datastore,e);return t.forEach((e=>this.recordVersion(e))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(n){this.lastTransactionError=n}this.writtenDocs.add(e.toString())}delete(e){this.write(new Bu(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((e,t)=>{const n=ti.fromPath(t);this.mutations.push(new qu(n,this.precondition(n)))})),await async function(e,t){const n=Ss(e),r={writes:t.map((e=>Dl(n.serializer,e)))};await n.Qo("Commit",n.serializer.databaseId,Xs.emptyPath(),r)}(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw Is(50498,{xu:e.constructor.name});t=Qs.min()}const n=this.readVersions.get(e.key.toString());if(n){if(!t.isEqual(n))throw new ks(Cs.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(Qs.min())?ku.exists(!1):ku.updateTime(t):ku.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(Qs.min()))throw new ks(Cs.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return ku.updateTime(t)}return ku.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fg{constructor(e,t,n,r,s){this.asyncQueue=e,this.datastore=t,this.options=n,this.updateFunction=r,this.deferred=s,this.Ou=n.maxAttempts,this.y_=new Bf(this.asyncQueue,"transaction_retry")}Nu(){this.Ou-=1,this.Bu()}Bu(){this.y_.E_((async()=>{const e=new Ug(this.datastore),t=this.Lu(e);t&&t.then((t=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(t)})).catch((e=>{this.ku(e)}))))})).catch((e=>{this.ku(e)}))}))}Lu(e){try{const t=this.updateFunction(e);return!Pi(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}ku(e){this.Ou>0&&this.qu(e)?(this.Ou-=1,this.asyncQueue.enqueueAndForget((()=>(this.Bu(),Promise.resolve())))):this.deferred.reject(e)}qu(e){if("FirebaseError"===e.name){const t=e.code;return"aborted"===t||"failed-precondition"===t||"already-exists"===t||!Qu(t)}return!1}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vg="FirestoreClient";class Bg{constructor(e,t,n,r,s){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=ps.UNAUTHENTICATED,this.clientId=Vs.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(n,(async e=>{vs(Vg,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e})),this.appCheckCredentials.start(n,(e=>(vs(Vg,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new As;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const n=Cp(t,"Failed to shutdown persistence");e.reject(n)}})),e.promise}}async function qg(e,t){e.asyncQueue.verifyOperationInProgress(),vs(Vg,"Initializing OfflineComponentProvider");const n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener((async e=>{r.isEqual(e)||(await ef(t.localStore,e),r=e)})),t.persistence.setDatabaseDeletedListener((()=>e.terminate())),e._offlineComponents=t}async function zg(e,t){e.asyncQueue.verifyOperationInProgress();const n=await jg(e);vs(Vg,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener((e=>bp(t.remoteStore,e))),e.setAppCheckTokenChangeListener(((e,n)=>bp(t.remoteStore,n))),e._onlineComponents=t}async function jg(e){if(!e._offlineComponents)if(e._uninitializedComponentsProvider){vs(Vg,"Using user provided OfflineComponentProvider");try{await qg(e,e._uninitializedComponentsProvider._offline)}catch(n){const r=n;if(!("FirebaseError"===(t=r).name?t.code===Cs.FAILED_PRECONDITION||t.code===Cs.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw r;_s("Error using user provided cache. Falling back to memory cache: "+r),await qg(e,new Ng)}}else vs(Vg,"Using default OfflineComponentProvider"),await qg(e,new Rg(void 0));var t;return e._offlineComponents}async function $g(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(vs(Vg,"Using user provided OnlineComponentProvider"),await zg(e,e._uninitializedComponentsProvider._online)):(vs(Vg,"Using default OnlineComponentProvider"),await zg(e,new Og))),e._onlineComponents}function Gg(e){return jg(e).then((e=>e.persistence))}function Kg(e){return jg(e).then((e=>e.localStore))}function Hg(e){return $g(e).then((e=>e.remoteStore))}function Wg(e){return $g(e).then((e=>e.syncEngine))}function Qg(e){return $g(e).then((e=>e.datastore))}async function Jg(e){const t=await $g(e),n=t.eventManager;return n.onListen=Xp.bind(null,t.syncEngine),n.onUnlisten=ng.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=Zp.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=rg.bind(null,t.syncEngine),n}function Yg(e,t,n={}){const r=new As;return e.asyncQueue.enqueueAndForget((async()=>function(e,t,n,r,s){const i=new Lg({next:a=>{i.yu(),t.enqueueAndForget((()=>Pp(e,o)));const c=a.docs.has(n);!c&&a.fromCache?s.reject(new ks(Cs.UNAVAILABLE,"Failed to get document because the client is offline.")):c&&a.fromCache&&r&&"server"===r.source?s.reject(new ks(Cs.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):s.resolve(a)},error:e=>s.reject(e)}),o=new Bp(Pc(n.path),i,{includeMetadataChanges:!0,Fa:!0});return Op(e,o)}(await Jg(e),e.asyncQueue,t,n,r))),r.promise}function Xg(e,t,n={}){const r=new As;return e.asyncQueue.enqueueAndForget((async()=>function(e,t,n,r,s){const i=new Lg({next:n=>{i.yu(),t.enqueueAndForget((()=>Pp(e,o))),n.fromCache&&"server"===r.source?s.reject(new ks(Cs.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):s.resolve(n)},error:e=>s.reject(e)}),o=new Bp(n,i,{includeMetadataChanges:!0,Fa:!0});return Op(e,o)}(await Jg(e),e.asyncQueue,t,n,r))),r.promise}function Zg(e,t,n,r){const s=function(e,t){let n;return n="string"==typeof e?Fs().encode(e):e,r=function(e,t){if(e instanceof Uint8Array)return Pg(e,t);if(e instanceof ArrayBuffer)return Pg(new Uint8Array(e),t);if(e instanceof ReadableStream)return e.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")}(n),new Mg(r,t);var r}(n,Vf(t));e.asyncQueue.enqueueAndForget((async()=>{!function(e,t,n){const r=Ss(e);(async function(e,t,n){try{const s=await t.getMetadata();if(await function(e,t){const n=Ss(e),r=_l(t.createTime);return n.persistence.runTransaction("hasNewerBundle","readonly",(e=>n.ci.getBundleMetadata(e,t.id))).then((e=>!!e&&e.createTime.compareTo(r)>=0))}(e.localStore,s))return await t.close(),n._completeWith({taskState:"Success",documentsLoaded:(r=s).totalDocuments,bytesLoaded:r.totalBytes,totalDocuments:r.totalDocuments,totalBytes:r.totalBytes}),Promise.resolve(new Set);n._updateProgress($p(s));const i=new jp(s,e.localStore,t.serializer);let o=await t.du();for(;o;){const e=await i.Na(o);e&&n._updateProgress(e),o=await t.du()}const a=await i.complete();return await mg(e,a.ka,void 0),await function(e,t){const n=Ss(e);return n.persistence.runTransaction("Save bundle","readwrite",(e=>n.ci.saveBundleMetadata(e,t)))}(e.localStore,s),n._completeWith(a.progress),Promise.resolve(a.La)}catch(r){return _s(Wp,`Loading bundle failed with ${r}`),n._failWith(r),Promise.resolve(new Set)}var r})(r,t,n).then((e=>{r.sharedClientState.notifyBundleLoaded(e)}))}(await Wg(e),s,r)}))}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function em(e){const t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const tm=new Map;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nm(e,t,n){if(!n)throw new ks(Cs.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function rm(e,t,n,r){if(!0===t&&!0===r)throw new ks(Cs.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)}function sm(e){if(!ti.isDocumentKey(e))throw new ks(Cs.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function im(e){if(ti.isDocumentKey(e))throw new ks(Cs.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function om(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{const n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}var t;return"function"==typeof e?"a function":Is(12329,{type:typeof e})}function am(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new ks(Cs.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=om(e);throw new ks(Cs.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}function cm(e,t){if(t<=0)throw new ks(Cs.INVALID_ARGUMENT,`Function ${e}() requires a positive number, but it was: ${t}.`)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const um="firestore.googleapis.com",lm=!0;class hm{constructor(e){var t,n;if(void 0===e.host){if(void 0!==e.ssl)throw new ks(Cs.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=um,this.ssl=lm}else this.host=e.host,this.ssl=null!==(t=e.ssl)&&void 0!==t?t:lm;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=$h;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<id)throw new ks(Cs.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}rm("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=em(null!==(n=e.experimentalLongPollingOptions)&&void 0!==n?n:{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new ks(Cs.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new ks(Cs.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new ks(Cs.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams;var t,n}}class dm{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new hm({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ks(Cs.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new ks(Cs.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new hm(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new Rs;switch(e.type){case"firstParty":return new Ps(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new ks(Cs.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){const t=tm.get(e);t&&(vs("ComponentProvider","Removing Datastore"),tm.delete(e),t.terminate())}(this),Promise.resolve()}}function fm(e,t,n,r={}){var s;e=am(e,dm);const i=N(t),o=e._getSettings(),a=Object.assign(Object.assign({},o),{emulatorOptions:e._getEmulatorOptions()}),c=`${t}:${n}`;i&&R(`https://${c}`),o.host!==um&&o.host!==c&&_s("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u=Object.assign(Object.assign({},o),{host:c,ssl:i,emulatorOptions:r});if(!b(u,a)&&(e._setSettings(u),r.mockUserToken)){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=ps.MOCK_USER;else{t=p(r.mockUserToken,null===(s=e._app)||void 0===s?void 0:s.options.projectId);const i=r.mockUserToken.sub||r.mockUserToken.user_id;if(!i)throw new ks(Cs.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new ps(i)}e._authCredentials=new xs(new Ns(t,n))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pm{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new pm(this.firestore,e,this._query)}}class gm{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new mm(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new gm(this.firestore,e,this._key)}}class mm extends pm{constructor(e,t,n){super(e,t,Pc(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new gm(this.firestore,null,new ti(e))}withConverter(e){return new mm(this.firestore,e,this._path)}}function ym(e,t,...n){if(e=A(e),nm("collection","path",t),e instanceof dm){const r=Xs.fromString(t,...n);return im(r),new mm(e,null,r)}{if(!(e instanceof gm||e instanceof mm))throw new ks(Cs.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(Xs.fromString(t,...n));return im(r),new mm(e.firestore,null,r)}}function vm(e,t,...n){if(e=A(e),1===arguments.length&&(t=Vs.newId()),nm("doc","path",t),e instanceof dm){const r=Xs.fromString(t,...n);return sm(r),new gm(e,null,new ti(r))}{if(!(e instanceof gm||e instanceof mm))throw new ks(Cs.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=e._path.child(Xs.fromString(t,...n));return sm(r),new gm(e.firestore,e instanceof mm?e.converter:null,new ti(r))}}function wm(e,t){return e=A(e),t=A(t),e instanceof pm&&t instanceof pm&&e.firestore===t.firestore&&jc(e._query,t._query)&&e.converter===t.converter
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const _m="AsyncQueue";class bm{constructor(e=Promise.resolve()){this.Qu=[],this.$u=!1,this.Uu=[],this.Ku=null,this.Wu=!1,this.Gu=!1,this.zu=[],this.y_=new Bf(this,"async_queue_retry"),this.ju=()=>{const e=Ff();e&&vs(_m,"Visibility state changed to "+e.visibilityState),this.y_.A_()},this.Hu=e;const t=Ff();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this.ju)}get isShuttingDown(){return this.$u}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Ju(),this.Yu(e)}enterRestrictedMode(e){if(!this.$u){this.$u=!0,this.Gu=e||!1;const t=Ff();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this.ju)}}enqueue(e){if(this.Ju(),this.$u)return new Promise((()=>{}));const t=new As;return this.Yu((()=>this.$u&&this.Gu?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Qu.push(e),this.Zu())))}async Zu(){if(0!==this.Qu.length){try{await this.Qu[0](),this.Qu.shift(),this.y_.reset()}catch(e){if(!Ei(e))throw e;vs(_m,"Operation failed with retryable error: "+e)}this.Qu.length>0&&this.y_.E_((()=>this.Zu()))}}Yu(e){const t=this.Hu.then((()=>(this.Wu=!0,e().catch((e=>{throw this.Ku=e,this.Wu=!1,ws("INTERNAL UNHANDLED ERROR: ",Im(e)),e})).then((e=>(this.Wu=!1,e))))));return this.Hu=t,t}enqueueAfterDelay(e,t,n){this.Ju(),this.zu.indexOf(e)>-1&&(t=0);const r=Sp.createAndSchedule(this,e,t,n,(e=>this.Xu(e)));return this.Uu.push(r),r}Ju(){this.Ku&&Is(47125,{ec:Im(this.Ku)})}verifyOperationInProgress(){}async tc(){let e;do{e=this.Hu,await e}while(e!==this.Hu)}nc(e){for(const t of this.Uu)if(t.timerId===e)return!0;return!1}rc(e){return this.tc().then((()=>{this.Uu.sort(((e,t)=>e.targetTimeMs-t.targetTimeMs));for(const t of this.Uu)if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.tc()}))}sc(e){this.zu.push(e)}Xu(e){const t=this.Uu.indexOf(e);this.Uu.splice(t,1)}}function Im(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}function Tm(e){return function(e,t){if("object"!=typeof e||null===e)return!1;const n=e;for(const r of t)if(r in n&&"function"==typeof n[r])return!0;return!1}(e,["next","error","complete"])}class Em{constructor(){this._progressObserver={},this._taskCompletionResolver=new As,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,n){this._progressObserver={next:e,error:t,complete:n}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sm extends dm{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new bm,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new bm(e),this._firestoreClient=void 0,await e}}}function Cm(e,t){const n="object"==typeof e?e:xe(),r="string"==typeof e?e:t||_a,s=Se(n,"firestore").getImmediate({identifier:r});if(!s._initialized){const e=l("firestore");e&&fm(s,...e)}return s}function km(e){if(e._terminated)throw new ks(Cs.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||Am(e),e._firestoreClient}function Am(e){var t,n,r;const s=e._freezeSettings(),i=(o=e._databaseId,a=(null===(t=e._app)||void 0===t?void 0:t.options.appId)||"",c=e._persistenceKey,new wa(o,a,c,(u=s).host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,em(u.experimentalLongPollingOptions),u.useFetchStreams,u.isUsingEmulator));var o,a,c,u;e._componentsProvider||(null===(n=s.localCache)||void 0===n?void 0:n._offlineComponentProvider)&&(null===(r=s.localCache)||void 0===r?void 0:r._onlineComponentProvider)&&(e._componentsProvider={_offline:s.localCache._offlineComponentProvider,_online:s.localCache._onlineComponentProvider}),e._firestoreClient=new Bg(e._authCredentials,e._appCheckCredentials,e._queue,i,e._componentsProvider&&function(e){const t=null==e?void 0:e._online.build();return{_offline:null==e?void 0:e._offline.build(t),_online:t}}(e._componentsProvider))}function Nm(e,t,n){if((e=am(e,Sm))._firestoreClient||e._terminated)throw new ks(Cs.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new ks(Cs.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},Am(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Rm{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class xm{constructor(e,t,n){this._userDataWriter=t,this._data=n,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dm{constructor(e){this._byteString=e}static fromBase64String(e){try{return new Dm(aa.fromBase64String(e))}catch(t){throw new ks(Cs.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new Dm(aa.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Om{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new ks(Cs.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new ei(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Pm{constructor(e){this._methodName=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new ks(Cs.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new ks(Cs.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(e){return Bs(this._lat,e._lat)||Bs(this._long,e._long)}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mm{constructor(e){this._values=(e||[]).map((e=>e))}toArray(){return this._values.map((e=>e))}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Um=/^__.*__$/;class Fm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new Mu(e,this.data,this.fieldMask,t,this.fieldTransforms):new Lu(e,this.data,t,this.fieldTransforms)}}class Vm{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new Mu(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function Bm(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw Is(40011,{oc:e})}}class qm{constructor(e,t,n,r,s,i){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===s&&this._c(),this.fieldTransforms=s||[],this.fieldMask=i||[]}get path(){return this.settings.path}get oc(){return this.settings.oc}ac(e){return new qm(Object.assign(Object.assign({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}uc(e){var t;const n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.ac({path:n,cc:!1});return r.lc(e),r}hc(e){var t;const n=null===(t=this.path)||void 0===t?void 0:t.child(e),r=this.ac({path:n,cc:!1});return r._c(),r}Pc(e){return this.ac({path:void 0,cc:!0})}Tc(e){return ay(e,this.settings.methodName,this.settings.Ic||!1,this.path,this.settings.Ec)}contains(e){return void 0!==this.fieldMask.find((t=>e.isPrefixOf(t)))||void 0!==this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))}_c(){if(this.path)for(let e=0;e<this.path.length;e++)this.lc(this.path.get(e))}lc(e){if(0===e.length)throw this.Tc("Document fields must not be empty");if(Bm(this.oc)&&Um.test(e))throw this.Tc('Document fields cannot begin and end with "__"')}}class zm{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||Vf(e)}dc(e,t,n,r=!1){return new qm({oc:e,methodName:t,Ec:n,path:ei.emptyPath(),cc:!1,Ic:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function jm(e){const t=e._freezeSettings(),n=Vf(e._databaseId);return new zm(e._databaseId,!!t.ignoreUndefinedProperties,n)}function $m(e,t,n,r,s,i={}){const o=e.dc(i.merge||i.mergeFields?2:0,t,n,s);ry("Data must be an object, but it was:",o,r);const a=ty(r,o);let c,u;if(i.merge)c=new ia(o.fieldMask),u=o.fieldTransforms;else if(i.mergeFields){const e=[];for(const r of i.mergeFields){const s=sy(t,r,n);if(!o.contains(s))throw new ks(Cs.INVALID_ARGUMENT,`Field '${s}' is specified in your field mask but missing from your input data.`);cy(e,s)||e.push(s)}c=new ia(e),u=o.fieldTransforms.filter((e=>c.covers(e.field)))}else c=null,u=o.fieldTransforms;return new Fm(new Ya(a),c,u)}class Gm extends Pm{_toFieldTransform(e){if(2!==e.oc)throw 1===e.oc?e.Tc(`${this._methodName}() can only appear at the top level of your update data`):e.Tc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Gm}}function Km(e,t,n){return new qm({oc:3,Ec:t.settings.Ec,methodName:e._methodName,cc:n},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class Hm extends Pm{_toFieldTransform(e){return new Su(e.path,new yu)}isEqual(e){return e instanceof Hm}}class Wm extends Pm{constructor(e,t){super(e),this.Ac=t}_toFieldTransform(e){const t=Km(this,e,!0),n=this.Ac.map((e=>ey(e,t))),r=new vu(n);return new Su(e.path,r)}isEqual(e){return e instanceof Wm&&b(this.Ac,e.Ac)}}class Qm extends Pm{constructor(e,t){super(e),this.Ac=t}_toFieldTransform(e){const t=Km(this,e,!0),n=this.Ac.map((e=>ey(e,t))),r=new _u(n);return new Su(e.path,r)}isEqual(e){return e instanceof Qm&&b(this.Ac,e.Ac)}}class Jm extends Pm{constructor(e,t){super(e),this.Rc=t}_toFieldTransform(e){const t=new Iu(e.serializer,du(e.serializer,this.Rc));return new Su(e.path,t)}isEqual(e){return e instanceof Jm&&this.Rc===e.Rc}}function Ym(e,t,n,r){const s=e.dc(1,t,n);ry("Data must be an object, but it was:",s,r);const i=[],o=Ya.empty();Jo(r,((e,r)=>{const a=oy(t,e,n);r=A(r);const c=s.hc(a);if(r instanceof Gm)i.push(a);else{const e=ey(r,c);null!=e&&(i.push(a),o.set(a,e))}}));const a=new ia(i);return new Vm(o,a,s.fieldTransforms)}function Xm(e,t,n,r,s,i){const o=e.dc(1,t,n),a=[sy(t,r,n)],c=[s];if(i.length%2!=0)throw new ks(Cs.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<i.length;d+=2)a.push(sy(t,i[d])),c.push(i[d+1]);const u=[],l=Ya.empty();for(let d=a.length-1;d>=0;--d)if(!cy(u,a[d])){const e=a[d];let t=c[d];t=A(t);const n=o.hc(e);if(t instanceof Gm)u.push(e);else{const r=ey(t,n);null!=r&&(u.push(e),l.set(e,r))}}const h=new ia(u);return new Vm(l,h,o.fieldTransforms)}function Zm(e,t,n,r=!1){return ey(n,e.dc(r?4:3,t))}function ey(e,t){if(ny(e=A(e)))return ry("Unsupported field value:",t,e),ty(e,t);if(e instanceof Pm)return function(e,t){if(!Bm(t.oc))throw t.Tc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Tc(`${e._methodName}() is not currently supported inside arrays`);const n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.cc&&4!==t.oc)throw t.Tc("Nested arrays are not supported");return function(e,t){const n=[];let r=0;for(const s of e){let e=ey(s,t.Pc(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){if(null===(e=A(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return du(t.serializer,e);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){const n=Ws.fromDate(e);return{timestampValue:yl(t.serializer,n)}}if(e instanceof Ws){const n=new Ws(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:yl(t.serializer,n)}}if(e instanceof Lm)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof Dm)return{bytesValue:vl(t.serializer,e._byteString)};if(e instanceof gm){const n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.Tc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:bl(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof Mm)return n=e,r=t,{mapValue:{fields:{[Ia]:{stringValue:Sa},[Ca]:{arrayValue:{values:n.toArray().map((e=>{if("number"!=typeof e)throw r.Tc("VectorValues must only contain numeric values.");return lu(r.serializer,e)}))}}}}};var n,r;throw t.Tc(`Unsupported field value: ${om(e)}`)}(e,t)}function ty(e,t){const n={};return Xo(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):Jo(e,((e,r)=>{const s=ey(r,t.uc(e));null!=s&&(n[e]=s)})),{mapValue:{fields:n}}}function ny(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof Ws||e instanceof Lm||e instanceof Dm||e instanceof gm||e instanceof Pm||e instanceof Mm)}function ry(e,t,n){if(!ny(n)||("object"!=typeof(r=n)||null===r||Object.getPrototypeOf(r)!==Object.prototype&&null!==Object.getPrototypeOf(r))){const r=om(n);throw"an object"===r?t.Tc(e+" a custom object"):t.Tc(e+" "+r)}var r}function sy(e,t,n){if((t=A(t))instanceof Om)return t._internalPath;if("string"==typeof t)return oy(e,t);throw ay("Field path arguments must be of type string or ",e,!1,void 0,n)}const iy=new RegExp("[~\\*/\\[\\]]");function oy(e,t,n){if(t.search(iy)>=0)throw ay(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new Om(...t.split("."))._internalPath}catch(r){throw ay(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function ay(e,t,n,r,s){const i=r&&!r.isEmpty(),o=void 0!==s;let a=`Function ${t}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(i||o)&&(c+=" (found",i&&(c+=` in field ${r}`),o&&(c+=` in document ${s}`),c+=")"),new ks(Cs.INVALID_ARGUMENT,a+e+c)}function cy(e,t){return e.some((e=>e.isEqual(t)))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uy{constructor(e,t,n,r,s){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new gm(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const e=new ly(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){const t=this._document.data.field(hy("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class ly extends uy{data(){return super.data()}}function hy(e,t){return"string"==typeof t?oy(e,t):t instanceof Om?t._internalPath:t._delegate._internalPath}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dy(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new ks(Cs.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class fy{}class py extends fy{}function gy(e,t,...n){let r=[];t instanceof fy&&r.push(t),r=r.concat(n),function(e){const t=e.filter((e=>e instanceof vy)).length,n=e.filter((e=>e instanceof my)).length;if(t>1||t>0&&n>0)throw new ks(Cs.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const s of r)e=s._apply(e);return e}class my extends py{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new my(e,t,n)}_apply(e){const t=this._parse(e);return Ay(e._query,t),new pm(e.firestore,e.converter,qc(e._query,t))}_parse(e){const t=jm(e.firestore);return function(e,t,n,r,s,i,o){let a;if(s.isKeyField()){if("array-contains"===i||"array-contains-any"===i)throw new ks(Cs.INVALID_ARGUMENT,`Invalid Query. You can't perform '${i}' queries on documentId().`);if("in"===i||"not-in"===i){ky(o,i);const t=[];for(const n of o)t.push(Cy(r,e,n));a={arrayValue:{values:t}}}else a=Cy(r,e,o)}else"in"!==i&&"not-in"!==i&&"array-contains-any"!==i||ky(o,i),a=Zm(n,t,o,"in"===i||"not-in"===i);return oc.create(s,i,a)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function yy(e,t,n){const r=t,s=hy("where",e);return my._create(s,r,n)}class vy extends fy{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new vy(e,t)}_parse(e){const t=this._queryConstraints.map((t=>t._parse(e))).filter((e=>e.getFilters().length>0));return 1===t.length?t[0]:ac.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;const r=t.getFlattenedFilters();for(const s of r)Ay(n,s),n=qc(n,s)}(e._query,t),new pm(e.firestore,e.converter,qc(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class wy extends py{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new wy(e,t)}_apply(e){const t=function(e,t,n){if(null!==e.startAt)throw new ks(Cs.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new ks(Cs.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new rc(t,n)}(e._query,this._field,this._direction);return new pm(e.firestore,e.converter,function(e,t){const n=e.explicitOrderBy.concat([t]);return new Dc(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function _y(e,t="asc"){const n=t,r=hy("orderBy",e);return wy._create(r,n)}class by extends py{constructor(e,t,n){super(),this.type=e,this._limit=t,this._limitType=n}static _create(e,t,n){return new by(e,t,n)}_apply(e){return new pm(e.firestore,e.converter,zc(e._query,this._limit,this._limitType))}}function Iy(e){return cm("limit",e),by._create("limit",e,"F")}class Ty extends py{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Ty(e,t,n)}_apply(e){const t=Sy(e,this.type,this._docOrFields,this._inclusive);return new pm(e.firestore,e.converter,(n=e._query,r=t,new Dc(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,r,n.endAt)));var n,r}}class Ey extends py{constructor(e,t,n){super(),this.type=e,this._docOrFields=t,this._inclusive=n}static _create(e,t,n){return new Ey(e,t,n)}_apply(e){const t=Sy(e,this.type,this._docOrFields,this._inclusive);return new pm(e.firestore,e.converter,(n=e._query,r=t,new Dc(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,n.startAt,r)));var n,r}}function Sy(e,t,n,r){if(n[0]=A(n[0]),n[0]instanceof uy)return function(e,t,n,r,s){if(!r)throw new ks(Cs.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${n}().`);const i=[];for(const o of Uc(e))if(o.field.isKeyField())i.push(Ua(t,r.key));else{const e=r.data.field(o.field);if(ma(e))throw new ks(Cs.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+o.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(null===e){const e=o.field.canonicalString();throw new ks(Cs.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${e}' (used as the orderBy) does not exist.`)}i.push(e)}return new ec(i,s)}(e._query,e.firestore._databaseId,t,n[0]._document,r);{const s=jm(e.firestore);return function(e,t,n,r,s,i){const o=e.explicitOrderBy;if(s.length>o.length)throw new ks(Cs.INVALID_ARGUMENT,`Too many arguments provided to ${r}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const a=[];for(let c=0;c<s.length;c++){const i=s[c];if(o[c].field.isKeyField()){if("string"!=typeof i)throw new ks(Cs.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${r}(), but got a ${typeof i}`);if(!Mc(e)&&-1!==i.indexOf("/"))throw new ks(Cs.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${r}() must be a plain document ID, but '${i}' contains a slash.`);const n=e.path.child(Xs.fromString(i));if(!ti.isDocumentKey(n))throw new ks(Cs.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${r}() must result in a valid document path, but '${n}' is not because it contains an odd number of segments.`);const s=new ti(n);a.push(Ua(t,s))}else{const e=Zm(n,r,i);a.push(e)}}return new ec(a,i)}(e._query,e.firestore._databaseId,s,t,n,r)}}function Cy(e,t,n){if("string"==typeof(n=A(n))){if(""===n)throw new ks(Cs.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Mc(t)&&-1!==n.indexOf("/"))throw new ks(Cs.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=t.path.child(Xs.fromString(n));if(!ti.isDocumentKey(r))throw new ks(Cs.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Ua(e,new ti(r))}if(n instanceof gm)return Ua(e,n._key);throw new ks(Cs.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${om(n)}.`)}function ky(e,t){if(!Array.isArray(e)||0===e.length)throw new ks(Cs.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function Ay(e,t){const n=function(e,t){for(const n of e)for(const e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new ks(Cs.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new ks(Cs.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}function Ny(e,t){if(!(t instanceof my||t instanceof vy))throw new ks(Cs.INVALID_ARGUMENT,`Function ${e}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}class Ry{convertValue(e,t="none"){switch(Aa(e)){case 0:return null;case 1:return e.booleanValue;case 2:return la(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(ha(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw Is(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const n={};return Jo(e,((e,r)=>{n[e]=this.convertValue(r,t)})),n}convertVectorValue(e){var t,n,r;const s=null===(r=null===(n=null===(t=e.fields)||void 0===t?void 0:t[Ca].arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.map((e=>la(e.doubleValue)));return new Mm(s)}convertGeoPoint(e){return new Lm(la(e.latitude),la(e.longitude))}convertArray(e,t){return(e.values||[]).map((e=>this.convertValue(e,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const n=ya(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(va(e));default:return null}}convertTimestamp(e){const t=ua(e);return new Ws(t.seconds,t.nanos)}convertDocumentKey(e,t){const n=Xs.fromString(e);Es(Kl(n),9688,{name:e});const r=new ba(n.get(1),n.get(3)),s=new ti(n.popFirst(5));return r.isEqual(t)||ws(`Document ${s} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),s}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xy(e,t,n){let r;return r=e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t,r}class Dy extends Ry{constructor(e){super(),this.firestore=e}convertBytes(e){return new Dm(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new gm(this.firestore,null,t)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Oy(){return new Rm("count")}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Py{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Ly extends uy{constructor(e,t,n,r,s,i){super(e,t,n,r,i),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new My(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const n=this._document.data.field(hy("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}}class My extends Ly{data(e={}){return super.data(e)}}class Uy{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new Py(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach((n=>{e.call(t,new My(this._firestore,this._userDataWriter,n.key,n,new Py(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new ks(Cs.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map((n=>{const r=new My(e._firestore,e._userDataWriter,n.doc.key,n.doc,new Py(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}}))}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter((e=>t||3!==e.type)).map((t=>{const r=new My(e._firestore,e._userDataWriter,t.doc.key,t.doc,new Py(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter);let s=-1,i=-1;return 0!==t.type&&(s=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(n=n.add(t.doc),i=n.indexOf(t.doc.key)),{type:Fy(t.type),doc:r,oldIndex:s,newIndex:i}}))}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}}function Fy(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return Is(61501,{type:e})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Vy(e){e=am(e,gm);const t=am(e.firestore,Sm);return Yg(km(t),e._key).then((n=>Ky(t,e,n)))}class By extends Ry{constructor(e){super(),this.firestore=e}convertBytes(e){return new Dm(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new gm(this.firestore,null,t)}}function qy(e){e=am(e,pm);const t=am(e.firestore,Sm),n=km(t),r=new By(t);return dy(e._query),Xg(n,e._query).then((n=>new Uy(t,r,e,n)))}function zy(e,t,n){e=am(e,gm);const r=am(e.firestore,Sm),s=xy(e.converter,t,n);return Gy(r,[$m(jm(r),"setDoc",e._key,s,null!==e.converter,n).toMutation(e._key,ku.none())])}function jy(e,t,n,...r){e=am(e,gm);const s=am(e.firestore,Sm),i=jm(s);let o;return o="string"==typeof(t=A(t))||t instanceof Om?Xm(i,"updateDoc",e._key,t,n,r):Ym(i,"updateDoc",e._key,t),Gy(s,[o.toMutation(e._key,ku.exists(!0))])}function $y(e){return Gy(am(e.firestore,Sm),[new Bu(e._key,ku.none())])}function Gy(e,t){return function(e,t){const n=new As;return e.asyncQueue.enqueueAndForget((async()=>async function(t,n,r){const s=Ag(t);try{const e=await function(e,t){const n=Ss(e),r=Ws.now(),s=t.reduce(((e,t)=>e.add(t.key)),au());let i,o;return n.persistence.runTransaction("Locally write mutations","readwrite",(e=>{let a=Xc(),c=au();return n.Cs.getEntries(e,s).next((e=>{a=e,a.forEach(((e,t)=>{t.isValidDocument()||(c=c.add(e))}))})).next((()=>n.localDocuments.getOverlayedDocuments(e,a))).next((s=>{i=s;const o=[];for(const e of t){const t=Ou(e,i.get(e.key).overlayedDocument);null!=t&&o.push(new Mu(e.key,t,Xa(t.value.mapValue),ku.exists(!0)))}return n.mutationQueue.addMutationBatch(e,r,o,t)})).next((t=>{o=t;const r=t.applyToLocalDocumentSet(i,c);return n.documentOverlayCache.saveOverlays(e,t.batchId,r)}))})).then((()=>({batchId:o.batchId,changes:tu(i)})))}(s.localStore,n);s.sharedClientState.addPendingMutation(e.batchId),function(e,t,n){let r=e.uu[e.currentUser.toKey()];r||(r=new Zo(Bs)),r=r.insert(t,n),e.uu[e.currentUser.toKey()]=r}(s,e.batchId,r),await mg(s,e.changes),await dp(s.remoteStore)}catch(e){const n=Cp(e,"Failed to persist write");r.reject(n)}}(await Wg(e),t,n))),n.promise}(km(e),t)}function Ky(e,t,n){const r=n.docs.get(t._key),s=new By(e);return new Ly(e,s,t._key,r,new Py(n.hasPendingWrites,n.fromCache),t.converter)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hy(e,t){const n=am(e.firestore,Sm),r=km(n),s=Yo(t,((e,t)=>new Gu(t,e.aggregateType,e._internalFieldPath)));return function(e,t,n){const r=new As;return e.asyncQueue.enqueueAndForget((async()=>{try{const s=await Qg(e);r.resolve(async function(e,t,n){var r;const s=Ss(e),{request:i,yt:o,parent:a}=Ml(s.serializer,Vc(t),n);s.connection.Bo||delete i.parent;const c=(await s.Wo("RunAggregationQuery",s.serializer.databaseId,a,i,1)).filter((e=>!!e.result));Es(1===c.length,64727);const u=null===(r=c[0].result)||void 0===r?void 0:r.aggregateFields;return Object.keys(u).reduce(((e,t)=>(e[o[t]]=u[t],e)),{})}(s,t,n))}catch(s){r.reject(s)}})),r.promise}(r,e._query,s).then((t=>function(e,t,n){const r=new By(e);return new xm(t,r,n)}(n,e,t)))}class Wy{constructor(e){this.kind="memory",this._onlineComponentProvider=Og.provider,(null==e?void 0:e.garbageCollector)?this._offlineComponentProvider=e.garbageCollector._offlineComponentProvider:this._offlineComponentProvider={build:()=>new Rg(void 0)}}toJSON(){return{kind:this.kind}}}class Qy{constructor(e){let t;this.kind="persistent",(null==e?void 0:e.tabManager)?(e.tabManager._initialize(e),t=e.tabManager):(t=ev(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class Jy{constructor(){this.kind="memoryEager",this._offlineComponentProvider=Ng.provider}toJSON(){return{kind:this.kind}}}class Yy{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new Rg(e)}}toJSON(){return{kind:this.kind}}}class Xy{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Og.provider,this._offlineComponentProvider={build:t=>new xg(t,null==e?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class Zy{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Og.provider,this._offlineComponentProvider={build:t=>new Dg(t,null==e?void 0:e.cacheSizeBytes)}}}function ev(e){return new Xy(null==e?void 0:e.forceOwnership)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const tv={maxAttempts:5};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nv{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=jm(e)}set(e,t,n){this._verifyNotCommitted();const r=rv(e,this._firestore),s=xy(r.converter,t,n),i=$m(this._dataReader,"WriteBatch.set",r._key,s,null!==r.converter,n);return this._mutations.push(i.toMutation(r._key,ku.none())),this}update(e,t,n,...r){this._verifyNotCommitted();const s=rv(e,this._firestore);let i;return i="string"==typeof(t=A(t))||t instanceof Om?Xm(this._dataReader,"WriteBatch.update",s._key,t,n,r):Ym(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(i.toMutation(s._key,ku.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=rv(e,this._firestore);return this._mutations=this._mutations.concat(new Bu(t._key,ku.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new ks(Cs.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function rv(e,t){if((e=A(e)).firestore!==t)throw new ks(Cs.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sv{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=jm(e)}get(e){const t=rv(e,this._firestore),n=new Dy(this._firestore);return this._transaction.lookup([t._key]).then((e=>{if(!e||1!==e.length)return Is(24041);const r=e[0];if(r.isFoundDocument())return new uy(this._firestore,n,r.key,r,t.converter);if(r.isNoDocument())return new uy(this._firestore,n,t._key,null,t.converter);throw Is(18433,{doc:r})}))}set(e,t,n){const r=rv(e,this._firestore),s=xy(r.converter,t,n),i=$m(this._dataReader,"Transaction.set",r._key,s,null!==r.converter,n);return this._transaction.set(r._key,i),this}update(e,t,n,...r){const s=rv(e,this._firestore);let i;return i="string"==typeof(t=A(t))||t instanceof Om?Xm(this._dataReader,"Transaction.update",s._key,t,n,r):Ym(this._dataReader,"Transaction.update",s._key,t),this._transaction.update(s._key,i),this}delete(e){const t=rv(e,this._firestore);return this._transaction.delete(t._key),this}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iv extends sv{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=rv(e,this._firestore),n=new By(this._firestore);return super.get(e).then((e=>new Ly(this._firestore,n,t._key,e._document,new Py(!1,!1),t.converter)))}}function ov(e,t){if("string"!=typeof e[t])throw new ks(Cs.INVALID_ARGUMENT,"Missing string value for: "+t);return e[t]}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class av{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function cv(e,t){(function(e,t){return e.asyncQueue.enqueue((async()=>{return n=await Kg(e),r=t,void(Ss(n).bs.Is=r);var n,r}))})(km(e._firestore),t).then((e=>vs(`setting persistent cache index auto creation isEnabled=${t} succeeded`))).catch((e=>_s(`setting persistent cache index auto creation isEnabled=${t} failed`,e)))}const uv=new WeakMap;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lv{constructor(){this.Vc=new Map}static get instance(){return hv||(hv=new lv,function(e){if(Yu)throw new Error("a TestingHooksSpi instance is already set");Yu=e}(hv)),hv}ht(e){this.Vc.forEach((t=>t(e)))}onExistenceFilterMismatch(e){const t=Symbol(),n=this.Vc;return n.set(t,e),()=>n.delete(t)}}let hv=null;!function(e,t=!0){gs=Ne,Ee(new x("firestore",((e,{instanceIdentifier:n,options:r})=>{const s=e.getProvider("app").getImmediate(),i=new Sm(new Ds(e.getProvider("auth-internal")),new Ms(s,e.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new ks(Cs.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new ba(e.options.projectId,t)}(s,n),s);return r=Object.assign({useFetchStreams:t},r),i._setSettings(r),i}),"PUBLIC").setMultipleInstances(!0)),De(ds,fs,e),De(ds,fs,"esm2017")}();const dv=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Ry,AggregateField:Rm,AggregateQuerySnapshot:xm,Bytes:Dm,CACHE_SIZE_UNLIMITED:-1,CollectionReference:mm,DocumentReference:gm,DocumentSnapshot:Ly,FieldPath:Om,FieldValue:Pm,Firestore:Sm,FirestoreError:ks,GeoPoint:Lm,LoadBundleTask:Em,PersistentCacheIndexManager:av,Query:pm,QueryCompositeFilterConstraint:vy,QueryConstraint:py,QueryDocumentSnapshot:My,QueryEndAtConstraint:Ey,QueryFieldFilterConstraint:my,QueryLimitConstraint:by,QueryOrderByConstraint:wy,QuerySnapshot:Uy,QueryStartAtConstraint:Ty,SnapshotMetadata:Py,Timestamp:Ws,Transaction:iv,VectorValue:Mm,WriteBatch:nv,_AutoId:Vs,_ByteString:aa,_DatabaseId:ba,_DocumentKey:ti,_EmptyAppCheckTokenProvider:class{getToken(){return Promise.resolve(new Ls(""))}invalidateToken(){}start(e,t){}shutdown(){}},_EmptyAuthCredentialsProvider:Rs,_FieldPath:ei,_TestingHooks:
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return lv.instance.onExistenceFilterMismatch(e)}},_cast:am,_debugAssert:function(e,t){e||Is(57014,t)},_internalAggregationQueryToProtoRunAggregationQueryRequest:function(e,t){var n;const r=Yo(t,((e,t)=>new Gu(t,e.aggregateType,e._internalFieldPath))),s=null===(n=km(am(e.firestore,Sm))._onlineComponents)||void 0===n?void 0:n.datastore.serializer;return void 0===s?null:Ml(s,Vc(e._query),r,!0).request},_internalQueryToProtoQueryTarget:function(e){var t;const n=null===(t=km(am(e.firestore,Sm))._onlineComponents)||void 0===t?void 0:t.datastore.serializer;return void 0===n?null:Ll(n,Fc(e._query)).gt},_isBase64Available:function(){return"undefined"!=typeof atob},_logWarn:_s,_validateIsNotUsedTogether:rm,addDoc:function(e,t){const n=am(e.firestore,Sm),r=vm(e),s=xy(e.converter,t);return Gy(n,[$m(jm(e.firestore),"addDoc",r._key,s,null!==e.converter,{}).toMutation(r._key,ku.exists(!1))]).then((()=>r))},aggregateFieldEqual:function(e,t){var n,r;return e instanceof Rm&&t instanceof Rm&&e.aggregateType===t.aggregateType&&(null===(n=e._internalFieldPath)||void 0===n?void 0:n.canonicalString())===(null===(r=t._internalFieldPath)||void 0===r?void 0:r.canonicalString())},aggregateQuerySnapshotEqual:function(e,t){return wm(e.query,t.query)&&b(e.data(),t.data())},and:function(...e){return e.forEach((e=>Ny("and",e))),vy._create("and",e)},arrayRemove:function(...e){return new Qm("arrayRemove",e)},arrayUnion:function(...e){return new Wm("arrayUnion",e)},average:function(e){return new Rm("avg",sy("average",e))},clearIndexedDbPersistence:function(e){if(e._initialized&&!e._terminated)throw new ks(Cs.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const t=new As;return e._queue.enqueueAndForgetEvenWhileRestricted((async()=>{try{await async function(e){if(!_i.C())return Promise.resolve();const t=e+jd;await _i.delete(t)}(Hd(e._databaseId,e._persistenceKey)),t.resolve()}catch(n){t.reject(n)}})),t.promise},collection:ym,collectionGroup:function(e,t){if(e=am(e,dm),nm("collectionGroup","collection id",t),t.indexOf("/")>=0)throw new ks(Cs.INVALID_ARGUMENT,`Invalid collection ID '${t}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new pm(e,null,(n=t,new Dc(Xs.emptyPath(),n)));var n},connectFirestoreEmulator:fm,count:Oy,deleteAllPersistentCacheIndexes:function(e){(function(e){return e.asyncQueue.enqueue((async()=>function(e){const t=Ss(e),n=t.indexManager;return t.persistence.runTransaction("Delete All Indexes","readwrite",(e=>n.deleteAllFieldIndexes(e)))}(await Kg(e))))})(km(e._firestore)).then((e=>vs("deleting all persistent cache indexes succeeded"))).catch((e=>_s("deleting all persistent cache indexes failed",e)))},deleteDoc:$y,deleteField:
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){return new Gm("deleteField")},disableNetwork:function(e){return function(e){return e.asyncQueue.enqueue((async()=>{const t=await Gg(e),n=await Hg(e);return t.setNetworkEnabled(!1),async function(e){const t=Ss(e);t.aa.add(0),await Yf(t),t.la.set("Offline")}(n)}))}(km(e=am(e,Sm)))},disablePersistentCacheIndexAutoCreation:function(e){cv(e,!1)},doc:vm,documentId:function(){return new Om(Js)},enableIndexedDbPersistence:function(e,t){_s("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const n=e._freezeSettings();return Nm(e,Og.provider,{build:e=>new xg(e,n.cacheSizeBytes,null==t?void 0:t.forceOwnership)}),Promise.resolve()},enableMultiTabIndexedDbPersistence:async function(e){_s("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=e._freezeSettings();Nm(e,Og.provider,{build:e=>new Dg(e,t.cacheSizeBytes)})},enableNetwork:function(e){return function(e){return e.asyncQueue.enqueue((async()=>{const t=await Gg(e),n=await Hg(e);return t.setNetworkEnabled(!0),function(e){const t=Ss(e);return t.aa.delete(0),Jf(t)}(n)}))}(km(e=am(e,Sm)))},enablePersistentCacheIndexAutoCreation:function(e){cv(e,!0)},endAt:function(...e){return Ey._create("endAt",e,!0)},endBefore:function(...e){return Ey._create("endBefore",e,!1)},ensureFirestoreConfigured:km,executeWrite:Gy,getAggregateFromServer:Hy,getCountFromServer:function(e){return Hy(e,{count:Oy()})},getDoc:Vy,getDocFromCache:function(e){e=am(e,gm);const t=am(e.firestore,Sm),n=km(t),r=new By(t);return function(e,t){const n=new As;return e.asyncQueue.enqueueAndForget((async()=>async function(e,t,n){try{const r=await function(e,t){const n=Ss(e);return n.persistence.runTransaction("read document","readonly",(e=>n.localDocuments.getDocument(e,t)))}(e,t);r.isFoundDocument()?n.resolve(r):r.isNoDocument()?n.resolve(null):n.reject(new ks(Cs.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(r){const e=Cp(r,`Failed to get document '${t} from cache`);n.reject(e)}}(await Kg(e),t,n))),n.promise}(n,e._key).then((n=>new Ly(t,r,e._key,n,new Py(null!==n&&n.hasLocalMutations,!0),e.converter)))},getDocFromServer:function(e){e=am(e,gm);const t=am(e.firestore,Sm);return Yg(km(t),e._key,{source:"server"}).then((n=>Ky(t,e,n)))},getDocs:qy,getDocsFromCache:function(e){e=am(e,pm);const t=am(e.firestore,Sm),n=km(t),r=new By(t);return function(e,t){const n=new As;return e.asyncQueue.enqueueAndForget((async()=>async function(e,t,n){try{const r=await af(e,t,!0),s=new Hp(t,r.Ns),i=s.Ga(r.documents),o=s.applyChanges(i,!1);n.resolve(o.snapshot)}catch(r){const e=Cp(r,`Failed to execute query '${t} against cache`);n.reject(e)}}(await Kg(e),t,n))),n.promise}(n,e._query).then((n=>new Uy(t,r,e,n)))},getDocsFromServer:function(e){e=am(e,pm);const t=am(e.firestore,Sm),n=km(t),r=new By(t);return Xg(n,e._query,{source:"server"}).then((n=>new Uy(t,r,e,n)))},getFirestore:Cm,getPersistentCacheIndexManager:function(e){var t;e=am(e,Sm);const n=uv.get(e);if(n)return n;if("persistent"!==(null===(t=km(e)._uninitializedComponentsProvider)||void 0===t?void 0:t._offline.kind))return null;const r=new av(e);return uv.set(e,r),r},increment:function(e){return new Jm("increment",e)},initializeFirestore:function(e,t,n){n||(n=_a);const r=Se(e,"firestore");if(r.isInitialized(n)){const e=r.getImmediate({identifier:n});if(b(r.getOptions(n),t))return e;throw new ks(Cs.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==t.cacheSizeBytes&&void 0!==t.localCache)throw new ks(Cs.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==t.cacheSizeBytes&&-1!==t.cacheSizeBytes&&t.cacheSizeBytes<id)throw new ks(Cs.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return t.host&&N(t.host)&&R(t.host),r.initialize({options:t,instanceIdentifier:n})},limit:Iy,limitToLast:function(e){return cm("limitToLast",e),by._create("limitToLast",e,"L")},loadBundle:function(e,t){const n=km(e=am(e,Sm)),r=new Em;return Zg(n,e._databaseId,t,r),r},memoryEagerGarbageCollector:function(){return new Jy},memoryLocalCache:function(e){return new Wy(e)},memoryLruGarbageCollector:function(e){return new Yy(null==e?void 0:e.cacheSizeBytes)},namedQuery:function(e,t){return function(e,t){return e.asyncQueue.enqueue((async()=>function(e,t){const n=Ss(e);return n.persistence.runTransaction("Get named query","readonly",(e=>n.ci.getNamedQuery(e,t)))}(await Kg(e),t)))}(km(e=am(e,Sm)),t).then((t=>t?new pm(e,null,t.query):null))},onSnapshot:function(e,...t){var n,r,s;e=A(e);let i={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof t[o]||Tm(t[o])||(i=t[o],o++);const a={includeMetadataChanges:i.includeMetadataChanges,source:i.source};if(Tm(t[o])){const e=t[o];t[o]=null===(n=e.next)||void 0===n?void 0:n.bind(e),t[o+1]=null===(r=e.error)||void 0===r?void 0:r.bind(e),t[o+2]=null===(s=e.complete)||void 0===s?void 0:s.bind(e)}let c,u,l;if(e instanceof gm)u=am(e.firestore,Sm),l=Pc(e._key.path),c={next:n=>{t[o]&&t[o](Ky(u,e,n))},error:t[o+1],complete:t[o+2]};else{const n=am(e,pm);u=am(n.firestore,Sm),l=n._query;const r=new By(u);c={next:e=>{t[o]&&t[o](new Uy(u,r,n,e))},error:t[o+1],complete:t[o+2]},dy(e._query)}return function(e,t,n,r){const s=new Lg(r),i=new Bp(t,s,n);return e.asyncQueue.enqueueAndForget((async()=>Op(await Jg(e),i))),()=>{s.yu(),e.asyncQueue.enqueueAndForget((async()=>Pp(await Jg(e),i)))}}(km(u),l,a,c)},onSnapshotsInSync:function(e,t){return function(e,t){const n=new Lg(t);return e.asyncQueue.enqueueAndForget((async()=>{return t=await Jg(e),r=n,Ss(t).fa.add(r),void r.next();var t,r})),()=>{n.yu(),e.asyncQueue.enqueueAndForget((async()=>{return t=await Jg(e),r=n,void Ss(t).fa.delete(r);var t,r}))}}(km(e=am(e,Sm)),Tm(t)?t:{next:t})},or:function(...e){return e.forEach((e=>Ny("or",e))),vy._create("or",e)},orderBy:_y,persistentLocalCache:function(e){return new Qy(e)},persistentMultipleTabManager:function(){return new Zy},persistentSingleTabManager:ev,query:gy,queryEqual:wm,refEqual:function(e,t){return e=A(e),t=A(t),(e instanceof gm||e instanceof mm)&&(t instanceof gm||t instanceof mm)&&e.firestore===t.firestore&&e.path===t.path&&e.converter===t.converter},runTransaction:function(e,t,n){e=am(e,Sm);const r=Object.assign(Object.assign({},tv),n);return function(e){if(e.maxAttempts<1)throw new ks(Cs.INVALID_ARGUMENT,"Max attempts must be at least 1")}(r),function(e,t,n){const r=new As;return e.asyncQueue.enqueueAndForget((async()=>{const s=await Qg(e);new Fg(e.asyncQueue,s,n,t,r).Nu()})),r.promise}(km(e),(n=>t(new iv(e,n))),r)},serverTimestamp:function(){return new Hm("serverTimestamp")},setDoc:zy,setIndexConfiguration:
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){const n=km(e=am(e,Sm));return n._uninitializedComponentsProvider&&"memory"!==n._uninitializedComponentsProvider._offline.kind?function(e,t){return e.asyncQueue.enqueue((async()=>async function(e,t){const n=Ss(e),r=n.indexManager,s=[];return n.persistence.runTransaction("Configure indexes","readwrite",(e=>r.getFieldIndexes(e).next((n=>
/**
      * @license
      * Copyright 2017 Google LLC
      *
      * Licensed under the Apache License, Version 2.0 (the "License");
      * you may not use this file except in compliance with the License.
      * You may obtain a copy of the License at
      *
      *   http://www.apache.org/licenses/LICENSE-2.0
      *
      * Unless required by applicable law or agreed to in writing, software
      * distributed under the License is distributed on an "AS IS" BASIS,
      * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
      * See the License for the specific language governing permissions and
      * limitations under the License.
      */function(e,t,n,r,s){e=[...e],t=[...t],e.sort(n),t.sort(n);const i=e.length,o=t.length;let a=0,c=0;for(;a<o&&c<i;){const i=n(e[c],t[a]);i<0?s(e[c++]):i>0?r(t[a++]):(a++,c++)}for(;a<o;)r(t[a++]);for(;c<i;)s(e[c++])}(n,t,oi,(t=>{s.push(r.addFieldIndex(e,t))}),(t=>{s.push(r.deleteFieldIndex(e,t))})))).next((()=>yi.waitFor(s)))))}(await Kg(e),t)))}(n,function(e){const t="string"==typeof e?function(e){try{return JSON.parse(e)}catch(t){throw new ks(Cs.INVALID_ARGUMENT,"Failed to parse JSON: "+(null==t?void 0:t.message))}}(e):e,n=[];if(Array.isArray(t.indexes))for(const r of t.indexes){const e=ov(r,"collectionGroup"),t=[];if(Array.isArray(r.fields))for(const n of r.fields){const e=oy("setIndexConfiguration",ov(n,"fieldPath"));"CONTAINS"===n.arrayConfig?t.push(new ai(e,2)):"ASCENDING"===n.order?t.push(new ai(e,0)):"DESCENDING"===n.order&&t.push(new ai(e,1))}n.push(new ri(ri.UNKNOWN_ID,e,t,ui.empty()))}return n}(t)):(_s("Cannot enable indexes when persistence is disabled"),Promise.resolve())},setLogLevel:function(e){ms.setLogLevel(e)},snapshotEqual:function(e,t){return e instanceof Ly&&t instanceof Ly?e._firestore===t._firestore&&e._key.isEqual(t._key)&&(null===e._document?null===t._document:e._document.isEqual(t._document))&&e._converter===t._converter:e instanceof Uy&&t instanceof Uy&&e._firestore===t._firestore&&wm(e.query,t.query)&&e.metadata.isEqual(t.metadata)&&e._snapshot.isEqual(t._snapshot)},startAfter:function(...e){return Ty._create("startAfter",e,!1)},startAt:function(...e){return Ty._create("startAt",e,!0)},sum:function(e){return new Rm("sum",sy("sum",e))},terminate:function(e){return function(e,t,n=ve){Se(e,t).clearInstance(n)}(e.app,"firestore",e._databaseId.database),e._delete()},updateDoc:jy,vector:function(e){return new Mm(e)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */,waitForPendingWrites:function(e){return function(e){const t=new As;return e.asyncQueue.enqueueAndForget((async()=>async function(t,n){const r=Ss(t);sp(r.remoteStore)||vs(Wp,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const e=await function(e){const t=Ss(e);return t.persistence.runTransaction("Get highest unacknowledged batch id","readonly",(e=>t.mutationQueue.getHighestUnacknowledgedBatchId(e)))}(r.localStore);if(e===Oi)return void n.resolve();const t=r.cu.get(e)||[];t.push(n),r.cu.set(e,t)}catch(e){const r=Cp(e,"Initialization of waitForPendingWrites() operation failed");n.reject(r)}}(await Wg(e),t))),t.promise}(km(e=am(e,Sm)))},where:yy,writeBatch:function(e){return km(e=am(e,Sm)),new nv(e,(t=>Gy(e,t)))}},Symbol.toStringTag,{value:"Module"}));
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
De("firebase","11.7.1","app");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const fv="firebasestorage.googleapis.com",pv="storageBucket";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class gv extends v{constructor(e,t,n=0){super(_v(e),`Firebase Storage: ${t} (${_v(e)})`),this.status_=n,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,gv.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return _v(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}\n${this.customData.serverResponse}`:this.message=this._baseMessage}}var mv,yv,vv,wv;function _v(e){return"storage/"+e}function bv(){return new gv(mv.UNKNOWN,"An unknown error occurred, please check the error payload for server response.")}function Iv(){return new gv(mv.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function Tv(){return new gv(mv.CANCELED,"User canceled the upload/download.")}function Ev(){return new gv(mv.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function Sv(e){return new gv(mv.INVALID_ARGUMENT,e)}function Cv(){return new gv(mv.APP_DELETED,"The Firebase app was deleted.")}function kv(e){return new gv(mv.INVALID_ROOT_OPERATION,"The operation '"+e+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function Av(e,t){return new gv(mv.INVALID_FORMAT,"String does not match format '"+e+"': "+t)}function Nv(e){throw new gv(mv.INTERNAL_ERROR,"Internal error: "+e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(yv=mv||(mv={})).UNKNOWN="unknown",yv.OBJECT_NOT_FOUND="object-not-found",yv.BUCKET_NOT_FOUND="bucket-not-found",yv.PROJECT_NOT_FOUND="project-not-found",yv.QUOTA_EXCEEDED="quota-exceeded",yv.UNAUTHENTICATED="unauthenticated",yv.UNAUTHORIZED="unauthorized",yv.UNAUTHORIZED_APP="unauthorized-app",yv.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",yv.INVALID_CHECKSUM="invalid-checksum",yv.CANCELED="canceled",yv.INVALID_EVENT_NAME="invalid-event-name",yv.INVALID_URL="invalid-url",yv.INVALID_DEFAULT_BUCKET="invalid-default-bucket",yv.NO_DEFAULT_BUCKET="no-default-bucket",yv.CANNOT_SLICE_BLOB="cannot-slice-blob",yv.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",yv.NO_DOWNLOAD_URL="no-download-url",yv.INVALID_ARGUMENT="invalid-argument",yv.INVALID_ARGUMENT_COUNT="invalid-argument-count",yv.APP_DELETED="app-deleted",yv.INVALID_ROOT_OPERATION="invalid-root-operation",yv.INVALID_FORMAT="invalid-format",yv.INTERNAL_ERROR="internal-error",yv.UNSUPPORTED_ENVIRONMENT="unsupported-environment";class Rv{constructor(e,t){this.bucket=e,this.path_=t}get path(){return this.path_}get isRoot(){return 0===this.path.length}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,t){let n;try{n=Rv.makeFromUrl(e,t)}catch(s){return new Rv(e,"")}if(""===n.path)return n;throw r=e,new gv(mv.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+r+"'.");var r}static makeFromUrl(e,t){let n=null;const r="([A-Za-z0-9.\\-_]+)";const s=new RegExp("^gs://"+r+"(/(.*))?$","i");function i(e){e.path_=decodeURIComponent(e.path)}const o=t.replace(/[.]/g,"\\."),a=[{regex:s,indices:{bucket:1,path:3},postModify:function(e){"/"===e.path.charAt(e.path.length-1)&&(e.path_=e.path_.slice(0,-1))}},{regex:new RegExp(`^https?://${o}/v[A-Za-z0-9_]+/b/${r}/o(/([^?#]*).*)?$`,"i"),indices:{bucket:1,path:3},postModify:i},{regex:new RegExp(`^https?://${t===fv?"(?:storage.googleapis.com|storage.cloud.google.com)":t}/${r}/([^?#]*)`,"i"),indices:{bucket:1,path:2},postModify:i}];for(let c=0;c<a.length;c++){const t=a[c],r=t.regex.exec(e);if(r){const e=r[t.indices.bucket];let s=r[t.indices.path];s||(s=""),n=new Rv(e,s),t.postModify(n);break}}if(null==n)throw function(e){return new gv(mv.INVALID_URL,"Invalid URL '"+e+"'.")}(e);return n}}class xv{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dv(e){return"string"==typeof e||e instanceof String}function Ov(e){return Pv()&&e instanceof Blob}function Pv(){return"undefined"!=typeof Blob}function Lv(e,t,n,r){if(r<t)throw Sv(`Invalid value for '${e}'. Expected ${t} or greater.`);if(r>n)throw Sv(`Invalid value for '${e}'. Expected ${n} or less.`)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Mv(e,t,n){let r=t;return null==n&&(r=`https://${t}`),`${n}://${r}/v0${e}`}function Uv(e){const t=encodeURIComponent;let n="?";for(const r in e)if(e.hasOwnProperty(r)){n=n+(t(r)+"="+t(e[r]))+"&"}return n=n.slice(0,-1),n}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function Fv(e,t){const n=e>=500&&e<600,r=-1!==[408,429].indexOf(e),s=-1!==t.indexOf(e);return n||r||s}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(wv=vv||(vv={}))[wv.NO_ERROR=0]="NO_ERROR",wv[wv.NETWORK_ERROR=1]="NETWORK_ERROR",wv[wv.ABORT=2]="ABORT";class Vv{constructor(e,t,n,r,s,i,o,a,c,u,l,h=!0,d=!1){this.url_=e,this.method_=t,this.headers_=n,this.body_=r,this.successCodes_=s,this.additionalRetryCodes_=i,this.callback_=o,this.errorCallback_=a,this.timeout_=c,this.progressCallback_=u,this.connectionFactory_=l,this.retry=h,this.isUsingEmulator=d,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise(((e,t)=>{this.resolve_=e,this.reject_=t,this.start_()}))}start_(){const e=(e,t)=>{if(t)return void e(!1,new Bv(!1,null,!0));const n=this.connectionFactory_();this.pendingConnection_=n;const r=e=>{const t=e.loaded,n=e.lengthComputable?e.total:-1;null!==this.progressCallback_&&this.progressCallback_(t,n)};null!==this.progressCallback_&&n.addUploadProgressListener(r),n.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then((()=>{null!==this.progressCallback_&&n.removeUploadProgressListener(r),this.pendingConnection_=null;const t=n.getErrorCode()===vv.NO_ERROR,s=n.getStatus();if(!t||Fv(s,this.additionalRetryCodes_)&&this.retry){const t=n.getErrorCode()===vv.ABORT;return void e(!1,new Bv(!1,null,t))}const i=-1!==this.successCodes_.indexOf(s);e(!0,new Bv(i,n))}))},t=(e,t)=>{const n=this.resolve_,r=this.reject_,s=t.connection;if(t.wasSuccessCode)try{const e=this.callback_(s,s.getResponse());!
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e){return void 0!==e}(e)?n():n(e)}catch(i){r(i)}else if(null!==s){const e=bv();e.serverResponse=s.getErrorText(),this.errorCallback_?r(this.errorCallback_(s,e)):r(e)}else if(t.canceled){r(this.appDelete_?Cv():Tv())}else{r(Iv())}};this.canceled_?t(0,new Bv(!1,null,!0)):this.backoffId_=function(e,t,n){let r=1,s=null,i=null,o=!1,a=0;function c(){return 2===a}let u=!1;function l(...e){u||(u=!0,t.apply(null,e))}function h(t){s=setTimeout((()=>{s=null,e(f,c())}),t)}function d(){i&&clearTimeout(i)}function f(e,...t){if(u)return void d();if(e)return d(),void l.call(null,e,...t);if(c()||o)return d(),void l.call(null,e,...t);let n;r<64&&(r*=2),1===a?(a=2,n=0):n=1e3*(r+Math.random()),h(n)}let p=!1;function g(e){p||(p=!0,d(),u||(null!==s?(e||(a=2),clearTimeout(s),h(0)):e||(a=1)))}return h(0),i=setTimeout((()=>{o=!0,g(!0)}),n),g}(e,t,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,null!==this.backoffId_&&(0,this.backoffId_)(!1),null!==this.pendingConnection_&&this.pendingConnection_.abort()}}class Bv{constructor(e,t,n){this.wasSuccessCode=e,this.connection=t,this.canceled=!!n}}function qv(...e){const t="undefined"!=typeof BlobBuilder?BlobBuilder:"undefined"!=typeof WebKitBlobBuilder?WebKitBlobBuilder:void 0;if(void 0!==t){const n=new t;for(let t=0;t<e.length;t++)n.append(e[t]);return n.getBlob()}if(Pv())return new Blob(e);throw new gv(mv.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function zv(e){if("undefined"==typeof atob)throw t="base-64",new gv(mv.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`);var t;return atob(e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jv={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class $v{constructor(e,t){this.data=e,this.contentType=t||null}}function Gv(e,t){switch(e){case jv.RAW:return new $v(Kv(t));case jv.BASE64:case jv.BASE64URL:return new $v(Hv(e,t));case jv.DATA_URL:return new $v(function(e){const t=new Wv(e);return t.base64?Hv(jv.BASE64,t.rest):function(e){let t;try{t=decodeURIComponent(e)}catch(n){throw Av(jv.DATA_URL,"Malformed data URL.")}return Kv(t)}(t.rest)}(t),new Wv(t).contentType)}throw bv()}function Kv(e){const t=[];for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);if(r<=127)t.push(r);else if(r<=2047)t.push(192|r>>6,128|63&r);else if(55296==(64512&r)){if(n<e.length-1&&56320==(64512&e.charCodeAt(n+1))){r=65536|(1023&r)<<10|1023&e.charCodeAt(++n),t.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|63&r)}else t.push(239,191,189)}else 56320==(64512&r)?t.push(239,191,189):t.push(224|r>>12,128|r>>6&63,128|63&r)}return new Uint8Array(t)}function Hv(e,t){switch(e){case jv.BASE64:{const n=-1!==t.indexOf("-"),r=-1!==t.indexOf("_");if(n||r){throw Av(e,"Invalid character '"+(n?"-":"_")+"' found: is it base64url encoded?")}break}case jv.BASE64URL:{const n=-1!==t.indexOf("+"),r=-1!==t.indexOf("/");if(n||r){throw Av(e,"Invalid character '"+(n?"+":"/")+"' found: is it base64 encoded?")}t=t.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=zv(t)}catch(s){if(s.message.includes("polyfill"))throw s;throw Av(e,"Invalid character found")}const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}class Wv{constructor(e){this.base64=!1,this.contentType=null;const t=e.match(/^data:([^,]+)?,/);if(null===t)throw Av(jv.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const n=t[1]||null;null!=n&&(this.base64=function(e,t){if(!(e.length>=t.length))return!1;return e.substring(e.length-t.length)===t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(n,";base64"),this.contentType=this.base64?n.substring(0,n.length-7):n),this.rest=e.substring(e.indexOf(",")+1)}}class Qv{constructor(e,t){let n=0,r="";Ov(e)?(this.data_=e,n=e.size,r=e.type):e instanceof ArrayBuffer?(t?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),n=this.data_.length):e instanceof Uint8Array&&(t?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),n=e.length),this.size_=n,this.type_=r}size(){return this.size_}type(){return this.type_}slice(e,t){if(Ov(this.data_)){const i=this.data_,o=(r=e,s=t,(n=i).webkitSlice?n.webkitSlice(r,s):n.mozSlice?n.mozSlice(r,s):n.slice?n.slice(r,s):null);return null===o?null:new Qv(o)}{const n=new Uint8Array(this.data_.buffer,e,t-e);return new Qv(n,!0)}var n,r,s}static getBlob(...e){if(Pv()){const t=e.map((e=>e instanceof Qv?e.data_:e));return new Qv(qv.apply(null,t))}{const t=e.map((e=>Dv(e)?Gv(jv.RAW,e).data:e.data_));let n=0;t.forEach((e=>{n+=e.byteLength}));const r=new Uint8Array(n);let s=0;return t.forEach((e=>{for(let t=0;t<e.length;t++)r[s++]=e[t]})),new Qv(r,!0)}}uploadData(){return this.data_}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Jv(e){let t;try{t=JSON.parse(e)}catch(n){return null}return function(e){return"object"==typeof e&&!Array.isArray(e)}(t)?t:null}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yv(e){const t=e.lastIndexOf("/",e.length-2);return-1===t?e:e.slice(t+1)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xv(e,t){return t}class Zv{constructor(e,t,n,r){this.server=e,this.local=t||e,this.writable=!!n,this.xform=r||Xv}}let ew=null;function tw(){if(ew)return ew;const e=[];e.push(new Zv("bucket")),e.push(new Zv("generation")),e.push(new Zv("metageneration")),e.push(new Zv("name","fullPath",!0));const t=new Zv("name");t.xform=function(e,t){return function(e){return!Dv(e)||e.length<2?e:Yv(e)}(t)},e.push(t);const n=new Zv("size");return n.xform=function(e,t){return void 0!==t?Number(t):t},e.push(n),e.push(new Zv("timeCreated")),e.push(new Zv("updated")),e.push(new Zv("md5Hash",null,!0)),e.push(new Zv("cacheControl",null,!0)),e.push(new Zv("contentDisposition",null,!0)),e.push(new Zv("contentEncoding",null,!0)),e.push(new Zv("contentLanguage",null,!0)),e.push(new Zv("contentType",null,!0)),e.push(new Zv("metadata","customMetadata",!0)),ew=e,ew}function nw(e,t,n){const r={type:"file"},s=n.length;for(let i=0;i<s;i++){const e=n[i];r[e.local]=e.xform(r,t[e.server])}return function(e,t){Object.defineProperty(e,"ref",{get:function(){const n=e.bucket,r=e.fullPath,s=new Rv(n,r);return t._makeStorageReference(s)}})}(r,e),r}function rw(e,t,n){const r=Jv(t);if(null===r)return null;return nw(e,r,n)}function sw(e,t){const n={},r=t.length;for(let s=0;s<r;s++){const r=t[s];r.writable&&(n[r.server]=e[r.local])}return JSON.stringify(n)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iw="prefixes",ow="items";function aw(e,t,n){const r=Jv(n);if(null===r)return null;return function(e,t,n){const r={prefixes:[],items:[],nextPageToken:n.nextPageToken};if(n[iw])for(const s of n[iw]){const n=s.replace(/\/$/,""),i=e._makeStorageReference(new Rv(t,n));r.prefixes.push(i)}if(n[ow])for(const s of n[ow]){const n=e._makeStorageReference(new Rv(t,s.name));r.items.push(n)}return r}(e,t,r)}class cw{constructor(e,t,n,r){this.url=e,this.method=t,this.handler=n,this.timeout=r,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uw(e){if(!e)throw bv()}function lw(e,t){return function(n,r){const s=rw(e,r,t);return uw(null!==s),s}}function hw(e,t){return function(n,r){const s=rw(e,r,t);return uw(null!==s),function(e,t,n,r){const s=Jv(t);if(null===s)return null;if(!Dv(s.downloadTokens))return null;const i=s.downloadTokens;if(0===i.length)return null;const o=encodeURIComponent;return i.split(",").map((t=>{const s=e.bucket,i=e.fullPath;return Mv("/b/"+o(s)+"/o/"+o(i),n,r)+Uv({alt:"media",token:t})}))[0]}(s,r,e.host,e._protocol)}}function dw(e){return function(t,n){let r;var s,i;return 401===t.getStatus()?r=t.getErrorText().includes("Firebase App Check token is invalid")?new gv(mv.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project."):new gv(mv.UNAUTHENTICATED,"User is not authenticated, please authenticate using Firebase Authentication and try again."):402===t.getStatus()?(i=e.bucket,r=new gv(mv.QUOTA_EXCEEDED,"Quota for bucket '"+i+"' exceeded, please view quota on https://firebase.google.com/pricing/.")):403===t.getStatus()?(s=e.path,r=new gv(mv.UNAUTHORIZED,"User does not have permission to access '"+s+"'.")):r=n,r.status=t.getStatus(),r.serverResponse=n.serverResponse,r}}function fw(e){const t=dw(e);return function(n,r){let s=t(n,r);var i;return 404===n.getStatus()&&(i=e.path,s=new gv(mv.OBJECT_NOT_FOUND,"Object '"+i+"' does not exist.")),s.serverResponse=r.serverResponse,s}}function pw(e,t,n){const r=Mv(t.fullServerUrl(),e.host,e._protocol),s=e.maxOperationRetryTime,i=new cw(r,"GET",lw(e,n),s);return i.errorHandler=fw(t),i}function gw(e,t,n,r,s){const i={};t.isRoot?i.prefix="":i.prefix=t.path+"/",n&&n.length>0&&(i.delimiter=n),r&&(i.pageToken=r),s&&(i.maxResults=s);const o=Mv(t.bucketOnlyServerUrl(),e.host,e._protocol),a=e.maxOperationRetryTime,c=new cw(o,"GET",function(e,t){return function(n,r){const s=aw(e,t,r);return uw(null!==s),s}}(e,t.bucket),a);return c.urlParams=i,c.errorHandler=dw(t),c}function mw(e,t,n){const r=Mv(t.fullServerUrl(),e.host,e._protocol)+"?alt=media",s=e.maxOperationRetryTime,i=new cw(r,"GET",((e,t)=>t),s);return i.errorHandler=fw(t),void 0!==n&&(i.headers.Range=`bytes=0-${n}`,i.successCodes=[200,206]),i}function yw(e,t,n){const r=Object.assign({},n);return r.fullPath=e.path,r.size=t.size(),r.contentType||(r.contentType=function(e,t){return e&&e.contentType||t&&t.type()||"application/octet-stream"}(null,t)),r}function vw(e,t,n,r,s){const i=t.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};const a=function(){let e="";for(let t=0;t<2;t++)e+=Math.random().toString().slice(2);return e}();o["Content-Type"]="multipart/related; boundary="+a;const c=yw(t,r,s),u="--"+a+"\r\nContent-Type: application/json; charset=utf-8\r\n\r\n"+sw(c,n)+"\r\n--"+a+"\r\nContent-Type: "+c.contentType+"\r\n\r\n",l="\r\n--"+a+"--",h=Qv.getBlob(u,r,l);if(null===h)throw Ev();const d={name:c.fullPath},f=Mv(i,e.host,e._protocol),p=e.maxUploadRetryTime,g=new cw(f,"POST",lw(e,n),p);return g.urlParams=d,g.headers=o,g.body=h.uploadData(),g.errorHandler=dw(t),g}class ww{constructor(e,t,n,r){this.current=e,this.total=t,this.finalized=!!n,this.metadata=r||null}}function _w(e,t){let n=null;try{n=e.getResponseHeader("X-Goog-Upload-Status")}catch(r){uw(!1)}return uw(!!n&&-1!==(t||["active"]).indexOf(n)),n}const bw=262144;function Iw(e,t,n,r,s,i,o,a){const c=new ww(0,0);if(o?(c.current=o.current,c.total=o.total):(c.current=0,c.total=r.size()),r.size()!==c.total)throw new gv(mv.SERVER_FILE_WRONG_SIZE,"Server recorded incorrect upload file size, please retry the upload.");const u=c.total-c.current;let l=u;s>0&&(l=Math.min(l,s));const h=c.current,d=h+l;let f="";f=0===l?"finalize":u===l?"upload, finalize":"upload";const p={"X-Goog-Upload-Command":f,"X-Goog-Upload-Offset":`${c.current}`},g=r.slice(h,d);if(null===g)throw Ev();const m=t.maxUploadRetryTime,y=new cw(n,"POST",(function(e,n){const s=_w(e,["active","final"]),o=c.current+l,a=r.size();let u;return u="final"===s?lw(t,i)(e,n):null,new ww(o,a,"final"===s,u)}),m);return y.headers=p,y.body=g.uploadData(),y.progressCallback=a||null,y.errorHandler=dw(e),y}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tw={RUNNING:"running",PAUSED:"paused",SUCCESS:"success",CANCELED:"canceled",ERROR:"error"};function Ew(e){switch(e){case"running":case"pausing":case"canceling":return Tw.RUNNING;case"paused":return Tw.PAUSED;case"success":return Tw.SUCCESS;case"canceled":return Tw.CANCELED;default:return Tw.ERROR}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sw{constructor(e,t,n){const r=function(e){return"function"==typeof e}(e)||null!=t||null!=n;if(r)this.next=e,this.error=null!=t?t:void 0,this.complete=null!=n?n:void 0;else{const t=e;this.next=t.next,this.error=t.error,this.complete=t.complete}}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cw(e){return(...t)=>{Promise.resolve().then((()=>e(...t)))}}class kw{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=vv.NO_ERROR,this.sendPromise_=new Promise((e=>{this.xhr_.addEventListener("abort",(()=>{this.errorCode_=vv.ABORT,e()})),this.xhr_.addEventListener("error",(()=>{this.errorCode_=vv.NETWORK_ERROR,e()})),this.xhr_.addEventListener("load",(()=>{e()}))}))}send(e,t,n,r,s){if(this.sent_)throw Nv("cannot .send() more than once");if(N(e)&&n&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(t,e,!0),void 0!==s)for(const i in s)s.hasOwnProperty(i)&&this.xhr_.setRequestHeader(i,s[i].toString());return void 0!==r?this.xhr_.send(r):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Nv("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Nv("cannot .getStatus() before sending");try{return this.xhr_.status}catch(e){return-1}}getResponse(){if(!this.sent_)throw Nv("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Nv("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){null!=this.xhr_.upload&&this.xhr_.upload.removeEventListener("progress",e)}}class Aw extends kw{initXhr(){this.xhr_.responseType="text"}}function Nw(){return new Aw}class Rw extends kw{initXhr(){this.xhr_.responseType="arraybuffer"}}function xw(){return new Rw}class Dw extends kw{initXhr(){this.xhr_.responseType="blob"}}function Ow(){return new Dw}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pw{isExponentialBackoffExpired(){return this.sleepTime>this.maxSleepTime}constructor(e,t,n=null){this._transferred=0,this._needToFetchStatus=!1,this._needToFetchMetadata=!1,this._observers=[],this._error=void 0,this._uploadUrl=void 0,this._request=void 0,this._chunkMultiplier=1,this._resolve=void 0,this._reject=void 0,this._ref=e,this._blob=t,this._metadata=n,this._mappings=tw(),this._resumable=this._shouldDoResumable(this._blob),this._state="running",this._errorHandler=e=>{if(this._request=void 0,this._chunkMultiplier=1,e._codeEquals(mv.CANCELED))this._needToFetchStatus=!0,this.completeTransitions_();else{const t=this.isExponentialBackoffExpired();if(Fv(e.status,[])){if(!t)return this.sleepTime=Math.max(2*this.sleepTime,1e3),this._needToFetchStatus=!0,void this.completeTransitions_();e=Iv()}this._error=e,this._transition("error")}},this._metadataErrorHandler=e=>{this._request=void 0,e._codeEquals(mv.CANCELED)?this.completeTransitions_():(this._error=e,this._transition("error"))},this.sleepTime=0,this.maxSleepTime=this._ref.storage.maxUploadRetryTime,this._promise=new Promise(((e,t)=>{this._resolve=e,this._reject=t,this._start()})),this._promise.then(null,(()=>{}))}_makeProgressCallback(){const e=this._transferred;return t=>this._updateProgress(e+t)}_shouldDoResumable(e){return e.size()>262144}_start(){"running"===this._state&&void 0===this._request&&(this._resumable?void 0===this._uploadUrl?this._createResumable():this._needToFetchStatus?this._fetchStatus():this._needToFetchMetadata?this._fetchMetadata():this.pendingTimeout=setTimeout((()=>{this.pendingTimeout=void 0,this._continueUpload()}),this.sleepTime):this._oneShotUpload())}_resolveToken(e){Promise.all([this._ref.storage._getAuthToken(),this._ref.storage._getAppCheckToken()]).then((([t,n])=>{switch(this._state){case"running":e(t,n);break;case"canceling":this._transition("canceled");break;case"pausing":this._transition("paused")}}))}_createResumable(){this._resolveToken(((e,t)=>{const n=function(e,t,n,r,s){const i=t.bucketOnlyServerUrl(),o=yw(t,r,s),a={name:o.fullPath},c=Mv(i,e.host,e._protocol),u={"X-Goog-Upload-Protocol":"resumable","X-Goog-Upload-Command":"start","X-Goog-Upload-Header-Content-Length":`${r.size()}`,"X-Goog-Upload-Header-Content-Type":o.contentType,"Content-Type":"application/json; charset=utf-8"},l=sw(o,n),h=e.maxUploadRetryTime,d=new cw(c,"POST",(function(e){let t;_w(e);try{t=e.getResponseHeader("X-Goog-Upload-URL")}catch(n){uw(!1)}return uw(Dv(t)),t}),h);return d.urlParams=a,d.headers=u,d.body=l,d.errorHandler=dw(t),d}(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(n,Nw,e,t);this._request=r,r.getPromise().then((e=>{this._request=void 0,this._uploadUrl=e,this._needToFetchStatus=!1,this.completeTransitions_()}),this._errorHandler)}))}_fetchStatus(){const e=this._uploadUrl;this._resolveToken(((t,n)=>{const r=function(e,t,n,r){const s=e.maxUploadRetryTime,i=new cw(n,"POST",(function(e){const t=_w(e,["active","final"]);let n=null;try{n=e.getResponseHeader("X-Goog-Upload-Size-Received")}catch(i){uw(!1)}n||uw(!1);const s=Number(n);return uw(!isNaN(s)),new ww(s,r.size(),"final"===t)}),s);return i.headers={"X-Goog-Upload-Command":"query"},i.errorHandler=dw(t),i}(this._ref.storage,this._ref._location,e,this._blob),s=this._ref.storage._makeRequest(r,Nw,t,n);this._request=s,s.getPromise().then((e=>{this._request=void 0,this._updateProgress(e.current),this._needToFetchStatus=!1,e.finalized&&(this._needToFetchMetadata=!0),this.completeTransitions_()}),this._errorHandler)}))}_continueUpload(){const e=bw*this._chunkMultiplier,t=new ww(this._transferred,this._blob.size()),n=this._uploadUrl;this._resolveToken(((r,s)=>{let i;try{i=Iw(this._ref._location,this._ref.storage,n,this._blob,e,this._mappings,t,this._makeProgressCallback())}catch(a){return this._error=a,void this._transition("error")}const o=this._ref.storage._makeRequest(i,Nw,r,s,!1);this._request=o,o.getPromise().then((e=>{this._increaseMultiplier(),this._request=void 0,this._updateProgress(e.current),e.finalized?(this._metadata=e.metadata,this._transition("success")):this.completeTransitions_()}),this._errorHandler)}))}_increaseMultiplier(){2*(bw*this._chunkMultiplier)<33554432&&(this._chunkMultiplier*=2)}_fetchMetadata(){this._resolveToken(((e,t)=>{const n=pw(this._ref.storage,this._ref._location,this._mappings),r=this._ref.storage._makeRequest(n,Nw,e,t);this._request=r,r.getPromise().then((e=>{this._request=void 0,this._metadata=e,this._transition("success")}),this._metadataErrorHandler)}))}_oneShotUpload(){this._resolveToken(((e,t)=>{const n=vw(this._ref.storage,this._ref._location,this._mappings,this._blob,this._metadata),r=this._ref.storage._makeRequest(n,Nw,e,t);this._request=r,r.getPromise().then((e=>{this._request=void 0,this._metadata=e,this._updateProgress(this._blob.size()),this._transition("success")}),this._errorHandler)}))}_updateProgress(e){const t=this._transferred;this._transferred=e,this._transferred!==t&&this._notifyObservers()}_transition(e){if(this._state!==e)switch(e){case"canceling":case"pausing":this._state=e,void 0!==this._request?this._request.cancel():this.pendingTimeout&&(clearTimeout(this.pendingTimeout),this.pendingTimeout=void 0,this.completeTransitions_());break;case"running":const t="paused"===this._state;this._state=e,t&&(this._notifyObservers(),this._start());break;case"paused":case"error":case"success":this._state=e,this._notifyObservers();break;case"canceled":this._error=Tv(),this._state=e,this._notifyObservers()}}completeTransitions_(){switch(this._state){case"pausing":this._transition("paused");break;case"canceling":this._transition("canceled");break;case"running":this._start()}}get snapshot(){const e=Ew(this._state);return{bytesTransferred:this._transferred,totalBytes:this._blob.size(),state:e,metadata:this._metadata,task:this,ref:this._ref}}on(e,t,n,r){const s=new Sw(t||void 0,n||void 0,r||void 0);return this._addObserver(s),()=>{this._removeObserver(s)}}then(e,t){return this._promise.then(e,t)}catch(e){return this.then(null,e)}_addObserver(e){this._observers.push(e),this._notifyObserver(e)}_removeObserver(e){const t=this._observers.indexOf(e);-1!==t&&this._observers.splice(t,1)}_notifyObservers(){this._finishPromise();this._observers.slice().forEach((e=>{this._notifyObserver(e)}))}_finishPromise(){if(void 0!==this._resolve){let e=!0;switch(Ew(this._state)){case Tw.SUCCESS:Cw(this._resolve.bind(null,this.snapshot))();break;case Tw.CANCELED:case Tw.ERROR:Cw(this._reject.bind(null,this._error))();break;default:e=!1}e&&(this._resolve=void 0,this._reject=void 0)}}_notifyObserver(e){switch(Ew(this._state)){case Tw.RUNNING:case Tw.PAUSED:e.next&&Cw(e.next.bind(e,this.snapshot))();break;case Tw.SUCCESS:e.complete&&Cw(e.complete.bind(e))();break;default:e.error&&Cw(e.error.bind(e,this._error))()}}resume(){const e="paused"===this._state||"pausing"===this._state;return e&&this._transition("running"),e}pause(){const e="running"===this._state;return e&&this._transition("pausing"),e}cancel(){const e="running"===this._state||"pausing"===this._state;return e&&this._transition("canceling"),e}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lw{constructor(e,t){this._service=e,this._location=t instanceof Rv?t:Rv.makeFromUrl(t,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,t){return new Lw(e,t)}get root(){const e=new Rv(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return Yv(this._location.path)}get storage(){return this._service}get parent(){const e=function(e){if(0===e.length)return null;const t=e.lastIndexOf("/");return-1===t?"":e.slice(0,t)}(this._location.path);if(null===e)return null;const t=new Rv(this._location.bucket,e);return new Lw(this._service,t)}_throwIfRoot(e){if(""===this._location.path)throw kv(e)}}function Mw(e,t,n){e._throwIfRoot("uploadBytes");const r=vw(e.storage,e._location,tw(),new Qv(t,!0),n);return e.storage.makeRequestWithTokens(r,Nw).then((t=>({metadata:t,ref:e})))}function Uw(e){const t={prefixes:[],items:[]};return Fw(e,t).then((()=>t))}async function Fw(e,t,n){const r={pageToken:n},s=await Vw(e,r);t.prefixes.push(...s.prefixes),t.items.push(...s.items),null!=s.nextPageToken&&await Fw(e,t,s.nextPageToken)}function Vw(e,t){null!=t&&"number"==typeof t.maxResults&&Lv("options.maxResults",1,1e3,t.maxResults);const n=t||{},r=gw(e.storage,e._location,"/",n.pageToken,n.maxResults);return e.storage.makeRequestWithTokens(r,Nw)}function Bw(e,t){e._throwIfRoot("updateMetadata");const n=function(e,t,n,r){const s=Mv(t.fullServerUrl(),e.host,e._protocol),i=sw(n,r),o=e.maxOperationRetryTime,a=new cw(s,"PATCH",lw(e,r),o);return a.headers={"Content-Type":"application/json; charset=utf-8"},a.body=i,a.errorHandler=fw(t),a}(e.storage,e._location,t,tw());return e.storage.makeRequestWithTokens(n,Nw)}function qw(e){e._throwIfRoot("getDownloadURL");const t=function(e,t,n){const r=Mv(t.fullServerUrl(),e.host,e._protocol),s=e.maxOperationRetryTime,i=new cw(r,"GET",hw(e,n),s);return i.errorHandler=fw(t),i}(e.storage,e._location,tw());return e.storage.makeRequestWithTokens(t,Nw).then((e=>{if(null===e)throw new gv(mv.NO_DOWNLOAD_URL,"The given file does not have any download URLs.");return e}))}function zw(e){e._throwIfRoot("deleteObject");const t=function(e,t){const n=Mv(t.fullServerUrl(),e.host,e._protocol),r=e.maxOperationRetryTime,s=new cw(n,"DELETE",(function(e,t){}),r);return s.successCodes=[200,204],s.errorHandler=fw(t),s}(e.storage,e._location);return e.storage.makeRequestWithTokens(t,Nw)}function jw(e,t){const n=function(e,t){const n=t.split("/").filter((e=>e.length>0)).join("/");return 0===e.length?n:e+"/"+n}(e._location.path,t),r=new Rv(e._location.bucket,n);return new Lw(e.storage,r)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $w(e,t){if(e instanceof Hw){const n=e;if(null==n._bucket)throw new gv(mv.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+pv+"' property when initializing the app?");const r=new Lw(n,n._bucket);return null!=t?$w(r,t):r}return void 0!==t?jw(e,t):e}function Gw(e,t){if(t&&/^[A-Za-z]+:\/\//.test(t)){if(e instanceof Hw)return new Lw(e,t);throw Sv("To use ref(service, url), the first argument must be a Storage instance.")}return $w(e,t)}function Kw(e,t){const n=null==t?void 0:t[pv];return null==n?null:Rv.makeFromBucketSpec(n,e)}class Hw{constructor(e,t,n,r,s,i=!1){this.app=e,this._authProvider=t,this._appCheckProvider=n,this._url=r,this._firebaseVersion=s,this._isUsingEmulator=i,this._bucket=null,this._host=fv,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=12e4,this._maxUploadRetryTime=6e5,this._requests=new Set,this._bucket=null!=r?Rv.makeFromBucketSpec(r,this._host):Kw(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,null!=this._url?this._bucket=Rv.makeFromBucketSpec(this._url,e):this._bucket=Kw(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){Lv("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){Lv("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const t=await e.getToken();if(null!==t)return t.accessToken}return null}async _getAppCheckToken(){if(Ce(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});if(e){return(await e.getToken()).token}return null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach((e=>e.cancel())),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new Lw(this,e)}_makeRequest(e,t,n,r,s=!0){if(this._deleted)return new xv(Cv());{const i=function(e,t,n,r,s,i,o=!0,a=!1){const c=Uv(e.urlParams),u=e.url+c,l=Object.assign({},e.headers);return function(e,t){t&&(e["X-Firebase-GMPID"]=t)}(l,t),function(e,t){null!==t&&t.length>0&&(e.Authorization="Firebase "+t)}(l,n),function(e,t){e["X-Firebase-Storage-Version"]="webjs/"+(null!=t?t:"AppManager")}(l,i),function(e,t){null!==t&&(e["X-Firebase-AppCheck"]=t)}(l,r),new Vv(u,e.method,l,e.body,e.successCodes,e.additionalRetryCodes,e.handler,e.errorHandler,e.timeout,e.progressCallback,s,o,a)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(e,this._appId,n,r,t,this._firebaseVersion,s,this._isUsingEmulator);return this._requests.add(i),i.getPromise().then((()=>this._requests.delete(i)),(()=>this._requests.delete(i))),i}}async makeRequestWithTokens(e,t){const[n,r]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,t,n,r).getPromise()}}const Ww="@firebase/storage",Qw="0.13.8",Jw="storage";function Yw(e,t,n){return function(e,t,n){return e._throwIfRoot("uploadBytesResumable"),new Pw(e,new Qv(t),n)}(e=A(e),t,n)}function Xw(e){return qw(e=A(e))}function Zw(e,t){return Gw(e=A(e),t)}function e_(e=xe(),t){const n=Se(e=A(e),Jw).getImmediate({identifier:t}),r=l("storage");return r&&t_(n,...r),n}function t_(e,t,n,r={}){!function(e,t,n,r={}){e.host=`${t}:${n}`;const s=N(t);s&&R(`https://${e.host}`),e._isUsingEmulator=!0,e._protocol=s?"https":"http";const{mockUserToken:i}=r;i&&(e._overrideAuthToken="string"==typeof i?i:p(i,e.app.options.projectId))}(e,t,n,r)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function n_(e,{instanceIdentifier:t}){const n=e.getProvider("app").getImmediate(),r=e.getProvider("auth-internal"),s=e.getProvider("app-check-internal");return new Hw(n,r,s,t,Ne)}Ee(new x(Jw,n_,"PUBLIC").setMultipleInstances(!0)),De(Ww,Qw,""),De(Ww,Qw,"esm2017");const r_=Object.freeze(Object.defineProperty({__proto__:null,StorageError:gv,get StorageErrorCode(){return mv},StringFormat:jv,_FbsBlob:Qv,_Location:Rv,_TaskEvent:{STATE_CHANGED:"state_changed"},_TaskState:Tw,_UploadTask:Pw,_dataFromString:Gv,_getChild:function(e,t){return jw(e,t)},_invalidArgument:Sv,_invalidRootOperation:kv,connectStorageEmulator:t_,deleteObject:function(e){return zw(e=A(e))},getBlob:function(e,t){return function(e,t){e._throwIfRoot("getBlob");const n=mw(e.storage,e._location,t);return e.storage.makeRequestWithTokens(n,Ow).then((e=>void 0!==t?e.slice(0,t):e))}(e=A(e),t)},getBytes:
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(e,t){return function(e,t){e._throwIfRoot("getBytes");const n=mw(e.storage,e._location,t);return e.storage.makeRequestWithTokens(n,xw).then((e=>void 0!==t?e.slice(0,t):e))}(e=A(e),t)},getDownloadURL:Xw,getMetadata:function(e){return function(e){e._throwIfRoot("getMetadata");const t=pw(e.storage,e._location,tw());return e.storage.makeRequestWithTokens(t,Nw)}(e=A(e))},getStorage:e_,getStream:function(e,t){throw new Error("getStream() is only supported by NodeJS builds")},list:function(e,t){return Vw(e=A(e),t)},listAll:function(e){return Uw(e=A(e))},ref:Zw,updateMetadata:function(e,t){return Bw(e=A(e),t)},uploadBytes:function(e,t,n){return Mw(e=A(e),t,n)},uploadBytesResumable:Yw,uploadString:function(e,t,n,r){return function(e,t,n=jv.RAW,r){e._throwIfRoot("uploadString");const s=Gv(n,t),i=Object.assign({},r);return null==i.contentType&&null!=s.contentType&&(i.contentType=s.contentType),Mw(e,s.data,i)}(e=A(e),t,n,r)}},Symbol.toStringTag,{value:"Module"}));export{Cn as G,Ws as T,Cm as a,e_ as b,zy as c,vm as d,Un as e,Mn as f,Xr as g,Bn as h,Re as i,Vy as j,$y as k,jy as l,Yw as m,Xw as n,Vn as o,ym as p,qy as q,Zw as r,gr as s,gy as t,Fn as u,_y as v,yy as w,Iy as x,dv as y,r_ as z};
//# sourceMappingURL=firebase-vendor-57fca5f4.js.map
