import { createContext, ParentProps, useContext } from "solid-js";

const TestContext = createContext<string | null>(null)

export function TestContextProvider(props: ParentProps<{}>) {
  return (
    <TestContext.Provider value="Hello World">
      {props.children}
    </TestContext.Provider>
  );
}

export function useTestContext() {
  return useContext(TestContext);
}
