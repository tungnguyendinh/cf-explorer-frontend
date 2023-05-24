import { Grid, Skeleton, Button, styled, Box, alpha } from "@mui/material";

export const BoxInfo = styled(Box)<{ space: number }>(({ theme, space }) => ({
  height: `calc(100% - ${space}px)`,
  background: theme.palette.secondary.dark,
  borderRadius: "10px",
  color: theme.palette.primary.contrastText,
  display: "flex",
  flexDirection: "column",
  textAlign: "center",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "row"
  },
  [theme.breakpoints.down("sm")]: {
    padding: "27px 0",
    height: "calc(100% - 54px)",
    flexDirection: "row"
  }
}));
export const BoxInfoItem = styled(Box)(({ theme }) => ({
  height: "100%",
  paddingTop: theme.spacing(2),
  width: "80%",
  margin: "0 auto",
  overflow: "hidden",
  [theme.breakpoints.down("lg")]: {
    borderTop: "none",
    width: "100%",
    minHeight: "200px",
    height: "100%",
    paddingTop: 0
  },
  [theme.breakpoints.down("sm")]: {
    minHeight: "150px"
  }
}));

export const BoxInfoItemRight = styled(Box)(({ theme }) => ({
  height: "100%",
  paddingTop: theme.spacing(2),
  width: "80%",
  margin: "0 auto",
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.07)}`,
  overflow: "hidden",
  [theme.breakpoints.down("lg")]: {
    borderRight: `1px solid ${alpha(theme.palette.common.white, 0.07)}`,
    height: "100%",
    borderBottom: "none",
    width: "100%",
    minHeight: "200px",
    paddingTop: 0
  },
  [theme.breakpoints.down("sm")]: {
    borderRight: `1px solid ${alpha(theme.palette.common.white, 0.07)}`,
    minHeight: "150px"
  }
}));

export const Title = styled(Box)(({ theme }) => ({
  fontWeight: "bold",
  padding: `${theme.spacing(2)} 0`,
  [theme.breakpoints.down("sm")]: {
    fontSize: "1rem"
  }
}));

export const ValueInfo = styled(Box)(({ theme }) => ({
  fontWeight: "bold",
  fontSize: "1.25rem",
  margin: "0 auto",
  overflowWrap: "anywhere",
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.75rem"
  }
}));

export const Wrapper = styled(Grid)(({ theme }) => ({
  borderRadius: 10,
  minHeight: "400px",
  textAlign: "left"
}));

export const ButtonTitle = styled("button")(({ theme }) => ({
  border: "none",
  borderRadius: 10,
  padding: "8px 30px",
  fontWeight: "bold",
  fontSize: "1rem",
  marginRight: 5,
  color: theme.palette.primary.contrastText,
  backgroundColor: theme.palette.primary.main,
  fontFamily: "var(--font-family-title)",
  [theme.breakpoints.down("sm")]: {
    width: "80px !important",
    height: "28px !important",
    padding: 0,
    borderRadius: "5px"
  }
}));

export const ChartBox = styled(Box)(({ theme }) => ({
  paddingTop: theme.spacing(3)
}));

export const SkeletonUI = styled(Skeleton)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  marginRight: theme.spacing(2),
  borderRadius: 10
}));

export const Tabs = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    textAlign: "end"
  },
  [theme.breakpoints.down("md")]: {
    display: "flex",
    justifyContent: "flex-end"
  },
  [theme.breakpoints.down("sm")]: {
    "& button": {
      width: "40px !important",
      height: "28px !important",
      padding: "0px !important",
      minWidth: "auto",
      borderRadius: "5px"
    }
  }
}));

export const Tab = styled(Button)<{ active: number }>(({ theme, active }) => ({
  textTransform: "lowercase",
  borderRadius: 10,
  border: `2px solid ${theme.palette.green[800_20]}`,
  marginRight: theme.spacing(1),
  color: active ? `${theme.palette.primary.contrastText} !important` : theme.palette.grey[400],
  fontWeight: "bold",
  backgroundColor: active ? theme.palette.primary.main : "none",
  [theme.breakpoints.down("lg")]: {
    color: active ? `${theme.palette.primary.contrastText} !important` : theme.palette.grey[400],
    backgroundColor: active ? `${theme.palette.primary.main} !important` : "none"
  },
  [theme.breakpoints.down("md")]: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  }
}));
