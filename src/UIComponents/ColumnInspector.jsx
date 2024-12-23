/*
  React component to handle displaying details, including data visualizations,
  for selected columns.
*/
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getCurrentColumnDetails } from "../selectors/currentColumnSelectors";
import { styles, ColumnTypes } from "../constants.js";
import ScatterPlot from "./ScatterPlot";
import CrossTab from "./CrossTab";
import ScrollableContent from "./ScrollableContent";
import ColumnDetailsNumerical from "./ColumnDetailsNumerical";
import ColumnDetailsCategorical from "./ColumnDetailsCategorical";
import ColumnDataTypeDropdown from "./ColumnDataTypeDropdown";
import AddFeatureButton from "./AddFeatureButton";
import SelectLabelButton from "./SelectLabelButton";
import UniqueOptionsWarning from "./UniqueOptionsWarning";
import { currentColumnInspectorShape } from "./shape";
import I18n from "../i18n";
import { getLocalizedColumnName } from "../helpers/columnDetails.js";

class ColumnInspector extends Component {
  static propTypes = {
    currentColumnDetails: currentColumnInspectorShape,
    currentPanel: PropTypes.string,
    datasetId: PropTypes.string
  };

  render() {
    const { currentColumnDetails, currentPanel, datasetId } = this.props;

    const selectingFeatures = currentPanel === "dataDisplayFeatures";
    const selectingLabel = currentPanel === "dataDisplayLabel";

    const isCategorical = currentColumnDetails && currentColumnDetails.dataType
      === ColumnTypes.CATEGORICAL;
    const isNumerical = currentColumnDetails && currentColumnDetails.dataType
      === ColumnTypes.NUMERICAL;

    if (!currentColumnDetails) {
      return null;
    }

    const localizedDataType = I18n.t(`columnType_${currentColumnDetails.dataType}`)
    const localizedColumnName = getLocalizedColumnName(datasetId, currentColumnDetails.id);

    return (
      currentColumnDetails && (
        <div
          id="column-inspector"
          style={{
            ...styles.panel,
            ...styles.rightPanel
          }}
        >
          <div style={styles.largeText}>{localizedColumnName}</div>
          <ScrollableContent>
            <div style={styles.cardRow}>
              <span style={styles.bold}>{I18n.t("columnInspectorDataType")}</span>
              <br />
              {currentColumnDetails.readOnly && localizedDataType}
              {!currentColumnDetails.readOnly && (
                <ColumnDataTypeDropdown
                  columnId={currentColumnDetails.id}
                  currentDataType={currentColumnDetails.dataType}
                />
              )}
            </div>
            {currentColumnDetails.description && (
              <div style={styles.cardRow}>
                <span style={styles.bold}>{I18n.t("columnInspectorDescription")}</span>
                &nbsp;
                <div>{currentColumnDetails.description}</div>
              </div>
            )}
            {selectingFeatures && (
              <div style={styles.cardRow}>
                <ScatterPlot />
                <CrossTab />
              </div>
            )}
            {isCategorical && <ColumnDetailsCategorical /> }
            {isNumerical && <ColumnDetailsNumerical /> }
          </ScrollableContent>
          {selectingLabel && currentColumnDetails.isSelectable && (
            <SelectLabelButton column={currentColumnDetails.id} />
          )}
          {selectingFeatures && currentColumnDetails.isSelectable && (
            <AddFeatureButton column={currentColumnDetails.id} />
          )}
          <UniqueOptionsWarning />
        </div>
      )
    );
  }
}

export default connect(
  state => ({
    currentColumnDetails: getCurrentColumnDetails(state),
    currentPanel: state.currentPanel,
    datasetId: state.metadata && state.metadata.name
  })
)(ColumnInspector);