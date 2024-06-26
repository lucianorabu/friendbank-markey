import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import getCopy from '../utils/getCopy';
import { useApplicationContext } from '../ApplicationContext';
import { DefaultTitle, DefaultParagraph } from './Typography';
import { RedButton } from './Buttons';
import isHeapReady from '../utils/isHeapReady';
import {
  SingleLineTextInput,
  SINGLE_LINE_TEXT_INPUT,
  PASSWORD_INPUT,
  CodeInputField,
  CODE_INPUT_FIELD,
  RadioField,
  RADIO_FIELD,
  CheckboxField,
  CHECKBOX_FIELD,
  MultiLineTextInput,
  MULTI_LINE_TEXT_INPUT,
  GalleryPickerField,
  GALLERY_PICKER,
  HelpText,
  MEDIA_UPLOAD,
  MediaUpload,
} from './FormFields';

const FADE_IN_TIME = 1000;
const FADE_OUT_TIME = 1000;

const fadeInKeyframes = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeOutKeyframes = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

const spinnerKeyframes = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const FormContainer = styled.div`
  position: relative;
  opacity: 0;
  animation: ${FADE_IN_TIME}ms forwards ${fadeInKeyframes};

  ${({ isFading }) => isFading && css`
    opacity: 1;
    animation: ${FADE_OUT_TIME}ms forwards ${fadeOutKeyframes};
  `}
`;

export const FormTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

const FormFieldsContainer = styled.form`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const FormDisclaimer = styled(DefaultParagraph)`
  margin-top: 24px;
  margin-bottom: 0;
  font-size: 12px;
`;

const FormSubmitButton = styled(RedButton)`
  position: relative;
  transition: padding-left 0.5s;

  &:disabled {
    cursor: not-allowed;
    padding-left: 32px;

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 15px;
      width: 20px;
      height: 20px;
      margin-top: -10px;
      margin-left: -10px;
      border-radius: 50%;
      border: 2px solid ${({ theme }) => theme.colors.white};
      border-top-color: ${({ theme }) => theme.colors.red};
      animation: ${spinnerKeyframes} .6s linear infinite;
    }
  }
`;

const FormBackButton = styled.button`
  display: block;
  border: none;
  background: none;
  padding: 0;
  margin-right: 24px;
  font-family: ${({ theme }) => theme.fonts.headerFamily};
  font-weight: bold;
  font-size: 12px;
  line-height: 1;
  text-transform: uppercase;
  text-decoration: underline;
  color: ${({ theme }) => theme.colors.grey};
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.black};
  }
`;

const FormNavigationRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 12px;
`;

const FormError = styled(HelpText)`
  color: ${({ theme }) => theme.colors.red};
  margin-top: 12px;
`;

