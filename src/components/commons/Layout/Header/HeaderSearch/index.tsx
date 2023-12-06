/* eslint-disable no-case-declarations */
import React, { FormEvent, useState, useEffect, useCallback } from "react";
import { Backdrop, Box, SelectChangeEvent, CircularProgress, useTheme } from "@mui/material";
import { stringify } from "qs";
import { BiChevronDown } from "react-icons/bi";
import { GoChevronRight } from "react-icons/go";
import { useSelector } from "react-redux";
import { RouteComponentProps, useHistory, withRouter } from "react-router-dom";
import { isNil, isObject, omitBy } from "lodash";
import { useTranslation } from "react-i18next";
import axios from "axios";

import { HeaderSearchIconComponent } from "src/commons/resources";
import { details, routers } from "src/commons/routers";
import { useScreen } from "src/commons/hooks/useScreen";
import { API } from "src/commons/utils/api";
import defaultAxios from "src/commons/utils/axios";
import { getShortHash } from "src/commons/utils/helper";
import CustomIcon from "src/components/commons/CustomIcon";
import { API_ADA_HANDLE_API } from "src/commons/utils/constants";

import {
  Form,
  Option,
  OptionsWrapper,
  SelectOption,
  StyledInput,
  StyledSelect,
  SubmitButton,
  ValueOption
} from "./style";

interface FormValues {
  filter: FilterParams;
  search: string;
}

interface Option {
  value: FilterParams;
  label: React.ReactNode;
  paths?: (typeof routers)[keyof typeof routers][];
  detail?: (typeof details)[keyof typeof details];
}
const intitalValue: FormValues = {
  filter: "all",
  search: ""
};

const URL_FETCH_DETAIL = {
  epochs: (epoch: number) => `${API.EPOCH.DETAIL}/${epoch}`,
  blocks: (block: number) => `${API.BLOCK.DETAIL}/${block}`,
  txs: (trx: string) => `${API.TRANSACTION.DETAIL}/${trx}`,
  addresses: (address: string) => `${API.ADDRESS.DETAIL}/${address}`,
  stake: (stake: string) => `${API.STAKE.DETAIL}/${stake}`,
  policies: (policy: string) => `${API.SCRIPTS_SEARCH}/${policy}`
};

interface Props extends RouteComponentProps {
  home: boolean;
  callback?: () => void;
  setShowErrorMobile?: (show: boolean) => void;
}

interface IResponseSearchAll {
  epoch?: number;
  block?: string;
  tx?: string;
  token?: {
    name: string;
    fingerprint: string;
  };
  validTokenName?: boolean;
  address?: {
    address: string;
    stakeAddress: true;
    paymentAddress: true;
  };
  pool?: {
    name: string;
    poolId: string;
    icon: string;
  };
  validPoolName?: true;
  script: {
    scriptHash?: string;
    nativeScript?: boolean;
    smartContract?: boolean;
  };
}
const RESULT_SIZE = 5;

