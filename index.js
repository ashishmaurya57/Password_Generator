const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#number");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "!@#$%^&*()_{}?>|/.,><~`";

let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomNumber() {
  return getRandomInteger(0, 9).toString();
}

function generateLowercase() {
  return String.fromCharCode(getRandomInteger(97, 122));
}

function generateUppercase() {
  return String.fromCharCode(getRandomInteger(65, 90));
}

function generateSymbol() {
  const rand = getRandomInteger(0, symbols.length - 1);
  return symbols.charAt(rand);
}

function shufflePassword(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

function calcStrength() {
  let upper = false;
  let lower = false;
  let num = false;
  let sym = false;

  if (uppercaseCheck.checked) upper = true;
  if (lowercaseCheck.checked) lower = true;
  if (numberCheck.checked) num = true;
  if (symbolCheck.checked) sym = true;

  if (upper && lower && num && sym && passwordLength >= 8) {
    setIndicator("#0f0");
  } else if ((upper || lower) && (num || sym) && passwordLength >= 6) {
    setIndicator("#ff0");
  } else {
    setIndicator("#f00");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passDisplay.value);
    copyMsg.innerText = "Copied";
  } catch (error) {
    copyMsg.innerText = "Failed to copy";
  }

  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function handleCheckbox() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckbox);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passDisplay.value) {
    copyContent();
  }
});

generateBtn.addEventListener("click", () => {
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  password = "";

  const funcArr = [];

  if (uppercaseCheck.checked) {
    funcArr.push(generateUppercase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowercase);
  }
  if (numberCheck.checked) {
    funcArr.push(getRandomNumber);
  }
  if (symbolCheck.checked) {
    funcArr.push(generateSymbol);
  }

  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRandomInteger(0, funcArr.length - 1);
    password += funcArr[randIndex]();
  }

  const passwordArray = Array.from(password);
  shufflePassword(passwordArray);
  password = passwordArray.join("");
  passDisplay.value = password;
  calcStrength();
});
