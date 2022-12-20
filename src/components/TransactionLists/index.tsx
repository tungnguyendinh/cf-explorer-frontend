import { Link, useHistory } from "react-router-dom";
import { stringify } from "qs";
import { Box, Tooltip } from "@mui/material";

import Card from "../commons/Card";
import Table, { Column } from "../commons/Table";
import { formatADA, getShortHash, getShortWallet } from "../../commons/utils/helper";
import styles from "./index.module.scss";

import moment from "moment";
import { routers } from "../../commons/routers";
import { AIcon } from "../../commons/resources";
import { StyledContainer } from "./styles";
import DetailViewTransaction from "../commons/DetailView/DetailViewTransaction";
import { useState } from "react";
import { useWindowSize } from "react-use";
import { setOnDetailView } from "../../stores/user";

interface TransactionListProps {
  underline?: boolean;
  transactions: Transactions[];
  loading: boolean;
  initialized: boolean;
  total: number;
  totalPage: number;
  currentPage: number;
  error?: string | null;
}

const TransactionList: React.FC<TransactionListProps> = ({
  underline = false,
  currentPage,
  loading,
  initialized,
  total,
  transactions,
  error,
}) => {
  const [detailView, setDetailView] = useState<string | null>(null);
  const { width } = useWindowSize();
  const history = useHistory();
  const setQuery = (query: any) => {
    history.push({ search: stringify(query) });
  };

  const columns: Column<Transactions>[] = [
    {
      title: "#",
      key: "id",
      minWidth: "40px",
      render: (data, index) => {
        return <div className={styles.fwBold}>{index + 1}</div>;
      },
    },
    {
      title: "Trx Hash",
      key: "trxhash",
      minWidth: "200px",

      render: r => (
        <div>
          <Tooltip title={r.hash} placement="top">
            <Link
              to={routers.TRANSACTION_DETAIL.replace(":trxHash", `${r.hash}`)}
              className={`${styles.link}`}
              style={{ margin: 0 }}
            >
              {getShortHash(r.hash)}
            </Link>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Block",
      key: "block",
      minWidth: "200px",
      render: r => (
        <>
          <Link to={routers.BLOCK_DETAIL.replace(":blockId", `${r.blockNo}`)} className={` ${styles.link}`}>
            {r.blockNo}
          </Link>
          {/* <div style={{ display: "flex" }}>
            <Link to={routers.EPOCH_DETAIL.replace(":epochId", `${r.epochNo}`)} className={`  ${styles.link}`}>
              {r.epochNo}
            </Link>
            /{r.slot}
          </div> */}
        </>
      ),
    },
    {
      title: "Addresses",
      key: "addresses",
      minWidth: "200px",
      render(r, index) {
        return (
          <div>
            <div className={styles.input}>
              <div className={styles.title}> Input: </div>
              <div>
                <Tooltip title={r.addressesInput[0]} placement="top">
                  <Link
                    to={routers.ADDRESS_DETAIL.replace(":address", `${r.addressesInput[0]}`)}
                    className={` ${styles.link}`}
                  >
                    {getShortWallet(r.addressesInput[0])}
                  </Link>
                </Tooltip>
                <br />
                {r.addressesInput.length > 1 && (
                  <Link to={routers.TRANSACTION_DETAIL.replace(":trxHash", `${r.hash}`)} className={` ${styles.link}`}>
                    ...
                  </Link>
                )}
              </div>
            </div>
            <div className={styles.output}>
              <div className={styles.title}>Output: </div>
              <div>
                <Tooltip title={r.addressesOutput[0]} placement="top">
                  <Link
                    to={routers.ADDRESS_DETAIL.replace(":address", `${r.addressesOutput[0]}`)}
                    className={` ${styles.link}`}
                  >
                    {getShortWallet(r.addressesOutput[0])}
                  </Link>
                </Tooltip>
                <br />
                {r.addressesOutput.length > 1 && (
                  <Link to={routers.TRANSACTION_DETAIL.replace(":trxHash", `${r.hash}`)} className={` ${styles.link}`}>
                    ...
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Fees",
      key: "fee",
      minWidth: "120px",
      render: r => (
        <Box display={"flex"} alignItems="center" className={styles.fwBold}>
          <Box mr={1}>{formatADA(r.fee) || 0}</Box>
          <img src={AIcon} alt="a icon" />
        </Box>
      ),
    },
    {
      title: "Output",
      minWidth: "120px",
      key: "ouput",
      render: r => (
        <Box display={"flex"} alignItems="center" className={styles.fwBold}>
          <Box mr={1}>{formatADA(r.totalOutput) || 0}</Box>
          <img src={AIcon} alt="a icon" />
        </Box>
      ),
    },
  ];
  const openDetail = (_: any, r: Transactions) => {
    if (width > 1023) {
      setOnDetailView(true);
      setDetailView(r.hash);
    } else history.push(routers.TRANSACTION_DETAIL.replace(":trxHash", `${r.hash}`));
  };

  const handleClose = () => {
    setOnDetailView(false);
    setDetailView(null);
  };

  const selected = transactions?.findIndex(item => item.hash === detailView);
  return (
    <StyledContainer>
      <Card title={"Transactions"} underline={underline}>
        <Table
          className={styles.table}
          columns={columns}
          data={transactions}
          total={{ count: total, title: "Total Transactions" }}
          loading={loading}
          initialized={initialized}
          pagination={{
            onChange: (page, size) => {
              setQuery({ page, size });
            },
            page: currentPage || 0,
            total: total,
          }}
          onClickRow={openDetail}
          selected={selected}
          selectedProps={{ style: { backgroundColor: "#ECECEC" } }}
          error={error}
        />
      </Card>
      {detailView && <DetailViewTransaction hash={detailView} handleClose={handleClose} />}
    </StyledContainer>
  );
};

export default TransactionList;