const HeaderSearch: React.FC<Props> = ({ home, callback, setShowErrorMobile, history }) => {
  const [{ search, filter }, setValues] = useState<FormValues>({ ...intitalValue });
  const [showOption, setShowOption] = useState(false);
  const theme = useTheme();
  const [error, setError] = useState("");
  const { sidebar } = useSelector(({ user }: RootState) => user);
  const [dataSearchAll, setDataSearchAll] = useState<IResponseSearchAll | undefined>();
  const [dataSearchTokensAndPools, setDataSearchTokensAndPools] = useState<
    TokensSearch[] | DelegationPool[] | undefined
  >();
  const [ADAHandleOption, setADAHanldeOption] = useState<
    { stakeAddress: string; paymentAddress: string } | undefined
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [totalResult, setTotalResult] = useState<number>(0);

  const { t } = useTranslation();

  const options: Option[] = [
    {
      value: "all",
      label: t("filter.allFilters")
    },
    {
      value: "epochs",
      label: t("filter.epochs"),
      paths: [routers.EPOCH_LIST, routers.EPOCH_DETAIL],
      detail: details.epoch
    },
    {
      value: "blocks",
      label: t("filter.blocks"),
      paths: [routers.BLOCK_LIST, routers.BLOCK_DETAIL],
      detail: details.block
    },
    {
      value: "txs",
      label: t("filter.transactions"),
      paths: [routers.TRANSACTION_LIST, routers.TRANSACTION_DETAIL],
      detail: details.transaction
    },
    {
      value: "tokens",
      label: t("filter.tokens"),
      paths: [routers.TOKEN_LIST, routers.TOKEN_DETAIL],
      detail: details.token
    },
    {
      value: "addresses",
      label: t("filter.address"),
      paths: [
        routers.ADDRESS_LIST,
        routers.CONTRACT_LIST,
        routers.ADDRESS_DETAIL,
        routers.STAKE_ADDRESS_REGISTRATION,
        routers.STAKE_ADDRESS_DEREGISTRATION,
        routers.STAKE_ADDRESS_DELEGATIONS,
        routers.TOP_DELEGATOR,
        routers.STAKE_DETAIL
      ],
      detail: details.address
    },
    {
      value: "delegations/pool-detail-header",
      label: t("filter.pools"),
      paths: [
        routers.DELEGATION_POOLS,
        routers.DELEGATION_POOL_DETAIL,
        routers.POOL_CERTIFICATE,
        routers.POOL_DEREGISTRATION
      ],
      detail: details.delegation
    },
    {
      value: "policies",
      label: t("filter.scriptHash"),
      paths: [routers.SMART_CONTRACT, routers.NATIVE_SCRIPT_DETAIL],
      detail: details.policyDetail
    }
  ];

  const adaHandleSearch = async (query: string) => {
    try {
      return await axios.get(API_ADA_HANDLE_API + API.ADAHandle(query)).then((data) => data.data);
    } catch (error) {
      return error;
    }
  };

  const showResultNotFound = () => {
    setError(t("message.noResultsFound"));
    setShowErrorMobile?.(true);
    setDataSearchAll(undefined);
    setShowOption(true);
  };

  const handleSearchAll = async (query: string) => {
    try {
      setLoading(true);
      const res = await defaultAxios.get(API.SEARCH_ALL(query));
      const adaHanlde = await adaHandleSearch(search);
      setADAHanldeOption(adaHanlde);
      setDataSearchAll(res?.data);
      const keyDetail = getKeyIfOnlyOneNonNullResult(res?.data);
      if (adaHanlde && (!keyDetail || keyDetail === "address")) {
        setLoading(false);
        setShowOption(false);
        if (adaHanlde?.stakeAddress) {
          history.push(details.stake(search));
          return;
        } else {
          history.push(details.address(search));
        }
      }

      if (!adaHanlde.paymentAddress) {
        if (keyDetail) {
          handleRedirectDetail(keyDetail, res?.data);
          setLoading(false);
          setShowOption(false);
          return;
        }
      }

      setShowOption(true);
      setLoading(false);
    } catch {
      showResultNotFound();
      setLoading(false);
    }
  };

  const handleRedirectDetail = (key: string, data: IResponseSearchAll) => {
    switch (key) {
      case "epoch":
        history.push(details.epoch(data.epoch as number));
        return;
      case "block":
        history.push(details.block(data.block as string));
        return;
      case "address":
        const address = data.address?.address as string;
        if (address.startsWith("stake")) {
          history.push(details.stake(address));
          return;
        }
        history.push(details.address(address));
        return;
      case "token":
        history.push(details.token(encodeURIComponent(data?.token?.fingerprint as string)));
        return;
      case "pool":
        history.push(details.delegation(data?.pool?.poolId));
        return;
      case "tx":
        history.push(details.transaction(data?.tx as string));
        return;
      case "script":
        if (data?.script?.nativeScript) {
          history.push(details.nativeScriptDetail(data?.script?.scriptHash as string));
          return;
        } else {
          history.push(details.smartContract(data?.script?.scriptHash as string));
          return;
        }
      default:
    }
  };

  const getKeyIfOnlyOneNonNullResult = (data: IResponseSearchAll | undefined) => {
    let count = 0;
    let keyName = "";
    for (const key in data) {
      if (
        !["validTokenName", "validPoolName", "isNativeScript"].includes(key) &&
        !!data[key as keyof IResponseSearchAll]
      ) {
        count++;
        keyName = key;
      }
    }
    return count === 1 ? keyName : "";
  };

  const FetchSearchTokensAndPools = async (query: string, filter: FilterParams) => {
    try {
      setLoading(true);

      const urlParams = new URLSearchParams(window.location.search);
      const entries = urlParams.entries();
      const params = Object.fromEntries(entries);
      const search: { query?: string; search?: string; retired?: boolean } = { ...params };

      if (filter === "tokens") {
        search.query = query.trim();
      } else {
        search.search = query.trim();
      }
      const url = `${
        filter === "tokens" ? API.TOKEN.LIST : API.DELEGATION.POOL_LIST
      }?page=0&size=${RESULT_SIZE}&${stringify(search)}`;
      const res = await defaultAxios.get(url);
      setTotalResult(res?.data && res.data?.totalItems ? res.data?.totalItems : 0);

      setDataSearchTokensAndPools(res?.data && res?.data?.data ? res?.data?.data : undefined);
      if (res?.data && res.data?.totalItems > 0) {
        if (filter === "tokens") {
          res.data?.totalItems === 1
            ? history.push(details.token(encodeURIComponent((res?.data?.data[0] as TokensSearch)?.fingerprint)))
            : history.push(`${routers.TOKEN_LIST}?tokenName=${(search.query || "").toLocaleLowerCase()}`);
          handleSetSearchValueDefault();
        } else {
          res.data?.totalItems === 1
            ? history.push(details.delegation((res?.data?.data[0] as DelegationPool)?.poolId))
            : history.push(routers.DELEGATION_POOLS, {
                tickerNameSearch: (search.search || "").toLocaleLowerCase(),
                retired: params && params.retired
              });
          handleSetSearchValueDefault();
        }
      } else {
        setShowOption(true);
      }
      setLoading(false);
    } catch {
      showResultNotFound();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!search) {
      setShowOption(false);
    }
    setDataSearchAll(undefined);
    setDataSearchTokensAndPools(undefined);
  }, [search, filter]);

  const currentPath = history.location.pathname.split("/")[1];

  const checkIncludesPath = useCallback(
    (paths: Option["paths"]) => paths?.find((path) => path?.split("/")[1] === currentPath),
    [currentPath]
  );

  useEffect(() => {
    const filter: FilterParams = options.find((item) => checkIncludesPath(item.paths))?.value || "all";
    if ("/" + currentPath !== routers.SEARCH) setValues({ ...intitalValue, filter });
    setError("");
    setShowErrorMobile?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, checkIncludesPath, setError, setShowErrorMobile, setValues]);

  const handleSearch = async (e?: FormEvent, filterParams?: FilterParams) => {
    e?.preventDefault();
    const option = options.find((item) => item.value === (filterParams || filter));

    if (option?.value === "policies") {
      try {
        setLoading(true);
        const url = URL_FETCH_DETAIL["policies"](search);
        await defaultAxios
          .get(url)
          .then((res) => res.data)
          .then((data: { nativeScript: boolean; scriptHash: string; smartContract: boolean }) => {
            if (data.nativeScript) {
              history.push(details.nativeScriptDetail(data.scriptHash || "", "script"));
              handleSetSearchValueDefault();
            }
            if (data.smartContract) {
              history.push(details.smartContract(data.scriptHash || "associated"));
              handleSetSearchValueDefault();
            }
          });
        setShowOption(false);
      } catch (error) {
        showResultNotFound();
        setShowOption(true);
        return;
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!["all", "tokens", "delegations/pool-detail-header", "addresses"].includes(option?.value || "")) {
      setLoading(true);
      let url = "";

      url = URL_FETCH_DETAIL[option?.value as keyof typeof URL_FETCH_DETAIL]
        ? URL_FETCH_DETAIL[option?.value as keyof typeof URL_FETCH_DETAIL](search as never)
        : "";

      try {
        await defaultAxios.get(url);
      } catch (error) {
        showResultNotFound();
        setShowOption(true);
        return;
      } finally {
        setLoading(false);
      }
    }

    if (option?.value === "addresses") {
      setLoading(true);
      const dataHanlde = await adaHandleSearch(search);
      if (dataHanlde) {
        handleSetSearchValueDefault();
        if (dataHanlde.stakeAddress) {
          history.push(details.stake(search));
        } else {
          history.push(details.address(search));
        }
      } else {
        try {
          if (search.startsWith("stake")) {
            await defaultAxios.get(URL_FETCH_DETAIL["stake"](search)).then((data) => data.data);
          } else {
            await defaultAxios.get(URL_FETCH_DETAIL["addresses"](search)).then((data) => data.data);
          }
          if (search.startsWith("stake")) {
            history.push(details.stake(search));
            handleSetSearchValueDefault();
            callback?.();
            return;
          }
          history.push(details.address(search));
          handleSetSearchValueDefault();
        } catch (error) {
          showResultNotFound();
          setShowOption(true);
          return;
        } finally {
          setLoading(false);
        }
      }
      setLoading(false);
      return;
    }

    if (option?.value === "lifecycle") {
      if (search.startsWith("stake")) {
        history.push(details.staking(search, "timeline"));
        handleSetSearchValueDefault();
        callback?.();
      } else if (search.startsWith("pool")) {
        history.push(details.spo(search, "timeline"));
        handleSetSearchValueDefault();
        callback?.();
      } else {
        showResultNotFound();
        setShowOption(true);
      }
      return;
    }

    if (option?.value === "tokens" || option?.value === "delegations/pool-detail-header") {
      FetchSearchTokensAndPools(search, filter);
      return;
    }

    if (search && filter === "all") {
      handleSearchAll(search);
      return;
    }

    callback?.();

    if (option?.value === "blocks") {
      history.push(details.block(search.trim()));
      handleSetSearchValueDefault();
      callback?.();
      return;
    }
    if (option?.value === "epochs") {
      history.push(details.epoch(search.trim()));
      handleSetSearchValueDefault();
      callback?.();
      return;
    }

    if (option?.value === "all" && search.startsWith("stake")) {
      history.push(details.stake(search));
      handleSetSearchValueDefault();
      callback?.();
      return;
    }

    if (search) {
      const params = { search, filter: filterParams || (filter !== "all" ? filter : undefined) };
      history.push(`${routers.SEARCH}?${stringify(params)}`);
      setError("");
      setShowErrorMobile?.(false);
    }
  };

  const handleSetSearchValueDefault = () => {
    setValues(({ filter }) => ({ filter, search: "" }));
  };
  const handleChangeFilter = (e: SelectChangeEvent<unknown>) => {
    setValues({ search, filter: e.target.value as Option["value"] });
    setError("");
    setShowErrorMobile?.(false);
    setADAHanldeOption(undefined);
  };

  const handleChangeSearch = (e?: React.ChangeEvent) => {
    setValues({ filter, search: (e?.target as HTMLInputElement)?.value || "" });
    setError("");
    setShowErrorMobile?.(false);
    onFocus((e?.target as HTMLInputElement)?.value);
    setDataSearchAll(undefined);
    setADAHanldeOption(undefined);
  };
  const onFocus = (newValue?: string) => {
    if (!isNaN(+(newValue ?? search)) && (newValue ?? search) && filter === "all") {
      setShowOption(true);
    } else {
      setShowOption(false);
    }
  };

  const isStakingLifecycle = checkIncludesPath([routers.DELEGATOR_LIFECYCLE, routers.SPO_LIFECYCLE]);

  const { isMobile } = useScreen();

  return (
    <Form onSubmit={handleSearch} home={+home} sidebar={+sidebar} data-testid="header-search">
      <Backdrop sx={{ backgroundColor: "unset" }} open={showOption} onClick={() => setShowOption(false)} />
      <StyledSelect
        data-testid="all-filters-dropdown"
        onChange={handleChangeFilter}
        value={filter}
        IconComponent={BiChevronDown}
        home={home ? 1 : 0}
        MenuProps={{
          MenuListProps: {
            sx: {
              bgcolor: ({ palette }) => `${palette.secondary[0]} !important`
            }
          },
          PaperProps: {
            sx: {
              bgcolor: ({ palette }) => `${palette.secondary[0]} !important`
            }
          }
        }}
      >
        {options.map(({ value, label }) => (
          <SelectOption data-testid="filter-options" key={value} value={value} home={home ? 1 : 0}>
            {label}
          </SelectOption>
        ))}
      </StyledSelect>
      <StyledInput
        data-testid="search-bar"
        home={home ? 1 : 0}
        required
        type="search"
        value={search}
        spellCheck={false}
        placeholder={
          home && !isMobile
            ? t("filter.placeholder.searchAll")
            : isStakingLifecycle && !isMobile
            ? t("filter.placeholder.searchAddressPools")
            : t("filter.placeholder.search")
        }
        title={
          home && !isMobile
            ? t("filter.placeholder.searchAll")
            : isStakingLifecycle && !isMobile
            ? t("filter.placeholder.searchAddressPools")
            : t("filter.placeholder.search")
        }
        onChange={handleChangeSearch}
        disableUnderline
        onFocus={() => onFocus()}
      />
      {showOption && (
        <OptionsSearch
          showResultNotFound={showResultNotFound}
          error={error}
          home={home}
          totalResult={totalResult}
          filter={filter}
          show={showOption}
          value={search}
          data={dataSearchAll}
          setShowOption={setShowOption}
          dataSearchTokensAndPools={dataSearchTokensAndPools}
          ADAHandleOption={ADAHandleOption}
        />
      )}
      {loading && search ? (
        <SubmitButton type="submit" home={home ? 1 : 0} disabled={true}>
          <CircularProgress size={20} />
        </SubmitButton>
      ) : (
        <SubmitButton type="submit" home={home ? 1 : 0} disabled={!search.trim()}>
          <CustomIcon
            icon={HeaderSearchIconComponent}
            stroke={theme.palette.secondary.light}
            fill={theme.palette.secondary[0]}
            height={home ? 24 : 20}
            width={home ? 24 : 20}
          />
        </SubmitButton>
      )}
    </Form>
  );
};

