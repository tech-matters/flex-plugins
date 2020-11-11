/* eslint-disable react/display-name */
import React from 'react';
import { useFormContext, ValidationRules, FieldError } from 'react-hook-form';
import { get, pick } from 'lodash';
import { Template } from '@twilio/flex-ui';

import { Box, FormItem, ColumnarBlock, TwoColumnLayout, FormLabel } from '../../../styles/HrmStyles';
import type { FormItemDefinition, FormDefinition, SelectOption, MixedOrBool } from './types';
import './mixedCheckbox.css'; // This would be better done with this https://emotion.sh/docs/css-prop#gatsby-focus-wrapper, but it requires emotion 10

export const ConnectForm: React.FC<{
  children: <P extends ReturnType<typeof useFormContext>>(args: P) => JSX.Element;
}> = ({ children }) => {
  const methods = useFormContext();

  return children({ ...methods });
};

const getRules = (field: FormItemDefinition): ValidationRules =>
  pick(field, ['max', 'maxLength', 'min', 'minLength', 'pattern', 'required', 'validate']);

const getInputType = (parents: string[], updateCallback: () => void) => (def: FormItemDefinition) => {
  const rules = getRules(def);
  const path = [...parents, def.name].join('.');

  switch (def.type) {
    case 'input':
      return (
        <ConnectForm key={path}>
          {({ errors, register }) => {
            const error = get(errors, path);
            return (
              <FormLabel htmlFor={path}>
                {def.label}
                <input
                  id={path}
                  name={path}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${path}-error`}
                  onBlur={updateCallback}
                  ref={register(rules)}
                />
                {error && <Template id={`${path}-error`} code={error.message} />}
              </FormLabel>
            );
          }}
        </ConnectForm>
      );
    case 'numeric input':
      return (
        <ConnectForm key={path}>
          {({ errors, register }) => {
            const error = get(errors, path);
            return (
              <FormLabel htmlFor={path}>
                {def.label}
                <input
                  id={path}
                  name={path}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${path}-error`}
                  onBlur={updateCallback}
                  ref={register({
                    ...rules,
                    pattern: { value: /^[0-9]+$/g, message: 'This field only accepts numeric input.' },
                  })}
                />
                {error && <Template id={`${path}-error`} code={error.message} />}
              </FormLabel>
            );
          }}
        </ConnectForm>
      );
    case 'select':
      return (
        <ConnectForm key={path}>
          {({ errors, register }) => {
            const error = get(errors, path);
            return (
              <FormLabel htmlFor={path}>
                {def.label}
                <select
                  id={path}
                  name={path}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${path}-error`}
                  onBlur={updateCallback}
                  ref={register(rules)}
                >
                  {def.options.map(o => (
                    <option key={`${path}-${o.value}`} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {error && <Template id={`${path}-error`} code={error.message} />}
              </FormLabel>
            );
          }}
        </ConnectForm>
      );
    case 'dependent-select':
      return (
        <ConnectForm key={path}>
          {({ errors, register, watch, setValue }) => {
            const dependeePath = [...parents, def.dependsOn].join('.');
            const dependeeValue = watch(dependeePath);

            React.useEffect(() => setValue(path, def.defaultOption.value), [setValue, dependeeValue]);

            const error = get(errors, path);
            const hasOptions = Boolean(dependeeValue && def.options[dependeeValue]);

            const validate = (data: any) =>
              hasOptions && def.required && data === def.defaultOption.value ? 'RequiredFieldError' : null;

            const options: SelectOption[] = hasOptions
              ? [def.defaultOption, ...def.options[dependeeValue]]
              : [def.defaultOption];

            return (
              <FormLabel htmlFor={path}>
                {def.label}
                <select
                  id={path}
                  name={path}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${path}-error`}
                  onBlur={updateCallback}
                  ref={register({ validate })}
                  disabled={!hasOptions}
                >
                  {options.map(o => (
                    <option key={`${path}-${o.value}`} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {error && <Template id={`${path}-error`} code={error.message} />}
              </FormLabel>
            );
          }}
        </ConnectForm>
      );
    case 'checkbox':
      return (
        <ConnectForm key={path}>
          {({ errors, register }) => {
            const error = get(errors, path);
            return (
              <FormLabel htmlFor={path}>
                {def.label}
                <input
                  id={path}
                  name={path}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${path}-error`}
                  type="checkbox"
                  onChange={updateCallback}
                  ref={register(rules)}
                />
                {error && <Template id={`${path}-error`} code={error.message} />}
              </FormLabel>
            );
          }}
        </ConnectForm>
      );
    case 'mixed-checkbox':
      return (
        <ConnectForm key={path}>
          {({ errors, register, setValue }) => {
            React.useEffect(() => {
              register(path, rules);
            }, [register]);

            const initialChecked = def.initialChecked === undefined ? 'mixed' : def.initialChecked;
            const [checked, setChecked] = React.useState<MixedOrBool>(initialChecked);

            React.useEffect(() => {
              setValue(path, checked);
            }, [checked, setValue]);

            const error = get(errors, path);

            return (
              <FormLabel htmlFor={path}>
                {def.label}
                <input
                  id={path}
                  type="checkbox"
                  aria-checked={checked}
                  className="mixed-checkbox" // this grabs the styles imported from mixedCheckbox.css
                  onBlur={updateCallback}
                  onChange={() => {
                    if (checked === 'mixed') setChecked(false);
                    if (checked === false) setChecked(true);
                    if (checked === true) setChecked('mixed');
                  }}
                />
                {error && <Template id={`${path}-error`} code={error.message} />}
              </FormLabel>
            );
          }}
        </ConnectForm>
      );
    case 'textarea':
      return (
        <ConnectForm key={path}>
          {({ errors, register }) => {
            const error = get(errors, path);
            return (
              <FormLabel htmlFor={path}>
                {def.label}
                <textarea
                  id={path}
                  name={path}
                  aria-invalid={Boolean(error)}
                  aria-describedby={`${path}-error`}
                  onBlur={updateCallback}
                  ref={register(rules)}
                  rows={10}
                />
                {error && <Template id={`${path}-error`} code={error.message} />}
              </FormLabel>
            );
          }}
        </ConnectForm>
      );
    default:
      return null;
  }
};

export const createFormFromDefinition = (definition: FormDefinition) => (parents: string[]) => (
  updateCallback: () => void,
): JSX.Element[] => definition.map(getInputType(parents, updateCallback));

// eslint-disable-next-line react/no-multi-comp
export const makeFormColumns = (formItems: JSX.Element[]) => {
  const items = formItems.map(i => (
    <Box key={`${i.key}-wrapping-box`} marginTop="5px" marginBottom="5px">
      {i}
    </Box>
  ));

  const m = Math.ceil(formItems.length / 2);

  const [l, r] = [items.slice(0, m), items.slice(m)];

  return (
    <TwoColumnLayout>
      <ColumnarBlock>{l}</ColumnarBlock>
      <ColumnarBlock>{r}</ColumnarBlock>
    </TwoColumnLayout>
  );
};
