import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import type { Song } from '../types';

const Wrapper = styled.div`
  flex: 1;
  position: relative;
`;

const Suggestions = styled.div<{ $open: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 0;
  right: 0;
  background: ${p => p.theme.sf};
  border-radius: 10px 10px 0 0;
  border: 1px solid ${p => p.theme.bd};
  border-bottom: none;
  max-height: 320px;
  overflow-y: auto;
  z-index: 20;
  box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.6);
  display: ${p => p.$open ? 'block' : 'none'};
`;

const SugButton = styled.button<{ $highlighted: boolean }>`
  width: 100%;
  padding: 11px 14px;
  background: ${p => p.$highlighted ? p.theme.sfL : 'none'};
  border: none;
  border-bottom: 1px solid ${p => p.theme.bd};
  color: ${p => p.theme.tx};
  font-size: 14px;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: background 0.1s;

  &:last-child { border-bottom: none; }
  &:hover { background: ${p => p.theme.sfL}; }

  @media (max-width: 480px) {
    padding: 10px 12px;
    font-size: 13px;
  }
`;

const Artist = styled.span`
  font-weight: 700;
`;

const Dash = styled.span`
  color: ${p => p.theme.txM};
`;

const InputBar = styled.div<{ $hasSuggestions: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 12px;
  border-radius: ${p => p.$hasSuggestions ? '0 0 10px 10px' : '10px'};
  border: 1px solid ${p => p.theme.bd};
  background: ${p => p.theme.sf};
  height: 44px;

  @media (max-width: 480px) {
    height: 40px;
  }
`;

const SearchIcon = styled.span`
  color: ${p => p.theme.txM};
  font-size: 14px;
`;

const Input = styled.input`
  flex: 1;
  background: none;
  border: none;
  color: ${p => p.theme.wh};
  font-size: 14px;
  outline: none;

  &::placeholder { color: ${p => p.theme.txM}; }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

interface SearchInputProps {
  query: string;
  matches: Song[];
  highlightIndex: number;
  isOpen: boolean;
  onInputChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSelect: (title: string) => void;
  onClose: () => void;
}

export default function SearchInput({
  query, matches, highlightIndex, isOpen,
  onInputChange, onKeyDown, onSelect, onClose
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const sugRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sugRef.current && !sugRef.current.contains(e.target as Node) && e.target !== inputRef.current) {
        onClose();
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [onClose]);

  // Scroll highlighted into view
  useEffect(() => {
    if (highlightIndex >= 0 && sugRef.current) {
      const btns = sugRef.current.querySelectorAll('button');
      if (btns[highlightIndex]) {
        btns[highlightIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightIndex]);

  return (
    <Wrapper>
      <Suggestions ref={sugRef} $open={isOpen}>
        {matches.map((m, i) => (
          <SugButton
            key={`${m.title}-${m.artist}`}
            $highlighted={i === highlightIndex}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(m.title);
            }}
          >
            <span>{m.title}</span>
            <Dash>{'\u2013'}</Dash>
            <Artist>{m.artist}</Artist>
          </SugButton>
        ))}
      </Suggestions>
      <InputBar $hasSuggestions={isOpen}>
        <SearchIcon>&#128269;</SearchIcon>
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for a song..."
          autoComplete="off"
          value={query}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => {
            if (query.trim()) onInputChange(query);
          }}
        />
      </InputBar>
    </Wrapper>
  );
}
