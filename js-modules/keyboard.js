import {
  createButton,
  getButtonKeyCode,
  setButtonValues,
  setButtonTypeLetter,
  unSetButtonTypeLetter,
} from './button.js';
import {
  keyCodes,
  isKeySpecial,
  keyMaps,
  getLayoutKey,
} from './keyboard-layouts.js';

export default class Keyboard {
  constructor(blockName) {
    this.keyboardElement = document.createElement('div');
    this.keyboardElement.className = `${blockName}__keyboard`;
    keyCodes.forEach((keyCode) => this.keyboardElement
      .append(createButton(keyCode, isKeySpecial(keyCode))));
    this.setLayout(localStorage.keyboardLayout || 'en');
  }

  setLayout(layoutName) {
    localStorage.setItem('keyboardLayout', layoutName);
    if (layoutName in keyMaps) {
      for (let i = 0; i < this.keyboardElement.children.length; i += 1) {
        const buttonKeyCode = getButtonKeyCode(this.keyboardElement.children[i]);
        if (buttonKeyCode) {
          const layoutKey = getLayoutKey(layoutName, buttonKeyCode);
          if (layoutKey) {
            if (layoutKey.upper) {
              setButtonValues(this.keyboardElement.children[i], layoutKey.default, layoutKey.upper);
              setButtonTypeLetter(this.keyboardElement.children[i]);
            } else if (layoutKey.alt) {
              setButtonValues(this.keyboardElement.children[i], layoutKey.default, layoutKey.alt);
              unSetButtonTypeLetter(this.keyboardElement.children[i]);
            } else {
              setButtonValues(this.keyboardElement.children[i], layoutKey.default, '');
            }
          }
        }
      }
    }
  }

  getButton(keyCode) {
    return [...this.keyboardElement.children]
      .find((button) => keyCode.toLowerCase() === getButtonKeyCode(button));
  }
}
