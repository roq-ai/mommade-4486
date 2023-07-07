import * as yup from 'yup';

export const flavorValidationSchema = yup.object().shape({
  name: yup.string().required(),
  availability: yup.boolean().required(),
  product_id: yup.string().nullable(),
});
