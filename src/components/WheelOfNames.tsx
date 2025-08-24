import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Name {
  id: string;
  text: string;
  isIncluded: boolean;
}

interface WheelOfNamesProps {
  names: Name[];
  onWinner: (winner: string) => void;
}

const colors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8E8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];

const WheelOfNames: React.FC<WheelOfNamesProps> = ({ names, onWinner }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const includedNames = names.filter(name => name.isIncluded);

  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (includedNames.length === 0) {
      ctx.fillStyle = '#f0f0f0';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#666';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Add names to spin!', centerX, centerY);
      return;
    }

    const anglePerSegment = (2 * Math.PI) / includedNames.length;

    includedNames.forEach((name, index) => {
      const startAngle = index * anglePerSegment + rotation;
      const endAngle = (index + 1) * anglePerSegment + rotation;

      ctx.fillStyle = colors[index % colors.length];
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      const textAngle = startAngle + anglePerSegment / 2;
      const textX = centerX + Math.cos(textAngle) * (radius * 0.7);
      const textY = centerY + Math.sin(textAngle) * (radius * 0.7);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(name.text, 0, 0);
      ctx.restore();
    });

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX - 15, centerY - radius - 5);
    ctx.lineTo(centerX + 15, centerY - radius - 5);
    ctx.closePath();
    ctx.fill();
  }, [includedNames, rotation]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const spinWheel = () => {
    if (includedNames.length === 0 || isSpinning) return;

    setIsSpinning(true);
    const spinDuration = 3000;
    const minSpins = 5;
    const maxSpins = 10;
    const spins = minSpins + Math.random() * (maxSpins - minSpins);
    const finalRotation = spins * 2 * Math.PI + Math.random() * 2 * Math.PI;

    const startTime = Date.now();
    const startRotation = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / spinDuration, 1);
      
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentRotation = startRotation + finalRotation * easeOut;
      
      setRotation(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        determineWinner(currentRotation);
      }
    };

    animate();
  };

  const determineWinner = (finalRotation: number) => {
    const normalizedRotation = ((2 * Math.PI - (finalRotation % (2 * Math.PI))) + Math.PI / 2) % (2 * Math.PI);
    const anglePerSegment = (2 * Math.PI) / includedNames.length;
    const winnerIndex = Math.floor(normalizedRotation / anglePerSegment);
    const winner = includedNames[winnerIndex];
    
    if (winner) {
      onWinner(winner.text);
    }
  };

  return (
    <div className="wheel-container">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="wheel-canvas"
      />
      <button
        onClick={spinWheel}
        disabled={includedNames.length === 0 || isSpinning}
        className={`spin-button ${isSpinning ? 'spinning' : ''}`}
      >
        {isSpinning ? 'Spinning...' : 'SPIN'}
      </button>
    </div>
  );
};

export default WheelOfNames;