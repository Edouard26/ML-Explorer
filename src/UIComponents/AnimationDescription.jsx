// AnimationDescription.jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { addSelectedFeature } from "../redux";
import PropTypes from "prop-types";
import I18n from "../i18n";
import { styles } from "../constants";

// Existing AddFeatureButton component
class AddFeatureButton extends Component {
  static propTypes = {
    addSelectedFeature: PropTypes.func.isRequired,
    column: PropTypes.string.isRequired
  };

  addFeature = (event, column) => {
    event.preventDefault();
    this.props.addSelectedFeature(column);
  };

  render() {
    const { column } = this.props;
    return (
      <button
        id="uitest-add-feature-button"
        type="button"
        onClick={(event) => this.addFeature(event, column)}
        style={styles.selectFeaturesButton}
      >
        {I18n.t("addFeatureButton")}
      </button>
    );
  }
}

export default connect(
  null,
  { addSelectedFeature }
)(AddFeatureButton);

// New TrainingAnimationDescription component
export class TrainingAnimationDescription extends Component {
  render() {
    return (
      <div style={styles.animationDescription}>
        {/* Add your animation description content here */}
        {I18n.t("trainingAnimationDescription")}
      </div>
    );
  }
}

TrainingAnimationDescription.propTypes = {
  // Define prop types if needed
};