import React from "react";
import CustomModal from "Components/CustomModal";
import PercentageBar from "Components/PercentageBar";
import getLanguage from "getLanguage.js";
import languages from "./languages";
import "./CompleteOnboardingModal.scss";

const language = languages[getLanguage()];
const me = JSON.parse(localStorage.getItem("me"));
const onboardingStage = me?.onboarding_stage;
const CompleteOnboardingModal = (props) => {
  const getModalBody = () => {
    return (
      <div className="onb-body">
        <h6>
          {onboardingStage == "SET_WABA" ? language.step0 : language.step1}
        </h6>
        <PercentageBar
          width={472}
          percentage={onboardingStage == "SET_WABA" ? 0 : 0.5}
        />
        <div className="image image--speaker" />
        <h5>{language.complete}</h5>
        <p>{language.warning}</p>
      </div>
    );
  };
  const getModalButtons = () => {
    return (
      <>
        <button
          className="blue"
          onClick={() => {
            window.location.href = "/onboarding";
          }}
        >
          {language.completeOnb}
        </button>
        <button
          className="transparent"
          onClick={() => {
            props.closeModal();
          }}
        >
          {language.completeLater}
        </button>
      </>
    );
  };

  return (
    <CustomModal
      show={props.show}
      title={""}
      body={getModalBody()}
      buttons={getModalButtons()}
      class={"complete-onboarding-modal"}
    />
  );
};

export default CompleteOnboardingModal;
