import ImageContainer from '@/components/RenderDisplay/RenderBox/ImageContainer';
import api from '@/services/api';
import useUI from '@/store/ui-store';

import React, { useEffect, useState } from 'react'

export default function RenderBox({ seed, rendererProgress }) {
  const [data, setData] = useState();
  const gridColumns = useUI((state) => state.gridColumns);
  let isLoading = !data;
  const setAspectRatio = useUI((state) => state.setAspectRatio);

  useEffect(() => {
    if (rendererProgress !== "finished") return;
    const abortController = new AbortController();
      api.get(`/api/render/${seed}?`, { signal: abortController.signal }).then(({ data }) => {
        setAspectRatio(data.width / data.height);
        setData(data);
    });

    return () => {
      abortController.abort();
    }

  }, [seed, rendererProgress, setAspectRatio]);

  return (
    <ImageContainer seed={seed} isLoading={isLoading} data={data} gridColumns={gridColumns} />
  )
}



