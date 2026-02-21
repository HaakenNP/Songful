import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: ${p => p.theme.bg};
    color: ${p => p.theme.tx};
    font-family: ${p => p.theme.fontBody};
    min-height: 100vh;
    overflow-x: hidden;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input {
    font-family: inherit;
  }
`;

export default GlobalStyles;
