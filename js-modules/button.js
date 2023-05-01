const BUTTON_KEY_PREFIX = 'button_key_';
const BUTTON_TYPE_PREFIX = 'button_type_';
const BUTTON_TYPE_SPECIAL = 'special';
const BUTTON_TYPE_LETTER = 'letter';
const BUTTON_VALUE_ELEMENT = 'button__value';
const BUTTON_VALUE_ACTIVE = 'active';
const BUTTON_STATE_PREFIX = 'button_state_';
const BUTTON_STATE_PRESSED = 'pressed';
export const BUTTON_SPECIAL_LSHIFT = 'shiftleft';
export const BUTTON_SPECIAL_RSHIFT = 'shiftright';
export const BUTTON_SPECIAL_CAPS = 'capslock';
export const BUTTON_SPECIAL_BACKSPACE = 'backspace';
export const BUTTON_SPECIAL_TAB = 'tab';
export const BUTTON_SPECIAL_ENTER = 'enter';
export const BUTTON_SPECIAL_DEL = 'delete';
export const BUTTON_SPECIAL_LCTRL = 'controlleft';
export const BUTTON_SPECIAL_RCTRL = 'controlright';
export const BUTTON_SPECIAL_LALT = 'altleft';
export const BUTTON_SPECIAL_RALT = 'altright';
export const BUTTON_SPECIAL_META = 'metaleft';

export function createButton(keyCode, keyIsSpecial) {
  const button = document.createElement('button');
  button.className = `button ${BUTTON_KEY_PREFIX}${keyCode.toLowerCase()}`;
  if (keyIsSpecial) {
    button.classList.add(BUTTON_TYPE_PREFIX + BUTTON_TYPE_SPECIAL);
  }

  for (let i = 0; i < 2; i += 1) {
    const buttonValue = document.createElement('span');
    buttonValue.className = BUTTON_VALUE_ELEMENT;
    button.append(buttonValue);
  }

  button.children[0].classList.add(`${BUTTON_VALUE_ELEMENT}_${BUTTON_VALUE_ACTIVE}`);
  return button;
}

export const getButtonKeyCode = (button) => {
  const keyMod = [...button.classList].find((className) => className.startsWith(BUTTON_KEY_PREFIX));
  return keyMod.replace(BUTTON_KEY_PREFIX, '');
};

export const setButtonValues = (button, defaultValue, altValue) => {
  const buttonValues = button.children;
  buttonValues[0].innerText = defaultValue;
  buttonValues[1].innerText = altValue;
};

export const setButtonTypeLetter = (button) => {
  button.classList.add(`${BUTTON_TYPE_PREFIX}${BUTTON_TYPE_LETTER}`);
};

export const unSetButtonTypeLetter = (button) => {
  button.classList.remove(`${BUTTON_TYPE_PREFIX}${BUTTON_TYPE_LETTER}`);
};

export const setButtonPressedState = (button) => {
  button.classList.add(`${BUTTON_STATE_PREFIX}${BUTTON_STATE_PRESSED}`);
};

export const unSetButtonPressedState = (button) => {
  button.classList.remove(`${BUTTON_STATE_PREFIX}${BUTTON_STATE_PRESSED}`);
};

export const isButtonInPressedState = (button) => button.className
  .includes(BUTTON_STATE_PREFIX + BUTTON_STATE_PRESSED);

export const isSpecialButton = (button) => button.className
  .includes(BUTTON_TYPE_PREFIX + BUTTON_TYPE_SPECIAL);

export const getButtonActiveValue = (button) => button
  .querySelector(`.${BUTTON_VALUE_ELEMENT}_${BUTTON_VALUE_ACTIVE}`).textContent;

export const isLetterButton = (button) => button.className
  .includes(BUTTON_TYPE_PREFIX + BUTTON_TYPE_LETTER);

export const toggleButtonActiveValue = (button) => {
  const buttonValues = button.children;
  for (let i = 0; i < buttonValues.length; i += 1) {
    buttonValues[i].classList.toggle(`${BUTTON_VALUE_ELEMENT}_${BUTTON_VALUE_ACTIVE}`);
  }
};
