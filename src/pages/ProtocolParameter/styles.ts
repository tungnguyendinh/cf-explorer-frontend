import { styled, Box, Button, Accordion, AccordionSummary as AccordionSummaryMUI, alpha } from '@mui/material';

export const BackButton = styled(Box)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  cursor: pointer;
`;

export const BackText = styled('small')`
  color: ${(props) => props.theme.palette.text.secondary};
  font-weight: var(--font-weight-bold);
`;

export const FilterContainer = styled(Box)(({ theme }) => ({
  width: 300,
  backgroundColor: theme.palette.common.white,
  zIndex: 10,
  position: 'absolute',
  top: 'calc(100% + 10px)',
  right: 0,
  borderRadius: theme.spacing(1),
  boxShadow: 'rgba(189, 197, 209, 0.2) 0px 0.5rem 1.2rem',
  ':after': {
    content: "''",
    display: 'block',
    background: 'rgb(255, 255, 255)',
    zIndex: 9,
    position: 'absolute',
    top: '-6px',
    right: '32px',
    width: '14px',
    height: '16px',
    transform: 'rotate(45deg)',
    boxShadow: 'rgba(189, 197, 209, 0.2) 0px 0.5rem 1.2rem'
  }
}));

export const ButtonFilter = styled(Button)(({ theme }) => ({
  display: 'inline-block',
  textTransform: 'capitalize',
  textAlign: 'left',
  color: theme.palette.common.black,
  height: 40,
  pading: '12px 0'
}));

export const AccordionContainer = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  textAlign: 'left'
}));
export const AccordionSummary = styled(AccordionSummaryMUI)(({ theme }) => ({
  padding: '0 8px !important',
  textAlign: 'left'
}));

export const ApplyFilterButton = styled(Button)(({ theme }) => ({
  width: '100%',
  textTransform: 'capitalize',
  fontWeight: 'bold',
  color: theme.palette.common.white,
  background: theme.palette.grey[700],
  ':hover': {
    background: alpha(theme.palette.grey[700], 0.8)
  },
  ':disabled': {
    background: alpha(theme.palette.grey[700], 0.3)
  }
}));
