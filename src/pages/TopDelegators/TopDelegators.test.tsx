import { render, screen } from "src/test-utils";
import useFetchList from "src/commons/hooks/useFetchList";
import { formatADAFull, getShortWallet } from "src/commons/utils/helper";

import TopDelegators from "./index";

const mockedData = [
  {
    stakeKey: "stake1uydpj0spk3jx6n9kchpdtzlgqwq59rzedqy86nk82q7ug8gy45mdu",
    balance: 72234347854646,
    poolId: "pool19hrn8me383w9atvmjwukjxqsdvr8udpmyxau956hdc53x669j8p",
    poolName: "wavepool.digital",
    tickerName: "WAV11"
  },
  {
    stakeKey: "stake1uy88uenysztnswv6u3cssgpamztc25q5wea703rnp50s4qq0ddctn",
    balance: 71271115091988,
    poolId: "pool10kya8ug3wr6cwnzm0qdcppjtuwfwmnvusu2uenscz4dg7pl07qv",
    poolName: "wavepool.digital",
    tickerName: "WAV2"
  }
];

jest.mock("src/commons/hooks/useFetchList");

describe("TopDelegators Component", () => {
  beforeEach(() => {
    const mockedUseFetch = useFetchList as jest.Mock;
    mockedUseFetch.mockReturnValue({
      data: mockedData,
      loading: false,
      error: null,
      initialized: true,
      total: 2,
      totalPage: 1,
      currentPage: 1
    });
  });
  it("rendering component on PC", () => {
    render(<TopDelegators />);
    expect(screen.getByText(/last update/i)).toBeInTheDocument();
    expect(screen.getByText("Top delegators")).toBeInTheDocument();
    expect(screen.getByText(/per page/i)).toBeInTheDocument();
  });

  it("rendering with Data", () => {
    render(<TopDelegators />);
    const data = mockedData[0];
    expect(screen.getByText(getShortWallet(data.stakeKey))).toBeInTheDocument();
    expect(screen.getByText(formatADAFull(data.balance))).toBeInTheDocument();
  });

  it("rendering with error", () => {
    const mockedUseFetch = useFetchList as jest.Mock;
    mockedUseFetch.mockReturnValue({
      data: [],
      loading: false,
      error: true,
      initialized: true,
      total: 2,
      totalPage: 1,
      currentPage: 1
    });

    render(<TopDelegators />);
    expect(screen.getByAltText(/no data/i)).toBeInTheDocument();
  });
});
