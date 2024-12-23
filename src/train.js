/* Generic machine learning handlers that route to the selected trainer. */

import KNNTrainer from "./trainers/KNNTrainer";

import { buildOptionNumberKey } from "./helpers/columnDetails.js";
import {
  setFeatureNumberKey,
  setTrainingExamples,
  setTrainingLabels,
  setAccuracyCheckExamples,
  setAccuracyCheckLabels
} from "./redux";
import { getSelectedCategoricalColumns } from "./selectors";
import {
  TestDataLocations,
  PERCENT_OF_DATASET_FOR_TESTING
} from "./constants.js";
import { getRandomInt } from "./helpers/utils.js";
import { convertValueForTraining } from "./helpers/valueConversion.js";

/* Builds a hash that maps selected categorical features to their option-
  number keys and dispatches that hash to the Redux store.
  @return {
    feature1: {
      option1 : 0,
      option2 : 1,
      option3: 2,
      ...
    },
    feature2: {
      option1 : 0,
      option2 : 1,
      ...
    }
  }
  */

const buildOptionNumberKeysByFeature = store => {
  const state = store.getState();
  let optionsMappedToNumbersByFeature = {};
  const categoricalColumnsToConvert = getSelectedCategoricalColumns(state);
  categoricalColumnsToConvert.forEach(
    feature =>
      (optionsMappedToNumbersByFeature[feature] = buildOptionNumberKey(
        state,
        feature
      ))
  );
  store.dispatch(setFeatureNumberKey(optionsMappedToNumbersByFeature));
};

/* Builds an array containing integer values associated with each feature's
  specific option in a given row.
  @param {object} row, entry from the dataset
  {
    labelColumn: option,
    featureColumn1: option,
    featureColumn2: option
    ...
  }
  @return {array}
  */
const extractTrainingExamples = (state, row) => {
  let exampleValues = [];
  state.selectedFeatures.forEach(feature =>
    exampleValues.push(convertValueForTraining(state, row[feature], feature))
  );
  return exampleValues;
};

const extractTrainingLabel = (state, row) => {
  const value = row[state.labelColumn];
  return convertValueForTraining(state, value, state.labelColumn);
};

const prepareTrainingData = store => {
  const updatedState = store.getState();
  const trainingExamples = updatedState.data.map(row =>
    extractTrainingExamples(updatedState, row)
  );
  const trainingLabels = updatedState.data.map(row =>
    extractTrainingLabel(updatedState, row)
  );
  /*
  Select X% of examples and corresponding labels from the training set to use for a post-training accuracy calculation.
  */
  const numToReserve = Math.ceil(
    trainingExamples.length * PERCENT_OF_DATASET_FOR_TESTING
  );
  let accuracyCheckExamples = [];
  let accuracyCheckLabels = [];
  if (updatedState.reserveLocation === TestDataLocations.END) {
    const index = -1 * numToReserve;
    accuracyCheckExamples = trainingExamples.splice(index);
    accuracyCheckLabels = trainingLabels.splice(index);
  }
  if (updatedState.reserveLocation === TestDataLocations.RANDOM) {
    let numReserved = 0;
    while (numReserved < numToReserve) {
      let randomIndex = getRandomInt(trainingExamples.length - 1);
      accuracyCheckExamples.push(trainingExamples[randomIndex]);
      trainingExamples.splice(randomIndex, 1);
      accuracyCheckLabels.push(trainingLabels[randomIndex]);
      trainingLabels.splice(randomIndex, 1);
      numReserved++;
    }
  }
  store.dispatch(setTrainingExamples(trainingExamples));
  store.dispatch(setTrainingLabels(trainingLabels));
  store.dispatch(setAccuracyCheckExamples(accuracyCheckExamples));
  store.dispatch(setAccuracyCheckLabels(accuracyCheckLabels));
};

const prepareTestData = store => {
  const updatedState = store.getState();
  let testValues = [];
  updatedState.selectedFeatures.forEach(feature =>
    testValues.push(
      convertValueForTraining(updatedState, updatedState.testData[feature], feature)
    )
  );
  return testValues;
};

let trainingState = {};
const init = store => {
  trainingState.trainer = new KNNTrainer(store);
  buildOptionNumberKeysByFeature(store);
  prepareTrainingData(store);
};

const onClickTrain = store => {
  trainingState.trainer.startTraining(store);
};

const onClickPredict = store => {
  const testValues = prepareTestData(store);
  trainingState.trainer.predict(testValues);
};

export default {
  init,
  onClickTrain,
  onClickPredict
};