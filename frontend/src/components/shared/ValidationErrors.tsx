import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  IconButton,
  makeStyles,
  Fade,
} from '@material-ui/core';
import {
  Error as ErrorIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Close as CloseIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(4),
    left: theme.spacing(4),
    maxWidth: 400,
    maxHeight: '60vh',
    overflow: 'auto',
    zIndex: theme.zIndex.snackbar,
  },
  header: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    padding: theme.spacing(0, 2),
  },
  errorItem: {
    borderLeft: `4px solid ${theme.palette.error.main}`,
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.error.light,
    '&:hover': {
      backgroundColor: theme.palette.error.light,
      opacity: 0.9,
    },
  },
  sectionTitle: {
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.grey[100],
  },
  expandIcon: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandIconOpen: {
    transform: 'rotate(180deg)',
  },
  closeButton: {
    padding: theme.spacing(0.5),
    color: 'inherit',
  },
}));

interface ValidationError {
  path: string;
  message: string;
}

interface ValidationErrorsProps {
  errors: { [key: string]: string[] };
  onClose?: () => void;
  onErrorClick?: (path: string) => void;
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({
  errors,
  onClose,
  onErrorClick,
}) => {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = React.useState(true);

  const groupedErrors = React.useMemo(() => {
    const groups: { [key: string]: ValidationError[] } = {};
    
    Object.entries(errors).forEach(([path, messages]) => {
      const section = path.split('.')[0];
      if (!groups[section]) {
        groups[section] = [];
      }
      messages.forEach(message => {
        groups[section].push({ path, message });
      });
    });

    return groups;
  }, [errors]);

  const handleErrorClick = (path: string) => {
    if (onErrorClick) {
      onErrorClick(path);
    }
  };

  const getFieldLabel = (path: string): string => {
    const fieldMap: { [key: string]: string } = {
      'personalInfo.fullName': 'الاسم الكامل',
      'personalInfo.title': 'المسمى الوظيفي',
      'personalInfo.email': 'البريد الإلكتروني',
      'personalInfo.phone': 'رقم الهاتف',
      'personalInfo.location': 'الموقع',
      'summary': 'الملخص',
      'experience': 'الخبرات',
      'education': 'التعليم',
      'skills': 'المهارات',
    };

    return fieldMap[path] || path.split('.').pop() || path;
  };

  return (
    <Fade in={Object.keys(errors).length > 0}>
      <Paper className={classes.root} elevation={6}>
        <div className={classes.header}>
          <Typography variant="subtitle1">
            <ErrorIcon fontSize="small" style={{ marginRight: 8 }} />
            يرجى تصحيح الأخطاء التالية
          </Typography>
          <div>
            <IconButton
              size="small"
              className={classes.closeButton}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
            {onClose && (
              <IconButton
                size="small"
                className={classes.closeButton}
                onClick={onClose}
              >
                <CloseIcon />
              </IconButton>
            )}
          </div>
        </div>
        <Collapse in={isExpanded}>
          <div className={classes.content}>
            {Object.entries(groupedErrors).map(([section, sectionErrors]) => (
              <div key={section}>
                <Typography
                  variant="subtitle2"
                  className={classes.sectionTitle}
                >
                  {getFieldLabel(section)}
                </Typography>
                <List dense>
                  {sectionErrors.map((error, index) => (
                    <ListItem
                      key={`${error.path}-${index}`}
                      button
                      onClick={() => handleErrorClick(error.path)}
                      className={classes.errorItem}
                    >
                      <ListItemIcon>
                        <ErrorIcon color="error" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={error.message}
                        secondary={getFieldLabel(error.path)}
                      />
                    </ListItem>
                  ))}
                </List>
              </div>
            ))}
          </div>
        </Collapse>
      </Paper>
    </Fade>
  );
}; 