const BUTTON_KEY_PREFIX = 'button_key_';
const BUTTON_TYPE_PREFIX = 'button_type_';
const BUTTON_TYPE_SPECIAL = 'special';
const BUTTON_VALUE_ELEMENT = 'button__value';
const BUTTON_VALUE_ACTIVE = 'active';

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
