import * as yup from 'yup';

export const contactValidationSchema = yup.object().shape({
  phone: yup.string().required(),
  address: yup.string().required(),
  organization_id: yup.string().nullable(),
});
