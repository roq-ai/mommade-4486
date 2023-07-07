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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createContact } from 'apiSdk/contacts';
import { Error } from 'components/error';
import { contactValidationSchema } from 'validationSchema/contacts';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { ContactInterface } from 'interfaces/contact';

function ContactCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ContactInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createContact(values);
      resetForm();
      router.push('/contacts');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ContactInterface>({
    initialValues: {
      phone: '',
      address: '',
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: contactValidationSchema,
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
            Create Contact
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="phone" mb="4" isInvalid={!!formik.errors?.phone}>
            <FormLabel>Phone</FormLabel>
            <Input type="text" name="phone" value={formik.values?.phone} onChange={formik.handleChange} />
            {formik.errors.phone && <FormErrorMessage>{formik.errors?.phone}</FormErrorMessage>}
          </FormControl>
          <FormControl id="address" mb="4" isInvalid={!!formik.errors?.address}>
            <FormLabel>Address</FormLabel>
            <Input type="text" name="address" value={formik.values?.address} onChange={formik.handleChange} />
            {formik.errors.address && <FormErrorMessage>{formik.errors?.address}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
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
    entity: 'contact',
    operation: AccessOperationEnum.CREATE,
  }),
)(ContactCreatePage);
