import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Lock, LockOpen, Warning } from '@material-ui/icons';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  successChip: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  failureChip: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
  warningIcon: {
    color: theme.palette.warning.main,
    marginLeft: theme.spacing(1),
  },
}));

interface LoginAttempt {
  timestamp: number;
  ip: string;
  success: boolean;
}

interface Props {
  attempts: LoginAttempt[];
  onLockAccount: () => void;
  onUnlockAccount: () => void;
  isLocked: boolean;
}

export const LoginAttempts: React.FC<Props> = ({
  attempts,
  onLockAccount,
  onUnlockAccount,
  isLocked,
}) => {
  const classes = useStyles();

  const recentFailedAttempts = attempts.filter(
    attempt => !attempt.success && 
    attempt.timestamp > Date.now() - 30 * 60 * 1000 // آخر 30 دقيقة
  );

  return (
    <Paper className={classes.root}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <Typography variant="h6">
          محاولات تسجيل الدخول
        </Typography>
        {recentFailedAttempts.length >= 3 && (
          <Tooltip title="محاولات فاشلة متكررة">
            <Warning className={classes.warningIcon} />
          </Tooltip>
        )}
        <div style={{ marginRight: 'auto' }}>
          <IconButton
            onClick={isLocked ? onUnlockAccount : onLockAccount}
            color={isLocked ? 'secondary' : 'default'}
          >
            {isLocked ? <LockOpen /> : <Lock />}
          </IconButton>
        </div>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>التاريخ</TableCell>
            <TableCell>عنوان IP</TableCell>
            <TableCell>الحالة</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attempts.map((attempt, index) => (
            <TableRow key={index}>
              <TableCell>
                {format(attempt.timestamp, 'PPpp', { locale: ar })}
              </TableCell>
              <TableCell>{attempt.ip}</TableCell>
              <TableCell>
                <Chip
                  label={attempt.success ? 'ناجحة' : 'فاشلة'}
                  className={attempt.success ? classes.successChip : classes.failureChip}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}; 