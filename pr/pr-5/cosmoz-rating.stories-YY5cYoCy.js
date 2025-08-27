import { B, b, x } from './lit-html-CedCbRno.js';

let current;
let currentId = 0;
function setCurrent(state) {
    current = state;
}
function clear() {
    current = null;
    currentId = 0;
}
function notify() {
    return currentId++;
}

const phaseSymbol = Symbol("haunted.phase");
const hookSymbol = Symbol("haunted.hook");
const updateSymbol = Symbol("haunted.update");
const commitSymbol = Symbol("haunted.commit");
const effectsSymbol = Symbol("haunted.effects");
const layoutEffectsSymbol = Symbol("haunted.layoutEffects");
const contextEvent = "haunted.context";

class State {
    update;
    host;
    virtual;
    [hookSymbol];
    [effectsSymbol];
    [layoutEffectsSymbol];
    constructor(update, host) {
        this.update = update;
        this.host = host;
        this[hookSymbol] = new Map();
        this[effectsSymbol] = [];
        this[layoutEffectsSymbol] = [];
    }
    run(cb) {
        setCurrent(this);
        let res = cb();
        clear();
        return res;
    }
    _runEffects(phase) {
        let effects = this[phase];
        setCurrent(this);
        for (let effect of effects) {
            effect.call(this);
        }
        clear();
    }
    runEffects() {
        this._runEffects(effectsSymbol);
    }
    runLayoutEffects() {
        this._runEffects(layoutEffectsSymbol);
    }
    teardown() {
        let hooks = this[hookSymbol];
        hooks.forEach((hook) => {
            if (typeof hook.teardown === "function") {
                hook.teardown(true);
            }
        });
    }
}

const defer = Promise.resolve().then.bind(Promise.resolve());
function runner() {
    let tasks = [];
    let id;
    function runTasks() {
        id = null;
        let t = tasks;
        tasks = [];
        for (var i = 0, len = t.length; i < len; i++) {
            t[i]();
        }
    }
    return function (task) {
        tasks.push(task);
        if (id == null) {
            id = defer(runTasks);
        }
    };
}
const read = runner();
const write = runner();
class BaseScheduler {
    renderer;
    host;
    state;
    [phaseSymbol];
    _updateQueued;
    _active;
    constructor(renderer, host) {
        this.renderer = renderer;
        this.host = host;
        this.state = new State(this.update.bind(this), host);
        this[phaseSymbol] = null;
        this._updateQueued = false;
        this._active = true;
    }
    update() {
        if (!this._active)
            return;
        if (this._updateQueued)
            return;
        read(() => {
            let result = this.handlePhase(updateSymbol);
            write(() => {
                this.handlePhase(commitSymbol, result);
                write(() => {
                    this.handlePhase(effectsSymbol);
                });
            });
            this._updateQueued = false;
        });
        this._updateQueued = true;
    }
    handlePhase(phase, arg) {
        this[phaseSymbol] = phase;
        switch (phase) {
            case commitSymbol:
                this.commit(arg);
                this.runEffects(layoutEffectsSymbol);
                return;
            case updateSymbol:
                return this.render();
            case effectsSymbol:
                return this.runEffects(effectsSymbol);
        }
    }
    render() {
        return this.state.run(() => this.renderer.call(this.host, this.host));
    }
    runEffects(phase) {
        this.state._runEffects(phase);
    }
    teardown() {
        this.state.teardown();
    }
    pause() {
        this._active = false;
    }
    resume() {
        this._active = true;
    }
}

const sheet = (...styles) => {
    const cs = new CSSStyleSheet();
    cs.replaceSync(styles.join(""));
    return cs;
};
const sheets = (styleSheets) => styleSheets?.map((style) => {
    if (typeof style === "string")
        return sheet(style);
    return style;
});
const tagged = (strings, ...values) => strings.flatMap((s, i) => [s, values[i] || ""]).join("");
const css = tagged;

