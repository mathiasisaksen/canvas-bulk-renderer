import hasValue from "@/utils/has-value";
import produce from "immer";
import { create } from "zustand";
import { persist } from 'zustand/middleware';

const useConfig = create(
  persist(
    (set) => ({
      config: {},
      setConfigValue: (name, value) => set(produce(state => {
        state.config[name] = hasValue(value) ? value : undefined;
      })),
      clear: () => set(produce(state => { state.config = {}; }))
    }),
    { name: "config" }
));

export default useConfig;