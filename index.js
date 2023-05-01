import Keyboard from './js-modules/keyboard.js';
import {
  setButtonPressedState,
  unSetButtonPressedState,
  getButtonKeyCode,
  BUTTON_SPECIAL_LSHIFT,
  BUTTON_SPECIAL_RSHIFT,
  BUTTON_SPECIAL_CAPS,
  BUTTON_SPECIAL_BACKSPACE,
  BUTTON_SPECIAL_DEL,
  BUTTON_SPECIAL_TAB,
  BUTTON_SPECIAL_ENTER,
  BUTTON_SPECIAL_LCTRL,
  BUTTON_SPECIAL_RCTRL,
  BUTTON_SPECIAL_LALT,
  BUTTON_SPECIAL_RALT,
  BUTTON_SPECIAL_META,
  isButtonInPressedState,
  isSpecialButton,
  getButtonActiveValue,
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

let isShiftPressedWithMouse;
const handleShiftPress = (isPressedWithMouse) => {
  if (!keyboard.isButtonPressed(BUTTON_SPECIAL_LSHIFT)
    && !keyboard.isButtonPressed(BUTTON_SPECIAL_RSHIFT)) {
    isShiftPressedWithMouse = isPressedWithMouse;
    if (keyboard.isButtonPressed(BUTTON_SPECIAL_LALT, BUTTON_SPECIAL_RALT)) {
      keyboard.setLayout(localStorage.keyboardLayout === 'en' ? 'ru' : 'en');
    } else {
      keyboard.switchToAlternativeKeys();
      setButtonPressedState(keyboard.getButton(BUTTON_SPECIAL_LSHIFT));
      setButtonPressedState(keyboard.getButton(BUTTON_SPECIAL_RSHIFT));
    }
  }
};

const handleShiftRelease = (isReleasedWithMouse) => {
  if (isShiftPressedWithMouse === isReleasedWithMouse) {
    if (!keyboard.isButtonPressed(BUTTON_SPECIAL_LALT, BUTTON_SPECIAL_RALT)) {
      keyboard.switchToAlternativeKeys();
    }

    unSetButtonPressedState(keyboard.getButton(BUTTON_SPECIAL_LSHIFT));
    unSetButtonPressedState(keyboard.getButton(BUTTON_SPECIAL_RSHIFT));
  }
};

const addInputToTextArea = (char) => textArea
  .setRangeText(char, textArea.selectionStart, textArea.selectionEnd, 'end');

const removeCharFormTextArea = (fromCursorRight) => {
  let newCursorPos = textArea.selectionStart + (fromCursorRight ? 0 : -1);
  if (newCursorPos < 0) {
    newCursorPos = 0;
  }

  textArea.value = textArea.value.slice(0, newCursorPos)
    + textArea.value.slice(textArea.selectionStart + (fromCursorRight ? 1 : 0));
  textArea.setSelectionRange(newCursorPos, newCursorPos);
};

const handleSpecialButtonPress = (button, keyCode, isPressedWithMouse) => {
  switch (keyCode) {
    case BUTTON_SPECIAL_LSHIFT:
    case BUTTON_SPECIAL_RSHIFT:
      handleShiftPress(isPressedWithMouse);
      break;
    case BUTTON_SPECIAL_CAPS:
      keyboard.switchCase();
      break;
    case BUTTON_SPECIAL_BACKSPACE:
      removeCharFormTextArea(false);
      break;
    case BUTTON_SPECIAL_DEL:
      removeCharFormTextArea(true);
      break;
    case BUTTON_SPECIAL_TAB:
      addInputToTextArea('\t');
      break;
    case BUTTON_SPECIAL_ENTER:
      addInputToTextArea('\n');
      break;
    case BUTTON_SPECIAL_LCTRL:
    case BUTTON_SPECIAL_RCTRL:
    case BUTTON_SPECIAL_LALT:
    case BUTTON_SPECIAL_RALT:
    case BUTTON_SPECIAL_META:
      break;
    default:
      addInputToTextArea(getButtonActiveValue(button));
      break;
  }
};

const buttonPress = (button, isPressedWithMouse) => {
  const buttonKeyCode = getButtonKeyCode(button);
  if (isSpecialButton(button)) {
    handleSpecialButtonPress(button, buttonKeyCode, isPressedWithMouse);
  } else {
    addInputToTextArea(getButtonActiveValue(button));
  }

  if (buttonKeyCode === BUTTON_SPECIAL_CAPS && isButtonInPressedState(button)) {
    unSetButtonPressedState(button);
  } else {
    setButtonPressedState(button);
  }
};

const buttonRelease = (button, keyCode, isReleasedWithMouse) => {
  if (isButtonInPressedState(button)) {
    switch (keyCode.toLowerCase()) {
      case BUTTON_SPECIAL_CAPS:
        break;
      case BUTTON_SPECIAL_LSHIFT:
      case BUTTON_SPECIAL_RSHIFT:
        handleShiftRelease(isReleasedWithMouse);
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
        buttonPress(targetButton, true);
        targetButton.addEventListener('mouseleave', processButtonMouseEvent);
        document.addEventListener('mouseup', processButtonMouseEvent);
        break;
      case 'mouseleave':
        document.removeEventListener('mouseup', processButtonMouseEvent);
        targetButton.removeEventListener('mouseleave', processButtonMouseEvent);
        buttonRelease(targetButton, getButtonKeyCode(targetButton), true);
        break;
      case 'mouseup':
        targetButton.removeEventListener('mouseleave', processButtonMouseEvent);
        buttonRelease(targetButton, getButtonKeyCode(targetButton), true);
        break;
      default:
        break;
    }
  }
};

keyboard.keyboardElement.addEventListener('mousedown', processButtonMouseEvent);
document.addEventListener('mouseup', processButtonMouseEvent);

let prevKeyDownEvent;
const processKeyboardPressEvent = (event) => {
  if (prevKeyDownEvent && prevKeyDownEvent.type === event.type
    && prevKeyDownEvent.code === event.code) {
    return;
  }

  event.preventDefault();
  const targetButton = keyboard.getButton(event.code);
  if (targetButton) {
    switch (event.type) {
      case 'keydown':
        prevKeyDownEvent = event;
        buttonPress(targetButton, false);
        break;
      case 'keyup':
        prevKeyDownEvent = null;
        buttonRelease(targetButton, event.code, false);
        break;
      default:
        break;
    }
  }
};

document.addEventListener('keydown', processKeyboardPressEvent);
document.addEventListener('keyup', processKeyboardPressEvent);
