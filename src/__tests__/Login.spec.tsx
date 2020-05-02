import Login from "../components/Login/Login";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { store } from "../store/index";
import { Provider } from "react-redux";
import { render, RenderResult } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
let component: RenderResult;
beforeEach(() => {
  component = render(
    <MemoryRouter>
      <Provider store={store}>
        <Login></Login>
      </Provider>
    </MemoryRouter>
  );
});

let badEmail1 = "blablablaaah";
let badEmail2 = "Poopie@dooop";
let goodEmail = "johnDoe52@gmail.com";

let badPassword = "password";
let insecurePassword = "Pass1234";
let securePassword = "p&Qp4*67[crBkL";

// test("it should have the correct state",()=>{
//   let instance = component.instance()
// })

test("the user should be able to type into the input fields and click the login button", async () => {
  // first test should test that component state got updated
  expect(component).toBeDefined();
  // get the
  let emailInput = component.getByLabelText("Email address");
  expect(emailInput).toBeDefined();
  let passwordInput = component.getByLabelText("Password");
  let loginButton = component.getByRole("button");
  // console.log("email label", emailInput);

  await userEvent.type(emailInput, badEmail1);
  expect(emailInput.value).toEqual(badEmail1);

  await userEvent.type(passwordInput, securePassword);
  expect(passwordInput.value).toEqual(securePassword);

  userEvent.click(loginButton);
  // expect(setStateSpy).toHaveBeenCalledTimes(badEmail1.length);
});
