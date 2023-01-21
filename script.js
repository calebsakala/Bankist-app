'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Caleb Sakala',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Guest User',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1234,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////


// UPDATE UI FUNCTIONS 
// Create dates 
const createDate = function (acc) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  } 

  return new Intl.DateTimeFormat(acc.locale, options).format(new Date());
}

const calcDaysPassed = (date1, date2) => Math.trunc(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

const formatDates = function (date, acc) {

  let dateString;
  switch (calcDaysPassed(new Date(), date)) {
    case 0: dateString = `Today`;
      break;
    case 1: dateString = `Yesterday`;
      break;
    case 2: 
    case 3:
    case 4:
    case 5:
    case 6:
      dateString = `${calcDaysPassed(new Date(), date)} days ago`;
      break;
    case 7:
      dateString = `One week ago`;
      break;
    case 14:
      dateString = `Two weeks ago`;
      break;
    case 21:
      dateString = `Three weeks ago`;
      break;
    case 28:
    case 29:
    case 30:
    case 31:
      dateString = `One month ago`;
      break;
    default: 
      dateString = new Intl.DateTimeFormat(acc.locale).format(date);
  }

  return dateString;
}

const formatNumber = (locale, currency, number) => new Intl.NumberFormat(locale, {
  style: 'currency',
  currency: currency,
}).format(number);

// Display movements
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    
    const type = mov > 0 ? "deposit" : "withdrawal";
    const displayDate = formatDates(new Date(acc.movementsDates[acc.movements.indexOf(mov)]), currentAccount);
    const formattedMov = formatNumber(acc.locale, acc.currency, mov)
    
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i} ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

// Display summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((cumulativeValue, currentValue) => cumulativeValue + currentValue);
  labelSumIn.textContent = formatNumber(acc.locale, acc.currency, incomes);

  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce(
      (cumulativeValue, currentValue) => cumulativeValue + currentValue,
      0
    );
  labelSumOut.textContent = formatNumber(acc.locale, acc.currency, Math.abs(outgoing));

  const interests = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * (acc.interestRate / 100))
    .filter(interest => interest >= 1)
    .reduce(
      (cumulativeValue, currentValue) => cumulativeValue + currentValue,
      0
    );
  labelSumInterest.textContent = formatNumber(acc.locale, acc.currency, interests);
};

// Display balance 
const calcDisplayBalance = function (acc) {

  acc.balance = acc.movements.reduce(
    (accumulator, mov) => accumulator + mov,
    0
  );
  labelBalance.textContent = formatNumber(acc.locale, acc.currency, acc.balance);
};

// Creating a username for each account
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  });
};

createUserNames(accounts);



// Maximum value

const max = movements.reduce(
  (acc, mov) => (acc >= mov ? acc : mov),
  movements[0]
);

const updateUI = function (account) {
  // Display movements
  displayMovements(account);

  // Display balance
  calcDisplayBalance(account);

  // Display summary
  calcDisplaySummary(account);
  
  // Updating the date
  labelDate.textContent = createDate(account);

  // Clear the timer 
  timer = timer ? (clearInterval(timer), startLogOutTimer()) : startLogOutTimer();
};

// The current account + a variable that checks if there is a timer running.
let currentAccount, timer;

const startLogOutTimer = function () {
  
  // Setting time to 5 minutes (in seconds)
  let time = 300;

  // Defining the tick function
  const tick = function () {
    const minute = String(Math.trunc(time/60)).padStart(2, 0);
    // 1 is subtracted because the first call only happened after a second
    const second = String(time % 60).padStart(2, 0);

    // In each call, print the remaining time to UI
    labelTimer.textContent = `${minute}:${second}`;

    if (time === 0) {
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
      clearInterval(logOutTimer);
    }

    time--;

  }

  // Call the timer every second
  // It is called immediately and then every second afterwards 
  // both calls are needed since logOutTimer would only call it after one second
  tick();
  const logOutTimer = setInterval(tick, 1000);
  
  return logOutTimer;
}

// FAKE ALWAYS LOGGED IN --------------------------------------------------
// currentAccount = account1;
// updateUI(currentAccount)
// containerApp.style.opacity = 100;
// // ------------------------------------------------------------------------


// Event Handlers for Login 

btnLogin.addEventListener("click", function (e) {
  // Prevents the page from auto-reloading when you click login
  e.preventDefault();

  timer = timer ? (clearInterval(timer), startLogOutTimer()) : startLogOutTimer();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // Checks if the current account exists before checking if the PIN is correct
  if (currentAccount?.pin === +(inputLoginPin.value)) {
    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = "";

    // Moves the cursor away from the PIN
    inputLoginPin.blur();

    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    // Update the UI
    updateUI(currentAccount);
  } else alert(`Invalid username or password.`);
});

// Event Handlers for implementing transfers
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  // The amount and recipient's account must be selected first
  const amount = +(inputTransferAmount.value);
  const recipientAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  // Clear the input fields
  inputTransferAmount.value = inputTransferTo.value = "";

  // condition 3: the recipient account must -exist-
  if (
    amount > 0 &&
    currentAccount.balance > amount &&
    recipientAccount &&
    recipientAccount.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recipientAccount.movements.push(amount);

    // Add a new date (the current one) to both accounts
    // Store it in ISO format like the rest
    currentAccount.movementsDates.push(new Date().toISOString());
    recipientAccount.movementsDates.push(new Date().toISOString())
    
    // and update the UI
    updateUI(currentAccount);
  } else alert("Your transaction is unsuccesful.")
});

// Event Handlers for requesting a loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = +(inputLoanAmount.value);

  // Simulating approval time of a loan with a timer
  setTimeout(() => {
    // The amount has to be greater than 0 and
    // there must be a deposit with the value of at least 10% of the amount
    // being requested for the loan
    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
      currentAccount.movements.push(Math.floor(amount));

      // Add a new date (the current one)
      // Store it in ISO format like the rest
      currentAccount.movementsDates.push(new Date().toISOString());
      alert(`Your loan application was successful.`);
      // and update the UI
      updateUI(currentAccount);
    } else alert("Your loan application is unsuccessful.");
  }, 3500);
  

  // Clear the input fields
  inputLoanAmount.value = "";
});

// Event Handlers for closing an account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +(inputClosePin.value) === currentAccount.pin
  ) {
    // The index of the account to be deleted must be found
    // in the database
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  // Clearing the input fields
  inputCloseUsername.value = inputClosePin.value = "";
});

let sorted = false;

// Event Handlers for Sorting
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
