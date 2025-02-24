/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

interface StrongFocus {
  visible: boolean;
  setVisible(visible: boolean): void;
}

class FocusGlobal implements StrongFocus {
  visible = false;
  setVisible(visible: boolean) {
    this.visible = visible;
  }
}

/**
 * This object can be overwritten by the `setup()` function to use a different
 * focus coordination object.
 */
let focusObject: StrongFocus = new FocusGlobal();

/**
 * Set of keyboard event codes that correspond to keyboard navigation
 */
const KEYBOARD_NAVIGATION_KEYS =
    new Set(['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']);

/**
 * Components should call this when a user interacts with a component with a
 * keyboard event in the very special case that the component needs to call
 * focus inside of a keydown handler. Otherwise, this module will handle
 * keyboard events on window.
 *
 * By default, this will enable the strong focus to be shown.
 *
 * @param e The native keyboard event.
 */
export function keydownHandler(e: KeyboardEvent) {
  if (KEYBOARD_NAVIGATION_KEYS.has(e.key)) {
    focusObject.setVisible(true);
  }
}

/**
 * Set up integration with alternate global focus tracking object
 *
 * @param focusGlobal A global focus object to coordinate between multiple
 *     systems
 * @param enableKeydownHandler Set to true to let StrongFocusService listen for
 *     keyboard navigation
 */
export function setup(focusGlobal: StrongFocus, enableKeydownHandler = false) {
  focusObject = focusGlobal;
  if (enableKeydownHandler) {
    window.addEventListener('keydown', keydownHandler);
  } else {
    window.removeEventListener('keydown', keydownHandler);
  }
}

/**
 * Setting for always showing strong focus
 *
 * Defaults to false, controlled by `setForceStrongFocus`
 */
let alwaysStrong = false;

/**
 * Returns `true` if the component should show strong focus.
 *
 * By default, strong focus is shown only on keyboard navigation, and not on
 * pointer interaction.
 */
export function shouldShowStrongFocus() {
  return alwaysStrong || focusObject.visible;
}

/**
 * Control if strong focus should always be shown on component focus
 *
 * Defaults to `false`
 *
 * @param force Forces strong focus on the page. Disables strong focus if false.
 */
export function setForceStrongFocus(force: boolean) {
  alwaysStrong = force;
}

/**
 * If `true`, strong focus is always shown
 */
export function isStrongFocusForced() {
  return alwaysStrong;
}

/**
 * Components should call this when a user interacts with a component with a
 * pointing device.
 *
 * By default, this will prevent the strong focus from being shown.
 */
export function pointerPress() {
  focusObject.setVisible(false);
}

setup(focusObject, true);