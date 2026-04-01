import { score, time } from "./match.js";

export function updateUI() {
  document.getElementById("score").innerText =
    `${score.A} - ${score.B}`;

  document.getElementById("timer").innerText =
    `Time: ${time}`;
}