const toCamelCase = (val = "") => val.replace(/-+([a-z])?/g, (_, char) => (char ? char.toUpperCase() : ""));
function makeComponent(render) {
    class Scheduler extends BaseScheduler {
        frag;
        renderResult;
        constructor(renderer, frag, host) {
            super(renderer, (host || frag));
            this.frag = frag;
        }
        commit(result) {
            this.renderResult = render(result, this.frag);
        }
    }
    function component(renderer, baseElementOrOptions, options) {
        const BaseElement = (options || baseElementOrOptions || {}).baseElement ||
            HTMLElement;
        const { observedAttributes = [], useShadowDOM = true, shadowRootInit = {}, styleSheets: _styleSheets, } = options || baseElementOrOptions || {};
        const styleSheets = sheets(renderer.styleSheets || _styleSheets);
        class Element extends BaseElement {
            _scheduler;
            static get observedAttributes() {
                return renderer.observedAttributes || observedAttributes || [];
            }
            constructor() {
                super();
                if (useShadowDOM === false) {
                    this._scheduler = new Scheduler(renderer, this);
                }
                else {
                    const shadowRoot = this.attachShadow({
                        mode: "open",
                        ...shadowRootInit,
                    });
                    if (styleSheets)
                        shadowRoot.adoptedStyleSheets = styleSheets;
                    this._scheduler = new Scheduler(renderer, shadowRoot, this);
                }
            }
            connectedCallback() {
                this._scheduler.resume();
                this._scheduler.update();
                this._scheduler.renderResult?.setConnected(true);
            }
            disconnectedCallback() {
                this._scheduler.pause();
                this._scheduler.teardown();
                this._scheduler.renderResult?.setConnected(false);
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) {
                    return;
                }
                let val = newValue === "" ? true : newValue;
                Reflect.set(this, toCamelCase(name), val);
            }
        }
        function reflectiveProp(initialValue) {
            let value = initialValue;
            let isSetup = false;
            return Object.freeze({
                enumerable: true,
                configurable: true,
                get() {
                    return value;
                },
                set(newValue) {
                    // Avoid scheduling update when prop value hasn't changed
                    if (isSetup && value === newValue)
                        return;
                    isSetup = true;
                    value = newValue;
                    if (this._scheduler) {
                        this._scheduler.update();
                    }
                },
            });
        }
        const proto = new Proxy(BaseElement.prototype, {
            getPrototypeOf(target) {
                return target;
            },
            set(target, key, value, receiver) {
                let desc;
                if (key in target) {
                    desc = Object.getOwnPropertyDescriptor(target, key);
                    if (desc && desc.set) {
                        desc.set.call(receiver, value);
                        return true;
                    }
                    Reflect.set(target, key, value, receiver);
                    return true;
                }
                if (typeof key === "symbol" || key[0] === "_") {
                    desc = {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value,
                    };
                }
                else {
                    desc = reflectiveProp(value);
                }
                Object.defineProperty(receiver, key, desc);
                if (desc.set) {
                    desc.set.call(receiver, value);
                }
                return true;
            },
        });
        Object.setPrototypeOf(Element.prototype, proto);
        return Element;
    }
    return component;
}

class Hook {
    id;
    state;
    constructor(id, state) {
        this.id = id;
        this.state = state;
    }
}
function use(Hook, ...args) {
    let id = notify();
    let hooks = current[hookSymbol];
    let hook = hooks.get(id);
    if (!hook) {
        hook = new Hook(id, current, ...args);
        hooks.set(id, hook);
    }
    return hook.update(...args);
}
function hook(Hook) {
    return use.bind(null, Hook);
}

function createEffect(setEffects) {
    return hook(class extends Hook {
        callback;
        lastValues;
        values;
        _teardown;
        constructor(id, state, ignored1, ignored2) {
            super(id, state);
            setEffects(state, this);
        }
        update(callback, values) {
            this.callback = callback;
            this.values = values;
        }
        call() {
            const hasChanged = !this.values || this.hasChanged();
            this.lastValues = this.values;
            if (hasChanged) {
                this.run();
            }
        }
        run() {
            this.teardown();
            this._teardown = this.callback.call(this.state);
        }
        teardown(disconnected) {
            if (typeof this._teardown === "function") {
                this._teardown();
                // ensure effect is not torn down multiple times
                this._teardown = undefined;
            }
            // reset to pristine state when element is disconnected
            if (disconnected) {
                this.lastValues = this.values = undefined;
            }
        }
        hasChanged() {
            return (!this.lastValues ||
                this.values.some((value, i) => this.lastValues[i] !== value));
        }
    });
}

function setEffects(state, cb) {
    state[effectsSymbol].push(cb);
}
/**
 * @function
 * @param {() => void} effect - callback function that runs each time dependencies change
 * @param {unknown[]} [dependencies] - list of dependencies to the effect
 * @return {void}
 */
