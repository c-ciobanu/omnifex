import { render } from "@redwoodjs/testing/web";

import SearchBooksPage from "./SearchBooksPage";

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe("SearchBooksPage", () => {
  it("renders successfully", () => {
    expect(() => {
      render(<SearchBooksPage />);
    }).not.toThrow();
  });
});
