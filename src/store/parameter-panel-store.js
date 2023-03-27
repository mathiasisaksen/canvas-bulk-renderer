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
    isNameAvailable: (newName) => !get().parameterPanel.some(({ name }) => newName === name),

    getProcessedPanelObject: () => { return processPanelData(get().parameterPanel) }
  }),
  { name: "parameter-panel" }
  ));

function processPanelData(data) {
  const processedData = {};
  data
    .filter(param => param.active)
    .forEach(param => {
      let { name, type, value } = param;
      
      if (type === "string" || type === "boolean") {
      } else if (type === "number") {
        value = parseFloat(value);
      } else if (type === "range") {
        value = value.map(parseFloat);
      } else if (type === "array") {
        value = value.filter(({ active }) => active).map(({ elementValue }) => elementValue);
      } else {
        throw new Error(`Unsupported parameter type "${type}"`);
      }
      processedData[name] = value;
    });
    
  return processedData;
}

export default useParameterPanel;