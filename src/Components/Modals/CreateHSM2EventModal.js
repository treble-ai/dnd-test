import React, { useEffect, useState } from "react";
import getLanguage from "getLanguage.js";
import languages from "./languages";
import "./CreateHSM2EventModal.scss";
import { Modal, InputNumber } from "antd";
import SelectDropdown from "Components/SelectDropdown";
import { useDispatch } from "react-redux";

const language = languages[getLanguage()];

const CreateHSM2EventModal = (props) => {
    const timeTypes = [
        { id: 0, value: language.hsmDefineTimeIntervalMinutes },
        { id: 1, value: language.hsmDefineTimeIntervalHours }
    ]
    const MAX_TIME_INTERVAL_MINUTES = 1440;

    const [state, setState] = useState({
        hsmList: [],
        timeInterval: 0,
        selectedHSM: "",
        timeType: timeTypes[0]
    })
    const dispatch = useDispatch();

    const areTimeSettingsValid = (time, timeType) => {
        if ((timeType === language.hsmDefineTimeIntervalMinutes
            && (time > MAX_TIME_INTERVAL_MINUTES || time <= 0))
            || (timeType === language.hsmDefineTimeIntervalHours
                && (time * 60 > MAX_TIME_INTERVAL_MINUTES || time <= 0))) {
            return false;
        }
        return true;
    }
    let isFormValid = (time, timeType, selectedHSM) => {
        return selectedHSM && areTimeSettingsValid(time, timeType); 
    }

    const renderHsmDropDownItem = (value, content) => {
        return (
            <div>
                <p className="hsm-dropdown-title">{value}</p>
                <p className="hsm-dropdown-content">{content}</p>
            </div>
        );
    }
    const renderTimeTypeDropDownItem = (value) => {
        return (
            <div>
                <p className="hsm-dropdown-title">{value}</p>
            </div>
        );
    }

    const renderBody = () => {
        const renderTextarea = () => {
            return (
                <div className="hsm-textarea-container">
                    <p className="body">{language.hsmExplainedNote}</p>
                </div>
            );
        }
        return (
            <div className="new-hsm2-body">
                {renderTextarea()}
                <p>{language.hsmSelectHSMTemplate}</p>
                <SelectDropdown
                    className="select-hsm-template"
                    options={HSM_LIST}
                    display={(hsm) => renderHsmDropDownItem(hsm.name, hsm.content)}
                    onSelect={(selected) => setState({ ...state, selectedHSM: selected })}
                    noSelectionTitle={language.hsmSelectTemplatePlaceholder}
                ></SelectDropdown>
                <div className="dashed-divider"></div>
                <div>
                    <p>{language.hsmDefineTimeInterval}</p>
                    <div>
                        <p>{language.hsmDefineTimeIntervalExplained}</p>
                        <InputNumber
                            defaultValue={10}
                            min={1}
                            className="time-interval-input"
                            onChange={(value) => setState({...state, timeInterval: value})} />
                        <SelectDropdown
                            className="select-time-type"
                            options={timeTypes}
                            display={(timeType) => renderTimeTypeDropDownItem(timeType.value)}
                            onSelect={(selected) => setState({...state, timeType: selected})}
                            noSelectionTitle={state.timeType.value}
                        ></SelectDropdown>
                    </div>
                </div>


            </div>
        )
    }
    const renderFooter = () => {
        const isValid = isFormValid(state.timeInterval,state.timeType, state.selectedHSM);
        return (
            <div className="create-buttons-container">
                <button
                    className={`create-hsm2-now ${isValid && "is-valid"}`}
                    onClick={() =>{
                        props.onSubmit(state.selectedHSM, state.timeType, state.timeInterval)
                    }}
                    disabled={!isValid}
                >
                    <p>{language.hsmCreateHsm2}</p>
                </button>
                <button
                    className="cancel-hsm2-now"
                    onClick={()=>{}}
                >
                    <p>{language.hsmCancelHsm2}</p>
                </button>
            </div>
        );
    };
    return (
        <Modal
            title={language.hsmBlock}
            wrapClassName="create-hsm2-event-modal"
            footer={renderFooter()}
            visible={props.show}
            onCancel={props.closeModal}
            closeIcon={<div className="close-icon"></div>}
            maskClosable={false}
            centered
            closable={true}
        >
            {renderBody()}
        </Modal>
    )

}

