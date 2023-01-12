import { styled, Box } from "@mui/material";
import { Link } from "react-router-dom";

export const TitleDetail = styled(Box)`
  font-size: var(--font-size-title);
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-title);
`;

export const TokenAddress = styled("small")`
  max-width: 90%;
  word-wrap: break-word;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-text);
  color: ${props => props.theme.colorBlue} !important;
  line-height: 1.5;
`;
export const AddressLink = styled(Link)`
  max-width: 90%;
  word-wrap: break-word;
  font-weight: var(--font-weight-bold);
  font-family: var(--font-family-text);
  color: ${props => props.theme.colorBlue} !important;
  font-size: 14px;
`;

export const AddressGroup = styled(Box)`
  margin-top: 15px;
  margin-bottom: 24px;
  background: rgba(16, 138, 239, 0.07);
  border-radius: 8px;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ItemDetail = styled(Box)`
  width: 100%;
  padding: 6px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LabelItem = styled(Box)`
  margin-left: 10px;
  color: #344054;
  font-size: 14px;
`;

export const ValueItem = styled(Box)`
  color: black;
  font-weight: var(--font-weight-bold);
  font-size: 14px;
`;

export const RowItem = styled(Box)`
  display: flex;
  align-items: center;
`;

export const CardItem = styled(Box)`
  background-color: #fff;
  min-height: 200px;
  height: 100%;
  border-radius: ${props => props.theme.borderRadius};
  overflow: hidden;
  text-align: left;
  box-shadow: ${props => props.theme.shadowRaised};
`;
