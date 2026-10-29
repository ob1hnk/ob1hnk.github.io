const home = new URL("../", document.currentScript.src);

const back = document.createElement("a");
back.href = home;
back.className = "back";
back.textContent = "← home";

document.body.prepend(back);