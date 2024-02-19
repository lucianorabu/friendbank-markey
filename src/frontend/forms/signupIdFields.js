import getCopy from '../utils/getCopy';
import { RADIO_FIELD } from '../components/FormFields';
import { validateRequired } from '../../shared/fieldValidations';

export default function signupIdFields() {
  return [
    {
      fieldId: 'supportLevel',
      fieldType: RADIO_FIELD,
      label: getCopy('idQuestions.support.label'),
      validator: validateRequired,
      options: getCopy('idQuestions.support.options'),
    },
    {
      fieldId: 'volunteerLevel',
      fieldType: RADIO_FIELD,
      label: getCopy('idQuestions.volunteer.label'),
      validator: validateRequired,
      options: getCopy('idQuestions.volunteer.options'),
    },
    {
      fieldId: 'voteStatus',
      fieldType: 'RADIO_FIELD',
      label: getCopy('idQuestions.voteStatus.label'),
      validator: validateRequired,
      options: getCopy('idQuestions.voteStatus.options'),
    }
  ];
}
