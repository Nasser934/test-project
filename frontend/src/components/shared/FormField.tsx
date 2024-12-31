import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  TextField,
  Tooltip,
  IconButton,
  makeStyles,
  Fade,
  Typography,
} from '@material-ui/core';
import { Help as HelpIcon } from '@material-ui/icons';
import { RequiredLabel } from './RequiredLabel';
import { debounce } from 'lodash';

const useStyles = makeStyles((theme) => ({
  fieldWrapper: {
    position: 'relative',
    marginBottom: theme.spacing(2),
  },
  helperText: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  characterCount: {
    marginLeft: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  helpIcon: {
    color: theme.palette.text.secondary,
  },
  validField: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: theme.palette.success.main,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.success.main,
      },
    },
  },
  focusHighlight: {
    '&:focus-within': {
      backgroundColor: theme.palette.action.hover,
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

interface FormFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  validateOnChange?: boolean;
  onValidate?: (value: string) => Promise<string | undefined>;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  required = false,
  helpText,
  placeholder,
  multiline = false,
  rows = 1,
  maxLength,
  validateOnChange = false,
  onValidate,
}) => {
  const classes = useStyles();
  const [isValidating, setIsValidating] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const [isTouched, setIsTouched] = useState(false);
  const previousValueRef = useRef(value);
  const validationCacheRef = useRef<Map<string, string | undefined>>(new Map());

  const debouncedValidate = useCallback(
    debounce(async (value: string) => {
      if (!onValidate) return;

      // التحقق من الذاكرة المؤقتة
      const cachedResult = validationCacheRef.current.get(value);
      if (cachedResult !== undefined) {
        setLocalError(cachedResult);
        return;
      }

      setIsValidating(true);
      try {
        const validationError = await onValidate(value);
        validationCacheRef.current.set(value, validationError);
        setLocalError(validationError);
      } finally {
        setIsValidating(false);
      }
    }, 300),
    [onValidate]
  );

  useEffect(() => {
    // تنظيف الذاكرة المؤقتة عندما تصبح كبيرة جداً
    if (validationCacheRef.current.size > 100) {
      validationCacheRef.current.clear();
    }
  }, []);

  useEffect(() => {
    // التحقق فقط إذا تغيرت القيمة
    if (value !== previousValueRef.current) {
      previousValueRef.current = value;
      if (validateOnChange && isTouched) {
        debouncedValidate(value);
      }
    }
  }, [value, validateOnChange, isTouched, debouncedValidate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    setIsTouched(true);
  };

  const handleBlur = () => {
    if (validateOnChange && onValidate) {
      debouncedValidate(value);
    }
  };

  const showCharacterCount = maxLength !== undefined;
  const currentLength = value.length;
  const isValid = isTouched && !error && !localError;

  return (
    <div className={`${classes.fieldWrapper} ${classes.focusHighlight}`}>
      <TextField
        fullWidth
        name={name}
        label={<RequiredLabel label={label} required={required} />}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        error={Boolean(error || localError)}
        helperText={
          <div className={classes.helperText}>
            {error || localError}
            {showCharacterCount && (
              <Typography className={classes.characterCount}>
                {currentLength}/{maxLength}
              </Typography>
            )}
          </div>
        }
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        variant="outlined"
        className={isValid ? classes.validField : undefined}
        InputProps={{
          endAdornment: helpText && (
            <Tooltip title={helpText} placement="top">
              <IconButton size="small" className={classes.helpIcon}>
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ),
        }}
      />
      {isValidating && (
        <Fade in>
          <Typography variant="caption" color="textSecondary">
            جاري التحقق...
          </Typography>
        </Fade>
      )}
    </div>
  );
}; 