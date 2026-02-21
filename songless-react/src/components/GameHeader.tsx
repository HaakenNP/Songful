import styled from 'styled-components';
import type { GameMode } from '../types';

const Header = styled.div`
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${p => p.theme.bd};
`;

const MenuBtn = styled.button`
  background: none;
  border: none;
  color: ${p => p.theme.txM};
  font-size: 20px;
  padding: 4px;
  line-height: 1;
`;

const Title = styled.h1`
  font-family: ${p => p.theme.fontMono};
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.theme.wh};

  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ShuffleBtn = styled.button`
  background: none;
  border: 1px solid ${p => p.theme.bd};
  border-radius: 8px;
  color: ${p => p.theme.tx};
  font-size: 13px;
  font-weight: 600;
  padding: 5px 12px;
  transition: background 0.15s;

  &:hover { background: ${p => p.theme.sfL}; }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${p => p.theme.bd};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.theme.txM};
  font-size: 14px;
`;

interface GameHeaderProps {
  mode: GameMode | null;
  onHome: () => void;
  onShuffle: () => void;
}

export default function GameHeader({ mode, onHome, onShuffle }: GameHeaderProps) {
  return (
    <Header>
      <MenuBtn onClick={onHome}>&#9776;</MenuBtn>
      <Title>Songful</Title>
      {mode === 'unlimited' ? (
        <ShuffleBtn onClick={onShuffle}>&#128256; Shuffle</ShuffleBtn>
      ) : (
        <Avatar>&#128100;</Avatar>
      )}
    </Header>
  );
}