const useEffect = createEffect(setEffects);

const getEmitter = (host) => {
    if (host instanceof Element)
        return host;
    return host.startNode || host.endNode || host.parentNode;
};
/**
 * @function
 * @template T
 * @param    {Context<T>} context
 * @return   {T}
 */
const useContext = hook(class extends Hook {
    Context;
    value;
    _ranEffect;
    _unsubscribe;
    constructor(id, state, _) {
        super(id, state);
        this._updater = this._updater.bind(this);
        this._ranEffect = false;
        this._unsubscribe = null;
        setEffects(state, this);
    }
    update(Context) {
        if (this.Context !== Context) {
            this._subscribe(Context);
            this.Context = Context;
        }
        return this.value;
    }
    call() {
        if (!this._ranEffect) {
            this._ranEffect = true;
            if (this._unsubscribe)
                this._unsubscribe();
            this._subscribe(this.Context);
            this.state.update();
        }
    }
    _updater(value) {
        this.value = value;
        this.state.update();
    }
    _subscribe(Context) {
        const detail = { Context, callback: this._updater };
        const emitter = getEmitter(this.state.host);
        emitter.dispatchEvent(new CustomEvent(contextEvent, {
            detail, // carrier
            bubbles: true, // to bubble up in tree
            cancelable: true, // to be able to cancel
            composed: true, // to pass ShadowDOM boundaries
        }));
        const { unsubscribe = null, value } = detail;
        this.value = unsubscribe ? value : Context.defaultValue;
        this._unsubscribe = unsubscribe;
    }
    teardown() {
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
});

function makeContext(component) {
    return (defaultValue) => {
        const Context = {
            Provider: class extends HTMLElement {
                listeners;
                _value;
                constructor() {
                    super();
                    this.style.display = "contents";
                    this.listeners = new Set();
                    this.addEventListener(contextEvent, this);
                }
                disconnectedCallback() {
                    this.removeEventListener(contextEvent, this);
                }
                handleEvent(event) {
                    const { detail } = event;
                    if (detail.Context === Context) {
                        detail.value = this.value;
                        detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);
                        this.listeners.add(detail.callback);
                        event.stopPropagation();
                    }
                }
                unsubscribe(callback) {
                    this.listeners.delete(callback);
                }
                set value(value) {
                    this._value = value;
                    for (let callback of this.listeners) {
                        callback(value);
                    }
                }
                get value() {
                    return this._value;
                }
            },
            Consumer: component(function ({ render }) {
                const context = useContext(Context);
                return render(context);
            }, { useShadowDOM: false }),
            defaultValue,
        };
        return Context;
    };
}

/**
 * @function
 * @template T
 * @param  {() => T} fn function to memoize
 * @param  {unknown[]} values dependencies to the memoized computation
 * @return {T} The next computed value
 */
hook(class extends Hook {
    value;
    values;
    constructor(id, state, fn, values) {
        super(id, state);
        this.value = fn();
        this.values = values;
    }
    update(fn, values) {
        if (this.hasChanged(values)) {
            this.values = values;
            this.value = fn();
        }
        return this.value;
    }
    hasChanged(values = []) {
        return values.some((value, i) => this.values[i] !== value);
    }
});

function setLayoutEffects(state, cb) {
    state[layoutEffectsSymbol].push(cb);
}
/**
 * @function
 * @param  {Effect} callback effecting callback
 * @param  {unknown[]} [values] dependencies to the effect
 * @return {void}
 */
createEffect(setLayoutEffects);

/**
 * @function
 * @template {*} T
 * @param {T} [initialState] - Optional initial state
 * @return {StateTuple<T>} stateTuple - Tuple of current state and state updater function
 */
const useState = hook(class extends Hook {
    args;
    constructor(id, state, initialValue) {
        super(id, state);
        this.updater = this.updater.bind(this);
        if (typeof initialValue === "function") {
            const initFn = initialValue;
            initialValue = initFn();
        }
        this.makeArgs(initialValue);
    }
    update() {
        return this.args;
    }
    updater(value) {
        const [previousValue] = this.args;
        if (typeof value === "function") {
            const updaterFn = value;
            value = updaterFn(previousValue);
        }
        if (Object.is(previousValue, value)) {
            return;
        }
        this.makeArgs(value);
        this.state.update();
    }
    makeArgs(value) {
        this.args = Object.freeze([value, this.updater]);
    }
});

