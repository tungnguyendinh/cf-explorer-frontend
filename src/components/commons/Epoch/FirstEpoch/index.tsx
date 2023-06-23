import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import moment from "moment";

import { ExchangeIcon, cubeIconUrl, slotIconUrl, timeIconUrl } from "src/commons/resources";
import { EPOCH_STATUS, MAX_SLOT_EPOCH } from "src/commons/utils/constants";
import { formatDateTimeLocal } from "src/commons/utils/helper";
import { Status } from "src/pages/Epoch/styles";

import { Container, Content, EpochNumber, EpochProgress, SubContent, TitleCard } from "./styles";
import ProgressCircle from "../../ProgressCircle";
import DetailHeader from "../../DetailHeader";

interface IProps {
  data: IDataEpoch;
  onClick: (_: any, r: IDataEpoch, index: number) => void;
}

export default function FirstEpoch({ data: currentEpochData, onClick }: IProps) {
  const { currentEpoch } = useSelector(({ system }: RootState) => system);
  if (!currentEpochData) return null;
  const progress =
    moment(formatDateTimeLocal(currentEpochData.endTime)).diff(moment()) >= 0
      ? (((currentEpoch?.slot || 0) / MAX_SLOT_EPOCH) * 100).toFixed(0)
      : 100;
  const listOverview = [
    {
      icon: ExchangeIcon,
      hideHeader: true,
      title: <EpochNumber>{currentEpochData?.no}</EpochNumber>,
      value: (
        <Box display={"flex"} alignItems="center" justifyContent={"center"}>
          <ProgressCircle
            size={100}
            pathLineCap="butt"
            pathWidth={6}
            trailWidth={6}
            percent={Number(progress)}
            trailOpacity={1}
          >
            <EpochProgress>{`${progress}%`}</EpochProgress>
            <Status status={currentEpochData?.status?.toLowerCase()}>
              {EPOCH_STATUS[currentEpochData?.status]}
            </Status>
          </ProgressCircle>
        </Box>
      )
    },
    {
      icon: cubeIconUrl,
      title: (
        <Box display={"flex"} alignItems="center">
          <TitleCard mr={1}>Block </TitleCard>
        </Box>
      ),
      value: <Content>{currentEpochData?.blkCount}</Content>
    },
    {
      icon: slotIconUrl,
      title: (
        <Box display={"flex"} alignItems="center">
          <TitleCard mr={1}> Slot</TitleCard>
        </Box>
      ),
      value: (
        <Content>
          {moment(formatDateTimeLocal(currentEpochData.endTime)).diff(moment()) >= 0
            ? currentEpoch?.slot
            : MAX_SLOT_EPOCH}
          <SubContent>/{MAX_SLOT_EPOCH}</SubContent>
        </Content>
      )
    },
    {
      icon: timeIconUrl,
      title: (
        <Box display={"flex"} alignItems="center">
          <TitleCard mr={1}> Start Time</TitleCard>
        </Box>
      ),
      value: <Content>{formatDateTimeLocal(currentEpochData?.startTime || "")}</Content>
    },
    {
      icon: timeIconUrl,
      title: (
        <Box display={"flex"} alignItems="center">
          <TitleCard mr={1}> End Time</TitleCard>
        </Box>
      ),
      value: <Content>{formatDateTimeLocal(currentEpochData?.endTime || "")}</Content>
    }
  ];
  return (
    <Container onClick={() => onClick(currentEpochData, currentEpochData, -1)}>
      <DetailHeader isHideButtonBack={true} loading={false} listItem={listOverview} type="EPOCH" title={" "} />
    </Container>
  );
}
