function myCalculatorApp(params) {
    "use strict";

    // model
    var model = {
        targets: params.targets,
        validNumericKeys: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."],
        validOperatorKeys: ["+", "-", "*", "/", "=", "enter", "c", "m", "mr"],
        userIn: null,
        buffer: 0,
        memory: 0,
        consoleOut: 0,
        operator: null,
        status: null
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

        if (uin !== null) {
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
        } else {
            model.userIn = null;
        }
    }

    function setMemory(storedInput) {
        // Sets the memory from the
        // existing input <num>.
        model.memory = storedInput;
    }

    function getMemory() {
        // Get the stored memory.
        model.userIn = model.memory;
    }

    function setBuffer(storedInput) {
        // Sets the buffer from the
        // existing input <num>.
        model.buffer = storedInput;
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

    function setStatus(msg) {
        // Takes in a status message <str>
        model.status = msg;
    }

    function clearAll() {
        // hard reset
        model.userIn = null;
        model.buffer = 0;
        model.consoleOut = 0;
        model.operator = null;
        model.memory = 0;
        model.status = null;
    }

    // views
    function renderToConsole(uin) {
        // Displays numbers or
        // decimals in the console
        model.targets.console.innerText = uin;

        if (model.status !== null && model.memory !== 0) {
            model.targets.status.innerText = model.status;
        } else {
            model.targets.status.innerText = "";
        }
    }

    function renderKeyActive(target) {
        // Displays the keypress view.
        // Takes in the target id <str>
        target.classList.add("keypress");
        setTimeout(function () {
            target.classList.remove("keypress");
        }, 200);
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
        } else if (model.validOperatorKeys.indexOf(uin) > -1 && uin !== "=" && uin !== "Enter") {
            // an operation request
            setOperator(uin);
            // move any stored input to the buffer
            if (model.userIn !== null) {
                setBuffer(model.userIn);
            }
            // reset the stored input
            setUserIn(null);
        } else if (uin === "M") {
            // the current console output is stored to memory
            setMemory(model.consoleOut);
            setStatus("m");
        } else if (uin === "MR") {
            // the memory buffer is envoked
            setConsoleOut(model.memory);
            setStatus("m");
            getMemory();
        } else if (uin === "=" || uin === "Enter") {
            // a total is requested
            if (model.userIn !== null && model.userIn !== ".") {
                total = doOperation(model.buffer, model.userIn, model.operator);
                setConsoleOut(total);
                setBuffer(total);
                setUserIn(null);
                setOperator(null);
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
            console.log("keypress:", uin, "userIn:", model.userIn, "operator:", model.operator, "buffer:", model.buffer, "memory:", model.memory, "consoleOut:", model.consoleOut, "status:", model.status);
        }
    }

    // user actions
    function clickKeys(index) {
        // handle clicks with mouse
        model.targets.keys[index].addEventListener("click", function (item) {
            var userInput = item.target.innerText;
            var validInput = getUserInput(userInput);

            if (validInput !== null) {
                renderKeyActive(item.target);
                main(validInput);
            }
        });
    }

    function pressKeys() {
        // handle input with the keys
        document.addEventListener("keypress", function (item) {
            const keyName = item.key;
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

        // cycle through keys and get user actions
        while (index < keys.length) {
            clickKeys(index);
            index += 1;
        }
        pressKeys();
    }
    init(model);
}
myCalculatorApp(calculatorApp);