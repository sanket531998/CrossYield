export interface initialSliceState {
  state: "pending" | "fulfilled" | "rejected";
  data: any; // Replace 'any' with a more specific type if possible
}
