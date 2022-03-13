import React, { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

const initialState = {
  currentOperand: "",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    // THIS CODE DEALS WITH NUMBERS ON THE CALCULATOR
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false
        }
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    
    // THIS SECTION DEALS WITH CLEARING ITEMS FROM THE OUTPUT
    case ACTIONS.CLEAR:
        return {
          ...state,
          currentOperand: "0"
      }
      
    
    // THIS SECTION DEALS WITH DELETING ITEMS FROM THE OUTPUT
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
        
      }
      if (state.currentOperand == null) {
        return state
      }
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: "0"
        }
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }; 

    // THIS SECTION DEALS WITH SELECTING OPERATORS
    case ACTIONS.CHOOSE_OPERATION:
      if (state.previousOperand == null && state.currentOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null

      }
    
    //  THIS SECTION DELAS WITH COMPUTATION/EVALUATION
    case ACTIONS.EVALUATE:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null) {
        return state
      }
      return {
        ...state,
        previousOperand: null,
        overwrite: true,
        operation: null,
        currentOperand: evaluate(state)
      }
      return {};
    // default:
    //   return state;
  }
};

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "Delete-digit",
  EVALUATE: "evaluate",
};

const evaluate = ({previousOperand, currentOperand, operation}) => {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""

  let computation = ""
  switch (operation) {
    case "+": 
      computation = prev + current
      break
    case "-": 
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "/": 
      computation = prev / current
      break
  }

  return computation.toString()
}

// THIS SECTION DEALS WITH FORMATTING THE OUTPUT 

const integerFormatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

const formatOperand = (operand) => {
  if (operand == null) {
    return 
  }
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return integerFormatter.format(integer)
  return `${integerFormatter.format(integer)}.${decimal}`
}

function CounterOne() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );


  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(state.previousOperand)}
          {state.operation}{""}
        </div>
        <div className="current-operand">{formatOperand(state.currentOperand)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>Del</button>
      <OperationButton operation="/" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
  );
}

export default CounterOne;
