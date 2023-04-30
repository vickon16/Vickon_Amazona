import { Alert, AlertTitle } from '@mui/material';
import React, { memo } from 'react'

const Error = ({error} : {error : string}) => {
  return (
    <Alert severity="error">
      <AlertTitle>Error</AlertTitle>
      {error} —{" "}
      <strong
        className="cursor-pointer"
        onClick={() => window.location.reload()}
      >
        Try again
      </strong>
    </Alert>
  );
}

export default memo(Error)