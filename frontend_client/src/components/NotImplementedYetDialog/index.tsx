import styles from './NotImplementedYetDialog.module.css';
import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

interface NotImplementedYetProperties {
  hook: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
};

function NotImplementedYet(
  {
    hook
  }: NotImplementedYetProperties) {
  const handleClose = () => { hook[1](false); };
  return (
    <React.Fragment>
      <Dialog
        open={hook[0]}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Your UI is in another castle!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img width={128} height={128} src="https://cdn-icons-png.flaticon.com/512/71/71872.png"></img>
            <br />
            <br />
            We are not ready to show this yet! It is either not designed yet or
            we haven't though of it yet!
            <br />
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

export type { NotImplementedYetProperties };
export default NotImplementedYet;