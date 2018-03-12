function myCalculatorApp(params) {
    "use strict";

    // model
    var model = {
        targets: params.targets,
        validNumericKeys: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."],
        validOperatorKeys: ["+", "-", "*", "/", "=", "c"],
        userIn: null,
        memory: 0,
        consoleOut: 0,
        operator: null
    };

    function convertToNumber(s) {
        // Converts a string of
        // numbers, s <str>, to
        // a number <num>.
        return Number(s);
    }

    function convertToString(n) {
        // Converts a number
        // to a string.
        return n.toString();
    }

    function decimalCheck(uin) {
        // Takes in the current
        // user input from the
        // model <num> and checks
        // for more than one decimal.
        // Returns true or false <bool>.
        var toBeVerified = uin.toString();
        var index = 0;
        var decimalCount = 0;
        var isValid = false;

        // get the decimal count
        while (index < uin.length) {
            if (toBeVerified[index] === ".") {
                decimalCount += 1;
            }
            index += 1;
        }

        if (decimalCount <= 1) {
            isValid = true;
        }

        return isValid;
    }

    // controller functions
    function doOperation(stored, last, op) {
        // Takes in the operator <str>,
        // stored input <num> and last
        // input <num>. Returns the
        // solution <num>.
        var calculation = null;
        var n1 = stored;
        var n2 = last;

        if (op === "+") {
            calculation = n1 + n2;
        } else if (op === "-") {
            calculation = n1 - n2;
        } else if (op === "/") {
            calculation = n1 / n2;
        } else {
            calculation = n1 * n2;
        }
        return calculation;
    }

    function getUserInput(uin) {
        // Returns a valid key press
        // or user input <str>. If
        // not valid then returns null.
        // Takes in the raw user input <str>.
        var validInput = null;

        if (model.validNumericKeys.indexOf(uin) > -1 || model.validOperatorKeys.indexOf(uin.toLowerCase()) > -1) {
            validInput = uin;
        }
        return validInput;
    }

    function setUserIn(uin) {
        // Sets the validated user
        // input <str> into the
        // model as a number <num>.
        // validates stored data.
        var digits = "";

        if (uin !== ".") {
            // handle an integer
            if (model.userIn === null) {
                digits = uin;
                model.userIn = convertToNumber(digits);
            } else {
                digits = convertToString(model.userIn) + uin;
                model.userIn = Number(digits);
            }
        } else {
            // handle a float
            if (model.userIn === null) {
                model.userIn = uin;
            } else {
                digits = convertToString(model.userIn) + uin;
                if (decimalCheck(digits)) {
                    model.userIn = digits;
                }
            }
        }
    }

    function setMemory(storedInput) {
        // Sets the balance from the
        // existing input <num>.
        model.memory = storedInput;
    }

    function setOperator(uin) {
        // Sets the chosen operator
        // in the model <str>.
        model.operator = uin;
    }

    function setConsoleOut(item) {
        // Takes in any item <num>
        // to be stored in the model
        // <num> It could be user
        // input or a total.
        model.consoleOut = item;
    }

    function clearAll() {
        model.userIn = null;
        model.memory = 0;
        model.consoleOut = 0;
        model.operator = null;
    }

    // views
    function renderToConsole(uin) {
        // Displays numbers or
        // decimals in the console

        model.targets.console.innerText = uin;
    }

    // controller
    function main(uin) {
        // Takes in validated user input <str>.
        // Performs any of the following requested actions:
        // * clear all stacks
        // * basic math operations
        // * get a total
        // * enter and store user input
        // * render data to the console
        var total = 0;

        if (uin === "C") {
            // clear
            clearAll();
        } else if (model.validOperatorKeys.indexOf(uin) > -1 && uin !== "=") {
            // an operation request
            setOperator(uin);
            // move any stored input to memory
            if (model.userIn !== null) {
                setMemory(model.userIn);
            }
            // reset the stored input
            model.userIn = null;
        } else if (uin === "=") {
            // a total is requested
            if (model.userIn !== null && model.userIn !== ".") {
                total = doOperation(model.memory, model.userIn, model.operator);
                setConsoleOut(total);
                setMemory(total);
                model.userIn = null;
                model.operator = null;
            }
        } else {
            // handle numeric input
            setUserIn(uin);
            setConsoleOut(model.userIn);
        }

        // render
        renderToConsole(model.consoleOut);

        // debug
        if (params.inDev) {
            console.log("keypress:", uin, "userIn:", model.userIn, "operator:", model.operator, "memory:", model.memory, "consoleOut:", model.consoleOut);
        }
    }

    // user actions
    function clickKeys(index) {
        // handle clicks with mouse
        model.targets.keys[index].addEventListener("click", function (item) {
            var userInput = item.target.innerText;
            var validInput = getUserInput(userInput);

            if (validInput !== null) {
                main(validInput);
            }
        });
    }

    function pressKeys() {
        // handle input with the keys
        document.addEventListener("keypress", function (event) {
            const keyName = event.key;
            var validInput = getUserInput(keyName);

            if (validInput !== null) {
                main(validInput);
            }
        });
    }

    // init
    function init(m) {
        var keys = m.targets.keys;
        var index = 0;

        while (index < keys.length) {
            clickKeys(index);
            index += 1;
        }
        pressKeys();
    }
    init(model);
}
myCalculatorApp(calculatorApp);