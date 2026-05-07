import React from "react";

interface WebsiteSectionProps {
  id: string;
  isVisible: boolean;
  Screen: React.ComponentType<{
    isVisible: boolean;
    containerRef?: React.RefObject<HTMLDivElement | null>;
  }>;
  setRef: (el: HTMLDivElement | null) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const WebsiteSection = ({
  id,
  isVisible,
  Screen,
  setRef,
  containerRef,
}: WebsiteSectionProps) => (
  <div ref={setRef} id={id}>
    <Screen isVisible={isVisible} containerRef={containerRef} />
  </div>
);

export default WebsiteSection;
