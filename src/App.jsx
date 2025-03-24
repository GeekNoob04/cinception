// import { Provider } from "react-redux";
// import Body from "./components/Body";
// import appStore from "./utils/appStore";

// function App() {
//   return (
//     <Provider store={appStore}>
//       <Body />
//     </Provider>
//   );
// }

// export default App;
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Body from "./components/Body";
import appStore, { persistor } from "./utils/appStore";

function App() {
  return (
    <Provider store={appStore}>
      <PersistGate loading={null} persistor={persistor}>
        <Body />
      </PersistGate>
    </Provider>
  );
}

export default App;
