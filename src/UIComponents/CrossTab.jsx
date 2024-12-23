/*
  React component to render a special kind of crosstab table, with a row for
  each active combination of features values, and corresponding percentage of
  label values, with a heatmap style applied.
*/
import React, { Component } from "react";
import { connect } from "react-redux";
import { getCrossTabData } from "../selectors/visualisationSelectors";
import { styles } from "../constants.js";
import ScrollableContent from "./ScrollableContent";
import { crossTabDataShape } from "./shape";
import I18n from "../i18n";

class CrossTab extends Component {
  static propTypes = {
    crossTabData: crossTabDataShape
  };

  getCellStyle = percent => {
    return {
      ...styles["crossTabCell" + Math.round(percent / 20)],
      ...styles.crossTabTableCell
    };
  };

  render() {
    const { crossTabData } = this.props;

    // There are a few criteria that affect how big the table looks.  We'll not
    // render it if any of them are exceeded.
    // First, how many columns are there on the left side.
    const maxFeaturesInTable = 5;
    // Second, how many columns are there in the main table.
    const maxUniqueLabelValues = 5;
    // Third, how many rows are there.
    const maxResults = 5;

    const showTable =
      crossTabData &&
      crossTabData.featureNames.length <= maxFeaturesInTable &&
      crossTabData.uniqueLabelValues.length <= maxUniqueLabelValues &&
      crossTabData.results.length <= maxResults;

    return (
      <div id="cross-tab">
        {crossTabData && !showTable && (
          <div>
            <div style={styles.bold}>{I18n.t("crossTabRelationshipHeader")}</div>

            <div>{I18n.t("crossTabTooMuchData")}</div>
            <br />
          </div>
        )}

        {showTable && (
          <div>
            <div style={styles.bold}>{I18n.t("crossTabRelationshipHeader")}</div>
            <ScrollableContent>
              <table style={styles.crossTabTable}>
                <thead>
                  <tr>
                    <th style={styles.crosssTabHeader} />
                    <th
                      style={styles.crosssTabHeader}
                      colSpan={crossTabData.featureNames.length}
                    >
                      &nbsp;
                    </th>
                    <th
                      colSpan={crossTabData.uniqueLabelValues.length}
                      style={{ ...styles.crosssTabHeader, ...styles.bold }}
                    >
                      {crossTabData.labelName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td rowSpan={crossTabData.results.length + 1}>
                      <div
                        style={{
                          ...styles.bold,
                          ...styles.crossTabLeftColumn
                        }}
                      >
                        {crossTabData.featureNames[0]}
                      </div>
                    </td>
                    <td />
                    {crossTabData.uniqueLabelValues.map(
                      (uniqueLabelValue, index) => {
                        return (
                          <td key={index} style={styles.tableCell}>
                            {uniqueLabelValue}
                          </td>
                        );
                      }
                    )}
                  </tr>
                  {crossTabData.results.map((result, resultIndex) => {
                    return (
                      <tr key={resultIndex}>
                        {result.featureValues.map(
                          (featureValue, featureIndex) => {
                            return (
                              <td key={featureIndex} style={styles.tableCell}>
                                {featureValue}
                              </td>
                            );
                          }
                        )}
                        {crossTabData.uniqueLabelValues.map(
                          (uniqueLabelValue, labelIndex) => {
                            return (
                              <td
                                key={labelIndex}
                                style={this.getCellStyle(
                                  result.labelPercents[uniqueLabelValue]
                                )}
                              >
                                {result.labelPercents[uniqueLabelValue] || 0}%
                              </td>
                            );
                          }
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ScrollableContent>
          </div>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  crossTabData: getCrossTabData(state)
}))(CrossTab);