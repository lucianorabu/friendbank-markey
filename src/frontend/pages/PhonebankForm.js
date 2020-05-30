import React from 'react';
import styled from 'styled-components';
import getCopy from '../utils/getCopy';
import StandardHelmet from '../components/StandardHelmet';
import Form, { FormTitleContainer } from '../components/Form';
import signupContactFields from '../forms/signupContactFields';
import signupIdFields from '../forms/signupIdFields';
import useAuthGate from '../hooks/useAuthGate';
import makeFormApiRequest from '../utils/makeFormApiRequest';
import { isAuthenticated } from '../utils/auth';

export const PHONEBANK_FORM_ROUTE = '/friendbank/phonebank';

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 80vh;
  margin-bottom: 48px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadow};
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

export default function PhonebankForm() {
  useAuthGate();

  const [successfullySubmitted, setSuccessfullySubmitted] = React.useState(false);

  React.useEffect(() => {
    if (successfullySubmitted) {
      const timeoutId = setTimeout(() => {
        setSuccessfullySubmitted(false);
      }, 2500);

      return () => clearTimeout(timeoutId);
    }
  }, [successfullySubmitted, setSuccessfullySubmitted]);

  async function onSubmit(formValues) {
    return await makeFormApiRequest('/api/v1/contact', 'post', { ...formValues });
  }

  function onCompletion(formValues, setTargetStep, setFormValues) {
    setTargetStep(0);
    setFormValues({});
    setSuccessfullySubmitted(true);
  }

  return (
    <React.Fragment>
      <StandardHelmet />
      <Layout>
        <Container>
          <Form
            onCompletion={onCompletion}
            steps={[{
              title: 'Phonebank Contact Form',
              subtitle: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
              buttonCopy: 'Submit',
              onStepSubmit: onSubmit,
              fields: [
                ...signupContactFields(),
                ...signupIdFields(),
              ],
            }]}
          />
          {successfullySubmitted && (
            <SuccessMessage>
              Successfully submitted contact!
            </SuccessMessage>
          )}
        </Container>
      </Layout>
    </React.Fragment>
  )
}