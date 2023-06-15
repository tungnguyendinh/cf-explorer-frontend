import React from "react";
import { Box } from "@mui/material";

import { InfoIcon, SPOHolderIconUrl } from "src/commons/resources";

import { DisableAbleLabel, FacingImg, RectBox } from "./styles";

export interface IADAOperatorRewardRectProps {
  disabled?: boolean;
}
const ADAOperatorRewardRect: React.FC<IADAOperatorRewardRectProps> = ({ disabled }) => {
  return (
    <RectBox disabled={+Boolean(disabled)}>
      <FacingImg src={SPOHolderIconUrl} />
      <DisableAbleLabel disabled={+Boolean(disabled)}>Operator Reward (SPO)</DisableAbleLabel>
      <Box>{disabled && <InfoIcon />}</Box>
    </RectBox>
  );
};

export default ADAOperatorRewardRect;
