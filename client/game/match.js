export let score = { A:0, B:0 };
export let time = 90;

export function initMatch() {
  setInterval(() => {
    if (time > 0) time--;
  }, 1000);
}