'use client';

const { createGlobalStyle } = require("styled-components")

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    justify-items: center;
    font-family: sans-serif;
  }

  * {
    box-sizing: border-box;
  }
`;

export default GlobalStyle;