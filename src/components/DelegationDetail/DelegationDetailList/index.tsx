import { Tooltip } from "@mui/material";
import moment from "moment";
import { parse, stringify } from "qs";
import { useHistory, useLocation } from "react-router-dom";

import { routers } from "../../../commons/routers";
import { formatADA, getShortWallet, numberWithCommas } from "../../../commons/utils/helper";
import CopyButton from "../../commons/CopyButton";
import Table, { Column } from "../../commons/Table";
import { StyledLink } from "./styles";

const DelegationEpochList = ({
  data,
  loading,
  total,
  initialized,
  scrollEffect,
}: {
  data: DelegationEpoch[] | null;
  loading: boolean;
  initialized: boolean;
  total: number;
  scrollEffect: () => void;
}) => {
  const history = useHistory();
  const { search } = useLocation();
  const query = parse(search.split("?")[1]);
  const setQuery = (query: any) => {
    history.push({ search: stringify(query) });
  };
  const columns: Column<DelegationEpoch>[] = [
    {
      title: "Epoch",
      key: "epoch",
      minWidth: "120px",
      render: r => <StyledLink to={routers.EPOCH_DETAIL.replace(":epochId", `${r.epoch}`)}>{r.epoch}</StyledLink>,
    },
    {
      title: "Blocks",
      key: "block",
      minWidth: "120px",
      render: data => (
        <StyledLink to={routers.BLOCK_DETAIL.replace(":blockId", `${data.block}`)}>
          {numberWithCommas(data.block || 0)}
        </StyledLink>
      ),
    },
    {
      title: "Stake Amount(A)",
      key: "stakeAmount",
      minWidth: "120px",
      render: data => <> {formatADA(data.stakeAmount)}</>,
    },
    {
      title: "Delegator Reward(A)",
      key: "delegatorReward",
      minWidth: "120px",
      render: data => <>{formatADA(data.delegatorReward)}</>,
    },
    {
      title: "Fees(A)",
      key: "fees",
      minWidth: "120px",
      render: data => <>{formatADA(data.fees)}</>,
    },
    {
      title: "ROS",
      key: "ros",
      minWidth: "120px",
      render: data => <>{data.ros ? `${data.ros}%` : ""}</>,
    },
  ];

  return (
    <Table
      columns={columns}
      data={data || []}
      onClickRow={(_, r) => history.push(routers.EPOCH_DETAIL.replace(":epochId", `${r.epoch}`))}
      total={{ count: total, title: "Total Token List" }}
      loading={loading}
      initialized={initialized}
      pagination={{
        onChange: (page, size) => {
          setQuery({ page, size });
        },
        page: query.page ? +query.page - 1 : 0,
        total: total,
      }}
    />
  );
};

const DelegationStakingDelegatorsList = ({
  data,
  initialized,
  loading,
  total,
  scrollEffect,
}: {
  data: StakingDelegators[] | null;
  loading: boolean;
  initialized: boolean;
  total: number;
  scrollEffect: () => void;
}) => {
  const { search } = useLocation();
  const query = parse(search.split("?")[1]);
  const history = useHistory();
  const setQuery = (query: any) => {
    history.push({ search: stringify(query) });
  };
  const columns: Column<StakingDelegators>[] = [
    {
      title: "No",
      key: "no",
      render: (r, idx) => (
        <StyledLink to={routers.ADDRESS_DETAIL.replace(":address", `${r.address}`)}>{idx + 1}</StyledLink>
      ),
    },
    {
      title: "Delegator",
      key: "delegator",
      minWidth: "50px",
      render: data =>
        data.address && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <Tooltip placement="bottom" title={data.address || ""}>
              <StyledLink to={routers.ADDRESS_DETAIL.replace(":address", `${data.address}`)}>
                {getShortWallet(data.address || "")}
              </StyledLink>
            </Tooltip>
            <CopyButton text={data.address || ""} />
          </div>
        ),
    },
    {
      title: "Total Value(A)",
      key: "value",
      minWidth: "120px",
      render: data => <> {formatADA(data.totalStake || 0)}</>,
    },
    {
      title: "Staked Time",
      key: "stakedTime",
      minWidth: "120px",
      render: data => <>{moment(data.time).format("DD/MM/YYYY HH:mm/ss")}</>,
    },
    {
      title: "Fees(A)",
      key: "fees",
      minWidth: "120px",
      render: data => <>{formatADA(data.fee || 0)}</>,
    },
  ];

  return (
    <Table
      columns={columns}
      data={data ? data : []}
      total={{ count: total, title: "Total Token List" }}
      loading={loading}
      initialized={initialized}
      pagination={{
        onChange: (page, size) => {
          setQuery({ page, size });
        },
        page: query.page ? +query.page - 1 : 0,
        total: total,
      }}
      onClickRow={(e, r) => history.push(routers.ADDRESS_DETAIL.replace(":address", `${r.address}`))}
    />
  );
};

export { DelegationEpochList, DelegationStakingDelegatorsList };
