import {ContainerType} from "../../../src";

import * as phase0 from "../phase0/types";
import * as altair from "../altair/types";

// Re-export union types for types that are _known_ to differ

export type BeaconBlockBody = phase0.BeaconBlockBody | altair.BeaconBlockBody;
export type BeaconBlock = phase0.BeaconBlock | altair.BeaconBlock;
export type SignedBeaconBlock = phase0.SignedBeaconBlock | altair.SignedBeaconBlock;
export type BeaconState = phase0.BeaconState | altair.BeaconState;
export type Metadata = phase0.Metadata | altair.Metadata;

/**
 * Types known to change between forks
 */
export type AllForksTypes = {
  BeaconBlockBody: BeaconBlockBody;
  BeaconBlock: BeaconBlock;
  SignedBeaconBlock: SignedBeaconBlock;
  BeaconState: BeaconState;
  Metadata: Metadata;
};

/**
 * SSZ Types known to change between forks
 */
export type AllForksSSZTypes = {
  BeaconBlockBody: ContainerType<BeaconBlockBody>;
  BeaconBlock: ContainerType<BeaconBlock>;
  SignedBeaconBlock: ContainerType<SignedBeaconBlock>;
  BeaconState: ContainerType<BeaconState>;
  Metadata: ContainerType<Metadata>;
};
