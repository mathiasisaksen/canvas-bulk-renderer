import produce from "immer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useParameterPanel = create(
  persist(
  (set, get) => ({
    parameterPanel: [],
    modify: (action) => set(produce(action)),
    
    setAll: (array) => get().modify(state => { state.parameterPanel = array }),

    add: (parameter) => get().modify(state => { state.parameterPanel.push({ ...parameter, active: true }) }),
    remove: (index) => get().modify(state => { state.parameterPanel.splice(index, 1) }),
    update: (index, value) => get().modify(state => { state.parameterPanel[index] = value }),
    clear: () => get().modify(state => { state.parameterPanel = [] }),

    getProcessedPanelObject: () => { return processPanelData(get().parameterPanel) }
  }),
  { name: "parameter-panel" }
  ));

function processPanelData(data) {
  const processedData = {};
  data
    .filter(param => param.active)
    .forEach(param => {
      const { name, type, value } = param;

      if (type === "string" || type === "number" || type === "boolean" || type === "range") {
        processedData[name] = value;
      } else if (type === "array") {
        processedData[name] = value.filter(({ active }) => active).map(({ elementValue }) => elementValue);
      } else {
        throw new Error(`Unsupported parameter type "${type}"`);
      }
    });
    
  return processedData;
}

export default useParameterPanel;