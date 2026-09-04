import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getFaviconUrl } from '~/entrypoints/common/utils/favicon';
import faviconDefaultImage from '/icon/favicon-default.png';

const StyledFavicon = styled.img<{ $size?: number }>`
  flex: 0 0 ${props => props.$size}px;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  border-radius: 4px;
  background: var(--nt-surface-muted);
  object-fit: contain;
`;

export default function Favicon({
  pageUrl,
  favIconUrl,
  size = 16,
}: {
  pageUrl: string;
  favIconUrl?: string;
  size?: number;
}) {
  const [renderUrl, setRenderUrl] = useState(faviconDefaultImage);

  const handleError = () => {
    // console.log('handleError');
    setRenderUrl(faviconDefaultImage);
  };

  useEffect(() => {
    let cancelled = false;

    const loadFavicon = async () => {
      if (!pageUrl?.trim?.()) {
        if (!cancelled) setRenderUrl(faviconDefaultImage);
        return;
      }

      const url = favIconUrl || getFaviconUrl(pageUrl);
      if (!cancelled) setRenderUrl(url || faviconDefaultImage);
    };

    loadFavicon();
    return () => {
      cancelled = true;
    };
  }, [pageUrl, favIconUrl]);

  return (
    <StyledFavicon
      className="img-favicon"
      src={renderUrl}
      $size={size}
      loading="lazy"
      decoding="async"
      onError={handleError}
    />
  );
}
