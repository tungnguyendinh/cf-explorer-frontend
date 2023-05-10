import { Container } from "../../../Account/ActivityLogModal/styles";
import { StyledTextField } from "../../../TokenAutocomplete/styles";
import { StyledGroupField } from "./styles";
import StyledModal from "../../../commons/StyledModal";
import {
  ModalTitle,
  StyledAddressSelect,
  StyledButton,
  StyledLabel,
  StyledSelect,
  StyledStack,
  TextWarning,
} from "./styles";
import { DownIcon } from "../../../../commons/resources";
import { useCallback, useMemo, useState } from "react";
import { Box, MenuItem, Slider } from "@mui/material";
import CustomDatePicker, { IDateRange } from "../../../CustomDatePicker";
import { IPropsModal, STEPS } from ".";
import { useSelector } from "react-redux";
import { useScreen } from "../../../../commons/hooks/useScreen";

export enum ReportType {
  ChooseReport = "CHOOSE_REPORT",
  PoolReport = "POOL_REPORT",
  StakeKeyReport = "STAKE_KEY_REPORT",
}

const options = [
  {
    value: ReportType.ChooseReport,
    label: "Choose report",
  },
  {
    value: ReportType.PoolReport,
    label: "Pool report",
  },
  {
    value: ReportType.StakeKeyReport,
    label: "Stake key report",
  },
];

type IEpochRange = [number, number];

const FilledInfoModal: React.FC<IPropsModal> = ({ open, handleCloseModal, saveParams, gotoStep }) => {
  const { currentEpoch } = useSelector(({ system }: RootState) => system);

  const [reportType, setReportType] = useState<ReportType>(ReportType.ChooseReport);
  const [address, setAddress] = useState<string>("");
  const [dateRange, setDateRange] = useState<IDateRange>([null, null]);
  const [reportName, setReportName] = useState<string>("");
  const [epochRange, setEpochRange] = useState<IEpochRange>([30, 50]);

  const onChangeReportType = useCallback((e: any) => {
    setReportType(e.target.value as ReportType);
  }, []);

  const onChangeReportName = useCallback((e: any) => {
    setReportName(e.target.value as ReportType);
  }, []);

  const onChangeAddress = useCallback((e: any) => {
    setAddress(e.target.value);
  }, []);

  const { isMobile } = useScreen();

  const isDisabledButton = useMemo(() => {
    const [startDate, endDate] = dateRange;
    if (reportType === ReportType.ChooseReport) return true;

    if (reportType === ReportType.StakeKeyReport) {
      return !address?.trim() || !startDate || !endDate;
    } else {
      return !address?.trim();
    }
  }, [address, dateRange, reportType]);

  let isShowTextWarning = true;
  switch (reportType) {
    case "POOL_REPORT":
      isShowTextWarning = false;
      break;
    case "STAKE_KEY_REPORT":
      isShowTextWarning = false;
      break;
    default:
      isShowTextWarning = true;
  }

  const handleSubmit = () => {
    saveParams?.({
      reportType,
      address,
      dateRange,
      reportName,
      epochRange,
    });
    gotoStep?.(STEPS.step2);
  };

  const handleChangeEpochRange = (event: Event, newValue: number | number[], activeThumb: number) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    const [min, max] = newValue || [];

    setEpochRange([Math.min(min), Math.min(max)]);
  };

  return (
    <StyledModal
      open={open}
      handleCloseModal={handleCloseModal}
      width={555}
      paddingX={isMobile ? '10px' : '40px'}
      paddingY={isMobile ? '20px' : '30px'}
    >
      <Container>
        <ModalTitle>
          <Box sx={{fontSize: `${isMobile ? "20px" : '24px'}`}}>Report composer</Box>
        </ModalTitle>
        <StyledStack>
          <StyledLabel>Report name</StyledLabel>
          <StyledTextField placeholder="Filled report name" value={reportName} onChange={onChangeReportName} />
        </StyledStack>
        <Box sx={{ marginBottom: "20px" }}>
          <StyledLabel>Address details</StyledLabel>
          <StyledAddressSelect display={"flex"}>
            <StyledSelect
              size="small"
              onChange={onChangeReportType}
              value={reportType}
              IconComponent={DownIcon}
              sx={{ paddingRight: `${isMobile ? "12px" : "0px"}` }}
            >
              {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </StyledSelect>
            <StyledGroupField
              onChange={onChangeAddress}
              value={address}
              sx={{ flexGrow: 1 }}
              placeholder="Address details"
            />
          </StyledAddressSelect>
        </Box>
        {reportType === ReportType.StakeKeyReport && (
          <Container>
            <StyledStack>
              <StyledLabel>Select a date range</StyledLabel>
              <CustomDatePicker dateRange={dateRange} setDateRange={setDateRange} />
            </StyledStack>
          </Container>
        )}
        {reportType === ReportType.PoolReport && (
          <Box sx={{ marginBottom: "20px"}}>
            <StyledLabel>Select a epoch range</StyledLabel>
            <Slider
              getAriaLabel={() => "Minimum distance"}
              value={epochRange}
              onChange={handleChangeEpochRange}
              valueLabelDisplay="on"
              disableSwap
              min={0}
              max={currentEpoch?.no || 0}
            />
          </Box>
        )}
        {isShowTextWarning && (
          <TextWarning>The earliest 1,000 transactions within the selected range will be exported</TextWarning>
        )}
        <StyledStack>
          <StyledButton disabled={isDisabledButton} onClick={handleSubmit}>
            Next
          </StyledButton>
        </StyledStack>
      </Container>
    </StyledModal>
  );
};

export default FilledInfoModal;
