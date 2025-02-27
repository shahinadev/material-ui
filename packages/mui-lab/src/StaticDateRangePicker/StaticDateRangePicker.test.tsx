import * as React from 'react';
import { expect } from 'chai';
import { isWeekend } from 'date-fns';
import { useFakeTimers } from 'sinon';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import StaticDateRangePicker from '@mui/lab/StaticDateRangePicker';
import { describeConformance, screen } from 'test/utils';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
} from '../internal/pickers/test-utils';

const defaultRangeRenderInput = (startProps: TextFieldProps, endProps: TextFieldProps) => (
  <React.Fragment>
    <TextField {...startProps} />
    <TextField {...endProps} />
  </React.Fragment>
);

describe('<StaticDateRangePicker />', () => {
  let clock: ReturnType<typeof useFakeTimers>;
  beforeEach(() => {
    clock = useFakeTimers();
  });
  afterEach(() => {
    clock.restore();
  });

  const { render } = createPickerRenderer();

  describeConformance(
    <StaticDateRangePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={[null, null]}
    />,
    () => ({
      classes: {},
      muiName: 'MuiStaticDateRangePicker',
      wrapMount: wrapPickerMount,
      refInstanceof: undefined,
      skip: [
        'componentProp',
        'componentsProp',
        'themeDefaultProps',
        'themeStyleOverrides',
        'themeVariants',
        'mergeClassName',
        'propsSpread',
        'refForwarding',
        'rootClass',
        'reactTestRenderer',
      ],
    }),
  );

  it('allows disabling dates', () => {
    render(
      <StaticDateRangePicker
        renderInput={defaultRangeRenderInput}
        minDate={adapterToUse.date('2005-01-01T00:00:00.000')}
        shouldDisableDate={isWeekend}
        onChange={() => {}}
        value={[
          adapterToUse.date('2018-01-01T00:00:00.000'),
          adapterToUse.date('2018-01-31T00:00:00.000'),
        ]}
      />,
    );

    expect(
      screen
        .getAllByMuiTest('DateRangePickerDay')
        .filter((day) => day.getAttribute('disabled') !== undefined),
    ).to.have.length(31);
  });

  it('should render the correct a11y tree structure', () => {
    render(
      <StaticDateRangePicker
        renderInput={defaultRangeRenderInput}
        onChange={() => {}}
        value={[
          adapterToUse.date('2018-01-01T00:00:00.000'),
          adapterToUse.date('2018-01-31T00:00:00.000'),
        ]}
      />,
    );

    // It should follow https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/datepicker-dialog.html
    expect(
      document.querySelector('[role="grid"] > [role="row"] [role="cell"] > button'),
    ).to.have.text('1');
  });
});
