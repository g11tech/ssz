/* eslint-disable @typescript-eslint/naming-convention */
import {ForkName} from "@chainsafe/lodestar-params";

import {AllForksSSZTypes} from "./types";
import * as phase0 from "../phase0/sszTypes";
import * as altair from "../altair/sszTypes";

/**
 * Index the ssz types that differ by fork
 * A record of AllForksSSZTypes indexed by fork
 */
export const allForks: {[K in ForkName]: AllForksSSZTypes} = {
  phase0: {
    BeaconBlockBody: phase0.BeaconBlockBody as AllForksSSZTypes["BeaconBlockBody"],
    BeaconBlock: phase0.BeaconBlock as AllForksSSZTypes["BeaconBlock"],
    SignedBeaconBlock: phase0.SignedBeaconBlock as AllForksSSZTypes["SignedBeaconBlock"],
    BeaconState: phase0.BeaconState as AllForksSSZTypes["BeaconState"],
    Metadata: phase0.Metadata,
  },
  altair: {
    BeaconBlockBody: altair.BeaconBlockBody as AllForksSSZTypes["BeaconBlockBody"],
    BeaconBlock: altair.BeaconBlock as AllForksSSZTypes["BeaconBlock"],
    SignedBeaconBlock: altair.SignedBeaconBlock as AllForksSSZTypes["SignedBeaconBlock"],
    BeaconState: altair.BeaconState as AllForksSSZTypes["BeaconState"],
    Metadata: altair.Metadata as AllForksSSZTypes["Metadata"],
  },
};
