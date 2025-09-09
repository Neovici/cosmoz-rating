import{B as G,b as F,x as b}from"./iframe-BVfpRjXL.js";let E,H=0;function j(t){E=t}function D(){E=null,H=0}function J(){return H++}const $=Symbol("haunted.phase"),x=Symbol("haunted.hook"),A=Symbol("haunted.update"),I=Symbol("haunted.commit"),p=Symbol("haunted.effects"),g=Symbol("haunted.layoutEffects"),L="haunted.context";class K{update;host;virtual;[x];[p];[g];constructor(e,s){this.update=e,this.host=s,this[x]=new Map,this[p]=[],this[g]=[]}run(e){j(this);let s=e();return D(),s}_runEffects(e){let s=this[e];j(this);for(let r of s)r.call(this);D()}runEffects(){this._runEffects(p)}runLayoutEffects(){this._runEffects(g)}teardown(){this[x].forEach(s=>{typeof s.teardown=="function"&&s.teardown(!0)})}}const W=Promise.resolve().then.bind(Promise.resolve());function N(){let t=[],e;function s(){e=null;let r=t;t=[];for(var n=0,c=r.length;n<c;n++)r[n]()}return function(r){t.push(r),e==null&&(e=W(s))}}const X=N(),T=N();class Y{renderer;host;state;[$];_updateQueued;_active;constructor(e,s){this.renderer=e,this.host=s,this.state=new K(this.update.bind(this),s),this[$]=null,this._updateQueued=!1,this._active=!0}update(){this._active&&(this._updateQueued||(X(()=>{let e=this.handlePhase(A);T(()=>{this.handlePhase(I,e),T(()=>{this.handlePhase(p)})}),this._updateQueued=!1}),this._updateQueued=!0))}handlePhase(e,s){switch(this[$]=e,e){case I:this.commit(s),this.runEffects(g);return;case A:return this.render();case p:return this.runEffects(p)}}render(){return this.state.run(()=>this.renderer.call(this.host,this.host))}runEffects(e){this.state._runEffects(e)}teardown(){this.state.teardown()}pause(){this._active=!1}resume(){this._active=!0}}const V=(...t)=>{const e=new CSSStyleSheet;return e.replaceSync(t.join("")),e},tt=t=>t?.map(e=>typeof e=="string"?V(e):e),et=(t,...e)=>t.flatMap((s,r)=>[s,e[r]||""]).join(""),st=et,rt=(t="")=>t.replace(/-+([a-z])?/g,(e,s)=>s?s.toUpperCase():"");function nt(t){class e extends Y{frag;renderResult;constructor(n,c,h){super(n,h||c),this.frag=c}commit(n){this.renderResult=t(n,this.frag)}}function s(r,n,c){const h=(c||n||{}).baseElement||HTMLElement,{observedAttributes:v=[],useShadowDOM:R=!0,shadowRootInit:z={},styleSheets:k}=c||n||{},y=tt(r.styleSheets||k);class P extends h{_scheduler;static get observedAttributes(){return r.observedAttributes||v||[]}constructor(){if(super(),R===!1)this._scheduler=new e(r,this);else{const o=this.attachShadow({mode:"open",...z});y&&(o.adoptedStyleSheets=y),this._scheduler=new e(r,o,this)}}connectedCallback(){this._scheduler.resume(),this._scheduler.update(),this._scheduler.renderResult?.setConnected(!0)}disconnectedCallback(){this._scheduler.pause(),this._scheduler.teardown(),this._scheduler.renderResult?.setConnected(!1)}attributeChangedCallback(o,l,u){if(l===u)return;let i=u===""?!0:u;Reflect.set(this,rt(o),i)}}function O(a){let o=a,l=!1;return Object.freeze({enumerable:!0,configurable:!0,get(){return o},set(u){l&&o===u||(l=!0,o=u,this._scheduler&&this._scheduler.update())}})}const d=new Proxy(h.prototype,{getPrototypeOf(a){return a},set(a,o,l,u){let i;return o in a?(i=Object.getOwnPropertyDescriptor(a,o),i&&i.set?(i.set.call(u,l),!0):(Reflect.set(a,o,l,u),!0)):(typeof o=="symbol"||o[0]==="_"?i={enumerable:!0,configurable:!0,writable:!0,value:l}:i=O(l),Object.defineProperty(u,o,i),i.set&&i.set.call(u,l),!0)}});return Object.setPrototypeOf(P.prototype,d),P}return s}class f{id;state;constructor(e,s){this.id=e,this.state=s}}function at(t,...e){let s=J(),r=E[x],n=r.get(s);return n||(n=new t(s,E,...e),r.set(s,n)),n.update(...e)}function m(t){return at.bind(null,t)}function B(t){return m(class extends f{callback;lastValues;values;_teardown;constructor(e,s,r,n){super(e,s),t(s,this)}update(e,s){this.callback=e,this.values=s}call(){const e=!this.values||this.hasChanged();this.lastValues=this.values,e&&this.run()}run(){this.teardown(),this._teardown=this.callback.call(this.state)}teardown(e){typeof this._teardown=="function"&&(this._teardown(),this._teardown=void 0),e&&(this.lastValues=this.values=void 0)}hasChanged(){return!this.lastValues||this.values.some((e,s)=>this.lastValues[s]!==e)}})}function Q(t,e){t[p].push(e)}const ot=B(Q),it=t=>t instanceof Element?t:t.startNode||t.endNode||t.parentNode,ct=m(class extends f{Context;value;_ranEffect;_unsubscribe;constructor(t,e,s){super(t,e),this._updater=this._updater.bind(this),this._ranEffect=!1,this._unsubscribe=null,Q(e,this)}update(t){return this.Context!==t&&(this._subscribe(t),this.Context=t),this.value}call(){this._ranEffect||(this._ranEffect=!0,this._unsubscribe&&this._unsubscribe(),this._subscribe(this.Context),this.state.update())}_updater(t){this.value=t,this.state.update()}_subscribe(t){const e={Context:t,callback:this._updater};it(this.state.host).dispatchEvent(new CustomEvent(L,{detail:e,bubbles:!0,cancelable:!0,composed:!0}));const{unsubscribe:r=null,value:n}=e;this.value=r?n:t.defaultValue,this._unsubscribe=r}teardown(){this._unsubscribe&&this._unsubscribe()}});function ut(t){return e=>{const s={Provider:class extends HTMLElement{listeners;_value;constructor(){super(),this.style.display="contents",this.listeners=new Set,this.addEventListener(L,this)}disconnectedCallback(){this.removeEventListener(L,this)}handleEvent(r){const{detail:n}=r;n.Context===s&&(n.value=this.value,n.unsubscribe=this.unsubscribe.bind(this,n.callback),this.listeners.add(n.callback),r.stopPropagation())}unsubscribe(r){this.listeners.delete(r)}set value(r){this._value=r;for(let n of this.listeners)n(r)}get value(){return this._value}},Consumer:t(function({render:r}){const n=ct(s);return r(n)},{useShadowDOM:!1}),defaultValue:e};return s}}m(class extends f{value;values;constructor(t,e,s,r){super(t,e),this.value=s(),this.values=r}update(t,e){return this.hasChanged(e)&&(this.values=e,this.value=t()),this.value}hasChanged(t=[]){return t.some((e,s)=>this.values[s]!==e)}});function lt(t,e){t[g].push(e)}B(lt);const U=m(class extends f{args;constructor(t,e,s){super(t,e),this.updater=this.updater.bind(this),typeof s=="function"&&(s=s()),this.makeArgs(s)}update(){return this.args}updater(t){const[e]=this.args;typeof t=="function"&&(t=t(e)),!Object.is(e,t)&&(this.makeArgs(t),this.state.update())}makeArgs(t){this.args=Object.freeze([t,this.updater])}});m(class extends f{reducer;currentState;constructor(t,e,s,r,n){super(t,e),this.dispatch=this.dispatch.bind(this),this.currentState=n!==void 0?n(r):r}update(t){return this.reducer=t,[this.currentState,this.dispatch]}dispatch(t){this.currentState=this.reducer(this.currentState,t),this.state.update()}});const ht=/([A-Z])/gu;m(class extends f{property;eventName;constructor(t,e,s,r){if(super(t,e),this.state.virtual)throw new Error("Can't be used with virtual components.");this.updater=this.updater.bind(this),this.property=s,this.eventName=s.replace(ht,"-$1").toLowerCase()+"-changed",this.state.host[this.property]==null&&(typeof r=="function"&&(r=r()),r!=null&&this.updateProp(r))}update(t,e){return[this.state.host[this.property],this.updater]}updater(t){const e=this.state.host[this.property];typeof t=="function"&&(t=t(e)),!Object.is(e,t)&&this.updateProp(t)}updateProp(t){this.notify(t).defaultPrevented||(this.state.host[this.property]=t)}notify(t){const e=new CustomEvent(this.eventName,{detail:{value:t,path:this.property},cancelable:!0});return this.state.host.dispatchEvent(e),e}});function dt({render:t}){const e=nt(t),s=ut(e);return{component:e,createContext:s}}const{component:Z}=dt({render:G}),pt=m(class extends f{update(){return this.state.host}}),ft=t=>{const e=pt(),[s,r]=U(null),n=t.rating,c=n?parseFloat(n):null,h=t.disabled,v=t.maxRating,R=v?parseInt(v,10):5;ot(()=>{!h&&e.tabIndex===-1?e.tabIndex=0:h&&(e.tabIndex=-1)},[h]);const z=d=>{const a=s??c;return a==null?"star":d<=Math.floor(a)?"star filled":d===Math.ceil(a)&&a%1!==0?"star partial":"star"},k=d=>{h||e.dispatchEvent(new CustomEvent("change",{detail:{rating:d},bubbles:!0,composed:!0}))},y=d=>{h||r(d)};return{rating:c,disabled:h,maxRating:R,handleComponentLeave:()=>{h||r(null)},renderStar:d=>{const a=d+1,o=z(a),l=o.includes("partial");let u=0;l&&c!==null&&(u=Math.round(c%1*100));const i=["M6.93894 0.263019L8.39719 3.47842C8.45207 3.59942 8.53952 3.70396","8.65043 3.78114C8.76133 3.85833 8.89163 3.90534 9.02772 3.91727L12.5802","4.22519C12.9821 4.28175 13.1424 4.7583 12.851 5.03271L10.175 7.20599C9.95835","7.38195 9.85977 7.65845 9.91935 7.92553L10.6972 11.4457C10.7655 11.8322","10.3462 12.1276 9.98652 11.9443L6.88586 10.1889C6.76893 10.1225 6.63578","10.0875 6.50017 10.0875C6.36457 10.0875 6.23142 10.1225 6.11448 10.1889L3.01382","11.9432C2.65522 12.1255 2.23486 11.8311 2.30311 11.4447L3.08099 7.92448C3.13949","7.6574 3.04199 7.3809 2.82531 7.20494L0.14825 5.03376C-0.142099 4.7604","0.0182426 4.2828 0.419097 4.22624L3.97154 3.91832C4.10763 3.90639 4.23793","3.85938 4.34883 3.78219C4.45974 3.705 4.54719 3.60046 4.60207 3.47947L6.06031","0.264067C6.24124 -0.0878475 6.7591 -0.0878474 6.93894 0.263019Z"].join(" "),q=F`<defs>
						<clipPath id="clip-${d}">
							<rect x="0" y="0" width="${u}%" height="100%" />
						</clipPath>
					</defs>
					<!-- Background (empty) star with border -->
					<path d="${i}"></path>
					<!-- Partial fill (clipped) star -->
					<path d="${i}" clip-path="url(#clip-${d})"></path>`;return b`
			<svg
				class="${o}"
				@click="${()=>k(a)}"
				@mouseenter="${()=>y(a)}"
				viewBox="-0.5 -0.5 14 13"
				xmlns="http://www.w3.org/2000/svg"
			>
				${l?q:F`<path d="${i}"></path>`}
			</svg>
		`}}},mt=st`
	:host {
		display: inline-block;
		--cosmoz-rating-color: #cf2005;
		--cosmoz-rating-color-fill: var(--cosmoz-rating-color);
		--cosmoz-rating-color-empty: transparent;
		--cosmoz-rating-color-hover: var(--cosmoz-rating-color);
		--cosmoz-rating-color-border: var(--cosmoz-rating-color);
		--cosmoz-rating-color-border-empty: var(--cosmoz-rating-color);
		--cosmoz-rating-color-border-hover: var(--cosmoz-rating-color);

		/* Size and spacing */
		--rating-star-size: 24px;
		--rating-star-gap: 2px;
		--rating-star-border-width: 1px;
	}

	:host([disabled]) {
		pointer-events: none;
	}

	.rating-container {
		display: flex;
		gap: var(--rating-star-gap);
		align-items: center;
	}

	.star {
		width: var(--rating-star-size);
		height: var(--rating-star-size);
		cursor: pointer;
		transition:
			fill 0.2s ease,
			stroke 0.2s ease,
			stroke-width 0.2s ease;
	}

	:host([disabled]) .star {
		cursor: default;
	}

	.star path {
		stroke: var(--cosmoz-rating-color-border-empty);
		stroke-width: var(--rating-star-border-width);
		fill: var(--cosmoz-rating-color-empty);
		transition:
			fill 0.2s ease,
			stroke 0.2s ease;
	}

	.star.filled path {
		fill: var(--cosmoz-rating-color-fill);
		stroke: var(--cosmoz-rating-color-border);
	}

	.star.partial > path:first-of-type {
		fill: var(--cosmoz-rating-color-empty);
		stroke: var(--cosmoz-rating-color-border);
	}

	.star.partial > path:last-of-type {
		fill: var(--cosmoz-rating-color-fill);
		stroke: var(--cosmoz-rating-color-border);
	}

	.star:hover path {
		fill: var(--cosmoz-rating-color-hover) !important;
		stroke: var(--cosmoz-rating-color-border-hover) !important;
	}
`,gt=t=>{const{maxRating:e,renderStar:s,handleComponentLeave:r}=ft(t);return b`
		<div class="rating-container" @mouseleave=${r}>
			${Array.from({length:e},(n,c)=>s(c))}
		</div>
	`},bt=Z(gt,{observedAttributes:["rating","disabled","max-rating"],useShadowDOM:!0,styleSheets:[mt]});customElements.define("cosmoz-rating",bt);const vt=()=>{const[t,e]=U(null);return b`
		<div>
			<h1>Interactive Demo</h1>
			<cosmoz-rating
				rating="${t||""}"
				max-rating="${5}"
				@change="${r=>{e(r.detail.rating)}}"
			>
			</cosmoz-rating>

			<h2>${t??"0"}</h2>
		</div>
	`};customElements.define("interactive-demo",Z(vt,{useShadowDOM:!0}));const _t={title:"Components/CosmozRating",tags:["autodocs"],component:"cosmoz-rating",argTypes:{rating:{control:{type:"number",min:0,max:5},description:"The current rating value (null for unrated)"},disabled:{control:"boolean",description:"Disable the rating component"},maxRating:{control:{type:"number",min:1,max:10},description:"Maximum number of stars"}},parameters:{controls:{disable:!0}}},M=({rating:t,disabled:e,maxRating:s})=>b`
        <div>
            <cosmoz-rating
                rating="${t||""}"
                ?disabled="${e}"
                max-rating="${s||5}"
                @change="${r=>{console.log("Rating changed:",r.detail.rating)}}"
            >
            </cosmoz-rating>

            <h2>${t}</h2>
        </div>
    `,_=()=>b`<interactive-demo></interactive-demo>`,C=()=>M({rating:2.8,disabled:!0,maxRating:5}),w=()=>M({rating:7.5,disabled:!1,maxRating:10}),S=()=>M({rating:3.4,disabled:!0,maxRating:5});_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:"() => html`<interactive-demo></interactive-demo>`",..._.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`() => Template({
  rating: 2.8,
  disabled: true,
  maxRating: 5
})`,...C.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`() => Template({
  rating: 7.5,
  disabled: false,
  maxRating: 10
})`,...w.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`() => Template({
  rating: 3.4,
  disabled: true,
  maxRating: 5
})`,...S.parameters?.docs?.source}}};const Ct=["Interactive","Disabled","CustomMaxRating","FractionalRating"];export{w as CustomMaxRating,C as Disabled,S as FractionalRating,_ as Interactive,Ct as __namedExportsOrder,_t as default};
