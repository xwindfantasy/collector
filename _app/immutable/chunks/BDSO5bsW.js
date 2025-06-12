var _a;
import { F as create_text, J as get_first_child, X as is_firefox, e as active_effect, Y as TEMPLATE_FRAGMENT, Z as TEMPLATE_USE_IMPORT_NODE, k as hydrating, v as hydrate_node, l as hydrate_next, n as set_hydrate_node } from "./CgSONPxW.js";
function create_fragment_from_html(html) {
  var elem = document.createElement("template");
  elem.innerHTML = html;
  return elem.content;
}
function assign_nodes(start, end) {
  var effect = (
    /** @type {Effect} */
    active_effect
  );
  if (effect.nodes_start === null) {
    effect.nodes_start = start;
    effect.nodes_end = end;
  }
}
// @__NO_SIDE_EFFECTS__
function template(content, flags) {
  var is_fragment = (flags & TEMPLATE_FRAGMENT) !== 0;
  var use_import_node = (flags & TEMPLATE_USE_IMPORT_NODE) !== 0;
  var node;
  var has_start = !content.startsWith("<!>");
  return () => {
    if (hydrating) {
      assign_nodes(hydrate_node, null);
      return hydrate_node;
    }
    if (node === void 0) {
      node = create_fragment_from_html(has_start ? content : "<!>" + content);
      if (!is_fragment) node = /** @type {Node} */
      get_first_child(node);
    }
    var clone = (
      /** @type {TemplateNode} */
      use_import_node || is_firefox ? document.importNode(node, true) : node.cloneNode(true)
    );
    if (is_fragment) {
      var start = (
        /** @type {TemplateNode} */
        get_first_child(clone)
      );
      var end = (
        /** @type {TemplateNode} */
        clone.lastChild
      );
      assign_nodes(start, end);
    } else {
      assign_nodes(clone, clone);
    }
    return clone;
  };
}
function text(value = "") {
  if (!hydrating) {
    var t = create_text(value + "");
    assign_nodes(t, t);
    return t;
  }
  var node = hydrate_node;
  if (node.nodeType !== 3) {
    node.before(node = create_text());
    set_hydrate_node(node);
  }
  assign_nodes(node, node);
  return node;
}
function comment() {
  if (hydrating) {
    assign_nodes(hydrate_node, null);
    return hydrate_node;
  }
  var frag = document.createDocumentFragment();
  var start = document.createComment("");
  var anchor = create_text();
  frag.append(start, anchor);
  assign_nodes(start, anchor);
  return frag;
}
function append(anchor, dom) {
  if (hydrating) {
    active_effect.nodes_end = hydrate_node;
    hydrate_next();
    return;
  }
  if (anchor === null) {
    return;
  }
  anchor.before(
    /** @type {Node} */
    dom
  );
}
const PUBLIC_VERSION = "5";
if (typeof window !== "undefined") {
  ((_a = window.__svelte ?? (window.__svelte = {})).v ?? (_a.v = /* @__PURE__ */ new Set())).add(PUBLIC_VERSION);
}
export {
  assign_nodes as a,
  append as b,
  comment as c,
  text as d,
  create_fragment_from_html as e,
  template as t
};
