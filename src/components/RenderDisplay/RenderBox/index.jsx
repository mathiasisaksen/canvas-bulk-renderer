import ImageContainer from '@/components/RenderDisplay/RenderBox/ImageContainer';
import api from '@/services/api';
import useUI from '@/store/ui-store';

import React, { useEffect, useState } from 'react'

export default function RenderBox({ seed, renderProgress }) {
  console.log('renderProgress: ', renderProgress);
  const [data, setData] = useState();
  const gridColumns = useUI((state) => state.gridColumns);
  let isLoading = !data;
  const setAspectRatio = useUI((state) => state.setAspectRatio);

  useEffect(() => {
    if (renderProgress !== "finished") return;
    const abortController = new AbortController();
    const start = performance.now();
      api.get(`/api/render/${seed}?`, { signal: abortController.signal }).then(({ data }) => {
        setAspectRatio(data.width / data.height);
        setData(data);
        console.log('Time: ', performance.now() - start);
    });

    return () => {
      abortController.abort();
    }

  }, [seed, renderProgress, setAspectRatio]);

  return (
    <ImageContainer seed={seed} isLoading={isLoading} data={data} gridColumns={gridColumns} />
  )
}



