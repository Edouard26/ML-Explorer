/* React component to handle selecting a column as the label. */
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { styles } from "../constants";
import { setLabelColumn } from "../redux";
import I18n from "../i18n";


class SelectLabelButton extends Component {
  static propTypes = {
    column: PropTypes.string,
    setLabelColumn: PropTypes.func.isRequired
  };

  setPredictColumn = (event, column) => {
    this.props.setLabelColumn(column);
    event.preventDefault();
  };


  render() {
    const { column } = this.props;

    return (
      <button
        id="uitest-select-label-button"
        type="button"
        onClick={event => this.setPredictColumn(event, column)}
        style={styles.selectLabelButton}
      >
        {I18n.t("selectLabelButton")}
      </button>
    )
  }
}

export default connect(
  state => ({}),
  dispatch => ({
    setLabelColumn(column) {
      dispatch(setLabelColumn(column));
    }
  })
)(SelectLabelButton);