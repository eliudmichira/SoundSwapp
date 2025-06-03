// src/components/ui/MorphingBlob.tsx
import React from 'react';

interface MorphingBlobProps {
  color: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  size: number;
  animationDuration?: number;
}

export const MorphingBlob: React.FC<MorphingBlobProps> = ({
  color,
  position,
  size,
  animationDuration = 20
}) => {
  const positionStyle = {
    ...position,
    width: `${size}px`,
    height: `${size}px`
  };
  
  return (
    <div 
      className="absolute blur-3xl"
      style={{
        ...positionStyle,
        background: color,
        borderRadius: "40% 60% 60% 40% / 60% 30% 70% 40%",
        animation: `morph ${animationDuration}s ease-in-out infinite alternate`
      }}
    >
      <style>
        {`
          @keyframes morph {
            0% {
              border-radius: 40% 60% 60% 40% / 60% 30% 70% 40%;
              transform: translate(0, 0) rotate(0deg);
            }
            100% {
              border-radius: 40% 60% 30% 70% / 50% 60% 30% 60%;
              transform: translate(20px, 20px) rotate(15deg);
            }
          }
        `}
      </style>
    </div>
  );
};