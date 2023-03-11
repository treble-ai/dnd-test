import React, { useEffect, useState } from "react";
import CreateHSM2EventModal from "./Modals/CreateHSM2EventModal";

import "./SetHSM2inNode.scss";
import languages from "./languages.js";
import getLanguage from "getLanguage.js";
import { Button } from 'antd';

const language = languages[getLanguage()];

const SetHSM2inNode = (props) => {
  const [state, setState] = useState({
    showModal: false,
    isConfigured: false
  });

  useEffect(() => {
    const { hsm2Node, pendingLink } = props.node;
    if (!state.isConfigured && !hsm2Node) return;
    if ( hsm2Node && pendingLink) {
        createLinkForHSM2();
    } else if (!hsm2Node && state.isConfigured) {
        setState({...state, isConfigured: false});
    }

  }); 

  const renderComponent = () => {
    if (state.isConfigured) {
      return;
    } 
    return (
      <Button
        onClick={() => { setState({ ...state, showModal: true }) }}>
        Create HSM2
      </Button>
    )
  };

  const createHSM2 = (selectedHSM, timeType, timeInterval) => {
    const { node, diagramEngine } = props;
    const diagramModel = diagramEngine.getDiagramModel();
    const newNode = diagramEngine.instanceFactories.HSMNodeModel.getInstance();

    newNode.hsm = selectedHSM;
    node.hsm2TimeInterval = timeInterval;
    node.hsm2TimeType = timeType;
    node.hsm2Node = newNode;
    node.pendingLink = true;
    diagramModel.addNode(newNode);
    diagramModel.addNode(node);

    setState({
      ...state,
      showModal: false,
      isConfigured: true
    });

    diagramEngine.forceUpdate();
  }
  const createLinkForHSM2 = () => {
    console.log("xxx Entered callback");
    const { node, diagramEngine } = props;
    const diagramModel = props.diagramEngine.getDiagramModel();
    const newLink = diagramEngine.instanceFactories.LinkModel.getInstance();
    newLink.setSourcePort(node.getAnswerOpenPort());
    newLink.setTargetPort(node.hsm2Node.getInPort());
    diagramModel.addLink(newLink);
    node.pendingLink = false;
    diagramEngine.forceUpdate();
  }

  const renderCreateHSM2Modal = () => {
    return (
      <CreateHSM2EventModal
        show={state.showModal}
        onSubmit={createHSM2}
        closeModal={() => setState({ ...state, showModal: false })}
        node={props.node}
        forceUpdate={props.forceUpdate}
      />
    );
  };

  return (
    <div
      className="hsm-selector-block"
    >
      {renderComponent()}
      {renderCreateHSM2Modal()}
    </div>
  );
};

export default SetHSM2inNode;