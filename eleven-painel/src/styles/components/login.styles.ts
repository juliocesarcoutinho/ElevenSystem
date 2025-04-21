import {styled} from "@mui/material/styles";
import {TextField} from "@mui/material";

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
});