/**
 * Given a reducer function, initial state, and optional state initializer function, returns a tuple of state and dispatch function.
 * @function
 * @template S State
 * @template I Initial State
 * @template A Action
 * @param {Reducer<S, A>} reducer - reducer function to compute the next state given the previous state and the action
 * @param {I} initialState - the initial state of the reducer
 * @param {(init: I) => S} [init=undefined] - Optional initializer function, called on initialState if provided
 * @return {readonly [S, (action: A) => void]}
 */
hook(class extends Hook {
    reducer;
    currentState;
    constructor(id, state, _, initialState, init) {
        super(id, state);
        this.dispatch = this.dispatch.bind(this);
        this.currentState =
            init !== undefined ? init(initialState) : initialState;
    }
    update(reducer) {
        this.reducer = reducer;
        return [this.currentState, this.dispatch];
    }
    dispatch(action) {
        this.currentState = this.reducer(this.currentState, action);
        this.state.update();
    }
});

const UPPER = /([A-Z])/gu;
hook(class extends Hook {
    property;
    eventName;
    constructor(id, state, property, initialValue) {
        super(id, state);
        if (this.state.virtual) {
            throw new Error("Can't be used with virtual components.");
        }
        this.updater = this.updater.bind(this);
        this.property = property;
        this.eventName =
            property.replace(UPPER, "-$1").toLowerCase() + "-changed";
        // set the initial value only if it was not already set by the parent
        if (this.state.host[this.property] != null)
            return;
        if (typeof initialValue === "function") {
            const initFn = initialValue;
            initialValue = initFn();
        }
        if (initialValue == null)
            return;
        this.updateProp(initialValue);
    }
    update(ignored, ignored2) {
        return [this.state.host[this.property], this.updater];
    }
    updater(value) {
        const previousValue = this.state.host[this.property];
        if (typeof value === "function") {
            const updaterFn = value;
            value = updaterFn(previousValue);
        }
        if (Object.is(previousValue, value)) {
            return;
        }
        this.updateProp(value);
    }
    updateProp(value) {
        const ev = this.notify(value);
        if (ev.defaultPrevented)
            return;
        this.state.host[this.property] = value;
    }
    notify(value) {
        const ev = new CustomEvent(this.eventName, {
            detail: { value, path: this.property },
            cancelable: true,
        });
        this.state.host.dispatchEvent(ev);
        return ev;
    }
});

function pion({ render }) {
    const component = makeComponent(render);
    const createContext = makeContext(component);
    return { component, createContext };
}

const { component} = pion({ render: B });

const useRating = (host) => {
  const [hoveredRating, setHoveredRating] = useState(null);
  const ratingAttr = host.getAttribute("rating");
  const rating = ratingAttr ? parseFloat(ratingAttr) : null;
  const disabled = host.hasAttribute("disabled");
  const maxRatingAttr = host.getAttribute("max-rating");
  const maxRating = maxRatingAttr ? parseInt(maxRatingAttr, 10) : 5;
  useEffect(() => {
    if (!disabled && host.tabIndex === -1) {
      host.tabIndex = 0;
    } else if (disabled) {
      host.tabIndex = -1;
    }
  }, [disabled]);
  const getStarClass = (starIndex) => {
    const currentRating = hoveredRating ?? rating;
    if (currentRating === null || currentRating === void 0) {
      return "star";
    }
    if (starIndex <= Math.floor(currentRating)) {
      return "star filled";
    } else if (starIndex === Math.ceil(currentRating) && currentRating % 1 !== 0) {
      return "star partial";
    }
    return "star";
  };
  const handleStarClick = (starRating) => {
    if (disabled) return;
    host.dispatchEvent(
      new CustomEvent("change", {
        detail: { rating: starRating },
        bubbles: true,
        composed: true
      })
    );
  };
  const handleStarHover = (starRating) => {
    if (disabled) return;
    setHoveredRating(starRating);
  };
  const handleComponentLeave = () => {
    if (disabled) return;
    setHoveredRating(null);
  };
  const renderStar = (index) => {
    const starRating = index + 1;
    const starClass = getStarClass(starRating);
    const isPartial = starClass.includes("partial");
    let fillPercentage = 0;
    if (isPartial && rating !== null) {
      fillPercentage = Math.round(rating % 1 * 100);
    }
    const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
    const partialPaths = b`<defs>
						<clipPath id="clip-${index}">
							<rect x="0" y="0" width="${fillPercentage}%" height="100%" />
						</clipPath>
					</defs>
					<!-- Background (empty) star -->
					<path d="${starPath}" fill="var(--rating-star-color-empty)"></path>
					<!-- Partial fill (clipped) star -->
					<path
						d="${starPath}"
						fill="var(--rating-star-color)"
						clip-path="url(#clip-${index})"
					></path>`;
    return x`
			<svg
				class="${starClass}"
				@click="${() => handleStarClick(starRating)}"
				@mouseenter="${() => handleStarHover(starRating)}"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				${isPartial ? partialPaths : b`<path
					d="${starPath}"
					fill="${starClass.includes("filled") ? "var(--rating-star-color)" : "var(--rating-star-color-empty)"}"
				></path>`}
			</svg>
		`;
  };
  return { rating, disabled, maxRating, handleComponentLeave, renderStar };
};

