import React, { useState } from 'react';
import { StoryWrapper } from './StoryWrapper';

interface InteractiveProps {
  selectedIds?: number[];
  onChange?: (ids: number[]) => void;
}

interface InteractiveStoryProps {
  children: React.ReactElement<InteractiveProps>;
  mockData?: Record<string, any>;
  initialIds?: number[];
}

export const InteractiveStory = ({
  children,
  mockData,
  initialIds = [],
}: InteractiveStoryProps) => {
  const [ids, setIds] = useState(initialIds);

  return (
    <StoryWrapper mockData={mockData}>
      {React.cloneElement(children, {
        selectedIds: ids,
        onChange: (newIds: number[]) => {
          setIds(newIds);
          if (children.props.onChange) {
            children.props.onChange(newIds);
          }
        },
      })}
    </StoryWrapper>
  );
};
