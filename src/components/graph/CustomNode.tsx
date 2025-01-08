import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface CustomNodeProps {
  data: {
    label: string;
  };
}

function CustomNode({ data }: CustomNodeProps) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-primary">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="font-bold">{data.label}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(CustomNode);