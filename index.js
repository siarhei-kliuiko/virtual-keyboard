import Keyboard from './js-modules/keyboard.js';

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
