import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import Form from './Form';
import DownBallotMapLink from './DownBallotMapLink';
import {
  MULTI_LINE_TEXT_INPUT,
  RADIO_FIELD,
  CHECKBOX_FIELD,
} from './FormFields';
import signupContactFields from '../forms/signupContactFields';
import signupIdFields from '../forms/signupIdFields';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import getCopy from '../utils/getCopy';
import {
  validateZipNotRequired,
  validatePhoneNotRequired,
  validateEmailNotRequired,
  validateNote,
} from '../../shared/fieldValidations';

const PROFILE_PANEL = 'PROFILE_PANEL';
const ACTIONS_PANEL = 'ACTIONS_PANEL';

const swipeIn = keyframes`
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(0%);
  }
`;

const swipeOut = keyframes`
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(-100%);
  }
`;

const fadeIn = keyframes`
  0% { opacity: 0 }
  100% { opacity: 1 }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const swipeStyle = (outFrames, inFrames) => css`
  animation: ${({ out }) => out ? outFrames : inFrames} 1s forwards;
`;

const PanelBackdrop = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  cursor: pointer;
  overflow: scroll;
  ${swipeStyle(fadeOut, fadeIn)}
`;

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  // height: 100%;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: auto;
  ${swipeStyle(swipeOut, swipeIn)}

  @media ${({ theme }) => theme.media.tablet} {
    width: 66.66%;
  }

  @media ${({ theme }) => theme.media.desktop} {
    width: 50%;
  }
`;

const PanelBackButton = styled.button`
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  text-align: left;
  width: fit-content;
  color: ${({ theme }) => theme.colors.black};
  margin-bottom: 48px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const SuccessMessage = styled.p`
  font-family: ${({ theme }) => theme.fonts.mainFamily};
  font-weight: bold;
  font-size: 18px;
  text-align: center;
  width: 100%;
  padding: 8px 4px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.green};
  margin-top: 12px;
`;

export default function SignupsTablePanel(props) {
  const {
    selectedSignup,
    setSelectedSignup,
    updateSignup,
  } = props;

  const [fadeOut, setFadeOut] = React.useState(null);

  const [panelMenu, setPanelMenu] = React.useState(PROFILE_PANEL);

  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(false);

  React.useEffect(() => {
    let timeoutId = null;

    if (fadeOut && selectedSignup !== null) {
      timeoutId = setTimeout(() => setSelectedSignup(null), 1000);
    }

    return () => clearTimeout(timeoutId);
  }, [
    selectedSignup,
    setSelectedSignup,
    fadeOut,
    setFadeOut,
  ]);

  React.useEffect(() => {
    if (successfullySubmitted) {
      const timeoutId = setTimeout(() => {
        setSuccessfullySubmitted(false);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [successfullySubmitted, setSuccessfullySubmitted]);

  const panelRef = React.useRef(null);

  function onPanelBackdropClick(event) {
    if (panelRef.current && !panelRef.current.contains(event.target)) {
      setFadeOut(true)
    }
  }

  const signupFieldDump = [
    ...signupContactFields(),
    ...signupIdFields(),
    // {
    //   fieldId: 'voteStatus',
    //   fieldType: RADIO_FIELD,
    //   label: getCopy('voteStatus.label'),
    //   options: getCopy('voteStatus.options'),
    // },
  ];

  if (selectedSignup.ballotStatus) {
    signupFieldDump.push({
      fieldId: 'ballotStatus',
      fieldType: RADIO_FIELD,
      label: getCopy('idQuestions.vote.label'),
      options: getCopy('idQuestions.vote.options'),
    });
  }

  // signupFieldDump.push({
  //   fieldId: 'note',
  //   fieldType: MULTI_LINE_TEXT_INPUT,
  //   label: getCopy('formLabels.note'),
  //   validator: validateNote,
  // });

  signupFieldDump[2].validator = validateZipNotRequired;
  signupFieldDump[3].validator = validatePhoneNotRequired;

  const hasMissingEmail = selectedSignup.email
    && selectedSignup.email.startsWith('missing::');

  if (hasMissingEmail) {
    signupFieldDump[4].validator = validateEmailNotRequired;
  }

  const signupFields = signupFieldDump.map((field) => {
    const value = selectedSignup[field.fieldId];

    if (field.fieldId === 'email' && hasMissingEmail) {
      return field;
    }

    if (typeof value !== 'undefined') {
      return { ...field, defaultValue: value };
    }

    return field;
  });

  function onCompletion(formValues, setTargetStep, setFormValues) {
    panelRef.current.scrollTop = 0;
    setTargetStep(0);
    setFormValues({});
    //updateSignup(selectedSignup.id, formValues);
    setSuccessfullySubmitted(true);
  }

  async function onSignupSubmit(formValues) {
    return await makeFormApiRequest(`/api/v1/signup/${selectedSignup.id}`, 'put', { ...formValues });
  }

  return (
    <PanelBackdrop onClick={onPanelBackdropClick} out={fadeOut}>
      <Panel className="edit-signup-panel"
        ref={(element) => panelRef.current = element}
        out={fadeOut}
      >
        <PanelBackButton onClick={() => setFadeOut(true)}>
          {getCopy('dashboard.signupTablePanelBack')}
        </PanelBackButton>
        {successfullySubmitted && (
          <SuccessMessage>
            {getCopy('dashboard.signupTablePanelSaved')}
          </SuccessMessage>
        )}

        <Form
          onCompletion={onCompletion}
          steps={[{
            buttonCopy: null,
            onStepSubmit: onSignupSubmit,
            fields: signupFields,
          }]}
        />
        {/* <DownBallotMapLink /> */}
      </Panel>
    </PanelBackdrop>
  );
}
