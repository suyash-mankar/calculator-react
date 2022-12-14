import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./app.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

// reducer fnc
function reducer(state, { type, payload }) {
  switch (type) {
    // to show the digits when any digit is clicked
    case ACTIONS.ADD_DIGIT:
      // if the operation is finished and the evaluated value is in the output
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      // to prevent multiple 0 if the current operand has 0 as value
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      // to prevent multiple decimal
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    // to clear the display and states when "AC" btn is clicked
    case ACTIONS.CLEAR:
      return {};

    // to display the operator and calculate the evaluated value
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      // if prev operand is null, set the operation, prev operand as current operand and current operand as null
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      // if current operation is null then just change the operator
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      // evaluate the previous operand, set the operation which is clicked and set current operand as null
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    // to evaluate the operation when "=" btn is clicked
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.previousOperand == null ||
        state.currentOperand == null
      ) {
        return state;
      }

      // set prev operand and operation as null, evaluate the operation and set the value in current operand, and change the overwrite state to true
      return {
        ...state,
        previousOperand: null,
        operation: null,
        overwrite: true,
        currentOperand: evaluate(state),
      };

    // to delete the last clicked digit when "DEL" btn is clicked
    case ACTIONS.DELETE_DIGIT:
      // if the overwrite state is true, set current operator as null
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;

      // if only a single digit is present in current operand
      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }

      // remove the last digit from the current operand
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
  }
}

// To evaluate the operation
function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";

  // compute the value of the operation
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;

    case "-":
      computation = prev - current;
      break;

    case "*":
      computation = prev * current;
      break;

    case "/":
      computation = prev / current;
      break;

    case "%":
      computation = prev % current;
      break;
  }
  return computation.toString();
}

// To format the numbers with commas
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  // split the integer and decimal part of the operand
  const [integer, decimal] = operand.split(".");
  // if decimal part is null, format the integer part
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      {/* output display */}
      <div className="output">
        <div className="previous-operand">
          {formatOperand(previousOperand)}
          {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>

      {/* calculator buttons */}
      <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="%" dispatch={dispatch} />
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() =>
          dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: "0" } })
        }
      >
        0
      </button>
      <DigitButton digit="." dispatch={dispatch} />
      <button onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
