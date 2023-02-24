import React, { Component } from "react";
import events from "utils/events";
import "./userInformationDropdown.scss";
import { connect } from "react-redux";
import onClickOutside from "react-onclickoutside";

import getLanguage from "getLanguage.js";
import languages from "./languages";
import { logout } from "utils/logout";

const language = languages[getLanguage()];

const dummyUser = {
  name: "Treble user",
  email: "trebleuser@treble.ai",
};

class userInformationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: false,
    };
  }

  handleClickOutside = (event) => {
    this.setState({ toggle: false });
  };

  renderUserName() {
    if (!this.props.companyDisplayName) return;

    let name = this.props.companyDisplayName;
    let initialsOfName = "";

    name = name.split(" ");

    for (let i = 0; i < name.length; i++) {
      initialsOfName += name[i].charAt(0).toUpperCase();
    }

    return initialsOfName;
  }

  handleNewButton() {
    events.track("Click on product news", {});
    window.open(
      "https://www.notion.so/treble/Novedades-Enero-dcc4168d6e664be6a94848f5d7009069",
      "_blank"
    );
  }

  onSupportClick = () => {
    events.track("Click on support option", {});
    window.open("https://wa.me/12056192992", "_blank");
  };

  render() {
    let me = JSON.parse(localStorage.getItem("me"));
    if (!me) {
      me = dummyUser;
    }
    return (
      <div
        className={`client-information-container ${
          this.state.toggle ? "" : "not-active"
        }`}
        onClick={() => {
          this.setState({ toggle: !this.state.toggle });
        }}
      >
        <div className="company-display-name">
          <p>{this.props.companyDisplayName}</p>
        </div>
        <div className="client-name-container">
          <p>{this.renderUserName()}</p>
        </div>
        <div
          className={`client-expanded-information ${
            this.state.toggle ? "is-active" : " "
          }`}
        >
          <div className="client-main-info">
            <p className="initials">{this.renderUserName()}</p>
            <div className="email">
              <h6>{this.props.companyDisplayName}</h6>
              <p className="r">{me.email}</p>
            </div>
          </div>
          <div className="extras">
            <div className="extra" onClick={this.handleNewButton}>
              <div className="icon icon--rocket" />
              <p>{language.news}</p>
            </div>
            <div className="extra" onClick={this.onSupportClick}>
              <div className="icon icon--headset_mic" />
              <p>{language.support}</p>
            </div>
            <div className="extra" onClick={logout}>
              <div className="icon icon--logout" />
              <p>{language.logout}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  let me = JSON.parse(localStorage.getItem("me"));
  if (!me) me = dummyUser;
  return {
    companyDisplayName: me.company_display_name,
  };
};

const userInfo = connect(mapStateToProps)(
  onClickOutside(userInformationDropdown)
);

export default userInfo;
