import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getFlavorById, updateFlavorById } from 'apiSdk/flavors';
import { Error } from 'components/error';
import { flavorValidationSchema } from 'validationSchema/flavors';
import { FlavorInterface } from 'interfaces/flavor';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ProductInterface } from 'interfaces/product';
import { getProducts } from 'apiSdk/products';

function FlavorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<FlavorInterface>(
    () => (id ? `/flavors/${id}` : null),
    () => getFlavorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: FlavorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateFlavorById(id, values);
      mutate(updated);
      resetForm();
      router.push('/flavors');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<FlavorInterface>({
    initialValues: data,
    validationSchema: flavorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Flavor
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="name" mb="4" isInvalid={!!formik.errors?.name}>
              <FormLabel>Name</FormLabel>
              <Input type="text" name="name" value={formik.values?.name} onChange={formik.handleChange} />
              {formik.errors.name && <FormErrorMessage>{formik.errors?.name}</FormErrorMessage>}
            </FormControl>
            <FormControl
              id="availability"
              display="flex"
              alignItems="center"
              mb="4"
              isInvalid={!!formik.errors?.availability}
            >
              <FormLabel htmlFor="switch-availability">Availability</FormLabel>
              <Switch
                id="switch-availability"
                name="availability"
                onChange={formik.handleChange}
                value={formik.values?.availability ? 1 : 0}
              />
              {formik.errors?.availability && <FormErrorMessage>{formik.errors?.availability}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<ProductInterface>
              formik={formik}
              name={'product_id'}
              label={'Select Product'}
              placeholder={'Select Product'}
              fetcher={getProducts}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'flavor',
    operation: AccessOperationEnum.UPDATE,
  }),
)(FlavorEditPage);
