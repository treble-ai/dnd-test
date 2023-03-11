import React from "react";

import "./styles-v2.scss";
import FileViewer from "react-file-viewer";

import InputPortWidget from "./InputPortWidget";
import AnswerPortWidget from "./AnswerPortWidget";
import { Droppable, Draggable, DragDropContext } from "react-beautiful-dnd";
import { DefaultNodeModel, DefaultPortModel } from "DDCanvas/main";
import SetGoalInNode from "Components/SetGoalInNode";
import SetHSM2inNode from "Components/SetHSM2inNode";
import CreateHSM2EventModal from "Components/Modals/CreateHSM2EventModal";
import { Button } from 'antd';

import events from "utils/events";

import languages from "./languages.js";
import getLanguage from "getLanguage.js";
const language = languages[getLanguage()];
const currentLanguage = getLanguage();
export class HSMNodeWidget extends React.Component {
  constructor(props) {
    super(props);
    this.changeDrag = this.changeDrag.bind(this);
    this.state = {
      canDrag: false,
      showModal: false,
    };
  } 

  renderInputPort() {
    const { node } = this.props;
    const port = node.getInPort();

    if (!port) return;

    return <InputPortWidget name={port.name} port={port} />;
  }

  renderMediaContainer() {
    const { node } = this.props;

    if (node.hsm.header == undefined || node.hsm.header?.type == "text") return;

    const file_url = node.hsm.header.url;
    const file_type = node.hsm.header.type;
    const file_name = "header";

    let containerContent = null;

    if (file_type == "image") {
      containerContent = (
        <div>
          <img src={file_url} />
        </div>
      );
    }
    if (file_type == "video") {
      containerContent = (
        <div>
          <video
            controls
            src={file_url}
            controlsList="nofullscreen nodownload noremoteplayback"
          />
        </div>
      );
    }
    if (file_type == "raw") {
      let splitUrl = file_url.split(".");
      let fileExt = splitUrl[splitUrl.length - 1];
      let supportedExt = ["pdf", "csv", "xlsx", "docx"];
      if (!supportedExt.includes(fileExt)) {
        fileExt = "other-extension";
      }
      let sheetExt = ["csv", "xlsx"];

      class UnsupportedExtensionComponent extends React.Component {
        render() {
          return <i className="icon icon--unsupported-extension"></i>;
        }
      }

      containerContent = (
        <div className="file-previewer">
          <FileViewer
            fileType={sheetExt.includes(fileExt) ? null : fileExt}
            filePath={file_url}
            unsupportedComponent={UnsupportedExtensionComponent}
          />
          <div className="file-info">
            <i className={`icon icon--${fileExt}`}></i>
            <a href={file_url} target="_blank">
              {file_name}
            </a>
          </div>
        </div>
      );
    }

    return <div className="question-node--media">{containerContent}</div>;
  }

  renderAnswerOpenPort() {
    const { node } = this.props;
    const answerOpenPort = node.getAnswerOpenPort();

    if (!answerOpenPort) return null;

    return (
      <AnswerPortWidget
        diagramEngine={this.props.diagramEngine}
        port={answerOpenPort}
        key={answerOpenPort.getID()}
      />
    );
  }

