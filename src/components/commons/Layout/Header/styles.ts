import { Container, styled } from '@mui/material';

export const HeaderContainer = styled('header')`
  color: ${(props) => props.theme.palette.text.primary};
  position: relative;
  @media (max-width: 1023px) {
    padding-top: 78px;
  }
`;

export const HeaderBox = styled(Container)<{ home: number }>`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  ${(props) =>
    props.home
      ? `flex-direction: column-reverse;`
      : `
        flex-direction: row;
        justify-content: space-between;
        align-items:center;
      `}
  @media (max-width: 1023px) {
    ${(props) => (props.home ? `` : `justify-content: flex-end;`)}
  }
`;

export const HeaderTop = styled('div')`
  z-index: 1300;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  padding: 30px 0px;
  @media screen and (max-width: 1023px) {
    display: none;
  }
`;

export const HeaderMain = styled('div')<{ home: number }>(({ theme, home }) => ({
  position: 'relative',
  textAlign: 'start',
  padding: home ? '0px 0px 50px' : '27px 0px',
  '& > div': {
    paddingTop: home ? '0px' : '30px',
    marginBottom: home ? '0px' : 'calc(-25px - 1.5715rem)'
  },
  [theme.breakpoints.down('sm')]: {
    padding: home ? '62px 0px 48px' : 0
  }
}));

export const Title = styled('h1')<{ home: number }>`
  display: ${(props) => (props.home ? 'block' : 'none')};
  text-align: center;
  @media screen and (max-width: 767px) {
    font-size: 30px;
  }
`;
