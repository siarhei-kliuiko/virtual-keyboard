import Keyboard from './js-modules/keyboard.js';
import {
  setButtonPressedState,
  unSetButtonPressedState,
  getButtonKeyCode,
  BUTTON_SPECIAL_LSHIFT,
  BUTTON_SPECIAL_RSHIFT,
  BUTTON_SPECIAL_CAPS,
  isButtonInPressedState,
} from './js-modules/button.js';

const main = document.createElement('main');

const editorApp = document.createElement('div');
const editorAppClassName = 'editor-app';
editorApp.className = `${editorAppClassName} main__${editorAppClassName}`;

const textArea = document.createElement('textarea');
textArea.className = `${editorAppClassName}__textarea`;
textArea.addEventListener('blur', () => textArea.focus());
textArea.setAttribute('autofocus', '');
editorApp.append(textArea);

const keyboard = new Keyboard(editorAppClassName);
editorApp.append(keyboard.keyboardElement);

const description = document.createElement('p');
description.className = `${editorAppClassName}__description`;
description.innerText = 'Клавиатура была создана в ОС Windows 10';
editorApp.append(description);

const hotkeyInfo = document.createElement('p');
hotkeyInfo.className = `${editorAppClassName}__hotkey-info`;
hotkeyInfo.innerText = 'Комбинация для переключения языка: alt + shift';
editorApp.append(hotkeyInfo);

main.append(editorApp);
document.body.append(main);

const handleShiftPress = () => {
  setButtonPressedState(keyboard.getButton(BUTTON_SPECIAL_LSHIFT));
  setButtonPressedState(keyboard.getButton(BUTTON_SPECIAL_RSHIFT));
};

const handleShiftRelease = () => {
  unSetButtonPressedState(keyboard.getButton(BUTTON_SPECIAL_LSHIFT));
  unSetButtonPressedState(keyboard.getButton(BUTTON_SPECIAL_RSHIFT));
};

const buttonPress = (button) => {
  const buttonKeyCode = getButtonKeyCode(button);
  switch (buttonKeyCode) {
    case BUTTON_SPECIAL_CAPS:
      if (isButtonInPressedState(button)) {
        unSetButtonPressedState(button);
      } else {
        setButtonPressedState(button);
      }
      break;
    case BUTTON_SPECIAL_LSHIFT:
    case BUTTON_SPECIAL_RSHIFT:
      handleShiftPress();
      break;
    default:
      setButtonPressedState(button);
      break;
  }
};

const buttonRelease = (button, keyCode) => {
  if (isButtonInPressedState(button)) {
    switch (keyCode.toLowerCase()) {
      case BUTTON_SPECIAL_CAPS:
        break;
      case BUTTON_SPECIAL_LSHIFT:
      case BUTTON_SPECIAL_RSHIFT:
        handleShiftRelease();
        break;
      default:
        unSetButtonPressedState(button);
        break;
    }
  }
};

const processButtonMouseEvent = (event) => {
  const targetButton = event.target.closest('.button');
  if (targetButton) {
    switch (event.type) {
      case 'mousedown':
        buttonPress(targetButton);
        targetButton.addEventListener('mouseleave', processButtonMouseEvent);
        document.addEventListener('mouseup', processButtonMouseEvent);
        break;
      case 'mouseleave':
        document.removeEventListener('mouseup', processButtonMouseEvent);
        targetButton.removeEventListener('mouseleave', processButtonMouseEvent);
        buttonRelease(targetButton, getButtonKeyCode(targetButton));
        break;
      case 'mouseup':
        targetButton.removeEventListener('mouseleave', processButtonMouseEvent);
        buttonRelease(targetButton, getButtonKeyCode(targetButton));
        break;
      default:
        break;
    }
  }
};

keyboard.keyboardElement.addEventListener('mousedown', processButtonMouseEvent);
document.addEventListener('mouseup', processButtonMouseEvent);
