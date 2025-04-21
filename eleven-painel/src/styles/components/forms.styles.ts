import {MenuItem, Select, Switch, TextField,} from '@mui/material';
import {styled} from '@mui/material/styles';

export const StyledTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover fieldset': {
            borderColor: '#FFD700',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#FFD700',
        },
        '& input': {
            color: '#fff',
        },
        '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 30px #242424 inset',
            WebkitTextFillColor: '#fff',
            caretColor: '#fff',
        },
        '& input:-webkit-autofill:hover': {
            WebkitBoxShadow: '0 0 0 30px #242424 inset',
            WebkitTextFillColor: '#fff',
        },
        '& input:-webkit-autofill:focus': {
            WebkitBoxShadow: '0 0 0 30px #242424 inset',
            WebkitTextFillColor: '#fff',
        },
    },
    '& .MuiFormLabel-root': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&.Mui-focused': {
            color: '#FFD700',
        },
    },
    '& .MuiFormHelperText-root': {
        color: '#ff4444',
    },
    '& .MuiOutlinedInput-input': {
        padding: '14px 16px',
    },
    marginBottom: 2,
    '@media (min-width: 320px) and (max-width: 600px)': {
        width: '68%',
        margin: '0 auto',
        textAlign: 'center',
        '@media (min-width: 375px)': {
            width: '85%',
        },
        '@media (min-width: 412px)': {
            width: '95%',
        },
        '@media (min-width: 414px)': {
            width: '92%',
        },
        '@media (min-width: 425px)': {
            width: '100%',
        },
    }
});

export const StyledSelect = styled(Select)({
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFD700',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FFD700',
    },
    '& .MuiSelect-select': {
        color: '#fff',
    },
    '& .MuiSvgIcon-root': {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiPaper-root': {
        backgroundColor: '#242424',
    },
    '& .MuiMenu-paper': {
        backgroundColor: '#242424',
    },
    '@media (min-width: 320px) and (max-width: 600px)': {
        width: '68%',
        '@media (min-width: 375px)': {
            width: '85%',
        },
        '@media (min-width: 412px)': {
            width: '95%',
        },
        '@media (min-width: 414px)': {
            width: '92%',
        },
        '@media (min-width: 425px)': {
            width: '100%',
        },
    }
});

export const StyledMenuItem = styled(MenuItem)({
    color: '#fff',
    backgroundColor: '#242424',
    '&:hover': {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
    '&.Mui-selected': {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        '&:hover': {
            backgroundColor: 'rgba(255, 215, 0, 0.3)',
        },
    },
});

export const StyledSwitch = styled(Switch)({
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: '#FFD700',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: '#FFD700',
    },
});

export const StyledButton = {
    cancel: {
        color: 'white',
        borderColor: 'white',
        '&:hover': {
            borderColor: '#FFD700',
            color: '#FFD700',
        },
    },
    submit: {
        backgroundColor: '#FFD700',
        color: 'black',
        '&:hover': {
            backgroundColor: '#FFD700CC',
        },
    },
};

export const inputLabelStyles = {
    color: 'rgba(255, 255, 255, 0.7)',
    '&.Mui-focused': {
        color: '#FFD700',
    },
};

export const menuPaperProps = {
    PaperProps: {
        sx: {
            bgcolor: '#242424',
            '& .MuiMenuItem-root': {
                color: '#fff',
                '&:hover': {
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                },
                '&.Mui-selected': {
                    bgcolor: 'rgba(255, 215, 0, 0.2)',
                    '&:hover': {
                        bgcolor: 'rgba(255, 215, 0, 0.3)',
                    },
                },
            },
        },
    },
};

export const formContainerStyles = {
    width: '100%',
    maxWidth: {xs: '98%', sm: '95%', md: '90%', lg: 1800},
    mx: 'auto',
    p: {xs: 2, sm: 3, md: 4},
    backgroundColor: '#242424',
    borderRadius: 2,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
};
