import { Provider } from "jotai";

export default function StateProviderComp({ children }) {
  return <Provider>{children}</Provider>;
}
