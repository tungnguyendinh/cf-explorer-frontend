import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useScreen } from "src/commons/hooks/useScreen";
import { InfoIcon } from "src/commons/resources";
import { details } from "src/commons/routers";
import { formatLongText } from "src/commons/utils/helper";
import CustomTooltip from "src/components/commons/CustomTooltip";
import { StyledLink } from "src/components/share/styled";
import { Uppercase } from "src/components/commons/CustomText/styles";

import { CLButton, CLCardContaienr, WrapLabel } from "./styles";

export interface ContractItemProps {
  data: IContractItemTx;
  onClick?: (data: IContractItemTx) => void;
}

const ContractItem: React.FC<ContractItemProps> = ({ data, onClick }) => {
  const { t } = useTranslation();
  const containerRef = useRef<SVGSVGElement>(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { isMobile, isTablet } = useScreen();

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const contractAddress = useMemo(() => {
    switch (data.purpose) {
      case "SPEND":
        return {
          value: data.address,
          explain: t("explain.spend.desc"),
          detail: details.contract
        };
      case "MINT":
        return {
          value: data.scriptHash,
          explain: t("explain.mint.desc"),
          detail: details.policyDetail
        };
      case "CERT":
        return {
          value: data.stakeAddress,
          explain: t("explain.cert.desc"),
          detail: details.stake
        };
      case "REWARD":
        return {
          value: data.stakeAddress,
          explain: t("explain.reward.desc"),
          detail: details.stake
        };
    }
  }, [data]);

  const handleDocumentClick = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  return (
    <CLCardContaienr>
      <Box>
        <WrapLabel>{t("contract.address")}:</WrapLabel>
        <CustomTooltip title={contractAddress?.value}>
          <StyledLink
            style={{ fontWeight: "500", textDecoration: "underline" }}
            to={contractAddress?.detail(contractAddress.value) || "/"}
          >
            {formatLongText(contractAddress?.value || "")}
          </StyledLink>
        </CustomTooltip>
      </Box>
      <Box>
        <WrapLabel>{t("contract.purpose")}:</WrapLabel>
        <Typography>{data.purpose}</Typography>
        {!!data?.burningTokens?.length && (
          <span>
            (
            <Typography component="span" color={theme.palette.error[700]}>
              <Uppercase>{t("contract.burn")}</Uppercase>
            </Typography>
            )
          </span>
        )}
        {isMobile || isTablet ? (
          <CustomTooltip title={contractAddress?.explain} open={open}>
            <InfoIcon ref={containerRef} onClick={() => setOpen(!open)} />
          </CustomTooltip>
        ) : (
          <CustomTooltip title={contractAddress?.explain}>
            <InfoIcon />
          </CustomTooltip>
        )}
      </Box>
      <Box>
        <CLButton onClick={() => onClick?.(data)}>{t("contract.viewContract")}</CLButton>
      </Box>
    </CLCardContaienr>
  );
};

export default ContractItem;
