import { b as block, h as hydrating, a as hydrate_next, E as EFFECT_TRANSPARENT, r as read_hydration_instruction, H as HYDRATION_START, c as HYDRATION_START_ELSE, d as remove_nodes, s as set_hydrate_node, e as set_hydrating, f as resume_effect, g as branch, p as pause_effect, U as UNINITIALIZED, i as hydrate_node, j as effect, k as render_effect, u as untrack, q as queue_micro_task, S as STATE_SYMBOL } from "./DnwmjT3g.js";
function if_block(node, fn, [root_index, hydrate_index] = [0, 0]) {
  if (hydrating && root_index === 0) {
    hydrate_next();
  }
  var anchor = node;
  var consequent_effect = null;
  var alternate_effect = null;
  var condition = UNINITIALIZED;
  var flags = root_index > 0 ? EFFECT_TRANSPARENT : 0;
  var has_branch = false;
  const set_branch = (fn2, flag = true) => {
    has_branch = true;
    update_branch(flag, fn2);
  };
  const update_branch = (new_condition, fn2) => {
    if (condition === (condition = new_condition)) return;
    let mismatch = false;
    if (hydrating && hydrate_index !== -1) {
      if (root_index === 0) {
        const data = read_hydration_instruction(anchor);
        if (data === HYDRATION_START) {
          hydrate_index = 0;
        } else if (data === HYDRATION_START_ELSE) {
          hydrate_index = Infinity;
        } else {
          hydrate_index = parseInt(data.substring(1));
          if (hydrate_index !== hydrate_index) {
            hydrate_index = condition ? Infinity : -1;
          }
        }
      }
      const is_else = hydrate_index > root_index;
      if (!!condition === is_else) {
        anchor = remove_nodes();
        set_hydrate_node(anchor);
        set_hydrating(false);
        mismatch = true;
        hydrate_index = -1;
      }
    }
    if (condition) {
      if (consequent_effect) {
        resume_effect(consequent_effect);
      } else if (fn2) {
        consequent_effect = branch(() => fn2(anchor));
      }
      if (alternate_effect) {
        pause_effect(alternate_effect, () => {
          alternate_effect = null;
        });
      }
    } else {
      if (alternate_effect) {
        resume_effect(alternate_effect);
      } else if (fn2) {
        alternate_effect = branch(() => fn2(anchor, [root_index + 1, hydrate_index]));
      }
      if (consequent_effect) {
        pause_effect(consequent_effect, () => {
          consequent_effect = null;
        });
      }
    }
    if (mismatch) {
      set_hydrating(true);
    }
  };
  block(() => {
    has_branch = false;
    fn(set_branch);
    if (!has_branch) {
      update_branch(null, null);
    }
  }, flags);
  if (hydrating) {
    anchor = hydrate_node;
  }
}
function is_bound_this(bound_value, element_or_component) {
  return bound_value === element_or_component || (bound_value == null ? void 0 : bound_value[STATE_SYMBOL]) === element_or_component;
}
function bind_this(element_or_component = {}, update, get_value, get_parts) {
  effect(() => {
    var old_parts;
    var parts;
    render_effect(() => {
      old_parts = parts;
      parts = [];
      untrack(() => {
        if (element_or_component !== get_value(...parts)) {
          update(element_or_component, ...parts);
          if (old_parts && is_bound_this(get_value(...old_parts), element_or_component)) {
            update(null, ...old_parts);
          }
        }
      });
    });
    return () => {
      queue_micro_task(() => {
        if (parts && is_bound_this(get_value(...parts), element_or_component)) {
          update(null, ...parts);
        }
      });
    };
  });
  return element_or_component;
}
export {
  bind_this as b,
  if_block as i
};
