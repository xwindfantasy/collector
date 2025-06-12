import { t as template, b as append } from "../chunks/BDSO5bsW.js";
import { V as component_context, _ as user_pre_effect, $ as user_effect, a0 as run_all, y as untrack, a1 as run, g as get, a2 as deep_read_state, a3 as derived, a4 as enable_legacy_mode_flag, T as push, a5 as first_child, a6 as template_effect, W as pop, a7 as child, a8 as reset, a9 as sibling } from "../chunks/CgSONPxW.js";
import { s as set_text } from "../chunks/BqqE4uZX.js";
import { s as stores, p as page$2 } from "../chunks/BL2k8oel.js";
function init(immutable = false) {
  const context = (
    /** @type {ComponentContextLegacy} */
    component_context
  );
  const callbacks = context.l.u;
  if (!callbacks) return;
  let props = () => deep_read_state(context.s);
  if (immutable) {
    let version = 0;
    let prev = (
      /** @type {Record<string, any>} */
      {}
    );
    const d = derived(() => {
      let changed = false;
      const props2 = context.s;
      for (const key in props2) {
        if (props2[key] !== prev[key]) {
          prev[key] = props2[key];
          changed = true;
        }
      }
      if (changed) version++;
      return version;
    });
    props = () => get(d);
  }
  if (callbacks.b.length) {
    user_pre_effect(() => {
      observe_all(context, props);
      run_all(callbacks.b);
    });
  }
  user_effect(() => {
    const fns = untrack(() => callbacks.m.map(run));
    return () => {
      for (const fn of fns) {
        if (typeof fn === "function") {
          fn();
        }
      }
    };
  });
  if (callbacks.a.length) {
    user_effect(() => {
      observe_all(context, props);
      run_all(callbacks.a);
    });
  }
}
function observe_all(context, props) {
  if (context.l.s) {
    for (const signal of context.l.s) get(signal);
  }
  props();
}
enable_legacy_mode_flag();
const page$1 = {
  get error() {
    return page$2.error;
  },
  get status() {
    return page$2.status;
  }
};
({
  check: stores.updated.check
});
const page = page$1;
var root = template(`<h1> </h1> <p> </p>`, 1);
function Error$1($$anchor, $$props) {
  push($$props, false);
  init();
  var fragment = root();
  var h1 = first_child(fragment);
  var text = child(h1, true);
  reset(h1);
  var p = sibling(h1, 2);
  var text_1 = child(p, true);
  reset(p);
  template_effect(() => {
    var _a;
    set_text(text, page.status);
    set_text(text_1, (_a = page.error) == null ? void 0 : _a.message);
  });
  append($$anchor, fragment);
  pop();
}
export {
  Error$1 as component
};
