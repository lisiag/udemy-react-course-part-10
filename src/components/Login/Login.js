import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (currentState, action) => {
  if (action.type === "USER_INPUT") {
    console.log("user input");
    return {
      value: action.value,
      isValid: action.value.includes("@"),
    };
  }
  if (action.type === "INPUT_BLUR") {
    console.log("input blur");
    return {
      value: currentState.value,
      isValid: currentState.value.includes("@"),
    };
  }
  return { value: "", isValid: false };
};

const Login = (props) => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(emailReducer, {
    value: "",
    isValid: undefined,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setFormIsValid(emailState.isValid && enteredPassword.trim().length > 6);
      console.log(`DEBUG checking validity`);
    }, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [emailState.value, enteredPassword]);

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: "USER_INPUT",
      value: event.target.value,
    });
  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);
  };

  // Here we depend on a state when we update another state. Not good practice. We could combine the
  // states into one so we can use the function format when we update, or use useRecuder.
  const validateEmailHandler = () => {
    dispatchEmail({
      type: "INPUT_BLUR",
      value: emailState.value,
    });
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
