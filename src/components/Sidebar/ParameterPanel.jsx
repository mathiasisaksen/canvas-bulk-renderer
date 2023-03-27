
import AddParameterPopover from '@/components/Sidebar/AddParameterPopover';
import Parameter from '@/components/Sidebar/Parameter';
import { ButtonGroup, Code, Divider, IconButton, Text, Tooltip, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DeleteIcon } from '@chakra-ui/icons';
import useParameterPanel from '@/store/parameter-panel-store';
import useRenderData from '@/store/render-data-store';
import useUI from '@/store/ui-store';

const defaultParams = [
  { name: "paletteName", value: "Vanilla", type: "string", active: true },
  { name: "stepsize", value: 0.1, type: "number", active: true },
  { name: "addNoise", value: true, type: "boolean", active: true },
  { name: "noiseAmount", value: [0.2, 0.6], type: "range", active: true },
  { 
    name: "noiseType", 
    value: [
      { elementValue: "perlin", active: true },
      { elementValue: "simplex", active: true },
      { elementValue: "worley", active: true },
      { elementValue: "white", active: false }
    ], 
    type: "array", 
    active: true 
  },
]

export default function ParameterPanel() {
  const [internalParameters, setInternalParameters] = useState([]);
  const [parameters, setAll, remove, update, clear] = useParameterPanel((state) => [state.parameterPanel, state.setAll, state.remove, state.update, state.clear]);
  const isRendererEnabled = useRenderData((state) => state.isRendererEnabled());
  const [isFirstLoad, setIsFirstLoad] = useUI((state) => [state.isFirstLoad, state.setIsFirstLoad]);
  
  // To avoid hydration error
  useEffect(() => setInternalParameters(parameters), [parameters]);

  useEffect(() => {
    if (!isFirstLoad) return;
    setAll(defaultParams);
    setIsFirstLoad(false);
  }, []);
https://github.com/mathiasisaksen/canvas-bulk-renderer
  return (
    <VStack gap={4} flex={1} h="100%" maxH="60lvh">
      <ButtonGroup isDisabled={isRendererEnabled} w="100%">
        <AddParameterPopover/>
        <Tooltip label="Clear parameters">
          <IconButton variant="ghost" icon={<DeleteIcon />} onClick={clear} />
        </Tooltip>
      </ButtonGroup>
      <VStack flex={1} w="100%" gap={1} divider={<Divider />} overflowY="scroll" sx={{ "::-webkit-scrollbar": { display: "none" } }}>
        {internalParameters.map((p, i) => <Parameter key={p.name} parameter={p} updateParameter={value => update(i, value)}removeParameter={() => remove(i)}></Parameter>)}
      </VStack>
      <VStack>
        <Text mt="5" w="100%" textAlign="center" fontSize="sm">(The parameters are passed in the URL query parameter <Code>parameters</Code>, see the {'"'}Help{'"'} section for more info)</Text>
      </VStack>
    </VStack>
  )
}
