import styles from './WelcomeApplicationDialog.module.css';
import React from 'react';

import { useLocation } from 'react-router';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

function WelcomeApplicationDialog() {
  const location = useLocation();
  const [open, setOpen] = React.useState(location.pathname === '/');
  const handleClose = () => {setOpen(false);};
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Welcome!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
	    Welcome to the Knicks Teams CSE416.01 Voter-Analysis Project
	    <br/>
	    <br/>
	    Backend: Java with SpringBoot, GSON
	    <br/>
	    Frontend: Typescript with React, and MaterialUI
	    <br/>
	    Database: Postgres SQL Database instance.
	    <br/>
	  </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default WelcomeApplicationDialog;