import { useGlobalState } from "@/context/GlobalProvider";

export default function useParameterPanelData() {
  const [parameterPanelData] = useGlobalState("parameterPanelData", []);
  return processPanelData(parameterPanelData);
}

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