export default function Form(props) {
  const {
    formId,
    steps,
    onCompletion,
    onFormValueChange,
    initialFieldValues,
  } = props;

  const { page } = useApplicationContext();

  const scrollHelperRef = React.useRef(null);

  const [formValues, setFormValues] = React.useState({});
  const [formError, setFormError] = React.useState(null);

  const [activeStep, setActiveStep] = React.useState(0);
  const [targetStep, setTargetStep] = React.useState(0);
  const [hasCalledCompletion, setHasCalledCompletion] = React.useState(false);

  const [isProcessingSubmit, setIsProcessingSubmit] = React.useState(false);

  const [hasTouchedSubmit, setHasTouchedSubmit] = React.useState(false);

  const isFading = activeStep !== targetStep;

  function getFlow() {
    return steps.filter((step) => {
      if (step.condition) {
        return step.condition(formValues);
      }

      return true;
    });
  }

  React.useEffect(() => {
    if (targetStep === activeStep) {
      return () => {};
    }

    const timeoutId = setTimeout(() => {
      setActiveStep(targetStep);
      setHasTouchedSubmit(false);

      if (scrollHelperRef.current) {
        scrollHelperRef.current.scrollIntoView();
      }
    }, FADE_OUT_TIME);

    return () => clearTimeout(timeoutId);
  }, [
    isFading,
    setActiveStep,
    targetStep,
    scrollHelperRef.current,
  ]);

  React.useEffect(() => {
    const activeStepData = getFlow()[activeStep];

    if (!activeStepData) {
      return;
    }

    activeStepData.fields.forEach((field) => {
      if (field.defaultValue) {
        setFormValues((copy) => ({ ...copy, [field.fieldId]: field.defaultValue }));
      }
    });
  }, [activeStep, steps]);

  React.useEffect(() => {
    const flow = getFlow();

    if (activeStep >= flow.length && !hasCalledCompletion) {
      setHasCalledCompletion(true);

      if (isHeapReady()) {
        heap.track('completed form', { formId, code: (page || {}).code });
      }

      if (!!onCompletion) {
        onCompletion(formValues, setTargetStep, setFormValues);
      }
    }
  }, [
    steps,
    onCompletion,
    activeStep,
    setTargetStep,
    setFormValues,
    hasCalledCompletion,
    setHasCalledCompletion,
  ]);

  React.useEffect(() => {
    if (activeStep === 0 && hasCalledCompletion) {
      setHasCalledCompletion(false);
    }
  }, [
    activeStep,
    hasCalledCompletion,
    setHasCalledCompletion,
  ]);

  React.useEffect(() => {
    if (onFormValueChange) {
      onFormValueChange(formValues, setFormValues, activeStep);
    }
  }, [onFormValueChange, formValues]);

  React.useEffect(() => {
    if (initialFieldValues) {
      const upsert = Object.keys(initialFieldValues).reduce((acc, key) => {
        if (!formValues[key]) {
          return { ...acc, [key]: initialFieldValues[key] };
        }

        return acc;
      }, {});

      if (Object.keys(upsert).length) {
        setFormValues((copy) => ({ ...copy, ...upsert }));
      }
    }
  }, [initialFieldValues, formValues, setFormValues]);

  function onSubmit(event) {
    event.preventDefault();

    if (formError) {
      setFormError(null);
    }

    if (!hasTouchedSubmit) {
      setHasTouchedSubmit(true);
    }

    const step = getFlow()[activeStep];

    if (!step) {
      return;
    }

    const { onStepSubmit, fields } = step;

    const hasInvalidFields = !!fields.find(({ fieldId, validator }) => {
      if (!validator) {
        return false;
      }

      return !!validator(formValues[fieldId]);
    });

    if (hasInvalidFields) {
      return;
    }

    if (isHeapReady()) {
      heap.addUserProperties(formValues);

      if (formValues.email) {
        heap.identify(formValues.email);
      }
    }

    function submitStepEvent() {
      if (isHeapReady()) {
        heap.track('submitted step', { step: activeStep, formId, code: (page || {}).code });
      }
    }

    if (onStepSubmit) {
      setIsProcessingSubmit(true);

      onStepSubmit(formValues).then((serverValidationError) => {
        setIsProcessingSubmit(false);

        if (serverValidationError) {
          const [message, field] = serverValidationError;
          setFormError({ message, field });
        } else {
          setTargetStep(activeStep + 1);
          submitStepEvent();
        }
      })
      .catch((error) => {
        console.error(error);
        setFormError({ message: getCopy('genericError'), field: null });
      });
    } else {
      setTargetStep(activeStep + 1);
      submitStepEvent();
    }
  }

  const activeStepData = getFlow()[activeStep];

  if (!activeStepData) {
    return null;
  }

  const {
    title,
    subtitle,
    buttonCopy,
    fields,
    showSmsDisclaimer,
  } = activeStepData;

  const joinedFormError = formError && (formError.field
    ? `${formError.field}: ${formError.message}`
    : formError.message);

  return (
    <FormContainer isFading={isFading} ref={scrollHelperRef}>
      <FormTitleContainer>
        {title && <DefaultTitle>{title}</DefaultTitle>}
        {subtitle && <DefaultParagraph>{subtitle}</DefaultParagraph>}
      </FormTitleContainer>
      <FormFieldsContainer onSubmit={onSubmit}>
        {fields && fields.map((field) => {
          const {
            fieldId,
            fieldType,
            label = null,
            help = null,
            validator = () => false,
            passthrough,
          } = field;

          const value = formValues[fieldId];
          const validationKey = validator(value);
          const validationMessage = validationKey && getCopy(validationKey);

          function onTextInputChange(event) {
            const update = event.target.value;

            setFormValues((copy) => ({
              ...copy,
              [fieldId]: update,
            }));
          }

          switch (fieldType) {
            case CODE_INPUT_FIELD: {
              return (
                <CodeInputField
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  setFormValues={setFormValues}
                  suggestedValue={value || ""}
                />
              );
            }

            case GALLERY_PICKER: {
              const { options } = field;

              return (
                <GalleryPickerField
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  setFormValues={setFormValues}
                  value={value || ""}
                  options={options || []}
                />
              );
            }

            case MEDIA_UPLOAD: {
              const { set } = field;

              return (
                <MediaUpload
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  setFormValues={setFormValues}
                  value={value || ""}
                  set={set}
                />
              );
            }

            case MULTI_LINE_TEXT_INPUT: {
              return (
                <MultiLineTextInput
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  onChange={onTextInputChange}
                  value={value || ""}
                />
              );
            }

            case RADIO_FIELD: {
              const { options } = field;

              return (
                <RadioField
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  setFormValues={setFormValues}
                  value={value || ""}
                  options={options || []}
                />
              );
            }

            case CHECKBOX_FIELD: {
              const { delimiter, options } = field;

              return (
                <CheckboxField
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  setFormValues={setFormValues}
                  value={value || ""}
                  options={options || []}
                  delimiter={delimiter || ','}
                />
              );
            }

            case PASSWORD_INPUT: {
              const { isHalfWidth = false } = field;

              return (
                <SingleLineTextInput
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  isHalfWidth={isHalfWidth}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  onChange={onTextInputChange}
                  value={value || ""}
                  type="password"
                  {...(passthrough || {})}
                />
              );
            }

            case SINGLE_LINE_TEXT_INPUT:
            default: {
              const { isHalfWidth = false } = field;

              return (
                <SingleLineTextInput
                  key={fieldId}
                  formId={formId}
                  fieldId={fieldId}
                  isHalfWidth={isHalfWidth}
                  label={label}
                  help={help}
                  validationMessage={validationMessage}
                  hasTouchedSubmit={hasTouchedSubmit}
                  onChange={onTextInputChange}
                  value={value || ""}
                  {...(passthrough || {})}
                />
              );
            }
          }
        })}
        <FormNavigationRow split={activeStep > 0}>
          {activeStep > 0 && (
            <FormBackButton type="button" onClick={() => setTargetStep(activeStep - 1)}>
              {getCopy('formLabels.backButton')}
            </FormBackButton>
          )}
          {buttonCopy && <FormSubmitButton
            type="submit"
            disabled={isProcessingSubmit}
            data-track="form-submit-button"
          >{buttonCopy}</FormSubmitButton>}
        </FormNavigationRow>
        {formError && (<FormError>{joinedFormError}</FormError>)}
        {showSmsDisclaimer && (
          <FormDisclaimer>
            {getCopy('smsDisclaimer')}
          </FormDisclaimer>
        )}
      </FormFieldsContainer>
    </FormContainer>
  );
}