const HSM_LIST = [
    {
      id: 1377,
      name: "adrian",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "APPOINTMENT_UPDATE",
      header: null,
      footer: null,
      buttons: null,
      content: "Hola {{first_name}}",
      formatted: "Hola {{first_name}}",
    },
    {
      id: 20298,
      name: "kustomer_nps",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "ISSUE_RESOLUTION",
      header: {
        text: "Hey {{name}}, could you help us improve?",
        type: "text",
      },
      footer: {
        text: "Thank you!",
        type: "text",
      },
      buttons: {
        type: "call_to_action",
        options: [
          {
            url: "https://par-trebleai-eileen.kustomer.help/{{survey_url}}",
            text: "Take survey",
          },
        ],
      },
      content:
        "We closed this ticket and hope you had a satisfactory solution to it. Would you please give us a review on our service so that we can be better for you?",
      formatted:
        "We closed this ticket and hope you had a satisfactory solution to it. Would you please give us a review on our service so that we can be better for you?",
    },
    {
      id: 20663,
      name: "tessst",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: {
        text: "Hi {{name}}",
        type: "text",
      },
      footer: null,
      buttons: null,
      content: "Heyy!!! We got something new for your users!",
      formatted: "Heyy!!! We got something new for your users!",
    },
    {
      id: 20595,
      name: "test",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: {
        text: "Hi {{name}}",
        type: "text",
      },
      footer: null,
      buttons: null,
      content: "Testing the new product!",
      formatted: "Testing the new product!",
    },
    {
      id: 20662,
      name: "test_1",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content: "Hello we got something awesomeee!",
      formatted: "Hello we got something awesomeee!",
    },
    {
      id: 20594,
      name: "test_audit",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "CLOSED",
      category: "TRANSACTIONAL",
      header: {
        text: "Hi {{name}} lets begin!",
        type: "text",
      },
      footer: null,
      buttons: {
        type: "quick_reply",
        options: [
          {
            text: "Sure",
          },
          {
            text: "No thanks",
          },
        ],
      },
      content:
        "We want to know more of your pains using our product. Can we schedule a meeting to talk briefly about it 🙏?",
      formatted:
        "We want to know more of your pains using our product. Can we schedule a meeting to talk briefly about it 🙏?\n\n1) Sure\n2) No thanks",
      answers: ["Sure", "No thanks"],
    },
    {
      id: 20508,
      name: "test_create_new_1",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "CLOSED",
      category: "MARKETING",
      header: {
        text: "Hi {{name}},",
        type: "text",
      },
      footer: null,
      buttons: {
        type: "quick_reply",
        options: [
          {
            text: "Okay",
          },
          {
            text: "Stop messsages",
          },
        ],
      },
      content:
        "You just created your first template! Please reach out to us if anything goes wrong",
      formatted:
        "You just created your first template! Please reach out to us if anything goes wrong\n\n1) Okay\n2) Stop messsages",
      answers: ["Okay", "Stop messsages"],
    },
    {
      id: 20497,
      name: "test_create_pre_1",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content:
        "Hi {{name}} glad to have you with us! Please check the platform for the onboarding session for next week",
      formatted:
        "Hi {{name}} glad to have you with us! Please check the platform for the onboarding session for next week",
    },
    {
      id: 20502,
      name: "test_create_pre_3",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content:
        "Hey {{name}}! Please check your cellphone app for more updates on our product",
      formatted:
        "Hey {{name}}! Please check your cellphone app for more updates on our product",
    },
    {
      id: 20499,
      name: "test_create_pre_3",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content:
        "Hola {{name}}! Revisa la plataforma para recibir tu próximo entrenamiento",
      formatted:
        "Hola {{name}}! Revisa la plataforma para recibir tu próximo entrenamiento",
    },
    {
      id: 20521,
      name: "test_hsm_agents",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content:
        "Hola! Esperamos que tu HSM haya quedado bien en la plataforma de agentes :)",
      formatted:
        "Hola! Esperamos que tu HSM haya quedado bien en la plataforma de agentes :)",
    },
    {
      id: 20522,
      name: "test_hsm_agents_2",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content:
        "Hola! Esperamos que todo vaya en orden con agentes. Si tienes dudas responde este mensaje y te ayudaremos cuanto antes",
      formatted:
        "Hola! Esperamos que todo vaya en orden con agentes. Si tienes dudas responde este mensaje y te ayudaremos cuanto antes",
    },
    {
      id: 20661,
      name: "test_hsm_feature",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: {
        text: "treble",
        type: "text",
      },
      buttons: null,
      content:
        "Hello {{name}} we got the new {{hubspot_feature}} release date {{date}}!",
      formatted:
        "Hello {{name}} we got the new {{hubspot_feature}} release date {{date}}!",
    },
    {
      id: 20597,
      name: "test_hubspot_mistake",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "MARKETING",
      header: {
        text: "Hi {{hubspot_firsttname}}",
        type: "text",
      },
      footer: null,
      buttons: null,
      content:
        "We need to validate some information, can you contact your AM asap please?",
      formatted:
        "We need to validate some information, can you contact your AM asap please?",
    },
    {
      id: 20510,
      name: "testing",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content: "Test",
      formatted: "Test",
    },
    {
      id: 20495,
      name: "testing_hsm",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: {
        text: "Hi {{name}}!",
        type: "text",
      },
      footer: null,
      buttons: null,
      content: "We are glad to have you here with us! Let's begin",
      formatted: "We are glad to have you here with us! Let's begin",
    },
    {
      id: 20504,
      name: "test_language_delete",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content:
        "Hey {{name}}! We are going to delete your account if no movement is registered",
      formatted:
        "Hey {{name}}! We are going to delete your account if no movement is registered",
    },
    {
      id: 20505,
      name: "test_language_delete",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content:
        "Hola {{name}}! Vamos a borrar tu cuenta si no vemos registro de movimiento",
      formatted:
        "Hola {{name}}! Vamos a borrar tu cuenta si no vemos registro de movimiento",
    },
    {
      id: 20519,
      name: "test_language_delete_4",
      locale: "es",
      status: "PAUSED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: null,
      footer: null,
      buttons: null,
      content: "Buenas {{1}}",
      formatted: "Buenas {{1}}",
    },
    {
      id: 20792,
      name: "testlibrary",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "MARKETING",
      header: null,
      footer: null,
      buttons: null,
      content:
        "*¡Hola {{name}}!*\n\nSabemos que vas a tomar tu primer servicio con {{company}} el día {{date}}. ¿Queremos confirmar contigo si deseas continuar con el servicio o por el contrario quieres cancelarlo?",
      formatted:
        "*¡Hola {{name}}!*\n\nSabemos que vas a tomar tu primer servicio con {{company}} el día {{date}}. ¿Queremos confirmar contigo si deseas continuar con el servicio o por el contrario quieres cancelarlo?",
    },
    {
      id: 20561,
      name: "test_link_button",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "OTP",
      header: {
        text: "Hi {{name}}!",
        type: "text",
      },
      footer: null,
      buttons: {
        type: "call_to_action",
        options: [
          {
            url: "www.treble.ai",
            text: "Verify me",
          },
        ],
      },
      content:
        "Below you will find the link to verify your account. Please click on the button and follow the steps",
      formatted:
        "Below you will find the link to verify your account. Please click on the button and follow the steps",
    },
    {
      id: 20400,
      name: "test_media_chorizo_hack",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "CLOSED",
      category: "MARKETING",
      header: {
        url: "https://s3.amazonaws.com/dev.api.treble.ai.files/360/d1c2273f-e320-4391-a36c-300e8b01c68bchorizo.png",
        type: "image",
      },
      footer: null,
      buttons: {
        type: "quick_reply",
        options: [
          {
            text: "Looking good!",
          },
          {
            text: "Not today",
          },
        ],
      },
      content: "Look at this gorgeous chorizo!",
      formatted:
        "Look at this gorgeous chorizo!\n\n1) Looking good!\n2) Not today",
      answers: ["Looking good!", "Not today"],
    },
    {
      id: 20664,
      name: "test_navidad",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "MARKETING",
      header: {
        text: "Hola {{name}}!",
        type: "text",
      },
      footer: null,
      buttons: null,
      content: "Feliz Navidad te deseamos de parte del equipo de treble!",
      formatted: "Feliz Navidad te deseamos de parte del equipo de treble!",
    },
    {
      id: 20528,
      name: "test_new_front",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "CLOSED",
      category: "MARKETING",
      header: {
        text: "Hey {{name}}",
        type: "text",
      },
      footer: null,
      buttons: {
        type: "quick_reply",
        options: [
          {
            text: "Awesome",
          },
          {
            text: "Don't care",
          },
        ],
      },
      content:
        "We just launched a new feature! Get inside app.treble.ai HSMs sections and check out the new stuff 🤩",
      formatted:
        "We just launched a new feature! Get inside app.treble.ai HSMs sections and check out the new stuff 🤩\n\n1) Awesome\n2) Don't care",
      answers: ["Awesome", "Don't care"],
    },
    {
      id: 20759,
      name: "test_pdf_1",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: {
        url: "https://s3.amazonaws.com/api.treble.ai.files/360/317539d2-1196-4848-9c20-435730b38537Test_PDF.pdf",
        type: "document",
      },
      footer: null,
      buttons: null,
      content: "Hola! Mira este pdf",
      formatted: "Hola! Mira este pdf",
    },
    {
      id: 20760,
      name: "test_pdf_2",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "TRANSACTIONAL",
      header: {
        url: "https://s3.amazonaws.com/api.treble.ai.files/360/1c210590-b211-49f0-9d1c-964f0a6af953Test_PDF.pdf",
        type: "document",
        file_name: "Test_PDF.pdf",
      },
      footer: null,
      buttons: null,
      content: "Hey! You might need this PDF",
      formatted: "Hey! You might need this PDF",
    },
    {
      id: 20509,
      name: "test_rejected",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "MARKETING",
      header: null,
      footer: null,
      buttons: null,
      content: "Esto es una prueba de webhooks",
      formatted: "Esto es una prueba de webhooks",
    },
    {
      id: 20596,
      name: "test_validate_params",
      locale: "en",
      status: "APPROVED",
      hidden: false,
      type: "CLOSED",
      category: "TRANSACTIONAL",
      header: {
        text: "Hi {{hubspot_firstname}},",
        type: "text",
      },
      footer: null,
      buttons: {
        type: "quick_reply",
        options: [
          {
            text: "Yes",
          },
          {
            text: "No, thanks",
          },
        ],
      },
      content:
        "My name is {{hubspot_hubspot_owner_id}} and I would love to schedule a meeting with you to check on how things are going. Are you available this week?",
      formatted:
        "My name is {{hubspot_hubspot_owner_id}} and I would love to schedule a meeting with you to check on how things are going. Are you available this week?\n\n1) Yes\n2) No, thanks",
      answers: ["Yes", "No, thanks"],
    },
    {
      id: 20602,
      name: "track_button_test",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "MARKETING",
      header: null,
      footer: null,
      buttons: {
        type: "call_to_action",
        options: [
          {
            url: "https://dev.main.treble.ai/statistics/redirect/{{link_tracker}}",
            text: "Probar feature",
            target_url: "https://app.treble.ai/",
          },
        ],
      },
      content:
        '*Â¡Hola {{name}}!*\n\nNada se logra sin esfuerzo, por eso en Treble te ayudamos con *"La receta del Ã©xito"* para llevar tu negocio al siguiente nivelÂ ðŸš€\n\n*Â¡No pierdas mÃ¡s tiempo!* Descubre lo que tenemos para tiÂ ðŸ¥³',
      formatted:
        '*Â¡Hola {{name}}!*\n\nNada se logra sin esfuerzo, por eso en Treble te ayudamos con *"La receta del Ã©xito"* para llevar tu negocio al siguiente nivelÂ ðŸš€\n\n*Â¡No pierdas mÃ¡s tiempo!* Descubre lo que tenemos para tiÂ ðŸ¥³',
    },
    {
      id: 20603,
      name: "track_link_button_test",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "MARKETING",
      header: null,
      footer: null,
      buttons: {
        type: "call_to_action",
        options: [
          {
            url: "https://dev.main.treble.ai/statistics/redirect/{{link_tracker}}",
            text: "Probar link tracking",
            target_url: "https://app.treble.ai",
          },
        ],
      },
      content:
        "¡Hola!  \nEn treble te ayudamos a llevar tu negocio al siguiente nivel 🚀",
      formatted:
        "¡Hola!  \nEn treble te ayudamos a llevar tu negocio al siguiente nivel 🚀",
    },
    {
      id: 20628,
      name: "treblegg_tracker",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "MARKETING",
      header: null,
      footer: null,
      buttons: {
        type: "call_to_action",
        options: [
          {
            url: "https://choricito.trb.ai/{{link_tracker}}",
            text: "Login",
            target_url: "https://www.google.com/",
          },
        ],
      },
      content: "Hola {{name}}! Puedes loguearte usando este link",
      formatted: "Hola {{name}}! Puedes loguearte usando este link",
    },
    {
      id: 20511,
      name: "treble_test_3",
      locale: "es",
      status: "APPROVED",
      hidden: false,
      type: "OPEN",
      category: "MARKETING",
      header: null,
      footer: null,
      buttons: null,
      content: "testing",
      formatted: "testing",
    },
];

export default CreateHSM2EventModal;