  onDragEnd(result, node) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    let diagramModel = this.props.diagramEngine.getDiagramModel();
    diagramModel.deactivateHistory();
    node.movePortFromToIndex(result.source.index, result.destination.index);
    diagramModel.activateHistory();
    diagramModel.pushToHistory();
    events.track("Switch answers order");
    this.setState({ canDrag: false });
    this.props.diagramEngine.forceUpdate();
  }

  changeDrag(newDrag) {
    this.setState({ canDrag: newDrag });
  }
  renderButtonsTittle(node) {
    if (node.hsm.buttons?.type != "quick_reply") return;
    return <p className="section-title">{language.buttons}</p>;
  }

  renderAnswerClosedPorts() {
    const { node } = this.props;

    if (typeof node.getOrderedClosedPorts !== "function") return;

    const answerClosedPorts = node.getOrderedClosedPorts();
    if (!answerClosedPorts.length) return null;
    return (
      <>
        {this.renderButtonsTittle(node)}
        <DragDropContext
          onDragEnd={(result) => this.onDragEnd(result, node)}
          onDragUpdate={() => this.props.diagramEngine.forceUpdate()}
        >
          <Droppable
            droppableId={`answer-closed-port-container-${node.getID()}`}
            key={`answer-closed-port-container-${node.getID()}`}
            renderClone={(provided, snapshot, rubric) => (
              <div id="dragging-answer-port">
                <AnswerPortWidget
                  diagramEngine={this.props.diagramEngine}
                  port={answerClosedPorts[rubric.source.index]}
                  key={answerClosedPorts[rubric.source.index].getID()}
                  innerRef={provided.innerRef}
                  provided={provided}
                  style={provided.draggableProps.style}
                  disabled={true}
                />
              </div>
            )}
          >
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                key={`answer-closed-port-container-div-${node.getID()}`}
              >
                {answerClosedPorts.map((port, index) => (
                  <Draggable
                    draggableId={`answer-closed-port-${port.getID()}`}
                    index={index}
                    key={`answer-closed-port-${port.getID()}`}
                    isDragDisabled={true}
                  >
                    {(provided, snapshot) => (
                      <AnswerPortWidget
                        diagramEngine={this.props.diagramEngine}
                        port={port}
                        key={port.getID()}
                        innerRef={provided.innerRef}
                        provided={provided}
                        changeDrag={this.changeDrag}
                        disabled={true}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </>
    );
  }

  renderDefaultClosedAnswerPort() {
    const { node } = this.props;
    const defaultPort = node.getDefaultClosedAnswerPort();

    if (!defaultPort) return null;

    return (
      <div className="default-answer-port-container">
        <AnswerPortWidget
          diagramEngine={this.props.diagramEngine}
          port={defaultPort}
          key={defaultPort.getID()}
        />
      </div>
    );
  }

  renderTextarea() {
    const { node } = this.props;
    return (
      <div className="hsm-textarea-container">
        <p className="header">
          {" "}
          {node.hsm.header?.text ? node.hsm.header.text : ""}
        </p>
        <p className="body">{node.hsm.content}</p>
        <p className="footer">
          {node.hsm.footer?.text ? node.hsm.footer.text : ""}
        </p>
      </div>
    );
  }

  renderCallToActionButtons() {
    const { node } = this.props;
    if (node.hsm.buttons?.type != "call_to_action") return;

    return (
      <div className="buttons-container">
        <p className="tr">{language.actions}</p>
        {node.hsm.buttons.options.map((button) => {
          return (
            <div className="action-button">
              <div className={`icon icon--${button.url ? "web" : "phone"}`} />
              <p className="r">{button.text}</p>
            </div>
          );
        })}
      </div>
    );
  }

  editHSM2(selectedHSM, timeType, timeInterval) {
    const { node, diagramEngine } = this.props;
    console.log("hsm2Node pre  Edit");
    console.dir(node);
    const diagramModel = diagramEngine.getDiagramModel();
    node.hsm2Node.hsm = selectedHSM;
    node.hsm2TimeInterval = timeInterval;
    node.hsm2TimeType = timeType;
    diagramModel.addNode(node.hsm2Node);
    diagramModel.addNode(node);
    console.log("Node POST Edit");
    console.dir(node);
    this.setState({ showModal: false });

    diagramEngine.forceUpdate();
  }

  deleteHSM2() {
    const { node, diagramEngine } = this.props;
    const diagramModel = diagramEngine.getDiagramModel();
    diagramModel.removeNode(node.hsm2Node);
    delete node.hsm2Node;
    delete node.hsm2TimeInterval;
    delete node.hsm2TimeType;
    console.log("Node after Delete");
    console.dir(node);
    diagramEngine.forceUpdate();
  }

  renderHSM2ActionButtons() {
    const { node } = this.props;
    if (node.hsm2Node) {
      let string = "In " + node.hsm2TimeInterval + " " + node.hsm2TimeType;
      return (
        <div>
          <p>{string}</p>
          <Button
            onClick={
              () => { this.setState({ showModal: true }) }
            }>Edit</Button>
          <Button onClick={this.deleteHSM2.bind(this)}>Delete</Button>
        </div>
      );
    }
    return;
  }

  renderEditHSM2Modal() {
    const { node } = this.props;
    return (
      <CreateHSM2EventModal
        node={node}
        onSubmit={this.editHSM2.bind(this)}
        show={this.state.showModal}
        closeModal={() => this.setState({ showModal: false })}
      ></CreateHSM2EventModal>
    )
  }

  render() {
    
    const { node } = this.props;
    console.log("language: ", currentLanguage);
    const answerOpenPort = node.getAnswerOpenPort();

    const { color } = node;
    const style = {};
    if (color) {
      style.background = color;
    }
    const fileInputId =
      "question-node-widget-inpt-file-attach-" + this.props.node.getID();

    return (
      <div className="whole-question-container">
        <div className="change-question-type-container">
          <SetGoalInNode
            node={node}
            forceUpdate={this.forceUpdate.bind(this)}
          />
          <SetHSM2inNode
            node={node}
            diagramEngine={this.props.diagramEngine}
            forceUpdate={this.forceUpdate.bind(this)}
          />
        </div>
        <div
          className="question-node-v2 node-v2 hsm"
          id="question-node-open"
          data-nodeid={node.getID()}
        >
          <div className="textarea-wrapper">
            {this.renderInputPort()}
            {this.renderMediaContainer()}
            {this.renderTextarea()}
            {this.renderAnswerOpenPort()}
          </div>
          {this.renderAnswerClosedPorts()}
          {this.renderDefaultClosedAnswerPort()}
          {this.renderCallToActionButtons()}
          {this.renderHSM2ActionButtons()}
          {this.renderEditHSM2Modal()}
        </div>
      </div>
    );
  }
}
