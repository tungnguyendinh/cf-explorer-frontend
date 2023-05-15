import { Container } from "@mui/material";
import ReportGeneratedTabs, { TabsItem } from "../../components/ReportGeneratedTabs";
import StakekeySummary from "../../components/StakekeySummary";
import PoolLifecycle from "../../components/PoolLifecycle";

export const defaultReportTab = "stake";

const tabItems: TabsItem[] = [
  {
    value: "stake",
    label: "Stake Key summary",
    component: <StakekeySummary />
  },
  {
    value: "pool",
    label: "Pool lifecycle",
    component: <PoolLifecycle />
  }
];
const ReportGenerated = () => {
  return (
    <Container>
      <ReportGeneratedTabs tabsItem={tabItems} />
    </Container>
  );
};

export default ReportGenerated;
