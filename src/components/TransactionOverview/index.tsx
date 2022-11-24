import { Link } from "react-router-dom";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useCopyToClipboard } from "react-use";
import { IoMdCopy } from "react-icons/io";
import { BiCheckCircle } from "react-icons/bi";

import Card from "../commons/Card";
import DetailCard from "../commons/DetailCard";
import { formatADA, getShortHash } from "../../commons/utils/helper";

import styles from "./index.module.scss"; 
import { Tooltip } from "antd";
import { AIcon } from "../../commons/resources";

interface Props {
  data: Transaction | null;
  loading: boolean;
}

const TransactionOverview: React.FC<Props> = ({ data, loading }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [selected, setSelected] = useState<string>();

  useEffect(() => {
    if (selected) {
      setTimeout(() => {
        setSelected("");
      }, 3000);
    }
  }, [selected]);
  const listDetails = [
    {
      title: "Transaction hash",
      value: data?.tx.hash && (
        <Tooltip title={data?.tx.hash || ""} placement="bottom">
          <Link to={`#`} className={`${styles.alignCenter} ${styles.link}`}>
            {getShortHash(data?.tx.hash || "")}
            {selected === data?.tx.hash ? (
              <BiCheckCircle size={20} className={styles.icon} />
            ) : (
              <IoMdCopy
                size={20}
                className={styles.icon}
                onClick={() => {
                  copyToClipboard(data?.tx.hash);
                  setSelected(data?.tx.hash);
                }}
              />
            )}
          </Link>
        </Tooltip>
      ),
    },

    {
      title: "Time",
      value: data?.tx.time && moment(data?.tx.time).format("MM/DD/YYYY HH:mm:ss"),
    },
    {
      title: "Status",
      value: <h4 className={`${styles.status} ${styles.green}`}>{data?.tx.status}</h4>,
    },
    {
      title: "Confirmation",
      value: (
        <div className={styles.alignCenter}>
          {data?.tx.confirmation}
          {/* TO DO: check before BA answer */}
          {/* <h4 className={`${styles.status} ${styles.yellow} ${styles.ml10}`}>MEDIUM</h4> */}
        </div>
      ),
    },
    {
      title: "Transaction Fees",
      value: data?.tx.fee && (
        <div className={styles.alignCenter}>
          <span>{formatADA(data?.tx.fee || 0)} ADA </span>
          <img className={styles.img} alt="ada icon" src={AIcon} />
        </div>
      ),
    },
    {
      title: "Total Output",
      value: data?.tx.totalOutput && (
        <div className={styles.alignCenter}>
          <span>{formatADA(data?.tx.totalOutput || 0)} ADA </span>
          <img className={styles.img} alt="ada icon" src={AIcon} />
        </div>
      ),
    },
  ];

  return (
    <Card className={styles.wrapper} title={"Transactions Detail"}>
      <DetailCard
        listDetails={listDetails}
        progress={{
          block: data?.tx.blockNo || 0,
          currentSlot: data?.tx.epochSlot || 0,
          epoch: data?.tx.epochNo || 0,
        }}
        loading={loading}
      />
    </Card>
  );
};

export default TransactionOverview;
