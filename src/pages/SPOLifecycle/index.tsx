/* eslint-disable no-debugger */
import { useHistory, useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { CircularProgress } from "@mui/material";

import { getShortWallet } from "src/commons/utils/helper";
import CopyButton from "src/components/commons/CopyButton";
import SPOLifecycleComponent from "src/components/StakingLifeCycle/SPOLifecycle";
import ReportComposerModal from "src/components/StakingLifeCycle/DelegatorLifecycle/ReportComposerModal";
import Tabular from "src/components/StakingLifeCycle/SPOLifecycle/Tablular";
import CustomTooltip from "src/components/commons/CustomTooltip";
import { details } from "src/commons/routers";
import useAuth from "src/commons/hooks/useAuth";
import { API } from "src/commons/utils/api";
import useFetch from "src/commons/hooks/useFetch";
import PoolDetailContext from "src/components/StakingLifeCycle/SPOLifecycle/PoolDetailContext";
import NoRecord from "src/components/commons/NoRecord";
import { ChartMode, TableMode } from "src/commons/resources";

import {
  BoxContainerStyled,
  BoxItemStyled,
  LabelSwitch,
  BoxSwitchContainer,
  SwitchGroup,
  ButtonReport,
  ButtonSwitch,
  LifeCycleHeader,
  LifeCycleTitle,
  StakeId,
  AddressLine,
  StyledContainer,
  Label
} from "./styles";

interface Params {
  poolId: string;
  mode: ViewMode;
  tab: SPOStep;
}

export interface ListTabResponseSPO {
  [key: string]: boolean;
  isRegistration: boolean;
  isUpdate: boolean;
  isReward: boolean;
  isDeRegistration: boolean;
}

const MODES: ViewMode[] = ["timeline", "tabular"];

const SPOLifecycle = () => {
  const { poolId = "", mode = "timeline", tab = "registration" } = useParams<Params>();

  useEffect(() => {
    document.title = `Staking Delegation Lifecycle ${poolId} | Cardano Explorer`;
  }, [poolId]);

  const tabList = {
    registration: 0,
    "pool-updates": 1,
    "operator-rewards": 2,
    deregistration: 3,
    tablular: null
  };

  const { data, error, initialized } = useFetch<PoolInfo>(poolId ? API.SPO_LIFECYCLE.POOL_INFO(poolId) : "");
  const { data: renderTabsSPO, loading: loadingListTabs } = useFetch<ListTabResponseSPO>(
    API.SPO_LIFECYCLE.TABS(poolId)
  );
  const validTab: SPOStep = tabList[tab] >= 0 ? tab : "registration";
  const validMode: ViewMode = MODES.find((item) => item === mode) || "timeline";

  const [currentStep, setCurrentStep] = useState(tabList[validTab]);

  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setCurrentStep(tabList[validTab]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validTab]);

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const history = useHistory();
  const theme = useTheme();
  const { sidebar } = useSelector(({ user }: RootState) => user);

  const changeMode = (mode: ViewMode) => {
    history.push(details.spo(poolId, mode, validTab));
  };

  if (!initialized && !error) return null;
  if (error || !data || !data.poolId) return <NoRecord />;

  return (
    <PoolDetailContext.Provider value={data}>
      <StyledContainer ref={containerRef}>
        <BoxContainerStyled>
          <LifeCycleHeader sidebar={+sidebar}>
            <LifeCycleTitle>Staking Lifecycle For</LifeCycleTitle>
            <AddressLine>
              <Label>Pool ID:</Label>
              <CustomTooltip title={poolId}>
                <StakeId to={details.delegation(poolId)}>{getShortWallet(poolId)}</StakeId>
              </CustomTooltip>
              <CopyButton text={poolId} />
            </AddressLine>
          </LifeCycleHeader>
          <BoxItemStyled sidebar={+sidebar}>
            <BoxSwitchContainer sidebar={+sidebar}>
              <LabelSwitch>Switch to {validMode === "timeline" ? "tabular" : "timeline"} view</LabelSwitch>
              <SwitchGroup>
                <ButtonSwitch active={+(validMode === "timeline")} onClick={() => changeMode("timeline")}>
                  <TableMode fill={validMode === "timeline" ? theme.palette.common.white : theme.palette.grey[500]} />
                </ButtonSwitch>
                <ButtonSwitch active={+(validMode === "tabular")} onClick={() => changeMode("tabular")}>
                  <ChartMode fill={validMode === "tabular" ? theme.palette.common.white : theme.palette.grey[500]} />
                </ButtonSwitch>
              </SwitchGroup>
            </BoxSwitchContainer>
            {validMode === "tabular" && (
              <ButtonReport disabled={!isLoggedIn} onClick={() => setOpen(true)} sidebar={+sidebar}>
                Compose report
              </ButtonReport>
            )}
          </BoxItemStyled>
        </BoxContainerStyled>
        {loadingListTabs && <CircularProgress color="success" />}
        {renderTabsSPO && !loadingListTabs && (
          <>
            {validMode === "timeline" ? (
              <SPOLifecycleComponent
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                renderTabsSPO={renderTabsSPO}
              />
            ) : (
              <Tabular renderTabsSPO={renderTabsSPO} />
            )}
          </>
        )}

        <ReportComposerModal open={open} handleCloseModal={() => setOpen(false)} />
      </StyledContainer>
    </PoolDetailContext.Provider>
  );
};

export default SPOLifecycle;
