import React from "react";
import { Box, useTheme } from "@mui/material";
import { useTranslation } from "react-i18next";

import sendImg from "src/commons/resources/images/sendImg.svg";
import { details } from "src/commons/routers";
import { UpGreenUtxoDarkmode } from "src/commons/resources";
import DynamicEllipsisText from "src/components/DynamicEllipsisText";

import { AddressLink, Header, ItemContainer, StatusIcon, StyledItem, Wrapper } from "./styles";

interface DelegationProps {
  data: Transaction["delegations"] | null;
}

const Delegations: React.FC<DelegationProps> = ({ data }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <Wrapper>
      <Header>{t("common.stakeAddress")}</Header>
      {data?.map((item) => (
        <StyledItem key={item.address} overflow={"auto"}>
          <ItemContainer>
            <Box display="flex" alignItems="center">
              <Box width={50}>
                <StatusIcon src={theme.isDark ? UpGreenUtxoDarkmode : sendImg} alt="wallet icon" />
              </Box>
              <Box width={"100%"}>
                <Box maxWidth={"80vw"}>
                  <Box component={"span"} color={({ palette }) => palette.secondary.light} mr={1}>
                    {t("glossary.from")}:
                  </Box>
                  <AddressLink to={details.stake(item.address)}>
                    <DynamicEllipsisText value={item.address || ""} isCopy isTooltip />
                  </AddressLink>
                </Box>
                <Box maxWidth={"80vw"}>
                  <Box component={"span"} color={({ palette }) => palette.secondary.light} mr={1}>
                    {t("common.poolID")}:
                  </Box>
                  <AddressLink to={details.delegation(item.poolId)}>
                    <DynamicEllipsisText value={item.address || ""} isCopy isTooltip />
                  </AddressLink>
                </Box>
              </Box>
            </Box>
          </ItemContainer>
        </StyledItem>
      ))}
    </Wrapper>
  );
};

export default Delegations;
