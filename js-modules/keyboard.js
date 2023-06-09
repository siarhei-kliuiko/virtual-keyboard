import {
  createButton,
  getButtonKeyCode,
  setButtonValues,
  setButtonTypeLetter,
  unSetButtonTypeLetter,
  isButtonInPressedState,
  isLetterButton,
  toggleButtonActiveValue,
  isSpecialButton,
  BUTTON_SPECIAL_CAPS,
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
              if (this.isButtonPressed(BUTTON_SPECIAL_CAPS)
                && !isLetterButton(this.keyboardElement.children[i])) {
                toggleButtonActiveValue(this.keyboardElement.children[i]);
              }

              setButtonTypeLetter(this.keyboardElement.children[i]);
            } else if (layoutKey.alt) {
              setButtonValues(this.keyboardElement.children[i], layoutKey.default, layoutKey.alt);
              if (this.isButtonPressed(BUTTON_SPECIAL_CAPS)
                && isLetterButton(this.keyboardElement.children[i])) {
                toggleButtonActiveValue(this.keyboardElement.children[i]);
              }

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
    return this.getButtons().find((button) => keyCode.toLowerCase() === getButtonKeyCode(button));
  }

  isButtonPressed(...keyCodesToCHeck) {
    return this.getButtons().some((button) => {
      const buttonKeyCode = getButtonKeyCode(button);
      return isButtonInPressedState(button) && keyCodesToCHeck.includes(buttonKeyCode);
    });
  }

  getButtons() {
    return [...this.keyboardElement.children];
  }

  switchCase() {
    const charButtons = this.getButtons().filter((button) => isLetterButton(button));
    Keyboard.switchToButtonsAlt(charButtons);
  }

  static switchToButtonsAlt(buttons) {
    for (let i = 0; i < buttons.length; i += 1) {
      toggleButtonActiveValue(buttons[i]);
    }
  }

  switchToAlternativeKeys() {
    const charButtons = this.getButtons().filter((button) => !isSpecialButton(button));
    Keyboard.switchToButtonsAlt(charButtons);
  }
}