const styles = css`
	:host {
		display: inline-block;
		--rating-star-color: #ffd700;
		--rating-star-color-empty: #d3d3d3;
		--rating-star-color-hover: #ffed4a;
		--rating-star-size: 24px;
		--rating-star-gap: 2px;
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
		transition: fill 0.2s ease;
	}

	:host([disabled]) .star {
		cursor: default;
	}

	.star:hover path {
		color: var(--rating-star-color-hover) !important;
	}
`;

const Rating = (host) => {
  const { maxRating, renderStar, handleComponentLeave } = useRating(host);
  return x`
		<div class="rating-container" @mouseleave=${handleComponentLeave}>
			${Array.from({ length: maxRating }, (_, index) => renderStar(index))}
		</div>
	`;
};
const CosmozRating = component(Rating, {
  observedAttributes: ["rating", "disabled", "max-rating"],
  useShadowDOM: true,
  styleSheets: [styles]
});
customElements.define("cosmoz-rating", CosmozRating);

const style = css`
	cosmoz-rating {
		--rating-star-color: #01c92d;
		--rating-star-color-empty: #48665150;
	}
`;
const InteractiveDemo = () => {
  const [rating, setRating] = useState(null);
  const handleRatingChange = (event) => {
    setRating(event.detail.rating);
  };
  return x`
		<div>
			<h1>Interactive Demo</h1>
			<cosmoz-rating
				rating="${rating || ""}"
				max-rating="${5}"
				@change="${handleRatingChange}"
			>
			</cosmoz-rating>

			<h2>${rating ?? "0"}</h2>
		</div>
	`;
};
customElements.define(
  "interactive-demo",
  component(InteractiveDemo, { useShadowDOM: true, styleSheets: [style] })
);

var cosmozRating_stories = {
  title: "Components/CosmozRating",
  tags: ["autodocs"],
  component: "cosmoz-rating",
  argTypes: {
    rating: {
      control: { type: "number", min: 0, max: 5 },
      description: "The current rating value (null for unrated)"
    },
    disabled: {
      control: "boolean",
      description: "Disable the rating component"
    },
    maxRating: {
      control: { type: "number", min: 1, max: 10 },
      description: "Maximum number of stars"
    }
  },
  parameters: {
    controls: {
      disable: true
    }
  }
};
const Template = ({ rating, disabled, maxRating }) => {
  return x`
		<div>
			<cosmoz-rating
				rating="${rating || ""}"
				?disabled="${disabled}"
				max-rating="${maxRating || 5}"
				@change="${(e) => {
    console.log("Rating changed:", e.detail.rating);
  }}"
			>
			</cosmoz-rating>

			<h2>${rating}</h2>
		</div>
	`;
};
const Interactive = () => x`<interactive-demo></interactive-demo>`;
const Disabled = () => Template({
  rating: 2.8,
  disabled: true,
  maxRating: 5
});
const CustomMaxRating = () => Template({
  rating: 7.5,
  disabled: false,
  maxRating: 10
});
const FractionalRating = () => Template({
  rating: 3.4,
  disabled: true,
  maxRating: 5
});
const __namedExportsOrder = ["Interactive", "Disabled", "CustomMaxRating", "FractionalRating"];

export { CustomMaxRating, Disabled, FractionalRating, Interactive, __namedExportsOrder, cosmozRating_stories as default };
