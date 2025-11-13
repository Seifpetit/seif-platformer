//----------------------------------------------------------
// [CORE] Input Update Module
//- capture raw human input (keyboard + mouse etc...)
//- normalizes to R.input snapshot evyry frame 
//----------------------------------------------------------  
import { R } from "../core/runtime.js";

export function updateInput(p) {

  //------{mouse}--------------------------------------

  const prevX = R.input.mouseX;
  const prevY = R.input.mouseY;

  R.input.mouse.x = p.mouseX;
  R.input.mouse.y = p.mouseY;
  R.input.mouse.dx = R.input.mouseX - prevX;
  R.input.mouse.dy = R.input.mouseY - prevY;
  R.input.mouse.pressed = p.mouseIsPressed;
  R.input.mouse.button = p.mouseButton;

  //------{touch}--------------------------------------

  R.input.touch.active = p.touch?.length > 0;
  R.input.touch.points = p.touch?.map(t => ({ id: t.id, x: t.x, y: t.y })) || [];

  //------{gamepad}------------------------------------

  const gp = navigator.getGamepads ? navigator.getGamepads()[0] : null;
  if (gp) {
    R.input.gamepad.connected = true;
    R.input.gamepad.buttons = gp.buttons.map(b => b.pressed);
    R.input.gamepad.axes = gp.axes.slice(0, 2);
  } else {
    R.input.gamepad.connected = false;
  }

  //------{keyboard}-----------------------------------

  const keys = R.input.keyboard;
  R.input.actions.moveX = 
    (keys['ArrowRight'] || keys['d'] ? 1 : 0) -
    (keys['ArrowLeft']  || keys['a'] ? 1 : 0);
  R.input.actions.moveY = 
    (keys['ArrowDown'] || keys['s'] ? 1 : 0) -
    (keys['ArrowUp']   || keys['w'] ? 1 : 0);
  R.input.actions.paint = R.input.mouse.pressed || R.input.touch.active;

}

export function registerKeyboard(p) {
  if (!R.input) R.input = {};
  R.input.keyboard = {};

  p.keyPressed = () => {
    let k = p.key?.toLowerCase?.() || '';
    if (!k && p.keyCode === 17) k = 'control';
    if (!k && p.keyCode === 91) k = 'meta'; // CMD on mac
    if (!k && p.keyCode === 18) k = 'alt';
    if (!k && p.keyCode === 16) k = 'shift';
    R.input.keyboard[k] = true;
  };

  p.keyReleased = () => {
    let k = p.key?.toLowerCase?.() || '';
    if (!k && p.keyCode === 17) k = 'control';
    if (!k && p.keyCode === 91) k = 'meta';
    if (!k && p.keyCode === 18) k = 'alt';
    if (!k && p.keyCode === 16) k = 'shift';
    R.input.keyboard[k] = false;
  };
}




