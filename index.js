const pressed = [];
const secretCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

window.addEventListener("keyup", (e) => {
  pressed.splice(-secretCode.length - 1, pressed.length - secretCode.length);
  if (pressed.join("") === secretCode.join("")) {
    console.log("hooray");
  }
});
