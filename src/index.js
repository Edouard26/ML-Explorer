import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer, {
  setMode,
  setCurrentPanel,
  setSelectedCSV,
  setSelectedJSON,
  setInstructionsKeyCallback,
  setSaveStatus,
  setReserveLocation,
  setInstructionsDismissed,
  setFirehoseMetricsLogger
} from "./redux";
import { getDatasets } from "./datasetManifest";
import { parseCSV } from "./csvReaderWrapper";
import { parseJSON } from "./jsonReaderWrapper";
import { TestDataLocations } from "./constants";
import I18n from "./i18n";

export const store = createStore(rootReducer);

let saveTrainedModel = null;
let onContinue = null;

/**
 * @param {Object} options.i18n Optional. Object where each method returns the locale relevant
 * string to display. If this is not defined, an English string will be provided.
 */
export const initAll = function (options) {
  I18n.initI18n(options.i18n);
  // Handle an optional mode.
  const mode = options && options.mode;
  onContinue = options && options.onContinue;
  saveTrainedModel = options && options.saveTrainedModel;
  store.dispatch(setFirehoseMetricsLogger(options && options.logMetric));
  store.dispatch(
    setInstructionsKeyCallback(options && options.setInstructionsKey)
  );
  store.dispatch(setMode(mode));
  processMode(mode);

  const rootElement = document.getElementById('root');
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <Provider store={store}>
        <App
          mode={mode}
          onContinue={onContinue}
          startSaveTrainedModel={startSaveTrainedModel}
        />
      </Provider>
    );
  }
};

export const instructionsDismissed = function() {
  store.dispatch(setInstructionsDismissed());
}

// Process an optional mode.
const processMode = mode => {
  const assetPath = global.__ml_playground_asset_public_path__;
  let panelSet = false;

  if (mode) {
    // Load a single dataset immediately.
    if (mode.datasets && mode.datasets.length === 1) {
      const item = getDatasets().filter(item => {
        return item.id === mode.datasets[0];
      })[0];
      store.dispatch(setSelectedCSV(assetPath + item.path));
      store.dispatch(setSelectedJSON(assetPath + item.metadataPath));
      parseCSV(assetPath + item.path, true, false);

      // Also retrieve model metadata and set column data types.
      parseJSON(assetPath + item.metadataPath);

      if (mode.hideSelectLabel) {
        store.dispatch(setCurrentPanel("dataDisplayFeatures"));
      } else {
        store.dispatch(setCurrentPanel("dataDisplayLabel"));
      }
      panelSet = true;
    }

    if (mode.randomizeTestData) {
      store.dispatch(setReserveLocation(TestDataLocations.RANDOM))
    }
  }

  if (!panelSet) {
    store.dispatch(setCurrentPanel("selectDataset"));
  }
};

// Do the asynchronous save of a model.
const startSaveTrainedModel = dataToSave => {
  store.dispatch(setSaveStatus("started"));
  saveTrainedModel(dataToSave, response => {
    store.dispatch(setSaveStatus(response.status, response.data));
    if (response.status === "success") {
      store.dispatch(setCurrentPanel("modelSummary"));
    } else {
      store.dispatch(setCurrentPanel("saveModel"));
      console.log("Save data", response.data);
    }
  });
}