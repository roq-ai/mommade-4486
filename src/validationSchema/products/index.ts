import * as yup from 'yup';

export const productValidationSchema = yup.object().shape({
  name: yup.string().required(),
  image: yup.string().required(),
  organization_id: yup.string().nullable(),
});