export default withRouter(HeaderSearch);

interface OptionProps {
  show: boolean;
  home: boolean;
  value: string;
  error: string;
  data?: IResponseSearchAll;
  dataSearchTokensAndPools?: TokensSearch[] | DelegationPool[];
  showResultNotFound: () => void;
  setShowOption: (show: boolean) => void;
  filter: FilterParams;
  totalResult: number;
  ADAHandleOption:
    | {
        stakeAddress: string;
        paymentAddress: string;
      }
    | undefined;
}

export const OptionsSearch = ({
  show,
  home,
  value,
  error,
  data,
  showResultNotFound,
  setShowOption,
  filter,
  dataSearchTokensAndPools,
  totalResult,
  ADAHandleOption
}: OptionProps) => {
  const history = useHistory();
  const listOptionsTokensAndPools = dataSearchTokensAndPools?.map((i) => {
    const renderName = () => {
      if (filter === "tokens") {
        return (
          <ValueOption>
            {(i as TokensSearch)?.displayName?.startsWith("asset") && (i as TokensSearch)?.displayName.length > 43
              ? getShortHash((i as TokensSearch)?.fingerprint || "")
              : (i as TokensSearch)?.displayName}
          </ValueOption>
        );
      }
      if (filter === "delegations/pool-detail-header") {
        return (
          <ValueOption>
            {(i as DelegationPool)?.poolName || getShortHash((i as DelegationPool)?.poolId || "")}
          </ValueOption>
        );
      }
    };
    return {
      suggestText: (
        <Box>
          Search for a {filter === "tokens" ? "token" : "pool"} {renderName()}
        </Box>
      ),
      cb: () =>
        history.push(
          filter === "tokens"
            ? details.token(encodeURIComponent((i as TokensSearch)?.fingerprint))
            : details.delegation(encodeURIComponent((i as DelegationPool)?.poolId))
        )
    };
  });

  const listOptions =
    (isObject(data) &&
      Object.entries(omitBy(data, isNil))
        .map(([key, objValue]) => {
          switch (key) {
            case "epoch":
              return {
                suggestText: "Search for an Epoch",
                cb: () => history.push(details.epoch((value || "").trim().toLocaleLowerCase())),
                formatter: getShortHash
              };
            case "block":
              return {
                suggestText: "Search for a Block by number",
                cb: () => history.push(details.block((value || "").trim().toLocaleLowerCase())),
                formatter: getShortHash
              };
            case "tx":
              return {
                suggestText: "Search for a Transaction by",
                cb: () => history.push(details.transaction((value || "").trim().toLocaleLowerCase())),
                formatter: getShortHash
              };
            case "address":
              const addressLink = objValue?.stakeAddress
                ? `${details.stake((value || "").trim().toLocaleLowerCase())}&isAddress=true`
                : `${details.address((value || "").trim().toLocaleLowerCase())}&isAddress=true`;
              return {
                suggestText: "Search for an Address by",
                cb: () => history.push(addressLink),
                formatter: getShortHash
              };
            case "validTokenName":
              if (data.validTokenName) {
                if (data.token) {
                  // setShowOption(false);
                  return {
                    suggestText: (
                      <Box>
                        Search {""}
                        <ValueOption>{getShortHash(value || "")}</ValueOption> in Tokens
                      </Box>
                    ),
                    cb: () => history.push(details.token(data?.token?.fingerprint)),
                    formatter: getShortHash
                  };
                }
                return {
                  suggestText: (
                    <Box>
                      Search {""}
                      <ValueOption>{getShortHash(value || "")}</ValueOption> in Tokens
                    </Box>
                  ),
                  cb: () =>
                    history.push(
                      `${routers.TOKEN_LIST}?tokenName=${encodeURIComponent((value || "").trim().toLocaleLowerCase())}`
                    ),
                  formatter: getShortHash
                };
              }
              return;
            case "validPoolName":
              if (data?.validPoolName) {
                if (data.pool) {
                  // setShowOption(false);
                  return {
                    suggestText: (
                      <Box>
                        Search {""}
                        <ValueOption>{getShortHash(value || "")}</ValueOption> in Pools
                      </Box>
                    ),
                    cb: () => history.push(details.delegation(data?.pool?.poolId)),
                    formatter: getShortHash
                  };
                }
                return {
                  suggestText: (
                    <Box>
                      Search {""}
                      <ValueOption>{getShortHash(value || "")}</ValueOption> in Pools
                    </Box>
                  ),
                  cb: () =>
                    history.push(routers.DELEGATION_POOLS, {
                      tickerNameSearch: encodeURIComponent((value || "").trim().toLocaleLowerCase())
                    }),
                  formatter: getShortHash
                };
              }
              return;
            case "pool": {
              if (data.validPoolName) return;
              if (data?.pool) {
                setShowOption(false);
                return {
                  suggestText: (
                    <Box>
                      Search {""}
                      <ValueOption>{getShortHash(value || "")}</ValueOption> in Pools
                    </Box>
                  ),
                  cb: () => {
                    history.push(details.delegation(data?.pool?.poolId));
                  },
                  formatter: getShortHash,
                  value: data.pool && data.pool?.name ? data.pool.name : ""
                };
              }
              return {
                suggestText: (
                  <Box>
                    Search {""}
                    <ValueOption>{getShortHash(value || "")}</ValueOption> in Pools
                  </Box>
                ),
                cb: () =>
                  history.push(routers.DELEGATION_POOLS, {
                    tickerNameSearch: encodeURIComponent((value || "").trim().toLocaleLowerCase())
                  }),
                formatter: getShortHash,
                value: data.pool && data.pool?.name ? data.pool.name : ""
              };
            }
            case "token": {
              if (data.validTokenName) return;
              if (data?.token) {
                setShowOption(false);
                return {
                  suggestText: (
                    <Box>
                      Search {""}
                      <ValueOption>{getShortHash(value || "")}</ValueOption> in Tokens
                    </Box>
                  ),
                  cb: () => history.push(details.token(data?.token?.fingerprint)),
                  formatter: getShortHash,
                  value: data.token && data.token?.name ? data.token?.name : ""
                };
              }

              return {
                suggestText: (
                  <Box>
                    Search {""}
                    <ValueOption>{getShortHash(value || "")}</ValueOption> in Tokens
                  </Box>
                ),
                cb: () =>
                  history.push(
                    `${routers.TOKEN_LIST}?tokenName=${encodeURIComponent((value || "").trim().toLocaleLowerCase())}`
                  ),
                formatter: getShortHash,
                value: data.token && data.token?.name ? data.token?.name : ""
              };
            }
            case "policy":
              return {
                suggestText: "Search for a Policy by",
                cb: () =>
                  history.push(
                    details.nativeScriptDetail(encodeURIComponent((value || "").trim().toLocaleLowerCase()))
                  ),
                formatter: getShortHash
              };
          }
        })
        .filter(Boolean)) ||
    [];

  useEffect(() => {
    if (
      listOptions.length === 0 &&
      isObject(data) &&
      Object.keys(data).length > 0 &&
      filter === "all" &&
      !ADAHandleOption
    ) {
      showResultNotFound();
    }
    if (
      (listOptionsTokensAndPools || []).length === 0 &&
      dataSearchTokensAndPools &&
      (filter === "delegations/pool-detail-header" || filter === "tokens")
    )
      showResultNotFound();
  }, [JSON.stringify(data), JSON.stringify(dataSearchTokensAndPools)]);

  if (filter === "tokens" || filter === "delegations/pool-detail-header") {
    return (
      <OptionsWrapper display={show ? "block" : "none"} home={+home}>
        {!error ? (
          <>
            {(listOptionsTokensAndPools || [])?.map((item, i: number) => {
              return (
                <Option key={i} onClick={() => item?.cb?.()} data-testid="option-search-epoch">
                  <Box>{item?.suggestText} </Box>
                  <GoChevronRight />
                </Option>
              );
            })}
            {listOptionsTokensAndPools && totalResult && totalResult > RESULT_SIZE && (
              <Option
                onClick={() => {
                  setShowOption(false);
                  filter === "tokens"
                    ? history.push(`${routers.TOKEN_LIST}?tokenName=${(value || "").toLocaleLowerCase()}`)
                    : history.push(routers.DELEGATION_POOLS, {
                        tickerNameSearch: (value || "").toLocaleLowerCase()
                      });
                }}
              >
                <Box
                  display="flex"
                  alignItems={"center"}
                  justifyContent="center"
                  width={"100%"}
                  fontSize={"14px"}
                  padding={0}
                  gap="10px"
                  minHeight="34px"
                >
                  See more
                </Box>
              </Option>
            )}
          </>
        ) : (
          <Box component={Option} color={({ palette }) => palette.error[700]} justifyContent={"center"}>
            <Box>{error}</Box>
          </Box>
        )}
      </OptionsWrapper>
    );
  }
  return (
    <OptionsWrapper display={show ? "block" : "none"} home={+home}>
      {!error ? (
        <>
          {listOptions.map((item, i: number) => {
            return (
              <Option key={i} onClick={() => item?.cb?.()} data-testid="option-search-epoch">
                <Box>
                  {item?.suggestText}
                  {typeof item?.suggestText === "string" && (
                    <ValueOption> {item?.formatter?.(item?.value || value) || item?.value || value}</ValueOption>
                  )}
                </Box>
                <GoChevronRight />
              </Option>
            );
          })}
          {ADAHandleOption && (
            <Option
              key="ADAHandleOption"
              data-testid="option-search-epoch"
              onClick={() => {
                if (ADAHandleOption?.stakeAddress) {
                  history.push(details.stake(value));
                } else {
                  history.push(details.address(value));
                }
              }}
            >
              <Box>
                Search {""} <ValueOption>{value.length > 15 ? getShortHash(value) : value || ""}</ValueOption> in ADA
                handle
              </Box>
              <GoChevronRight />
            </Option>
          )}
        </>
      ) : (
        <Box component={Option} color={({ palette }) => palette.error[700]} justifyContent={"center"}>
          <Box>{error}</Box>
        </Box>
      )}
    </OptionsWrapper>
  );
};
