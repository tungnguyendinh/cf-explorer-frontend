import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { stringify } from "qs";

import Card from "src/components/commons/Card";
import Table, { Column } from "src/components/commons/Table";
import { formatADAFull, formatDateTimeLocal, getPageInfo, getShortHash, numberWithCommas } from "src/commons/utils/helper";
import { details } from "src/commons/routers";
import useFetchList from "src/commons/hooks/useFetchList";
import { API } from "src/commons/utils/api";
import ADAicon from "src/components/commons/ADAIcon";
import { REFRESH_TIMES } from "src/commons/utils/constants";
import CustomTooltip from "src/components/commons/CustomTooltip";

import { EpochNo, StyledOutput, StyledColorBlueDard, StyledContainer, StyledLink, PriceWrapper } from "./styles";

interface IEpochBlockList {
  epochId: string;
}

const EpochBlockList: React.FC<IEpochBlockList> = ({ epochId }) => {
  const { search } = useLocation();
  const history = useHistory();
  const pageInfo = getPageInfo(search);

  const fetchData = useFetchList<BlockDetail>(
    `${API.EPOCH.DETAIL}/${epochId}/blocks`,
    pageInfo,
    false,
    pageInfo.page === 0 ? REFRESH_TIMES.EPOCH_DETAIL : 0
  );

  const columns: Column<BlockDetail>[] = [
    {
      title: "#",
      key: "#",
      minWidth: "50px",
      render: (_, index) => {
        return (
          <StyledColorBlueDard>{numberWithCommas(pageInfo.page * pageInfo.size + index + 1 || 0)}</StyledColorBlueDard>
        );
      }
    },
    {
      title: "Block No",
      key: "block",
      minWidth: "100px",
      render: (r) => (
        <StyledLink to={details.block(r.blockNo || r.hash)}>{r.blockNo || getShortHash(r.hash || "")}</StyledLink>
      )
    },
    {
      title: "Block ID",
      key: "blockId",
      minWidth: "150px",
      render: (r) => (
        <CustomTooltip title={r.hash}>
          <StyledLink to={details.block(r.blockNo || r.hash)}>{getShortHash(`${r.hash}`)}</StyledLink>
        </CustomTooltip>
      )
    },
    {
      title: "Slot",
      key: "slot",
      minWidth: "100px",
      render: (r) => (
        <>
          <EpochNo>{r.slotNo}</EpochNo>
          <div>
            {r.epochNo}/{r.epochSlotNo || 0}
          </div>
        </>
      )
    },
    {
      title: "Transactions",
      key: "blkCount",
      minWidth: "100px",
      render: (r) => <StyledColorBlueDard>{r.txCount || 0}</StyledColorBlueDard>
    },
    {
      title: "Fees",
      key: "fees",
      render: (r) => (
        <PriceWrapper>
          {formatADAFull(r.totalFees)}
          <ADAicon />
        </PriceWrapper>
      )
    },
    {
      title: "Output",
      key: "outSum",
      minWidth: "100px",
      render: (r) => (
        <StyledOutput>
          <StyledColorBlueDard>{formatADAFull(r.totalOutput)}</StyledColorBlueDard>
          <ADAicon />
        </StyledOutput>
      )
    },
    {
      title: "Created At",
      key: "time",
      minWidth: "100px",
      render: (r) => <PriceWrapper>{formatDateTimeLocal(r.time)}</PriceWrapper>,
    }
  ];

  return (
    <StyledContainer>
      <Card title={"Blocks"} underline>
        <Table
          {...fetchData}
          columns={columns}
          total={{ title: "Total Blocks", count: fetchData.total }}
          pagination={{
            ...pageInfo,
            total: fetchData.total,
            onChange: (page, size) => history.replace({ search: stringify({ page, size }) })
          }}
          onClickRow={(_, r) => history.push(details.block(r.blockNo || r.hash))}
        />
      </Card>
    </StyledContainer>
  );
};

export default EpochBlockList;
