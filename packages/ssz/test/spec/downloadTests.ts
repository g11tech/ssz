import {downloadTests} from "@chainsafe/lodestar-spec-test-util";
import {SPEC_TEST_LOCATION, SPEC_TEST_VERSION, SPEC_TEST_REPO_URL, SPEC_TEST_TO_DOWNLOAD} from "./specTestCases";

/* eslint-disable no-console */

downloadTests(
  {
    specVersion: SPEC_TEST_VERSION,
    outputDir: SPEC_TEST_LOCATION,
    specTestsRepoUrl: SPEC_TEST_REPO_URL,
    testsToDownload: SPEC_TEST_TO_DOWNLOAD,
  },
  console.log
).catch((e) => {
  console.error(e);
  process.exit(1);
});
