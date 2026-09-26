import React from 'react';

interface ShimmerProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: string;
  style?: React.CSSProperties;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  className = '',
  width,
  height,
  rounded = 'rounded-lg',
  style = {},
}) => {
  const inlineStyles: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      style={inlineStyles}
      className={`bg-[#172219] ${rounded} animate-shimmer ${className}`}
      aria-hidden="true"
    />
  );
};

// Convenient preset skeleton for plant cards in Dashboard
export const ShimmerPlantCard: React.FC = () => {
  return (
    <div className="bg-[#0E1410] rounded-2xl border border-[#1E2B20] p-4 shadow-lg space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <Shimmer className="w-10 h-10 rounded-xl shrink-0" />
          <div className="space-y-1.5">
            <Shimmer className="w-28 h-4 rounded-md" />
            <Shimmer className="w-20 h-3 rounded-md" />
          </div>
        </div>
        <Shimmer className="w-4 h-4 rounded" />
      </div>

      <div className="flex justify-between items-center py-1">
        <Shimmer className="w-16 h-3 rounded" />
        <Shimmer className="w-24 h-3 rounded" />
      </div>

      <div className="bg-[#121A13] rounded-lg p-2.5 border border-[#1E2B20] space-y-2">
        <div className="flex justify-between">
          <Shimmer className="w-24 h-2.5 rounded" />
          <Shimmer className="w-8 h-2.5 rounded" />
        </div>
        <Shimmer className="w-full h-2 rounded-full" />
      </div>

      <div className="pt-2 border-t border-[#1C281E] flex justify-between items-center">
        <Shimmer className="w-28 h-3 rounded" />
        <Shimmer className="w-20 h-3 rounded" />
      </div>
    </div>
  );
};

// Convenient preset skeleton for scan history items in PlantDetailModal
export const ShimmerScanHistoryItem: React.FC = () => {
  return (
    <div className="bg-[#121A13] rounded-xl p-4 border border-[#223224] flex flex-col sm:flex-row gap-4 items-start">
      <Shimmer className="w-32 h-24 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2.5 w-full">
        <div className="flex justify-between">
          <Shimmer className="w-36 h-4 rounded-md" />
          <Shimmer className="w-16 h-4 rounded-md" />
        </div>
        <Shimmer className="w-48 h-3 rounded-md" />
        <Shimmer className="w-full h-3 rounded-md" />
        <Shimmer className="w-3/4 h-3 rounded-md" />
      </div>
    </div>
  );
};
