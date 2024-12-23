/*
  Functions for calculating the accuracy of trained machine learning models
  based on the results returned from testing the model. "Grade" is "correct" or
  "incorrect". Categorical predicted and expected labels must match exactly to
  count as "correct". Numerical predicted and expected labels must be within 5%
  of the range of labels to count as "correct".
*/

import {
    ResultsGrades,
    REGRESSION_ERROR_TOLERANCE,
    MLTypes
  } from "../constants.js";
  import { getExtrema } from "./columnDetails.js";
  import {
    getConvertedLabels,
    getConvertedAccuracyCheckExamples
  } from "./valueConversion.js";
  import { isRegression } from "../redux.js"
  
  // Return results data so that it looks like regular data provided to the
  // DataTable.
  export function getResultsDataInDataTableForm(state) {
    const resultsByGrades = getAllResults(state);
  
    if (!resultsByGrades || resultsByGrades.examples.length === 0) {
      return null;
    }
  
    // None of the existing uses of this function should need more than 10
    // items.  Increase the value here if they do.
    const numItems = Math.min(10, resultsByGrades.examples.length);
  
    const results = [];
    for (var i = 0; i < numItems; i++) {
      results[i] = {};
  
      state.selectedFeatures.map((feature, index) => {
        results[i][feature] = resultsByGrades.examples[i][index];
      })
  
      results[i][state.labelColumn] = resultsByGrades.predictedLabels[i];
    }
  
    return results;
  }
  
  export function getAllResults(state) {
    return getResultsByGrade(state, ResultsGrades.ALL);
  }
  
  export function getCorrectResults(state) {
    return getResultsByGrade(state, ResultsGrades.CORRECT);
  }
  
  export function getIncorrectResults(state) {
    return getResultsByGrade(state, ResultsGrades.INCORRECT);
  }
  
  export function getResultsByGrade(state, grade) {
    const results = {};
    const accuracyGrades = getAccuracyGrades(state);
    const examples = getConvertedAccuracyCheckExamples(state).filter((example, index) => {
      return grade === ResultsGrades.ALL || grade === accuracyGrades[index];
    });
    const labels = getConvertedLabels(state, state.accuracyCheckLabels).filter((example, index) => {
      return grade === ResultsGrades.ALL || grade === accuracyGrades[index];
    });
    const predictedLabels = getConvertedLabels(state, state.accuracyCheckPredictedLabels).filter((example, index) => {
      return grade === ResultsGrades.ALL || grade === accuracyGrades[index];
    });
    results.examples = examples;
    results.labels = labels;
    results.predictedLabels = predictedLabels;
    return results;
  }
  
  export function getAccuracyGrades(state) {
    const grades = isRegression(state)
      ? getAccuracyRegression(state).grades
      : getAccuracyClassification(state).grades;
    return grades;
  }
  
  export function getSummaryStat(state) {
    let summaryStat = {};
    summaryStat.type = isRegression(state)
      ? MLTypes.REGRESSION
      : MLTypes.CLASSIFICATION;
    summaryStat.stat = getPercentCorrect(state);
    return summaryStat;
  }
  
  export function getPercentCorrect(state) {
    const percentCorrect = isRegression(state)
      ? getAccuracyRegression(state).percentCorrect
      : getAccuracyClassification(state).percentCorrect;
    return percentCorrect;
  }
  
  export function getAccuracyClassification(state) {
    let accuracy = {};
    let numCorrect = 0;
    let grades = [];
    const numPredictedLabels = state.accuracyCheckPredictedLabels
      ? state.accuracyCheckPredictedLabels.length
      : 0;
    for (let i = 0; i < numPredictedLabels; i++) {
      if (
        state.accuracyCheckLabels[i].toString() ===
        state.accuracyCheckPredictedLabels[i].toString()
      ) {
        numCorrect++;
        grades.push(ResultsGrades.CORRECT);
      } else {
        grades.push(ResultsGrades.INCORRECT);
      }
    }
    accuracy.percentCorrect = ((numCorrect / numPredictedLabels) * 100).toFixed(
      2
    );
    accuracy.grades = grades;
    return accuracy;
  }
  
  export function getAccuracyRegression(state) {
    let accuracy = {};
    let numCorrect = 0;
    let grades = [];
    const range = getExtrema(state.data, state.labelColumn).range;
    const errorTolerance = (range * REGRESSION_ERROR_TOLERANCE) / 100;
    const numPredictedLabels = state.accuracyCheckPredictedLabels.length;
    for (let i = 0; i < numPredictedLabels; i++) {
      const diff = Math.abs(
        state.accuracyCheckLabels[i] - state.accuracyCheckPredictedLabels[i]
      );
      if (diff <= errorTolerance) {
        numCorrect++;
        grades.push(ResultsGrades.CORRECT);
      } else {
        grades.push(ResultsGrades.INCORRECT);
      }
    }
    accuracy.percentCorrect = ((numCorrect / numPredictedLabels) * 100).toFixed(
      2
    );
    accuracy.grades = grades;
    return accuracy;
  }