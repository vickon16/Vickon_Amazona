import { Step, StepLabel, Stepper } from '@mui/material';
import React, { memo } from 'react';

function CheckoutWizard({ activeStep = 0 } : {activeStep : number}) {
  return (
    <Stepper activeStep={activeStep} alternativeLabel>
      {['Login', 'Shipping Address', 'Payment Method', 'Place Order'].map(
        (step) => (
          <Step key={step}>
            <StepLabel className='dark:[&_span]:text-bgWhite'>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}

export default memo(CheckoutWizard);
