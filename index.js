const prompt = require('prompt-sync')({ sigint: true });
const colors = require('colors');

let userName;
let attempts = 0;
let totalRounds = 0;

function startGame() {
	console.clear();
	attempts = 0;
	if (userName === undefined) {
		// for the first round
		console.log(colors.bold('Welcome to the Bulls & Cows game!\n'));
		userName = prompt('What is your name? ');
		if (userName === '') {
			userName = 'Stranger';
			console.log(`Hello ${userName}\n`);
		} else {
			userName =
				userName[0].toUpperCase() + userName.slice(1).toLowerCase();
			console.log(`Hello ${userName}!\n`);
		}

		console.log('Bulls & Cows is a really funny game.');
		let instructions = prompt('Do you want to read the instructions? y/n ');
		if (instructions.toLowerCase() === 'y' || instructions === '') {
			console.clear();
			printInstructions();
		} else {
			console.clear();
			let numberToGuess = createNumber();
			checkNumbers(numberToGuess);
		}
	} else {
		let numberToGuess = createNumber();
		checkNumbers(numberToGuess);
	}
}
function exitGame() {
	console.log('Thank you for playing! Bye!');
}
function printInstructions() {
	console.log(
		'The goal is to guess a secret number.\nThis number consists of 4 digits where each digit is unique.\nAfter each guess you make, you will get a hint to help you guess better next time around.\nThe hint tells you how many bulls and how many cows there were.\nWhat are bulls and cows?\n- If there are any matching digits and they are in their right positions, they are counted as "bulls".\n- If they are in different positions, they are counted as "cows".\n'
	);
	let play = prompt(`Are you ready to play? y/n `);
	if (play.toLowerCase() === 'y' || play === '') {
		let numberToGuess = createNumber();
		console.clear();
		checkNumbers(numberToGuess);
	} else {
		console.log('Thank you for coming! Bye!');
	}
}

function playAgain() {
	let playAgain = prompt('\nDo you want to play again? y/n ');
	if (playAgain.toLowerCase() === 'y' || playAgain === '') {
		startGame();
	} else if (playAgain.toLowerCase() === 'n') {
		exitGame();
	}
}

function createNumber() {
	let randomValue = [];
	let number = '';
	while (number.length < 4) {
		let newDigit = Math.floor(Math.random() * 10);
		if (!number.includes(newDigit)) {
			number += newDigit;
			randomValue.push(newDigit);
		}
	}
	return randomValue;
}

function randomMessages() {
	let messages = [
		`Sorry ${userName} but you got no bull and no cow, you can try again.`,
		`Dramatic! None of your digit matches ${userName}, try again!`,
		`No bull, no cow, you can do better next try ${userName}.`,
		`This is just the worst guess ever ${userName}, give it another try.`,
		`Bad luck ${userName}! no bull, no cow, try harder!`,
		`Oh sorry ${userName}! this is just a terrible guess!`,
		`Are you sure you want to play with such a bad luck ${userName}?`,
	];
	console.log(
		colors.red(messages[Math.floor(Math.random() * messages.length)])
	);
}

function checkNumbers(numberToGuess) {
	let guess;
	let numberToGuessToNumber = Number(numberToGuess.join(''));

	//console.log('Number to guess :', numberToGuess);
	console.log('Number to guess : [* * * *]');

	do {
		guess = prompt('What is your guess? ');
		let bulls = 0;
		let cows = 0;
		let checkGuess = guess.split('');

		// cannot type the same number twice
		function maxNumbers(input) {
			let obj = {};
			let x = 0;
			for (let i = 0; i < input.length; i++) {
				if (obj[input[i]] === undefined) {
					obj[input[i]] = 1;
				} else {
					obj[input[i]]++;
					x = i;
				}
			}
			return x === 0;
		}
		maxNumbers(guess);

		//no letters / symbols in input
		if (Number.isNaN(Number(guess))) {
			console.log(colors.red('Please enter ONLY digits!\n'));
			//checkNumbers(numberToGuess);
		}
		// each digit once
		else if (maxNumbers(checkGuess) === false && checkGuess.length === 4) {
			console.log(colors.red('You can use each digit only ONCE!\n'));
			//checkNumbers(numberToGuess);
		}
		// four digits max
		else if (checkGuess.length > 4) {
			console.log(colors.red('Please enter ONLY FOUR digits!\n'));
			//checkNumbers(numberToGuess);
		}
		// four digits min
		else if (checkGuess.length < 4) {
			console.log(colors.red('Please enter AT LEAST FOUR digits!\n'));
			//checkNumbers(numberToGuess);

			// Bulls and cows loops
		} else {
			for (let i = 0; i < numberToGuess.length; i++) {
				for (let j = 0; j < guess.length; j++) {
					if (
						Number(numberToGuess[i]) === Number(guess[j]) &&
						i !== j
					) {
						cows++;
					}
					if (
						Number(numberToGuess[i]) === Number(guess[j]) &&
						i === j
					) {
						bulls++;
					}
				}
			}
			// output
			if (bulls === 4) {
				console.log(
					colors.rainbow(
						`\nCongratulations ${userName}! you won the game!\n`
					)
				);
				console.log(
					`You guessed the number ${numberToGuess.join('')}\n`
				);
				attempts++;
				totalRounds++;
				console.log('Total attempts:', attempts);
				console.log('Total rounds:', totalRounds);
				playAgain();
			} else if (cows === 0 && bulls === 0) {
				randomMessages();
				attempts++;
				console.log('Attempts:', attempts);
			} else {
				if (cows > 1 && bulls > 1) {
					console.log(
						colors.blue(
							`${guess} You got ${cows} cows and ${bulls} bulls.`
						)
					);
				}
				if (cows < 2 && bulls > 1) {
					console.log(
						colors.blue(
							`${guess} You got ${cows} cow and ${bulls} bulls.`
						)
					);
				}
				if (cows > 1 && bulls < 2) {
					console.log(
						colors.blue(
							`${guess} You got ${cows} cows and ${bulls} bull.`
						)
					);
				}
				if (cows < 2 && bulls < 2) {
					console.log(
						colors.blue(
							`${guess} You got ${cows} cow and ${bulls} bull.`
						)
					);
				}
				attempts++;
				console.log('Attempts:', attempts, '\n');
			}
		}
	} while (Number(guess) !== numberToGuessToNumber);
}

console.log('Total rounds played:', totalRounds);
startGame();
