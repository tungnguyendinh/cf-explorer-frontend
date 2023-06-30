import { screen } from "@testing-library/react";
import { useSelector } from "react-redux";

import { render } from "src/test-utils";
import useFetchList from "src/commons/hooks/useFetchList";

import Dashboard from ".";

const mockData = {
  data: [
    {
      stakeKeyReportId: 331,
      poolReportId: null,
      createdAt: "2023/05/31 08:26:40",
      reportName: "report name test",
      status: "EXPIRED",
      type: "STAKE_KEY"
    }
  ],
  total: 100
};

jest.mock("src/commons/hooks/useFetchList");
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useSelector: jest.fn()
}));
describe("StakingLifecycle page", () => {
  beforeEach(() => {
    (useSelector as jest.Mock).mockReturnValue({
      userData: {}
    });
  });
  it("should render dashboard page", async () => {
    const mockUseFetch = useFetchList as jest.Mock;
    await mockUseFetch.mockReturnValue({ data: [] });
    render(<Dashboard />);
    screen.getByText(/saved reports/i);
    expect(useFetchList).toBeCalled();
  });

  it("should component render after logining", async () => {
    const mockUseFetchList = useFetchList as jest.Mock;
    mockUseFetchList.mockReturnValue(mockData);
    render(<Dashboard />);
    screen.logTestingPlaygroundURL();
    expect(screen.getByText(/Showing 100 results/i)).toBeInTheDocument();
  });

  it("should show correct data in table", async () => {
    const mockUseFetchList = useFetchList as jest.Mock;
    mockUseFetchList.mockReturnValue(mockData);
    render(<Dashboard />);
    expect(screen.getByText(/EXPIRED/i)).toBeInTheDocument();
  });
});
