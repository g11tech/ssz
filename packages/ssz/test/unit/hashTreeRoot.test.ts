import {assert, expect} from "chai";
import {describe, it} from "mocha";

import {booleanType, byteType, CompositeType, ContainerType, isCompositeType, ListType, Type} from "../../src";
import {
  ArrayObject,
  ArrayObject2,
  bigint64Type,
  bigint128Type,
  bigint256Type,
  bytes4Type,
  number16Type,
  number32Type,
  number64Type,
  number16List100Type,
  OuterObject,
  SimpleObject,
  UnionObject,
} from "./objects";

describe("hashTreeRoot", () => {
  const testCases: {
    value: any;
    type: Type<any>;
    expected: string;
  }[] = [
    {value: true, type: booleanType, expected: ""},
    {value: false, type: booleanType, expected: ""},
    {value: 0, type: byteType, expected: ""},
    {value: 1, type: byteType, expected: ""},
    {value: 255, type: byteType, expected: ""},
    {value: 2 ** 8, type: number16Type, expected: ""},
    {value: 2 ** 12 - 1, type: number16Type, expected: ""},
    {value: 2 ** 12, type: number16Type, expected: ""},
    {value: 2 ** 16 - 1, type: number16Type, expected: ""},
    {value: 2 ** 16, type: number32Type, expected: ""},
    {value: 2 ** 28 - 1, type: number32Type, expected: ""},
    {value: 2 ** 28, type: number32Type, expected: ""},
    {value: 2 ** 32 - 1, type: number32Type, expected: ""},
    {value: 2 ** 32, type: number64Type, expected: ""},
    {value: 2 ** 52 - 1, type: number64Type, expected: ""},
    {value: 2 ** 32, type: number64Type, expected: ""},
    {value: 2 ** 52 - 1, type: number64Type, expected: ""},
    {value: 0x1n, type: bigint64Type, expected: ""},
    {value: 0x1000000000000000n, type: bigint64Type, expected: ""},
    {value: 0xffffffffffffffffn, type: bigint64Type, expected: ""},
    {value: 0xffffffffffffffffffffffffffffffffn, type: bigint128Type, expected: ""},
    {
      value: 0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffn,
      type: bigint256Type,
      expected: "",
    },
    {value: {b: 0, a: 0}, type: SimpleObject, expected: ""},
    {value: {b: 2, a: 1}, type: SimpleObject, expected: ""},
    {value: {v: 3, subV: {v: 6}}, type: OuterObject, expected: ""},
    {
      value: {
        v: [
          {b: 2, a: 1},
          {b: 4, a: 3},
        ],
      },
      type: ArrayObject,
      expected: "",
    },
    {
      value: [
        {v: 3, subV: {v: 6}},
        {v: 5, subV: {v: 7}},
      ],
      type: ArrayObject2,
      expected: "",
    },
    {value: [], type: number16List100Type, expected: ""},
    {value: [], type: ArrayObject2, expected: ""},
    {value: {selector: 0, value: null}, type: UnionObject, expected: ""},
    {value: {selector: 1, value: {a: 1, b: 2}}, type: UnionObject, expected: ""},
    {value: {selector: 2, value: 1000}, type: UnionObject, expected: ""},
  ];
  for (const {type, value} of testCases) {
    it(`should correctly hash ${type.constructor.name}`, () => {
      const actualStructRoot = Buffer.from(type.hashTreeRoot(value)).toString("hex");
      assert(actualStructRoot);
      if (isCompositeType(type)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const treeBackedActual = (type as CompositeType<any>).createTreeBackedFromStruct(value);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        expect(Buffer.from(treeBackedActual.hashTreeRoot()).toString("hex")).to.be.equal(
          actualStructRoot,
          "TreeBacked root is different from struct root"
        );
      }
    });
  }

  it("should hash active validation indexes correctly as in final_updates_minimal.yaml", () => {
    const validatorIndexes = [];
    for (let i = 0; i < 64; i++) {
      validatorIndexes.push(i);
    }
    const type = new ListType({
      elementType: number64Type,
      // VALIDATOR_REGISTRY_LIMIT
      limit: 1099511627776,
    });
    // This is the logic to calculate activeIndexRoots in processFinalUpdates
    const hash = Buffer.from(type.hashTreeRoot(validatorIndexes)).toString("hex");
    const want = "ba1031ba1a5daab0d49597cfa8664ce2b4c9b4db6ca69fbef51e0a9a325a3b63";
    assert.strictEqual(hash, want, "hash does not match");
  });

  it("should be able to hash inner object as list of basic object", () => {
    const accountBalances: {balances: bigint[]} = {
      balances: [],
    };
    const count = 2;
    for (let i = 0; i < count; i++) {
      accountBalances.balances.push(0x32000000000n);
    }
    const accountBalancesType = new ContainerType({
      fields: {
        balances: new ListType({elementType: bigint64Type, limit: count}),
      },
    });
    const hash = Buffer.from(accountBalancesType.hashTreeRoot(accountBalances)).toString("hex");
    assert(hash);
  });

  it("should have the same result to Prysmatic ssz unit test", () => {
    const previousVersionBuf = Buffer.from("9f41bd5b", "hex");
    const previousVersion = Uint8Array.from(previousVersionBuf);
    const curVersionBuf = Buffer.from("cbb0f1d7", "hex");
    const curVersion = Uint8Array.from(curVersionBuf);
    const fork = {
      previousVersion,
      curVersion,
      epoch: 11971467576204192310n,
    };
    const forkType = new ContainerType({
      fields: {
        previousVersion: bytes4Type,
        curVersion: bytes4Type,
        epoch: bigint64Type,
      },
    });
    const finalHash = Buffer.from(forkType.hashTreeRoot(fork)).toString("hex");
    const want = "3ad1264c33bc66b43a49b1258b88f34b8dbfa1649f17e6df550f589650d34992";
    assert.strictEqual(finalHash, want, "finalHash does not match");
  });
});
