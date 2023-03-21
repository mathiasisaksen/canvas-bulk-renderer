import produce from "immer";
import { create } from "zustand";

const usePageNumber = create((set) => ({
  pageNumber: 1,
 
  set: (value) => set(produce(state => { state.pageNumber = value })),
  increment: () => set(produce(state => { state.pageNumber += 1})),
  decrement: () => set(produce(state => { state.pageNumber -= 1}))
}));

export default usePageNumber;