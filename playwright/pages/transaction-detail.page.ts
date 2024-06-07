import { expect, Page } from "@playwright/test";

export function transactionDetailPage(page: Page) {
  const checkTransactionsDetail = async () => {
    const deatailPageTitle = page.getByTestId("detail.page.title");

    const url = await page.url();
    await expect(deatailPageTitle, "Check title on transaction detail").toHaveText("Transaction Details");
    expect(url, "Check url transaction detail").toContain("/transaction/");
  };

  return { checkTransactionsDetail };
}
