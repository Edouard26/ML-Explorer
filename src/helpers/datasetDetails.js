import I18n from "../i18n";

/* Helper functions for getting information about the selected dataset. */

export function getDatasetDetails(state) {
  const datasetDetails = {};
  datasetDetails.name = state.metadata && state.metadata.name;
  datasetDetails.description = getDatasetDescription(state);
  datasetDetails.numRows = state.data.length;
  datasetDetails.isUserUploaded = isUserUploadedDataset(state);
  datasetDetails.potentialUses = getPotentialUses(state);
  datasetDetails.potentialMisuses = getPotentialMisuses(state);
  return datasetDetails;
}

function getCardContextAttr(state, attr) {
  if (
    state.metadata &&
    state.metadata.name &&
    state.metadata.card &&
    state.metadata.card.context &&
    state.metadata.card.context[attr]
  ) {
    const datasetId = state.metadata.name;
    const fallback = state.metadata.card.context[attr];
    return I18n.t(attr,
      {
        scope: ["datasets", datasetId, "card", "context"],
        default: fallback
      }
    );
  }
  return undefined;
}
function getPotentialUses(state) {
  return getCardContextAttr(state, "potentialUses");
}

function getPotentialMisuses(state) {
  return getCardContextAttr(state, "potentialMisuses");
}

export function getDatasetDescription(state) {
  // If this a dataset from the internal collection that already has a description, use that.
  if (
    state.metadata &&
    state.metadata.name &&
    state.metadata.card &&
    state.metadata.card.description
  ) {
    const datasetId = state.metadata.name;
    const fallback = state.metadata.card.description;
    return I18n.t("description",
      {
        scope: ["datasets", datasetId, "card"],
        default: fallback
      }
    );
  } else if (
    state.trainedModelDetails &&
    state.trainedModelDetails.datasetDescription
  ) {
    return state.trainedModelDetails.datasetDescription;
  } else {
    return undefined;
  }
}

export function isUserUploadedDataset(state) {
  // The csvfile for internally curated datasets are strings; those uploaded by
  // users are objects. Use data type as a proxy to know which case we're in.
  return typeof state.csvfile === "object" && state.csvfile !== null;
}