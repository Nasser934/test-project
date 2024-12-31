import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, LinearProgress, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';
import { PasswordStrength } from '../../utils/passwordValidator';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
  },
  progress: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  messageList: {
    padding: 0,
  },
  listItem: {
    padding: theme.spacing(0.5, 0),
  },
}));

interface Props {
  passwordStrength: PasswordStrength;
}

export const PasswordStrengthIndicator: React.FC<Props> = ({ passwordStrength }) => {
  const classes = useStyles();

  const getColor = (score: number) => {
    if (score <= 1) return 'error';
    if (score === 2) return 'warning';
    return 'success';
  };

  return (
    <div className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={(passwordStrength.score / 4) * 100}
        color={getColor(passwordStrength.score)}
        className={classes.progress}
      />
      <List className={classes.messageList}>
        {passwordStrength.messages.map((message, index) => (
          <ListItem key={index} className={classes.listItem}>
            <ListItemIcon>
              <Close color="error" />
            </ListItemIcon>
            <ListItemText primary={message} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}; 