import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Delete, Verified, Warning } from '@material-ui/icons';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  deviceInfo: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
  trustedChip: {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
  },
  untrustedChip: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.contrastText,
  },
  currentDevice: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
}));

interface DeviceInfo {
  id: string;
  deviceName: string;
  browser: string;
  os: string;
  lastUsed: string;
  isTrusted: boolean;
}

interface Props {
  devices: DeviceInfo[];
  currentDeviceId: string;
  onTrustDevice: (deviceId: string) => void;
  onRemoveDevice: (deviceId: string) => void;
}

export const TrustedDevices: React.FC<Props> = ({
  devices,
  currentDeviceId,
  onTrustDevice,
  onRemoveDevice,
}) => {
  const classes = useStyles();
  const [selectedDevice, setSelectedDevice] = React.useState<DeviceInfo | null>(null);

  const handleRemoveDevice = (device: DeviceInfo) => {
    setSelectedDevice(device);
  };

  const confirmRemoveDevice = () => {
    if (selectedDevice) {
      onRemoveDevice(selectedDevice.id);
      setSelectedDevice(null);
    }
  };

  return (
    <>
      <Paper className={classes.root}>
        <Typography variant="h6" gutterBottom>
          الأجهزة الموثوقة
        </Typography>
        <List>
          {devices.map((device) => (
            <ListItem key={device.id}>
              <ListItemText
                primary={
                  <div className={classes.deviceInfo}>
                    {device.deviceName}
                    {device.id === currentDeviceId && (
                      <Typography variant="caption" className={classes.currentDevice}>
                        (الجهاز الحالي)
                      </Typography>
                    )}
                    <Chip
                      size="small"
                      icon={device.isTrusted ? <Verified /> : <Warning />}
                      label={device.isTrusted ? 'موثوق' : 'غير موثوق'}
                      className={device.isTrusted ? classes.trustedChip : classes.untrustedChip}
                    />
                  </div>
                }
                secondary={
                  <>
                    {`${device.browser} على ${device.os}`}
                    <br />
                    {`آخر استخدام: ${format(new Date(device.lastUsed), 'PPpp', { locale: ar })}`}
                  </>
                }
              />
              <ListItemSecondaryAction>
                {!device.isTrusted && (
                  <Tooltip title="توثيق الجهاز">
                    <IconButton
                      edge="end"
                      onClick={() => onTrustDevice(device.id)}
                      color="primary"
                    >
                      <Verified />
                    </IconButton>
                  </Tooltip>
                )}
                {device.id !== currentDeviceId && (
                  <Tooltip title="إزالة الجهاز">
                    <IconButton
                      edge="end"
                      onClick={() => handleRemoveDevice(device)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={!!selectedDevice} onClose={() => setSelectedDevice(null)}>
        <DialogTitle>تأكيد إزالة الجهاز</DialogTitle>
        <DialogContent>
          هل أنت متأكد من رغبتك في إزالة هذا الجهاز من قائمة الأجهزة الموثوقة؟
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedDevice(null)}>
            إلغاء
          </Button>
          <Button onClick={confirmRemoveDevice} color="secondary">
            إزالة
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}; 