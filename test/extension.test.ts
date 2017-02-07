import * as assert from "assert";
import { Utility } from "../src/utility";

suite("utility Tests", () => {
    test("getUriOfActiveEditor", () => {
        let result = Utility.getUriOfActiveEditor();
        assert.equal("localhost:8080", result.authority);
    });
});
